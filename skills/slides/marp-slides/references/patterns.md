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

## B. カラムレイアウト

### B-1 2カラム比較

**用途**: 2案・Before/After・長所短所などの対比。

```markdown
<div class="h-full grid grid-cols-2 gap-6 p-12">
  <div class="bg-gray-50 rounded-xl p-8 flex flex-col gap-3">
    <h3 class="text-em-2xl font-bold text-brand-navy">案A</h3>
    <p class="text-em-base text-gray-700">説明テキスト。</p>
  </div>
  <div class="bg-gray-100 rounded-xl p-8 flex flex-col gap-3">
    <h3 class="text-em-2xl font-bold text-brand-teal">案B</h3>
    <p class="text-em-base text-gray-700">説明テキスト。</p>
  </div>
</div>
```

**デザインポイント**: 左右は gray-50/gray-100 の濃淡で対比（枠線に頼らない）。見出し色でアクセント、本数は2色まで。

### B-2 左文右図

**用途**: 左にテキストで要点を説明し、右に画像やスクリーンショットのプレースホルダを配置する構成。図版の差し替え前でも下書きとして使える。

```markdown
<div class="h-full grid grid-cols-2 gap-8 p-12 items-center">
  <div class="flex flex-col gap-4">
    <span class="text-em-sm tracking-widest text-brand-teal">ARCHITECTURE</span>
    <h2 class="text-em-xl font-bold text-gray-900">新ダッシュボードの構成</h2>
    <p class="text-em-base text-gray-700">主要指標を1画面に集約し、部門横断での状況把握を数秒で終わらせる構成にする。</p>
    <ul class="text-em-base text-gray-700 list-disc list-inside flex flex-col gap-1">
      <li>リアルタイム更新に対応</li>
      <li>権限に応じた表示切り替え</li>
    </ul>
  </div>
  <div class="h-64 bg-gray-50 border border-dashed border-gray-300 rounded-xl flex items-center justify-center">
    <span class="text-em-sm text-gray-400">図版・スクリーンショットを配置</span>
  </div>
</div>
```

**デザインポイント**: 右側は破線枠のプレースホルダとして実装し、後から画像に差し替えられるようにする。アクセントは teal のラベル1色のみに絞り、本文は gray-700 で統一する。

### B-3 3カラム

**用途**: プロセスの3ステップや3つの要点を横並びで見せる構成。

```markdown
<div class="h-full grid grid-cols-3 gap-6 p-12">
  <div class="flex flex-col gap-3">
    <span class="text-em-2xl font-bold text-brand-navy">01</span>
    <h3 class="text-em-lg font-bold text-gray-900">現状把握</h3>
    <p class="text-em-base text-gray-700">既存システムの構成と課題を棚卸しする。</p>
  </div>
  <div class="flex flex-col gap-3">
    <span class="text-em-2xl font-bold text-brand-navy">02</span>
    <h3 class="text-em-lg font-bold text-gray-900">設計</h3>
    <p class="text-em-base text-gray-700">将来の拡張を見据えたアーキテクチャを描く。</p>
  </div>
  <div class="flex flex-col gap-3">
    <span class="text-em-2xl font-bold text-brand-navy">03</span>
    <h3 class="text-em-lg font-bold text-gray-900">移行</h3>
    <p class="text-em-base text-gray-700">段階的な切り替えでリスクを抑えて実行する。</p>
  </div>
</div>
```

**デザインポイント**: 番号は navy 1色で統一し、背景色は使わず余白だけで区切る。カラム数が増える B-4 以降は `gap` と本文サイズを段階的に下げる方針とする。

### B-4 4カラム

**用途**: KPI や指標を4項目並べて一覧させる構成。

```markdown
<div class="h-full grid grid-cols-4 gap-5 p-12">
  <div class="bg-gray-50 rounded-xl p-5 flex flex-col gap-2">
    <h3 class="text-em-base font-bold text-brand-navy">売上</h3>
    <p class="text-em-sm text-gray-700">前年比112%で推移している。</p>
  </div>
  <div class="bg-gray-50 rounded-xl p-5 flex flex-col gap-2">
    <h3 class="text-em-base font-bold text-brand-navy">解約率</h3>
    <p class="text-em-sm text-gray-700">四半期を通じて低下が続いている。</p>
  </div>
  <div class="bg-gray-50 rounded-xl p-5 flex flex-col gap-2">
    <h3 class="text-em-base font-bold text-brand-navy">満足度</h3>
    <p class="text-em-sm text-gray-700">導入後アンケートで高評価を維持している。</p>
  </div>
  <div class="bg-gray-50 rounded-xl p-5 flex flex-col gap-2">
    <h3 class="text-em-base font-bold text-brand-navy">稼働率</h3>
    <p class="text-em-sm text-gray-700">主要機能の利用率が伸びている。</p>
  </div>
</div>
```

**デザインポイント**: 4カラムになった段階で見出しを `text-em-base`、本文を `text-em-sm` に下げ、`gap` も `gap-5` まで詰めて横のはみ出しを防ぐ。アクセントは navy 1色のみ。

### B-5 5カラム

**用途**: 工程やステータスを5段階で一覧させる構成。カラム数が最も多いため、密度優先のレイアウトになる。

