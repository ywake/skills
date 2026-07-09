# パターン集

このファイルは marp-slides スキルのレイアウトパターン集。新しいデッキは、まず `templates/slide-header.md` の内容をファイル先頭にそのままコピーしてから、以降の各スライドはこの一覧から近いものを選んで使う。都度レイアウトを考案するのではなく、掲載されたパターンをベースに文言・数値・色の使用箇所だけを差し替えるのが本スキルの基本方針。

掲載しているコードは、すべて実際にレンダリング（`marp deck.md --images png --html --allow-local-files`）した PNG を目視確認して崩れがないことを確かめたもののみ。使えるクラスは `templates/slide-header.md` で定義済みの em タイポ（`text-em-3xl`〜`text-em-sm`）と brand 色（`brand-navy` / `brand-teal` / `brand-ruby`）、および標準の Tailwind グレースケール（`gray-50`〜`gray-900`）に限る。配色・文体のルールは `style-guide-template.md` を参照する。

## A. タイトル/セクション

### A-1 表紙

**用途**: デッキの最初のスライド。タイトル・サブタイトル・日付を、左寄せのミニマルな構成で提示する。

```markdown
<div class="h-full flex flex-col justify-center items-start gap-6 px-16">
  <h1 class="text-em-2xl font-bold text-gray-900">全社データ基盤刷新プロジェクト</h1>
  <p class="text-em-lg text-gray-600">四半期ロードマップと投資計画</p>
  <div class="w-16 h-1 bg-brand-navy"></div>
  <p class="text-em-sm text-gray-500">2026年7月9日</p>
</div>
```

**デザインポイント**: アクセントは navy の短い罫線1本のみに絞り、色数を増やさない。タイトルは体言止めでコロンを使わない。日付は `text-em-sm` で控えめに添えるだけにとどめる。

### A-2 グラデーション扉

**用途**: 章の切り替え。印象づけたいセクションの冒頭で使う、もっとも強い区切り表現。

```markdown
<div class="h-full flex flex-col items-center justify-center bg-gradient-to-br from-brand-navy to-brand-teal text-white gap-4">
  <div class="text-em-sm tracking-widest opacity-80">SECTION 02</div>
  <h2 class="text-em-2xl font-bold">設計の全体像</h2>
</div>
```

**デザインポイント**: グラデーションは navy→teal のアクセント2色のみで構成し、他の色を混ぜない。文字は白地に統一し、ラベル部分は `opacity-80` で階層をつける。タイトルにコロンを使わない。

### A-3 番号つきセクション扉

**用途**: 章の区切りを、大きな章番号で示したいとき。A-2 のグラデーションより控えめにしたい場合の代替パターン。

```markdown
<div class="h-full flex items-center gap-10 px-16">
  <div class="text-em-3xl font-bold text-brand-navy leading-none">03</div>
  <div class="flex flex-col gap-2 border-l border-gray-200 pl-10">
    <div class="text-em-sm tracking-widest text-brand-teal">CHAPTER</div>
    <h2 class="text-em-2xl font-bold text-gray-900">運用体制とロードマップ</h2>
  </div>
</div>
```

**デザインポイント**: 章番号は navy、ラベルは teal と役割で色を分けるが、アクセントは合計2色までに抑える。縦罫線（`border-l`）で番号と章題のブロックを視覚的に分離する。

### A-4 アジェンダ

**用途**: 目次スライド。番号付きリストで全体像を示しつつ、いま話す項目だけを視覚的に強調する。

