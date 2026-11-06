# Interactive Portfolio + Roguelite --- Foundation Plan

> **Purpose:** Give a VS Code coding agent a clear, incremental
> implementation plan for evolving the existing React + TypeScript +
> Vite portfolio into an interactive portfolio with a persistent
> Three.js game world, then build the first playable character and
> movement controller.
>
> **Important:** This is a foundation plan, not permission to rewrite
> the portfolio. Inspect the repository before changing anything.
> Preserve existing content, styling, routes, components, and working
> behavior unless a change is explicitly required.

------------------------------------------------------------------------

## 1. Product vision

Build a single-page portfolio in which a Three.js environment exists as
a persistent background behind the normal scrollable portfolio content.

The experience has two primary modes:

1.  **Portfolio mode**
    -   Existing portfolio sections remain readable and scroll normally.
    -   A fixed Three.js canvas renders an atmospheric, low-activity
        game environment behind the content.
    -   The background must not interfere with links, text selection,
        scrolling, or accessibility.
    -   The environment is ambient only: no active combat or demanding
        enemy simulation.
2.  **Game introduction and gameplay mode**
    -   When the visitor scrolls to the dedicated game section, the
        portfolio content transitions out of view.
    -   The game introduction fills the viewport and displays a title,
        short description, controls, and a Start button.
    -   Clicking Start transitions into active gameplay without
        navigating to another page or destroying/recreating the
        persistent renderer.
    -   Gameplay supports pausing and returning to the portfolio.

**Design principle:** The website and game should feel like two states
of one continuous world, not a conventional website with an embedded
game.

## 2. Product and technical decisions

Use these as initial defaults. Keep the architecture flexible so they
can be revisited after the first prototype.

-   Framework: preserve the repository's existing React, TypeScript, and
    Vite setup.
-   Rendering: Three.js.
-   Camera: orthographic camera.
-   Gameplay: constrained 2D movement on a plane, presented with a 2.5D
    environment.
-   Character: begin with a simple placeholder mesh or sprite-like
    plane; do not block progress on final art.
-   Input: keyboard first; add touch/gamepad only after desktop movement
    is reliable.
-   Physics: start with a small custom movement/collision controller if
    the prototype only needs a flat ground and simple obstacles. Do not
    add a physics dependency until the requirements justify it.
-   Simulation: keep movement and gameplay logic independent of Three.js
    rendering.
-   UI: React components layered over the canvas.
-   State: React owns high-level experience mode; the game engine owns
    simulation state.
-   Rendering lifecycle: create one renderer and reuse it across
    ambient, intro, and gameplay states.
-   Performance: use delta time, cap unusually large frame deltas,
    handle tab visibility, resize correctly, and dispose GPU resources
    when the application truly unmounts.

Do not introduce a large game framework or unnecessary dependencies.

## 3. Experience state model

Create a typed state model:

``` ts
export type ExperienceMode =
  | "portfolio"
  | "game-intro"
  | "playing"
  | "paused";
```

Expected transitions:

``` text
portfolio
   |
   | game section enters viewport
   v
game-intro
   |
   | visitor presses Start
   v
playing
   |
   | Escape / pause action
   v
paused
   |
   | Resume
   +--------------------> playing
   |
   | Return to portfolio
   v
portfolio
```

Also support returning from `game-intro` to `portfolio` if the visitor
scrolls back above the game section.

Rules: - Scrolling into the game section must not start gameplay
automatically. - The Start button is the only action that starts a
run. - Do not let scroll observer callbacks overwrite `playing` or
`paused`. - Keyboard controls must be disabled outside `playing`. - The
game must not trap the visitor in a full-screen state. - Provide an
obvious way to pause and return to the portfolio. - Respect
`prefers-reduced-motion` for portfolio transitions and ambient effects.

## 4. Layer and page architecture

Use three conceptual layers:

1.  **World layer:** fixed, full-viewport Three.js canvas.
2.  **Portfolio layer:** existing scrollable page content above the
    canvas.
3.  **Game UI layer:** React intro, HUD, pause, and game-over
    interfaces.

The canvas should normally use `pointer-events: none` so it cannot block
the portfolio. Enable game input only through deliberate, accessible
interaction in the game experience. Avoid placing a full-screen
invisible element over the portfolio.

Suggested component boundaries (adapt names to the existing repository):

