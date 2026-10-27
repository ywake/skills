---
name: gh-stack
description: GitHub の Stacked PRs を `gh stack`（gh 拡張 github/gh-stack）で扱うとき。「スタックで PR を出して」「PR を積んで」「stacked PR」「gh stack」など、依存し合う複数ブランチ・複数 PR の作成、下層を直したあとの積み直し、スタックの同期やマージを求められたときに使う。
---

# gh-stack — Stacked PRs を gh stack で操作する

`gh stack` は依存し合うブランチ列（trunk ← 層1 ← 層2 …）をローカルで追跡し、PR の作成、base の付け替え、連鎖 rebase、一括マージを受け持つ。内容は v0.2.1 で確認した挙動。エージェントの Bash は非対話なので、ここに載せたフラグ付きの形で実行する。`--help` を引くのは、この表に無い操作が必要なときだけでよい。

未導入なら `gh extension install github/gh-stack`。

## コマンド早見表

| やりたいこと | コマンド |
| --- | --- |
| スタックを始める | `gh stack init <branch>`（base は既定ブランチ。変えるなら `--base develop`） |
| 既存ブランチをスタックとして登録 | `gh stack init b1 b2 b3`（下から順。無いブランチは作られる） |
| 層を足す | `gh stack top` → `gh stack add <branch>` |
| 状態を見る | `gh stack view --short` / `--json`（⚠・`needsRebase` は積み直しが必要） |
| 層を移動 | `gh stack up [n]` / `down [n]` / `top` / `bottom` / `trunk` / `checkout <branch>` |
| 下層を直した後に積み直す | `gh stack sync`（fetch → 連鎖 rebase → push → PR 状態の同期） |
| ローカルだけで積み直す | `gh stack rebase`（引数なしはスタック全体。`--upstack` / `--downstack` で現在の層の上だけ・下だけ、`--no-trunk` で trunk の取り込みを省く） |
| 積み直した層を push する | `gh stack push`（層ごとに `--force-with-lease`。マージ済みの層は飛ばす） |
| PR を作る・更新する | `gh stack submit --auto` |
| 既存 PR をスタックにまとめる | `gh stack link 41 42 43`（下から順。ブランチ名・URL も可） |
| 他人のスタックを手元に取る | `gh stack checkout <PR番号 or URL>` |
| マージする | `gh stack merge --yes --squash`（引数なしはスタック全体。PR 番号を渡すとその PR まで） |
| 下層がマージされた後の後片付け | `gh stack sync --prune`（残りの層を trunk に積み直し、マージ済みのローカルブランチを消す） |
| 追跡を外す | `gh stack unstack --local`（`--local` 無しは GitHub 側のスタックも解く） |

層への追加コミットは普通の `git commit` でよい。

## 典型フロー

```sh
# 層1を作って実装をコミットする
gh stack init feat/auth
git add src/auth && git commit -m "feat: 認証モデルを追加"

# 最上段から層2を足して実装をコミットする
gh stack add feat/api
git add src/api && git commit -m "feat: 認証 API を追加"

# 全層を push し、draft PR を作ってスタック化する。タイトルと本文は後から直す
gh stack submit --auto
gh pr edit feat/auth --title "..." --body-file /path/to/body.md

# レビュー指摘で層1を直し、上の層を積み直して push する
gh stack checkout feat/auth
git commit -am "fix: 指摘対応"
gh stack sync

# ユーザーの確認を取ってから、ready にして下から一括マージし、ローカルを片付ける
gh pr ready feat/auth && gh pr ready feat/api
gh stack merge --yes --squash
gh stack sync --prune
```

## 非対話で詰まる点

- **TUI 専用のコマンドは失敗する**: `modify`（並べ替え・途中への挿入・rename・drop・fold）、`switch`、引数なしの `checkout`。移動は `up` / `down` / `checkout <branch>` で足りる。構造の変更が必要なら、ユーザーに自分の端末で `gh stack modify` を実行してもらう。git で直接ブランチを組み替えた場合は `gh stack unstack --local` → `gh stack init <下から順に>` で登録し直す。
- **`add` は最上段でしか使えない**。途中の層で実行すると exit 5 で失敗する。
- **`add` の `-A` / `-u` / `-m` は扱いが癖がある**。`-m` を省くとエディタが開き、非対話では空メッセージで失敗する（ステージは残る）。ブランチ名を省くとコミットメッセージから `10-26-add_b` のような名前が付く。現在の層にまだコミットが無いと、新しいブランチを作らずその層にコミットする。`add <branch>` で層を作り、コミットは git で行えば、これらを踏まない。
- **`submit` は非対話だと `--auto` 扱い**になり、タイトルは自動生成、新規 PR は draft で作られる。`--open` は既存 PR まで含めて ready にする。
- **`sync` は PR を作らない**（作るのは `submit`）。コンフリクトがあると全ブランチを元に戻して終わるので、`gh stack rebase` で解く。ローカルと GitHub のスタック構成が食い違っていると、非対話では何もせず中断する。
- **rebase のコンフリクトは exit 3**。衝突ファイルを直して `git add` し、`gh stack rebase --continue` で再開する（`git rebase --continue` ではない）。やめるなら `gh stack rebase --abort`。remote が無いリポジトリでは `--no-trunk` が必要。
- **`merge` は指定 PR より下を全部まとめて**、all-or-nothing でマージする。draft の PR は含められない。非対話では確認なしで走り、マージ方法は前回の値になるので `--squash` などを明示する。
- 追跡情報は `.git/gh-stack`（JSON）にある。手で編集しない。
- 移動コマンドは、別の worktree で checkout 中のブランチには切り替えない。`--print-path` でその worktree のパスを得られる。
