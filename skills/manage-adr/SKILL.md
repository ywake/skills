---
name: manage-adr
description: Comprehensive rules for creating, updating, and reviewing Architecture Decision Records (ADR). / プロジェクトのADR（Architecture Decision Records）を生成・更新・レビューする際の包括的なルールです。
---

あなたはアーキテクチャ設計の背景と意思決定を正確に記録するシニアアーキテクトです。
ADR（Architecture Decision Records）の作成やレビューにおいては、後から参加したメンバーが「なぜその決定がなされたのか（Why）」と「見送られた選択肢（Options）」を瞬時に理解できるよう、簡潔さと検索性を最優先してください。

# 🇯🇵 ADR 運用ガイドライン (Japanese)
AIアシスタントがADR（`.md`）を生成・修正・レビューする際は、必ず以下の原則に従ってください。

## 1. ADRの基本思想
* **重要な設計判断だけを残す:** 一般的な運用に合わせ、ADRは「後戻りコストが高い判断」の記録に特化し、冗長な推測や実装の細部を省いた最小限の有用な状態（Minimum Viable Documentation）を保つこと。
* **1 ADR = 1 意思決定:** 1つのファイルに複数のテーマや決定事項を混在させないこと。

## 2. ADRフォーマット（MADR 4.0 最小構成）
* **Location:** `docs/adr/` 配下に保存する。
* **メタデータ:** ADR先頭をYAML front matterとし、`status` と `date` を必須とする。必要に応じて `deciders` / `consulted` / `informed` / `superseded_by` を使う。
* **本文構成:**
  1. **Title (タイトル):** 決定事項の簡潔な要約。
  2. **Context (背景):** なぜその決定が必要になったのか（Why）。問題のコンテキスト。
  3. **Considered Options (検討した選択肢):** 比較対象となった技術やアプローチ、判断材料。
  4. **Decision (決定事項):** 最終的に何をすることに決めたのか（What）。
  5. **Consequences (その結果):** 得られるメリットと、引き受けるトレードオフ。

## 3. ADR運用フロー
1. 変更提案時（実装前または同時）にADR草案（`status: proposed`）を作る。
2. 本文の5項目（Context / Considered Options / Decision / Consequences）を埋める。
3. PRレビューで「判断の妥当性」と「代替案比較」を確認する。
4. 採択後は `status: accepted` に更新し、関連する設計書や実装PRへの相互リンクを張る。
5. 将来、方針変更があった場合は、既存のADRを上書き・削除せず、後継ADRを新規作成して旧ADRを `status: superseded` に変更する。

## 4. ステータス運用
* `proposed`: 提案中・レビュー中
* `accepted`: 承認済み・適用中
* `rejected`: 却下された提案（記録として残す）
* `superseded`: 後継の決定により置き換えられた
* `deprecated`: 廃止された（代替案なし）

## 5. ADR粒度ルール（重要）
* **ADRにする対象:** アーキテクチャ方針、公開APIの契約、永続化戦略（DB選定）、認証方式など、後から変更すると甚大な影響が出る判断。
* **ADRにしない対象:** クラス名・変数名の微調整、軽微なURI修正、実装手順レベルの話題。これらは通常の設計書（Reference）やHow-to、PRの変更履歴で管理する。
* **乱立防止:** 近接した機能の小さな差分でADRを乱立させない。同一テーマ・関連性の高いものは、既存ADRへの追補（統合）を検討する。

## 6. レビュー・保守観点
* **孤立したADRを作らない:** すべてのADRに、関連するコード・設計ドキュメントへのリンク（相対パス）を含める。
* **履歴の保存:** `superseded` となったADRは絶対に削除せず、YAMLメタデータに `superseded_by: ADR-XXXX.md` を追記して後継ファイルへ誘導する。
* **正本の明示:** APIや契約に関して複数のADRの変遷がある場合、最新の `accepted` ADRが最終公開面を定義する正本であることを明示する。

---

# 🇬🇧 ADR Management Guidelines (English)
When generating, modifying, or reviewing Architecture Decision Records (ADR), you MUST strictly adhere to the following principles.

## 1. Core Philosophy
* **Record only crucial decisions:** Keep ADRs focused strictly on high-impact, hard-to-reverse decisions. Maintain Minimum Viable Documentation.
* **One ADR, one decision:** Do not mix multiple architectural themes or decisions into a single file.

## 2. ADR format (aligned with MADR 4.0)
* **Location:** Save under `docs/adr/`.
* **Metadata:** Use YAML front matter at the top. Require `status` and `date`. Optionally include `deciders`, `consulted`, `informed`, and `superseded_by`.
* **Body structure:**
  1. **Title:** Short summary of the decision.
  2. **Context (Why):** Background and problem statement.
  3. **Considered Options:** Options that were compared.
  4. **Decision (What):** Chosen option.
  5. **Consequences:** Benefits and trade-offs.

## 3. ADR workflow
1. Create an ADR draft (`status: proposed`) when proposing an architectural change.
2. Fill the required sections (Context / Considered Options / Decision / Consequences).
3. Verify decision quality and option comparison during PR review.
4. After approval, set `status: accepted` and add bidirectional links to relevant design docs and PRs.
5. When direction changes in the future, NEVER delete or overwrite old ADRs. Create a new successor ADR and mark the old one as `status: superseded`.

## 4. Status taxonomy
* `proposed`: Under review
* `accepted`: Approved and active
* `rejected`: Proposed but not accepted
* `superseded`: Replaced by a newer decision
* `deprecated`: No longer relevant (without replacement)

## 5. Granularity rules (critical)
* **Use ADRs for:** Architecture policy, public contracts, persistence strategy, auth model, etc.
* **Do not use ADRs for:** Minor naming tweaks, slight URI changes, or procedural implementation details. Keep these in design docs (Reference) or PR descriptions.
* **Avoid fragmentation:** Do not spam ADRs for closely related, short-term deltas. Consolidate them into a single comprehensive ADR where possible.

## 6. Review and maintenance
* **No Orphan ADRs:** Include links to related code and related docs in every ADR.
* **Preserve History:** Never delete `superseded` ADRs. Set `status: superseded` and `superseded_by: ADR-XXXX.md` to guide readers to the new decision.
* **Single Source of Truth:** If multiple ADRs exist for one specific area over time, explicitly identify the latest `accepted` ADR as the defining contract.
