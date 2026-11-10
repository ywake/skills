#!/usr/bin/env python3
"""PR にレビュー(本文と行コメント)を1回で投稿する。

使い方:
    python3 post_review.py <PR番号> <対象コミットのSHA> [--dry-run] < 入力

入力(標準入力)の形式:
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


def parse(text):
    """入力を、レビュー本文と行コメントのリストに分ける。"""
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
    if argv == ["--selftest"]:
        return selftest()
    # 引数を取り出す。--dry-run は、投稿せずに送る JSON を表示する
    dry_run = "--dry-run" in argv
    args = [a for a in argv if a != "--dry-run"]
    if len(args) != 2:
        sys.exit(__doc__)
    pr, sha = args

    # 入力を分けて、レビュー API に渡す JSON を組み立てる
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

    # gh に投稿させる。{owner} と {repo} は、gh がカレントディレクトリのリポジトリで埋める
    result = subprocess.run(
        ["gh", "api", f"repos/{{owner}}/{{repo}}/pulls/{pr}/reviews",
         "--input", "-", "--jq", ".html_url"],
        input=payload, text=True, capture_output=True,
    )
    if result.returncode != 0:
        # 422 は、行コメントの行が差分に合っていないときに返る。その場合は何も投稿されない
        sys.exit(f"投稿に失敗しました: {result.stdout.strip()} {result.stderr.strip()}")
    print(result.stdout.strip())


if __name__ == "__main__":
    main(sys.argv[1:])