```markdown
<div class="h-full grid grid-cols-5 gap-3 p-10">
  <div class="border border-gray-200 rounded-lg p-3 flex flex-col gap-1">
    <h3 class="text-em-sm font-bold text-brand-navy">要件定義</h3>
    <p class="text-em-sm text-gray-700">完了</p>
  </div>
  <div class="border border-gray-200 rounded-lg p-3 flex flex-col gap-1">
    <h3 class="text-em-sm font-bold text-brand-navy">設計</h3>
    <p class="text-em-sm text-gray-700">完了</p>
  </div>
  <div class="border border-gray-200 rounded-lg p-3 flex flex-col gap-1">
    <h3 class="text-em-sm font-bold text-brand-navy">実装</h3>
    <p class="text-em-sm text-gray-700">進行中</p>
  </div>
  <div class="border border-gray-200 rounded-lg p-3 flex flex-col gap-1">
    <h3 class="text-em-sm font-bold text-gray-400">テスト</h3>
    <p class="text-em-sm text-gray-400">未着手</p>
  </div>
  <div class="border border-gray-200 rounded-lg p-3 flex flex-col gap-1">
    <h3 class="text-em-sm font-bold text-gray-400">リリース</h3>
    <p class="text-em-sm text-gray-400">未着手</p>
  </div>
</div>
```

**デザインポイント**: 5カラムでは見出し・本文とも `text-em-sm` に統一し、`gap-3`・`p-10` まで詰めてはみ出しを防ぐ。背景色は使わず `border-gray-200` の枠線のみで区切り、未着手項目は赤系ではなく `gray-400` への沈め込みで状態差を表現する。

### B-6 2x2グリッド

**用途**: SWOT分析など、4象限で整理したい情報を見せる構成。

```markdown
<div class="h-full grid grid-cols-2 grid-rows-2 gap-6 p-12">
  <div class="bg-gray-50 rounded-xl p-6 flex flex-col gap-2">
    <h3 class="text-em-lg font-bold text-brand-navy">強み</h3>
    <p class="text-em-base text-gray-700">独自データを活用した高精度な予測ができる。</p>
  </div>
  <div class="bg-gray-50 rounded-xl p-6 flex flex-col gap-2">
    <h3 class="text-em-lg font-bold text-brand-teal">弱み</h3>
    <p class="text-em-base text-gray-700">導入初期の学習コストが高い。</p>
  </div>
  <div class="bg-gray-50 rounded-xl p-6 flex flex-col gap-2">
    <h3 class="text-em-lg font-bold text-brand-teal">機会</h3>
    <p class="text-em-base text-gray-700">規制変更により市場が拡大している。</p>
  </div>
  <div class="bg-gray-50 rounded-xl p-6 flex flex-col gap-2">
    <h3 class="text-em-lg font-bold text-brand-navy">脅威</h3>
    <p class="text-em-base text-gray-700">競合の参入速度が上がっている。</p>
  </div>
</div>
```

**デザインポイント**: 4象限とも同じ `bg-gray-50` パネルで統一し、見出し色の navy/teal を交互に配置してグルーピングを示す（色数は2色まで）。行数が増えても `gap-6` の余白は保てる密度に収める。

### B-7 2x3グリッド

**用途**: 機能一覧やチェックリストなど、6項目を均等なカードで並べる構成。

```markdown
<div class="h-full grid grid-cols-3 grid-rows-2 gap-4 p-10">
  <div class="bg-gray-50 rounded-lg p-4 flex flex-col gap-1">
    <h3 class="text-em-base font-bold text-brand-navy">認証</h3>
    <p class="text-em-sm text-gray-700">シングルサインオンに対応する。</p>
  </div>
  <div class="bg-gray-50 rounded-lg p-4 flex flex-col gap-1">
    <h3 class="text-em-base font-bold text-brand-navy">権限管理</h3>
    <p class="text-em-sm text-gray-700">部署単位で細かく設定できる。</p>
  </div>
  <div class="bg-gray-50 rounded-lg p-4 flex flex-col gap-1">
    <h3 class="text-em-base font-bold text-brand-navy">監査ログ</h3>
    <p class="text-em-sm text-gray-700">操作履歴を自動で記録する。</p>
  </div>
  <div class="bg-gray-50 rounded-lg p-4 flex flex-col gap-1">
    <h3 class="text-em-base font-bold text-brand-navy">通知</h3>
    <p class="text-em-sm text-gray-700">異常検知時に即時に知らせる。</p>
  </div>
  <div class="bg-gray-50 rounded-lg p-4 flex flex-col gap-1">
    <h3 class="text-em-base font-bold text-brand-navy">バックアップ</h3>
    <p class="text-em-sm text-gray-700">毎日自動でスナップショットを保存する。</p>
  </div>
  <div class="bg-gray-50 rounded-lg p-4 flex flex-col gap-1">
    <h3 class="text-em-base font-bold text-brand-navy">API連携</h3>
    <p class="text-em-sm text-gray-700">主要な外部サービスと接続できる。</p>
  </div>
</div>
```

**デザインポイント**: 6枚のカードを均一な `bg-gray-50`/`p-4` で揃え、本文は `text-em-sm` に下げて2行程度に収める。行数が増える2x3では `gap-4`・`p-10` まで詰めて縦方向のはみ出しを防ぐ。アクセントは navy の見出し1色のみ。

