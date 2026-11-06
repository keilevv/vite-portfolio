import type * as THREE from "three";

export interface PlatformBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isOneWay?: boolean; // Can jump up through it and land on top (e.g. balconies)
}

export interface GrappleAnchor {
  id: string;
  x: number;
  y: number;
  type: "roof_edge" | "bridge" | "balcony" | "lamp";
  markerMesh?: THREE.Mesh;
}

export interface CutoutStructure {
  mesh: THREE.Mesh;
  material: THREE.MeshStandardMaterial;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface CitySegment {
  id: string;
  startX: number;
  endX: number;
  platforms: PlatformBox[];
  cutouts: CutoutStructure[];
  anchors: GrappleAnchor[];
}
