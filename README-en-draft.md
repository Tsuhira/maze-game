# MAZE // TILT NAVIGATOR

## Overview

MAZE // TILT NAVIGATOR is a browser-based maze game where you tilt your smartphone to roll a glowing ball through procedurally generated neon mazes. On desktop, you can also navigate using keyboard arrow keys or WASD. Race against the clock to reach the goal and advance through increasingly challenging stages.

## Features

- **Procedural maze generation** — every stage creates a unique maze using the Recursive Backtracking algorithm, so no two runs are the same
- **Tilt controls** — on mobile devices, physically tilting your phone steers the ball via the DeviceOrientation API
- **Stage progression** — mazes grow larger with each stage, from a compact 8x10 grid up to a sprawling 20x24
- **Time-based scoring** — clear stages quickly to earn higher scores
- **Neon visual style** — glowing cyan walls, a magenta player ball, and a green goal marker rendered on HTML5 Canvas
- **Zero install** — runs entirely in the browser, no app download or server required

## How to Play

1. Open the game at https://tsuhira.github.io/maze-game in your browser
2. On mobile, grant permission for device orientation when prompted
3. Tilt your device (or press arrow keys / WASD on desktop) to roll the ball
4. Navigate through the maze passages from the **START** cell (top-left) to the **GOAL** cell (bottom-right)
5. Reach the goal to complete the stage — your time and score are recorded
6. Each new stage presents a larger maze; keep clearing stages to reach the maximum size

## Controls

| Platform | Action | Control |
|----------|--------|---------|
| Mobile | Move ball | Tilt device in any direction |
| Desktop | Move up | Arrow Up / W |
| Desktop | Move down | Arrow Down / S |
| Desktop | Move left | Arrow Left / A |
| Desktop | Move right | Arrow Right / D |

## Scoring System

Your score for each stage is calculated based on how quickly you reach the goal and which stage you are on:

- **Base score** — determined by the stage number; later stages award more points
- **Time bonus** — the faster you clear the stage, the higher the bonus (unused seconds are converted to bonus points)
- **Cumulative total** — scores from all completed stages are added together across the run

Clearing large mazes quickly is the key to achieving a high total score.

## Browser Support

| Environment | Support |
|-------------|---------|
| Chrome (Android) | Recommended — full tilt support |
| Safari (iOS) | Supported — may require user gesture to enable motion permission |
| Chrome (Desktop) | Supported — keyboard controls |
| Firefox (Desktop) | Supported — keyboard controls |
| Edge (Desktop) | Supported — keyboard controls |

For the best experience, use a modern Chromium-based browser on Android or Chrome/Safari on iOS. Desktop browsers are fully playable with keyboard controls.
