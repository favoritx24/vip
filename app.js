// Telegram WebApp объект
const tg = window.Telegram.WebApp;

// Получаем параметры из URL
const urlParams = new URLSearchParams(window.location.search);
const userLang = urlParams.get('lang') || 'en';
const userId = urlParams.get('user_id') || '0';

// SVG иконки (профессиональные)
const ICONS = {
    clean: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
    stats: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
    settings: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
    invite: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>`,
    share: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`,
    channel: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    delete: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
    loading: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`,
    star: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
    crown: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4M4 8l8 4 8-4M4 12v8h16v-8"></path><path d="M20 12l-8 4-8-4"></path></svg>`,
    lock: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
    unlock: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>`,
    trophy: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>`,
    gift: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>`,
    globe: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
    users: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`
};

// ПОЛНАЯ ЛОКАЛИЗАЦИЯ
const LOCALE = {
    'ru': {
        'title': 'TG Auditor Pro',
        'subtitle': 'Профессиональная очистка Telegram',
        'step1Title': 'Выбор каналов',
        'step1Desc': 'Выберите Telegram каналы и группы для анализа. Можно выбрать несколько сразу.',
        'step2Title': 'Результаты анализа',
        'step3Title': 'Рекомендуемые каналы',
        'step3Desc': 'Качественные каналы, рекомендованные для вас',
        'step4Title': 'Ваша статистика',
        'selectBtnText': 'ВЫБРАТЬ КАНАЛЫ',
        'selectingText': 'Выбор каналов...',
        'selectedText': 'Выбрано:',
        'channelsText': 'каналов',
        'selectTitle': 'Выберите каналы',
        'manualSelectTitle': 'Выбор каналов',
        'manualSelectText': 'В Telegram Desktop или мобильном приложении откроется окно выбора. Нажмите "Выбрать все" вверху, затем "OK".',
        'continueBtn': 'Продолжить',
        'loadingText': 'ИИ анализирует ваши каналы...',
        'loadingSubtext': ['✓ Проверяем активность', '✓ Ищем спам', '✓ Анализируем контент'],
        'cleanText': 'Чистота:',
        'cleanupBtnText': 'ОЧИСТИТЬ ВЫБРАННОЕ',
        'cleaningText': 'Идет очистка...',
        'successTitle': 'Очистка завершена!',
        'successMessage': 'Ваш Telegram теперь чище и организованнее',
        'shareResultsBtn': 'ПОДЕЛИТЬСЯ РЕЗУЛЬТАТАМИ',
        'totalLabel': 'Всего',
        'deadLabel': 'Мёртвых',
        'spamLabel': 'Спама',
        'toxicLabel': 'Токсичных',
        'cleanLabel': 'На очистку',
        'statsDefaultText': 'Выберите и проанализируйте каналы для статистики',
        'footerText': 'TG Auditor Pro © 2024 | Профессиональная очистка Telegram',
        'poweredBy': 'На основе AI технологий',
        'channel': 'Канал',
        'status': 'Статус',
        'score': 'Оценка',
        'dead': 'Мёртвый',
        'spam': 'Спам',
        'good': 'Хороший',
        'inactive': 'Неактивный',
        'toxic': 'Токсичный',
        'duplicate': 'Дубликат',
        'mandatoryTitle': 'ТРЕБОВАНИЯ ДОСТУПА',
        'mandatoryText': 'Для полного доступа к функциям необходимо выполнить требования:',
        'showMandatoryBtn': 'ПОКАЗАТЬ ТРЕБОВАНИЯ',
        'inviteRequired': 'Пригласить друзей:',
        'subscribeRequired': 'Подписаться на каналы:',
        'accessGranted': '✅ Полный доступ',
        'accessRestricted': '🔒 Ограниченный доступ',
        'inviteFriendsBtn': '👥 ПРИГЛАСИТЬ ДРУЗЕЙ',
        'shareBotBtn': '📢 ПОДЕЛИТЬСЯ БОТОМ',
        'myReferralsBtn': '🏆 МОИ РЕФЕРАЛЫ',
        'analyzeBtn': '🔍 АНАЛИЗИРОВАТЬ',
        'cleanupConfirmTitle': 'Подтверждение очистки',
        'cleanupConfirmText': 'Удалить выбранные каналы?',
        'yesDelete': 'Да, удалить!',
        'cancel': 'Отмена',
        'cleanupComplete': '✅ Очистка завершена!'
    },
    'en': {
        'title': 'TG Auditor Pro',
        'subtitle': 'Professional Telegram Cleaner',
        'step1Title': 'Select Channels',
        'step1Desc': 'Choose Telegram channels and groups to analyze. Multiple selection available.',
        'step2Title': 'Analysis Results',
        'step3Title': 'Recommended Channels',
        'step3Desc': 'Quality channels recommended for you',
        'step4Title': 'Your Statistics',
        'selectBtnText': 'SELECT CHANNELS',
        'selectingText': 'Selecting channels...',
        'selectedText': 'Selected:',
        'channelsText': 'channels',
        'selectTitle': 'Select Channels',
        'manualSelectTitle': 'Channel Selection',
        'manualSelectText': 'In Telegram Desktop or mobile app, selection window will open. Click "Select All" at top, then "OK".',
        'continueBtn': 'Continue',
        'loadingText': 'AI is analyzing your channels...',
        'loadingSubtext': ['✓ Checking activity', '✓ Detecting spam', '✓ Analyzing content'],
        'cleanText': 'Clean:',
        'cleanupBtnText': 'CLEAN SELECTED',
        'cleaningText': 'Cleaning in progress...',
        'successTitle': 'Cleaning Complete!',
        'successMessage': 'Your Telegram is now cleaner and organized',
        'shareResultsBtn': 'SHARE RESULTS',
        'totalLabel': 'Total',
        'deadLabel': 'Dead',
        'spamLabel': 'Spam',
        'toxicLabel': 'Toxic',
        'cleanLabel': 'To Clean',
        'statsDefaultText': 'Select and analyze channels to see statistics',
        'footerText': 'TG Auditor Pro © 2024 | Professional Telegram Cleaner',
        'poweredBy': 'Powered by AI technology',
        'channel': 'Channel',
        'status': 'Status',
        'score': 'Score',
        'dead': 'Dead',
        'spam': 'Spam',
        'good': 'Good',
        'inactive': 'Inactive',
        'toxic': 'Toxic',
        'duplicate': 'Duplicate',
        'mandatoryTitle': 'ACCESS REQUIREMENTS',
        'mandatoryText': 'To access all features, you need to complete requirements:',
        'showMandatoryBtn': 'SHOW REQUIREMENTS',
        'inviteRequired': 'Invite friends:',
        'subscribeRequired': 'Subscribe to channels:',
        'accessGranted': '✅ Full Access',
        'accessRestricted': '🔒 Restricted Access',
        'inviteFriendsBtn': '👥 INVITE FRIENDS',
        'shareBotBtn': '📢 SHARE BOT',
        'myReferralsBtn': '🏆 MY REFERRALS',
        'analyzeBtn': '🔍 ANALYZE',
        'cleanupConfirmTitle': 'Cleanup Confirmation',
        'cleanupConfirmText': 'Delete selected channels?',
        'yesDelete': 'Yes, delete!',
        'cancel': 'Cancel',
        'cleanupComplete': '✅ Cleanup completed!'
    }
};

