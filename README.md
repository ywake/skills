# skills

ywake の [Agent Skills](https://docs.claude.com/en/docs/claude-code/skills) 置き場。
各スキルは `skills/<カテゴリ>/<スキル名>/SKILL.md` に配置している。

## 収録スキル

| スキル | 用途 |
| --- | --- |
| [wireframe-design](skills/design/wireframe-design/SKILL.md) | 実装前に画面構成・遷移・状態を、ブラウザで触れる低忠実度HTMLワイヤーで固める |

## インストール

[GitHub CLI](https://cli.github.com/) 組み込みの `gh skill` コマンドで導入できる（プレビュー機能）。
gh 本体に同梱されているため追加インストールは不要だが、新しめのバージョンが必要（v2.95.0 で動作確認）。古い場合は `gh` を更新する:

```sh
gh --version          # コマンドが無ければ gh を更新
brew upgrade gh       # Homebrew の場合
```

### スキルを1つだけ入れる


```sh
gh skill install ywake/skills wireframe-design
```

### このリポジトリの全スキルを入れる

```sh
gh skill install ywake/skills --all
```

### 導入先（エージェント／スコープ）を指定する

`--agent` で対象ツール、`--scope` で配置先を選ぶ。
ユーザースコープ（`~/.claude/skills/` 等）に置くと、どのプロジェクトからでも使える:

```sh
gh skill install ywake/skills wireframe-design \
  --agent claude-code --scope user
```

`--agent` は claude-code / cursor / codex / gemini-cli など多数に対応。
詳細は `gh skill install --help` を参照。

### 入れる前に中身を確認する

```sh
gh skill preview ywake/skills wireframe-design
```

## 管理

```sh
gh skill list             # 導入済みスキル一覧
gh skill update --all     # まとめて更新
```
