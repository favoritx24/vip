// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;
let currentUser = null;
let currentLang = 'ru';
let currentType = null;
let selectedChats = [];
let analyzedResults = [];

// Проверка инициализации Telegram Web App
function initTelegramWebApp() {
    if (typeof window.Telegram === 'undefined') {
        console.error('Telegram Web App SDK не загружен');
        return false;
    }
    
    tg = window.Telegram.WebApp;
    
    if (!tg) {
        console.error('Telegram Web App не инициализирован');
        return false;
    }
    
    tg.expand();
    tg.ready();
    return true;
}

// Получаем параметры из URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('user_id') || 'test_user';
const lang = urlParams.get('lang') || 'ru';

// Устанавливаем язык
currentLang = lang;
document.documentElement.lang = lang;

// Тексты на разных языках
const TEXTS = {
    ru: {
        welcome: "Очистка Telegram",
        channels: "Каналы",
        groups: "Группы",
        bots: "Боты",
        analyzing: "Анализ...",
        selectAll: "Выбрать все",
        cleanSelected: "Очистить выбранное",
        recommendations: "Рекомендуем подписаться",
        analyzed: "Проанализировано",
        cleaned: "Очищено",
        startAnalysis: "Начать анализ",
        selectTypeFirst: "Сначала выберите тип контента",
        noChatsSelected: "Чаты не выбраны",
        analysisComplete: "Анализ завершен",
        cleaningComplete: "Очистка завершена",
        select: "Выбрать",
        selected: "Выбрано",
        channelsCount: "∞ каналов",
        groupsCount: "∞ групп",
        botsCount: "∞ ботов"
    },
    en: {
        welcome: "Telegram Cleaning",
        channels: "Channels",
        groups: "Groups",
        bots: "Bots",
        analyzing: "Analyzing...",
        selectAll: "Select all",
        cleanSelected: "Clean selected",
        recommendations: "Recommended to subscribe",
        analyzed: "Analyzed",
        cleaned: "Cleaned",
        startAnalysis: "Start analysis",
        selectTypeFirst: "Select content type first",
        noChatsSelected: "No chats selected",
        analysisComplete: "Analysis complete",
        cleaningComplete: "Cleaning complete",
        select: "Select",
        selected: "Selected",
        channelsCount: "∞ channels",
        groupsCount: "∞ groups",
        botsCount: "∞ bots"
    }
};

// Обновляем тексты на странице
function updateTexts() {
    const texts = TEXTS[currentLang];
    
    // Обновляем заголовки
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (texts[key]) {
            el.textContent = texts[key];
        }
    });
    
    // Обновляем конкретные элементы
    if (document.querySelector('h1')) {
        document.querySelector('h1').textContent = texts.welcome;
    }
    
    if (document.querySelector('.welcome-card h2')) {
        document.querySelector('.welcome-card h2').textContent = texts.welcome;
    }
    
    // Обновляем кнопки
    const cleanBtn = document.getElementById('cleanBtn');
    if (cleanBtn) {
        cleanBtn.innerHTML = `<i class="fas fa-broom"></i> ${texts.cleanSelected}`;
    }
    
    const startBtn = document.getElementById('startAnalysisBtn');
    if (startBtn && currentType) {
        const typeText = texts[currentType];
        startBtn.innerHTML = `<i class="fas fa-play"></i> ${texts.startAnalysis} ${typeText}`;
    }
    
    // Обновляем счетчики
    document.getElementById('channelsCount').textContent = texts.channelsCount;
    document.getElementById('groupsCount').textContent = texts.groupsCount;
    document.getElementById('botsCount').textContent = texts.botsCount;
}

// Загрузка пользователя
function loadUser() {
    document.getElementById('userInfo').innerHTML = `
        <i class="fas fa-user"></i>
        <span>ID: ${userId.substring(0, 8)}...</span>
    `;
    
    // Загружаем статистику
    loadStats();
    // Загружаем рекламные каналы
    loadAdChannels();
}

