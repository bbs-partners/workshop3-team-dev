/*
 * Issue #2：会議室で絞り込めるようにする
 * 担当：Bチーム
 *
 * 完了条件：Issue本文の動作をブラウザで確認できること。
 * 編集範囲：features/issue-2-room-filter.js
 * このファイルだけを編集してください。共通ファイルや他チームのファイルは変更しません。
 *
 * ヒント：会議室選択欄を作り、app.mount('listControls', 要素)で表示する。
 * app.registerFilter('issue-2', 判定関数)で選択した会議室だけに絞る。
 *
 * 決めたこと：
 * - 初期状態は「すべて表示」（全会議室が見える状態からスタート）
 * - 会議室の選択肢は、新規予約フォームの #room の選択肢を読み取って作る
 *   （会議室が増えてもこのファイルを直さずに追従できる）
 * - issue-1（検索）などの他チームのフィルターとは registerFilter の名前が
 *   別なので、AND条件で自然に併用できる（app.js 側の仕組みによる）
 */
(function registerFeature(root) {
  root.WorkshopFeatures = root.WorkshopFeatures || {};
  root.WorkshopFeatures['issue-2'] = function setupIssue2(app) {
    const SHOW_ALL = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'form__row';

    const label = document.createElement('label');
    label.className = 'form__label';
    label.setAttribute('for', 'roomFilter');
    label.textContent = '会議室';

    const select = document.createElement('select');
    select.id = 'roomFilter';
    select.className = 'form__input';

    const allOption = document.createElement('option');
    allOption.value = SHOW_ALL;
    allOption.textContent = 'すべて表示';
    select.appendChild(allOption);

    getRoomNames(app).forEach(room => {
      const option = document.createElement('option');
      option.value = room;
      option.textContent = room;
      select.appendChild(option);
    });

    select.value = SHOW_ALL;

    function applyFilter() {
      const selectedRoom = select.value;
      app.registerFilter('issue-2', reservation =>
        selectedRoom === SHOW_ALL || reservation.room === selectedRoom
      );
    }

    select.addEventListener('change', applyFilter);

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    app.mount('listControls', wrapper);

    applyFilter();
  };

  // 新規予約フォームの会議室リストを読み取る。取得できない場合は
  // 現在の予約データから会議室名を集めてフォールバックする。
  function getRoomNames(app) {
    const roomSelect = document.getElementById('room');
    if (roomSelect && roomSelect.options.length > 0) {
      return [...roomSelect.options].map(option => option.value).filter(Boolean);
    }
    const rooms = new Set(app.getReservations().map(r => r.room));
    return [...rooms];
  }
})(typeof window !== 'undefined' ? window : globalThis);
