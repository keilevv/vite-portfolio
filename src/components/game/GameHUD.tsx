import React from "react";

interface GameHUDProps {
  onPause: () => void;
  isPaused: boolean;
  onResume: () => void;
  onExit: () => void;
  health?: number;
  maxHealth?: number;
  showDebug: boolean;
  onToggleDebug: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  onPause,
  isPaused,
  onResume,
  onExit,
  health = 100,
  maxHealth = 100,
  showDebug,
  onToggleDebug,
}) => {
  return (
    <>
      {/* Top HUD overlay */}
      <div className="fixed top-4 left-4 right-4 flex justify-between items-center z-40 pointer-events-auto">
        <div className="flex items-center gap-4">
          <div className="bg-[#131f27]/80 backdrop-blur border border-white/30 px-4 py-2 rounded-lg text-xs text-white">
            <span className="text-[#ff8408] font-bold">ZONE:</span> Movement Test Arena
          </div>

          {/* Health Bar Placeholder */}
          <div className="hidden sm:flex items-center gap-2 bg-[#131f27]/80 backdrop-blur border border-white/30 px-3 py-1.5 rounded-lg text-xs">
            <span className="text-gray-300 font-semibold text-[11px]">HP:</span>
            <div className="w-24 h-2.5 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${(health / maxHealth) * 100}%` }}
              />
            </div>
            <span className="text-gray-400 text-[10px] font-mono">
              {health}/{maxHealth}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={onToggleDebug}
              className={`px-2.5 py-1.5 rounded-lg text-xs border font-mono transition cursor-pointer ${
                showDebug
                  ? "bg-emerald-950 border-emerald-500 text-emerald-300"
                  : "bg-[#131f27]/80 border-white/20 text-gray-400 hover:text-white"
              }`}
            >
              Debug: {showDebug ? "ON" : "OFF"}
            </button>
          )}

          <button
            type="button"
            onClick={isPaused ? onResume : onPause}
            className="bg-[#131f27]/80 hover:bg-[#1a2933] border border-white/40 text-wheat px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
          >
            {isPaused ? "Resume" : "Pause (Esc)"}
          </button>
        </div>
      </div>

      {/* Pause Menu Modal */}
      {isPaused && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
          <div className="bg-[#131f27] border-2 border-white/60 p-6 rounded-xl max-w-sm w-full mx-4 text-center shadow-2xl">
            <h3 className="text-2xl font-bold text-[#ff8408] mb-4">Game Paused</h3>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={onResume}
                className="w-full py-2.5 bg-[#ff8408] hover:bg-[#e07507] text-white font-semibold rounded-lg transition cursor-pointer"
              >
                Resume
              </button>
              <button
                type="button"
                onClick={onExit}
                className="w-full py-2.5 bg-transparent hover:bg-white/10 text-wheat border border-wheat/60 rounded-lg transition cursor-pointer"
              >
                Exit to Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
