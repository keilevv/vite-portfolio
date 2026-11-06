import * as THREE from "three";

export class CameraController {
  public camera: THREE.OrthographicCamera;
  private aspect: number = 1;
  private readonly frustumSize: number = 14;

  constructor(width: number, height: number) {
    this.aspect = width / height;
    const halfH = this.frustumSize / 2;
    const halfW = halfH * this.aspect;

    this.camera = new THREE.OrthographicCamera(
      -halfW,
      halfW,
      halfH,
      -halfH,
      0.1,
      1000
    );

    // Isometric / 2.5D position looking at origin
    this.camera.position.set(0, 4, 20);
    this.camera.lookAt(0, 2, 0);
  }

  public resize(width: number, height: number): void {
    if (height === 0) return;
    this.aspect = width / height;
    const halfH = this.frustumSize / 2;
    const halfW = halfH * this.aspect;

    this.camera.left = -halfW;
    this.camera.right = halfW;
    this.camera.top = halfH;
    this.camera.bottom = -halfH;
    this.camera.updateProjectionMatrix();
  }

  public update(targetX: number, targetY: number, dt: number, isGameplay: boolean): void {
    if (isGameplay) {
      // Smooth follow player in gameplay
      const targetCameraX = targetX;
      const targetCameraY = targetY + 2.5;

      this.camera.position.x += (targetCameraX - this.camera.position.x) * Math.min(1, 8 * dt);
      this.camera.position.y += (targetCameraY - this.camera.position.y) * Math.min(1, 8 * dt);
      this.camera.lookAt(this.camera.position.x, this.camera.position.y - 0.5, 0);
    } else {
      // Ambient slow drift or centered around origin for portfolio background
      this.camera.position.x += (0 - this.camera.position.x) * Math.min(1, 3 * dt);
      this.camera.position.y += (3.5 - this.camera.position.y) * Math.min(1, 3 * dt);
      this.camera.lookAt(0, 2, 0);
    }
  }
}