``` text
src/
  components/
    portfolio/
      ... existing portfolio components ...
    game-ui/
      GameIntroduction.tsx
      GameHUD.tsx
      PauseMenu.tsx
  game/
    engine/
      GameEngine.ts
      GameLoop.ts
      GameTypes.ts
    rendering/
      Renderer.ts
      SceneManager.ts
      CameraController.ts
    input/
      InputManager.ts
    entities/
      Player.ts
      PlayerController.ts
    world/
      Ground.ts
  hooks/
    useExperienceMode.ts
  App.tsx
```

Do not create duplicate versions of existing portfolio components. First
inspect the actual structure and integrate with it.

## 5. Implementation phases

### Phase 0 --- Repository reconnaissance (do this first)

1.  Inspect `package.json`, scripts, dependencies, `src/`, global
    styles, current page composition, and existing routing.
2.  Identify the current portfolio root and the existing section
    components.
3.  Identify how styling, fonts, breakpoints, and navigation are
    implemented.
4.  Run the existing app and record the current baseline.
5.  Report the proposed integration points before making structural
    changes.

**Deliverable:** A short repository map and a concise list of files to
create/change.

**Do not:** replace the portfolio, change its visual identity wholesale,
or install packages without explaining why they are necessary.

### Phase 1 --- Persistent Three.js background

1.  Add a `GameCanvas`/world host component that mounts one canvas.
2.  Initialize one WebGL renderer, scene, and orthographic camera.
3.  Render a simple atmospheric placeholder environment: ground plane, a
    few geometric silhouettes, and restrained ambient lighting.
4.  Keep the canvas fixed to the viewport behind the portfolio.
5.  Ensure the existing content remains scrollable and clickable.
6.  Handle resize, device pixel ratio (with a sensible cap), tab
    visibility, and cleanup.
7.  Add a reduced-motion mode that minimizes or disables ambient
    movement.

**Acceptance criteria:** - Existing portfolio content and navigation
still work. - The canvas stays fixed while the page scrolls. - The
canvas never intercepts normal portfolio interactions. - No duplicate
render loops or renderers are created during React development/Strict
Mode remounts. - No WebGL errors appear during normal use. - The page
remains usable on a smaller viewport.

### Phase 2 --- Portfolio-to-game introduction transition

1.  Add a dedicated game section after the existing portfolio content.
2.  Use an `IntersectionObserver` or equivalent section-visibility
    mechanism to detect when the game section is reached.
3.  Transition the experience mode from `portfolio` to `game-intro`.
4.  Fade/move the portfolio foreground away while revealing the game
    introduction.
5.  Keep the transition short and reversible when the visitor scrolls
    back before gameplay starts.
6.  Add accessible controls and a clear Start button.

**Acceptance criteria:** - The portfolio scroll behavior remains
natural. - The game intro appears at the intended scroll position. -
Scrolling back before starting restores portfolio mode. - No automatic
gameplay begins. - Focus and keyboard navigation remain sensible.

### Phase 3 --- Basic character and movement controller (first playable prototype)

This is the first actual game-development milestone. Build only a simple
test arena and one controllable character. Do not add enemies, combat,
procedural rooms, upgrades, or progression yet.

#### 3.1 Test arena

-   Create a simple ground plane/platform.
-   Use a clear visual marker for the ground and world origin.
-   Use an orthographic camera.
-   Constrain the player to the gameplay plane.
-   Add a placeholder player mesh with a distinct front/side indicator
    so facing direction is visible.
-   Keep the world visually simple; prioritize reliable movement.

#### 3.2 Input requirements

Implement keyboard input using `KeyboardEvent.code`, not character
values.

Initial controls: - `A` / `ArrowLeft`: move left. - `D` / `ArrowRight`:
move right. - `Space`: jump. - `ShiftLeft` / `ShiftRight`: dash (basic
version). - `Escape`: pause gameplay.

Requirements: - Track key-down and key-up state. - Prevent stuck keys
when the browser window loses focus or the tab becomes hidden. - Ignore
repeated keydown events where appropriate. - Do not call
`preventDefault()` globally. Prevent default only for game keys while
gameplay is active and the game has keyboard focus. - Ensure inputs do
not interfere with typing in form fields or normal portfolio navigation.

#### 3.3 Player movement behavior

Implement a small, explicit controller with tunable configuration
values:

``` ts
export interface PlayerMovementConfig {
  moveSpeed: number;
  groundAcceleration: number;
  airAcceleration: number;
  gravity: number;
  jumpVelocity: number;
  maxFallSpeed: number;
  dashSpeed: number;
  dashDuration: number;
  dashCooldown: number;
}
```

