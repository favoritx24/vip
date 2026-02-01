// ============================================
// ФАЙЛ: js/main.js
// Основные функции приложения
// ============================================

// Утилиты для работы с модальными окнами
function showModal(title, content) {
  const overlay = document.getElementById('modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  
  if (overlay && modalTitle && modalBody) {
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    overlay.style.display = 'flex';
    
    // Блокируем прокрутку фона
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// Уведомления
function showNotification(message, type = 'info') {
  // Создаем элемент уведомления
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  // Иконка в зависимости от типа
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '❌';
  if (type === 'warning') icon = '⚠️';
  
  notification.innerHTML = `
    <span>${icon} ${message}</span>
    <button onclick="this.parentElement.remove()">×</button>
  `;
  
  // Добавляем на страницу
  document.body.appendChild(notification);
  
  // Автоматическое удаление через 5 секунд
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

// Основные функции приложения

function openMainMenu() {
  const content = `
    <div class="menu-modal">
      <button class="btn-menu" onclick="showMyStats()">📊 ${window.i18n.t('my_stats')}</button>
      <button class="btn-menu" onclick="inviteFriends()">👥 ${window.i18n.t('invite_friends')}</button>
      <button class="btn-menu" onclick="shareBot()">📤 ${window.i18n.t('share_bot')}</button>
      <button class="btn-menu" onclick="openAdminPanel()">⚙️ ${window.i18n.t('admin_panel')}</button>
      <button class="btn-menu" onclick="showSettings()">🔧 Настройки</button>
    </div>
  `;
  
  showModal(window.i18n.t('main_menu'), content);
}

function inviteFriends() {
  const userId = '6042195044'; // В реальности из API
  const referralLink = `https://t.me/TestBotnew26_bot?start=ref_${userId}`;
  
  const content = `
    <div class="referral-modal">
      <p>Пригласите друзей и получайте бонусы!</p>
      <div class="referral-link-container">
        <input type="text" value="${referralLink}" readonly class="referral-link-input" id="referral-link">
        <button onclick="copyReferralLink()" class="btn-analyze" style="margin-top: 10px;">
          ${window.i18n.getIcon('copy')} ${window.i18n.t('copy_link')}
        </button>
      </div>
      <div class="referral-stats">
        <p><strong>Приглашено:</strong> 0 друзей</p>
        <p><strong>Бонусов:</strong> 0</p>
        <p><strong>Требуется:</strong> 1 для полного доступа</p>
      </div>
    </div>
  `;
  
  showModal(window.i18n.t('invite_friends'), content);
}

function copyReferralLink() {
  const input = document.getElementById('referral-link');
  if (input) {
    input.select();
    document.execCommand('copy');
    showNotification(window.i18n.t('link_copied'), 'success');
  }
}

function shareBot() {
  if (navigator.share) {
    navigator.share({
      title: 'TG Auditor Pro',
      text: 'Попробуйте этого бота для анализа Telegram каналов!',
      url: 'https://t.me/TestBotnew26_bot',
    });
  } else {
    // Fallback для десктопов
    const url = 'https://t.me/TestBotnew26_bot';
    navigator.clipboard.writeText(url);
    showNotification('Ссылка скопирована в буфер', 'success');
  }
}

function openAdminPanel() {
  // Проверяем админские права (в реальности через API)
  const isAdmin = true; // Заглушка
  
  if (isAdmin) {
    const content = `
      <div class="admin-panel">
        <h4>Административная панель</h4>
        <div class="admin-stats">
          <p>Всего пользователей: 1,234</p>
          <p>Активных сегодня: 456</p>
          <p>Всего анализов: 7,890</p>
        </div>
        <div class="admin-actions">
          <button class="btn-menu">Управление пользователями</button>
          <button class="btn-menu">Логи системы</button>
          <button class="btn-menu">Настройки бота</button>
        </div>
      </div>
    `;
    
    showModal(window.i18n.t('admin_panel'), content);
  } else {
    showNotification('Доступ только для администраторов', 'error');
  }
}

function showMyStats() {
  const content = `
    <div class="stats-modal">
      <div class="stat-item">
        <div class="stat-label">ID</div>
        <div class="stat-value">6042195044</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Язык</div>
        <div class="stat-value" id="current-lang-modal">RU</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Регистрация</div>
        <div class="stat-value">2026-02-01</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Активность</div>
        <div class="stat-value">2026-02-01T16:47</div>
      </div>
    </div>
  `;
  
  showModal(window.i18n.t('my_stats'), content);
}

function showSettings() {
  const content = `
    <div class="settings-modal">
      <h4>Настройки</h4>
      <div class="setting-item">
        <label>Уведомления</label>
        <input type="checkbox" checked>
      </div>
      <div class="setting-item">
        <label>Автоматический анализ</label>
        <input type="checkbox">
      </div>
      <div class="setting-item">
        <label>Тема</label>
        <select>
          <option>Светлая</option>
          <option>Темная</option>
          <option>Авто</option>
        </select>
      </div>
    </div>
  `;
  
  showModal('Настройки', content);
}

function startAnalysis() {
  window.analysisService.startAnalysis();
}

function selectAllChannels() {
  window.channelManager.selectAllChannels();
}

function deselectAllChannels() {
  window.channelManager.deselectAllChannels();
}

function loadMoreChannels() {
  window.channelManager.displayedChannels += 20;
  window.channelManager.displayChannels();
}

function testFunction() {
  showNotification('Тестовая функция работает!', 'success');
}

// Закрытие модального окна по клику на оверлей
document.addEventListener('click', (e) => {
  const overlay = document.getElementById('modal-overlay');
  const progressOverlay = document.getElementById('progress-overlay');
  
  if (e.target === overlay) {
    closeModal();
  }
  
  if (e.target === progressOverlay && !window.analysisService.isAnalyzing) {
    window.analysisService.hideProgressOverlay();
  }
});

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    if (!window.analysisService.isAnalyzing) {
      window.analysisService.hideProgressOverlay();
    }
  }
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  // Обновляем язык в статистике
  const updateLanguageDisplay = () => {
    const langElements = document.querySelectorAll('#current-lang, #current-lang-modal');
    const langMap = {
      'ru': 'RU', 'en': 'EN', 'de': 'DE', 'fr': 'FR', 
      'es': 'ES', 'zh': 'ZH', 'ar': 'AR', 'ja': 'JA', 'ko': 'KO'
    };
    
    langElements.forEach(el => {
      if (el) {
        el.textContent = langMap[window.i18n.locale] || window.i18n.locale.toUpperCase();
      }
    });
  };
  
  // Следим за сменой языка
  window.i18n.updatePageTexts = function() {
    // Вызываем оригинальную функцию
    const originalUpdate = window.i18n.__proto__.updatePageTexts;
    if (originalUpdate) {
      originalUpdate.call(this);
    }
    
    // Обновляем отображение языка
    updateLanguageDisplay();
    
    // Обновляем счетчик выбранных каналов
    if (window.channelManager) {
      window.channelManager.updateSelectedCount();
    }
  };
  
  // Первоначальное обновление
  updateLanguageDisplay();
});
