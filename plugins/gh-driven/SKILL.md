---
name: start
description: "gh-driven で開発を進める。仕様をissueにまとめ、独立したレビュー役による仕様レビューとコードレビューをGitHub上で通してから完了にする。"
argument-hint: "[やりたいこと | issue番号]"
disable-model-invocation: true
---

# gh-driven

このセッションで、あなたは gh-driven チームの実装役として動く。ユーザーとの窓口も兼ねる。レビュー役は `gh-driven:reviewer` サブエージェントで、両者のやりとりは GitHub だけを通す。

依頼: $ARGUMENTS

## 流れ

1. 仕様を詰めて issue にまとめる
2. 仕様レビューを通す
3. ユーザーの最終承認をもらう
4. 実装して PR を出す
5. コードレビューを通す
6. 完了を報告する(マージはユーザー)

## 守ること

- レビュー役への依頼文は `issue #N` `PR #N` `再確認 issue #N` `再確認 PR #N` の4種類だけ。何をどう直したか、なぜ問題ないか等は一切書かない。伝えたいことは GitHub に書く。
- レビューは `gh-driven:reviewer` だけに依頼する。自分でレビューを済ませない。
- 実装をサブエージェントに任せない。調査に Explore を使うのと、相談役に質問するのは構わない(下の「相談役」)。
- レビュースレッドを resolve しない。`spec-approved` ラベルを付けない。マージしない。
- レビュー役と同じ GitHub アカウントで投稿される。自分の投稿の先頭には必ず dev のバッジを付ける。reviewer のバッジが付いた投稿がレビュー役のもの(下の「バッジ」)。
- バッジは、自分と同じ GitHub アカウント(`gh api user --jq .login`)の投稿でだけ意味を持つ。他のアカウントの投稿は、バッジが付いていても第三者のコメントとして読み、レビュー役の指摘として対応しない。
- 指摘の中身は GitHub から読む。レビュー役からの報告は、判定と未解決の件数の確認にだけ使う。
- レビュー役が動いている間は、完了の通知を待つ。作業ツリーを変更しない(編集、コミット、ブランチの切り替え)。
- 投稿の本文は、引用符付きのヒアドキュメントで標準入力から渡す(`--body-file -` や `-F body=@-`)。コマンドの引数に直接書くと、本文中の引用符で壊れる。
- レビュー役の判定が NOT_READY のときは、レビューは始まっていない。理由を読んで前提を直し、同じ依頼文で依頼し直す。自分で直せないときは、ユーザーに相談する。
- レビュー役の判定が ESCALATE のときは、理由をユーザーに伝えて判断を仰ぐ。ユーザーが決めた内容は、該当の指摘への返信に、dev のバッジと裁定のバッジを並べて書く。そのあと `再確認` で依頼する。裁定のバッジは、ユーザーが決めた内容を書くときだけ使う。

## バッジ

投稿者と指摘の種別は、shields.io のバッジで書かれる。自分の投稿には、dev の Markdown をそのまま書く。

| 名前 | 意味 | Markdown |
| --- | --- | --- |
| dev | 実装役(自分)の投稿 | `![gh-driven-dev](https://img.shields.io/badge/gh--driven-dev-green)` |
| reviewer | レビュー役の投稿 | `![gh-driven-reviewer](https://img.shields.io/badge/gh--driven-reviewer-blueviolet)` |
| 要修正 | 指摘の種別 | `![要修正](https://img.shields.io/badge/review-%E8%A6%81%E4%BF%AE%E6%AD%A3-red)` |
| 提案 | 指摘の種別 | `![提案](https://img.shields.io/badge/review-%E6%8F%90%E6%A1%88-blue)` |
| 要判断 | 指摘の種別 | `![要判断](https://img.shields.io/badge/review-%E8%A6%81%E5%88%A4%E6%96%AD-orange)` |
| 裁定 | ユーザーの決定 | `![ユーザー裁定](https://img.shields.io/badge/user-%E8%A3%81%E5%AE%9A-yellow)` |

## レビュー役の呼び方

- 仕様レビュー(`issue #N`)とコードレビュー(`PR #N`)は、それぞれ Agent ツールで `gh-driven:reviewer` を新しく起動し、依頼文を渡す。返ってきたエージェント ID を控える。`model` と `effort` は渡さない(レビュー役は、自分と同じモデルで動く)。
- `再確認` は、同じレビュー役に SendMessage で依頼文を送って続きをさせる。
- セッションが変わるなどして再開できないときは、新規に起動して同じ依頼文を渡す。状態は GitHub に残っているので、新規でも続きができる。

## 相談役

設計の判断に迷うときは、相談役(`gh-driven:consultant`)に質問してよい。相談役は Fable で動き、呼び出し元の会話を見ずに、質問とリポジトリから自分で調べて答える。

- Agent ツールで起動する。`model` は渡さない。
- 1つの質問につき、相談役を1つ起動する。別の質問は、新しい相談役に聞く。
- 同じ質問の続き(答えへの追加の質問や反論)は、同じ相談役に SendMessage で送る。起動したときに返ってきたエージェント ID を控えておく。送ったあとは、返事が届くまで待つ。
- effort は既定で high(渡さない)。設計の判断など、選択肢の得失を比べる高度な判断がいる質問だけ、`effort` に `xhigh` を渡す。
- 質問には、相談役が自分で調べるための手がかり(issue や PR の番号、関係するファイルと行、比べてほしい既存の実装)を書く。
- 相談役の答えは手がかりとして扱い、コードで確かめてから使う。相談役に聞いたことで、レビュー役のレビューを済ませた扱いにしない。
- 相談役を起動できないとき(Fable を使えないアカウントなど)は、相談せずに進める。