// Глобальные переменные
let selectedChannels = [];
let analysisResults = [];
let userStats = {
    total: 0,
    dead: 0,
    spam: 0,
    toxic: 0,
    inactive: 0,
    toClean: 0,
    cleanPercent: 0
};
let userAccess = {
    hasAccess: true,
    requirements: [],
    invitesNeeded: 0,
    currentInvites: 0
};

// Инициализация WebApp
function initWebApp() {
    if (!window.Telegram || !window.Telegram.WebApp) {
        showError('Please open in Telegram app');
        return;
    }
    
    try {
        tg.expand();
        tg.enableClosingConfirmation();
        tg.setHeaderColor('#6366f1');
        tg.setBackgroundColor('#0f172a');
        tg.MainButton.hide();
        
        // Применяем локализацию
        applyLocalization();
        
        // Загружаем рекомендации
        loadRecommendedChannels();
        
        // Проверяем доступ пользователя
        checkUserAccess();
        
        // Показываем интерфейс
        showMainInterface();
        
        console.log('TG Auditor Pro initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Initialization failed. Please restart.');
    }
}

// Применяем локализацию
function applyLocalization() {
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    // Обновляем все текстовые элементы
    document.querySelectorAll('[data-locale]').forEach(el => {
        const key = el.getAttribute('data-locale');
        if (locale[key]) {
            el.innerHTML = locale[key];
        }
    });
    
    // Обновляем заголовки
    document.getElementById('title').textContent = locale.title;
    document.getElementById('subtitle').textContent = locale.subtitle;
    
    // Обновляем кнопки с иконками
    document.getElementById('selectBtnText').innerHTML = `${ICONS.channel} ${locale.selectBtnText}`;
    document.getElementById('analyzeBtnText').innerHTML = `${ICONS.loading} ${locale.analyzeBtn}`;
    document.getElementById('cleanupBtnText').innerHTML = `${ICONS.delete} ${locale.cleanupBtnText}`;
    document.getElementById('inviteFriendsBtn').innerHTML = `${ICONS.invite} ${locale.inviteFriendsBtn}`;
    document.getElementById('shareBotBtn').innerHTML = `${ICONS.share} ${locale.shareBotBtn}`;
    document.getElementById('myReferralsBtn').innerHTML = `${ICONS.trophy} ${locale.myReferralsBtn}`;
    
    return locale;
}