Use sensible prototype defaults and keep them centralized. Do not
scatter movement constants through the update code.

Movement features: - Smooth horizontal acceleration and deceleration. -
A maximum horizontal speed. - Gravity and a maximum falling speed. -
Jump only when grounded. - A short coyote-time window (allow jumping
shortly after leaving an edge). - A short jump-buffer window (remember a
jump pressed just before landing). - A dash with a short duration and
cooldown. - Prevent air-jump and repeated dash exploits unless
deliberately configured later. - Track facing direction based on the
latest horizontal input. - Use delta time so movement is frame-rate
independent. - Clamp delta time after tab suspension or a long frame to
avoid large simulation jumps.

For this first version, a simple ground collision is enough. If the
arena only has a flat floor, avoid implementing a general-purpose
platform physics engine.

#### 3.4 Separation of responsibilities

Keep the following responsibilities separate:

-   `InputManager`: records currently held keys and one-frame
    pressed/released events.
-   `PlayerController`: computes movement state from input, config, and
    elapsed time.
-   `Player`: owns gameplay state such as position, velocity, grounded
    state, facing, dash state, and visual representation.
-   `GameEngine`: advances the simulation and coordinates entities.
-   `Renderer` / render system: reads game state and updates Three.js
    objects.

The player controller should not directly create DOM elements or own the
renderer. Rendering code should not decide gameplay rules.

A possible state type:

``` ts
export interface PlayerState {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  grounded: boolean;
  facing: -1 | 1;
  isDashing: boolean;
  dashCooldownRemaining: number;
  coyoteTimeRemaining: number;
  jumpBufferRemaining: number;
}
```

Adapt this to the chosen coordinate system. Keep the coordinate
conventions documented.

#### 3.5 Camera behavior

-   Keep the player visible and centered or slightly off-center.
-   Use an orthographic camera with stable scale.
-   Avoid camera shake for now.
-   Ensure resizing does not distort the gameplay view.
-   Do not let the camera follow tiny movement changes in a jittery way.

#### 3.6 Debug and tuning support

Add a development-only debug overlay or console output that can show: -
Player position and velocity. - Grounded state. - Facing direction. -
Dash cooldown. - Current experience mode.

Keep it disabled in production unless explicitly enabled.

**Acceptance criteria:** - Player moves left and right smoothly. -
Player stops without sliding indefinitely. - Jump works only when
grounded, with coyote time and jump buffering. - Dash works for a
defined duration and respects its cooldown. - The player cannot fall
through the ground. - Movement feels consistent at different frame
rates. - Focus loss cannot leave movement keys stuck. - Controls work
only during gameplay. - Pause reliably stops simulation updates. - The
code is typed, modular, and easy to extend.

### Phase 4 --- Gameplay HUD and pause

After movement is stable: 1. Add a small HUD with health placeholder,
zone/run label, and pause affordance. 2. Add pause/resume and
return-to-portfolio actions. 3. Make sure pause stops simulation updates
but does not destroy the renderer or player. 4. Restore the correct
experience state when resuming.

### Phase 5 --- Future expansion (not part of the first task)

Only after the foundation is working, plan these systems: - Combat and
hit detection. - Enemy base class and simple enemy AI. - Enemy waves and
encounter director. - Modular room templates and procedural room
sequencing. - Seeded random generation for reproducible runs. - Loot and
run-specific upgrades. - Death, permanent currency, and
meta-progression. - Project discovery objects and portfolio dossiers. -
Bosses, environmental hazards, audio, VFX, and polish.

Do not implement these in the initial foundation task.

------------------------------------------------------------------------

## 6. Suggested initial file responsibilities

These are suggested boundaries, not mandatory filenames. Follow existing
repository conventions if they differ.

  -----------------------------------------------------------------------
  Module                              Responsibility
  ----------------------------------- -----------------------------------
  `GameCanvas`                        React host for the persistent
                                      canvas and engine lifecycle

  `GameEngine`                        Owns initialization, update loop,
                                      mode changes, pause and disposal

  `Renderer`                          Owns Three.js renderer and render
                                      configuration

  `SceneManager`                      Creates and manages scene objects

  `CameraController`                  Orthographic camera setup, resize
                                      and follow behavior

  `InputManager`                      Keyboard state and focus-loss
                                      cleanup

  `Player`                            Player data and visual object

  `PlayerController`                  Pure or mostly pure movement
                                      calculations

  `GameIntroduction`                  Instructions and Start button

  `GameHUD`                           Gameplay-only UI

  `PauseMenu`                         Resume and return actions

  `useExperienceMode`                 Connects scroll section visibility
                                      to high-level experience state
  -----------------------------------------------------------------------

