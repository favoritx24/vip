// Telegram Web App
let tg = window.Telegram.WebApp;
let currentUser = null;
let currentLang = 'ru';
let currentType = null;
let selectedChats = [];
let analyzedResults = [];

// Тексты на разных языках
const TEXTS = {
    ru: {
        appTitle: "Telegram Auditor",
        welcomeTitle: "Очистка Telegram",
        welcomeDesc: "Проанализируйте и очистите свои каналы, группы и боты",
        channelsTitle: "Каналы",
        channelsDesc: "Анализ и очистка каналов",
        groupsTitle: "Группы",
        groupsDesc: "Анализ и очистка групп",
        botsTitle: "Боты",
        botsDesc: "Анализ и очистка ботов",
        startAnalysis: "Начать анализ",
        startAnalysisType: "Начать анализ",
        cleanSelected: "Очистить выбранное",
        recommendationsTitle: "Рекомендуем подписаться",
        analyzedLabel: "Проанализировано:",
        channelsLabel: "Каналов:",
        groupsLabel: "Групп:",
        botsLabel: "Ботов:",
        analysisTitle: "Анализ",
        selectTypeFirst: "Сначала выберите тип контента",
        noChatsSelected: "Чаты не выбраны",
        analysisComplete: "Анализ завершен",
        cleaningComplete: "Очистка завершена",
        active: "Активный",
        inactive: "Неактивный",
        dead: "Мертвый",
        toxic: "Токсичный",
        activeDesc: "Активный, можно оставить",
        inactiveDesc: "Неактивный более 1 месяца",
        deadDesc: "Неактивный более 6 месяцев",
        toxicDesc: "Токсичный контент",
        subscribe: "Подписаться",
        summaryTitle: "Итоги анализа:",
        activeCount: "Активные:",
        inactiveCount: "Неактивные:",
        deadCount: "Мертвые:",
        toxicCount: "Токсичные:",
        selectedForCleaning: "Выбрано для очистки:",
        analyzing: "Анализируем...",
        processed: "Обработано:",
        selectAll: "Выбрать все",
        unselectAll: "Снять выделение"
    },
    en: {
        appTitle: "Telegram Auditor",
        welcomeTitle: "Telegram Cleaning",
        welcomeDesc: "Analyze and clean your channels, groups and bots",
        channelsTitle: "Channels",
        channelsDesc: "Analysis and cleaning of channels",
        groupsTitle: "Groups",
        groupsDesc: "Analysis and cleaning of groups",
        botsTitle: "Bots",
        botsDesc: "Analysis and cleaning of bots",
        startAnalysis: "Start analysis",
        startAnalysisType: "Start analysis",
        cleanSelected: "Clean selected",
        recommendationsTitle: "Recommended to subscribe",
        analyzedLabel: "Analyzed:",
        channelsLabel: "Channels:",
        groupsLabel: "Groups:",
        botsLabel: "Bots:",
        analysisTitle: "Analysis",
        selectTypeFirst: "Select content type first",
        noChatsSelected: "No chats selected",
        analysisComplete: "Analysis complete",
        cleaningComplete: "Cleaning complete",
        active: "Active",
        inactive: "Inactive",
        dead: "Dead",
        toxic: "Toxic",
        activeDesc: "Active, can keep",
        inactiveDesc: "Inactive for more than 1 month",
        deadDesc: "Inactive for more than 6 months",
        toxicDesc: "Toxic content",
        subscribe: "Subscribe",
        summaryTitle: "Analysis summary:",
        activeCount: "Active:",
        inactiveCount: "Inactive:",
        deadCount: "Dead:",
        toxicCount: "Toxic:",
        selectedForCleaning: "Selected for cleaning:",
        analyzing: "Analyzing...",
        processed: "Processed:",
        selectAll: "Select all",
        unselectAll: "Unselect all"
    }
};

// Инициализация Telegram Web App
function initTelegramWebApp() {
    if (typeof window.Telegram === 'undefined') {
        console.log('Telegram Web App SDK не загружен, работаем в браузере');
        return false;
    }
    
    try {
        tg = window.Telegram.WebApp;
        tg.expand();
        tg.ready();
        console.log('Telegram Web App инициализирован');
        return true;
    } catch (error) {
        console.error('Ошибка инициализации Telegram Web App:', error);
        return false;
    }
}

// Получаем параметры из URL
function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        userId: urlParams.get('user_id') || 'demo_user_' + Math.random().toString(36).substr(2, 9),
        lang: urlParams.get('lang') || 'ru'
    };
}

