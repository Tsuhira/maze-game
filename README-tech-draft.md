# 技術仕様ドラフト / Technical Specification Draft

> このドキュメントはドラフトです。最終版READMEへの統合を前提としています。
> This document is a draft, intended to be merged into the final README.

---

## 🔧 技術仕様 / Technical Specifications

### アーキテクチャ / Architecture

**日本語:**
本ゲームは `index.html` 1ファイルで完結する単一ファイルアーキテクチャを採用しています。
HTML・CSS・JavaScriptをすべて1ファイルにインラインで記述しており、
外部ライブラリ・ビルドツール・サーバーサイド処理は一切不要です。
ブラウザで直接開くか、GitHub Pagesなどの静的ホスティングに配置するだけで動作します。

**English:**
The game uses a single-file architecture, fully contained within `index.html`.
HTML, CSS, and JavaScript are all written inline in one file.
No external libraries, build tools, or server-side processing are required.
It runs by simply opening the file in a browser or hosting it on any static host such as GitHub Pages.

---

### 技術スタック / Tech Stack

| 項目 / Item | 詳細 / Details |
|---|---|
| 言語 / Language | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| 描画 / Rendering | Canvas API (2D Context) |
| 物理エンジン / Physics | カスタム実装 / Custom implementation |
| 入力（スマホ） / Input (Mobile) | DeviceOrientation API (`event.beta` / `event.gamma`) |
| 入力（PC） / Input (Desktop) | Keyboard Events (Arrow Keys) |
| 外部依存 / Dependencies | なし / None |
| デプロイ / Deployment | GitHub Pages (静的ホスティング / Static Hosting) |
| 対応ブラウザ / Browser Support | Chrome, Firefox, Safari, Edge（最新版 / Latest） |

---

### ファイル構成 / File Structure

```
maze-game/
├── index.html          # ゲーム本体（オールインワン） / Main game file (all-in-one)
│                       #   - HTML: UI構造 / UI structure
│                       #   - CSS:  ネオン/サイバーパンクスタイル / Neon cyberpunk styles
│                       #   - JS:   ゲームロジック全体 / Full game logic
├── game-engine.js      # ゲームエンジンモジュール（参照実装） / Game engine module (reference)
├── maze-gen.js         # 迷路生成モジュール（参照実装） / Maze generation module (reference)
└── README-tech-draft.md  # このファイル / This file
```

> **注 / Note:** `game-engine.js` および `maze-gen.js` は開発過程の参照実装です。
> ゲーム本体のロジックは `index.html` 内にインライン化されています。
> `game-engine.js` and `maze-gen.js` are reference implementations from development.
> The game logic is inlined within `index.html`.

---

### アルゴリズム / Algorithms

#### 迷路生成 / Maze Generation

**日本語:**
迷路生成には **再帰的バックトラッキング（Recursive Backtracking）** アルゴリズムを使用しています。

処理の流れ:
1. すべてのセルを「壁あり・未訪問」の状態で初期化する
2. 開始セル (0, 0) から処理を開始し、訪問済みにマークする
3. 隣接する未訪問セルをランダムな順序でシャッフルし、順番に試みる
4. 未訪問の隣接セルが存在する場合、間の壁を取り除き、そのセルへ再帰する
5. すべての隣接セルが訪問済みの場合、再帰から戻る（バックトラック）
6. すべてのセルを訪問し終わったら完了

このアルゴリズムにより、スタート (左上) からゴール (右下) まで必ず解が存在する
完全連結迷路（Perfect Maze）が生成されます。
ランダムシャッフルにより毎回異なる迷路が生成されます。

**English:**
Maze generation uses the **Recursive Backtracking** algorithm (also known as Recursive DFS).

Process:
1. Initialize all cells with all four walls intact and marked as unvisited
2. Begin at cell (0, 0), mark it as visited
3. Shuffle the list of neighboring directions randomly
4. For each unvisited neighbor, remove the shared wall and recurse into that cell
5. If all neighbors are visited, backtrack (return from recursion)
6. Complete when all cells have been visited