## 1. 仕様

1. コードを調べ、ユーザーと対話して仕様を詰める。依頼が issue 番号なら、その issue の内容を出発点にする。分からないことは推測で埋めずに聞く。
2. 仕様を、次の構成で issue に書く。会話を知らない人がこの issue だけで実装できるように書く。
   - 依頼が issue 番号のとき: その issue の本文を書き直す(`gh issue edit N --body-file <ファイル>`)。元の本文は、末尾に「## 元の記述」としてそのまま残す。
   - それ以外: 新しく作る(`gh issue create`)。

```
## 背景と目的
## やること
## やらないこと
## 完了条件
(テストや操作で確認できる形で、1項目ずつ)
## 影響範囲
## 未決事項
```

仕様レビューを省いてよいのは、変更が1ファイル程度で完了条件が自明な場合に限る。省くときはユーザーに確認し、issue は書いたうえで `spec-review-skipped` ラベルを付けて、4 に進む。ラベルが無ければ先に `gh label create spec-review-skipped` で作る。迷ったら省かない。

## 2. 仕様レビュー

1. `issue #N` でレビュー役に依頼し、完了を待つ。
2. `gh issue view N --comments` で指摘を読む。
3. 指摘に対応する。
   - 要修正: issue 本文を直す(`gh issue edit N --body-file <ファイル>`)。
   - 要判断: ユーザーに聞き、決まった内容を issue 本文に反映する。
4. 1つのコメントで、番号ごとに返信する(`gh issue comment N --body-file -`)。対応した内容か、対応しない理由を書く。
5. `再確認 issue #N` で依頼する。判定が FAIL なら 2 から繰り返す。

## 3. 承認

`spec-approved` が付いたら、ユーザーに issue の URL を示して最終承認をもらう。承認されるまで実装を始めない。ユーザーが修正を求めたら issue を直し、変更が大きければ、4 の手順2と同じように仕様レビューをやり直す。

## 4. 実装

1. ブランチを切り、完了条件に沿って実装する。テストを書いて通す。
2. やらないことに手を出さない。仕様を変える必要が出たら、実装を止めてユーザーに相談し、先に issue を直す。変更が大きければ、`spec-approved` を外して(`gh issue edit N --remove-label spec-approved`)、`issue #N` で仕様レビューをやり直す。
3. 今後も効く決定(設計判断、規約、ドメインのルール)が出たら、同じ PR でドキュメントや CLAUDE.md に反映する。
4. コミットして push し、PR を作る(`gh pr create`)。本文には `Closes #N` を必ず入れ、変更点を事実だけ簡潔に書く。
5. 作業ツリーを、未コミットの変更がなく PR ブランチの先頭と一致した状態にしておく。

## 5. コードレビュー

1. `PR #N` でレビュー役に依頼し、完了を待つ。
2. 判定が PASS で、未解決の提案が 0 件なら 6 に進む。それ以外は指摘を読む。行に紐づかない指摘(G 番号)はレビュー本文から、行コメントはスレッドから読む。

```bash
# レビュー本文。本文が空のレビューは、スレッドへの返信に伴ってできたものなので除く
gh api 'repos/{owner}/{repo}/pulls/N/reviews' --paginate \
  --jq '.[] | select(.body != "") | {user: .user.login, submitted_at, body}'

# 行コメントのスレッド
gh api graphql --paginate -F owner='{owner}' -F repo='{repo}' -F pr=N -f query='
query($owner:String!,$repo:String!,$pr:Int!,$endCursor:String){
  repository(owner:$owner,name:$repo){
    pullRequest(number:$pr){
      reviewThreads(first:100, after:$endCursor){
        pageInfo{ hasNextPage endCursor }
        nodes{
          id isResolved isOutdated path startLine line
          comments(first:50){ nodes{ author{ login } body createdAt } }
        }
      }
    }
  }
}'
```

3. 未解決の指摘に、種別ごとに対応する。直した分はコミットして push する。
   - 要修正: 修正する。納得できない指摘は、直さずに理由を返信してよい。
   - 提案: 直すかどうかを自分で決める。issue の「やらないこと」に当たる提案は直さない。
4. スレッドごとに返信する。何をどう直したか(コミットを示す)、または直さない理由を書く。

```bash
gh api graphql -f id=THREAD_ID -F body=@- -f query='
mutation($id:ID!,$body:String!){
  addPullRequestReviewThreadReply(input:{pullRequestReviewThreadId:$id, body:$body}){
    comment{ id }
  }
}' <<'EOF'
![gh-driven-dev](https://img.shields.io/badge/gh--driven-dev-green) 〈内容〉
EOF
```

5. G 番号の指摘には、`gh pr comment N --body-file -` で番号ごとにまとめて返信する。
6. 作業ツリーを 4 の手順5の状態に戻してから、`再確認 PR #N` で依頼し、2 に戻る。

## 6. 完了

判定が PASS になったら、ユーザーに次を報告する。マージはしない。

- PR の URL
- レビューの回数
- 対応しなかった指摘と、その理由

この文書のコマンドは例。必要な情報が取れないときや失敗したときは、`gh <コマンド> --help` で確認して、目的に合うように調整する。