// Обновляем тексты на странице
function updateTexts() {
    const texts = TEXTS[currentLang];
    
    // Обновляем все элементы с текстом
    document.getElementById('appTitle').textContent = texts.appTitle;
    document.getElementById('welcomeTitle').textContent = texts.welcomeTitle;
    document.getElementById('welcomeDesc').textContent = texts.welcomeDesc;
    document.getElementById('channelsTitle').textContent = texts.channelsTitle;
    document.getElementById('channelsDesc').textContent = texts.channelsDesc;
    document.getElementById('groupsTitle').textContent = texts.groupsTitle;
    document.getElementById('groupsDesc').textContent = texts.groupsDesc;
    document.getElementById('botsTitle').textContent = texts.botsTitle;
    document.getElementById('botsDesc').textContent = texts.botsDesc;
    document.getElementById('startAnalysisText').textContent = texts.startAnalysis;
    document.getElementById('cleanSelectedText').textContent = texts.cleanSelected;
    document.getElementById('recommendationsTitle').textContent = texts.recommendationsTitle;
    document.getElementById('analyzedLabel').textContent = texts.analyzedLabel + ' ';
    document.getElementById('channelsLabel').textContent = texts.channelsLabel + ' ';
    document.getElementById('groupsLabel').textContent = texts.groupsLabel + ' ';
    document.getElementById('botsLabel').textContent = texts.botsLabel + ' ';
    document.getElementById('analysisTitle').textContent = texts.analysisTitle;
    
    // Обновляем кнопку анализа
    const startBtn = document.getElementById('startAnalysisBtn');
    if (startBtn && currentType) {
        startBtn.innerHTML = `<i class="fas fa-play"></i> ${texts.startAnalysisType} ${texts[currentType + 'Title']}`;
    }
}

// Загрузка пользователя
function loadUser() {
    const params = getUrlParams();
    currentUser = params.userId;
    currentLang = params.lang;
    
    document.getElementById('userId').textContent = `ID: ${currentUser.substring(0, 8)}...`;
    
    // Загружаем статистику
    loadStats();
    // Загружаем рекламные каналы
    loadAdChannels();
    // Обновляем тексты
    updateTexts();
}

// Загрузка статистики
function loadStats() {
    // Получаем статистику из localStorage
    const stats = {
        analyzed: localStorage.getItem(`${currentUser}_analyzed`) || 0,
        cleaned_channels: localStorage.getItem(`${currentUser}_cleaned_channels`) || 0,
        cleaned_groups: localStorage.getItem(`${currentUser}_cleaned_groups`) || 0,
        cleaned_bots: localStorage.getItem(`${currentUser}_cleaned_bots`) || 0
    };
    
    document.getElementById('analyzedCount').textContent = stats.analyzed;
    document.getElementById('cleanedChannels').textContent = stats.cleaned_channels;
    document.getElementById('cleanedGroups').textContent = stats.cleaned_groups;
    document.getElementById('cleanedBots').textContent = stats.cleaned_bots;
}

