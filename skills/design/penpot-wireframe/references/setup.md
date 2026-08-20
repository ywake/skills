# Penpot MCP のセットアップ

`execute_code` などのツールが見当たらない場合、MCP サーバーが未接続。以下のどちらかで繋ぐ。

## ホスト版（penpot.app / 自社ドメイン）

1. Penpot にログインし、アカウント設定から **MCP キー**を発行する（キーはユーザーごとに1つだけ）。
2. Claude Code に登録する:

```sh
claude mcp add penpot -t http "https://design.penpot.app/mcp/stream?userToken=YOUR_MCP_KEY"
```

自社ドメインで運用している場合は `design.penpot.app` を差し替える。

ホスト版はローカルファイルを扱えないため、`import_image` のローカルパス指定と `export_shape` の一部が制限される。書き出した画像を手元で見たい場合はローカル版を使う。

## ローカル版

```sh
npx @penpot/mcp@stable
claude mcp add penpot -t http http://localhost:4401/mcp
```

ローカル版は Penpot 側で読み込まれたプラグイン UI を経由して動く。**プラグインの UI ウィンドウを閉じると接続が切れる**ので、作業中は開いたままにする。

## 接続の確認

```
high_level_overview を呼ぶ → ファイル名・ページ名・既存ボードが返る
```

返らない、または想定と違うファイルが返る場合の原因はほぼ以下:

- 対象タブがフォーカスされていない（MCP は**フォーカス中のページ1つ**にしか作用しない）
- 別のタブで Penpot を開いていて、そちらが MCP を掴んでいる（同時に1タブのみ）
- ローカル版でプラグイン UI を閉じてしまった

## アイコンライブラリの接続（初回のみ）

`WF.icon()` は Penpot の共有ライブラリからアイコンを実体化する。プラグインのサンドボックスは外部への
`fetch` をブロックするので、実行時にアイコンを取りに行くことはできない。以下は Penpot 上での手作業。

1. [Lucide Icons](https://penpot.app/penpothub/libraries-templates/lucide-icons) をダッシュボードにインポートする
2. インポートしたファイルのメニュー（ファイル名の左の三点）から **Add as Shared Library**
3. ワイヤーを作るファイルを開き、アセットパネルからそのライブラリを接続する

接続できたかの確認:

```js
return penpot.library.connected.map(l => l.name);   // 'Lucide-icons' が含まれること
```

`library.components` は 1420 個あり、全件を配列に展開すると重い。名前で引くときは `find` で早期に
打ち切る（`WF.icon()` はそうしている）。

## 出典

- Penpot MCP 公式ヘルプ: https://help.penpot.app/mcp/
- リポジトリ: https://github.com/penpot/penpot-mcp
- プラグイン API リファレンス: https://doc.plugins.penpot.app/