### B-8 非対称1:2

**用途**: 主張を大きく述べる左ブロックと、要点を箇条書きでまとめる右サイドバーを組み合わせた構成。

```markdown
<div class="h-full grid grid-cols-3 gap-8 p-12">
  <div class="col-span-2 flex flex-col gap-4">
    <h2 class="text-em-xl font-bold text-gray-900">新料金プランの狙い</h2>
    <p class="text-em-base text-gray-700">利用量に応じた従量課金を軸にしつつ、主要機能は定額部分に残すことで、乗り換えの障壁を下げる設計にする。</p>
    <p class="text-em-base text-gray-700">既存顧客には移行猶予期間を設け、混乱なく新プランへ切り替えられるようにする。</p>
  </div>
  <div class="bg-gray-50 rounded-xl p-6 flex flex-col gap-3">
    <h3 class="text-em-lg font-bold text-brand-navy">要点</h3>
    <ul class="text-em-sm text-gray-700 list-disc list-inside flex flex-col gap-2">
      <li>従量課金を軸にする</li>
      <li>主要機能は定額のまま</li>
      <li>移行猶予期間を設ける</li>
    </ul>
  </div>
</div>
```

**デザインポイント**: `grid-cols-3` で左を `col-span-2` にし、本文主体の左と要約サイドバーの右で役割を分ける。右サイドバーの箇条書きは `text-em-sm` に下げて密度を高め、アクセントは navy の見出し1色のみに絞る。

## C. 縦リスト

### C-1 番号ステップ

**用途**: 手順・段階的な流れ（3〜4ステップ）を示す。

```markdown
<div class="h-full flex flex-col justify-center gap-4 px-16">
  <div class="flex items-start gap-4">
    <div class="shrink-0 w-12 h-12 rounded-full bg-brand-navy text-white flex items-center justify-center text-em-xl font-bold">1</div>
    <div>
      <h3 class="text-em-xl font-semibold text-gray-800">要件を洗い出す</h3>
      <p class="text-em-base text-gray-600">関係者へのヒアリングで前提を固める。</p>
    </div>
  </div>
  <div class="flex items-start gap-4">
    <div class="shrink-0 w-12 h-12 rounded-full bg-brand-navy text-white flex items-center justify-center text-em-xl font-bold">2</div>
    <div>
      <h3 class="text-em-xl font-semibold text-gray-800">設計案をまとめる</h3>
      <p class="text-em-base text-gray-600">制約条件を踏まえて複数案を比較検討する。</p>
    </div>
  </div>
  <div class="flex items-start gap-4">
    <div class="shrink-0 w-12 h-12 rounded-full bg-brand-navy text-white flex items-center justify-center text-em-xl font-bold">3</div>
    <div>
      <h3 class="text-em-xl font-semibold text-gray-800">合意を得て着手する</h3>
      <p class="text-em-base text-gray-600">レビューを経て、実装フェーズへ移行する。</p>
    </div>
  </div>
</div>
```

**デザインポイント**: 番号バッジは `bg-brand-navy` の塗りで統一し、数字は `text-em-xl font-bold` で視認性を確保する。縦に5項目以上入れない（超えたら2列グリッドに切替える）。

### C-2 アイコン付きパネル箇条書き

**用途**: 複数の要点を等価に並べて示したいとき、各項目をパネル化して視認性を高める。

```markdown
<div class="h-full flex flex-col justify-center gap-3 px-16">
  <div class="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
    <div class="shrink-0 w-10 h-10 rounded-lg bg-brand-navy text-white flex items-center justify-center text-em-lg font-bold">◆</div>
    <p class="text-em-base text-gray-700">既存システムとの互換性を維持する。</p>
  </div>
  <div class="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
    <div class="shrink-0 w-10 h-10 rounded-lg bg-brand-navy text-white flex items-center justify-center text-em-lg font-bold">◆</div>
    <p class="text-em-base text-gray-700">導入コストを最小限に抑える。</p>
  </div>
  <div class="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
    <div class="shrink-0 w-10 h-10 rounded-lg bg-brand-navy text-white flex items-center justify-center text-em-lg font-bold">◆</div>
    <p class="text-em-base text-gray-700">運用チームの負担を増やさない。</p>
  </div>
  <div class="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
    <div class="shrink-0 w-10 h-10 rounded-lg bg-brand-navy text-white flex items-center justify-center text-em-lg font-bold">◆</div>
    <p class="text-em-base text-gray-700">将来の拡張余地を残しておく。</p>
  </div>
</div>
```

**デザインポイント**: アイコンは `bg-brand-navy` の角丸正方形に統一し、記号1文字（◆など）に留めて装飾過多を避ける。背景は `bg-gray-50` のみとし、縦に5項目以上入れない（超えたら2列グリッドに切替える）。

### C-3 縦タイムライン

**用途**: 日付や工程を時系列で並べ、経過と到達点を視覚的に示す。