// Загрузка рекламных каналов
function loadAdChannels() {
    const adChannels = currentLang === 'ru' ? [
        {
            name: "Новости IT",
            desc: "Свежие новости технологий",
            icon: "fas fa-laptop-code",
            link: "https://t.me/telegram"
        },
        {
            name: "Крипто аналитика",
            desc: "Анализ рынка криптовалют",
            icon: "fas fa-chart-line",
            link: "https://t.me/telegram"
        }
    ] : [
        {
            name: "IT News",
            desc: "Fresh technology news",
            icon: "fas fa-laptop-code",
            link: "https://t.me/telegram"
        },
        {
            name: "Crypto Analytics",
            desc: "Cryptocurrency market analysis",
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
                    ${TEXTS[currentLang].subscribe}
                </button>
            </div>
        `).join('');
    }
}

// Выбор типа контента
function selectType(type) {
    console.log('Выбран тип:', type);
    
    // Снимаем выделение со всех карточек
    document.querySelectorAll('.selection-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Выделяем выбранную карточку
    const card = document.getElementById(`${type}Card`);
    if (card) {
        card.classList.add('active');
    }
    
    currentType = type;
    
    // Обновляем текст кнопки
    const startBtn = document.getElementById('startAnalysisBtn');
    if (startBtn) {
        startBtn.style.display = 'flex';
        const texts = TEXTS[currentLang];
        startBtn.innerHTML = `<i class="fas fa-play"></i> ${texts.startAnalysisType} ${texts[type + 'Title']}`;
    }
    
    // Обновляем текст в заголовке анализа
    document.getElementById('currentTypeText').textContent = TEXTS[currentLang][type + 'Title'].toLowerCase();
}

// Запрос чатов у Telegram
function requestChats() {
    if (!currentType) {
        showAlert(TEXTS[currentLang].selectTypeFirst);
        return;
    }
    
    console.log('Запрашиваем чаты типа:', currentType);
    
    // Проверяем доступность Telegram Web App
    if (tg && tg.requestChat) {
        const chatTypes = {
            'channels': ['channel'],
            'groups': ['group'],
            'bots': ['bot']
        };
        
        tg.requestChat({
            chat_types: chatTypes[currentType] || ['channel'],
            allow_multiselect: true,
            title: TEXTS[currentLang][currentType + 'Title']
        }, (chat) => {
            console.log('Получены чаты:', chat);
            handleSelectedChats(chat);
        });
    } else {
        // Симуляция для тестирования
        console.log('Telegram Web App не доступен, используем симуляцию');
        simulateChatSelection();
    }
}

// Симуляция выбора чатов
function simulateChatSelection() {
    console.log('Симуляция выбора чатов для типа:', currentType);
    
    // Генерируем тестовые чаты
    const chatCount = 15;
    const simulatedChats = [];
    
    for (let i = 1; i <= chatCount; i++) {
        simulatedChats.push({
            id: `chat_${i}`,
            title: `${TEXTS[currentLang][currentType + 'Title']} ${i}`,
            type: currentType.slice(0, -1) // убираем 's' в конце
        });
    }
    
    console.log('Симулированные чаты:', simulatedChats);
    handleSelectedChats(simulatedChats);
}

// Обработка выбранных чатов
async function handleSelectedChats(chatData) {
    console.log('Начинаем обработку чатов:', chatData);
    
    // Преобразуем данные в массив
    selectedChats = Array.isArray(chatData) ? chatData : [chatData];
    
    if (selectedChats.length === 0) {
        showAlert(TEXTS[currentLang].noChatsSelected);
        return;
    }
    
    // Показываем экран анализа
    document.getElementById('mainScreen').style.display = 'none';
    document.getElementById('analysisScreen').style.display = 'block';
    
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
        
        // Показываем промежуточные результаты
        if (i % 3 === 0 || i === selectedChats.length - 1) {
            showPartialResults();
        }
        
        // Небольшая задержка для анимации
        await sleep(100);
    }
    
    // Показываем финальные результаты
    showResults();
    updateProgress(100);
    
    // Активируем кнопку очистки
    document.getElementById('cleanBtn').disabled = false;
    
    showAlert(TEXTS[currentLang].analysisComplete);
}

// Анализ чата
async function analyzeChat(chat) {
    // Симуляция анализа
    await sleep(50 + Math.random() * 150);
    
    const rand = Math.random();
    let status, icon, description;
    
    if (rand < 0.4) { // 40% активные
        status = 'active';
        icon = 'fa-check-circle';
        description = TEXTS[currentLang].activeDesc;
    } else if (rand < 0.7) { // 30% неактивные
        status = 'inactive';
        icon = 'fa-clock';
        description = TEXTS[currentLang].inactiveDesc;
    } else if (rand < 0.9) { // 20% мертвые
        status = 'dead';
        icon = 'fa-skull-crossbones';
        description = TEXTS[currentLang].deadDesc;
    } else { // 10% токсичные
        status = 'toxic';
        icon = 'fa-radiation';
        description = TEXTS[currentLang].toxicDesc;
    }
    
    return {
        id: chat.id || `chat_${Date.now()}_${Math.random()}`,
        title: chat.title || `${TEXTS[currentLang][currentType + 'Title']} ${analyzedResults.length + 1}`,
        type: chat.type || currentType.slice(0, -1),
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
    
    const recentResults = analyzedResults.slice(-3);
    
    container.innerHTML = `
        <div class="summary">
            <h3>${TEXTS[currentLang].analyzing}</h3>
            <p>${TEXTS[currentLang].processed} ${analyzedResults.length}/${selectedChats.length}</p>
        </div>
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
    `;
}

// Показ окончательных результатов
function showResults() {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    
    // Группируем по статусу
    const activeChats = analyzedResults.filter(r => r.status === 'active').length;
    const inactiveChats = analyzedResults.filter(r => r.status === 'inactive').length;
    const deadChats = analyzedResults.filter(r => r.status === 'dead').length;
    const toxicChats = analyzedResults.filter(r => r.status === 'toxic').length;
    
    const selectedCount = analyzedResults.filter(r => r.selected).length;
    const texts = TEXTS[currentLang];
    
    container.innerHTML = `
        <div class="summary">
            <h3>${texts.summaryTitle}</h3>
            <div class="summary-stats">
                <div class="summary-item active">
                    <i class="fas fa-check-circle"></i>
                    <span>${texts.activeCount} ${activeChats}</span>
                </div>
                <div class="summary-item inactive">
                    <i class="fas fa-clock"></i>
                    <span>${texts.inactiveCount} ${inactiveChats}</span>
                </div>
                <div class="summary-item dead">
                    <i class="fas fa-skull-crossbones"></i>
                    <span>${texts.deadCount} ${deadChats}</span>
                </div>
                <div class="summary-item toxic">
                    <i class="fas fa-radiation"></i>
                    <span>${texts.toxicCount} ${toxicChats}</span>
                </div>
            </div>
            <div class="selection-controls">
                <button class="btn-small" onclick="selectAllChats()">${texts.selectAll}</button>
                <button class="btn-small" onclick="unselectAllChats()">${texts.unselectAll}</button>
            </div>
            <p class="selected-count">
                ${texts.selectedForCleaning} <b>${selectedCount}</b>
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

// Выбрать все чаты
function selectAllChats() {
    analyzedResults.forEach(result => {
        result.selected = true;
    });
    showResults();
    updateCleanButton();
}

// Снять выделение со всех чатов
function unselectAllChats() {
    analyzedResults.forEach(result => {
        result.selected = false;
    });
    showResults();
    updateCleanButton();
}

// Переключение выбора
function toggleSelection(index) {
    if (analyzedResults[index]) {
        analyzedResults[index].selected = !analyzedResults[index].selected;
        updateCleanButton();
    }
}

// Обновить кнопку очистки
function updateCleanButton() {
    const selectedCount = analyzedResults.filter(r => r.selected).length;
    const cleanBtn = document.getElementById('cleanBtn');
    const texts = TEXTS[currentLang];
    
    if (selectedCount > 0) {
        cleanBtn.disabled = false;
        cleanBtn.innerHTML = `<i class="fas fa-broom"></i> ${texts.cleanSelected} (${selectedCount})`;
    } else {
        cleanBtn.disabled = true;
        cleanBtn.innerHTML = `<i class="fas fa-broom"></i> ${texts.cleanSelected}`;
    }
}

// Очистка выбранного
function cleanSelected() {
    const selected = analyzedResults.filter(r => r.selected);
    
    if (selected.length === 0) {
        showAlert(TEXTS[currentLang].noChatsSelected);
        return;
    }
    
    // Обновляем статистику
    let currentAnalyzed = parseInt(localStorage.getItem(`${currentUser}_analyzed`) || 0);
    let currentChannels = parseInt(localStorage.getItem(`${currentUser}_cleaned_channels`) || 0);
    let currentGroups = parseInt(localStorage.getItem(`${currentUser}_cleaned_groups`) || 0);
    let currentBots = parseInt(localStorage.getItem(`${currentUser}_cleaned_bots`) || 0);
    
    // Считаем по типам
    const channelsCleaned = selected.filter(r => r.type === 'channel').length;
    const groupsCleaned = selected.filter(r => r.type === 'group').length;
    const botsCleaned = selected.filter(r => r.type === 'bot').length;
    
    localStorage.setItem(`${currentUser}_analyzed`, currentAnalyzed + analyzedResults.length);
    localStorage.setItem(`${currentUser}_cleaned_channels`, currentChannels + channelsCleaned);
    localStorage.setItem(`${currentUser}_cleaned_groups`, currentGroups + groupsCleaned);
    localStorage.setItem(`${currentUser}_cleaned_bots`, currentBots + botsCleaned);
    
    // Показываем уведомление
    const message = currentLang === 'ru' 
        ? `✅ Успешно очищено ${selected.length} чатов!\n\n📊 Статистика:\n• Каналов: ${channelsCleaned}\n• Групп: ${groupsCleaned}\n• Ботов: ${botsCleaned}\n\nВаша лента теперь чище! 🎉`
        : `✅ Successfully cleaned ${selected.length} chats!\n\n📊 Statistics:\n• Channels: ${channelsCleaned}\n• Groups: ${groupsCleaned}\n• Bots: ${botsCleaned}\n\nYour feed is now cleaner! 🎉`;
    
    showAlert(message);
    
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

// Вспомогательная функция задержки
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    console.log('Документ загружен');
    
    // Инициализируем Telegram Web App
    initTelegramWebApp();
    
    // Загружаем данные пользователя
    loadUser();
    
    // Добавляем обработчики
    document.getElementById('channelsCard').addEventListener('click', () => selectType('channels'));
    document.getElementById('groupsCard').addEventListener('click', () => selectType('groups'));
    document.getElementById('botsCard').addEventListener('click', () => selectType('bots'));
    
    console.log('Инициализация завершена');
});
