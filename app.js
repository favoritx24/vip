// Telegram WebApp объект
const tg = window.Telegram.WebApp;

// Получаем параметры из URL
const urlParams = new URLSearchParams(window.location.search);
const userLang = urlParams.get('lang') || 'en';
const userId = urlParams.get('user_id') || '0';

// ПОЛНАЯ ЛОКАЛИЗАЦИЯ
const LOCALE = {
    'ru': {
        'title': 'TG Auditor Pro',
        'subtitle': 'Очистите Telegram в 1 клик',
        'step1Title': 'Выбор каналов',
        'step1Desc': 'Выберите Telegram каналы и группы для анализа. Можно выбрать несколько сразу.',
        'step2Title': 'Результаты анализа',
        'step3Title': 'Рекомендуемые каналы',
        'step3Desc': 'Качественные каналы, рекомендованные для вас',
        'step4Title': 'Ваша статистика',
        'selectBtnText': '✅ ВЫБРАТЬ ВСЕ КАНАЛЫ',
        'selectingText': 'Выбор каналов...',
        'selectedText': 'Выбрано:',
        'channelsText': 'каналов',
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
        'cleanLabel': 'На очистку',
        'statsDefaultText': 'Выберите и проанализируйте каналы для статистики',
        'footerText': 'TG Auditor Pro © 2024 | Очистка Telegram в 1 клик',
        'poweredBy': 'На основе AI технологий',
        'channel': 'Канал',
        'status': 'Статус',
        'score': 'Оценка',
        'dead': 'Мёртвый',
        'spam': 'Спам',
        'good': 'Хороший',
        'inactive': 'Неактивный',
        'toxic': 'Токсичный',
        'mandatoryTitle': '⚠️ ВНИМАНИЕ',
        'mandatoryText': 'Для использования сервиса нужно подписаться на обязательные каналы',
        'showMandatoryBtn': 'ПОКАЗАТЬ КАНАЛЫ'
    },
    'en': {
        'title': 'TG Auditor Pro',
        'subtitle': 'Clean your Telegram in 1 click',
        'step1Title': 'Select Channels',
        'step1Desc': 'Choose which Telegram channels and groups to analyze. You can select multiple at once.',
        'step2Title': 'Analysis Results',
        'step3Title': 'Recommended Channels',
        'step3Desc': 'Quality channels recommended for you',
        'step4Title': 'Your Statistics',
        'selectBtnText': '✅ SELECT ALL CHANNELS',
        'selectingText': 'Selecting channels...',
        'selectedText': 'Selected:',
        'channelsText': 'channels',
        'loadingText': 'AI is analyzing your channels...',
        'loadingSubtext': ['✓ Checking activity', '✓ Detecting spam', '✓ Analyzing content'],
        'cleanText': 'Clean:',
        'cleanupBtnText': 'CLEAN SELECTED',
        'cleaningText': 'Cleaning in progress...',
        'successTitle': 'Cleaning Complete!',
        'successMessage': 'Your Telegram is now cleaner and more organized',
        'shareResultsBtn': 'SHARE RESULTS',
        'totalLabel': 'Total',
        'deadLabel': 'Dead',
        'spamLabel': 'Spam',
        'cleanLabel': 'To Clean',
        'statsDefaultText': 'Select and analyze channels to see statistics',
        'footerText': 'TG Auditor Pro © 2024 | One-click Telegram cleaner',
        'poweredBy': 'Powered by AI technology',
        'channel': 'Channel',
        'status': 'Status',
        'score': 'Score',
        'dead': 'Dead',
        'spam': 'Spam',
        'good': 'Good',
        'inactive': 'Inactive',
        'toxic': 'Toxic',
        'mandatoryTitle': '⚠️ ATTENTION',
        'mandatoryText': 'To use this service, you need to subscribe to mandatory channels',
        'showMandatoryBtn': 'SHOW CHANNELS'
    },
    'de': {
        'title': 'TG Auditor Pro',
        'subtitle': 'Telegram mit 1 Klick reinigen',
        'step1Title': 'Kanäle auswählen',
        'step1Desc': 'Wählen Sie Telegram-Kanäle und Gruppen zur Analyse aus. Mehrere gleichzeitig möglich.',
        'selectBtnText': '✅ ALLE KANÄLE AUSWÄHLEN',
        'selectedText': 'Ausgewählt:',
        'channelsText': 'Kanäle'
    },
    'es': {
        'title': 'TG Auditor Pro',
        'subtitle': 'Limpia Telegram en 1 clic',
        'step1Title': 'Seleccionar Canales',
        'step1Desc': 'Elige canales y grupos de Telegram para analizar. Puedes seleccionar varios a la vez.',
        'selectBtnText': '✅ SELECCIONAR TODOS LOS CANALES',
        'selectedText': 'Seleccionados:',
        'channelsText': 'canales'
    },
    'fr': {
        'title': 'TG Auditor Pro',
        'subtitle': 'Nettoyez Telegram en 1 clic',
        'step1Title': 'Sélectionner les Chaînes',
        'step1Desc': 'Choisissez les chaînes et groupes Telegram à analyser. Sélection multiple possible.',
        'selectBtnText': '✅ SÉLECTIONNER TOUTES LES CHAÎNES',
        'selectedText': 'Sélectionnés:',
        'channelsText': 'chaînes'
    },
    'zh': {
        'title': 'TG 审计专家',
        'subtitle': '一键清理Telegram',
        'step1Title': '选择频道',
        'step1Desc': '选择要分析的Telegram频道和群组。可以一次选择多个。',
        'selectBtnText': '✅ 选择所有频道',
        'selectedText': '已选:',
        'channelsText': '频道'
    },
    'ar': {
        'title': 'TG المدقق المحترف',
        'subtitle': 'نظف تلغرام بنقرة واحدة',
        'step1Title': 'اختر القنوات',
        'step1Desc': 'اختر قنوات ومجموعات تلغرام للتحليل. يمكنك اختيار عدة قنوات في وقت واحد.',
        'selectBtnText': '✅ اختر جميع القنوات',
        'selectedText': 'المحدد:',
        'channelsText': 'قنوات'
    },
    'ja': {
        'title': 'TG 監査プロ',
        'subtitle': '1クリックでTelegramをクリーン',
        'step1Title': 'チャンネルを選択',
        'step1Desc': '分析するTelegramチャンネルとグループを選択します。複数同時選択可能です。',
        'selectBtnText': '✅ すべてのチャンネルを選択',
        'selectedText': '選択済み:',
        'channelsText': 'チャンネル'
    },
    'ko': {
        'title': 'TG 감사 프로',
        'subtitle': '1클릭으로 Telegram 정리',
        'step1Title': '채널 선택',
        'step1Desc': '분석할 Telegram 채널 및 그룹을 선택하세요. 여러 개를 한 번에 선택할 수 있습니다.',
        'selectBtnText': '✅ 모든 채널 선택',
        'selectedText': '선택됨:',
        'channelsText': '채널'
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

// Инициализация WebApp
function initWebApp() {
    tg.expand();
    tg.enableClosingConfirmation();
    tg.setHeaderColor('#7c3aed');
    tg.setBackgroundColor('#0f172a');
    tg.MainButton.hide();
    
    applyLocalization();
    loadRecommendedChannels();
    checkMandatoryChannels();
    
    console.log('WebApp initialized for user:', userId, 'language:', userLang);
}

// Применяем локализацию
function applyLocalization() {
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    // Заголовки
    document.getElementById('title').textContent = locale.title;
    document.getElementById('subtitle').textContent = locale.subtitle;
    document.getElementById('languageBadge').textContent = `🌍 ${userLang.toUpperCase()}`;
    
    // Шаг 1
    document.getElementById('step1Title').textContent = locale.step1Title;
    document.getElementById('step1Desc').textContent = locale.step1Desc;
    document.getElementById('selectBtnText').textContent = locale.selectBtnText;
    document.getElementById('selectedText').textContent = locale.selectedText;
    document.getElementById('channelsText').textContent = locale.channelsText;
    
    // Шаг 2
    document.getElementById('step2Title').textContent = locale.step2Title;
    document.getElementById('loadingText').textContent = locale.loadingText;
    document.getElementById('cleanText').textContent = locale.cleanText;
    document.getElementById('cleanupBtnText').textContent = locale.cleanupBtnText;
    
    // Шаг 3
    document.getElementById('step3Title').textContent = locale.step3Title;
    document.getElementById('step3Desc').textContent = locale.step3Desc;
    
    // Шаг 4
    document.getElementById('step4Title').textContent = locale.step4Title;
    document.getElementById('totalLabel').textContent = locale.totalLabel;
    document.getElementById('deadLabel').textContent = locale.deadLabel;
    document.getElementById('spamLabel').textContent = locale.spamLabel;
    document.getElementById('cleanLabel').textContent = locale.cleanLabel;
    document.getElementById('statsDefaultText').textContent = locale.statsDefaultText;
    
    // Обязательные каналы
    document.getElementById('mandatoryTitle').textContent = locale.mandatoryTitle;
    document.getElementById('mandatoryText').textContent = locale.mandatoryText;
    document.getElementById('showMandatoryBtn').textContent = locale.showMandatoryBtn;
    
    // Успех
    document.getElementById('successTitle').textContent = locale.successTitle;
    document.getElementById('successMessage').textContent = locale.successMessage;
    document.getElementById('shareResultsBtn').textContent = locale.shareResultsBtn;
    
    // Футер
    document.getElementById('footerText').textContent = locale.footerText;
    document.getElementById('poweredBy').textContent = locale.poweredBy;
    
    // Обновляем loading subtext
    const subtextItems = locale.loadingSubtext || LOCALE['en'].loadingSubtext;
    const subtextContainer = document.getElementById('loadingSubtext');
    subtextContainer.innerHTML = subtextItems.map(item => `<div>${item}</div>`).join('');
    
    return locale;
}

// ==== КЛЮЧЕВАЯ ФУНКЦИЯ: ВЫБОР ВСЕХ КАНАЛОВ ЧЕРЕЗ WEBAPP requestChat ====
function requestChannels() {
    const btn = document.getElementById('selectChannelsBtn');
    const btnText = document.getElementById('selectBtnText');
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    // Показываем загрузку на кнопке
    btn.classList.add('btn-loading');
    btn.disabled = true;
    btnText.textContent = locale.selectingText || 'Selecting...';
    
    // ==== ВАЖНО: Telegram WebApp метод requestChat ====
    // Этот метод открывает системное окно Telegram для выбора чатов
    // allow_multiselect: true позволяет выбрать ВСЕ каналы кнопкой "Выбрать все"
    
    if (tg.platform !== 'unknown' && tg.isExpanded) {
        // Открываем окно выбора чатов
        tg.requestChat({
            chat_types: ['channel', 'group', 'supergroup'],
            allow_multiselect: true, // Ключевой параметр для выбора всех!
            title: locale.step1Title || 'Select Channels',
            optional: false
        }, (chats) => {
            // Обработка выбранных чатов
            handleSelectedChats(chats);
        });
    } else {
        // Для теста в браузере используем мок-данные
        setTimeout(() => {
            const mockChats = [
                { id: -1001234567890, title: "Tech News", type: "channel", username: "tech_news" },
                { id: -1001234567891, title: "Crypto Signals", type: "channel", username: "crypto_signals" },
                { id: -1001234567892, title: "Memes Daily", type: "channel", username: "memes_daily" },
                { id: -1001234567893, title: "Programming", type: "channel", username: "programming" },
                { id: -1001234567894, title: "Old Channel", type: "channel", username: "old_channel" }
            ];
            handleSelectedChats(mockChats);
        }, 1000);
    }
}

// Обработка выбранных чатов
function handleSelectedChats(chats) {
    const btn = document.getElementById('selectChannelsBtn');
    const btnText = document.getElementById('selectBtnText');
    const counter = document.getElementById('selectionCounter');
    const countElem = document.getElementById('channelCount');
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    // Сбрасываем состояние кнопки
    btn.classList.remove('btn-loading');
    btn.disabled = false;
    
    if (!chats || chats.length === 0) {
        btnText.textContent = locale.selectBtnText;
        tg.showAlert('No channels selected');
        return;
    }
    
    // Сохраняем выбранные каналы
    selectedChannels = chats.map(chat => ({
        id: chat.id,
        title: chat.title,
        username: chat.username || '',
        type: chat.type,
        members: Math.floor(Math.random() * 100000) + 1000, // Мок данные
        last_post: getRandomDate(),
        description: getRandomDescription(chat.title)
    }));
    
    // Показываем счетчик
    countElem.textContent = selectedChannels.length;
    counter.classList.remove('hidden');
    btnText.textContent = `✅ ${selectedChannels.length} ${locale.channelsText}`;
    
    // Активируем анализ
    setTimeout(() => {
        startAnalysis();
    }, 500);
    
    console.log('Selected channels:', selectedChannels);
}

// Начало анализа
function startAnalysis() {
    document.getElementById('step2').classList.remove('hidden');
    document.getElementById('loadingAnalysis').classList.remove('hidden');
    document.getElementById('resultsSection').classList.add('hidden');
    
    // Имитация анализа с AI
    setTimeout(() => {
        performAnalysis();
    }, 2000);
}

// Выполнение анализа
function performAnalysis() {
    analysisResults = selectedChannels.map(channel => {
        // Реальная логика анализа
        let status = "good";
        let score = 8;
        let reason = "Active channel";
        
        // Анализ 1: Проверка давности последнего поста
        const daysSinceLastPost = Math.floor((new Date() - new Date(channel.last_post)) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastPost > 180) {
            status = "dead";
            score = 1;
            reason = `Inactive for ${daysSinceLastPost} days`;
        }
        // Анализ 2: Проверка на спам
        else if (channel.title.toLowerCase().includes('signal') || 
                 channel.title.toLowerCase().includes('promo') ||
                 channel.title.toLowerCase().includes('buy') ||
                 channel.title.toLowerCase().includes('sale')) {
            status = "spam";
            score = 2;
            reason = "Promotional/spam content";
        }
        // Анализ 3: Проверка размера аудитории
        else if (channel.members < 1000) {
            status = "inactive";
            score = 4;
            reason = `Small audience (${channel.members} members)`;
        }
        // Анализ 4: Проверка на токсичность (по эмодзи)
        else if (channel.title.includes('🚀') || 
                channel.title.includes('💰') ||
                channel.title.includes('🔥') ||
                channel.title.includes('💎')) {
            status = "toxic";
            score = 5;
            reason = "Hype/toxicity detected";
        }
        
        return {
            ...channel,
            status: status,
            score: score,
            reason: reason,
            daysSinceLastPost: daysSinceLastPost
        };
    });
    
    // Показываем результаты
    showAnalysisResults();
}

// Показ результатов анализа
function showAnalysisResults() {
    const loading = document.getElementById('loadingAnalysis');
    const resultsSection = document.getElementById('resultsSection');
    const resultsList = document.getElementById('resultsList');
    const cleanupBtn = document.getElementById('cleanupBtn');
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    loading.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    
    // Очищаем список
    resultsList.innerHTML = '';
    
    // Подсчитываем статистику
    userStats = {
        total: analysisResults.length,
        dead: analysisResults.filter(c => c.status === 'dead').length,
        spam: analysisResults.filter(c => c.status === 'spam').length,
        toxic: analysisResults.filter(c => c.status === 'toxic').length,
        inactive: analysisResults.filter(c => c.status === 'inactive').length,
        toClean: 0,
        cleanPercent: 0
    };
    
    userStats.toClean = userStats.dead + userStats.spam + userStats.toxic + userStats.inactive;
    userStats.cleanPercent = Math.round(((userStats.total - userStats.toClean) / userStats.total) * 100);
    
    // Обновляем прогресс
    document.getElementById('progressFill').style.width = `${userStats.cleanPercent}%`;
    document.getElementById('cleanPercent').textContent = `${userStats.cleanPercent}%`;
    
    // Показываем каналы
    analysisResults.forEach((channel, index) => {
        const item = document.createElement('div');
        item.className = 'result-item';
        item.innerHTML = `
            <div class="channel-info">
                <div class="channel-title">${channel.title}</div>
                <div class="channel-desc">${channel.description}</div>
                <div class="channel-meta">
                    <span>👥 ${channel.members.toLocaleString()}</span>
                    <span>📅 ${channel.daysSinceLastPost}d</span>
                </div>
            </div>
            <div class="channel-status">
                <div class="badge badge-${channel.status}">
                    ${locale[channel.status] || channel.status}
                </div>
                <div class="channel-reason">${channel.reason}</div>
            </div>
            <div class="channel-score">
                <div class="score-circle" style="background: ${getScoreColor(channel.score)}; border-color: ${getScoreColor(channel.score)}">
                    ${channel.score}/10
                </div>
            </div>
        `;
        resultsList.appendChild(item);
    });
    
    // Показываем кнопку очистки если есть что чистить
    if (userStats.toClean > 0) {
        cleanupBtn.classList.remove('hidden');
        cleanupBtn.innerHTML = `${locale.cleanupBtnText} (${userStats.toClean})`;
    }
    
    // Обновляем статистику
    updateStatistics();
}

// Цвет для оценки
function getScoreColor(score) {
    if (score >= 8) return 'rgba(16, 185, 129, 0.3)';
    if (score >= 5) return 'rgba(245, 158, 11, 0.3)';
    return 'rgba(239, 68, 68, 0.3)';
}

// Обновление статистики
function updateStatistics() {
    document.getElementById('totalChannels').textContent = userStats.total;
    document.getElementById('deadChannels').textContent = userStats.dead;
    document.getElementById('spamChannels').textContent = userStats.spam;
    document.getElementById('toClean').textContent = userStats.toClean;
    
    // Прячем дефолтное сообщение
    document.getElementById('statsMessage').classList.add('hidden');
}

// Начало очистки
function startCleanup() {
    const cleanupBtn = document.getElementById('cleanupBtn');
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    cleanupBtn.classList.add('btn-loading');
    cleanupBtn.disabled = true;
    cleanupBtn.innerHTML = locale.cleaningText || 'Cleaning...';
    
    // Имитация процесса очистки
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('cleanPercent').textContent = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            showSuccess();
            
            // Отправляем данные на сервер
            sendResultsToServer();
        }
    }, 200);
}

