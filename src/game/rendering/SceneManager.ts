import * as THREE from "three";
import { Player } from "../entities/Player";
import { CityGenerator } from "../world/CityGenerator";
import { PlatformBox } from "../world/CityTypes";
import { OffscreenIndicatorManager } from "./OffscreenIndicatorManager";

export class SceneManager {
  public scene: THREE.Scene;
  public groundY: number = 0;
  public cityGenerator: CityGenerator;
  public indicatorManager: OffscreenIndicatorManager;

  private ambientLight: THREE.AmbientLight;
  private dirLight: THREE.DirectionalLight;

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0f16);
    this.scene.fog = new THREE.FogExp2(0x0a0f16, 0.02);

    // Moody city lights
    this.ambientLight = new THREE.AmbientLight(0x7799bb, 0.8);
    this.scene.add(this.ambientLight);

    // Warm street/window cast directional light
    this.dirLight = new THREE.DirectionalLight(0xffaa55, 1.4);
    this.dirLight.position.set(15, 25, 20);
    this.scene.add(this.dirLight);

    // Procedural Dark City Biome
    this.cityGenerator = new CityGenerator();
    this.scene.add(this.cityGenerator.group);

    // Off-screen anchor arrow indicators
    this.indicatorManager = new OffscreenIndicatorManager();
    this.scene.add(this.indicatorManager.group);
  }

  public addPlayer(player: Player): void {
    this.scene.add(player.mesh);
    this.scene.add(player.ropeLine);
  }

  public getPlatforms(): PlatformBox[] {
    return this.cityGenerator.getPlatforms();
  }

  public getAnchors() {
    return this.cityGenerator.getAnchors();
  }

  public updateWorld(
    playerX: number,
    playerY: number,
    dt: number,
    selectedAnchorId: string | null,
    screenBounds: { minX: number; maxX: number; minY: number; maxY: number }
  ): void {
    this.cityGenerator.update(playerX, playerY, dt);
    this.cityGenerator.updateAnchorVisuals(selectedAnchorId, playerX, playerY, 36);
    this.indicatorManager.update(this.cityGenerator.getAnchors(), selectedAnchorId, screenBounds, playerY);
  }

  public dispose(): void {
    this.cityGenerator.dispose();
    this.indicatorManager.dispose();
  }
}