## 7. Engineering quality requirements

-   Use strict TypeScript types; avoid `any`.
-   Prefer small modules with clear responsibilities.
-   Keep game simulation independent of React component rendering.
-   Avoid putting the animation loop inside a React render cycle.
-   Use `requestAnimationFrame` with a single controlled loop.
-   Avoid allocating many temporary objects every frame.
-   Reuse Three.js objects and dispose of geometries, materials, and
    renderer resources appropriately.
-   Use `useEffect` cleanup correctly.
-   Ensure React Strict Mode does not create duplicate engines or
    listeners.
-   Avoid global keyboard listeners that hijack the portfolio.
-   Respect reduced motion and provide readable contrast.
-   Test at desktop and narrow viewport sizes.
-   Keep the existing portfolio functional throughout implementation.
-   Explain any dependency addition before installing it.

## 8. Testing checklist

### Existing portfolio regression

-   [x] Existing sections still render.
-   [x] Navigation and external links still work.
-   [x] Scrolling and text selection still work.
-   [x] Existing responsive layouts remain intact.

### Background scene

-   [x] Canvas fills the viewport and stays fixed.
-   [x] Portfolio content appears above it.
-   [x] Canvas does not intercept pointer events.
-   [x] Resize and device-pixel-ratio changes are handled.
-   [x] No duplicate animation loops.
-   [x] Reduced-motion behavior works.

### Experience transitions

-   [x] Entering game section opens introduction.
-   [x] Leaving it before starting returns to portfolio.
-   [x] Start begins gameplay only after click.
-   [x] Pause freezes simulation.
-   [x] Resume continues the same run.
-   [x] Return-to-portfolio works.

### Character controller

-   [x] Left/right movement and facing.
-   [x] Acceleration and deceleration.
-   [x] Jump and landing.
-   [x] Coyote time and jump buffering.
-   [x] Dash duration and cooldown.
-   [x] Ground collision.
-   [x] Frame-rate-independent movement.
-   [x] Focus-loss key reset.
-   [x] Inputs inactive outside gameplay.

------------------------------------------------------------------------

## 9. Instructions to the VS Code agent: execution order

**Start with Phase 0, then implement Phase 1 and Phase 2 only as needed
to provide the context for Phase 3. The immediate goal is a working
basic character and movement controller, not a complete roguelite.**

Follow this exact workflow:

1.  Inspect the repository and summarize its current structure and
    existing portfolio composition.
2.  Identify the smallest safe integration points. Do not rewrite
    existing portfolio sections.
3.  Propose the files you intend to create or modify and explain the
    purpose of each.
4.  Implement the persistent Three.js background foundation.
5.  Implement the portfolio-to-game-introduction state transition.
6.  Implement the simple test arena, placeholder character, keyboard
    input, and movement controller.
7.  Run the available lint, type-check, build, and test scripts. If a
    script does not exist, report that rather than inventing a
    successful result.
8.  Fix errors introduced by your changes.
9.  Summarize changed files, implemented behavior, commands executed,
    test results, and known limitations.
10. Stop before implementing combat, enemies, procedural generation,
    upgrades, or meta-progression.

### Agent guardrails

-   Do not replace the current portfolio with a new template.
-   Do not delete or rename existing components without a demonstrated
    need.
-   Do not add placeholder portfolio copy where real content already
    exists.
-   Do not build the whole game in one pass.
-   Do not install dependencies without explaining the need.
-   Do not silently ignore TypeScript or build errors.
-   Do not claim something was tested if it was not run.
-   If an architectural decision is unclear, inspect the code first and
    choose the least disruptive option. Ask before making a destructive
    or broad change.

## 10. Definition of done for this first milestone

The milestone is complete when:

1.  The original portfolio still works.
2.  A persistent Three.js environment renders behind it.
3.  Scrolling to the game section reveals a game introduction.
4.  Clicking Start enters gameplay without a page reload.
5.  A placeholder character can move, jump, and dash in a simple arena.
6.  Pause and return-to-portfolio work.
7.  The project passes its available type-check/build/lint checks, or
    any pre-existing failures are clearly identified.

**Keep the implementation deliberately small and polished. A reliable
character controller and a convincing transition are more valuable at
this stage than a large collection of unfinished game systems.**
