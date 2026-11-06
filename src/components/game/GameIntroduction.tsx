import React from "react";

interface GameIntroductionProps {
  onStart: () => void;
  onBackToPortfolio: () => void;
}

export const GameIntroduction: React.FC<GameIntroductionProps> = ({
  onStart,
  onBackToPortfolio,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[#131f27]/90 border-2 border-white/60 rounded-xl max-w-lg mx-auto shadow-2xl backdrop-blur-md text-white text-center">
      <h2 className="text-3xl font-bold text-[#ff8408] mb-2">The Terminal Arena</h2>
      <p className="text-sm text-wheat italic mb-6">
        Step behind the portfolio into the interactive prototype.
      </p>

      <div className="bg-[#0e141a]/80 p-4 rounded-lg w-full text-left text-sm mb-6 border border-white/20">
        <h4 className="font-semibold text-[#ff8408] mb-2 uppercase tracking-wider text-xs">
          Controls:
        </h4>
        <ul className="space-y-1 text-gray-200 text-xs">
          <li>
            <kbd className="px-2 py-0.5 bg-gray-700 rounded border border-gray-500 font-mono">
              A
            </kbd>{" "}
            /{" "}
            <kbd className="px-2 py-0.5 bg-gray-700 rounded border border-gray-500 font-mono">
              D
            </kbd>{" "}
            or Arrows : Move left / right
          </li>
          <li>
            <kbd className="px-2 py-0.5 bg-gray-700 rounded border border-gray-500 font-mono">
              Space
            </kbd>{" "}
            : Jump (supports coyote time & buffer)
          </li>
          <li>
            <kbd className="px-2 py-0.5 bg-gray-700 rounded border border-gray-500 font-mono">
              Shift
            </kbd>{" "}
            : Dash
          </li>
          <li>
            <kbd className="px-2 py-0.5 bg-gray-700 rounded border border-gray-500 font-mono">
              Q
            </kbd>{" "}
            /{" "}
            <kbd className="px-2 py-0.5 bg-gray-700 rounded border border-gray-500 font-mono">
              E
            </kbd>{" "}
            : <strong>Select Target</strong> (Cycles target to left / right; active = orange)
          </li>
          <li>
            <kbd className="px-2 py-0.5 bg-cyan-900 border border-cyan-400 text-cyan-200 font-mono">
              Hold W / ↑
            </kbd>{" "}
            : <strong>Fire & Hold Hook</strong> (Sticks to target as long as W is held)
          </li>
          <li>
            <kbd className="px-2 py-0.5 bg-amber-900 border border-amber-400 text-amber-200 font-mono">
              Hold Space (while hooked)
            </kbd>{" "}
            : <strong>Retract Rope</strong> (Pulls in rope to gain upward & forward impulse)
          </li>
          <li>
            <kbd className="px-2 py-0.5 bg-gray-700 rounded border border-gray-500 font-mono">
              Esc
            </kbd>{" "}
            : Pause
          </li>
        </ul>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onStart}
          className="px-6 py-2.5 bg-[#ff8408] hover:bg-[#e07507] text-white font-semibold rounded-lg shadow transition cursor-pointer"
        >
          Start Playing
        </button>
        <button
          type="button"
          onClick={onBackToPortfolio}
          className="px-5 py-2.5 bg-transparent hover:bg-white/10 text-wheat border border-wheat/60 rounded-lg transition cursor-pointer"
        >
          Back to Top
        </button>
      </div>
    </div>
  );
};
