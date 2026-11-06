import * as THREE from "three";
import { DEFAULT_PLAYER_CONFIG, PlayerMovementConfig, PlayerState } from "./PlayerTypes";
import { PlayerController } from "./PlayerController";
import { InputManager } from "../input/InputManager";

export class Player {
  public state: PlayerState;
  public config: PlayerMovementConfig;
  public mesh: THREE.Group;

  private bodyMesh: THREE.Mesh;
  private visorMesh: THREE.Mesh;

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
    };

    this.mesh = new THREE.Group();

    // Player body (capsule/box placeholder)
    const bodyGeo = new THREE.BoxGeometry(0.9, 1.4, 0.4);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xff8408, // Theme orange
      roughness: 0.3,
      metalness: 0.2,
    });
    this.bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    this.bodyMesh.position.y = 0.7; // Pivot at feet
    this.mesh.add(this.bodyMesh);

    // Front/facing visor indicator
    const visorGeo = new THREE.BoxGeometry(0.3, 0.25, 0.45);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0xf5deb3, // Wheat
      emissive: 0xffa500,
      emissiveIntensity: 0.4,
    });
    this.visorMesh = new THREE.Mesh(visorGeo, visorMat);
    this.visorMesh.position.set(0.35, 1.0, 0);
    this.mesh.add(this.visorMesh);

    this.updateMeshTransform();
  }

  public update(input: InputManager, dt: number, groundY: number): void {
    PlayerController.update(this.state, this.config, input, dt, groundY);
    this.updateMeshTransform();
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
    this.updateMeshTransform();
  }

  private updateMeshTransform(): void {
    this.mesh.position.set(this.state.position.x, this.state.position.y, 0);

    // Flip visor based on facing
    this.visorMesh.position.x = this.state.facing * 0.35;

    // Slight squash/stretch or tilt effect when dashing
    if (this.state.isDashing) {
      this.mesh.scale.set(1.3, 0.7, 1);
    } else {
      this.mesh.scale.set(1, 1, 1);
    }
  }

  public dispose(): void {
    this.bodyMesh.geometry.dispose();
    (this.bodyMesh.material as THREE.Material).dispose();
    this.visorMesh.geometry.dispose();
    (this.visorMesh.material as THREE.Material).dispose();
  }
}
