export interface PlayerMovementConfig {
  moveSpeed: number;
  groundAcceleration: number;
  airAcceleration: number;
  groundFriction: number;
  gravity: number;
  jumpVelocity: number;
  maxFallSpeed: number;
  dashSpeed: number;
  dashDuration: number;
  dashCooldown: number;
  coyoteTimeWindow: number;
  jumpBufferWindow: number;
}

export const DEFAULT_PLAYER_CONFIG: PlayerMovementConfig = {
  moveSpeed: 10,
  groundAcceleration: 60,
  airAcceleration: 35,
  groundFriction: 45,
  gravity: 28,
  jumpVelocity: 13,
  maxFallSpeed: 20,
  dashSpeed: 22,
  dashDuration: 0.18,
  dashCooldown: 0.8,
  coyoteTimeWindow: 0.12,
  jumpBufferWindow: 0.15,
};

export interface PlayerState {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  grounded: boolean;
  facing: -1 | 1;
  isDashing: boolean;
  dashTimeRemaining: number;
  dashCooldownRemaining: number;
  coyoteTimeRemaining: number;
  jumpBufferRemaining: number;
}