This produces a **perfect maze** — a fully connected maze with exactly one path between
any two cells, guaranteeing a unique solution from start (top-left) to goal (bottom-right).
Random shuffling ensures a different layout on every run.

```
// 擬似コード / Pseudocode
function carve(row, col):
    visited[row][col] = true
    for each direction in shuffle([UP, DOWN, LEFT, RIGHT]):
        (nr, nc) = neighbor in that direction
        if in-bounds and not visited[nr][nc]:
            remove wall between (row,col) and (nr,nc)
            carve(nr, nc)   // 再帰 / recurse
```

---

#### 衝突判定 / Collision Detection

**日本語:**
衝突判定はボールの中心座標をもとにセル位置を計算し、
そのセルの壁フラグを参照するセルベース方式です。

X軸・Y軸を独立して処理することで、壁の角への引っかかりを防ぎます。

- `resolveX`: ボールの左右端からY方向に複数の探索点を生成し、
  各点のセル列インデックスを計算。そのセルに左右壁フラグがあればボールを押し戻す。
- `resolveY`: 同様にY方向の壁（上下）を独立して処理する。
- 迷路外周への飛び出しはキャンバス境界でクランプして防止する。

**English:**
Collision detection uses a **cell-based approach**: the ball's center coordinates are used
to determine which maze cell the ball occupies, then the cell's wall flags are checked.

X and Y axes are resolved independently to prevent corner-sticking.

- `resolveX`: Samples multiple probe points along the ball's left/right edges vertically,
  computes the column index for each point, and pushes the ball back if a left/right wall flag is set.
- `resolveY`: Independently resolves top/bottom walls in the same manner.
- Out-of-bounds movement is clamped to the maze boundary.

---

#### 物理シミュレーション / Physics Simulation

**日本語:**
ボールの動きはフレームごとの数値積分によるカスタム物理で実装されています。

| パラメータ | 値 | 説明 |
|---|---|---|
| 加速度係数 | 0.3 | 傾き角度にこの係数を掛けて速度に加算 |
| 摩擦係数 | 0.98 | 毎フレーム速度にこの係数を乗算して減衰 |
| 速度上限 | `cellSize × 0.3` | これを超えた場合は方向を保ったまま制限 |
| サブステップ数 | 5 回 / フレーム | 1フレームを5分割して移動・衝突判定を繰り返す |

サブステップ（5分割）を採用することで、高速移動時に壁を貫通するトンネリングを防止しています。

処理順序（毎フレーム）:
```
速度 += 傾き × 0.3
速度 *= 0.98  (摩擦)
速度 = clamp(速度, MAX_SPD)
5回繰り返す:
    X位置 += vx / 5
    X方向の衝突解決
    Y位置 += vy / 5
    Y方向の衝突解決
```

**English:**
Ball movement is implemented via custom per-frame numerical integration.

| Parameter | Value | Description |
|---|---|---|
| Acceleration factor | 0.3 | Tilt angle multiplied by this factor is added to velocity each frame |
| Friction coefficient | 0.98 | Velocity is multiplied by this value each frame for gradual deceleration |
| Speed limit | `cellSize × 0.3` | Velocity magnitude is clamped while preserving direction |
| Sub-steps per frame | 5 | Each frame is subdivided into 5 move+resolve iterations |

The 5-step sub-step approach prevents **tunneling** — where a fast-moving ball would skip
through a wall in a single frame.

Per-frame update order:
```
velocity += tilt × 0.3
velocity *= 0.98          (friction)
velocity = clamp(velocity, MAX_SPD)
repeat 5 times:
    x += vx / 5
    resolve X-axis collisions
    y += vy / 5
    resolve Y-axis collisions
```

---

### ステージ設計 / Stage Design

**日本語:**
ステージが進むにつれて迷路グリッドサイズが拡大します。