// Показ успеха
function showSuccess() {
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('successCard').classList.remove('hidden');
    
    // Вибрация если доступна
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
}

// Отправка результатов на сервер
function sendResultsToServer() {
    const data = {
        action: 'analysis_complete',
        user_id: userId,
        analyzed: userStats.total,
        deleted: userStats.toClean,
        channels: analysisResults.map(c => ({
            id: c.id,
            title: c.title,
            status: c.status,
            score: c.score
        }))
    };
    
    // Отправляем данные боту через WebApp
    tg.sendData(JSON.stringify(data));
    
    console.log('Results sent to server:', data);
}

// Загрузка рекомендованных каналов
function loadRecommendedChannels() {
    const container = document.getElementById('recommendedChannels');
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    const channels = [
        { title: "Telegram Official", url: "https://t.me/telegram", desc: "Official Telegram channel", lang: "all" },
        { title: "Tech Insider", url: "https://t.me/technology", desc: "Latest tech news and insights", lang: "en" },
        { title: "Новости IT", url: "https://t.me/IT_news_ru", desc: "Свежие IT новости на русском", lang: "ru" },
        { title: "AI & ML News", url: "https://t.me/ai_ml", desc: "Artificial Intelligence updates", lang: "en" }
    ];
    
    // Фильтруем по языку
    const filtered = channels.filter(c => c.lang === 'all' || c.lang === userLang);
    
    if (filtered.length === 0) {
        container.innerHTML = `<p style="text-align: center; opacity: 0.7;">No recommendations for your language</p>`;
        return;
    }
    
    let html = '';
    filtered.forEach(channel => {
        html += `
            <div class="result-item" style="margin-bottom: 10px;">
                <div class="channel-info">
                    <div class="channel-title">${channel.title}</div>
                    <div class="channel-desc">${channel.desc}</div>
                </div>
                <a href="${channel.url}" target="_blank" class="badge badge-good" style="text-decoration: none;">
                    Join
                </a>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Проверка обязательных каналов
function checkMandatoryChannels() {
    // В реальной версии здесь запрос к серверу
    // Показываем если есть обязательные каналы
    const hasMandatoryChannels = Math.random() > 0.5; // 50% шанс
    
    if (hasMandatoryChannels) {
        document.getElementById('mandatoryNotice').classList.remove('hidden');
    }
}

// Показ обязательных каналов
function showMandatoryChannels() {
    tg.showPopup({
        title: "Mandatory Channels",
        message: "To continue, please subscribe to these channels:\n\n1. @telegram - Official channel\n2. @durov - Founder's channel\n\nAfter subscribing, restart the bot.",
        buttons: [
            { id: 'ok', type: 'default', text: 'OK' }
        ]
    });
}

// Поделиться результатами
function shareResults() {
    const locale = LOCALE[userLang] || LOCALE['en'];
    const text = `I just cleaned ${userStats.toClean} channels from my Telegram with @TG_Auditor_Pro! 🧹\n\nTry it: https://t.me/TG_Auditor_Pro_bot`;
    
    tg.openLink(`https://t.me/share/url?url=https://t.me/TG_Auditor_Pro_bot&text=${encodeURIComponent(text)}`);
}

// Вспомогательные функции
function getRandomDate() {
    const start = new Date(2022, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

function getRandomDescription(title) {
    const descriptions = [
        "News and updates",
        "Daily content",
        "Community discussions",
        "Information channel",
        "Entertainment content",
        "Educational material"
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initWebApp);
