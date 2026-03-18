// Maze Generation Module
// Uses Recursive Backtracking algorithm

/**
 * Generate a maze using Recursive Backtracking
 * @param {number} cols - Number of columns
 * @param {number} rows - Number of rows
 * @returns {Array} 2D array maze[row][col] with {top, right, bottom, left, isGoal} flags
 */
function generateMaze(cols, rows) {
  // Initialize all cells with all walls present
  const maze = [];
  for (let r = 0; r < rows; r++) {
    maze[r] = [];
    for (let c = 0; c < cols; c++) {
      maze[r][c] = { top: true, right: true, bottom: true, left: true, isGoal: false };
    }
  }

  // Mark goal cell
  maze[rows - 1][cols - 1].isGoal = true;

  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));

  // Direction vectors: [row delta, col delta, wall to remove on current, wall to remove on neighbor]
  const directions = [
    { dr: -1, dc: 0, wall: 'top',    opposite: 'bottom' },
    { dr:  1, dc: 0, wall: 'bottom', opposite: 'top'    },
    { dr:  0, dc: 1, wall: 'right',  opposite: 'left'   },
    { dr:  0, dc:-1, wall: 'left',   opposite: 'right'  },
  ];

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function carve(r, c) {
    visited[r][c] = true;
    const dirs = shuffle([...directions]);
    for (const { dr, dc, wall, opposite } of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
        maze[r][c][wall] = false;
        maze[nr][nc][opposite] = false;
        carve(nr, nc);
      }
    }
  }

  // Start carving from top-left (0,0)
  carve(0, 0);

  return maze;
}

/**
 * Draw the maze on a canvas context
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} maze - 2D array from generateMaze()
 * @param {number} cellSize - Size of each cell in pixels
 * @param {number} offsetX - X offset for drawing
 * @param {number} offsetY - Y offset for drawing
 */
function drawMaze(ctx, maze, cellSize, offsetX, offsetY) {
  const rows = maze.length;
  const cols = maze[0].length;

  ctx.save();

  // Draw goal cell highlight
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (maze[r][c].isGoal) {
        ctx.fillStyle = '#00ff88';
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 18;
        ctx.fillRect(
          offsetX + c * cellSize + 2,
          offsetY + r * cellSize + 2,
          cellSize - 4,
          cellSize - 4
        );
        ctx.shadowBlur = 0;

        // Goal label
        ctx.fillStyle = '#003322';
        ctx.font = `bold ${Math.max(10, cellSize * 0.35)}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          'GOAL',
          offsetX + c * cellSize + cellSize / 2,
          offsetY + r * cellSize + cellSize / 2
        );
      }
    }
  }

  // Draw start cell marker
  ctx.fillStyle = 'rgba(255, 255, 0, 0.15)';
  ctx.fillRect(offsetX, offsetY, cellSize, cellSize);
  ctx.fillStyle = '#ffff00';
  ctx.font = `bold ${Math.max(8, cellSize * 0.28)}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('START', offsetX + cellSize / 2, offsetY + cellSize / 2);

  // Wall drawing settings
  ctx.strokeStyle = '#00ffff';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#00ffff';
  ctx.shadowBlur = 6;
  ctx.lineCap = 'round';

  // Draw inner walls
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = offsetX + c * cellSize;
      const y = offsetY + r * cellSize;
      const cell = maze[r][c];

      ctx.beginPath();

      if (cell.top && r === 0) {
        // top boundary drawn separately below
      } else if (cell.top) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + cellSize, y);
      }

      if (cell.right && c === cols - 1) {
        // right boundary
      } else if (cell.right) {
        ctx.moveTo(x + cellSize, y);
        ctx.lineTo(x + cellSize, y + cellSize);
      }

      if (cell.bottom && r === rows - 1) {
        // bottom boundary
      } else if (cell.bottom) {
        ctx.moveTo(x, y + cellSize);
        ctx.lineTo(x + cellSize, y + cellSize);
      }

      if (cell.left && c === 0) {
        // left boundary
      } else if (cell.left) {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + cellSize);
      }

      ctx.stroke();
    }
  }

  // Draw outer boundary
  const totalW = cols * cellSize;
  const totalH = rows * cellSize;

  ctx.strokeStyle = '#00ffff';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#00ffff';
  ctx.shadowBlur = 10;

  ctx.beginPath();
  // Top edge (leave gap at start entry — top-left corner is entry so keep full border)
  ctx.moveTo(offsetX, offsetY);
  ctx.lineTo(offsetX + totalW, offsetY);
  // Right edge
  ctx.moveTo(offsetX + totalW, offsetY);
  ctx.lineTo(offsetX + totalW, offsetY + totalH);
  // Bottom edge
  ctx.moveTo(offsetX, offsetY + totalH);
  ctx.lineTo(offsetX + totalW, offsetY + totalH);
  // Left edge
  ctx.moveTo(offsetX, offsetY);
  ctx.lineTo(offsetX, offsetY + totalH);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draw the player ball
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Center X position
 * @param {number} y - Center Y position
 * @param {number} radius - Ball radius
 */
function drawBall(ctx, x, y, radius) {
  ctx.save();

  // Glow effect
  ctx.shadowColor = '#ff00ff';
  ctx.shadowBlur = 20;

  // Radial gradient for 3D look
  const gradient = ctx.createRadialGradient(
    x - radius * 0.3, y - radius * 0.3, radius * 0.1,
    x, y, radius
  );
  gradient.addColorStop(0, '#ff88ff');
  gradient.addColorStop(0.5, '#ff00ff');
  gradient.addColorStop(1, '#880044');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Specular highlight
  ctx.shadowBlur = 0;
  const specular = ctx.createRadialGradient(
    x - radius * 0.35, y - radius * 0.35, 0,
    x - radius * 0.35, y - radius * 0.35, radius * 0.5
  );
  specular.addColorStop(0, 'rgba(255,255,255,0.7)');
  specular.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = specular;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
