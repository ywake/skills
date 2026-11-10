#!/usr/bin/env python3
"""gh-driven の実装役とレビュー役が、GitHub を読み書きするためのコマンド。

使い方:
    gh_driven.py show <PR番号>                      レビュー本文、スレッド、PR コメントを JSON で表示する
    gh_driven.py review <PR番号> <SHA> [--dry-run]  レビュー(本文と行コメント)を1回で投稿する
    gh_driven.py reply <スレッドID>                 スレッドに返信する
    gh_driven.py resolve <スレッドID>...            スレッドを解決にする
    gh_driven.py comment <issue番号かPR番号>        issue や PR にコメントする

review、reply、comment は、本文を標準入力から読む。

review の入力の形式:
    レビュー本文(複数行可)
    === path/to/file.ts:42
    行コメントの本文(複数行可)
    === path/to/old.ts:7 LEFT
    削除した行への行コメントの本文

最初の「=== 」行より前がレビュー本文。「=== パス:行番号」が行コメントの始まりで、
行番号の後ろに LEFT を付けると削除した行(変更前の行番号)を指す。付けなければ RIGHT。
"""
import json
import re
import subprocess
import sys

# 行コメントの区切り行。「=== パス:行番号」に、任意で LEFT か RIGHT が続く
HEADER = re.compile(r"^=== (?P<path>.+):(?P<line>\d+)(?: (?P<side>LEFT|RIGHT))?\s*$")

# スレッドを1ページ分取得するクエリ。cursor が null なら先頭から
THREADS_QUERY = """
query($owner:String!,$repo:String!,$pr:Int!,$cursor:String){
  repository(owner:$owner,name:$repo){
    pullRequest(number:$pr){
      reviewThreads(first:100, after:$cursor){
        pageInfo{ hasNextPage endCursor }
        nodes{
          id isResolved isOutdated path line
          comments(first:100){ nodes{ author{ login } createdAt body } }
        }
      }
    }
  }
}"""

REPLY_MUTATION = """
mutation($id:ID!,$body:String!){
  addPullRequestReviewThreadReply(input:{pullRequestReviewThreadId:$id, body:$body}){
    comment{ url }
  }
}"""

RESOLVE_MUTATION = """
mutation($id:ID!){
  resolveReviewThread(input:{threadId:$id}){ thread{ isResolved } }
}"""


def gh(args, stdin=None):
    """gh を実行して標準出力を返す。失敗したら、gh の出力を付けて終了する。"""
    result = subprocess.run(["gh", *args], input=stdin, text=True, capture_output=True)
    if result.returncode != 0:
        sys.exit(f"gh が失敗しました: {result.stdout.strip()} {result.stderr.strip()}")
    return result.stdout


def graphql(query, **variables):
    """GraphQL を、変数を JSON の本文に入れて実行する。本文の文字列がそのまま届く。"""
    payload = json.dumps({"query": query, "variables": variables})
    return json.loads(gh(["api", "graphql", "--input", "-"], stdin=payload))["data"]


def rest_all(endpoint):
    """REST の一覧を全ページ取得する。gh はページごとの配列を続けて出力するので、順に読む。"""
    out, items, pos = gh(["api", endpoint, "--paginate"]), [], 0
    decoder = json.JSONDecoder()
    while pos < len(out):
        page, pos = decoder.raw_decode(out, pos)
        items.extend(page)
        # 次の配列の先頭まで、空白を読み飛ばす
        while pos < len(out) and out[pos].isspace():
            pos += 1
    return items


def parse(text):
    """review の入力を、レビュー本文と行コメントのリストに分ける。"""
    body_lines, comments, current = [], [], None
    for line in text.splitlines():
        m = HEADER.match(line)
        if m:
            # 区切り行が来たら、新しい行コメントを始める
            current = {
                "path": m["path"],
                "line": int(m["line"]),
                "side": m["side"] or "RIGHT",
                "body": [],
            }
            comments.append(current)
        elif current is None:
            # 最初の区切り行より前は、レビュー本文
            body_lines.append(line)
        else:
            current["body"].append(line)
    # 行のリストを本文の文字列に戻す。前後の空行は落とす
    for c in comments:
        c["body"] = "\n".join(c["body"]).strip()
    return "\n".join(body_lines).strip(), comments


def read_body():
    """標準入力から本文を読む。空なら投稿せずに終了する。"""
    body = sys.stdin.read().strip()
    if not body:
        sys.exit("本文が空です")
    return body