// Показать основной интерфейс
function showMainInterface() {
    // Показываем все основные секции
    document.getElementById('step1').style.display = 'block';
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'block';
    document.getElementById('step4').style.display = 'block';
    document.getElementById('successCard').style.display = 'none';
    
    // Настраиваем кнопки
    setupEventListeners();
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Кнопка выбора каналов
    document.getElementById('selectChannelsBtn').onclick = requestChannels;
    
    // Кнопка анализа
    document.getElementById('analyzeBtn').onclick = startAnalysis;
    
    // Кнопка очистки
    document.getElementById('cleanupBtn').onclick = startCleanup;
    
    // Социальные кнопки
    document.getElementById('inviteFriendsBtn').onclick = showInviteFriends;
    document.getElementById('shareBotBtn').onclick = showShareBot;
    document.getElementById('myReferralsBtn').onclick = showMyReferrals;
    
    // Кнопка требований
    document.getElementById('showRequirementsBtn').onclick = showRequirements;
}

// ==== ОСНОВНЫЕ ФУНКЦИИ ====

// 1. ВЫБОР КАНАЛОВ
function requestChannels() {
    const btn = document.getElementById('selectChannelsBtn');
    const btnText = document.getElementById('selectBtnText');
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    btn.disabled = true;
    btn.classList.add('loading');
    btnText.innerHTML = `${ICONS.loading} ${locale.selectingText}`;
    
    // Проверяем доступ к Telegram API
    if (tg.platform !== 'unknown' && typeof tg.requestChat === 'function') {
        // Используем Telegram WebApp API для выбора чатов
        tg.requestChat({
            chat_types: ['channel', 'group'],
            allow_multiselect: true,
            title: locale.selectTitle,
            optional: false
        }, (chats) => {
            if (chats && chats.length > 0) {
                handleSelectedChats(chats);
            } else {
                showSelectionManual();
            }
        });
    } else {
        // Показываем инструкцию для ручного выбора
        showSelectionManual();
    }
}

function showSelectionManual() {
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    tg.showPopup({
        title: locale.manualSelectTitle,
        message: locale.manualSelectText,
        buttons: [
            { id: 'simulate', type: 'default', text: locale.continueBtn },
            { type: 'cancel' }
        ]
    }, (btnId) => {
        if (btnId === 'simulate') {
            simulateChannelSelection();
        } else {
            resetSelectionButton();
        }
    });
}

function simulateChannelSelection() {
    // Тестовые данные для демонстрации
    const mockChannels = [
        { 
            id: -1001234567890, 
            title: "Tech News Daily", 
            type: "channel", 
            username: "tech_news",
            members: 125000,
            last_post: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            description: "Latest technology news and updates"
        },
        { 
            id: -1001234567891, 
            title: "Crypto Signals Pro", 
            type: "channel", 
            username: "crypto_signals",
            members: 85000,
            last_post: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            description: "Cryptocurrency trading signals"
        },
        { 
            id: -1001234567892, 
            title: "Programming Hub", 
            type: "channel", 
            username: "programming",
            members: 220000,
            last_post: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            description: "Programming tutorials and tips"
        },
        { 
            id: -1001234567893, 
            title: "Old Archive Channel", 
            type: "channel", 
            username: "old_archive",
            members: 5000,
            last_post: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
            description: "Inactive channel"
        },
        { 
            id: -1001234567894, 
            title: "SPAM Promotions", 
            type: "channel", 
            username: "spam_promo",
            members: 15000,
            last_post: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            description: "Buy now! Limited offer!"
        }
    ];
    
    handleSelectedChats(mockChannels);
}

