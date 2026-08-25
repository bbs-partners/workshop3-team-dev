/*
 * Issue #4：予約をキャンセルできるようにする
 * 担当：Dチーム
 * 指定ブランチ：feature/issue-4-cancel
 *
 * 完了条件：Issue本文の動作をブラウザで確認できること。
 * 編集範囲：features/issue-4-cancel.js
 * このファイルだけを編集してください。共通ファイルや他チームのファイルは変更しません。
 *
 * ヒント：app.registerReservationAction('issue-4', 関数)でボタンを登録する。
 * 関数は { label: 'キャンセル', className: 'btn btn--danger', onClick: () => ... } を返す。
 * onClickではapp.removeReservation(予約ID)を呼び出す。
 */
(function registerFeature(root) {
  root.WorkshopFeatures = root.WorkshopFeatures || {};
  root.WorkshopFeatures['issue-4'] = function setupIssue4(app) {
    // TODO：ここにIssue #4の実装を書く
  };
})(typeof window !== 'undefined' ? window : globalThis);
