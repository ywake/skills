#!/usr/bin/env python3
"""タグの開閉バランスチェック。

HTML はタグの対応が壊れてもエラーを出さず、閉じ忘れ・閉じ違いの要素が
後続の兄弟を飲み込んでレイアウトが黙って崩れる。開きと閉じの「数」を
照合するだけの粗い検査だが、コピペ・置換ミス（<a> を </button> で閉じる等）は
これで捕まる。JS も対象にできる — 共通シェルのテンプレート文字列内の markup は
エディタのタグ対応チェックが効かないため、むしろ JS こそ掛ける価値がある。

使い方: python3 scripts/check_tags.py wireframes/*.html wireframes/assets/*.js
終了コード: 不一致があれば 1
"""
import io
import re
import sys

# 開閉の対応を数える対象。void 要素（br/input/img 等）は閉じタグが無いので含めない
TAGS = ('div', 'section', 'aside', 'main', 'header', 'footer', 'nav',
        'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'td', 'th',
        'a', 'button', 'p', 'span', 'form', 'label', 'select',
        'h1', 'h2', 'h3', 'h4')

def strip_comments(s, path):
    """コメント内の markup を数えないよう先に落とす。

    JS の行コメントに markup を書く例（`// <div data-wf="x"> のように置く`）は
    共通シェルの説明で普通に出てくるので、これを数えると偽陽性で警告が出る。
    警告が当てにならないとチェック自体が無視されるため、ここは丁寧に落とす。
    """
    s = re.sub(r'<!--.*?-->', '', s, flags=re.S)
    if path.endswith('.js'):
        s = re.sub(r'/\*.*?\*/', '', s, flags=re.S)          # ブロックコメント
        s = re.sub(r'(?<![:\'"`])//[^\n]*', '', s)             # 行コメント（URL の // は残す）
    return s


bad = False
for path in sys.argv[1:]:
    s = strip_comments(io.open(path, encoding='utf-8').read(), path)
    for t in TAGS:
        opened = len(re.findall(r'<%s[\s>]' % t, s))
        closed = s.count('</%s>' % t)
        if opened != closed:
            print(f'{path}: <{t}> 開き {opened} / 閉じ {closed}')
            bad = True

sys.exit(1 if bad else 0)
