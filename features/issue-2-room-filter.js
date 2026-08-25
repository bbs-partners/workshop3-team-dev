/*
 * Issue #2：会議室で絞り込めるようにする
 * 担当：Bチーム
 * 指定ブランチ：feature/issue-2-room-filter
 *
 * 完了条件：Issue本文の動作をブラウザで確認できること。
 * 編集範囲：features/issue-2-room-filter.js
 * このファイルだけを編集してください。共通ファイルや他チームのファイルは変更しません。
 *
 * ヒント：会議室選択欄を作り、app.mount('listControls', 要素)で表示する。
 * app.registerFilter('issue-2', 判定関数)で選択した会議室だけに絞る。
 */
(function registerFeature(root) {
  root.WorkshopFeatures = root.WorkshopFeatures || {};
  root.WorkshopFeatures['issue-2'] = function setupIssue2(app) {
    // TODO：ここにIssue #2の実装を書く
  };
})(typeof window !== 'undefined' ? window : globalThis);
