// =============================================
// Maze Game Engine
// Handles: Ball Physics, Input, Timer, Stages
// =============================================

const GameEngine = (() => {
  // ---- State ----
  let tiltX = 0;
  let tiltY = 0;
  let timerStart = null;
  let timerElapsed = 0;
  let timerRunning = false;
  let currentStage = 1;
  let animFrameId = null;

  // Active key tracking
  const keysDown = new Set();

  // ---- Ball Physics ----

  /**
   * Update ball position based on tilt input and maze collision.
   * @param {Object} ball       - {x, y, vx, vy, radius}
   * @param {number} tiltX      - Left/right tilt angle (-90 to 90 deg)
   * @param {number} tiltY      - Forward/back tilt angle (-90 to 90 deg)
   * @param {Array}  maze       - 2D array of cell objects with {walls: {top,right,bottom,left}}
   * @param {number} cellSize   - Pixel size of each cell
   * @param {number} offsetX    - Canvas X offset for maze drawing
   * @param {number} offsetY    - Canvas Y offset for maze drawing
   * @returns {Object} Updated ball
   */
  function updateBall(ball, tiltX, tiltY, maze, cellSize, offsetX, offsetY) {
    const GRAVITY_FACTOR = 0.3;
    const FRICTION = 0.98;

    // Apply acceleration based on tilt
    ball.vx += tiltX * GRAVITY_FACTOR;
    ball.vy += tiltY * GRAVITY_FACTOR;

    // Apply friction
    ball.vx *= FRICTION;
    ball.vy *= FRICTION;

    // Clamp velocity to prevent tunneling
    const MAX_SPEED = cellSize * 0.4;
    const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
    if (speed > MAX_SPEED) {
      ball.vx = (ball.vx / speed) * MAX_SPEED;
      ball.vy = (ball.vy / speed) * MAX_SPEED;
    }

    // Move ball incrementally for stable collision
    const steps = 3;
    const dxStep = ball.vx / steps;
    const dyStep = ball.vy / steps;

    for (let s = 0; s < steps; s++) {
      ball.x += dxStep;
      ball = resolveWallCollisionX(ball, maze, cellSize, offsetX, offsetY);
      ball.y += dyStep;
      ball = resolveWallCollisionY(ball, maze, cellSize, offsetX, offsetY);
    }

    return ball;
  }

  /**
   * Resolve horizontal wall collisions.
   */
  function resolveWallCollisionX(ball, maze, cellSize, offsetX, offsetY) {
    const rows = maze.length;
    const cols = maze[0].length;

    // Sample multiple points on the ball edge (left and right)
    const probePoints = [
      { dx: -ball.radius, dy: 0 },
      { dx:  ball.radius, dy: 0 },
      { dx: -ball.radius, dy: -ball.radius * 0.6 },
      { dx:  ball.radius, dy: -ball.radius * 0.6 },
      { dx: -ball.radius, dy:  ball.radius * 0.6 },
      { dx:  ball.radius, dy:  ball.radius * 0.6 },
    ];

    for (const p of probePoints) {
      const px = ball.x + p.dx;
      const py = ball.y + p.dy;
      const col = Math.floor((px - offsetX) / cellSize);
      const row = Math.floor((py - offsetY) / cellSize);

      if (row < 0 || row >= rows || col < 0 || col >= cols) continue;

      const cell = maze[row][col];
      const cellLeft   = offsetX + col * cellSize;
      const cellRight  = cellLeft + cellSize;
      const cellTop    = offsetY + row * cellSize;
      const cellBottom = cellTop + cellSize;

      // Left wall
      if (cell.walls.left && p.dx < 0) {
        if (ball.x - ball.radius < cellLeft) {
          ball.x = cellLeft + ball.radius;
          ball.vx = 0;
        }
      }
      // Right wall
      if (cell.walls.right && p.dx > 0) {
        if (ball.x + ball.radius > cellRight) {
          ball.x = cellRight - ball.radius;
          ball.vx = 0;
        }
      }
    }

    // Clamp to maze bounds
    const mazeLeft  = offsetX + ball.radius;
    const mazeRight = offsetX + cols * cellSize - ball.radius;
    if (ball.x < mazeLeft)  { ball.x = mazeLeft;  ball.vx = 0; }
    if (ball.x > mazeRight) { ball.x = mazeRight; ball.vx = 0; }

    return ball;
  }

  /**
   * Resolve vertical wall collisions.
   */
  function resolveWallCollisionY(ball, maze, cellSize, offsetX, offsetY) {
    const rows = maze.length;
    const cols = maze[0].length;

    const probePoints = [
      { dx: 0,               dy: -ball.radius },
      { dx: 0,               dy:  ball.radius },
      { dx: -ball.radius * 0.6, dy: -ball.radius },
      { dx:  ball.radius * 0.6, dy: -ball.radius },
      { dx: -ball.radius * 0.6, dy:  ball.radius },
      { dx:  ball.radius * 0.6, dy:  ball.radius },
    ];

    for (const p of probePoints) {
      const px = ball.x + p.dx;
      const py = ball.y + p.dy;
      const col = Math.floor((px - offsetX) / cellSize);
      const row = Math.floor((py - offsetY) / cellSize);

      if (row < 0 || row >= rows || col < 0 || col >= cols) continue;

      const cell = maze[row][col];
      const cellTop    = offsetY + row * cellSize;
      const cellBottom = cellTop + cellSize;

      // Top wall
      if (cell.walls.top && p.dy < 0) {
        if (ball.y - ball.radius < cellTop) {
          ball.y = cellTop + ball.radius;
          ball.vy = 0;
        }
      }
      // Bottom wall
      if (cell.walls.bottom && p.dy > 0) {
        if (ball.y + ball.radius > cellBottom) {
          ball.y = cellBottom - ball.radius;
          ball.vy = 0;
        }
      }
    }

    // Clamp to maze bounds
    const mazeTop    = offsetY + ball.radius;
    const mazeBottom = offsetY + rows * cellSize - ball.radius;
    if (ball.y < mazeTop)    { ball.y = mazeTop;    ball.vy = 0; }
    if (ball.y > mazeBottom) { ball.y = mazeBottom; ball.vy = 0; }

    return ball;
  }

  // ---- Input Control ----

  /**
   * Handle DeviceOrientation events (mobile tilt).
   * beta  = front/back tilt → tiltY
   * gamma = left/right tilt → tiltX
   */
  function handleDeviceOrientation(event) {
    tiltX = clamp(event.gamma ?? 0, -90, 90);
    tiltY = clamp(event.beta  ?? 0, -90, 90);
  }

  /**
   * Handle keyboard arrow keys — map to ±20 degree tilt equivalents.
   */
  function handleKeyDown(event) {
    keysDown.add(event.key);
    applyKeyTilt();
    // Prevent page scroll on arrow keys
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)) {
      event.preventDefault();
    }
  }

  /**
   * Reset tilt axes when keys are released.
   */
  function handleKeyUp(event) {
    keysDown.delete(event.key);
    applyKeyTilt();
  }

  function applyKeyTilt() {
    const TILT_AMOUNT = 20;
    let tx = 0;
    let ty = 0;
    if (keysDown.has('ArrowLeft'))  tx -= TILT_AMOUNT;
    if (keysDown.has('ArrowRight')) tx += TILT_AMOUNT;
    if (keysDown.has('ArrowUp'))    ty -= TILT_AMOUNT;
    if (keysDown.has('ArrowDown'))  ty += TILT_AMOUNT;
    tiltX = tx;
    tiltY = ty;
  }

  /**
   * Request iOS DeviceOrientation permission (required on iOS 13+).
   * Call this from a user gesture (e.g. button click).
   * @returns {Promise<boolean>} true if permission granted
   */
  async function requestPermission() {
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const result = await DeviceOrientationEvent.requestPermission();
        return result === 'granted';
      } catch (e) {
        console.error('DeviceOrientation permission error:', e);
        return false;
      }
    }
    // Non-iOS: permission not required
    return true;
  }

  // ---- Timer ----

  /** Start the game timer. */
  function startTimer() {
    timerStart = Date.now();
    timerRunning = true;
    timerElapsed = 0;
  }

  /**
   * Stop the timer.
   * @returns {number} Elapsed time in seconds (1 decimal)
   */
  function stopTimer() {
    if (!timerRunning) return timerElapsed;
    timerElapsed = (Date.now() - timerStart) / 1000;
    timerRunning = false;
    return parseFloat(timerElapsed.toFixed(1));
  }

  /**
   * Update the HUD timer display element (#timeDisplay).
   */
  function updateTimer() {
    const el = document.getElementById('timeDisplay');
    if (!el) return;
    const elapsed = timerRunning
      ? (Date.now() - timerStart) / 1000
      : timerElapsed;
    el.textContent = elapsed.toFixed(1) + 's';
  }

  // ---- Stage Management ----

  /**
   * Check if ball has reached the goal cell.
   * @returns {boolean}
   */
  function checkGoal(ball, maze, cellSize, offsetX, offsetY) {
    const rows = maze.length;
    const cols = maze[0].length;
    // Goal is bottom-right cell
    const goalCol = cols - 1;
    const goalRow = rows - 1;
    const goalCenterX = offsetX + goalCol * cellSize + cellSize / 2;
    const goalCenterY = offsetY + goalRow * cellSize + cellSize / 2;
    const threshold = cellSize * 0.35;
    const dx = ball.x - goalCenterX;
    const dy = ball.y - goalCenterY;
    return Math.sqrt(dx * dx + dy * dy) < threshold;
  }

  /**
   * Advance to next stage: increase maze size, regenerate, redraw.
   * Calls global functions: generateMaze, drawMaze, drawBall, drawGoal.
   */
  function nextStage() {
    currentStage++;

    const BASE_COLS = 8;
    const BASE_ROWS = 10;
    const STAGE_INC = 2;
    const MAX_COLS  = 20;
    const MAX_ROWS  = 24;

    const stageDelta = currentStage - 1;
    const cols = Math.min(BASE_COLS + stageDelta * STAGE_INC, MAX_COLS);
    const rows = Math.min(BASE_ROWS + stageDelta * STAGE_INC, MAX_ROWS);

    // Update stage display
    const stageEl = document.getElementById('stageDisplay');
    if (stageEl) stageEl.textContent = 'Stage ' + currentStage;

    // Regenerate and restart — delegate to global game functions if available
    if (typeof window.__mazeGame !== 'undefined') {
      window.__mazeGame.startStage(rows, cols, currentStage);
    }
  }

  // ---- Game Loop ----

  /**
   * Main game loop (called via requestAnimationFrame).
   * Expects window.__mazeGame to hold shared game state.
   */
  function gameLoop() {
    const g = window.__mazeGame;
    if (!g) return;

    const { ctx, canvas, maze, ball, cellSize, offsetX, offsetY } = g;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw maze
    if (typeof drawMaze === 'function') {
      drawMaze(ctx, maze, cellSize, offsetX, offsetY);
    }

    // Update ball physics
    const updated = updateBall(ball, tiltX, tiltY, maze, cellSize, offsetX, offsetY);
    g.ball = updated;

    // Draw ball
    if (typeof drawBall === 'function') {
      drawBall(ctx, updated);
    }

    // Draw goal marker
    if (typeof drawGoal === 'function') {
      drawGoal(ctx, maze, cellSize, offsetX, offsetY);
    }

    // Update HUD timer
    updateTimer();

    // Check goal
    if (checkGoal(updated, maze, cellSize, offsetX, offsetY)) {
      const elapsed = stopTimer();
      if (typeof onGoalReached === 'function') {
        onGoalReached(elapsed, currentStage);
      } else {
        // Default: show alert then advance
        setTimeout(() => {
          alert(`Stage ${currentStage} クリア! タイム: ${elapsed}秒`);
          nextStage();
        }, 50);
      }
      return; // Pause loop until next stage restarts it
    }

    animFrameId = requestAnimationFrame(gameLoop);
  }

  /**
   * Initialize the game engine.
   * @param {Object} options - {canvas, generateMaze, drawMaze, drawBall, drawGoal, onGoalReached}
   */
  function initGame(options = {}) {
    const canvas = options.canvas || document.getElementById('mazeCanvas');
    if (!canvas) {
      console.error('GameEngine: canvas element not found');
      return;
    }
    const ctx = canvas.getContext('2d');

    // Store global game state
    if (!window.__mazeGame) window.__mazeGame = {};
    window.__mazeGame.canvas  = canvas;
    window.__mazeGame.ctx     = ctx;

    // Stage start helper
    window.__mazeGame.startStage = (rows, cols, stage) => {
      const g = window.__mazeGame;

      // Compute cell size to fit canvas (leave margin)
      const margin = 20;
      const cellW = Math.floor((canvas.width  - margin * 2) / cols);
      const cellH = Math.floor((canvas.height - margin * 2) / rows);
      g.cellSize = Math.max(Math.min(cellW, cellH), 10);

      g.offsetX = Math.floor((canvas.width  - g.cellSize * cols) / 2);
      g.offsetY = Math.floor((canvas.height - g.cellSize * rows) / 2);

      // Generate maze
      const genFn = options.generateMaze || (typeof generateMaze === 'function' ? generateMaze : null);
      if (genFn) {
        g.maze = genFn(rows, cols);
      } else {
        console.warn('GameEngine: generateMaze function not available');
        g.maze = createFallbackMaze(rows, cols);
      }

      // Initial ball position — start cell center (top-left)
      g.ball = {
        x: g.offsetX + g.cellSize / 2,
        y: g.offsetY + g.cellSize / 2,
        vx: 0,
        vy: 0,
        radius: Math.max(Math.floor(g.cellSize * 0.25), 4),
      };

      startTimer();

      // Cancel existing loop and restart
      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(gameLoop);
    };

    // Register input listeners
    window.addEventListener('deviceorientation', handleDeviceOrientation);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup',   handleKeyUp);

    // Store optional callbacks on window for gameLoop access
    if (options.onGoalReached) window.onGoalReached = options.onGoalReached;
    if (options.drawMaze)      window.drawMaze      = options.drawMaze;
    if (options.drawBall)      window.drawBall      = options.drawBall;
    if (options.drawGoal)      window.drawGoal      = options.drawGoal;

    // Start stage 1
    currentStage = 1;
    const stageEl = document.getElementById('stageDisplay');
    if (stageEl) stageEl.textContent = 'Stage 1';

    const BASE_COLS = 8;
    const BASE_ROWS = 10;
    window.__mazeGame.startStage(BASE_ROWS, BASE_COLS, 1);
  }

  // ---- Utility ----

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  /**
   * Minimal fallback maze (all open — no walls except border).
   * Used when generateMaze is unavailable.
   */
  function createFallbackMaze(rows, cols) {
    const maze = [];
    for (let r = 0; r < rows; r++) {
      maze[r] = [];
      for (let c = 0; c < cols; c++) {
        maze[r][c] = {
          walls: {
            top:    r === 0,
            bottom: r === rows - 1,
            left:   c === 0,
            right:  c === cols - 1,
          },
        };
      }
    }
    return maze;
  }

  // ---- Public API ----
  return {
    initGame,
    updateBall,
    handleDeviceOrientation,
    handleKeyDown,
    handleKeyUp,
    requestPermission,
    startTimer,
    stopTimer,
    updateTimer,
    checkGoal,
    nextStage,
    gameLoop,
    getTilt: () => ({ tiltX, tiltY }),
    getStage: () => currentStage,
  };
})();