```markdown
<div class="h-full flex flex-col justify-center gap-4 px-16">
  <h2 class="text-em-xl font-bold text-gray-900 mb-2">アジェンダ</h2>
  <div class="flex items-center gap-4 text-em-base text-gray-400">
    <span class="text-em-lg font-bold">01</span>
    <span>背景と課題</span>
  </div>
  <div class="flex items-center gap-4 text-em-lg text-brand-navy font-bold bg-gray-50 rounded-lg px-4 py-2">
    <span class="text-em-lg font-bold">02</span>
    <span>設計の全体像</span>
  </div>
  <div class="flex items-center gap-4 text-em-base text-gray-400">
    <span class="text-em-lg font-bold">03</span>
    <span>運用体制とロードマップ</span>
  </div>
  <div class="flex items-center gap-4 text-em-base text-gray-400">
    <span class="text-em-lg font-bold">04</span>
    <span>まとめと次のアクション</span>
  </div>
</div>
```

**デザインポイント**: 強調するのは現在地の項目1つだけ。navy の文字色と `bg-gray-50` のパネルで目立たせ、他の項目は `gray-400` に沈めてコントラストをつける。アクセントは navy 1色のみ。

### A-5 クロージング

**用途**: デッキ最後のスライド。締めの一言と、連絡先/QR コードのプレースホルダを提示する。

```markdown
<div class="h-full flex flex-col items-center justify-center gap-8">
  <p class="text-em-xl font-bold text-gray-900">ご清聴ありがとうございました</p>
  <div class="flex items-center gap-8">
    <div class="w-28 h-28 border-2 border-dashed border-gray-300 flex items-center justify-center text-em-sm text-gray-400">QR</div>
    <div class="flex flex-col gap-1 text-em-base text-gray-600 text-left">
      <div>ywake.dev@gmail.com</div>
      <div>docs.example.com/data-platform</div>
    </div>
  </div>
</div>
```

**デザインポイント**: 締めの一言はアクセント色を使わず `gray-900` のみで落ち着かせる。QR は点線枠のプレースホルダとして実装し、後から画像に差し替えられるようにしておく。スライド全体をグレースケールで完結させ、直前までのアクセント色から視線を静める。

## F. 強調/特殊

### F-1 数値統計ドン

**用途**: 強調したい KPI や実績数値を1枚で見せる。説明文は最小限にし、数字そのものを主役にする。

```markdown
<div class="h-full flex flex-col items-center justify-center gap-4">
  <div class="flex items-end gap-2">
    <span class="text-em-3xl font-bold text-brand-navy leading-none">92</span>
    <span class="text-em-2xl font-bold text-brand-navy leading-none pb-2">%</span>
  </div>
  <p class="text-em-lg text-gray-600">新基盤への移行完了率</p>
</div>
```

**デザインポイント**: 数字と単位は同じ navy 1色に統一し、単位は `text-em-2xl` と数字より1段小さくして視線の主役を数字に保つ。キャプションは `gray-600` で控えめに添える。

### F-2 Q&A・問いかけ

**用途**: 議論を促したい場面で、大きな問いを1行提示し、補足を短く添える。

```markdown
<div class="h-full flex flex-col items-center justify-center gap-6 px-20 text-center">
  <p class="text-em-2xl font-bold text-gray-900">この設計は、5年後も運用できるか</p>
  <p class="text-em-base text-gray-500">技術的負債ではなく、資産として引き継げる設計を目指す</p>
</div>
```

**デザインポイント**: 疑問符を使わず「〜か」の体言止めで問いの体裁を保つ（文体ルールの疑問符回避に準拠）。補足は `gray-500` に沈め、問いの一行だけを主役として際立たせる。

### F-3 キーメッセージ1行

**用途**: 章の締めや強く記憶に残したい主張を、余白を多く取って1文だけで見せる。

```markdown
<div class="h-full flex items-center justify-center px-24">
  <p class="text-em-2xl font-bold text-gray-900 text-center leading-relaxed">正しい設計は、変化に耐えるのではなく変化と共に進化する</p>
</div>
```

**デザインポイント**: 装飾色を使わず `gray-900` のみで完結させ、主張そのものに集中させる。左右の余白（`px-24`）と中央寄せで1文を際立たせ、他の要素を一切添えない。
