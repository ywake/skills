# 図の見本 — 種類ごとの Before / After と印の付け方

題材は [templates/report.md](../templates/report.md) と同じ「ファイル名の正規化を保存時にも適用する」PR。各図は**変わった区間だけ**で、変わらない前後は Note 1 行に畳んでいる。

凡例: 背景色＝順序や構造が変わった区間（先頭の Note に 🆕 新規区間／🔀 組み替え／⛔ 消える区間）、🆕＝追加、✏️＝変更（After 側）、⛔＝削除（Before 側）。ER 図の列は元の説明の下に ✏️名・✏️型・✏️意（名前・型・意味のどれが変わったか）と旧→新を書く。

## シーケンス図（`rect` で区間を塗り、先頭の Note をキャプションにする）

示していること: 順序の組み替えは 🔀、Before 側の消える区間は ⛔、区間の中で新しい行だけ 🆕、参加しない participant（ユーザー）は消す。

**Before**

```mermaid
sequenceDiagram
    participant SPA
    participant API
    participant FS as ストレージ
    participant DB
    Note over SPA,API: `POST /files/{id}` {name, body}（変更なし）
    rect rgba(255, 193, 7, 0.18)
        Note over API,DB: ⛔ 書いてから記録する順序は無くなる
        API ->> FS: write(name, body)
        API ->> DB: INSERT(name)
    end
    API -->> SPA: 201
```

**After**

```mermaid
sequenceDiagram
    participant SPA
    participant API
    participant FS as ストレージ
    participant DB
    Note over SPA,API: `POST /files/{id}` {name, body}（変更なし）
    rect rgba(255, 193, 7, 0.18)
        Note over API,DB: 🔀 名前を確定して記録してから書く
        API ->> API: 🆕 normalizeFileName(name)
        API ->> DB: INSERT(normalized)
        API ->> FS: write(normalized, body)
    end
    API -->> SPA: 201
```

## ER 図（印は説明セルだけ。元の説明の後に `<br/>` で改行して印を書く）

示していること: 列の改名 ✏️名、型の変更 ✏️型、意味の変更 ✏️意、新規列 🆕、消える列は Before 側に ⛔ と理由。エンティティの改名は角括弧のラベルに同じ書き方。型・名前のセルには mermaid の制約で ASCII 識別子しか置けない。

**Before**

```mermaid
erDiagram
    FILE["ファイル"] {
        string file_id PK "ファイルID"
        string name "表示名（入力のまま）"
        string raw_name "アップロード時の名前<br/>⛔ name が正規化済みになるので不要に"
        datetime saved_at "保存日時"
    }
```

**After**

```mermaid
erDiagram
    FILE["ファイル<br/>✏️意 name は常に正規化済み"] {
        string id PK "ファイルID<br/>✏️名 file_id→id"
        string name "表示名<br/>✏️意 入力のまま→正規化済み"
        int size "バイト数<br/>🆕"
        datetimeoffset saved_at "保存日時<br/>✏️型 datetime→datetimeoffset"
    }
```

## 状態遷移図（`classDef` で新しい状態を塗る。塗ったノードから出る辺には印を付けない）

示していること: 新しい状態はノードを塗る、そこへ入る遷移に 🆕、Before 側の消える遷移に ⛔。

**Before**

```mermaid
stateDiagram-v2
    [*] --> uploaded
    uploaded --> saved : ⛔ save（正規化なし）
    saved --> [*]
```

**After**

```mermaid
stateDiagram-v2
    classDef changed fill:#ffc10733,stroke:#ffc107,stroke-width:2px
    [*] --> uploaded
    uploaded --> normalized : 🆕 normalizeFileName()
    normalized --> saved : save
    normalized --> rejected : 空文字・禁止文字のみ
    saved --> [*]
    rejected --> [*]
    class normalized changed
```

## flowchart（ノードは `classDef`、辺は `linkStyle`）

示していること: 呼び出し関係の変化。共通化されたノードを塗り、新しい辺を `linkStyle` で塗る（辺の番号は 0 始まりの出現順）。

**Before**

```mermaid
flowchart LR
    upload["upload"] --> norm["⛔ normalize（upload の中で）"]
    save["save"] --> write["write"]
```

**After**

```mermaid
flowchart LR
    classDef changed fill:#ffc10733,stroke:#ffc107,stroke-width:2px
    upload["upload"] --> norm["normalizeFileName()"]
    save["save"] --> norm
    norm --> write["write"]
    class norm changed
    linkStyle 1 stroke:#ffc107,stroke-width:2px
```
