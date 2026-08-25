/* ==========================================================
   ダークモード機能 (Issue #3)
   担当：Cさん

   スコープ: このファイルのみを変更し、index.html / app.js / style.css
   は変更しません。トグルボタンとダークモード用スタイルは、
   すべてこのファイルの中でDOM/CSSを動的に生成します。
   ========================================================== */

(function () {
  const STORAGE_KEY = 'darkModeEnabled';

  const DARK_MODE_CSS = `
    :root.dark-mode {
      --dark: #06171a;
      --primary: #02aebf;
      --secondary: #02e0a8;
      --warm: #ff8a65;
      --bg: #0f1720;
      --card: #16232b;
      --text: #e6edf0;
      --muted: #9aa9b2;
      --border: #2a3a44;
    }
    :root.dark-mode .form__input { background: #1c2a32; }
    :root.dark-mode .reservation { background: #1c2a32; }

    .dark-mode-toggle {
      appearance: none;
      border: 1px solid rgba(255, 255, 255, 0.4);
      background: rgba(255, 255, 255, 0.08);
      color: inherit;
      font: inherit;
      font-size: 13px;
      font-weight: 700;
      border-radius: 999px;
      padding: 6px 14px;
      cursor: pointer;
      transition: opacity 0.15s;
    }
    .dark-mode-toggle:hover { opacity: 0.8; }
  `;

  function injectStyle() {
    const style = document.createElement('style');
    style.id = 'issue-3-dark-mode-style';
    style.textContent = DARK_MODE_CSS;
    document.head.appendChild(style);
  }

  function isDarkModeEnabled() {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  }

  function applyDarkMode(enabled) {
    document.documentElement.classList.toggle('dark-mode', enabled);
    localStorage.setItem(STORAGE_KEY, String(enabled));
  }

  function updateToggleLabel(button, enabled) {
    button.textContent = enabled ? '☀️ ライトモード' : '🌙 ダークモード';
    button.setAttribute('aria-pressed', String(enabled));
  }

  function createToggleButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'dark-mode-toggle';
    button.setAttribute('aria-label', 'ダークモード切り替え');

    button.addEventListener('click', () => {
      const enabled = !document.documentElement.classList.contains('dark-mode');
      applyDarkMode(enabled);
      updateToggleLabel(button, enabled);
    });

    return button;
  }

  function init() {
    injectStyle();

    const enabled = isDarkModeEnabled();
    applyDarkMode(enabled);

    const header = document.querySelector('.header__inner');
    if (!header) return;

    const button = createToggleButton();
    updateToggleLabel(button, enabled);
    header.appendChild(button);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
