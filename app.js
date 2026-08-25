/* ==========================================================
   会議室予約システム — メインロジック
   第3回研修「チーム開発」練習用

   このアプリは「未完成」です。
   チームで分担して、TODO を完成させるのが今日のゴールです。
   ========================================================== */

// ---------- データ（メモリ上・ブラウザを閉じると消えます） ----------
let reservations = [
  { id: 1, room: '第1会議室', date: '2026-07-15', start: '10:00', end: '11:00', user: '田中' },
  { id: 2, room: '第2会議室', date: '2026-07-15', start: '13:30', end: '14:30', user: '佐藤' },
  { id: 3, room: '第1会議室', date: '2026-07-16', start: '09:00', end: '10:30', user: '山口' },
];
let nextId = 4;

// ---------- 時刻の選択肢を作る（30分単位・9:00〜19:00） ----------
function buildTimeOptions() {
  const times = [];
  for (let h = 9; h <= 19; h++) {
    times.push(`${String(h).padStart(2, '0')}:00`);
    if (h !== 19) times.push(`${String(h).padStart(2, '0')}:30`);
  }
  const startSel = document.getElementById('startTime');
  const endSel = document.getElementById('endTime');
  times.forEach(t => {
    startSel.insertAdjacentHTML('beforeend', `<option value="${t}">${t}</option>`);
    endSel.insertAdjacentHTML('beforeend', `<option value="${t}">${t}</option>`);
  });
  startSel.value = '10:00';
  endSel.value = '11:00';
}

// ---------- 予約の重複チェック ----------
function isOverlapping(room, date, start, end) {
  return reservations.some(r =>
    r.room === room &&
    r.date === date &&
    start < r.end &&
    end > r.start
  );
}

// ---------- メッセージ表示 ----------
function showMessage(text, type) {
  const el = document.getElementById('message');
  el.textContent = text;
  el.className = 'message message--' + type;
  setTimeout(() => { el.textContent = ''; el.className = 'message'; }, 4000);
}

// ---------- 予約を追加する ----------
function addReservation() {
  const room = document.getElementById('room').value;
  const date = document.getElementById('date').value;
  const start = document.getElementById('startTime').value;
  const end = document.getElementById('endTime').value;
  const user = document.getElementById('user').value.trim();

  if (!date) { showMessage('日付を選んでください', 'error'); return; }
  if (!user) { showMessage('予約者を入力してください', 'error'); return; }
  if (start >= end) { showMessage('終了時刻は開始時刻より後にしてください', 'error'); return; }
  if (isOverlapping(room, date, start, end)) {
    showMessage('その時間帯はすでに予約が入っています', 'error');
    return;
  }

  reservations.push({ id: nextId++, room, date, start, end, user });
  showMessage('予約しました', 'success');
  document.getElementById('user').value = '';
  renderList();
}

// ---------- 予約一覧を描画する ----------
function renderList() {
  const listEl = document.getElementById('reservationList');

  // 日付→開始時刻の順に並べる
  const sorted = [...reservations].sort((a, b) =>
    a.date === b.date ? a.start.localeCompare(b.start) : a.date.localeCompare(b.date)
  );

  if (sorted.length === 0) {
    listEl.innerHTML = '<p class="empty">予約はまだありません</p>';
    return;
  }

  listEl.innerHTML = sorted.map(r => `
    <div class="reservation">
      <div class="reservation__main">
        <span class="reservation__room">${r.room}</span>
        <span class="reservation__time">${r.date}　${r.start} 〜 ${r.end}</span>
        <span class="reservation__user">予約者: ${r.user}</span>
      </div>
      <!-- TODO-4: ここに「キャンセルボタン」を追加する（担当：Dさん） -->
    </div>
  `).join('');
}

// ==========================================================
// TODO-4: キャンセル機能（担当：Dさん）
//   下の関数を完成させ、上の renderList にボタンを追加してください。
// ==========================================================
// function cancelReservation(id) {
//   ここに処理を書く
// }

// ==========================================================
// TODO-5: 予約が入っている日を数える機能（担当：Eさん）
//   「今月の予約件数」をヘッダーに表示したい。
// ==========================================================


// ---------- 起動処理 ----------
function init() {
  buildTimeOptions();
  document.getElementById('date').value = '2026-07-15';
  document.getElementById('reserveBtn').addEventListener('click', addReservation);
  renderList();
}

document.addEventListener('DOMContentLoaded', init);
