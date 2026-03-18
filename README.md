# 🎮 MAZE // TILT NAVIGATOR

> 🌐 **言語 / Language:** [日本語](#日本語) | [English](#english)

[![Play Now](https://img.shields.io/badge/▶%20Play%20Now-GitHub%20Pages-00f5ff?style=for-the-badge)](https://tsuhira.github.io/maze-game)
[![License](https://img.shields.io/badge/License-MIT-ff00c8?style=flat-square)](LICENSE)
![HTML5](https://img.shields.io/badge/HTML5-Canvas-00ff88?style=flat-square)
![No Dependencies](https://img.shields.io/badge/Dependencies-None-ffee00?style=flat-square)

---

## 日本語

### 概要

スマートフォンを傾けると玉が転がり、迷路のゴールを目指すブラウザゲームです。
デバイスの傾きセンサー（DeviceOrientation API）を利用しており、PCでは矢印キー・WASDでも楽しめます。
迷路はステージごとにランダム生成されるため、毎回異なる経路で攻略する必要があります。

### ✨ 特徴

- **ランダム迷路生成** — 再帰バックトラック法で毎回一意の迷路を生成
- **スマホ直感操作** — DeviceOrientation API によるデバイス傾き入力に対応
- **ステージ進行** — ゴール到達のたびにグリッドが拡大し、難易度が上昇
- **タイム計測** — クリアタイムをリアルタイム表示、スコアに反映
- **サイバーパンク風UI** — ネオン発光・スキャンラインのスタイリッシュデザイン
- **PC・スマホ両対応** — キーボード入力にも完全対応

### 🎮 遊び方

1. [プレイページ](https://tsuhira.github.io/maze-game) をブラウザで開く
2. スマートフォンの場合、傾きセンサーの使用許可を求められたら「許可」をタップ
3. スタート画面の **[ START ]** ボタンを押す
4. デバイスを傾ける（またはキーを押す）と玉が転がり始める
5. 緑色に光る **GOAL** マスに玉を導く
6. ゴール到達でクリア画面が表示され、タイムとスコアが確認できる
7. **[ NEXT STAGE ]** を押すと迷路が拡大した次のステージへ進む

### 🕹️ 操作方法

| 環境 | 操作 |
|------|------|
| スマートフォン | デバイスを上下左右に傾ける |
| PC（矢印キー） | ↑ ↓ ← → キー |
| PC（WASD） | W / A / S / D キー |

### 🏆 スコアシステム

ステージクリア時に以下の式でスコアが加算されます。

```
ステージスコア = max(100, floor(10000 ÷ (クリアタイム秒 + 1) × ステージ数))
```

- **速くクリアするほど**高スコア
- **ステージ数が大きいほど**スコア倍率が上昇
- 各ステージのスコアが累積され、トータルスコアとして記録される

### 📱 動作環境

| 項目 | 内容 |
|------|------|
| 対応ブラウザ | Chrome / Safari / Firefox / Edge（最新版推奨） |
| スマートフォン | iOS Safari（傾き許可必要）、Android Chrome |
| PC | キーボード操作でフル機能を利用可能 |
| インストール | 不要（ブラウザのみで動作） |

> **iOS をお使いの方へ**: Safari 13以降では DeviceOrientation API の使用にユーザー許可が必要です。スタート時に表示されるダイアログで「許可」をタップしてください。

---

## English

### Overview

MAZE // TILT NAVIGATOR is a browser-based maze game where you tilt your smartphone to roll a glowing ball through procedurally generated neon mazes. On desktop, you can also navigate using keyboard arrow keys or WASD. Race against the clock to reach the goal and advance through increasingly challenging stages.

### ✨ Features

- **Procedural maze generation** — every stage creates a unique maze using the Recursive Backtracking algorithm, so no two runs are the same
- **Tilt controls** — on mobile devices, physically tilting your phone steers the ball via the DeviceOrientation API
- **Stage progression** — mazes grow larger with each stage, from a compact 8×10 grid up to a sprawling 20×24
- **Time-based scoring** — clear stages quickly to earn higher scores
- **Neon visual style** — glowing cyan walls, a magenta player ball, and a green goal marker rendered on HTML5 Canvas
- **Zero install** — runs entirely in the browser, no app download or server required

### 🎮 How to Play

1. Open the game at [https://tsuhira.github.io/maze-game](https://tsuhira.github.io/maze-game) in your browser
2. On mobile, grant permission for device orientation when prompted
3. Tap **[ START ]** on the title screen
4. Tilt your device (or press arrow keys / WASD on desktop) to roll the ball
5. Navigate through the maze from the **START** cell (top-left) to the **GOAL** cell (bottom-right)
6. Reach the goal to see your time and score, then advance to the next stage
7. Each new stage presents a larger maze — keep going to reach the maximum size

### 🕹️ Controls

| Platform | Action | Control |
|----------|--------|---------|
| Mobile | Move ball | Tilt device in any direction |
| Desktop | Move up | Arrow Up / W |
| Desktop | Move down | Arrow Down / S |
| Desktop | Move left | Arrow Left / A |
| Desktop | Move right | Arrow Right / D |

### 🏆 Scoring System

Your score for each stage is calculated as:

```
Score = max(100, floor(10000 / (time_seconds + 1) × stage_number))
```

- **Faster completion** = higher score
- **Later stages** multiply the score by stage number
- Minimum score per stage is **100** (floor for very slow clears)
- Each stage's score is **accumulated** into a running total

**Examples:**
- Stage 1, 10 sec clear: `floor(10000 / 11 × 1)` = **909 pts**
- Stage 3, 20 sec clear: `floor(10000 / 21 × 3)` = **1428 pts**

### 📱 Browser Support

| Environment | Support |
|-------------|---------|
| Chrome (Android) | ✅ Recommended — full tilt support |
| Safari (iOS) | ✅ Supported — motion permission required |
| Chrome (Desktop) | ✅ Supported — keyboard controls |
| Firefox (Desktop) | ✅ Supported — keyboard controls |
| Edge (Desktop) | ✅ Supported — keyboard controls |

> **iOS users:** Safari 13+ requires a user gesture to enable the DeviceOrientation API. Tap "Allow" when the permission dialog appears at game start.

---

## 🔧 技術仕様 / Technical Specifications

### アーキテクチャ / Architecture

**日本語:** 本ゲームは `index.html` 1ファイルで完結する単一ファイルアーキテクチャを採用。HTML・CSS・JavaScriptをすべてインラインで記述しており、外部ライブラリ・ビルドツール・サーバーサイド処理は一切不要です。

**English:** The game uses a single-file architecture fully contained within `index.html`. No external libraries, build tools, or server-side processing are required — just open in a browser or host on any static server.

### 技術スタック / Tech Stack

| 項目 / Item | 詳細 / Details |
|---|---|
| 言語 / Language | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| 描画 / Rendering | Canvas API (2D Context) |
| 物理エンジン / Physics | カスタム実装 / Custom implementation |
| 入力（スマホ）/ Input (Mobile) | DeviceOrientation API (`event.beta` / `event.gamma`) |
| 入力（PC）/ Input (Desktop) | Keyboard Events (Arrow Keys / WASD) |
| 外部依存 / Dependencies | なし / None |
| デプロイ / Deployment | GitHub Pages (静的ホスティング / Static Hosting) |

### ファイル構成 / File Structure

```
maze-game/
├── index.html      # ゲーム本体（オールインワン） / Main game file (all-in-one)
│                   #   HTML: UI構造 / UI structure
│                   #   CSS:  ネオン/サイバーパンクスタイル / Neon cyberpunk styles
│                   #   JS:   迷路生成・物理・ゲームループ全体 / Full game logic
└── README.md       # このファイル / This file
```

### アルゴリズム / Algorithms

#### 迷路生成 / Maze Generation

**再帰的バックトラッキング / Recursive Backtracking**

```
function carve(row, col):
    visited[row][col] = true
    for each direction in shuffle([UP, DOWN, LEFT, RIGHT]):
        (nr, nc) = neighbor in that direction
        if in-bounds and not visited[nr][nc]:
            remove wall between (row,col) and (nr,nc)
            carve(nr, nc)   // 再帰 / recurse
```

全セルを必ず1回訪問する完全連結迷路（Perfect Maze）を生成。スタートからゴールまで必ず解が存在します。
Generates a **perfect maze** — fully connected with exactly one solution path from start to goal.

#### 衝突判定 / Collision Detection

X・Y軸を独立して処理するセルベース方式。ボール中心座標でセルを特定し、そのセルの壁フラグを参照します。Y/X方向に3点サンプリングすることでコーナー処理も安定しています。

Cell-based approach processing X and Y axes independently. The ball's **center coordinates** determine the current cell, then edge positions are checked against that cell's wall flags. Three-point sampling along the perpendicular axis ensures stable corner handling.

#### 物理シミュレーション / Physics Simulation

| パラメータ / Parameter | 値 / Value | 説明 / Description |
|---|---|---|
| 加速度係数 / Acceleration | 0.3 | 傾き角度 × 係数を速度に加算 / Tilt angle × factor added to velocity |
| 摩擦係数 / Friction | 0.98 | 毎フレーム速度に乗算 / Velocity multiplied each frame |
| 速度上限 / Max Speed | `cellSize × 0.3` | 方向を保ったままクランプ / Clamped while preserving direction |
| サブステップ / Sub-steps | 5回/フレーム / per frame | トンネリング防止 / Prevents tunneling |

### ステージ設計 / Stage Design

| Stage | Cols | Rows |
|:-----:|:----:|:----:|
| 1 | 8 | 10 |
| 2 | 10 | 12 |
| 3 | 12 | 14 |
| … | … | … |
| Max | 20 | 24 |

増加式 / Growth formula: `cols = min(8 + (stage-1)×2, 20)`, `rows = min(10 + (stage-1)×2, 24)`

---

## 📄 ライセンス / License

MIT License — 詳細は [LICENSE](LICENSE) を参照 / See [LICENSE](LICENSE) for details.
