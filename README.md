# skills

ywake の [Agent Skills](https://docs.claude.com/en/docs/claude-code/skills) 置き場。
各スキルは `skills/<カテゴリ>/<スキル名>/SKILL.md` に配置している。

## 収録スキル

自作スキルのみ載せる。外部からフォークした `skills/fork/` 配下のスキルは除く（出自は各ディレクトリの `UPSTREAM` と `LICENSE` を参照）。

| スキル | 用途 |
| --- | --- |
| [html-wireframe](skills/design/html-wireframe/SKILL.md) | 実装前に画面構成・遷移・状態を、ブラウザで触れる低忠実度HTMLワイヤーで固める |
| [penpot-wireframe](skills/design/penpot-wireframe/SKILL.md) | Penpot 公式 MCP の execute_code で、1画面＝1台紙ボード（画面枠＋注釈レーン）のワイヤーを生成し、そのまま PDF に出して配れる形にする |
| [marp-slides](skills/slides/marp-slides/SKILL.md) | Tailwind を使い、デザインパターン集の選択とレンダリング画像の目視検証で一貫性の高いスライドをコードから作る(試作) |
| [manage-adr](skills/design/manage-adr/SKILL.md) | ADR（Architecture Decision Records）を生成・更新・レビューし、決定の Why と見送った選択肢を検索しやすく記録する |
| [git-commit](skills/dev/git-commit/SKILL.md) | コミット作成用 |

## インストール

[GitHub CLI](https://cli.github.com/) 組み込みの `gh skill` コマンドで導入できる（プレビュー機能）。
gh 本体に同梱されているため追加インストールは不要だが、新しめのバージョンが必要（v2.95.0 で動作確認）。古い場合は `gh` を更新する:

```sh
gh --version          # コマンドが無ければ gh を更新
brew upgrade gh       # Homebrew の場合
```

### スキルを1つだけ入れる


```sh
gh skill install ywake/skills html-wireframe
```

### このリポジトリの全スキルを入れる

```sh
gh skill install ywake/skills --all
```

### 導入先（エージェント／スコープ）を指定する

`--agent` で対象ツール、`--scope` で配置先を選ぶ。
ユーザースコープ（`~/.claude/skills/` 等）に置くと、どのプロジェクトからでも使える:

```sh
gh skill install ywake/skills html-wireframe \
  --agent claude-code --scope user
```

`--agent` は claude-code / cursor / codex / gemini-cli など多数に対応。
詳細は `gh skill install --help` を参照。

### 入れる前に中身を確認する

```sh
gh skill preview ywake/skills html-wireframe
```

## 管理

```sh
gh skill list                                    # 導入済みスキル一覧
gh skill update ywake/skills html-wireframe     # スキルを1つだけ更新
gh skill update --all                            # まとめて更新
```
