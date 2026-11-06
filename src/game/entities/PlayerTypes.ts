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

export interface GrappleState {
  isHooked: boolean;
  anchorX: number;
  anchorY: number;
  restLength: number; // Resting/equilibrium length of the elastic rope
  currentLength: number; // Current distance to anchor
  tension: number; // Normalized tension (0 = limp, >1 = stretched)
  isFlying: boolean; // Hook is in flight towards anchor
  flyProgress: number; // 0 to 1
  hookTipX: number;
  hookTipY: number;
  selectedAnchorId: string | null;
  manualOverrideTimer: number; // Cooldown timer when user manually selects target via Q/E
}

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
  grapple: GrappleState;
}