// Загрузка статистики
function loadStats() {
    const stats = {
        analyzed: localStorage.getItem(`analyzed_${userId}`) || 0,
        cleaned_channels: localStorage.getItem(`cleaned_channels_${userId}`) || 0,
        cleaned_groups: localStorage.getItem(`cleaned_groups_${userId}`) || 0,
        cleaned_bots: localStorage.getItem(`cleaned_bots_${userId}`) || 0
    };
    
    document.getElementById('analyzedCount').textContent = stats.analyzed;
    document.getElementById('cleanedChannels').textContent = stats.cleaned_channels;
    document.getElementById('cleanedGroups').textContent = stats.cleaned_groups;
    document.getElementById('cleanedBots').textContent = stats.cleaned_bots;
}

// Загрузка рекламных каналов
function loadAdChannels() {
    const adChannels = [
        {
            name: currentLang === 'ru' ? "Новости IT" : "IT News",
            desc: currentLang === 'ru' ? "Свежие новости технологий" : "Fresh technology news",
            icon: "fas fa-laptop-code",
            link: "https://t.me/telegram"
        },
        {
            name: currentLang === 'ru' ? "Крипто аналитика" : "Crypto Analytics",
            desc: currentLang === 'ru' ? "Анализ рынка криптовалют" : "Cryptocurrency market analysis",
            icon: "fas fa-chart-line",
            link: "https://t.me/telegram"
        }
    ];
    
    const container = document.getElementById('adChannels');
    if (container) {
        container.innerHTML = adChannels.map(channel => `
            <div class="ad-channel">
                <i class="${channel.icon}"></i>
                <div class="ad-info">
                    <h4>${channel.name}</h4>
                    <p>${channel.desc}</p>
                </div>
                <button class="ad-button" onclick="window.open('${channel.link}', '_blank')">
                    ${currentLang === 'ru' ? 'Подписаться' : 'Subscribe'}
                </button>
            </div>
        `).join('');
    }
}

