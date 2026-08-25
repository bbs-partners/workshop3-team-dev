/* ==========================================================
   会議室予約システム — 共通基盤（受講者は編集しません）
   各チームは features/ の担当Issueファイルだけを編集します。
   ========================================================== */

const INITIAL_RESERVATIONS = [
  { id: 1, room: '第1会議室', date: '2026-07-15', start: '10:00', end: '11:00', user: '田中' },
  { id: 2, room: '第2会議室', date: '2026-07-15', start: '13:30', end: '14:30', user: '佐藤' },
  { id: 3, room: '第1会議室', date: '2026-07-16', start: '09:00', end: '10:30', user: '山口' },
];

function createWorkshopApp(initialReservations = []) {
  let reservations = initialReservations.map(r => ({ ...r }));
  const filters = new Map();
  const actionFactories = new Map();
  const subscribers = new Set();
  let renderCallback = null;

  function snapshot() { return reservations.map(r => ({ ...r })); }
  function refresh() {
    const current = snapshot();
    subscribers.forEach(listener => listener(current));
    if (renderCallback) renderCallback();
  }

  return {
    getReservations: snapshot,
    getVisibleReservations() {
      return snapshot().filter(reservation =>
        [...filters.values()].every(predicate => predicate(reservation))
      );
    },
    addReservation(reservation) {
      reservations.push({ ...reservation });
      refresh();
    },
    removeReservation(id) {
      const next = reservations.filter(r => r.id !== id);
      if (next.length === reservations.length) return false;
      reservations = next;
      refresh();
      return true;
    },
    registerFilter(name, predicate) {
      filters.set(name, predicate);
      refresh();
    },
    registerReservationAction(name, factory) {
      actionFactories.set(name, factory);
      refresh();
    },
    getReservationActions(reservation) {
      return [...actionFactories.entries()]
        .map(([name, factory]) => ({ name, ...factory({ ...reservation }) }))
        .filter(action => action.label);
    },
    runReservationAction(name, reservation) {
      const factory = actionFactories.get(name);
      if (!factory) return false;
      const action = factory({ ...reservation });
      if (typeof action.onClick !== 'function') return false;
      action.onClick({ ...reservation });
      return true;
    },
    subscribe(listener) {
      subscribers.add(listener);
      return () => subscribers.delete(listener);
    },
    setRenderCallback(callback) { renderCallback = callback; },
    mount(slotId, element) {
      const slot = document.getElementById(slotId);
      if (!slot) throw new Error(`表示場所が見つかりません: ${slotId}`);
      slot.appendChild(element);
    },
  };
}

const workshopApp = createWorkshopApp(INITIAL_RESERVATIONS);
let nextId = 4;

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

function isOverlapping(room, date, start, end) {
  return workshopApp.getReservations().some(r =>
    r.room === room && r.date === date && start < r.end && end > r.start
  );
}

function showMessage(text, type) {
  const el = document.getElementById('message');
  el.textContent = text;
  el.className = 'message message--' + type;
  setTimeout(() => { el.textContent = ''; el.className = 'message'; }, 4000);
}

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
    showMessage('その時間帯はすでに予約が入っています', 'error'); return;
  }
  workshopApp.addReservation({ id: nextId++, room, date, start, end, user });
  showMessage('予約しました', 'success');
  document.getElementById('user').value = '';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);
}

function renderList() {
  const listEl = document.getElementById('reservationList');
  const sorted = workshopApp.getVisibleReservations().sort((a, b) =>
    a.date === b.date ? a.start.localeCompare(b.start) : a.date.localeCompare(b.date)
  );
  if (sorted.length === 0) {
    listEl.innerHTML = '<p class="empty">表示できる予約はありません</p>';
    return;
  }
  listEl.innerHTML = sorted.map(r => {
    const actions = workshopApp.getReservationActions(r).map(action =>
      `<button class="${escapeHtml(action.className || 'btn btn--danger')}" data-action="${escapeHtml(action.name)}" data-reservation-id="${r.id}">${escapeHtml(action.label)}</button>`
    ).join('');
    return `<div class="reservation">
      <div class="reservation__main">
        <span class="reservation__room">${escapeHtml(r.room)}</span>
        <span class="reservation__time">${escapeHtml(r.date)}　${escapeHtml(r.start)} 〜 ${escapeHtml(r.end)}</span>
        <span class="reservation__user">予約者: ${escapeHtml(r.user)}</span>
      </div><div class="reservation__actions">${actions}</div>
    </div>`;
  }).join('');
  listEl.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => {
      const reservation = workshopApp.getReservations().find(r => r.id === Number(button.dataset.reservationId));
      if (reservation) workshopApp.runReservationAction(button.dataset.action, reservation);
    });
  });
}

function init() {
  workshopApp.setRenderCallback(renderList);
  buildTimeOptions();
  document.getElementById('date').value = '2026-07-15';
  document.getElementById('reserveBtn').addEventListener('click', addReservation);
  renderList();
  const features = window.WorkshopFeatures || {};
  ['issue-1', 'issue-2', 'issue-3', 'issue-4', 'issue-5'].forEach(name => {
    if (typeof features[name] === 'function') features[name](workshopApp);
  });
}

if (typeof window !== 'undefined') {
  window.WorkshopFeatures = window.WorkshopFeatures || {};
  window.WorkshopApp = workshopApp;
}
if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', init);
if (typeof module !== 'undefined' && module.exports) module.exports = { createWorkshopApp };
