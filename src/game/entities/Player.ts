import * as THREE from "three";
import { DEFAULT_PLAYER_CONFIG, PlayerMovementConfig, PlayerState } from "./PlayerTypes";
import { PlayerController } from "./PlayerController";
import { InputManager } from "../input/InputManager";
import { PlatformBox, GrappleAnchor } from "../world/CityTypes";

export class Player {
  public state: PlayerState;
  public config: PlayerMovementConfig;
  public mesh: THREE.Group;

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

    // Player body
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

    // Glowing Neon Hookshot Web Line (Multi-segment curve for elasticity & slack)
    // Kept in world coordinates (added directly to scene in SceneManager)
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

  public update(
    input: InputManager,
    dt: number,
    groundY: number,
    platforms: PlatformBox[] = [],
    anchors: GrappleAnchor[] = []
  ): void {
    PlayerController.update(this.state, this.config, input, dt, groundY, platforms, anchors);
    this.updateMeshTransform();
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

  private updateMeshTransform(): void {
    this.mesh.position.set(this.state.position.x, this.state.position.y, 0);

    this.visorMesh.position.x = this.state.facing * 0.35;

    // Visual tilt while swinging
    if (this.state.grapple.isHooked) {
      const dx = this.state.position.x - this.state.grapple.anchorX;
      const dy = this.state.position.y - this.state.grapple.anchorY;
      const angle = Math.atan2(dx, -dy);
      this.mesh.rotation.z = -angle * 0.8;
      this.mesh.scale.set(1.1, 0.9, 1);
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
