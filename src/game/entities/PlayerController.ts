import { InputManager } from "../input/InputManager";
import { PlayerMovementConfig, PlayerState } from "./PlayerTypes";
import { PlatformBox, GrappleAnchor } from "../world/CityTypes";
import * as THREE from "three";

export class PlayerController {
  public static update(
    state: PlayerState,
    config: PlayerMovementConfig,
    input: InputManager,
    dt: number,
    groundY: number,
    platforms: PlatformBox[] = [],
    anchors: GrappleAnchor[] = []
  ): void {
    const prevY = state.position.y;

    // 1. Dash timers
    if (state.dashCooldownRemaining > 0) {
      state.dashCooldownRemaining = Math.max(0, state.dashCooldownRemaining - dt);
    }

    if (state.isDashing) {
      state.dashTimeRemaining -= dt;
      if (state.dashTimeRemaining <= 0) {
        state.isDashing = false;
      } else {
        state.velocity.x = state.facing * config.dashSpeed;
        state.velocity.y = 0;
        state.position.x += state.velocity.x * dt;
        return;
      }
    }

    // Decrement manual override timer for target selection if active
    if (state.grapple.manualOverrideTimer > 0) {
      state.grapple.manualOverrideTimer = Math.max(0, state.grapple.manualOverrideTimer - dt);
    }

    // 2. Target Selection (Q = previous/left, E = next/right) and Hookshot firing (Hold W / ArrowUp)
    // Hookable candidates: overhead, within max distance (36 units), in front or above
    const maxDistance = 36;
    const candidates: GrappleAnchor[] = [];

    for (const anchor of anchors) {
      const dx = anchor.x - state.position.x;
      const dy = anchor.y - (state.position.y + 1.2);
      const dist = Math.hypot(dx, dy);

      // Must be overhead (dy > 0.8) and within reachable distance
      if (dy > 1.0 && dist <= maxDistance) {
        candidates.push(anchor);
      }
    }

    // Sort candidates horizontally from left to right
    candidates.sort((a, b) => a.x - b.x);

    // Update target selection
    if (candidates.length > 0) {
      const currentIndex = candidates.findIndex((a) => a.id === state.grapple.selectedAnchorId);

      const qPressed = input.isJustPressed("KeyQ");
      const ePressed = input.isJustPressed("KeyE");

      if (qPressed || ePressed) {
        // User manually cycled target -> lock manual selection for 2.0 seconds
        state.grapple.manualOverrideTimer = 2.0;
        if (qPressed) {
          if (currentIndex > 0) {
            state.grapple.selectedAnchorId = candidates[currentIndex - 1].id;
          } else {
            state.grapple.selectedAnchorId = candidates[candidates.length - 1].id;
          }
        } else if (ePressed) {
          if (currentIndex >= 0 && currentIndex < candidates.length - 1) {
            state.grapple.selectedAnchorId = candidates[currentIndex + 1].id;
          } else {
            state.grapple.selectedAnchorId = candidates[0].id;
          }
        }
      } else if (!state.grapple.isHooked && !state.grapple.isFlying) {
        // When not hooked, dynamic retargeting happens frequently as player moves:
        // If manual override expired or current target is no longer a valid candidate, auto-pick best target
        if (state.grapple.manualOverrideTimer <= 0 || currentIndex === -1) {
          let bestScore = Infinity;
          let autoChosen = candidates[0];
          for (const c of candidates) {
            const dx = c.x - state.position.x;
            const dy = c.y - (state.position.y + 1.2);
            const dist = Math.hypot(dx, dy);
            // Strong forward preference based on facing direction and proximity
            const forwardBias = dx * state.facing;
            const score = dist - forwardBias * 1.8;
            if (score < bestScore) {
              bestScore = score;
              autoChosen = c;
            }
          }
          state.grapple.selectedAnchorId = autoChosen.id;
        }
      }
    } else {
      state.grapple.selectedAnchorId = null;
    }

    // Hook Trigger & Hold input: 'KeyW' or 'ArrowUp'
    const hookPressed = input.isJustPressed("KeyW") || input.isJustPressed("ArrowUp");
    const hookHeld = input.isDown("KeyW") || input.isDown("ArrowUp");

    // Release hookshot ONLY when W is released
    if (state.grapple.isHooked || state.grapple.isFlying) {
      if (!hookHeld) {
        state.grapple.isHooked = false;
        state.grapple.isFlying = false;
      }
    } else if (hookPressed) {
      // Find the currently selected anchor (or first candidate)
      const targetAnchor =
        candidates.find((a) => a.id === state.grapple.selectedAnchorId) ||
        candidates[0];

      if (targetAnchor) {
        state.grapple.isFlying = true;
        state.grapple.flyProgress = 0;
        state.grapple.anchorX = targetAnchor.x;
        state.grapple.anchorY = targetAnchor.y;
        state.grapple.hookTipX = state.position.x;
        state.grapple.hookTipY = state.position.y + 1.0;
        state.grounded = false;
      }
    }

    // Advance hook projectile flight animation if in flight
    if (state.grapple.isFlying) {
      state.grapple.flyProgress += dt * 7.5; // very fast web shoot
      if (state.grapple.flyProgress >= 1.0) {
        state.grapple.isFlying = false;
        state.grapple.isHooked = true;
        state.grapple.hookTipX = state.grapple.anchorX;
        state.grapple.hookTipY = state.grapple.anchorY;

        const currentDist = Math.hypot(
          state.grapple.anchorX - state.position.x,
          state.grapple.anchorY - (state.position.y + 1.0)
        );
        // Rest length is set exactly to current distance upon latching (no initial yank/jerk)
        state.grapple.restLength = currentDist;
        state.grapple.currentLength = currentDist;
        state.grapple.tension = 1.0;
      } else {
        const startHandX = state.position.x + state.facing * 0.2;
        const startHandY = state.position.y + 1.0;
        state.grapple.hookTipX = THREE.MathUtils.lerp(startHandX, state.grapple.anchorX, state.grapple.flyProgress);
        state.grapple.hookTipY = THREE.MathUtils.lerp(startHandY, state.grapple.anchorY, state.grapple.flyProgress);
      }
    }

    // 3. Horizontal direction input
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

    // 4. Elastic Rope & Web-Swing Physics integration when hooked
    if (state.grapple.isHooked) {
      const handY = state.position.y + 1.0;
      const dx = state.grapple.anchorX - state.position.x;
      const dy = state.grapple.anchorY - handY;
      const dist = Math.hypot(dx, dy);

      state.grapple.currentLength = dist;

      // Space key to reel in cable (Attack on Titan / ODM style gas reel & swing)
      const isRetracting = input.isDown("Space");
      if (isRetracting) {
        // Smooth continuous reel rate
        state.grapple.restLength = Math.max(2.5, state.grapple.restLength - 13 * dt);

        if (dist > 0.1) {
          const ux = dx / dist;
          const uy = dy / dist;

          // Tangential direction of swing: perpendicular to rope vector (-uy, ux)
          const swingDir = state.velocity.x !== 0 ? Math.sign(state.velocity.x) : state.facing;
          const tx = -uy * swingDir;
          const ty = ux * swingDir;

          // Measured boost along arc and reel
          const radialBoost = 15;
          const arcBoost = 22;

          state.velocity.x += (ux * radialBoost + tx * arcBoost) * dt;
          state.velocity.y += (uy * radialBoost + ty * arcBoost) * dt;
        }
      }

      // Spring-Tether Physics with Critical Damping (Taut wire spring, not a loose rubber band):
      // Provides natural elastic give & bounce at the bottom of the swing arc without oscillating wildly
      if (dist > state.grapple.restLength) {
        const stretch = dist - state.grapple.restLength;
        state.grapple.tension = 1.0 + stretch / state.grapple.restLength;

        const ux = dx / dist;
        const uy = dy / dist;

        // Relative velocity along rope axis
        const velAlongRope = state.velocity.x * ux + state.velocity.y * uy;

        // Spring stiffness with heavy critical damping:
        // High stiffness (tight cable spring) + high damping stops rubber-band flinging
        const springStiffness = isRetracting ? 75 : 55;
        const springDamping = 6.5; // Critical damping prevents oscillating rebound

        const springForce = springStiffness * stretch;
        const dampingForce = springDamping * velAlongRope;
        const totalPull = springForce + dampingForce;

        state.velocity.x += ux * totalPull * dt;
        state.velocity.y += uy * totalPull * dt;

        // Hard maximum stretch boundary (max 8% extension) to firmly keep it feeling like a cable
        const maxDist = state.grapple.restLength * 1.08;
        if (dist > maxDist) {
          state.position.x = state.grapple.anchorX - ux * maxDist;
          state.position.y = state.grapple.anchorY - uy * maxDist - 1.0;
          if (velAlongRope < 0) {
            state.velocity.x -= velAlongRope * ux;
            state.velocity.y -= velAlongRope * uy;
          }
        }
      } else {
        // Inside arc radius: cable goes limp/slack
        state.grapple.tension = dist / Math.max(0.1, state.grapple.restLength);
        if (isRetracting) {
          state.grapple.restLength = Math.max(2.5, dist);
        }
      }

      // Normal gravity
      state.velocity.y -= config.gravity * dt;

      // Player directional steering (adds tangential control)
      if (moveDir !== 0) {
        state.velocity.x += moveDir * 22 * dt;
      }

      // Aerodynamic drag & speed limit to keep swinging grounded and controllable
      const maxSwingSpeed = 28;
      const speed = Math.hypot(state.velocity.x, state.velocity.y);
      if (speed > maxSwingSpeed) {
        const scale = maxSwingSpeed / speed;
        state.velocity.x *= scale;
        state.velocity.y *= scale;
      }

      state.velocity.x *= 0.995;
      state.velocity.y *= 0.995;

      // Integrate position
      state.position.x += state.velocity.x * dt;
      state.position.y += state.velocity.y * dt;

      // Ground collision while swinging
      if (state.position.y <= groundY) {
        state.position.y = groundY;
        state.velocity.y = 0;
        state.grounded = true;
      }

      return; // Elastic dynamics handled
    }

    // 5. Normal Horizontal acceleration / friction
    const accel = state.grounded ? config.groundAcceleration : config.airAcceleration;
    const targetVx = moveDir * config.moveSpeed;

    if (moveDir !== 0) {
      if (state.velocity.x < targetVx) {
        state.velocity.x = Math.min(targetVx, state.velocity.x + accel * dt);
      } else if (state.velocity.x > targetVx) {
        state.velocity.x = Math.max(targetVx, state.velocity.x - accel * dt);
      }
    } else {
      if (state.grounded) {
        if (state.velocity.x > 0) {
          state.velocity.x = Math.max(0, state.velocity.x - config.groundFriction * dt);
        } else if (state.velocity.x < 0) {
          state.velocity.x = Math.min(0, state.velocity.x + config.groundFriction * dt);
        }
      } else {
        const airDrag = config.airAcceleration * 0.4;
        if (state.velocity.x > 0) {
          state.velocity.x = Math.max(0, state.velocity.x - airDrag * dt);
        } else if (state.velocity.x < 0) {
          state.velocity.x = Math.min(0, state.velocity.x + airDrag * dt);
        }
      }
    }

    // 6. Dash trigger
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

    // 7. Jump buffers & Coyote time
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

    // 8. Jump execution
    if (state.jumpBufferRemaining > 0 && state.coyoteTimeRemaining > 0) {
      state.velocity.y = config.jumpVelocity;
      state.jumpBufferRemaining = 0;
      state.coyoteTimeRemaining = 0;
      state.grounded = false;
    }

    // 9. Gravity
    if (!state.grounded) {
      state.velocity.y = Math.max(-config.maxFallSpeed, state.velocity.y - config.gravity * dt);
    }

    // 10. Horizontal Integration
    state.position.x += state.velocity.x * dt;

    // 11. Vertical Integration
    state.position.y += state.velocity.y * dt;

    // 12. Platform & Ground Collisions
    let highestSupportY = groundY;
    let isOnPlatform = false;
    const playerHalfW = 0.35;

    for (const plat of platforms) {
      const platLeft = plat.x - plat.width / 2;
      const platRight = plat.x + plat.width / 2;
      const platTop = plat.y + plat.height / 2;

      const overlapsX =
        state.position.x + playerHalfW > platLeft &&
        state.position.x - playerHalfW < platRight;

      if (overlapsX) {
        if (
          state.velocity.y <= 0 &&
          prevY >= platTop - 0.25 &&
          state.position.y <= platTop
        ) {
          if (platTop > highestSupportY) {
            highestSupportY = platTop;
            isOnPlatform = true;
          }
        }
      }
    }

    if (isOnPlatform || state.position.y <= groundY) {
      state.position.y = highestSupportY;
      state.velocity.y = 0;
      state.grounded = true;
    } else {
      state.grounded = false;
    }
  }
}