```markdown
<div class="h-full flex flex-col justify-center gap-1 px-20">
  <div class="flex gap-4">
    <div class="flex flex-col items-center">
      <div class="w-3 h-3 rounded-full bg-brand-navy shrink-0"></div>
      <div class="w-px flex-1 bg-gray-200 mt-1"></div>
    </div>
    <div class="pb-6">
      <span class="text-em-sm text-gray-500">2024年4月</span>
      <h3 class="text-em-lg font-bold text-gray-900">要件定義フェーズ開始</h3>
    </div>
  </div>
  <div class="flex gap-4">
    <div class="flex flex-col items-center">
      <div class="w-3 h-3 rounded-full bg-brand-navy shrink-0"></div>
      <div class="w-px flex-1 bg-gray-200 mt-1"></div>
    </div>
    <div class="pb-6">
      <span class="text-em-sm text-gray-500">2024年8月</span>
      <h3 class="text-em-lg font-bold text-gray-900">基本設計を完了</h3>
    </div>
  </div>
  <div class="flex gap-4">
    <div class="flex flex-col items-center">
      <div class="w-3 h-3 rounded-full bg-brand-navy shrink-0"></div>
    </div>
    <div>
      <span class="text-em-sm text-gray-500">2025年1月</span>
      <h3 class="text-em-lg font-bold text-gray-900">本番リリース</h3>
    </div>
  </div>
</div>
```

**デザインポイント**: 最後の項目だけ縦線（`w-px flex-1 bg-gray-200`）を省き、終端であることを示す。ドットは `bg-brand-navy` の1色に統一し、日付ラベルは `text-em-sm text-gray-500` で控えめに添える。縦に5項目以上入れない（超えたら2列グリッドに切替える）。

### C-4 Before→After 対応

**用途**: 施策実施前後の変化を左右で対比させ、効果を直感的に伝える。

```markdown
<div class="h-full flex flex-col justify-center gap-4 px-16">
  <div class="grid grid-cols-[1fr_auto_1fr] gap-4 px-1">
    <span class="text-em-sm tracking-widest text-gray-400">BEFORE</span>
    <span></span>
    <span class="text-em-sm tracking-widest text-brand-teal">AFTER</span>
  </div>
  <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
    <div class="bg-gray-50 rounded-lg px-5 py-3 text-em-base text-gray-500">月次で手作業集計</div>
    <span class="text-em-lg text-brand-teal">→</span>
    <div class="bg-gray-50 rounded-lg px-5 py-3 text-em-base font-semibold text-gray-900">日次で自動集計</div>
  </div>
  <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
    <div class="bg-gray-50 rounded-lg px-5 py-3 text-em-base text-gray-500">担当者ごとに手順が異なる</div>
    <span class="text-em-lg text-brand-teal">→</span>
    <div class="bg-gray-50 rounded-lg px-5 py-3 text-em-base font-semibold text-gray-900">手順を標準化して共有</div>
  </div>
  <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
    <div class="bg-gray-50 rounded-lg px-5 py-3 text-em-base text-gray-500">障害対応に半日かかる</div>
    <span class="text-em-lg text-brand-teal">→</span>
    <div class="bg-gray-50 rounded-lg px-5 py-3 text-em-base font-semibold text-gray-900">30分以内に一次対応</div>
  </div>
</div>
```

**デザインポイント**: `grid-cols-[1fr_auto_1fr]` で左右のカードと中央の矢印を揃え、矢印は `text-brand-teal` の1色のみで強調する。BEFORE 側は `text-gray-500` に沈め、AFTER 側は `font-semibold text-gray-900` として変化後を主役にする。縦に5項目以上入れない（超えたら2列グリッドに切替える）。

### C-5 チェックリスト

**用途**: 完了条件やリリース判定など、満たすべき項目を列挙する。

```markdown
<div class="h-full flex flex-col justify-center gap-3 px-16">
  <div class="flex items-center gap-4">
    <div class="shrink-0 w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center text-em-base font-bold">✓</div>
    <p class="text-em-lg text-gray-800">要件定義書のレビューが完了している</p>
  </div>
  <div class="flex items-center gap-4">
    <div class="shrink-0 w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center text-em-base font-bold">✓</div>
    <p class="text-em-lg text-gray-800">セキュリティ診断で指摘事項がない</p>
  </div>
  <div class="flex items-center gap-4">
    <div class="shrink-0 w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center text-em-base font-bold">✓</div>
    <p class="text-em-lg text-gray-800">運用手順書が最新化されている</p>
  </div>
  <div class="flex items-center gap-4">
    <div class="shrink-0 w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center text-em-base font-bold">✓</div>
    <p class="text-em-lg text-gray-800">ロールバック手順を確認済みである</p>
  </div>
</div>
```

**デザインポイント**: バッジは `bg-brand-teal` の円形に `✓` の記号1文字のみを置き、装飾的な絵文字は使わない。縦に5項目以上入れない（超えたら2列グリッドに切替える）。

## D. パネル

### D-1 白カード＋シャドウ

**用途**: 本文の一部を白背景カードで区切り、注目を集めたい情報を独立させる。

```markdown
<div class="h-full flex items-center justify-center bg-gray-50 px-16">
  <div class="bg-white rounded-2xl shadow-xl p-10 flex flex-col gap-3 max-w-xl">
    <h3 class="text-em-xl font-bold text-gray-900">新契約プランのご案内</h3>
    <p class="text-em-base text-gray-700">利用量に応じた従量課金と、主要機能を含む定額プランを組み合わせ、無駄のない料金体系を実現する。</p>
  </div>
</div>
```