def show(pr):
    """PR のレビュー本文、スレッド、PR コメントをまとめて表示する。"""
    # レビュー本文。本文が空のレビューは、スレッドへの返信に伴ってできたものなので除く
    reviews = [
        {"user": r["user"]["login"], "submitted_at": r["submitted_at"],
         "commit_id": r["commit_id"], "url": r["html_url"], "body": r["body"]}
        for r in rest_all(f"repos/{{owner}}/{{repo}}/pulls/{pr}/reviews") if r["body"]
    ]
    # PR コメント(行に紐づかない指摘への返信など)
    comments = [
        {"user": c["user"]["login"], "created_at": c["created_at"], "body": c["body"]}
        for c in rest_all(f"repos/{{owner}}/{{repo}}/issues/{pr}/comments")
    ]
    # スレッドは、次のページが無くなるまで取得する
    owner, repo = gh(["repo", "view", "--json", "owner,name",
                      "--jq", ".owner.login + \" \" + .name"]).split()
    threads, cursor = [], None
    while True:
        page = graphql(THREADS_QUERY, owner=owner, repo=repo, pr=int(pr), cursor=cursor)
        page = page["repository"]["pullRequest"]["reviewThreads"]
        for t in page["nodes"]:
            threads.append({
                "id": t["id"], "resolved": t["isResolved"], "outdated": t["isOutdated"],
                "path": t["path"], "line": t["line"],
                "comments": [
                    {"user": (c["author"] or {}).get("login"), "created_at": c["createdAt"],
                     "body": c["body"]}
                    for c in t["comments"]["nodes"]
                ],
            })
        if not page["pageInfo"]["hasNextPage"]:
            break
        cursor = page["pageInfo"]["endCursor"]
    print(json.dumps({"reviews": reviews, "threads": threads, "comments": comments},
                     ensure_ascii=False, indent=2))


def review(pr, sha, dry_run):
    """レビューを投稿して、その URL を表示する。"""
    body, comments = parse(sys.stdin.read())
    if not body:
        sys.exit("レビュー本文が空です")
    payload = json.dumps(
        {"commit_id": sha, "event": "COMMENT", "body": body, "comments": comments},
        ensure_ascii=False,
    )
    if dry_run:
        print(payload)
        return
    # 行コメントの行が差分に合っていないと 422 で失敗し、何も投稿されない
    print(gh(["api", f"repos/{{owner}}/{{repo}}/pulls/{pr}/reviews",
              "--input", "-", "--jq", ".html_url"], stdin=payload).strip())


def reply(thread_id):
    """スレッドに返信して、その URL を表示する。"""
    data = graphql(REPLY_MUTATION, id=thread_id, body=read_body())
    print(data["addPullRequestReviewThreadReply"]["comment"]["url"])


def resolve(thread_ids):
    """スレッドを解決にする。"""
    for thread_id in thread_ids:
        graphql(RESOLVE_MUTATION, id=thread_id)
        print(f"resolved {thread_id}")


def comment(number):
    """issue や PR にコメントして、その URL を表示する。"""
    print(gh(["issue", "comment", number, "--body-file", "-"], stdin=read_body()).strip())


def selftest():
    """parse が本文と行コメントを正しく分けることを確かめる。"""
    body, comments = parse(
        "本文 'q' \"d\"\n2行目\n=== src/a.ts:42\nc1\n続き\n=== src/b c.ts:7 LEFT\nc2\n"
    )
    assert body == "本文 'q' \"d\"\n2行目", body
    assert comments == [
        {"path": "src/a.ts", "line": 42, "side": "RIGHT", "body": "c1\n続き"},
        {"path": "src/b c.ts", "line": 7, "side": "LEFT", "body": "c2"},
    ], comments
    assert parse("本文だけ") == ("本文だけ", [])
    print("ok")


def main(argv):
    # --dry-run は review だけが使う。先に取り除いておく
    dry_run = "--dry-run" in argv
    args = [a for a in argv if a != "--dry-run"]
    # サブコマンドと引数の数で振り分ける。合わなければ使い方を表示する
    command, rest = (args[0], args[1:]) if args else (None, [])
    if command == "selftest" and not rest:
        selftest()
    elif command == "show" and len(rest) == 1:
        show(rest[0])
    elif command == "review" and len(rest) == 2:
        review(rest[0], rest[1], dry_run)
    elif command == "reply" and len(rest) == 1:
        reply(rest[0])
    elif command == "resolve" and rest:
        resolve(rest)
    elif command == "comment" and len(rest) == 1:
        comment(rest[0])
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main(sys.argv[1:])
