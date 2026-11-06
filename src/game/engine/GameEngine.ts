import * as THREE from "three";
import { SceneManager } from "../rendering/SceneManager";
import { CameraController } from "../rendering/CameraController";
import { InputManager } from "../input/InputManager";
import { Player } from "../entities/Player";
import { ExperienceMode } from "./GameTypes";

export class GameEngine {
  private renderer: THREE.WebGLRenderer | null = null;
  private sceneManager: SceneManager;
  private cameraController: CameraController;
  private inputManager: InputManager;
  private player: Player;

  private mode: ExperienceMode = "portfolio";
  private isRunning = false;
  private animFrameId: number | null = null;
  private lastTime = 0;
  private reducedMotion = false;
  private onModeChangeCb?: (mode: ExperienceMode) => void;

  constructor() {
    this.sceneManager = new SceneManager();
    this.cameraController = new CameraController(window.innerWidth, window.innerHeight);
    this.inputManager = new InputManager();
    this.player = new Player(0, 0);

    this.sceneManager.addPlayer(this.player);

    // Reduced motion preference
    if (typeof window !== "undefined") {
      this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
  }

  public init(canvas: HTMLCanvasElement): void {
    if (this.renderer) return;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);

    this.cameraController.resize(window.innerWidth, window.innerHeight);
    this.inputManager.attach();

    this.startLoop();
  }

  public setModeChangeCallback(cb: (mode: ExperienceMode) => void): void {
    this.onModeChangeCb = cb;
  }

  public setMode(newMode: ExperienceMode): void {
    if (this.mode === newMode) return;
    this.mode = newMode;

    const isGameplay = newMode === "playing";
    this.inputManager.setGameplayActive(isGameplay);

    if (this.onModeChangeCb) {
      this.onModeChangeCb(newMode);
    }
  }

  public getMode(): ExperienceMode {
    return this.mode;
  }

  public getPlayerState() {
    return this.player.state;
  }

  public startGame(): void {
    this.player.reset(0, 0);
    this.setMode("playing");
  }

  public pauseGame(): void {
    if (this.mode === "playing") {
      this.setMode("paused");
    }
  }

  public resumeGame(): void {
    if (this.mode === "paused") {
      this.setMode("playing");
    }
  }

  public returnToPortfolio(): void {
    this.setMode("portfolio");
  }

  public resize(width: number, height: number): void {
    if (!this.renderer) return;
    this.renderer.setSize(width, height, false);
    this.cameraController.resize(width, height);
  }

  private startLoop(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();

    const loop = (currentTime: number) => {
      if (!this.isRunning) return;

      // Delta time capped at 0.1s to avoid huge jumps on tab switch
      const rawDt = (currentTime - this.lastTime) * 0.001;
      const dt = Math.min(rawDt, 0.1);
      this.lastTime = currentTime;

      this.update(dt);
      this.render();

      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  private update(dt: number): void {
    // Check pause key during gameplay
    if (this.mode === "playing" && this.inputManager.isJustPressed("Escape")) {
      this.pauseGame();
    }

    if (this.mode === "playing") {
      this.player.update(this.inputManager, dt, this.sceneManager.groundY);
    }

    this.sceneManager.updateAmbient(dt, this.reducedMotion);

    const isGameplay = this.mode === "playing" || this.mode === "paused";
    this.cameraController.update(
      this.player.state.position.x,
      this.player.state.position.y,
      dt,
      isGameplay
    );

    this.inputManager.clearFrameEvents();
  }

  private render(): void {
    if (!this.renderer) return;
    this.renderer.render(this.sceneManager.scene, this.cameraController.camera);
  }

  public dispose(): void {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    this.inputManager.detach();
    this.player.dispose();
    this.sceneManager.dispose();

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
  }
}