**デザインポイント**: スライド全体の背景を `bg-gray-50` にして `shadow-xl` の白カードを浮き上がらせる。アクセント色は使わず `gray-900`/`gray-700` の濃淡のみで完結させる。

### D-2 ガラス風

**用途**: グラデーション背景の上に半透明パネルを重ね、洗練された印象を与えたいとき。

```markdown
<div class="h-full relative flex items-center justify-center overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-br from-brand-navy to-brand-teal"></div>
  <div class="absolute -left-10 -top-10 w-72 h-72 rounded-full bg-white/20"></div>
  <div class="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/10"></div>
  <div class="relative bg-white/20 backdrop-blur-md rounded-2xl p-10 flex flex-col gap-3 max-w-xl border border-solid border-white/30">
    <h3 class="text-em-xl font-bold text-white">次世代プラットフォーム</h3>
    <p class="text-em-base text-white/90">クラウドネイティブな構成で、拡張性と運用効率を両立する。</p>
  </div>
</div>
```

**デザインポイント**: `bg-white/20 backdrop-blur-md` の効果は、必ず色のあるグラデーションや装飾円などの背景要素の上に重ねて使う。単色/白背景の上では透過がほぼ見えず成立しない。`preflight: false` の環境では `border-*` の幅・色ユーティリティだけでは枠線が描画されないため、`border-solid` を明示的に併用する。

### D-3 グラデパネル

**用途**: 重要な洞察や結論を、周囲から視覚的に切り離して強調する。

```markdown
<div class="h-full flex items-center justify-center px-16">
  <div class="bg-gradient-to-br from-brand-navy to-brand-teal rounded-2xl p-10 flex flex-col gap-3 text-white w-full">
    <span class="text-em-sm tracking-widest opacity-80">KEY INSIGHT</span>
    <h3 class="text-em-xl font-bold">データ活用が競争優位の源泉になる</h3>
    <p class="text-em-base text-white/90">意思決定のスピードと精度を高め、他社との差別化につなげる。</p>
  </div>
</div>
```

**デザインポイント**: `from-brand-navy to-brand-teal` のグラデーションはこのパネル1枚に限定し、他の要素と重複させない。見出し前の短いラベル（`text-em-sm tracking-widest opacity-80`）で文脈を添える。

### D-4 左ボーダー強調

**用途**: 前提条件・制約事項など、複数の短い項目を区切って並べる。

```markdown
<div class="h-full flex flex-col justify-center gap-6 px-16">
  <div class="border-solid border-l-4 border-brand-teal pl-6 py-2">
    <h3 class="text-em-lg font-bold text-gray-900">前提条件</h3>
    <p class="text-em-base text-gray-700">既存システムのAPIを変更せずに新基盤を追加する。</p>
  </div>
  <div class="border-solid border-l-4 border-brand-teal pl-6 py-2">
    <h3 class="text-em-lg font-bold text-gray-900">制約事項</h3>
    <p class="text-em-base text-gray-700">移行期間中もサービスを停止させない。</p>
  </div>
  <div class="border-solid border-l-4 border-brand-teal pl-6 py-2">
    <h3 class="text-em-lg font-bold text-gray-900">留意点</h3>
    <p class="text-em-base text-gray-700">関係部署への周知を移行の2週間前までに終える。</p>
  </div>
</div>
```

**デザインポイント**: `border-l-4 border-brand-teal` は、`preflight: false` の環境では幅・色のユーティリティだけでは枠線が描画されないため、必ず `border-solid` を併用する。縦に5項目以上入れない（超えたら2列グリッドに切替える）。

### D-5 引用コールアウト

**用途**: 社内標準や第三者の言葉を引用し、主張に権威づけを行いたいとき。

```markdown
<div class="h-full flex flex-col items-center justify-center gap-4 px-24 text-center">
  <span class="text-em-2xl text-brand-teal leading-none">&ldquo;</span>
  <p class="text-em-xl italic text-gray-800 leading-relaxed">最良の設計とは、変更コストを最小化する設計である</p>
  <p class="text-em-sm text-gray-500">ー 社内アーキテクチャ標準ガイドライン</p>
</div>
```

**デザインポイント**: 引用符は `text-brand-teal` の1色だけをアクセントに使う。本文は `italic text-gray-800` で読みやすさを保ちつつ引用らしさを出し、出典は `text-em-sm text-gray-500` に沈めて主従関係を明確にする。

## E. 背景/画像

### E-1 全面画像＋オーバーレイ

**用途**: 表紙・章扉でビジュアルを強く出す。

```markdown
![bg](images/cover.jpg)

<div class="h-full flex flex-col justify-end p-16 bg-black/40 text-white">
  <h1 class="text-em-2xl font-bold">プロダクトの全体像</h1>
  <p class="text-em-lg opacity-90">2026 年の到達点</p>
</div>
```

**デザインポイント**: 画像は `images/` 配下に置き、パスは `images/cover.jpg` のように相対指定する。レンダリングには `--allow-local-files` フラグが必須。可読性のため必ず半透明オーバーレイ（`bg-black/40` 等）を敷く。前景テキストは白＋ `opacity` で階層化する。

### E-2 左右分割bg

**用途**: 事例・実績など、写真とテキストを対で見せたいとき。