function handleSelectedChats(chats) {
    const btn = document.getElementById('selectChannelsBtn');
    const btnText = document.getElementById('selectBtnText');
    const counter = document.getElementById('selectionCounter');
    const countElem = document.getElementById('channelCount');
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    // Сбрасываем состояние кнопки
    btn.disabled = false;
    btn.classList.remove('loading');
    
    if (!chats || chats.length === 0) {
        btnText.innerHTML = `${ICONS.channel} ${locale.selectBtnText}`;
        tg.showAlert('No channels selected');
        return;
    }
    
    // Сохраняем выбранные каналы
    selectedChannels = chats.map(chat => ({
        id: chat.id,
        title: chat.title,
        username: chat.username || '',
        type: chat.type,
        members: chat.members || Math.floor(Math.random() * 100000) + 1000,
        last_post: chat.last_post || new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        description: chat.description || getRandomDescription(chat.title)
    }));
    
    // Показываем счетчик
    countElem.textContent = selectedChannels.length;
    counter.style.display = 'flex';
    btnText.innerHTML = `${ICONS.check} ${selectedChannels.length} ${locale.channelsText}`;
    
    // Активируем кнопку анализа
    document.getElementById('analyzeBtn').style.display = 'block';
    
    console.log('Selected channels:', selectedChannels.length);
}

function resetSelectionButton() {
    const btn = document.getElementById('selectChannelsBtn');
    const btnText = document.getElementById('selectBtnText');
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    btn.disabled = false;
    btn.classList.remove('loading');
    btnText.innerHTML = `${ICONS.channel} ${locale.selectBtnText}`;
}

// 2. АНАЛИЗ КАНАЛОВ
function startAnalysis() {
    if (selectedChannels.length === 0) {
        tg.showAlert('Please select channels first');
        return;
    }
    
    // Проверяем доступ
    if (!userAccess.hasAccess) {
        showAccessRequirements();
        return;
    }
    
    // Показываем шаг 2
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
    document.getElementById('loadingAnalysis').style.display = 'flex';
    document.getElementById('resultsSection').style.display = 'none';
    
    // Запускаем анализ
    setTimeout(() => {
        performAnalysis();
    }, 2000);
}

function performAnalysis() {
    // Анализируем каждый канал
    analysisResults = selectedChannels.map(channel => {
        const analysis = analyzeChannel(channel);
        return {
            ...channel,
            ...analysis
        };
    });
    
    // Показываем результаты
    showAnalysisResults();
    
    // Обновляем статистику
    updateStatistics();
    
    // Скрываем загрузку
    document.getElementById('loadingAnalysis').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
}

