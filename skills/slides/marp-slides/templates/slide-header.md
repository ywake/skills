---
marp: true
html: true
---

<!--
marp-slides 共通ヘッダ。新しいデッキはこの内容をファイル先頭にコピーして使う。
Tailwind は Play CDN。設定はインライン config で渡す（preflight 無効・em タイポ・brand 色）。
オフライン/バージョン固定運用では、下の cdn.tailwindcss.com を assets/tailwind.js に置換する
（setup.md 参照）。レンダリングは必ず: marp deck.md --images png --html --allow-local-files
-->

<script src="https://cdn.tailwindcss.com"></script>
<script>
  // Tailwind Play CDN のインライン設定。marp の PNG/PDF 出力時にブラウザで実行される。
  tailwind.config = {
    // marp-core の基本スタイルを残すため Tailwind のリセット(preflight)を無効化
    corePlugins: { preflight: false },
    theme: {
      extend: {
        // em ベースのタイポ階層。用途をクラス名に対応させ、毎回の指定ブレを防ぐ
        fontSize: {
          'em-3xl': ['4.5rem', { lineHeight: '1' }],   // 大きな数値強調
          'em-2xl': ['2rem',   { lineHeight: '1.2' }], // パネル/セクション見出し
          'em-xl':  ['1.5rem', { lineHeight: '1.3' }], // サブ見出し
          'em-lg':  ['1.25rem',{ lineHeight: '1.6' }], // 本文(強調)
          'em-base':['1rem',   { lineHeight: '1.7' }], // 本文
          'em-sm':  ['0.85rem',{ lineHeight: '1.6' }], // 注釈/キャプション
        },
        // ブランドのアクセント色。既定はグレー基調＋濃紺＋ティール＋補助ルビー
        colors: {
          brand: { navy: '#1B4565', teal: '#3E9BA4', ruby: '#B23A6B' },
        },
        // 日本語フォントを明示してレンダリング環境差を抑える
        fontFamily: {
          sans: ['"Hiragino Kaku Gothic ProN"', '"Yu Gothic"', '"Noto Sans JP"', 'sans-serif'],
        },
      },
    },
  }
</script>

<style>
/* marp のスライド(section)を Tailwind でフル活用するための最小土台。
   既定の余白を残しつつ、フルブリード配置ができるよう position を確保する。
   注: Play CDN は通常の <style> 内の theme() を解決しないため（検証済み）、
   フォントスタックは直書きにして tailwind.config の fontFamily.sans と値を揃えている */
section { font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans JP", sans-serif; }

/* preflight を無効化しているため、Tailwind の border ユーティリティが既定で
   border-style:none のままになり枠線が出ない。preflight 相当の border 既定
   （width:0 / style:solid）だけを補い、border-* ユーティリティを正常化する。
   marp-core が明示セレクタで付ける枠線（表・hr 等）は詳細度で優先されるため影響しない。 */
*, ::before, ::after { border-width: 0; border-style: solid; }
</style>