```markdown
![bg left](images/side.jpg)

<div class="h-full flex flex-col justify-center gap-4 px-12">
  <span class="text-em-sm tracking-widest text-brand-teal">CASE STUDY</span>
  <h2 class="text-em-xl font-bold text-gray-900">新工場の稼働開始</h2>
  <p class="text-em-base text-gray-700">最新設備の導入により生産効率を高め、供給体制を強化する。</p>
</div>
```

**デザインポイント**: `![bg left]` を使うと画像がスライド左半分を占め、右半分は通常のコンテンツ領域として扱える（`![bg right]` で左右を反転できる）。アクセントは `text-brand-teal` のラベル1色のみに絞る。画像は `images/side.jpg` のように相対パスで配置し、`--allow-local-files` を忘れない。

### E-3 グラデ背景セクション

**用途**: 実績・数値のハイライトを、画像を使わずに強い印象で見せたいとき。

```markdown
<div class="h-full w-full flex flex-col justify-center gap-6 px-20 bg-gradient-to-br from-brand-navy to-brand-teal text-white">
  <span class="text-em-sm tracking-widest opacity-80">FISCAL YEAR 2026</span>
  <h2 class="text-em-2xl font-bold">売上成長率 148%</h2>
  <p class="text-em-lg text-white/90">新規顧客獲得とアップセルの両輪で過去最高の成長を達成した</p>
</div>
```

**デザインポイント**: A-2 のグラデーション扉と同じ `from-brand-navy to-brand-teal` を用い、配色の一貫性を保つ。写真素材を用意できないときの代替として使える。ラベルは `opacity-80`、本文は `text-white/90` で階層をつけ、白1色の中で濃淡だけを変える。

### E-4 背景アニメ（GIF）

**用途**: 継続的な取り組みやサイクルを、動きのある背景で印象づけたいとき。

```markdown
![bg](images/loop.gif)

<div class="h-full flex flex-col items-center justify-center gap-4 bg-black/50 text-white text-center">
  <h2 class="text-em-2xl font-bold">止まらないリリースサイクル</h2>
  <p class="text-em-base opacity-90">計測と改善を毎日繰り返す運用体制</p>
</div>
```

**デザインポイント**: GIF も静止画と同じく `images/` 配下に置き、`![bg](images/loop.gif)` という通常の画像と同一の書き方で背景に敷ける。PNG で静止画検証する際はアニメーションの1フレームしか写らない点に注意し、実際の動きは Marp のプレビューやブラウザ表示で確認する。前景は E-1 と同じく半透明オーバーレイ（`bg-black/50`）を重ねて可読性を確保する。

## G. 応用

### G-1 QR誘導

**用途**: 資料末尾や CTA スライドで、QR コードから外部リンク（アンケート・申込・資料 DL など）へ誘導する。

```markdown
<div class="h-full flex flex-col items-center justify-center gap-8">
  <div class="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-em-base text-gray-400">QR</div>
  <div class="flex flex-col items-center gap-2 text-center">
    <h3 class="text-em-xl font-bold text-gray-900">アンケートにご協力ください</h3>
    <p class="text-em-base text-gray-600">スマートフォンで QR コードを読み取り、3分ほどで回答できます</p>
  </div>
</div>
```

**デザインポイント**: A-5 と同じ破線プレースホルダ規約で QR 画像枠を実装し、後から本物の QR 画像に差し替えられるようにする。視線を QR に集めるためアクセント色は使わずグレースケール中心にする。

### G-2 事例紹介

**用途**: 導入事例をロゴ・概要・成果数値とともに簡潔に紹介する。

```markdown
<div class="h-full flex flex-col justify-center gap-8 px-16">
  <div class="w-40 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-em-sm text-gray-400">LOGO</div>
  <div class="flex flex-col gap-2">
    <h3 class="text-em-xl font-bold text-gray-900">株式会社サンプル様</h3>
    <p class="text-em-base text-gray-700">在庫管理システムの刷新により、月次棚卸しにかかる作業工数を削減した。</p>
  </div>
  <div class="flex items-end gap-2">
    <span class="text-em-2xl font-bold text-brand-navy leading-none">70</span>
    <span class="text-em-lg font-bold text-brand-navy leading-none">%</span>
    <span class="text-em-base text-gray-600">棚卸し工数を削減</span>
  </div>
</div>
```

**デザインポイント**: ロゴ枠は A-5 / B-2 と同じ破線プレースホルダ規約で実装し、後から画像に差し替える。成果数値は F-1 の数値強調規約を踏襲し、単位は本数値よりワンランク小さいサイズにして brand-navy 一色でまとめる。

### G-3 比較表

**用途**: 自社と他社、複数プランなど複数項目を表形式で比較する。

