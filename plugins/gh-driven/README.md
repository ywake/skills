# gh-driven

GitHub の issue と PR だけを介して開発を進める Claude Code プラグイン。仕様と PR 計画を issue にまとめ、PR ごとに実装役サブエージェントに実装させ、独立したレビュー役サブエージェントによる仕様レビューとコードレビューを GitHub 上で通してから完了にする。`/gh-driven:start` で明示的に呼ぶ。

入れ方は、[リポジトリの README](../../README.md#プラグイン) に書いている。

## 相談役

実装役とレビュー役は、判断に迷う点を、Fable で動く相談役に1問ずつ質問できる。相談役は呼び出し元の会話を見ずに、質問とリポジトリから自分で調べて答える。相談役を使うには、Fable を使えるアカウントが要る。

## 先に許可しておくもの

auto モードでは、レビュー役の投稿と、実装役の強制 push が権限の確認で止められることがある。止まると、そのレビューや追従をやり直すことになる。`settings.json` の `permissions.allow` に、次の規則を足しておく:

```json
"Bash(gh issue comment:*)",
"Bash(git push --force-with-lease origin feat/*)",
"Bash(git push --force-with-lease origin fix/*)",
"Bash(git push --force-with-lease origin docs/*)",
"Bash(git push --force-with-lease origin refactor/*)",
"Bash(git push --force-with-lease origin test/*)",
"Bash(git push --force-with-lease origin perf/*)",
"Bash(git push --force-with-lease origin chore/*)"
```

ブランチ名の慣習がないリポジトリでは、実装役はブランチを `<型>/<N>-<短い英語の名前>` の形で切る。型は、上の規則の `feat` から `chore` までの7つ。慣習のあるリポジトリでは、実装役は慣習に従ってブランチを切るので、その接頭辞の規則(`"Bash(git push --force-with-lease origin <接頭辞>/*)"`)を足す。

実装役は push をほかのコマンドとつながずに単独で実行するので、この形に一致する。

## 動作確認用の URL

常に動いているマシンでは、仕様の PR 計画で `動作確認の URL: 付ける` とした項目の PR に、実装役がアプリを起動し、cloudflared のクイックトンネルで作った動作確認用の URL を PR 本文に付ける。上に積んだ PR は下の PR の変更を含むので、スタックでは、ふつう一番上の PR にだけ付ける。URL は、指定したメールアドレスの人だけが、メールに届く PIN を入れて開ける。アプリとトンネルは、PR がマージされて worktree を片付けるときに、メインが止める。

URL を付けたいマシンの、URL を付けたいリポジトリでだけ、次を用意する。設定のないところでは、URL を作らない。

- cloudflared 2026.9.3 以降(開ける人を絞る `--allowed-mail` を持つもの)
- そのリポジトリの `.claude/settings.local.json` の `env` に、開けるメールアドレスを書く。ドメイン全体なら `*@<ドメイン>`、複数ならカンマ区切りで並べる。リポジトリごとに書くので、開ける人をリポジトリごとに変えられる。このファイルはコミットしない。

```json
"env": {
  "GH_DRIVEN_PREVIEW_ALLOWED_MAIL": "*@example.com"
}
```