| ステージ / Stage | 列数 / Cols | 行数 / Rows |
|:---:|:---:|:---:|
| 1 | 8 | 10 |
| 2 | 10 | 12 |
| 3 | 12 | 14 |
| … | … | … |
| 最大 / Max | 20 | 24 |

増加式: `cols = min(8 + (stage-1)×2, 20)`、`rows = min(10 + (stage-1)×2, 24)`

**English:**
The maze grid grows as stages progress.

Growth formula: `cols = min(8 + (stage-1)×2, 20)`, `rows = min(10 + (stage-1)×2, 24)`

Cells are sized dynamically to always fill the canvas regardless of grid dimensions.

---

### スコア計算式 / Score Formula

```
Score = max(100, floor(10000 / (time_seconds + 1) × stage_number))
```

**日本語:**
- クリアタイムが短いほど高得点
- ステージ数が大きいほど高得点（ステージ数の乗数）
- 最低スコアは100点（時間がかかりすぎた場合のフロア）
- 各ステージのスコアが累積されて総合スコアになる

**English:**
- Faster completion = higher score
- Later stages multiply the score by stage number
- Minimum score per stage is 100 (floor to avoid zero on long clears)
- Each stage's score is accumulated into a running total

**例 / Example:**
- Stage 1, 10秒クリア / 10 sec clear: `max(100, floor(10000 / 11 × 1))` = **909点 / pts**
- Stage 3, 20秒クリア / 20 sec clear: `max(100, floor(10000 / 21 × 3))` = **1428点 / pts**

---

### 入力システム / Input System

**日本語:**

| デバイス | 入力方法 | 詳細 |
|---|---|---|
| スマートフォン (iOS) | デバイス傾き | `DeviceOrientationEvent.requestPermission()` でパーミッション要求後、`event.gamma` → tiltX、`event.beta` → tiltY |
| スマートフォン (Android) | デバイス傾き | パーミッション不要、即座に `deviceorientation` イベント受信 |
| PC / デスクトップ | 矢印キー | 各キー押下で ±20度相当の傾きをセット、離した時点でリセット |

**English:**

| Device | Input Method | Details |
|---|---|---|
| Smartphone (iOS) | Device tilt | Permission requested via `DeviceOrientationEvent.requestPermission()`; `event.gamma` → tiltX, `event.beta` → tiltY |
| Smartphone (Android) | Device tilt | No permission required; `deviceorientation` events received immediately |
| PC / Desktop | Arrow keys | Each key press sets ±20° equivalent tilt; released keys reset to 0 |

---

### 描画 / Rendering

**日本語:**
描画には HTML5 Canvas API (2D) を使用しています。
毎フレーム `requestAnimationFrame` でキャンバス全体をクリアし再描画します。

描画レイヤー（順序）:
1. スタートセルのハイライト（左上）
2. ゴールセルのハイライト（右下）+ "GOAL" テキスト
3. 迷路の壁線（ネオングロウ効果付き）
4. ボール（グラジェント + グロウ）

ビジュアルテーマはサイバーパンク/ネオン風で、CSS カスタムプロパティで色を管理しています:
- 壁: シアン (`#00e5ff`)
- ゴール: マゼンタ (`#ff00ff`)
- ボール: グリーン (`#00ff88`)

**English:**
Rendering uses the HTML5 Canvas API (2D context).
Each frame, `requestAnimationFrame` clears and redraws the entire canvas.

Draw order per frame:
1. Start cell highlight (top-left)
2. Goal cell highlight (bottom-right) + "GOAL" text
3. Maze walls (with neon glow effect via `shadowBlur`)
4. Ball (radial gradient + glow)

The visual theme is cyberpunk/neon, with colors managed via CSS custom properties:
- Walls: Cyan (`#00e5ff`)
- Goal: Magenta (`#ff00ff`)
- Ball: Green (`#00ff88`)

---

*最終更新 / Last updated: 2026-03-18*
*作成者 / Author: worker3*