```markdown
<div class="h-full flex flex-col justify-center px-16">
  <table class="w-full border-collapse text-em-base">
    <thead>
      <tr>
        <th class="text-left font-bold px-4 py-3 bg-brand-navy text-white rounded-l-lg">比較項目</th>
        <th class="text-left font-bold px-4 py-3 bg-brand-navy text-white">自社プラン</th>
        <th class="text-left font-bold px-4 py-3 bg-brand-navy text-white rounded-r-lg">他社プラン</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="px-4 py-3 border-b border-gray-200 text-gray-700">初期費用</td>
        <td class="px-4 py-3 border-b border-gray-200 font-semibold text-gray-900">0円</td>
        <td class="px-4 py-3 border-b border-gray-200 text-gray-500">10万円〜</td>
      </tr>
      <tr>
        <td class="px-4 py-3 border-b border-gray-200 text-gray-700">サポート体制</td>
        <td class="px-4 py-3 border-b border-gray-200 font-semibold text-gray-900">24時間365日</td>
        <td class="px-4 py-3 border-b border-gray-200 text-gray-500">平日9時から18時</td>
      </tr>
      <tr>
        <td class="px-4 py-3 text-gray-700">契約期間</td>
        <td class="px-4 py-3 font-semibold text-gray-900">1か月単位</td>
        <td class="px-4 py-3 text-gray-500">1年単位</td>
      </tr>
    </tbody>
  </table>
</div>
```

**デザインポイント**: ヘッダー行のみ `bg-brand-navy` で塗り、本文は `text-gray-900`（自社側の強調）と `text-gray-500`（比較対象）で書き分けて視線を誘導する。border は行単位ではなくセル単位（`td` に直接 `border-b border-gray-200`）で指定し、marp-core 既定のテーマ表スタイルより確実に優先させる。列数・行数を増やしすぎるとはみ出すため、3列前後・4行程度を目安にする。

### G-4 横プロセスフロー

**用途**: 導入までの流れや施策のステップを横方向のフローとして示す。

```markdown
<div class="h-full flex items-center justify-center gap-4 px-12">
  <div class="flex-1 bg-gray-50 rounded-lg p-6 text-center">
    <div class="text-em-xl font-bold text-brand-navy mb-2">01</div>
    <div class="text-em-base text-gray-700">要件整理</div>
  </div>
  <div class="text-em-lg text-brand-teal">→</div>
  <div class="flex-1 bg-gray-50 rounded-lg p-6 text-center">
    <div class="text-em-xl font-bold text-brand-navy mb-2">02</div>
    <div class="text-em-base text-gray-700">設計</div>
  </div>
  <div class="text-em-lg text-brand-teal">→</div>
  <div class="flex-1 bg-gray-50 rounded-lg p-6 text-center">
    <div class="text-em-xl font-bold text-brand-navy mb-2">03</div>
    <div class="text-em-base text-gray-700">開発</div>
  </div>
  <div class="text-em-lg text-brand-teal">→</div>
  <div class="flex-1 bg-gray-50 rounded-lg p-6 text-center">
    <div class="text-em-xl font-bold text-brand-navy mb-2">04</div>
    <div class="text-em-base text-gray-700">運用開始</div>
  </div>
</div>
```

**デザインポイント**: ステップ番号は B-3 と同じ brand-navy の太字ラベル、矢印は C-4 と同じ `text-brand-teal` の → で統一する。各ボックスは `flex-1` で均等幅にし、矢印は幅固定のテキストのままにして中央揃えを崩さない。ステップ数は横幅に収まる4つ程度を目安にする。

### G-5 ロードマップ

**用途**: 複数四半期・月にわたる計画を時間軸に沿った横帯で示す。

```markdown
<div class="h-full flex flex-col justify-center px-16">
  <div class="flex items-center">
    <div class="flex flex-col items-center gap-3">
      <div class="text-em-sm text-gray-500">2026 Q1</div>
      <div class="w-4 h-4 rounded-full bg-brand-navy"></div>
    </div>
    <div class="flex-1 h-px bg-gray-200"></div>
    <div class="flex flex-col items-center gap-3">
      <div class="text-em-sm text-gray-500">2026 Q2</div>
      <div class="w-4 h-4 rounded-full bg-brand-navy"></div>
    </div>
    <div class="flex-1 h-px bg-gray-200"></div>
    <div class="flex flex-col items-center gap-3">
      <div class="text-em-sm text-gray-500">2026 Q3</div>
      <div class="w-4 h-4 rounded-full bg-brand-teal"></div>
    </div>
    <div class="flex-1 h-px bg-gray-200"></div>
    <div class="flex flex-col items-center gap-3">
      <div class="text-em-sm text-gray-500">2026 Q4</div>
      <div class="w-4 h-4 rounded-full bg-brand-teal"></div>
    </div>
  </div>
  <div class="flex justify-between mt-4">
    <div class="w-1/4 text-em-base text-gray-700 text-center">要件定義</div>
    <div class="w-1/4 text-em-base text-gray-700 text-center">設計・開発</div>
    <div class="w-1/4 text-em-base text-gray-700 text-center">試験導入</div>
    <div class="w-1/4 text-em-base text-gray-700 text-center">全社展開</div>
  </div>
</div>
```

**デザインポイント**: C-3 の縦タイムラインの横方向版として、`flex-1 h-px bg-gray-200` の連結線の上にドットを並べる。直近フェーズは brand-navy、以降の見込みフェーズは brand-teal にして進捗の境目を示す（アクセントは2色まで）。日付ラベルは `text-em-sm text-gray-500` で C-3 のキャプションと表記を揃える。

### G-6 チーム紹介

**用途**: プロジェクトチームやメンバーを写真枠付きで紹介する。

