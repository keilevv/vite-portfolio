import React from "react";
import { PlayerState } from "../../game/entities/PlayerTypes";
import { ExperienceMode } from "../../game/engine/GameTypes";

interface DebugOverlayProps {
  playerState: PlayerState;
  mode: ExperienceMode;
}

export const DebugOverlay: React.FC<DebugOverlayProps> = ({ playerState, mode }) => {
  return (
    <div className="fixed bottom-4 left-4 z-40 bg-black/80 border border-emerald-500/50 p-3 rounded text-[11px] font-mono text-emerald-400 pointer-events-none select-none shadow-lg backdrop-blur">
      <div className="font-bold border-b border-emerald-500/30 pb-1 mb-1 text-emerald-300">
        ENGINE DEBUG (Dev Mode)
      </div>
      <div>Mode: <span className="text-white">{mode}</span></div>
      <div>
        Pos: X: <span className="text-white">{playerState.position.x.toFixed(2)}</span>, Y: <span className="text-white">{playerState.position.y.toFixed(2)}</span>
      </div>
      <div>
        Vel: X: <span className="text-white">{playerState.velocity.x.toFixed(2)}</span>, Y: <span className="text-white">{playerState.velocity.y.toFixed(2)}</span>
      </div>
      <div>
        Grounded: <span className={playerState.grounded ? "text-green-400" : "text-yellow-400"}>{String(playerState.grounded)}</span>
      </div>
      <div>
        Facing: <span className="text-white">{playerState.facing === 1 ? "Right (+1)" : "Left (-1)"}</span>
      </div>
      <div>
        Dashing: <span className={playerState.isDashing ? "text-purple-400 font-bold" : "text-gray-400"}>{String(playerState.isDashing)}</span>
      </div>
      <div>
        Dash Cooldown: <span className="text-white">{playerState.dashCooldownRemaining.toFixed(2)}s</span>
      </div>
    </div>
  );
};