// Выбор типа контента
function selectType(type) {
    currentType = type;
    
    // Снимаем выделение со всех карточек
    document.querySelectorAll('.selection-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Выделяем выбранную карточку
    const target = event?.currentTarget || document.querySelector(`[onclick*="${type}"]`);
    if (target) {
        target.classList.add('active');
    }
    
    // Показываем кнопку анализа
    const startBtn = document.getElementById('startAnalysisBtn');
    if (startBtn) {
        startBtn.style.display = 'flex';
        const texts = TEXTS[currentLang];
        const typeText = texts[type];
        startBtn.innerHTML = `<i class="fas fa-play"></i> ${texts.startAnalysis} ${typeText}`;
    }
}

// Запрос чатов у Telegram
async function requestChats() {
    if (!currentType) {
        showAlert(TEXTS[currentLang].selectTypeFirst);
        return;
    }
    
    if (!tg || !tg.requestChat) {
        console.log('Telegram Web App requestChat не доступен, используем симуляцию');
        await simulateChatSelection();
        return;
    }
    
    const params = {
        chat_types: getChatTypesForCurrentType(),
        allow_multiselect: true,
        title: TEXTS[currentLang][currentType]
    };
    
    console.log('Запрашиваем чаты с параметрами:', params);
    
    tg.requestChat({
        ...params,
        onSuccess: (data) => {
            console.log('Получены чаты:', data);
            handleSelectedChats(data);
        },
        onError: (error) => {
            console.error('Ошибка при выборе чатов:', error);
            showAlert(currentLang === 'ru' ? 
                'Ошибка при выборе чатов, используем симуляцию' : 
                'Error selecting chats, using simulation');
            simulateChatSelection();
        }
    });
}

function getChatTypesForCurrentType() {
    switch(currentType) {
        case 'channels': return ['channel'];
        case 'groups': return ['group'];
        case 'bots': return ['bot'];
        default: return ['channel'];
    }
}

// Симуляция выбора чатов (для тестирования)
async function simulateChatSelection() {
    console.log('Симуляция выбора чатов для типа:', currentType);
    
    // Генерируем тестовые чаты
    const chatNames = {
        ru: {
            channels: ['Новости', 'Мемы', 'Крипта', 'IT Новости', 'Спорт', 'Музыка'],
            groups: ['Работа', 'Друзья', 'Семья', 'Учеба', 'Хобби', 'Игры'],
            bots: ['WeatherBot', 'NewsBot', 'TranslateBot', 'GameBot', 'MusicBot', 'SearchBot']
        },
        en: {
            channels: ['News', 'Memes', 'Crypto', 'IT News', 'Sports', 'Music'],
            groups: ['Work', 'Friends', 'Family', 'Study', 'Hobby', 'Games'],
            bots: ['WeatherBot', 'NewsBot', 'TranslateBot', 'GameBot', 'MusicBot', 'SearchBot']
        }
    };
    
    const names = chatNames[currentLang][currentType] || chatNames['ru'][currentType];
    const count = 10 + Math.floor(Math.random() * 20);
    
    const simulatedChats = Array.from({length: count}, (_, i) => ({
        id: Date.now() + i,
        title: `${names[i % names.length]} ${i + 1}`,
        type: currentType === 'channels' ? 'channel' : 
              currentType === 'groups' ? 'group' : 'bot'
    }));
    
    console.log('Симулированные чаты:', simulatedChats);
    await handleSelectedChats(simulatedChats);
}

// Обработка выбранных чатов
async function handleSelectedChats(chatData) {
    // Преобразуем данные в массив
    selectedChats = Array.isArray(chatData) ? chatData : [chatData];
    
    if (selectedChats.length === 0) {
        showAlert(TEXTS[currentLang].noChatsSelected);
        return;
    }
    
    console.log('Начинаем анализ', selectedChats.length, 'чатов');
    
    // Показываем экран анализа
    document.getElementById('mainScreen').style.display = 'none';
    document.getElementById('analysisScreen').style.display = 'block';
    
    // Устанавливаем тип
    const typeText = TEXTS[currentLang][currentType];
    document.getElementById('currentType').textContent = typeText.toLowerCase();
    
    // Показываем прогресс
    updateProgress(0);
    
    // Анализируем каждый чат
    analyzedResults = [];
    
    for (let i = 0; i < selectedChats.length; i++) {
        const chat = selectedChats[i];
        const result = await analyzeChat(chat);
        analyzedResults.push(result);
        
        // Обновляем прогресс
        const progress = ((i + 1) / selectedChats.length) * 100;
        updateProgress(progress);
        
        // Показываем промежуточные результаты каждые 5 чатов
        if (i % 5 === 0 || i === selectedChats.length - 1) {
            showPartialResults();
        }
        
        // Задержка для анимации
        await sleep(50);
    }
    
    // Показываем финальные результаты
    showResults();
    updateProgress(100);
    
    // Активируем кнопку очистки
    document.getElementById('cleanBtn').disabled = false;
    
    showAlert(TEXTS[currentLang].analysisComplete);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Анализ чата
async function analyzeChat(chat) {
    // Задержка для имитации анализа
    await sleep(100 + Math.random() * 200);
    
    const chatType = chat.type || currentType.slice(0, -1);
    
    // Генерируем случайный статус с разными вероятностями
    const rand = Math.random();
    let status, icon, description;
    
    if (rand < 0.3) { // 30% активные
        status = 'active';
        icon = 'fa-check-circle';
        description = currentLang === 'ru' ? 'Активный, можно оставить' : 'Active, can keep';
    } else if (rand < 0.6) { // 30% неактивные
        status = 'inactive';
        icon = 'fa-clock';
        description = currentLang === 'ru' ? 'Неактивный более 1 месяца' : 'Inactive for more than 1 month';
    } else if (rand < 0.8) { // 20% мертвые
        status = 'dead';
        icon = 'fa-skull-crossbones';
        description = currentLang === 'ru' ? 'Неактивный более 6 месяцев' : 'Inactive for more than 6 months';
    } else { // 20% токсичные
        status = 'toxic';
        icon = 'fa-radiation';
        description = currentLang === 'ru' ? 'Токсичный контент' : 'Toxic content';
    }
    
    return {
        id: chat.id || Math.random().toString(36).substr(2, 9),
        title: chat.title || `${TEXTS[currentLang][currentType]} ${analyzedResults.length + 1}`,
        type: chatType,
        status: status,
        icon: icon,
        description: description,
        selected: status === 'dead' || status === 'toxic'
    };
}

// Обновление прогресс-бара
function updateProgress(percent) {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    if (progressBar && progressText) {
        progressBar.style.width = `${percent}%`;
        progressText.textContent = `${Math.round(percent)}%`;
    }
}

// Показ промежуточных результатов
function showPartialResults() {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    
    const recentResults = analyzedResults.slice(-5);
    
    container.innerHTML = `
        <div class="summary">
            <h3>${currentLang === 'ru' ? 'Анализируем...' : 'Analyzing...'}</h3>
            <p>${currentLang === 'ru' ? 'Обработано:' : 'Processed:'} ${analyzedResults.length}/${selectedChats.length}</p>
        </div>
        <div class="results-list">
            ${recentResults.map((result, index) => `
                <div class="result-item ${result.status}">
                    <i class="fas ${result.icon}"></i>
                    <div class="result-info">
                        <div class="result-title">${result.title}</div>
                        <div class="result-desc">${result.description}</div>
                    </div>
                    <input type="checkbox" class="result-checkbox" 
                           onchange="toggleSelection(${analyzedResults.length - recentResults.length + index})"
                           ${result.selected ? 'checked' : ''}>
                </div>
            `).join('')}
        </div>
    `;
}

// Показ окончательных результатов
function showResults() {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    
    if (analyzedResults.length === 0) {
        container.innerHTML = `
            <div class="result-item">
                <i class="fas fa-info-circle"></i>
                <div class="result-info">
                    <div class="result-title">${currentLang === 'ru' ? 'Нет результатов' : 'No results'}</div>
                    <div class="result-desc">${currentLang === 'ru' ? 'Выберите чаты для анализа' : 'Select chats for analysis'}</div>
                </div>
            </div>
        `;
        return;
    }
    
    // Группируем по статусу
    const activeChats = analyzedResults.filter(r => r.status === 'active').length;
    const inactiveChats = analyzedResults.filter(r => r.status === 'inactive').length;
    const deadChats = analyzedResults.filter(r => r.status === 'dead').length;
    const toxicChats = analyzedResults.filter(r => r.status === 'toxic').length;
    
    const selectedCount = analyzedResults.filter(r => r.selected).length;
    
    container.innerHTML = `
        <div class="summary">
            <h3>${currentLang === 'ru' ? 'Итоги анализа:' : 'Analysis summary:'}</h3>
            <div class="summary-stats">
                <div class="summary-item active">
                    <i class="fas fa-check-circle"></i>
                    <span>${currentLang === 'ru' ? 'Активные:' : 'Active:'} ${activeChats}</span>
                </div>
                <div class="summary-item inactive">
                    <i class="fas fa-clock"></i>
                    <span>${currentLang === 'ru' ? 'Неактивные:' : 'Inactive:'} ${inactiveChats}</span>
                </div>
                <div class="summary-item dead">
                    <i class="fas fa-skull-crossbones"></i>
                    <span>${currentLang === 'ru' ? 'Мертвые:' : 'Dead:'} ${deadChats}</span>
                </div>
                <div class="summary-item toxic">
                    <i class="fas fa-radiation"></i>
                    <span>${currentLang === 'ru' ? 'Токсичные:' : 'Toxic:'} ${toxicChats}</span>
                </div>
            </div>
            <p style="margin-top: 10px; color: var(--primary); font-weight: bold;">
                ${currentLang === 'ru' ? 'Выбрано для очистки:' : 'Selected for cleaning:'} ${selectedCount}
            </p>
        </div>
        <div class="results-list">
            ${analyzedResults.map((result, index) => `
                <div class="result-item ${result.status}">
                    <i class="fas ${result.icon}"></i>
                    <div class="result-info">
                        <div class="result-title">${result.title}</div>
                        <div class="result-desc">${result.description}</div>
                    </div>
                    <input type="checkbox" class="result-checkbox" 
                           onchange="toggleSelection(${index})"
                           ${result.selected ? 'checked' : ''}>
                </div>
            `).join('')}
        </div>
    `;
}

// Переключение выбора
function toggleSelection(index) {
    if (analyzedResults[index]) {
        analyzedResults[index].selected = !analyzedResults[index].selected;
        updateSelectedCount();
    }
}

function updateSelectedCount() {
    const selectedCount = analyzedResults.filter(r => r.selected).length;
    const cleanBtn = document.getElementById('cleanBtn');
    
    if (selectedCount > 0) {
        cleanBtn.disabled = false;
        const texts = TEXTS[currentLang];
        cleanBtn.innerHTML = `<i class="fas fa-broom"></i> ${texts.cleanSelected} (${selectedCount})`;
    } else {
        cleanBtn.disabled = true;
        const texts = TEXTS[currentLang];
        cleanBtn.innerHTML = `<i class="fas fa-broom"></i> ${texts.cleanSelected}`;
    }
}

// Очистка выбранного
function cleanSelected() {
    const selected = analyzedResults.filter(r => r.selected);
    
    if (selected.length === 0) {
        showAlert(currentLang === 'ru' ? 
            'Выберите хотя бы один чат для очистки' : 
            'Select at least one chat to clean');
        return;
    }
    
    // Обновляем статистику в localStorage
    const currentAnalyzed = parseInt(localStorage.getItem(`analyzed_${userId}`) || 0);
    let currentCleanedChannels = parseInt(localStorage.getItem(`cleaned_channels_${userId}`) || 0);
    let currentCleanedGroups = parseInt(localStorage.getItem(`cleaned_groups_${userId}`) || 0);
    let currentCleanedBots = parseInt(localStorage.getItem(`cleaned_bots_${userId}`) || 0);
    
    // Считаем по типам
    const channelsCleaned = selected.filter(r => r.type === 'channel').length;
    const groupsCleaned = selected.filter(r => r.type === 'group').length;
    const botsCleaned = selected.filter(r => r.type === 'bot').length;
    
    localStorage.setItem(`analyzed_${userId}`, currentAnalyzed + analyzedResults.length);
    localStorage.setItem(`cleaned_channels_${userId}`, currentCleanedChannels + channelsCleaned);
    localStorage.setItem(`cleaned_groups_${userId}`, currentCleanedGroups + groupsCleaned);
    localStorage.setItem(`cleaned_bots_${userId}`, currentCleanedBots + botsCleaned);
    
    // Показываем уведомление
    showAlert(
        currentLang === 'ru' ? 
        `✅ Успешно очищено ${selected.length} чатов!\n\n` +
        `📊 Статистика:\n` +
        `• Каналов: ${channelsCleaned}\n` +
        `• Групп: ${groupsCleaned}\n` +
        `• Ботов: ${botsCleaned}\n\n` +
        `Ваша лента теперь чище! 🎉` :
        `✅ Successfully cleaned ${selected.length} chats!\n\n` +
        `📊 Statistics:\n` +
        `• Channels: ${channelsCleaned}\n` +
        `• Groups: ${groupsCleaned}\n` +
        `• Bots: ${botsCleaned}\n\n` +
        `Your feed is now cleaner! 🎉`
    );
    
    // Обновляем статистику на экране
    loadStats();
    
    // Возвращаем на главный экран
    goBack();
}

// Показать алерт
function showAlert(message) {
    if (tg && tg.showAlert) {
        tg.showAlert(message);
    } else {
        alert(message);
    }
}

// Назад на главный экран
function goBack() {
    document.getElementById('mainScreen').style.display = 'block';
    document.getElementById('analysisScreen').style.display = 'none';
    analyzedResults = [];
    selectedChats = [];
    currentType = null;
    
    // Сбрасываем активный выбор
    document.querySelectorAll('.selection-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Скрываем кнопку анализа
    const startBtn = document.getElementById('startAnalysisBtn');
    if (startBtn) {
        startBtn.style.display = 'none';
        startBtn.innerHTML = `<i class="fas fa-play"></i> ${TEXTS[currentLang].startAnalysis}`;
    }
    
    // Сбрасываем прогресс
    updateProgress(0);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем Telegram Web App
    if (!initTelegramWebApp()) {
        console.log('Telegram Web App не инициализирован, работаем в браузере');
    }
    
    // Загружаем данные
    loadUser();
    updateTexts();
    
    // Добавляем обработчики для карточек выбора
    document.querySelectorAll('.selection-card').forEach(card => {
        const type = card.querySelector('h3').textContent.toLowerCase();
        card.onclick = () => selectType(type);
    });
});
