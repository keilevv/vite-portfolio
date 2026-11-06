import * as THREE from "three";
import { GrappleAnchor } from "../world/CityTypes";

export class OffscreenIndicatorManager {
  public group: THREE.Group;
  private arrowMeshes: THREE.Mesh[] = [];
  private arrowGeo: THREE.BufferGeometry;
  private cyanMat: THREE.MeshBasicMaterial;
  private orangeMat: THREE.MeshBasicMaterial;

  constructor() {
    this.group = new THREE.Group();

    // Small chevron/triangle arrow geometry pointing up (rotation adjusts direction)
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.45);
    shape.lineTo(0.35, -0.25);
    shape.lineTo(0, -0.05);
    shape.lineTo(-0.35, -0.25);
    shape.closePath();

    this.arrowGeo = new THREE.ShapeGeometry(shape);

    this.cyanMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });

    this.orangeMat = new THREE.MeshBasicMaterial({
      color: 0xff8408,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1.0,
    });
  }

  public update(
    anchors: GrappleAnchor[],
    selectedId: string | null,
    screenBounds: { minX: number; maxX: number; minY: number; maxY: number },
    playerY: number
  ): void {
    // Margins inside the camera viewport edge
    const marginX = 1.0;
    const marginY = 1.0;
    const bMinX = screenBounds.minX + marginX;
    const bMaxX = screenBounds.maxX - marginX;
    const bMinY = screenBounds.minY + marginY;
    const bMaxY = screenBounds.maxY - marginY;

    const camCenterX = (screenBounds.minX + screenBounds.maxX) / 2;
    const camCenterY = (screenBounds.minY + screenBounds.maxY) / 2;

    // Filter anchors that are outside camera bounds (or just entering camera margins),
    // strictly overhead relative to player (a.y > playerY + 0.8),
    // and within reachable hookable distance (<= 38 units)
    const offscreenAnchors: { anchor: GrappleAnchor; isSelected: boolean }[] = [];

    // Subtle edge threshold so targets just leaving the screen appear immediately with no gap
    const edgeThreshold = 0.5;
    const minOverheadY = playerY + 0.8;

    for (const a of anchors) {
      // Must be above player
      if (a.y <= minOverheadY) {
        continue;
      }

      const isInside =
        a.x >= screenBounds.minX + edgeThreshold &&
        a.x <= screenBounds.maxX - edgeThreshold &&
        a.y >= screenBounds.minY + edgeThreshold &&
        a.y <= screenBounds.maxY - edgeThreshold;

      if (!isInside) {
        const dist = Math.hypot(a.x - camCenterX, a.y - camCenterY);
        if (dist <= 38) {
          offscreenAnchors.push({
            anchor: a,
            isSelected: a.id === selectedId,
          });
        }
      }
    }

    // Ensure we have enough reusable arrow meshes
    while (this.arrowMeshes.length < offscreenAnchors.length) {
      const mesh = new THREE.Mesh(this.arrowGeo, this.cyanMat);
      mesh.position.z = 1.0; // In front of everything
      this.group.add(mesh);
      this.arrowMeshes.push(mesh);
    }

    // Update positions and rotations of arrows pinned to screen border
    for (let i = 0; i < this.arrowMeshes.length; i++) {
      const arrow = this.arrowMeshes[i];

      if (i < offscreenAnchors.length) {
        arrow.visible = true;
        const { anchor, isSelected } = offscreenAnchors[i];

        arrow.material = isSelected ? this.orangeMat : this.cyanMat;
        arrow.scale.setScalar(isSelected ? 1.4 : 1.0);

        // Vector from camera center to offscreen anchor
        const dx = anchor.x - camCenterX;
        const dy = anchor.y - camCenterY;
        const angle = Math.atan2(dy, dx);

        // Intersect ray with screen bounding box
        const halfW = (bMaxX - bMinX) / 2;
        const halfH = (bMaxY - bMinY) / 2;

        let edgeX = 0;
        let edgeY = 0;

        if (Math.abs(dx) * halfH > Math.abs(dy) * halfW) {
          // Hits left or right boundary
          edgeX = dx > 0 ? bMaxX : bMinX;
          edgeY = camCenterY + (edgeX - camCenterX) * (dy / dx);
        } else {
          // Hits top or bottom boundary
          edgeY = dy > 0 ? bMaxY : bMinY;
          edgeX = camCenterX + (edgeY - camCenterY) * (dx / dy);
        }

        arrow.position.set(edgeX, edgeY, 1.0);
        // Point arrow outward in the direction of the anchor
        arrow.rotation.z = angle - Math.PI / 2;
      } else {
        arrow.visible = false;
      }
    }
  }

  public dispose(): void {
    this.arrowGeo.dispose();
    this.cyanMat.dispose();
    this.orangeMat.dispose();
  }
}