function analyzeChannel(channel) {
    let status = "good";
    let score = 8;
    let reason = "Active quality channel";
    
    // 1. Проверка активности
    const lastPostDate = new Date(channel.last_post);
    const daysSinceLastPost = Math.floor((Date.now() - lastPostDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastPost > 180) {
        status = "dead";
        score = 1;
        reason = `Inactive for ${daysSinceLastPost} days`;
    }
    // 2. Детектор спама
    else if (isSpamChannel(channel)) {
        status = "spam";
        score = 2;
        reason = "Spam/promotional content detected";
    }
    // 3. Детектор токсичности
    else if (isToxicChannel(channel)) {
        status = "toxic";
        score = 4;
        reason = "Toxic/hype content detected";
    }
    // 4. Маленькая аудитория
    else if (channel.members < 1000) {
        status = "inactive";
        score = 5;
        reason = `Small audience (${channel.members.toLocaleString()} members)`;
    }
    // 5. Дубликаты (упрощенно)
    else if (hasDuplicateKeywords(channel)) {
        status = "duplicate";
        score = 6;
        reason = "Similar to other channels";
    }
    
    return {
        status: status,
        score: score,
        reason: reason,
        daysSinceLastPost: daysSinceLastPost,
        priority: status === "good" ? "low" : "high"
    };
}

function isSpamChannel(channel) {
    const spamKeywords = ['buy', 'sale', 'discount', 'promo', 'offer', 'limited', 'urgent', 'click', 'link', 'http://', 'www.'];
    const text = (channel.title + ' ' + channel.description).toLowerCase();
    return spamKeywords.some(keyword => text.includes(keyword));
}

function isToxicChannel(channel) {
    const toxicPatterns = ['🚀', '💰', '🔥', '💎', '🤑', '100x', 'get rich', 'quick money', 'guaranteed'];
    const text = channel.title + ' ' + channel.description;
    return toxicPatterns.some(pattern => text.includes(pattern));
}

function hasDuplicateKeywords(channel) {
    // Упрощенная проверка дубликатов
    const keywords = channel.title.toLowerCase().split(' ');
    return keywords.some(word => 
        analysisResults.some(result => 
            result.title.toLowerCase().includes(word) && 
            result.id !== channel.id
        )
    );
}

// 3. ПОКАЗ РЕЗУЛЬТАТОВ
function showAnalysisResults() {
    const resultsList = document.getElementById('resultsList');
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    // Очищаем список
    resultsList.innerHTML = '';
    
    // Считаем статистику
    userStats = {
        total: analysisResults.length,
        dead: analysisResults.filter(c => c.status === 'dead').length,
        spam: analysisResults.filter(c => c.status === 'spam').length,
        toxic: analysisResults.filter(c => c.status === 'toxic').length,
        inactive: analysisResults.filter(c => c.status === 'inactive').length,
        duplicate: analysisResults.filter(c => c.status === 'duplicate').length,
        toClean: 0,
        cleanPercent: 0
    };
    
    userStats.toClean = userStats.dead + userStats.spam + userStats.toxic;
    userStats.cleanPercent = Math.round(((userStats.total - userStats.toClean) / userStats.total) * 100);
    
    // Обновляем прогресс-бар
    document.getElementById('progressFill').style.width = `${userStats.cleanPercent}%`;
    document.getElementById('cleanPercent').textContent = `${userStats.cleanPercent}%`;
    
    // Показываем каналы
    analysisResults.forEach((channel, index) => {
        const item = createChannelResultItem(channel, locale);
        resultsList.appendChild(item);
    });
    
    // Показываем кнопку очистки если есть что удалять
    if (userStats.toClean > 0) {
        document.getElementById('cleanupBtn').style.display = 'block';
        document.getElementById('cleanupBtnText').innerHTML = `${ICONS.delete} ${locale.cleanupBtnText} (${userStats.toClean})`;
    }
}

function createChannelResultItem(channel, locale) {
    const item = document.createElement('div');
    item.className = 'result-item';
    
    // Определяем стили для статуса
    let statusClass = 'badge-good';
    let statusText = locale.good;
    
    switch(channel.status) {
        case 'dead':
            statusClass = 'badge-dead';
            statusText = locale.dead;
            break;
        case 'spam':
            statusClass = 'badge-spam';
            statusText = locale.spam;
            break;
        case 'toxic':
            statusClass = 'badge-toxic';
            statusText = locale.toxic;
            break;
        case 'inactive':
            statusClass = 'badge-inactive';
            statusText = locale.inactive;
            break;
        case 'duplicate':
            statusClass = 'badge-duplicate';
            statusText = locale.duplicate;
            break;
    }
    
    item.innerHTML = `
        <div class="channel-info">
            <div class="channel-title">${channel.title}</div>
            <div class="channel-desc">${channel.description}</div>
            <div class="channel-meta">
                <span>${ICONS.users} ${channel.members.toLocaleString()}</span>
                <span>📅 ${channel.daysSinceLastPost}д</span>
            </div>
        </div>
        <div class="channel-status">
            <div class="badge ${statusClass}">
                ${statusText}
            </div>
            <div class="channel-reason">${channel.reason}</div>
        </div>
        <div class="channel-score">
            <div class="score-circle" style="background: ${getScoreColor(channel.score)}; border-color: ${getScoreColor(channel.score)}">
                ${channel.score}/10
            </div>
        </div>
    `;
    
    return item;
}

function getScoreColor(score) {
    if (score >= 8) return 'rgba(16, 185, 129, 0.2)';
    if (score >= 5) return 'rgba(245, 158, 11, 0.2)';
    return 'rgba(239, 68, 68, 0.2)';
}

// 4. ОЧИСТКА КАНАЛОВ
function startCleanup() {
    const channelsToDelete = analysisResults.filter(c => 
        c.status === 'dead' || c.status === 'spam' || c.status === 'toxic'
    ).length;
    
    if (channelsToDelete === 0) {
        tg.showAlert('No channels to clean');
        return;
    }
    
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    tg.showPopup({
        title: locale.cleanupConfirmTitle,
        message: `${locale.cleanupConfirmText}\n\n🗑️ ${channelsToDelete} ${locale.channel.toLowerCase()}`,
        buttons: [
            { 
                id: 'yes', 
                type: 'destructive', 
                text: locale.yesDelete 
            },
            { 
                type: 'cancel',
                text: locale.cancel
            }
        ]
    }, (btnId) => {
        if (btnId === 'yes') {
            performCleanup(channelsToDelete);
        }
    });
}

function performCleanup(count) {
    const cleanupBtn = document.getElementById('cleanupBtn');
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    cleanupBtn.disabled = true;
    cleanupBtn.classList.add('loading');
    cleanupBtn.innerHTML = `${ICONS.loading} ${locale.cleaningText}`;
    
    // Анимация прогресса
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('cleanPercent').textContent = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            showSuccessAnimation(count);
            
            // Отправляем результаты на сервер
            sendResultsToServer(count);
        }
    }, 150);
}

