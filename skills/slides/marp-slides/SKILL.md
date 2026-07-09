---
name: marp-slides
description: Marp でスライド/プレゼン資料を作るとき。「Marp でスライドを作って」「発表資料を作りたい」「スライドのスタイルを整えて」「レイアウトの崩れを直して」など、Tailwind を使った一貫性の高いスライドをコードから作りたいときに使う。デザインパターン集からの選択と、レンダリング画像の目視検証を伴う。
---

# marp-slides — Tailwind で作る一貫性の高いスライド

## 概要

Marp と Tailwind（Play CDN）を組み合わせ、一貫性の高いスライドをコードから作る手法。独自レイアウトをその場で創作せず [references/patterns.md](references/patterns.md) のパターン集から選び、レンダリングした PNG を目視して崩れをゼロにするまで直す。

## 中核原則

- **独自レイアウトを創作しない**: レイアウトは必ず [references/patterns.md](references/patterns.md) から選ぶ。ぴったりのパターンが無くても、まず近いパターンや応用（Gカテゴリ）の組み合わせで表現できないか検討してから初めて調整する。
- **スタイルは `docs/style-guide.md` に従う**: 配色・タイポ・文体は都度決めず、プロジェクトの `docs/style-guide.md`（[references/style-guide-template.md](references/style-guide-template.md) から生成）を単一の正とする。
- **コードの正しさ ≠ 見た目の正しさ**: Tailwind クラスを書いただけでは崩れていないことの証明にならない。必ずレンダリングして PNG を目視するまで完了とみなさない（[references/layout-fix.md](references/layout-fix.md)）。

## いつ使うか

- 新規にスライド/プレゼン資料を作るとき
- 既存スライドのスタイル（配色・タイポ・余白）を整えたいとき
- レイアウトの崩れ（はみ出し・重なり・テキスト切れ等）を直したいとき

## ワークフロー（新規作成）

新規デッキを作るときは次の7ステップを順に進める。

1. **ヒアリング** — テーマ・発表時間・想定聴衆を確認し、スライド枚数の目安を決める。
2. **環境構築（初回のみ）** — [references/setup.md](references/setup.md) に沿って marp-cli 等を用意し、[templates/slide-header.md](templates/slide-header.md) を新規デッキの先頭にコピーする。あわせて `docs/style-guide.md` を生成する（[references/style-guide-template.md](references/style-guide-template.md) をコピー。ブランド色の指定がなければ既定値のまま使う）。
3. **構成案の提示と承認** — 章立て・スライド構成案を提示し、ユーザーの承認を得てから作成に入る。
4. **スライド作成** — [references/patterns.md](references/patterns.md) から各スライドに合うパターンを選んで組み立てる（独自レイアウト禁止）。
5. **図解 SVG 生成（必要な場合）** — アーキ図・フロー図等が必要なら [references/svg-creator.md](references/svg-creator.md) の規約に沿って手書きの SVG を作る。
6. **視覚検証ループ** — [references/layout-fix.md](references/layout-fix.md) の手順で PNG レンダリング→目視→修正を崩れがゼロになるまで繰り返す。
7. **出力** — HTML/PDF 等、用途に応じた形式で書き出す（例: `marp deck.md --pdf --html --allow-local-files`）。

## 2つの入口

- **新規作成**: 上記ワークフローの全体（Step 1〜7）を通す。
- **整形/修正のみ**（例:「スライド15〜20を整えて」）: Step 4（パターン選定・修正）と Step 6（視覚検証ループ）だけを実施する。既存デッキがある前提で、環境構築や構成案の承認は省略してよい。

## 守ること

- **アクセント色は1〜2色まで**: 1スライドに使うアクセント色は navy/teal のペアを基本とし、多くて2色まで。ruby は1点強調の補助としてのみ足す。3色以上を混在させない（[references/style-guide-template.md](references/style-guide-template.md)）。
- **`red-*`/`green-*` を信号色として使わない**: エラー・成功のような意味を持たせず、強弱は `gray-600`/`gray-700` の濃淡で表現する。
- **文体は理知的に**: タイトルにコロンを使わない。感嘆符・疑問符・装飾絵文字を避ける。
- **`--html --allow-local-files` は常に必須**: レンダリング・PDF/HTML出力を問わず付け忘れると `<script>`/`<style>` が無効化されたり、ローカル画像/SVGの読み込みがブロックされてスタイルが一切効かなくなる。

## よくある失敗

| 失敗 | 直し方 |
| --- | --- |
| 独自レイアウトをその場で作ってしまう | [references/patterns.md](references/patterns.md) から近いパターンを選ぶ。無ければ応用（Gカテゴリ）で組み合わせる |
| コードを書いた時点で満足してしまう | 必ず PNG にレンダリングして目視する（[references/layout-fix.md](references/layout-fix.md)）。崩れゼロになるまで反復する |
| アクセント色を使いすぎる | 1〜2色（navy＋teal を基本）に絞る。ruby は1点強調のみ |
| `--html`/`--allow-local-files` を付け忘れてスタイルが出ない | レンダリングコマンドに必ず両フラグを付ける。`.marprc.yml` で恒久化してもよい（[references/setup.md](references/setup.md)） |

## 参照ファイル一覧

- [templates/slide-header.md](templates/slide-header.md) — 新規デッキの先頭にコピーする共通ヘッダ（Tailwind config・em タイポ・brand 色）
- [references/setup.md](references/setup.md) — 初回環境構築の手順（marp-cli 導入〜ディレクトリ作成〜スモークテスト）
- [references/style-guide-template.md](references/style-guide-template.md) — `docs/style-guide.md` の元になる配色・タイポ・文体ルールのテンプレート
- [references/patterns.md](references/patterns.md) — 40種のスライドレイアウトパターン集（独自レイアウト創作の代わりに選ぶ）
- [references/svg-creator.md](references/svg-creator.md) — 図解 SVG を手書きするときの比率・配色・生成手順
- [references/layout-fix.md](references/layout-fix.md) — レンダリング→目視→修正の視覚検証ループ手順
