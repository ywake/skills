# setup.md — marp-slides 環境構築手順

新しいスライドプロジェクトを始めるときの初回セットアップ手順。marp-cli の用意から、ディレクトリ作成、共通ヘッダの配置、スタイルガイド生成、スモークテストまでを一直線にたどれば準備完了になる。

## 1. marp-cli の用意

```bash
marp --version || brew install marp-cli   # brew が無ければ: alias marp='npx @marp-team/marp-cli'
```

`marp --version` が版番号（例: `v4.4.1`）を表示すればインストール済み。無ければ Homebrew でインストールする。brew が使えない環境では `npx @marp-team/marp-cli` を `marp` のエイリアスにしてフォールバックする（初回はダウンロードが走るぶん遅い）。

## 2. Tailwind をローカル配置（オフライン/バージョン固定）

```bash
mkdir -p assets
curl -fsSL https://cdn.tailwindcss.com -o assets/tailwind.js
```

Tailwind Play CDN のスクリプト本体（数百 KB）をプロジェクト直下の `assets/tailwind.js` に保存する。デッキ先頭の

```html
<script src="https://cdn.tailwindcss.com"></script>
```

を

```html
<script src="../assets/tailwind.js"></script>
```

に置換して使う（`slides/deck.md` から見て `assets/` は一つ上の階層のため `../` を付ける）。ネット接続がある前提で構わないプロジェクトではこの手順自体を省略し、CDN の URL のままでよい。

> **注（相対パス解決について）**: `<script src="...">` のパスは、marp を実行した時点のカレントディレクトリではなく **Markdown ファイル自身の場所を基準に解決される**。`slides/` 配下にデッキを置く運用（後述）では `../assets/tailwind.js` になる。ディレクトリ構成を変えた場合はここも合わせて調整する。

## 3. ディレクトリ作成

```bash
mkdir -p slides images svg docs
```

- `slides/` — デッキ本体（`.md`）
- `images/` — レンダリング済み PNG などの出力先
- `svg/` — 図解やアイコンなどの SVG 素材
- `docs/` — スタイルガイド（`style-guide.md`）などプロジェクトドキュメント

## 4. 共通ヘッダの配置

新規デッキは [`templates/slide-header.md`](../templates/slide-header.md) の内容をファイル先頭にそのままコピーする（YAML frontmatter を1行目から始めること）。em タイポのクラス（`text-em-3xl` 〜 `text-em-sm`）と `brand.navy` / `brand.teal` / `brand.ruby` の色トークンがこの時点で使えるようになる。

手順2でローカル配置した場合は、コピーした直後に `<script src="https://cdn.tailwindcss.com">` を `<script src="../assets/tailwind.js">` に置換するのを忘れないこと。

## 5. スタイルガイド生成

```bash
cp skills/slides/marp-slides/references/style-guide-template.md docs/style-guide.md
```

`style-guide-template.md` を `docs/style-guide.md` としてプロジェクトにコピーし、ブランド色（`brand.navy` / `brand.teal` / `brand.ruby` 相当の値）をプロジェクト指定の色に差し替える。以降のデッキ作成はこの `docs/style-guide.md` を参照して色・タイポの一貫性を保つ。

## 6. スモークテスト（環境確認）

```bash
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  marp slides/deck.md --images png --html --allow-local-files
```

- `--html --allow-local-files` は常に必須。付け忘れると `<script>`/`<style>` が無効化されたり、ローカルファイルの読み込みがブロックされてスタイルが一切効かない。
- `CHROME_PATH` は環境にインストール済みの Chrome を指す。未設定でも動く環境もあるが、初回起動（コールドスタート）は 1〜4 分ほどかかることがあるので気長に待つ。
- 出力された PNG（`deck.001.png` など）を目視し、em タイポと brand 色が反映されていればセットアップ完了。反映されていなければ手順4のヘッダ配置とスクリプト置換を見直す。

## 7. `.marprc.yml`（任意）

手順6のフラグを毎回書きたくない場合は、プロジェクト直下に `.marprc.yml` を置いて恒久化できる。

```yaml
html: true
allowLocalFiles: true
```

これを置いておけば

```bash
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" marp slides/deck.md --images png
```

だけで手順6と同じ結果になる（`--html --allow-local-files` を省略できる）。