function showSuccessAnimation(count) {
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    // Скрываем результаты
    document.getElementById('step2').style.display = 'none';
    
    // Показываем успех
    document.getElementById('successCard').style.display = 'block';
    document.getElementById('successTitle').textContent = locale.successTitle;
    document.getElementById('successMessage').innerHTML = `
        ${locale.cleanupComplete}<br>
        <strong>${count}</strong> ${locale.channel.toLowerCase()} ${locale.cleanedText || 'cleaned'}
    `;
    
    // Вибрация если доступна
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
}

function sendResultsToServer(count) {
    const data = {
        action: 'analysis_complete',
        user_id: userId,
        analyzed: userStats.total,
        deleted: count,
        channels: analysisResults.map(c => ({
            id: c.id,
            title: c.title,
            status: c.status,
            score: c.score
        }))
    };
    
    // Отправляем данные боту через WebApp
    if (tg.sendData) {
        tg.sendData(JSON.stringify(data));
    }
    
    console.log('Results sent to server:', data);
}

// 5. РЕКОМЕНДАЦИИ
function loadRecommendedChannels() {
    const container = document.getElementById('recommendedChannels');
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    // Тестовые данные
    const channels = [
        { 
            title: "Telegram Official", 
            url: "https://t.me/telegram", 
            desc: "Official Telegram news and updates",
            lang: "all",
            members: "12M",
            category: "Official"
        },
        { 
            title: userLang === 'ru' ? "Новости Технологий" : "Tech Insider", 
            url: "https://t.me/technology", 
            desc: userLang === 'ru' ? "Свежие IT новости и обзоры" : "Latest tech news and insights",
            lang: userLang,
            members: "150K",
            category: userLang === 'ru' ? "Технологии" : "Technology"
        },
        { 
            title: "AI & ML Daily", 
            url: "https://t.me/ai_ml", 
            desc: "Artificial Intelligence and Machine Learning updates",
            lang: "en",
            members: "85K",
            category: "AI"
        },
        { 
            title: userLang === 'ru' ? "Дизайн и Креатив" : "Design & Creativity", 
            url: "https://t.me/design", 
            desc: userLang === 'ru' ? "Вдохновение для дизайнеров" : "Creative inspiration for designers",
            lang: userLang === 'ru' ? 'ru' : 'en',
            members: "65K",
            category: userLang === 'ru' ? "Дизайн" : "Design"
        }
    ];
    
    // Фильтруем по языку
    const filtered = channels.filter(c => c.lang === 'all' || c.lang === userLang);
    
    if (filtered.length === 0) {
        container.innerHTML = `<p class="no-data">No recommendations available</p>`;
        return;
    }
    
    let html = '';
    filtered.forEach(channel => {
        html += `
            <div class="recommended-item">
                <div class="recommended-info">
                    <div class="recommended-title">${channel.title}</div>
                    <div class="recommended-desc">${channel.desc}</div>
                    <div class="recommended-meta">
                        <span>${ICONS.users} ${channel.members}</span>
                        <span>🏷️ ${channel.category}</span>
                    </div>
                </div>
                <a href="${channel.url}" target="_blank" class="recommended-btn">
                    ${ICONS.star} ${locale.join || 'Join'}
                </a>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// 6. ДОСТУП И ТРЕБОВАНИЯ
function checkUserAccess() {
    // Имитация проверки доступа
    // В реальном приложении здесь будет запрос к серверу
    userAccess = {
        hasAccess: Math.random() > 0.3, // 70% шанс что есть доступ
        requirements: [
            { type: 'invite', count: 3, current: 1 },
            { type: 'subscribe', channels: ['@telegram', '@durov'] }
        ],
        invitesNeeded: 2,
        currentInvites: 1
    };
    
    updateAccessUI();
}

function updateAccessUI() {
    const accessNotice = document.getElementById('accessNotice');
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    if (userAccess.hasAccess) {
        accessNotice.style.display = 'none';
        document.getElementById('accessStatus').innerHTML = `
            <div class="access-granted">
                ${ICONS.check} ${locale.accessGranted}
            </div>
        `;
    } else {
        accessNotice.style.display = 'block';
        document.getElementById('accessStatus').innerHTML = `
            <div class="access-restricted">
                ${ICONS.lock} ${locale.accessRestricted}
                <div class="access-progress">
                    ${locale.inviteRequired} ${userAccess.currentInvites}/${userAccess.invitesNeeded}
                </div>
            </div>
        `;
    }
}

function showAccessRequirements() {
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    let requirementsText = `<b>${locale.mandatoryTitle}</b>\n\n`;
    requirementsText += `${locale.mandatoryText}\n\n`;
    
    userAccess.requirements.forEach(req => {
        if (req.type === 'invite') {
            requirementsText += `• ${locale.inviteRequired} ${req.current}/${req.count} friends\n`;
        } else if (req.type === 'subscribe') {
            requirementsText += `• ${locale.subscribeRequired}\n`;
            req.channels.forEach(channel => {
                requirementsText += `  - ${channel}\n`;
            });
        }
    });
    
    tg.showPopup({
        title: locale.mandatoryTitle,
        message: requirementsText,
        buttons: [
            { id: 'invite', type: 'default', text: locale.inviteFriendsBtn },
            { type: 'cancel' }
        ]
    }, (btnId) => {
        if (btnId === 'invite') {
            showInviteFriends();
        }
    });
}

function showRequirements() {
    showAccessRequirements();
}

// 7. СОЦИАЛЬНЫЕ ФУНКЦИИ
function showInviteFriends() {
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    const inviteText = locale.inviteText || `Invite friends and get premium features!`;
    
    tg.showPopup({
        title: `${ICONS.gift} Invite Friends`,
        message: `${inviteText}\n\nYour referral code: ${userId}\n\nInvites needed: ${userAccess.invitesNeeded - userAccess.currentInvites}`,
        buttons: [
            { id: 'share', type: 'default', text: '📱 Share Link' },
            { id: 'copy', type: 'default', text: '📋 Copy Link' },
            { type: 'cancel' }
        ]
    }, (btnId) => {
        if (btnId === 'share') {
            shareReferralLink();
        } else if (btnId === 'copy') {
            copyReferralLink();
        }
    });
}

function shareReferralLink() {
    const link = `https://t.me/TG_Auditor_Pro_bot?start=${userId}`;
    const text = userLang === 'ru' 
        ? `Привет! Я использую супер-бот для очистки Telegram! 🧹\n\nОн анализирует каналы, находит мусор и помогает навести порядок.\n\nПопробуй по моей ссылке: ${link}`
        : `Hi! I'm using a super bot to clean Telegram! 🧹\n\nIt analyzes channels, finds junk and helps organize everything.\n\nTry it via my link: ${link}`;
    
    tg.openLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`);
}

function copyReferralLink() {
    const link = `https://t.me/TG_Auditor_Pro_bot?start=${userId}`;
    navigator.clipboard.writeText(link).then(() => {
        tg.showAlert('Link copied to clipboard!');
    }).catch(() => {
        tg.showAlert('Failed to copy link');
    });
}

function showShareBot() {
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    const shareText = locale.shareText || `Share this amazing bot with friends!`;
    
    tg.showPopup({
        title: `${ICONS.share} Share Bot`,
        message: `${shareText}\n\nRecommend TG Auditor Pro to your friends!`,
        buttons: [
            { id: 'telegram', type: 'default', text: '📱 Telegram' },
            { id: 'other', type: 'default', text: '🔗 Other Apps' },
            { type: 'cancel' }
        ]
    }, (btnId) => {
        if (btnId === 'telegram') {
            shareToTelegram();
        } else if (btnId === 'other') {
            shareToOtherApps();
        }
    });
}

function shareToTelegram() {
    const text = userLang === 'ru'
        ? `✨ Рекомендую TG Auditor Pro - профессиональный инструмент для очистки Telegram!\n\n🧹 Что умеет:\n• Анализ активности каналов\n• Детектор спама и мусора\n• Умные рекомендации\n• Статистика использования\n\n🔗 https://t.me/TG_Auditor_Pro_bot`
        : `✨ I recommend TG Auditor Pro - professional Telegram cleaner!\n\n🧹 Features:\n• Channel activity analysis\n• Spam and junk detector\n• Smart recommendations\n• Usage statistics\n\n🔗 https://t.me/TG_Auditor_Pro_bot`;
    
    tg.openLink(`https://t.me/share/url?url=https://t.me/TG_Auditor_Pro_bot&text=${encodeURIComponent(text)}`);
}

function shareToOtherApps() {
    const text = userLang === 'ru'
        ? "TG Auditor Pro - профессиональный инструмент для очистки Telegram! 🧹"
        : "TG Auditor Pro - professional Telegram cleaner! 🧹";
    
    if (navigator.share) {
        navigator.share({
            title: 'TG Auditor Pro',
            text: text,
            url: 'https://t.me/TG_Auditor_Pro_bot'
        });
    } else {
        tg.showAlert('Sharing not supported in this browser');
    }
}

function showMyReferrals() {
    // Имитация данных рефералов
    const referrals = [
        { username: 'user1', date: '2024-01-15', status: 'active' },
        { username: 'user2', date: '2024-01-20', status: 'pending' },
        { username: 'user3', date: '2024-01-25', status: 'active' }
    ];
    
    let message = `🏆 My Referrals\n\nTotal: ${referrals.length}\nActive: ${referrals.filter(r => r.status === 'active').length}\n\n`;
    
    referrals.forEach((ref, i) => {
        message += `${i+1}. @${ref.username}\n   📅 ${ref.date} | ${ref.status === 'active' ? '✅' : '⏳'}\n\n`;
    });
    
    tg.showPopup({
        title: `${ICONS.trophy} My Referrals`,
        message: message,
        buttons: [
            { type: 'default', text: 'OK' }
        ]
    });
}

// 8. СТАТИСТИКА
function updateStatistics() {
    document.getElementById('totalChannels').textContent = userStats.total;
    document.getElementById('deadChannels').textContent = userStats.dead;
    document.getElementById('spamChannels').textContent = userStats.spam;
    document.getElementById('toxicChannels').textContent = userStats.toxic;
    document.getElementById('toClean').textContent = userStats.toClean;
    
    // Прячем дефолтное сообщение если есть статистика
    if (userStats.total > 0) {
        document.getElementById('statsDefault').style.display = 'none';
        document.getElementById('statsGrid').style.display = 'grid';
    }
}

// 9. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
function getRandomDescription(title) {
    const descriptions = [
        "News and updates channel",
        "Daily content and discussions",
        "Community announcements",
        "Information and education",
        "Entertainment and fun",
        "Professional network"
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function showError(message) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <div class="error-container">
            <div class="error-icon">⚠️</div>
            <h2>Error</h2>
            <p>${message}</p>
            <button class="btn btn-primary" onclick="location.reload()">
                Reload Page
            </button>
        </div>
    `;
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', initWebApp);
