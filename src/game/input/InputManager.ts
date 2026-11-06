export class InputManager {
  private activeKeys = new Set<string>();
  private justPressedKeys = new Set<string>();
  private isListening = false;
  private isGameplayActive = false;

  private onKeyDown = (e: KeyboardEvent) => {
    // Only capture keys if gameplay is active
    if (!this.isGameplayActive) return;

    // Prevent scrolling or browser defaults for game keys during gameplay
    if (
      [
        "KeyA",
        "KeyD",
        "KeyQ",
        "KeyE",
        "KeyW",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "Space",
        "ShiftLeft",
        "ShiftRight",
        "Escape",
      ].includes(e.code)
    ) {
      e.preventDefault();
    }

    if (!this.activeKeys.has(e.code)) {
      this.justPressedKeys.add(e.code);
    }
    this.activeKeys.add(e.code);
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.activeKeys.delete(e.code);
  };

  private onBlur = () => {
    this.reset();
  };

  public attach(): void {
    if (this.isListening) return;
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("blur", this.onBlur);
    document.addEventListener("visibilitychange", this.onBlur);
    this.isListening = true;
  }

  public detach(): void {
    if (!this.isListening) return;
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("blur", this.onBlur);
    document.removeEventListener("visibilitychange", this.onBlur);
    this.reset();
    this.isListening = false;
  }

  public setGameplayActive(active: boolean): void {
    this.isGameplayActive = active;
    if (!active) {
      this.reset();
    }
  }

  public isDown(code: string): boolean {
    return this.activeKeys.has(code);
  }

  public isJustPressed(code: string): boolean {
    return this.justPressedKeys.has(code);
  }

  public clearFrameEvents(): void {
    this.justPressedKeys.clear();
  }

  public reset(): void {
    this.activeKeys.clear();
    this.justPressedKeys.clear();
  }
}
