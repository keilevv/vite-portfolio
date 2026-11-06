import * as THREE from "three";
import { PlatformBox, CitySegment, CutoutStructure, GrappleAnchor } from "./CityTypes";

export class CityGenerator {
  public group: THREE.Group;
  private segments: CitySegment[] = [];
  private activeMeshes: THREE.Object3D[] = [];
  private nextX: number = -30;
  private readonly segmentWidth: number = 46;

  // Road tile tracking
  private roadSegments: { group: THREE.Group; startX: number; endX: number }[] = [];
  private nextRoadX: number = -60;
  private readonly roadSegmentWidth: number = 60;

  // Track last zone type to prevent repetition and create rhythm
  private lastZoneType = -1;

  // Materials
  private roadMat: THREE.MeshStandardMaterial;
  private curbMat: THREE.MeshStandardMaterial;
  private markingMat: THREE.MeshStandardMaterial;
  private windowLitMat: THREE.MeshStandardMaterial;
  private windowWarmMat: THREE.MeshStandardMaterial;
  private roofTrimMat: THREE.MeshStandardMaterial;
  private balconyMat: THREE.MeshStandardMaterial;
  private steelBridgeMat: THREE.MeshStandardMaterial;
  private parkGrassMat: THREE.MeshStandardMaterial;
  private foliageMat: THREE.MeshStandardMaterial;
  private woodBenchMat: THREE.MeshStandardMaterial;
  private lampGlowMat: THREE.MeshStandardMaterial;

  // Hookshot anchor visual beacon
  private anchorMarkerMat: THREE.MeshBasicMaterial;
  private anchorSelectedMat: THREE.MeshBasicMaterial;
  private anchorPulseGeo: THREE.RingGeometry;
  private anchorDotGeo: THREE.CircleGeometry;

