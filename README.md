# 会議室予約システム — チーム開発練習用

i-kigai AI Workshop Series **第3回「チームで開発する」** の練習用リポジトリです。

第2回で要件定義した「会議室予約システム」が、**未完成の状態**で入っています。
第3回では、これをチームで分担して完成させます。

---

## 動かしてみる

難しい準備は要りません。`index.html` をダブルクリックしてブラウザで開くだけです。

```
workshop3-team-dev/
├── index.html    ← これをブラウザで開く
├── style.css     ← 見た目
├── app.js        ← 共通基盤（後半は編集しない）
├── features/     ← 後半ワークのチーム別ファイル
├── practice.md   ← ワーク①（事故る練習）で使う
├── TODO.md       ← 完成させる課題の詳細
└── members/      ← 事前課題で使うフォルダ
```

いま動くこと：
- 会議室・日付・時間を選んで予約できる
- 同じ会議室で時間が重なる予約はできない（重複防止）
- 予約一覧が日付順に並ぶ

---

## 📌 事前課題（研修前に必ず終わらせてください）

当日スムーズに始めるため、**研修の前日まで**に以下を完了させてください。
所要 20〜30分です。詰まったら遠慮なく講師に連絡してください。

### ゴール
`members/` フォルダに **自分のGitHubユーザー名またはニックネームのファイル** を作って、GitHubに反映させる。

> ⚠️ このリポジトリはpublicです。氏名、部署名、メールアドレスなどの個人情報・社内情報は書かないでください。

### 手順

配布資料「**事前セットアップ手順書**」に、画面つきで詳しく書いてあります。
ここでは流れだけ示します。

1. **GitHubアカウントを作る**（持っている人は不要）
2. **リポジトリへの招待を承認する** — GitHubの通知またはメールから `Accept invitation`
3. **Gitをインストールする**
4. **GitHub CLI で認証する** — `gh auth login`
5. **書き込み権限を確認する** — `viewerPermission` が `WRITE` であること
6. **このリポジトリを自分のPCに取ってくる（clone）**
7. **`members/` に自分のGitHubユーザー名またはニックネームのファイルを作る**
8. **変更を記録して、GitHubに送る（commit → push）**

> ⚠️ このリポジトリはpublicのため、招待を未承認でもcloneはできます。ただし、`WRITE`でなければpushできません。必ず権限確認を済ませてください。

### 手順4〜8のコマンド例

```bash
# 認証状態を確認
gh auth status

# WRITE と表示されることを確認
gh repo view bbs-partners/workshop3-team-dev --json viewerPermission --jq .viewerPermission

# リポジトリを取得して移動
git clone https://github.com/bbs-partners/workshop3-team-dev.git
cd workshop3-team-dev

# GitHubユーザー名またはニックネームでファイルを作る（例：github-user）
echo "github-user / よろしくお願いします" > members/github-user.md

# 変更を記録して送る
git add members/github-user.md
git commit -m "add: github-userのメンバーファイルを追加"
git push
```

### 完了の確認方法

GitHubのこのページを開いて、`members/` フォルダの中に自分のファイルが見えていれば完了です。
講師側でも確認できるので、報告は不要です。

---

## 当日やること（予告）

### ワーク① 「事故」を体験する
全員が `practice.md` の同じ1行目を同時に直して、**わざと衝突（コンフリクト）を起こします**。
うまくいかなくて正解です。ここが今日いちばんの学びどころ。
このワークでは `index.html`、`style.css`、`app.js`、`features/` を変更しません。

### ワーク② 「型」を入れて再挑戦する
Issue を起点に、ブランチを分けて、PRを出して、レビューして承認してからマージする——
チーム開発の作法を使って、下の課題を分担して完成させます。

作業の流れ：
1. **Issues タブ**からチームの担当Issueを開き、Assignees にチーム全員を設定
2. 下の表にある**指定ブランチ名をそのまま使って**ブランチを切る
3. 実装して、PRを出す（本文に `Closes #1` のように担当Issue番号を書く）
4. 実装担当以外のメンバーがレビュー・承認と動作確認を行う
5. マージして、**Issueが自動で閉じる**ことと公開画面の動作を確認

---

## 完成させる課題（Issue #1〜#5）

1チームで1つのIssueを担当します。

| チーム | 担当Issue | 指定ブランチ名 | 編集するファイル |
|-------|----------|----------------|------------------|
| A | #1 | `feature/issue-1-search` | `features/issue-1-search.js` |
| B | #2 | `feature/issue-2-room-filter` | `features/issue-2-room-filter.js` |
| C | #3 | `feature/issue-3-dark-mode` | `features/issue-3-dark-mode.js` |
| D | #4 | `feature/issue-4-cancel` | `features/issue-4-cancel.js` |
| E | #5 | `feature/issue-5-monthly-count` | `features/issue-5-monthly-count.js` |

2名チームになった場合は、隣のチームがPRレビューを補助します。

各チームは、表にある**指定ブランチ名をそのまま使い、専用ファイルだけ**を編集します。`index.html`、`style.css`、`app.js`、他チームのファイルは変更しません。ブランチ名の違いと担当外の変更はCIが検知します。

Claude Codeへの依頼例：

```text
Issue #1とfeatures/issue-1-search.jsを読んで、このファイルのTODOだけを実装して。他のファイルは変更しないで。
```

PRレビューでは、次の3点を確認します。

1. 担当ファイルだけを変更している
2. Issueに書かれた動作になっている
3. ブラウザの実画面で動く

各課題の詳しい要件は `TODO.md`、Issueの事前登録は `ISSUES-SETUP.md`（講師向け）を見てください。

---

## 困ったときは

- コマンドが分からない → 配布した「Gitコマンドチートシート」
- 用語が分からない → 配布した「周辺知識ハンドブック」
- それでも詰まったら → 当日、手を挙げてください

---

*i-kigai株式会社 / AI Workshop Series #3*
