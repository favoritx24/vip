// ============================================
// ФАЙЛ: js/i18n.js
// Система перевода текстов
// ============================================

class I18n {
  constructor() {
    this.locale = 'ru'; // язык по умолчанию
    this.translations = {};
  }

  // Загружаем переводы
  async loadTranslations(lang = null) {
    if (lang) {
      this.locale = lang;
    } else {
      // Проверяем сохраненный язык
      const savedLang = localStorage.getItem('tg_auditor_lang');
      if (savedLang) {
        this.locale = savedLang;
      }
    }
    
    try {
      const response = await fetch(`/locales/${this.locale}.json`);
      this.translations = await response.json();
      console.log(`Language loaded: ${this.locale}`);
    } catch (error) {
      console.error('Failed to load translations:', error);
      // Пробуем загрузить русский как запасной
      try {
        const fallback = await fetch('/locales/ru.json');
        this.translations = await fallback.json();
      } catch (e) {
        console.error('Even fallback failed:', e);
        this.translations = {};
      }
    }
  }

  // Получить перевод по ключу
  t(key, params = {}) {
    const keys = key.split('.');
    let value = this.translations;
    
    // Ищем вложенные ключи (например: "icons.globe")
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return `[${key}]`; // Показываем ключ, если перевод не найден
      }
    }
    
    // Заменяем {count} на реальное значение
    if (typeof value === 'string') {
      return value.replace(/{(\w+)}/g, (match, param) => {
        return params[param] !== undefined ? params[param] : match;
      });
    }
    
    return value;
  }

  // Получить иконку
  getIcon(iconKey) {
    return this.t(`icons.${iconKey}`) || iconKey;
  }

  // Сменить язык
  async changeLanguage(lang) {
    localStorage.setItem('tg_auditor_lang', lang);
    await this.loadTranslations(lang);
    this.updatePageTexts();
  }

  // Обновить все тексты на странице
  updatePageTexts() {
    // Тексты с data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      element.textContent = this.t(key);
    });
    
    // Placeholder'ы
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = this.t(key);
    });
    
    // Тексты в кнопках с data-i18n-icon
    document.querySelectorAll('[data-i18n-icon]').forEach(element => {
      const key = element.getAttribute('data-i18n-icon');
      element.innerHTML = this.getIcon(key) + ' ' + element.textContent;
    });
  }
}

// Создаем глобальный объект переводов
window.i18n = new I18n();

// Загружаем переводы при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
  await window.i18n.loadTranslations();
  window.i18n.updatePageTexts();
  
  // Инициализируем селектор языка
  initLanguageSelector();
});

// Функция для создания селектора языка
function initLanguageSelector() {
  const languages = [
    { code: 'ru', name: 'Русский' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'zh', name: '中文' },
    { code: 'ar', name: 'العربية' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' }
  ];
  
  // Находим контейнер для языка (там где был $ICONS.globe)
  const langContainer = document.querySelector('.language-selector-container');
  if (!langContainer) return;
  
  const select = document.createElement('select');
  select.className = 'language-select';
  select.id = 'language-select';
  
  languages.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang.code;
    option.textContent = lang.name;
    if (window.i18n.locale === lang.code) {
      option.selected = true;
    }
    select.appendChild(option);
  });
  
  select.onchange = function(e) {
    window.i18n.changeLanguage(e.target.value);
  };
  
  langContainer.innerHTML = '';
  langContainer.appendChild(select);
}