  constructor() {
    this.group = new THREE.Group();

    // Road materials
    this.roadMat = new THREE.MeshStandardMaterial({
      color: 0x0a0f14,
      roughness: 0.9,
      metalness: 0.1,
    });

    this.curbMat = new THREE.MeshStandardMaterial({
      color: 0x1f2e3d,
      roughness: 0.7,
      metalness: 0.2,
    });

    this.markingMat = new THREE.MeshStandardMaterial({
      color: 0xffcc44,
      emissive: 0xaa7711,
      emissiveIntensity: 0.6,
      roughness: 0.4,
    });

    this.windowLitMat = new THREE.MeshStandardMaterial({
      color: 0xffea99,
      emissive: 0xffaa22,
      emissiveIntensity: 1.6,
      roughness: 0.2,
    });

    this.windowWarmMat = new THREE.MeshStandardMaterial({
      color: 0x66ccff,
      emissive: 0x2288dd,
      emissiveIntensity: 1.2,
      roughness: 0.3,
    });

    this.roofTrimMat = new THREE.MeshStandardMaterial({
      color: 0x2a3d4f,
      roughness: 0.6,
      metalness: 0.3,
    });

    this.balconyMat = new THREE.MeshStandardMaterial({
      color: 0x44607a,
      roughness: 0.4,
      metalness: 0.5,
    });

    this.steelBridgeMat = new THREE.MeshStandardMaterial({
      color: 0x243444,
      roughness: 0.4,
      metalness: 0.7,
    });

    this.parkGrassMat = new THREE.MeshStandardMaterial({
      color: 0x0f291e,
      roughness: 0.9,
      metalness: 0.1,
    });

    this.foliageMat = new THREE.MeshStandardMaterial({
      color: 0x133827,
      roughness: 0.8,
      metalness: 0.1,
    });

    this.woodBenchMat = new THREE.MeshStandardMaterial({
      color: 0x3d271d,
      roughness: 0.7,
      metalness: 0.1,
    });

    this.lampGlowMat = new THREE.MeshStandardMaterial({
      color: 0xffe082,
      emissive: 0xffb74d,
      emissiveIntensity: 2.0,
      roughness: 0.2,
    });

    // Glowing Neon Target Ring Marker (Default Cyan)
    this.anchorPulseGeo = new THREE.RingGeometry(0.35, 0.55, 16);
    // Cyan Dot Marker (when target is under character / non-hookable)
    this.anchorDotGeo = new THREE.CircleGeometry(0.18, 16);
    this.anchorMarkerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });

    // Selected Target Ring Marker (Neon Orange)
    this.anchorSelectedMat = new THREE.MeshBasicMaterial({
      color: 0xff8408,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1.0,
    });

    // Seed initial road segments
    for (let i = 0; i < 5; i++) {
      this.generateNextRoadSegment();
    }

    // Seed initial city segments
    for (let i = 0; i < 4; i++) {
      this.generateNextSegment();
    }
  }

  // Helper: create dark building material with custom depth-based outline color
  private createBuildingMaterial(depthZ: number, isCutout: boolean = false): THREE.MeshStandardMaterial {
    // Closer buildings: deeper teal/navy; further buildings: foggy dark slate
    const depthRatio = Math.min(1, Math.abs(depthZ) / 16);
    const r = Math.round(10 + depthRatio * 6);
    const g = Math.round(16 + depthRatio * 10);
    const b = Math.round(24 + depthRatio * 18);
    const hex = (r << 16) | (g << 8) | b;

    return new THREE.MeshStandardMaterial({
      color: hex,
      roughness: 0.85,
      metalness: 0.2,
      transparent: isCutout,
      opacity: 1.0,
    });
  }

  // Helper: attach vibrant colored neon edge outlines to geometry
  private addEdgeOutlines(
    mesh: THREE.Mesh,
    geo: THREE.BufferGeometry,
    outlineColor: number = 0x38bdf8,
    opacity: number = 0.55
  ): void {
    const edges = new THREE.EdgesGeometry(geo, 30);
    const lineMat = new THREE.LineBasicMaterial({
      color: outlineColor,
      transparent: true,
      opacity,
      linewidth: 1,
    });
    const edgeLines = new THREE.LineSegments(edges, lineMat);
    mesh.add(edgeLines);
  }

  public getPlatforms(): PlatformBox[] {
    const all: PlatformBox[] = [];
    for (const seg of this.segments) {
      all.push(...seg.platforms);
    }
    return all;
  }

  public getAnchors(): GrappleAnchor[] {
    const all: GrappleAnchor[] = [];
    for (const seg of this.segments) {
      all.push(...seg.anchors);
    }
    return all;
  }

  // Helper: adds an anchor and places a glowing cyan neon ring in the 3D world
  private addHookAnchor(
    parent: THREE.Group,
    anchors: GrappleAnchor[],
    x: number,
    y: number,
    type: GrappleAnchor["type"]
  ): void {
    const marker = new THREE.Mesh(this.anchorPulseGeo, this.anchorMarkerMat);
    // Position at front platform plane Z = 0.5 so it is visible in front of structures
    marker.position.set(x, y, 0.5);
    parent.add(marker);

    anchors.push({
      id: `anchor_${x.toFixed(1)}_${y.toFixed(1)}`,
      x,
      y,
      type,
      markerMesh: marker,
    });
  }

  // Highlight selected anchor in Orange and non-selected in Cyan
  // If anchor is below the player or out of range, show as small cyan dot.
  // If hookable (overhead and within reachable distance), show as ring with appropriate color (selected = orange, default = cyan).
  public updateAnchorVisuals(
    selectedId: string | null,
    playerX: number,
    playerY: number,
    maxDistance: number = 36
  ): void {
    const minOverheadY = playerY + 0.8;
    for (const seg of this.segments) {
      for (const anchor of seg.anchors) {
        if (anchor.markerMesh) {
          const isOverhead = anchor.y > minOverheadY;
          const dist = Math.hypot(anchor.x - playerX, anchor.y - (playerY + 1.2));
          const isHookable = isOverhead && dist <= maxDistance;

          anchor.markerMesh.visible = true;

          if (isHookable) {
            // Hookable: show full Target Ring
            if (anchor.markerMesh.geometry !== this.anchorPulseGeo) {
              anchor.markerMesh.geometry = this.anchorPulseGeo;
            }
            const isSelected = anchor.id === selectedId;
            anchor.markerMesh.material = isSelected ? this.anchorSelectedMat : this.anchorMarkerMat;
            anchor.markerMesh.scale.setScalar(isSelected ? 1.35 : 1.0);
          } else {
            // Non-hookable (e.g. below player or too far): show small cyan dot
            if (anchor.markerMesh.geometry !== this.anchorDotGeo) {
              anchor.markerMesh.geometry = this.anchorDotGeo;
            }
            anchor.markerMesh.material = this.anchorMarkerMat;
            anchor.markerMesh.scale.setScalar(1.0);
          }
        }
      }
    }
  }

  public update(playerX: number, playerY: number, dt: number): void {
    // 1. Procedural city segments streaming
    const furthestX = this.segments[this.segments.length - 1]?.endX ?? 0;
    if (playerX + 50 > furthestX) {
      this.generateNextSegment();
    }
    while (this.segments.length > 5 && this.segments[0].endX < playerX - 70) {
      this.removeOldestSegment();
    }

    // 2. Procedural road segments streaming
    const furthestRoadX = this.roadSegments[this.roadSegments.length - 1]?.endX ?? 0;
    if (playerX + 60 > furthestRoadX) {
      this.generateNextRoadSegment();
    }
    while (this.roadSegments.length > 6 && this.roadSegments[0].endX < playerX - 80) {
      this.removeOldestRoadSegment();
    }

    // 3. Dynamic building transparency (see-through effect when player passes through/near)
    for (const seg of this.segments) {
      for (const cutout of seg.cutouts) {
        const isPlayerInside =
          playerX >= cutout.minX &&
          playerX <= cutout.maxX &&
          playerY >= cutout.minY - 0.5 &&
          playerY <= cutout.maxY + 1.0;

        const targetOpacity = isPlayerInside ? 0.22 : 1.0;
        cutout.material.opacity += (targetOpacity - cutout.material.opacity) * Math.min(1, 10 * dt);
      }
    }
  }

  // --- Static World Ground / Road Tiles ---
  private generateNextRoadSegment(): void {
    const startX = this.nextRoadX;
    const endX = startX + this.roadSegmentWidth;
    this.nextRoadX = endX;

    const roadGroup = new THREE.Group();
    const centerX = (startX + endX) / 2;

    // Road asphalt bed
    const asphaltGeo = new THREE.BoxGeometry(this.roadSegmentWidth, 2, 10);
    const asphaltMesh = new THREE.Mesh(asphaltGeo, this.roadMat);
    asphaltMesh.position.set(centerX, -1, 0);
    this.addEdgeOutlines(asphaltMesh, asphaltGeo, 0x1e293b, 0.4);
    roadGroup.add(asphaltMesh);

    // Curbs on edges (z = -4.8 and z = 4.8)
    const curbGeo = new THREE.BoxGeometry(this.roadSegmentWidth, 0.3, 0.4);
    const curbFront = new THREE.Mesh(curbGeo, this.curbMat);
    curbFront.position.set(centerX, 0.15, 3.8);
    roadGroup.add(curbFront);

    const curbBack = new THREE.Mesh(curbGeo, this.curbMat);
    curbBack.position.set(centerX, 0.15, -4.5);
    roadGroup.add(curbBack);

    // Road dash markings along center line (z = 0)
    const dashLength = 3;
    const dashSpacing = 5;
    const count = Math.floor(this.roadSegmentWidth / dashSpacing);
    const markGeo = new THREE.BoxGeometry(dashLength, 0.05, 0.3);

    for (let i = 0; i < count; i++) {
      const dashX = startX + i * dashSpacing + dashLength / 2 + 1;
      const markMesh = new THREE.Mesh(markGeo, this.markingMat);
      markMesh.position.set(dashX, 0.02, 0);
      roadGroup.add(markMesh);
    }

    this.group.add(roadGroup);
    this.roadSegments.push({ group: roadGroup, startX, endX });
  }

  private removeOldestRoadSegment(): void {
    const oldest = this.roadSegments.shift();
    if (oldest) {
      this.group.remove(oldest.group);
      oldest.group.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
        }
      });
    }
  }

  // --- Procedural City Architecture ---
  private generateNextSegment(): void {
    const startX = this.nextX;
    const endX = startX + this.segmentWidth;
    this.nextX = endX;

    const segmentPlatforms: PlatformBox[] = [];
    const segmentCutouts: CutoutStructure[] = [];
    const segmentAnchors: GrappleAnchor[] = [];
    const segmentGroup = new THREE.Group();

    // 1. Deep Background Skyscrapers (Z: -16 to -6)
    const bgCount = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < bgCount; i++) {
      const x = startX + Math.random() * this.segmentWidth;
      const z = -6 - Math.random() * 10;
      const w = 5 + Math.random() * 7;
      const h = 20 + Math.random() * 20;
      const d = 4 + Math.random() * 6;

      const towerGeo = new THREE.BoxGeometry(w, h, d);
      const towerMat = this.createBuildingMaterial(z);
      const towerMesh = new THREE.Mesh(towerGeo, towerMat);
      towerMesh.position.set(x, h / 2 - 1, z);

      // Edge outline with blue/cyan neon rim
      const rimColor = z < -11 ? 0x1e3a8a : 0x0284c7;
      this.addEdgeOutlines(towerMesh, towerGeo, rimColor, 0.45);
      segmentGroup.add(towerMesh);

      // Lit windows
      this.addSkyscraperWindows(segmentGroup, x, z + d / 2 + 0.05, w, h);

      // Provide high grapple anchor points on closer background towers (z >= -9) for high-altitude Spiderman swinging
      if (z >= -9.5 && i % 2 === 0) {
        // High anchor at roof edge or spire level
        this.addHookAnchor(segmentGroup, segmentAnchors, x, h - 1.2, "roof_edge");
      }
    }

    // 2. Foreground Urban Variety
    let zoneType: number;
    do {
      zoneType = Math.floor(Math.random() * 5);
    } while (zoneType === this.lastZoneType);
    this.lastZoneType = zoneType;

    const midX = startX + this.segmentWidth / 2;

    switch (zoneType) {
      case 0:
        this.createWalkthroughHouse(segmentGroup, segmentPlatforms, segmentCutouts, segmentAnchors, midX);
        break;
      case 1:
        this.createBalconyApartment(segmentGroup, segmentPlatforms, segmentCutouts, segmentAnchors, midX);
        break;
      case 2:
        this.createUrbanPark(segmentGroup, segmentPlatforms, segmentAnchors, midX);
        break;
      case 3:
        this.createElevatedBridge(segmentGroup, segmentPlatforms, segmentAnchors, midX);
        break;
      case 4:
      default:
        this.createRooftopObstacle(segmentGroup, segmentPlatforms, segmentAnchors, midX);
        break;
    }

    this.segments.push({
      id: `seg_${Date.now()}_${Math.random()}`,
      startX,
      endX,
      platforms: segmentPlatforms,
      cutouts: segmentCutouts,
      anchors: segmentAnchors,
    });

    this.group.add(segmentGroup);
    this.activeMeshes.push(segmentGroup);
  }

  private addSkyscraperWindows(
    parent: THREE.Group,
    towerX: number,
    windowZ: number,
    towerW: number,
    towerH: number
  ): void {
    const cols = Math.floor(towerW / 1.5);
    const rows = Math.floor(towerH / 2.2);
    const winGeo = new THREE.BoxGeometry(0.55, 0.85, 0.05);

    for (let r = 2; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() > 0.45) {
          const mat = Math.random() > 0.5 ? this.windowLitMat : this.windowWarmMat;
          const winMesh = new THREE.Mesh(winGeo, mat);
          const winX = towerX - towerW / 2 + 0.8 + c * 1.4;
          const winY = r * 2.0;
          winMesh.position.set(winX, winY, windowZ);
          parent.add(winMesh);
        }
      }
    }
  }

  // --- Walkthrough House with Transparent Cutout Wall ---
  private createWalkthroughHouse(
    parent: THREE.Group,
    platforms: PlatformBox[],
    cutouts: CutoutStructure[],
    anchors: GrappleAnchor[],
    centerX: number
  ): void {
    const width = 13;
    const height = 9.5;
    const doorW = 4.2;
    const doorH = 3.6;

    // Unique material for this building so transparency won't affect other buildings
    const buildingMat = this.createBuildingMaterial(0, true);

    // Left wall pillar
    const leftW = (width - doorW) / 2;
    const wallGeo = new THREE.BoxGeometry(leftW, height, 4.5);
    const leftWall = new THREE.Mesh(wallGeo, buildingMat);
    leftWall.position.set(centerX - width / 2 + leftW / 2, height / 2, 0);
    this.addEdgeOutlines(leftWall, wallGeo, 0x38bdf8, 0.6);
    parent.add(leftWall);

    // Right wall pillar
    const rightWall = new THREE.Mesh(wallGeo, buildingMat);
    rightWall.position.set(centerX + width / 2 - leftW / 2, height / 2, 0);
    this.addEdgeOutlines(rightWall, wallGeo, 0x38bdf8, 0.6);
    parent.add(rightWall);

    // Overhead lintel / ceiling (forms interior doorway and walkable roof platform)
    const lintelH = height - doorH;
    const lintelGeo = new THREE.BoxGeometry(doorW, lintelH, 4.5);
    const lintel = new THREE.Mesh(lintelGeo, buildingMat);
    lintel.position.set(centerX, doorH + lintelH / 2, 0);
    this.addEdgeOutlines(lintel, lintelGeo, 0x38bdf8, 0.6);
    parent.add(lintel);

    // Front facade wall above the door with glowing sign / window
    const frontWallGeo = new THREE.BoxGeometry(width, height - doorH, 0.4);
    const frontWall = new THREE.Mesh(frontWallGeo, buildingMat);
    frontWall.position.set(centerX, doorH + (height - doorH) / 2, 2.3);
    this.addEdgeOutlines(frontWall, frontWallGeo, 0x06b6d4, 0.7);
    parent.add(frontWall);

    cutouts.push({
      mesh: frontWall,
      material: buildingMat,
      minX: centerX - width / 2,
      maxX: centerX + width / 2,
      minY: 0,
      maxY: doorH + 1,
    });

    // Roof platform
    platforms.push({
      id: `roof_${centerX}`,
      x: centerX,
      y: height,
      width: width,
      height: 0.5,
    });

    // Roof trim
    const roofTrimGeo = new THREE.BoxGeometry(width + 0.8, 0.5, 5.0);
    const roofTrim = new THREE.Mesh(roofTrimGeo, this.roofTrimMat);
    roofTrim.position.set(centerX, height + 0.25, 0);
    this.addEdgeOutlines(roofTrim, roofTrimGeo, 0x0284c7, 0.8);
    parent.add(roofTrim);

    // Recessed window (Z is set to 2.25 inside facade to prevent z-fighting / jittering)
    const bigWinGeo = new THREE.BoxGeometry(2.4, 2.6, 0.2);
    const bigWin = new THREE.Mesh(bigWinGeo, this.windowLitMat);
    bigWin.position.set(centerX, doorH + 2.0, 2.4);
    parent.add(bigWin);

    // Hookshot Anchors on roof corners and center apex
    this.addHookAnchor(parent, anchors, centerX - width / 2 + 1.2, height + 0.5, "roof_edge");
    this.addHookAnchor(parent, anchors, centerX, height + 1.6, "roof_edge");
    this.addHookAnchor(parent, anchors, centerX + width / 2 - 1.2, height + 0.5, "roof_edge");
  }

  // --- Apartment with Balconies ---
  private createBalconyApartment(
    parent: THREE.Group,
    platforms: PlatformBox[],
    cutouts: CutoutStructure[],
    anchors: GrappleAnchor[],
    centerX: number
  ): void {
    const bW = 11;
    const bH = 12;
    const bD = 4.5;

    const buildingMat = this.createBuildingMaterial(0, true);
    const bGeo = new THREE.BoxGeometry(bW, bH, bD);
    const bMesh = new THREE.Mesh(bGeo, buildingMat);
    bMesh.position.set(centerX, bH / 2, 0);
    this.addEdgeOutlines(bMesh, bGeo, 0x38bdf8, 0.6);
    parent.add(bMesh);

    cutouts.push({
      mesh: bMesh,
      material: buildingMat,
      minX: centerX - bW / 2 - 0.5,
      maxX: centerX + bW / 2 + 0.5,
      minY: 0,
      maxY: bH,
    });

    // Roof platform
    platforms.push({
      id: `roof_apt_${centerX}`,
      x: centerX,
      y: bH,
      width: bW,
      height: 0.5,
    });

    // Hookshot anchor on highest roof edge & center spire
    this.addHookAnchor(parent, anchors, centerX - bW / 2 + 1.5, bH + 0.5, "roof_edge");
    this.addHookAnchor(parent, anchors, centerX, bH + 2.0, "roof_edge");
    this.addHookAnchor(parent, anchors, centerX + bW / 2 - 1.5, bH + 0.5, "roof_edge");

    // Stepped jumpable balconies
    const balconyLevels = [
      { y: 3.4, xOffset: -2.8, w: 4.2 },
      { y: 6.8, xOffset: 2.6, w: 4.4 },
    ];

    balconyLevels.forEach((balc, idx) => {
      const balcX = centerX + balc.xOffset;
      const balcGeo = new THREE.BoxGeometry(balc.w, 0.45, 2.4);
      const balcMesh = new THREE.Mesh(balcGeo, this.balconyMat);
      balcMesh.position.set(balcX, balc.y, 1.2);
      this.addEdgeOutlines(balcMesh, balcGeo, 0x67e8f9, 0.7);
      parent.add(balcMesh);

      // Balcony railing
      const railGeo = new THREE.BoxGeometry(balc.w, 0.8, 0.1);
      const railMesh = new THREE.Mesh(railGeo, this.balconyMat);
      railMesh.position.set(balcX, balc.y + 0.5, 2.3);
      this.addEdgeOutlines(railMesh, railGeo, 0x38bdf8, 0.8);
      parent.add(railMesh);

      // Clean recessed door/window (Z set to bD/2 + 0.15 to avoid z-fighting jitter)
      const doorWinGeo = new THREE.BoxGeometry(1.6, 2.4, 0.1);
      const doorWin = new THREE.Mesh(doorWinGeo, this.windowLitMat);
      doorWin.position.set(balcX, balc.y + 1.3, bD / 2 + 0.15);
      parent.add(doorWin);

      platforms.push({
        id: `balcony_${centerX}_${idx}`,
        x: balcX,
        y: balc.y,
        width: balc.w,
        height: 0.45,
        isOneWay: true,
      });

      // Hookshot anchor on upper balcony underside/corner
      if (idx === 1) {
        this.addHookAnchor(parent, anchors, balcX, balc.y + 1.5, "balcony");
      }
    });
  }

  // --- Urban Park ---
  private createUrbanPark(
    parent: THREE.Group,
    platforms: PlatformBox[],
    anchors: GrappleAnchor[],
    centerX: number
  ): void {
    const parkWidth = 24;

    const bedGeo = new THREE.BoxGeometry(parkWidth - 2, 0.4, 6);
    const bedMesh = new THREE.Mesh(bedGeo, this.parkGrassMat);
    bedMesh.position.set(centerX, 0.2, 0);
    this.addEdgeOutlines(bedMesh, bedGeo, 0x10b981, 0.5);
    parent.add(bedMesh);

    platforms.push({
      id: `park_bed_${centerX}`,
      x: centerX,
      y: 0.4,
      width: parkWidth - 2,
      height: 0.4,
      isOneWay: true,
    });

    const treePositions = [-8, -2, 6];
    treePositions.forEach((xOff, i) => {
      const treeX = centerX + xOff;
      const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 2.2, 6);
      const trunkMesh = new THREE.Mesh(trunkGeo, this.curbMat);
      trunkMesh.position.set(treeX, 1.1, -1);
      parent.add(trunkMesh);

      const folGeo = new THREE.ConeGeometry(1.4, 3.2, 6);
      const folMesh = new THREE.Mesh(folGeo, this.foliageMat);
      folMesh.position.set(treeX, 3.2, -1);
      this.addEdgeOutlines(folMesh, folGeo, 0x059669, 0.6);
      parent.add(folMesh);

      if (i === 1) {
        platforms.push({
          id: `tree_plat_${treeX}`,
          x: treeX,
          y: 2.2,
          width: 1.8,
          height: 0.3,
          isOneWay: true,
        });

        // Overhead grapple anchor on tree top
        this.addHookAnchor(parent, anchors, treeX, 4.8, "roof_edge");
      }
    });

    const benchPositions = [-5, 3];
    benchPositions.forEach((bOff, idx) => {
      const bX = centerX + bOff;
      const benchGeo = new THREE.BoxGeometry(2.4, 0.4, 0.9);
      const bench = new THREE.Mesh(benchGeo, this.woodBenchMat);
      bench.position.set(bX, 0.6, 1.5);
      this.addEdgeOutlines(bench, benchGeo, 0xd97706, 0.6);
      parent.add(bench);

      platforms.push({
        id: `bench_${centerX}_${idx}`,
        x: bX,
        y: 0.8,
        width: 2.4,
        height: 0.4,
        isOneWay: true,
      });
    });

    this.addStreetLamp(parent, centerX - 10, anchors);
    this.addStreetLamp(parent, centerX + 10, anchors);
  }

  // --- Elevated Skybridge ---
  private createElevatedBridge(
    parent: THREE.Group,
    platforms: PlatformBox[],
    anchors: GrappleAnchor[],
    centerX: number
  ): void {
    const bridgeSpan = 18;
    const deckHeight = 4.2;

    const pierGeo = new THREE.BoxGeometry(2.5, deckHeight, 3.5);
    const leftPier = new THREE.Mesh(pierGeo, this.steelBridgeMat);
    leftPier.position.set(centerX - bridgeSpan / 2 + 1.25, deckHeight / 2, 0);
    this.addEdgeOutlines(leftPier, pierGeo, 0x0284c7, 0.7);
    parent.add(leftPier);

    const rightPier = new THREE.Mesh(pierGeo, this.steelBridgeMat);
    rightPier.position.set(centerX + bridgeSpan / 2 - 1.25, deckHeight / 2, 0);
    this.addEdgeOutlines(rightPier, pierGeo, 0x0284c7, 0.7);
    parent.add(rightPier);

    const deckGeo = new THREE.BoxGeometry(bridgeSpan, 0.6, 3.8);
    const deckMesh = new THREE.Mesh(deckGeo, this.steelBridgeMat);
    deckMesh.position.set(centerX, deckHeight, 0);
    this.addEdgeOutlines(deckMesh, deckGeo, 0x38bdf8, 0.8);
    parent.add(deckMesh);

    const trussGeo = new THREE.BoxGeometry(bridgeSpan - 2, 0.25, 0.1);
    const trussTop = new THREE.Mesh(trussGeo, this.steelBridgeMat);
    trussTop.position.set(centerX, deckHeight + 2.2, 1.6);
    this.addEdgeOutlines(trussTop, trussGeo, 0x67e8f9, 0.9);
    parent.add(trussTop);

    const stepBoxGeo = new THREE.BoxGeometry(2.6, 2.0, 2.6);
    const stepBox = new THREE.Mesh(stepBoxGeo, this.curbMat);
    stepBox.position.set(centerX - 4.5, 1.0, 0);
    this.addEdgeOutlines(stepBox, stepBoxGeo, 0x38bdf8, 0.5);
    parent.add(stepBox);

    platforms.push({
      id: `bridge_deck_${centerX}`,
      x: centerX,
      y: deckHeight + 0.3,
      width: bridgeSpan,
      height: 0.6,
      isOneWay: true,
    });

    platforms.push({
      id: `bridge_step_${centerX}`,
      x: centerX - 4.5,
      y: 2.0,
      width: 2.6,
      height: 0.4,
      isOneWay: true,
    });

    // Skybridge grapple anchors (perfect for Spiderman-style swooping under or across the bridge)
    this.addHookAnchor(parent, anchors, centerX - 5.0, deckHeight + 2.4, "bridge");
    this.addHookAnchor(parent, anchors, centerX + 5.0, deckHeight + 2.4, "bridge");
  }

  // --- Rooftop Obstacle ---
  private createRooftopObstacle(
    parent: THREE.Group,
    platforms: PlatformBox[],
    anchors: GrappleAnchor[],
    centerX: number
  ): void {
    const buildingMat = this.createBuildingMaterial(0);

    const step1W = 5.5;
    const step1H = 3.6;
    const step1Geo = new THREE.BoxGeometry(step1W, step1H, 4.5);
    const step1 = new THREE.Mesh(step1Geo, buildingMat);
    step1.position.set(centerX - 4.5, step1H / 2, 0);
    this.addEdgeOutlines(step1, step1Geo, 0x38bdf8, 0.6);
    parent.add(step1);

    platforms.push({
      id: `step1_${centerX}`,
      x: centerX - 4.5,
      y: step1H,
      width: step1W,
      height: 0.5,
    });

    const step2W = 6.5;
    const step2H = 7.2;
    const step2Geo = new THREE.BoxGeometry(step2W, step2H, 4.5);
    const step2 = new THREE.Mesh(step2Geo, buildingMat);
    step2.position.set(centerX + 3.0, step2H / 2, 0);
    this.addEdgeOutlines(step2, step2Geo, 0x0284c7, 0.7);
    parent.add(step2);

    platforms.push({
      id: `step2_${centerX}`,
      x: centerX + 3.0,
      y: step2H,
      width: step2W,
      height: 0.5,
    });

    const winGeo = new THREE.BoxGeometry(1.4, 1.8, 0.1);
    const win = new THREE.Mesh(winGeo, this.windowWarmMat);
    win.position.set(centerX + 3.0, step2H - 2.0, 2.35);
    parent.add(win);

    // Grapple anchors on high roof edges
    this.addHookAnchor(parent, anchors, centerX + 1.2, step2H + 0.4, "roof_edge");
    this.addHookAnchor(parent, anchors, centerX + 5.5, step2H + 0.4, "roof_edge");
  }

  // --- Street Lamp Prop Helper ---
  private addStreetLamp(parent: THREE.Group, x: number, anchors?: GrappleAnchor[]): void {
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.1, 4.5, 6);
    const pole = new THREE.Mesh(poleGeo, this.steelBridgeMat);
    pole.position.set(x, 2.25, 2.8);
    parent.add(pole);

    const headGeo = new THREE.BoxGeometry(0.7, 0.25, 0.4);
    const head = new THREE.Mesh(headGeo, this.steelBridgeMat);
    head.position.set(x, 4.5, 2.8);
    parent.add(head);

    const bulbGeo = new THREE.BoxGeometry(0.5, 0.15, 0.3);
    const bulb = new THREE.Mesh(bulbGeo, this.lampGlowMat);
    bulb.position.set(x, 4.35, 2.8);
    parent.add(bulb);

    if (anchors) {
      this.addHookAnchor(parent, anchors, x, 4.6, "lamp");
    }
  }

  private removeOldestSegment(): void {
    const oldestSeg = this.segments.shift();
    const oldestMesh = this.activeMeshes.shift();
    if (oldestMesh) {
      this.group.remove(oldestMesh);
      oldestMesh.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
        }
      });
    }
    void oldestSeg;
  }

  public dispose(): void {
    this.roadMat.dispose();
    this.curbMat.dispose();
    this.markingMat.dispose();
    this.windowLitMat.dispose();
    this.windowWarmMat.dispose();
    this.roofTrimMat.dispose();
    this.balconyMat.dispose();
  }
}
