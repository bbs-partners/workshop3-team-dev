/*
 * Issue #1：予約を名前で検索できるようにする
 * 担当：Aチーム
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
    let keyword = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'form__row';

    const label = document.createElement('label');
    label.className = 'form__label';
    label.setAttribute('for', 'issue1SearchInput');
    label.textContent = '検索';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'issue1SearchInput';
    input.className = 'form__input';
    input.placeholder = '予約者名で検索';

    input.addEventListener('input', () => {
      keyword = input.value.trim();
      app.registerFilter('issue-1', reservation => reservation.user.includes(keyword));
    });

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    app.mount('listControls', wrapper);

    app.registerFilter('issue-1', reservation => reservation.user.includes(keyword));
  };
})(typeof window !== 'undefined' ? window : globalThis);
