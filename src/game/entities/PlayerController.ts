import { InputManager } from "../input/InputManager";
import { PlayerMovementConfig, PlayerState } from "./PlayerTypes";

export class PlayerController {
  public static update(
    state: PlayerState,
    config: PlayerMovementConfig,
    input: InputManager,
    dt: number,
    groundY: number
  ): void {
    // 1. Dash timers
    if (state.dashCooldownRemaining > 0) {
      state.dashCooldownRemaining = Math.max(0, state.dashCooldownRemaining - dt);
    }

    if (state.isDashing) {
      state.dashTimeRemaining -= dt;
      if (state.dashTimeRemaining <= 0) {
        state.isDashing = false;
      } else {
        // Continue dash motion horizontally
        state.velocity.x = state.facing * config.dashSpeed;
        state.velocity.y = 0;
        state.position.x += state.velocity.x * dt;
        return; // Dashing overrides normal movement and gravity
      }
    }

    // 2. Horizontal direction input
    let moveDir = 0;
    if (input.isDown("KeyA") || input.isDown("ArrowLeft")) {
      moveDir -= 1;
    }
    if (input.isDown("KeyD") || input.isDown("ArrowRight")) {
      moveDir += 1;
    }

    if (moveDir !== 0) {
      state.facing = moveDir > 0 ? 1 : -1;
    }

    // 3. Horizontal acceleration / friction
    const accel = state.grounded ? config.groundAcceleration : config.airAcceleration;
    const targetVx = moveDir * config.moveSpeed;

    if (moveDir !== 0) {
      if (state.velocity.x < targetVx) {
        state.velocity.x = Math.min(targetVx, state.velocity.x + accel * dt);
      } else if (state.velocity.x > targetVx) {
        state.velocity.x = Math.max(targetVx, state.velocity.x - accel * dt);
      }
    } else {
      // Deceleration / friction
      if (state.grounded) {
        if (state.velocity.x > 0) {
          state.velocity.x = Math.max(0, state.velocity.x - config.groundFriction * dt);
        } else if (state.velocity.x < 0) {
          state.velocity.x = Math.min(0, state.velocity.x + config.groundFriction * dt);
        }
      } else {
        // Light air drag
        const airDrag = config.airAcceleration * 0.4;
        if (state.velocity.x > 0) {
          state.velocity.x = Math.max(0, state.velocity.x - airDrag * dt);
        } else if (state.velocity.x < 0) {
          state.velocity.x = Math.min(0, state.velocity.x + airDrag * dt);
        }
      }
    }

    // 4. Dash trigger
    const dashPressed = input.isJustPressed("ShiftLeft") || input.isJustPressed("ShiftRight");
    if (dashPressed && state.dashCooldownRemaining <= 0 && !state.isDashing) {
      state.isDashing = true;
      state.dashTimeRemaining = config.dashDuration;
      state.dashCooldownRemaining = config.dashCooldown;
      state.velocity.x = state.facing * config.dashSpeed;
      state.velocity.y = 0;
      state.position.x += state.velocity.x * dt;
      return;
    }

    // 5. Jump buffers & Coyote time
    if (state.grounded) {
      state.coyoteTimeRemaining = config.coyoteTimeWindow;
    } else {
      state.coyoteTimeRemaining = Math.max(0, state.coyoteTimeRemaining - dt);
    }

    if (input.isJustPressed("Space")) {
      state.jumpBufferRemaining = config.jumpBufferWindow;
    } else {
      state.jumpBufferRemaining = Math.max(0, state.jumpBufferRemaining - dt);
    }

    // 6. Jump execution
    if (state.jumpBufferRemaining > 0 && state.coyoteTimeRemaining > 0) {
      state.velocity.y = config.jumpVelocity;
      state.jumpBufferRemaining = 0;
      state.coyoteTimeRemaining = 0;
      state.grounded = false;
    }

    // 7. Gravity
    if (!state.grounded) {
      state.velocity.y = Math.max(-config.maxFallSpeed, state.velocity.y - config.gravity * dt);
    }

    // 8. Integration
    state.position.x += state.velocity.x * dt;
    state.position.y += state.velocity.y * dt;

    // 9. Ground collision (simple flat floor)
    if (state.position.y <= groundY) {
      state.position.y = groundY;
      state.velocity.y = 0;
      state.grounded = true;
    } else {
      state.grounded = false;
    }
  }
}
