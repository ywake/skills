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
