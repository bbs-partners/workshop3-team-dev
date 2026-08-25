const test = require('node:test');
const assert = require('node:assert/strict');
const { createWorkshopApp } = require('../app.js');

test('複数チームの絞り込み条件を組み合わせられる', () => {
  const app = createWorkshopApp([
    { id: 1, room: '第1会議室', date: '2026-07-15', start: '10:00', end: '11:00', user: '田中' },
    { id: 2, room: '第2会議室', date: '2026-07-15', start: '13:30', end: '14:30', user: '佐藤' },
  ]);
  app.registerFilter('issue-1', r => r.user.includes('田'));
  app.registerFilter('issue-2', r => r.room === '第1会議室');
  assert.deepEqual(app.getVisibleReservations().map(r => r.id), [1]);
});

test('予約削除後に購読者へ最新データを通知する', () => {
  const app = createWorkshopApp([{ id: 1, room: '第1会議室', date: '2026-07-15', start: '10:00', end: '11:00', user: '田中' }]);
  let latest = null;
  app.subscribe(reservations => { latest = reservations; });
  assert.equal(app.removeReservation(1), true);
  assert.deepEqual(latest, []);
  assert.equal(app.removeReservation(999), false);
});

test('チーム別の予約カード操作を独立登録できる', () => {
  const app = createWorkshopApp([]);
  app.registerReservationAction('issue-4', reservation => ({ label: `取消 ${reservation.id}` }));
  assert.equal(app.getReservationActions({ id: 7 })[0].label, '取消 7');
});