```markdown
<div class="h-full grid grid-cols-4 gap-6 p-12">
  <div class="flex flex-col items-center gap-3">
    <div class="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-em-sm text-gray-400">写真</div>
    <div class="text-em-base font-semibold text-gray-900">山田 太郎</div>
    <div class="text-em-sm text-gray-500">プロジェクトリーダー</div>
  </div>
  <div class="flex flex-col items-center gap-3">
    <div class="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-em-sm text-gray-400">写真</div>
    <div class="text-em-base font-semibold text-gray-900">佐藤 花子</div>
    <div class="text-em-sm text-gray-500">デザイナー</div>
  </div>
  <div class="flex flex-col items-center gap-3">
    <div class="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-em-sm text-gray-400">写真</div>
    <div class="text-em-base font-semibold text-gray-900">鈴木 一郎</div>
    <div class="text-em-sm text-gray-500">エンジニア</div>
  </div>
  <div class="flex flex-col items-center gap-3">
    <div class="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-em-sm text-gray-400">写真</div>
    <div class="text-em-base font-semibold text-gray-900">田中 恵</div>
    <div class="text-em-sm text-gray-500">マーケター</div>
  </div>
</div>
```

**デザインポイント**: アバター枠は A-5 / B-2 と同じ破線プレースホルダ規約の円形版で、後から写真に差し替える。列数が増える場合は B-3 系のグリッド密度規約に倣い、`gap` とフォントサイズを段階的に縮める。

### G-7 コード提示

**用途**: 実装例やコマンドをコードとして提示する。

```markdown
<div class="h-full flex flex-col justify-center px-16 gap-4">
  <h3 class="text-em-xl font-bold text-gray-900">実装例</h3>
  <pre class="bg-gray-900 rounded-lg p-6 overflow-hidden"><code class="font-mono text-em-sm text-gray-100 leading-relaxed">function greet(name) {
  return `こんにちは、${name}さん`;
}

console.log(greet("marp"));</code></pre>
</div>
```

**デザインポイント**: コードブロックは `bg-gray-900` に `font-mono` と `text-em-sm` の `text-gray-100` を明示して等幅表示にする。行数が増えるとスライドからはみ出すため5行程度を目安にする。

### G-8 グラフ＋考察

**用途**: グラフ画像を提示しながら、右側でその考察・示唆をまとめる。

```markdown
<div class="h-full grid grid-cols-2 gap-10 p-12 items-center">
  <img src="images/graph.jpg" class="w-full rounded-lg" />
  <div class="flex flex-col gap-4">
    <h3 class="text-em-xl font-bold text-gray-900">考察</h3>
    <ul class="flex flex-col gap-3 text-em-base text-gray-700">
      <li>◆ 導入後3か月で問い合わせ対応時間が半減した</li>
      <li>◆ 利用継続率は前年同期比で上昇傾向にある</li>
      <li>◆ 今後は他部門への展開が課題となる</li>
    </ul>
  </div>
</div>
```

**デザインポイント**: グラフ画像は E-2 / E-4 と同じ実パスの `<img>` 参照（`images/graph.jpg`）で配置し、ローカルファイルなので `--allow-local-files` を付け忘れない。箇条書きの記号は C-2 と同じ ◆ で統一する。

### G-9 2軸4象限

**用途**: ポジショニング・優先度づけ（重要度×緊急度など）を2軸4象限で示す。

```markdown
<div class="h-full flex flex-col justify-center gap-3 p-16">
  <div class="flex justify-between pl-16 text-em-sm text-gray-500">
    <span>緊急度 低</span>
    <span>緊急度 高</span>
  </div>
  <div class="flex-1 flex gap-4">
    <div class="flex flex-col justify-between text-em-sm text-gray-500 py-4">
      <span>重要度 高</span>
      <span>重要度 低</span>
    </div>
    <div class="flex-1 grid grid-cols-2 grid-rows-2 gap-2">
      <div class="bg-gray-50 rounded-lg p-6 flex items-start text-em-base text-gray-700">第1象限</div>
      <div class="bg-brand-teal/10 rounded-lg p-6 flex items-start text-em-base text-gray-700">第2象限</div>
      <div class="bg-gray-100 rounded-lg p-6 flex items-start text-em-base text-gray-700">第3象限</div>
      <div class="bg-gray-50 rounded-lg p-6 flex items-start text-em-base text-gray-700">第4象限</div>
    </div>
  </div>
</div>
```

**デザインポイント**: 象限は濃淡＋アクセント1色の薄塗り（`bg-brand-teal/10` のみ着色、他は gray 系）で区別する。軸ラベルは `text-em-sm` の `text-gray-500` とし、回転文字は使わず横書きのまま上と左に配置する。B-6 の SWOT 型2x2グリッドとは異なり、軸の意味を明示するポジショニングマトリクスとして使う。

### G-10 アーキ図

**用途**: システム構成やデータフローを簡易アーキテクチャ図で示す。

```markdown
<div class="h-full flex flex-col justify-center items-center gap-6 px-16">
  <h3 class="text-em-xl font-bold text-gray-900">システム構成</h3>
  <img src="svg/arch.svg" class="w-full" />
</div>
```

**デザインポイント**: `svg/` に手描きした最小サンプル SVG（3ボックス＋矢印）を `<img src="svg/arch.svg" class="w-full">` で配置する一例。より詳細な作図規約（配色・線幅など）は `svg-creator.md`（Task 10）を参照する。ローカルファイルなので `--allow-local-files` を忘れない。
