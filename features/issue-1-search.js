/*
 * Issue #1：予約を名前で検索できるようにする
 * 担当：Aチーム
 * 指定ブランチ：feature/issue-1-search
 *
 * 完了条件：Issue本文の動作をブラウザで確認できること。
 * 編集範囲：features/issue-1-search.js
 * このファイルだけを編集してください。共通ファイルや他チームのファイルは変更しません。
 *
 * ヒント：検索欄を作り、app.mount('listControls', 要素)で表示する。
 * app.registerFilter('issue-1', 判定関数)で予約者名を絞り込む。
 */
(function registerFeature(root) {
  root.WorkshopFeatures = root.WorkshopFeatures || {};
  root.WorkshopFeatures['issue-1'] = function setupIssue1(app) {
    // TODO：ここにIssue #1の実装を書く
  };
})(typeof window !== 'undefined' ? window : globalThis);
