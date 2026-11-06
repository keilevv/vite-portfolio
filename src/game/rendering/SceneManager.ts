import * as THREE from "three";
import { Player } from "../entities/Player";

export class SceneManager {
  public scene: THREE.Scene;
  public groundY: number = 0;
  private backgroundPillars: THREE.Mesh[] = [];
  private ambientLight: THREE.AmbientLight;
  private dirLight: THREE.DirectionalLight;
  private floorMesh: THREE.Mesh;
  private gridHelper: THREE.GridHelper;

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0e141a);
    this.scene.fog = new THREE.FogExp2(0x0e141a, 0.025);

    // Lights
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xffa500, 1.2);
    this.dirLight.position.set(10, 20, 15);
    this.scene.add(this.dirLight);

    // Arena Floor
    const floorGeo = new THREE.BoxGeometry(60, 2, 8);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1a2630,
      roughness: 0.8,
      metalness: 0.2,
    });
    this.floorMesh = new THREE.Mesh(floorGeo, floorMat);
    // Top of floor is at y = 0
    this.floorMesh.position.set(0, -1, 0);
    this.scene.add(this.floorMesh);

    // Grid helper on top of floor for orientation
    this.gridHelper = new THREE.GridHelper(60, 30, 0xff8408, 0x2b3d4f);
    this.gridHelper.position.set(0, 0.01, 0);
    this.scene.add(this.gridHelper);

    // Atmospheric background geometric pillars / silhouettes
    const pillarGeo = new THREE.BoxGeometry(1.5, 10, 1.5);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x16222c,
      roughness: 0.7,
      metalness: 0.1,
    });

    const pillarPositions = [
      [-18, 5, -4],
      [-12, 4, -5],
      [-5, 6, -6],
      [4, 5, -5],
      [11, 7, -4],
      [17, 4, -6],
    ];

    pillarPositions.forEach(([x, y, z]) => {
      const mesh = new THREE.Mesh(pillarGeo, pillarMat);
      mesh.position.set(x, y, z);
      this.scene.add(mesh);
      this.backgroundPillars.push(mesh);
    });
  }

  public addPlayer(player: Player): void {
    this.scene.add(player.mesh);
  }

  public updateAmbient(_dt: number, reducedMotion: boolean): void {
    if (reducedMotion) return;

    // Gentle ambient floating pillars
    const time = performance.now() * 0.001;
    this.backgroundPillars.forEach((pillar, i) => {
      pillar.position.y += Math.sin(time + i) * 0.003;
    });
  }

  public dispose(): void {
    this.floorMesh.geometry.dispose();
    (this.floorMesh.material as THREE.Material).dispose();
    this.gridHelper.dispose();
    this.backgroundPillars.forEach((p) => {
      p.geometry.dispose();
      (p.material as THREE.Material).dispose();
    });
  }
}
