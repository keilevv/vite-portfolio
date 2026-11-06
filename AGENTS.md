# Vite Portfolio + Interactive Roguelite — Workspace Rules & Agent Instructions

This document governs agent behavior when working inside the `vite-portfolio` repository.

## 1. Core Principles & Philosophy
- **Portfolio Preservation**: The website and the game are two states of one continuous world. Never break, overwrite, or compromise the existing portfolio content, layout, responsive design, external links, or text selection.
- **Incremental & Phased Execution**: Always adhere to the milestones outlined in [`docs/interactive-portfolio-game-foundation-plan.md`](file:///home/keilevv/projects/vite-portfolio/docs/interactive-portfolio-game-foundation-plan.md). Never jump ahead to complex features (e.g., combat, procedural generation, enemy AI) until the foundational movement and world systems are validated.
- **Separation of Simulation & Rendering**: Keep gameplay math, state machines, and input processing completely decoupled from React render lifecycles and Three.js scene updates.
- **Zero Input Hijacking**: Game controls must strictly be scoped to active gameplay (`playing`). When in `portfolio` or `game-intro` modes, keyboard navigation, form inputs, and window scrolling must never be intercepted or default-prevented.
- **Performance & Cleanup**: Maintain a single animation loop (`requestAnimationFrame`) and a single `WebGLRenderer` instance. Properly dispose of geometries, materials, listeners, and intervals on unmount to prevent WebGL memory leaks or duplicate loops in React Strict Mode.

## 2. Technical Stack & Conventions
- **Package Manager & Tooling**: `npm` for package management and script execution (e.g., `npm run dev`, `npm run build`, `npm run lint`).
- **Core Framework**: React 18 with TypeScript in ESM mode (`"type": "module"` in `package.json`).
- **Build System**: Vite 6.
- **Styling**: Tailwind CSS v4 alongside modular CSS files (`src/style.css`, component-level stylesheets).
- **3D & Game Engine**: Three.js (`three`, `@types/three`) utilizing an Orthographic Camera for a 2.5D perspective.
- **State Management**:
  - Zustand (`src/store/useStore.ts`) for global portfolio configuration (e.g., language selection).
  - React state for high-level UI modes (`ExperienceMode`: `"portfolio" | "game-intro" | "playing" | "paused"`).
  - Dedicated entity/engine classes (`GameEngine`, `PlayerController`) for pure simulation state.
- **Localization**: `react-intl` with synchronized language definitions in `src/translations/en.tsx` and `src/translations/es.tsx`. Both files must keep identical key sets.

## 3. Development Workflow & Verification
Before marking any task, milestone, or phase complete:
1. Run `npm run build` (`tsc && vite build`) to verify that TypeScript compilation and Vite bundling pass with zero errors.
2. Check for security vulnerabilities using `npm audit` (must remain clean at 0 vulnerabilities).
3. Ensure no artifacts or built bundles (`dist/`) are staged or tracked in Git.
4. Verify both desktop and mobile viewports remain functional and visually aligned.
5. Provide a concise summary of changes, executed commands, and current limitations.

## 4. Key Architectural Reference Points
- [`docs/interactive-portfolio-game-foundation-plan.md`](file:///home/keilevv/projects/vite-portfolio/docs/interactive-portfolio-game-foundation-plan.md): The master specification for the interactive portfolio game architecture.
- [`src/App.tsx`](file:///home/keilevv/projects/vite-portfolio/src/App.tsx): Root layout orchestrating the background 3D canvas, portfolio layer, and game HUD overlays.
- [`src/game/engine/GameEngine.ts`](file:///home/keilevv/projects/vite-portfolio/src/game/engine/GameEngine.ts): Engine coordinator for simulation ticks, rendering, resize handling, and experience modes.
- [`src/game/entities/PlayerController.ts`](file:///home/keilevv/projects/vite-portfolio/src/game/entities/PlayerController.ts): Pure kinematic movement controller (acceleration, jump buffer, coyote time, dash, ground collision).
- [`src/game/input/InputManager.ts`](file:///home/keilevv/projects/vite-portfolio/src/game/input/InputManager.ts): Keyboard tracking via `KeyboardEvent.code` with automatic blur/visibility reset.
