import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DEFAULT_PLAYER_CONFIG, PlayerMovementConfig, PlayerState } from "./PlayerTypes";
import { PlayerController } from "./PlayerController";
import { InputManager } from "../input/InputManager";
import { PlatformBox, GrappleAnchor } from "../world/CityTypes";

export class Player {
  public state: PlayerState;
  public config: PlayerMovementConfig;
  public mesh: THREE.Group;

  // Custom 3D character mesh container (Cyberpunk Ninja)
  private characterModel: THREE.Group | null = null;
  private walkTime: number = 0;

  // Fallback box components (shown until Cyberpunk Ninja loads)
  private bodyMesh: THREE.Mesh;
  private visorMesh: THREE.Mesh;

  // Web / Hookshot visual line (lives in world space to avoid player rotation distortion)
  public ropeLine: THREE.Line;
  private ropePositions: Float32Array;

  constructor(initialX: number = 0, initialY: number = 0) {
    this.config = { ...DEFAULT_PLAYER_CONFIG };
    this.state = {
      position: { x: initialX, y: initialY },
      velocity: { x: 0, y: 0 },
      grounded: true,
      facing: 1,
      isDashing: false,
      dashTimeRemaining: 0,
      dashCooldownRemaining: 0,
      coyoteTimeRemaining: 0,
      jumpBufferRemaining: 0,
      grapple: {
        isHooked: false,
        anchorX: 0,
        anchorY: 0,
        restLength: 0,
        currentLength: 0,
        tension: 1.0,
        isFlying: false,
        flyProgress: 0,
        hookTipX: 0,
        hookTipY: 0,
        selectedAnchorId: null,
        manualOverrideTimer: 0,
      },
    };

    this.mesh = new THREE.Group();

    // Placeholder player body (fallback while model loads)
    const bodyGeo = new THREE.BoxGeometry(0.9, 1.4, 0.4);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xff8408,
      roughness: 0.3,
      metalness: 0.2,
    });
    this.bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    this.bodyMesh.position.y = 0.7;
    this.mesh.add(this.bodyMesh);

    // Visor indicator
    const visorGeo = new THREE.BoxGeometry(0.3, 0.25, 0.45);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0xf5deb3,
      emissive: 0xffa500,
      emissiveIntensity: 0.4,
    });
    this.visorMesh = new THREE.Mesh(visorGeo, visorMat);
    this.visorMesh.position.set(0.35, 1.0, 0);
    this.mesh.add(this.visorMesh);

    // Load Cyberpunk Ninja 3D model
    this.loadCharacterModel();

    // Glowing Neon Hookshot Web Line (Multi-segment curve for elasticity & slack)
    const segmentCount = 12;
    this.ropePositions = new Float32Array(segmentCount * 3);
    const ropeGeo = new THREE.BufferGeometry();
    ropeGeo.setAttribute("position", new THREE.BufferAttribute(this.ropePositions, 3));
    const ropeMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 2,
      transparent: true,
      opacity: 0.9,
    });
    this.ropeLine = new THREE.Line(ropeGeo, ropeMat);
    this.ropeLine.frustumCulled = false;
    this.ropeLine.visible = false;

    this.updateMeshTransform();
  }

  private loadCharacterModel(): void {
    const loader = new GLTFLoader();
    loader.load(
      "/models/cyberpunk_ninja.glb",
      (gltf) => {
        const model = gltf.scene;

        // Apply stylish materials and shadow properties
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = 0.4;
              child.material.metalness = 0.3;
            }
          }
        });

        // Compute model bounding box to scale properly to standard player height (approx 1.6 units)
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const targetHeight = 1.6;
        const scale = size.y > 0 ? targetHeight / size.y : 1.0;

        model.scale.set(scale, scale, scale);
        // Align model horizontally at center and base flush at y = 0
        model.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);

        const container = new THREE.Group();
        container.add(model);

        this.characterModel = container;
        this.mesh.add(container);

        // Hide fallback box meshes now that Cyberpunk Ninja has loaded
        this.bodyMesh.visible = false;
        this.visorMesh.visible = false;
      },
      undefined,
      (err) => {
        console.warn("Failed to load cyberpunk ninja model, using fallback mesh:", err);
      }
    );
  }

  public update(
    input: InputManager,
    dt: number,
    groundY: number,
    platforms: PlatformBox[] = [],
    anchors: GrappleAnchor[] = []
  ): void {
    PlayerController.update(this.state, this.config, input, dt, groundY, platforms, anchors);
    this.updateMeshTransform(dt);
    this.updateRope();
  }

  public reset(x: number = 0, y: number = 0): void {
    this.state.position.x = x;
    this.state.position.y = y;
    this.state.velocity.x = 0;
    this.state.velocity.y = 0;
    this.state.grounded = true;
    this.state.facing = 1;
    this.state.isDashing = false;
    this.state.dashTimeRemaining = 0;
    this.state.dashCooldownRemaining = 0;
    this.state.coyoteTimeRemaining = 0;
    this.state.jumpBufferRemaining = 0;
    this.state.grapple.isHooked = false;
    this.state.grapple.isFlying = false;
    this.state.grapple.flyProgress = 0;
    this.state.grapple.selectedAnchorId = null;
    this.state.grapple.manualOverrideTimer = 0;
    this.updateMeshTransform();
    this.updateRope();
  }

  private updateRope(): void {
    const isVisible = this.state.grapple.isHooked || this.state.grapple.isFlying;

    if (isVisible) {
      this.ropeLine.visible = true;

      // Start: player hand position in world space
      // Hand offset accounts for player mesh position and facing
      const startX = this.state.position.x + this.state.facing * 0.25;
      const startY = this.state.position.y + 1.0;

      // End: tip position in world space (either in-flight or locked to anchor point at world Z = 0.5)
      const endX = this.state.grapple.isHooked
        ? this.state.grapple.anchorX
        : this.state.grapple.hookTipX;

      const endY = this.state.grapple.isHooked
        ? this.state.grapple.anchorY
        : this.state.grapple.hookTipY;

      const endZ = 0.5;

      // Calculate catenary sag / limp when rope is not under full tension
      let sag = 0;
      if (this.state.grapple.isHooked) {
        if (this.state.grapple.tension < 1.0) {
          // Slack ratio increases droop as rope becomes looser
          const slackRatio = 1.0 - this.state.grapple.tension;
          sag = Math.min(2.5, slackRatio * 3.5);
        }
      }

      // Populate multi-segment curve with elastic sag
      const segmentCount = 12;
      for (let i = 0; i < segmentCount; i++) {
        const t = i / (segmentCount - 1);
        const curX = THREE.MathUtils.lerp(startX, endX, t);

        // Parabolic droop formula: 4 * t * (1 - t) gives maximum at center (t = 0.5)
        const droop = sag * (4 * t * (1 - t));
        const curY = THREE.MathUtils.lerp(startY, endY, t) - droop;

        const idx = i * 3;
        this.ropePositions[idx] = curX;
        this.ropePositions[idx + 1] = curY;
        this.ropePositions[idx + 2] = endZ;
      }

      // Visual color feedback based on tension (stretched = vibrant cyan-white; limp = soft blue)
      const mat = this.ropeLine.material as THREE.LineBasicMaterial;
      if (this.state.grapple.isHooked) {
        if (this.state.grapple.tension >= 1.0) {
          mat.color.setHex(0xe0f2fe); // Bright electric cyan-white when tense
          mat.opacity = 1.0;
        } else {
          mat.color.setHex(0x0284c7); // Darker blue when limp / slack
          mat.opacity = 0.75;
        }
      } else {
        mat.color.setHex(0x38bdf8);
        mat.opacity = 0.9;
      }

      this.ropeLine.geometry.attributes.position.needsUpdate = true;
    } else {
      this.ropeLine.visible = false;
    }
  }

  private updateMeshTransform(dt: number = 0.016): void {
    this.mesh.position.set(this.state.position.x, this.state.position.y, 0);

    this.visorMesh.position.x = this.state.facing * 0.35;

    // Smooth model orientation facing direction
    if (this.characterModel) {
      // Facing 1 is facing right (+X), facing -1 is facing left (-X)
      const targetRotationY = this.state.facing > 0 ? Math.PI / 2 : -Math.PI / 2;
      this.characterModel.rotation.y = THREE.MathUtils.lerp(
        this.characterModel.rotation.y,
        targetRotationY,
        Math.min(1, 20 * dt)
      );

      // Procedural running / jumping / swinging animations
      const isMovingHoriz = Math.abs(this.state.velocity.x) > 0.4 && this.state.grounded;
      if (isMovingHoriz) {
        // Run bounce & stride sway
        this.walkTime += dt * 14;
        const bob = Math.abs(Math.sin(this.walkTime)) * 0.12;
        const tilt = Math.sin(this.walkTime) * 0.08;
        this.characterModel.position.y = bob;
        this.characterModel.rotation.z = -tilt * this.state.facing;
        // Lean forward into the run
        this.characterModel.rotation.x = 0.18;
      } else if (!this.state.grounded && !this.state.grapple.isHooked) {
        // Airborne jump / fall posture: slight backward lean while ascending, forward when falling
        this.walkTime = 0;
        this.characterModel.position.y = 0;
        const airLean = this.state.velocity.y > 0 ? -0.15 : 0.2;
        this.characterModel.rotation.x = airLean;
        this.characterModel.rotation.z = 0;
      } else if (this.state.grapple.isHooked) {
        // Web swing posture
        this.walkTime = 0;
        this.characterModel.position.y = 0;
        this.characterModel.rotation.x = -0.25; // Reaching up / forward
        this.characterModel.rotation.z = 0;
      } else {
        // Idle breathing bob
        this.walkTime += dt * 3;
        const breathe = Math.sin(this.walkTime) * 0.03;
        this.characterModel.position.y = breathe;
        this.characterModel.rotation.x = 0;
        this.characterModel.rotation.z = 0;
      }
    }

    // Visual tilt while swinging
    if (this.state.grapple.isHooked) {
      const dx = this.state.position.x - this.state.grapple.anchorX;
      const dy = this.state.position.y - this.state.grapple.anchorY;
      const angle = Math.atan2(dx, -dy);
      this.mesh.rotation.z = -angle * 0.8;
      this.mesh.scale.set(1.05, 0.95, 1);
    } else {
      this.mesh.rotation.z = 0;
      if (this.state.isDashing) {
        this.mesh.scale.set(1.3, 0.7, 1);
      } else {
        this.mesh.scale.set(1, 1, 1);
      }
    }
  }

  public dispose(): void {
    this.bodyMesh.geometry.dispose();
    (this.bodyMesh.material as THREE.Material).dispose();
    this.visorMesh.geometry.dispose();
    (this.visorMesh.material as THREE.Material).dispose();
    this.ropeLine.geometry.dispose();
    (this.ropeLine.material as THREE.Material).dispose();
  }
}
