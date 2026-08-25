/*
 * Issue #4：予約をキャンセルできるようにする
 * 担当：Dチーム
 *
 * 完了条件：Issue本文の動作をブラウザで確認できること。
 * 編集範囲：features/issue-4-cancel.js
 * このファイルだけを編集してください。共通ファイルや他チームのファイルは変更しません。
 *
 * ヒント：app.registerReservationAction('issue-4', 関数)でボタンを登録する。
 * ボタン操作ではapp.removeReservation(予約ID)を呼び出す。
 */
(function registerFeature(root) {
  root.WorkshopFeatures = root.WorkshopFeatures || {};
  root.WorkshopFeatures['issue-4'] = function setupIssue4(app) {
    const cancelledReservations = [];

    app.registerReservationAction('issue-4', function buildCancelAction(reservation) {
      return {
        label: 'キャンセル',
        className: 'btn btn--danger',
        onClick(target) {
          const inputName = prompt('本人確認のため、予約者名を入力してください');
          if (inputName === null) return;
          if (inputName.trim() !== target.user) {
            showMessage('予約者名が一致しないため、キャンセルできません', 'error');
            return;
          }

          const confirmed = confirm(
            `${target.room}　${target.date} ${target.start}〜${target.end} の予約を本当にキャンセルしますか？`
          );
          if (!confirmed) return;

          if (app.removeReservation(target.id)) {
            cancelledReservations.push({ ...target, cancelledAt: new Date().toISOString() });
            showMessage('予約をキャンセルしました', 'success');
          }
        },
      };
    });
  };
})(typeof window !== 'undefined' ? window : globalThis);
