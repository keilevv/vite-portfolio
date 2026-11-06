import * as THREE from "three";

export class CameraController {
  public camera: THREE.OrthographicCamera;
  private aspect: number = 1;
  private readonly frustumSize: number = 14;

  // Track lookAt target smoothly so camera orientation doesn't snap
  private currentLookAt: THREE.Vector3 = new THREE.Vector3(0, 2, 0);

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

    // Initial position
    this.camera.position.set(0, 3.5, 20);
    this.camera.lookAt(this.currentLookAt);
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
    let desiredPosX = 0;
    let desiredPosY = 3.5;
    let desiredLookX = 0;
    let desiredLookY = 2;

    if (isGameplay) {
      desiredPosX = targetX;
      desiredPosY = targetY + 2.5;
      desiredLookX = targetX;
      desiredLookY = targetY + 2.0;
    }

    // Consistent smooth interpolation across both entry and exit
    const posLerpFactor = Math.min(1, 3.5 * dt);
    const lookLerpFactor = Math.min(1, 4 * dt);

    this.camera.position.x += (desiredPosX - this.camera.position.x) * posLerpFactor;
    this.camera.position.y += (desiredPosY - this.camera.position.y) * posLerpFactor;

    this.currentLookAt.x += (desiredLookX - this.currentLookAt.x) * lookLerpFactor;
    this.currentLookAt.y += (desiredLookY - this.currentLookAt.y) * lookLerpFactor;

    this.camera.lookAt(this.currentLookAt);
  }

  // Calculate normalized screen bounds for off-screen indicator pointers
  public getScreenEdges(): { minX: number; maxX: number; minY: number; maxY: number } {
    const halfH = this.frustumSize / 2;
    const halfW = halfH * this.aspect;
    return {
      minX: this.camera.position.x - halfW,
      maxX: this.camera.position.x + halfW,
      minY: this.camera.position.y - halfH,
      maxY: this.camera.position.y + halfH,
    };
  }
}
