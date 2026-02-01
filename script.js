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
        duplicate: "Дубликат",
        spam: "Спам",
        activeDesc: "✅ Активный, можно оставить",
        inactiveDesc: "⏰ Неактивный более 1 месяца",
        deadDesc: "💀 Неактивный более 6 месяцев",
        toxicDesc: "☢️ Токсичный контент",
        duplicateDesc: "📋 Дублирует другие каналы",
        spamDesc: "📧 Спам и реклама",
        subscribe: "Подписаться",
        summaryTitle: "Итоги анализа:",
        activeCount: "Активные:",
        inactiveCount: "Неактивные:",
        deadCount: "Мертвые:",
        toxicCount: "Токсичные:",
        duplicateCount: "Дубликаты:",
        spamCount: "Спам:",
        selectedForCleaning: "Выбрано для очистки:",
        analyzing: "Анализируем...",
        processed: "Обработано:",
        selectAllBad: "Выбрать плохие",
        unselectAll: "Снять выделение",
        totalFound: "Всего найдено:",
        recommendations: "Рекомендации",
        selectChannels: "Выбрать все каналы для анализа",
        selectGroups: "Выбрать все группы для анализа",
        selectBots: "Выбрать всех ботов для анализа"
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
        duplicate: "Duplicate",
        spam: "Spam",
        activeDesc: "✅ Active, can keep",
        inactiveDesc: "⏰ Inactive for more than 1 month",
        deadDesc: "💀 Inactive for more than 6 months",
        toxicDesc: "☢️ Toxic content",
        duplicateDesc: "📋 Duplicates other channels",
        spamDesc: "📧 Spam and advertising",
        subscribe: "Subscribe",
        summaryTitle: "Analysis summary:",
        activeCount: "Active:",
        inactiveCount: "Inactive:",
        deadCount: "Dead:",
        toxicCount: "Toxic:",
        duplicateCount: "Duplicates:",
        spamCount: "Spam:",
        selectedForCleaning: "Selected for cleaning:",
        analyzing: "Analyzing...",
        processed: "Processed:",
        selectAllBad: "Select bad ones",
        unselectAll: "Unselect all",
        totalFound: "Total found:",
        recommendations: "Recommendations",
        selectChannels: "Select all channels for analysis",
        selectGroups: "Select all groups for analysis",
        selectBots: "Select all bots for analysis"
    }
};

// Реалистичные названия для симуляции
const REAL_NAMES = {
    ru: {
        channels: [
            "Крипто Новости", "IT Pro", "Мемы дня", "Наука и Техника", "Бизнес Аналитика",
            "Финансы", "Здоровье", "Спорт LIVE", "Кино и Сериалы", "Музыка",
            "Путешествия", "Еда и Рецепты", "Автоновости", "Недвижимость", "Образование",
            "Психология", "Мода и Стиль", "Красота", "Игры", "Политика",
            "Экономика", "История", "Искусство", "Фотография", "Дизайн"
        ],
        groups: [
            "Работа команды", "Семья", "Друзья школы", "Университет 2023", "Коллеги офиса",
            "Фитнес клуб", "Книжный клуб", "Игровое сообщество", "Трейдеры", "Программисты",
            "Дизайнеры", "Маркетологи", "Стартапы", "Инвесторы", "Путешественники",
            "Фотографы", "Музыканты", "Художники", "Писатели", "Блогеры"
        ],
        bots: [
            "WeatherBot", "NewsBot", "TranslateBot", "GameBot", "MusicBot",
            "SearchBot", "ConverterBot", "ReminderBot", "PollBot", "QuizBot",
            "ShopBot", "BookingBot", "CryptoBot", "StockBot", "AssistantBot",
            "DictionaryBot", "JokeBot", "QuoteBot", "MovieBot", "RecipeBot"
        ]
    },
    en: {
        channels: [
            "Crypto News", "IT Pro", "Memes Daily", "Science & Tech", "Business Analytics",
            "Finance", "Health", "Sports LIVE", "Movies & Series", "Music",
            "Travel", "Food & Recipes", "Auto News", "Real Estate", "Education",
            "Psychology", "Fashion & Style", "Beauty", "Games", "Politics",
            "Economics", "History", "Art", "Photography", "Design"
        ],
        groups: [
            "Work Team", "Family", "School Friends", "University 2023", "Office Colleagues",
            "Fitness Club", "Book Club", "Gaming Community", "Traders", "Programmers",
            "Designers", "Marketers", "Startups", "Investors", "Travelers",
            "Photographers", "Musicians", "Artists", "Writers", "Bloggers"
        ],
        bots: [
            "WeatherBot", "NewsBot", "TranslateBot", "GameBot", "MusicBot",
            "SearchBot", "ConverterBot", "ReminderBot", "PollBot", "QuizBot",
            "ShopBot", "BookingBot", "CryptoBot", "StockBot", "AssistantBot",
            "DictionaryBot", "JokeBot", "QuoteBot", "MovieBot", "RecipeBot"
        ]
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
        const buttonText = currentType === 'channels' ? texts.selectChannels :
                          currentType === 'groups' ? texts.selectGroups :
                          texts.selectBots;
        startBtn.innerHTML = `<i class="fas fa-play"></i> ${buttonText}`;
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
        const buttonText = type === 'channels' ? TEXTS[currentLang].selectChannels :
                          type === 'groups' ? TEXTS[currentLang].selectGroups :
                          TEXTS[currentLang].selectBots;
        startBtn.innerHTML = `<i class="fas fa-play"></i> ${buttonText}`;
    }
    
    // Обновляем текст в заголовке анализа
    document.getElementById('currentTypeText').textContent = TEXTS[currentLang][type + 'Title'].toLowerCase();
}

// Запрос ВСЕХ чатов у Telegram БЕЗ ОГРАНИЧЕНИЙ
function requestChats() {
    if (!currentType) {
        showAlert(TEXTS[currentLang].selectTypeFirst);
        return;
    }
    
    console.log('Запрашиваем ВСЕ чаты типа:', currentType);
    
    // Используем системный селектор Telegram для ВЫБОРА ВСЕХ
    if (tg && tg.requestChat) {
        const chatTypes = {
            'channels': ['channel'],
            'groups': ['group'],
            'bots': ['bot']
        };
        
        tg.requestChat({
            chat_types: chatTypes[currentType] || ['channel'],
            allow_multiselect: true,
            title: TEXTS[currentLang][currentType + 'Title'],
            // Без ограничений на количество
            max_count: 0 // 0 = без ограничений
        }, (chat) => {
            console.log('Получены чаты:', chat);
            handleSelectedChats(chat);
        });
    } else {
        // Симуляция для тестирования - БОЛЬШЕ чатов (50-200)
        console.log('Telegram Web App не доступен, используем симуляцию МНОГИХ чатов');
        simulateChatSelection();
    }
}

// Симуляция выбора БОЛЬШОГО количества чатов (без ограничений)
function simulateChatSelection() {
    console.log('Симуляция выбора МНОГИХ чатов для типа:', currentType);
    
    // Генерируем случайное количество чатов от 50 до 200
    const minChats = 50;
    const maxChats = 200;
    const chatCount = Math.floor(Math.random() * (maxChats - minChats + 1)) + minChats;
    
    const names = REAL_NAMES[currentLang][currentType] || REAL_NAMES['ru'][currentType];
    const simulatedChats = [];
    
    // Создаем уникальные чаты с реальными названиями
    for (let i = 1; i <= chatCount; i++) {
        const nameIndex = (i - 1) % names.length;
        const name = names[nameIndex];
        const suffix = Math.floor((i - 1) / names.length) + 1;
        const chatName = suffix > 1 ? `${name} ${suffix}` : name;
        
        simulatedChats.push({
            id: `chat_${currentType}_${i}_${Date.now()}`,
            title: chatName,
            username: `${currentType}_${name.toLowerCase().replace(/\s+/g, '_')}_${i}`,
            type: currentType.slice(0, -1) // убираем 's' в конце
        });
    }
    
    console.log(`Симулировано ${chatCount} чатов:`, simulatedChats);
    handleSelectedChats(simulatedChats);
}

// Обработка ВСЕХ выбранных чатов
async function handleSelectedChats(chatData) {
    console.log('Начинаем обработку ВСЕХ чатов:', chatData);
    
    // Преобразуем данные в массив
    selectedChats = Array.isArray(chatData) ? chatData : [chatData];
    
    if (selectedChats.length === 0) {
        showAlert(TEXTS[currentLang].noChatsSelected);
        return;
    }
    
    console.log(`Всего чатов для анализа: ${selectedChats.length}`);
    
    // Показываем экран анализа
    document.getElementById('mainScreen').style.display = 'none';
    document.getElementById('analysisScreen').style.display = 'block';
    
    // Обновляем заголовок с количеством
    document.getElementById('analysisTitle').textContent = 
        `${TEXTS[currentLang].analysisTitle} ${TEXTS[currentLang][currentType + 'Title'].toLowerCase()} (${selectedChats.length})`;
    
    // Показываем прогресс
    updateProgress(0);
    
    // Анализируем каждый чат
    analyzedResults = [];
    
    // Используем пакетную обработку для производительности
    const batchSize = 10;
    
    for (let i = 0; i < selectedChats.length; i += batchSize) {
        const batch = selectedChats.slice(i, i + batchSize);
        const batchPromises = batch.map((chat, index) => analyzeChat(chat, i + index));
        const batchResults = await Promise.all(batchPromises);
        analyzedResults.push(...batchResults);
        
        // Обновляем прогресс
        const progress = ((i + batchSize) / selectedChats.length) * 100;
        updateProgress(Math.min(progress, 100));
        
        // Показываем промежуточные результаты каждые 50 чатов
        if (i % 50 === 0 || i + batchSize >= selectedChats.length) {
            showPartialResults();
        }
    }
    
    // Показываем финальные результаты
    showResults();
    updateProgress(100);
    
    // Автоматически выбираем плохие чаты
    selectAllBadChats();
    
    showAlert(`${TEXTS[currentLang].analysisComplete}! ${TEXTS[currentLang].totalFound}: ${selectedChats.length}`);
}

// Анализ чата с реальными названиями
async function analyzeChat(chat, index) {
    // Задержка для имитации анализа
    await sleep(10 + Math.random() * 30); // Быстрее для большого количества
    
    // Используем реальное название из данных чата
    const chatTitle = chat.title || `${TEXTS[currentLang][currentType + 'Title']} ${index + 1}`;
    
    // Генерируем более реалистичный анализ
    const rand = Math.random();
    let status, icon, description;
    
    if (rand < 0.3) { // 30% активные
        status = 'active';
        icon = 'fa-check-circle';
        description = TEXTS[currentLang].activeDesc;
    } else if (rand < 0.5) { // 20% неактивные
        status = 'inactive';
        icon = 'fa-clock';
        description = TEXTS[currentLang].inactiveDesc;
    } else if (rand < 0.65) { // 15% мертвые
        status = 'dead';
        icon = 'fa-skull-crossbones';
        description = TEXTS[currentLang].deadDesc;
    } else if (rand < 0.8) { // 15% токсичные
        status = 'toxic';
        icon = 'fa-radiation';
        description = TEXTS[currentLang].toxicDesc;
    } else if (rand < 0.9) { // 10% дубликаты
        status = 'duplicate';
        icon = 'fa-copy';
        description = TEXTS[currentLang].duplicateDesc;
    } else { // 10% спам
        status = 'spam';
        icon = 'fa-envelope';
        description = TEXTS[currentLang].spamDesc;
    }
    
    return {
        id: chat.id || `chat_${Date.now()}_${Math.random()}`,
        title: chatTitle,
        username: chat.username || chatTitle.toLowerCase().replace(/\s+/g, '_'),
        type: chat.type || currentType.slice(0, -1),
        status: status,
        icon: icon,
        description: description,
        selected: false // Не выбираем по умолчанию
    };
}

// Обновление прогресс-бара
function updateProgress(percent) {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    if (progressBar && progressText) {
        progressBar.style.width = `${percent}%`;
        progressText.textContent = `${Math.round(percent)}%`;
        
        // Анимация цвета
        if (percent < 30) {
            progressBar.style.background = 'linear-gradient(90deg, #ef4444, #f59e0b)';
        } else if (percent < 70) {
            progressBar.style.background = 'linear-gradient(90deg, #f59e0b, #3b82f6)';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, #3b82f6, #10b981)';
        }
    }
}

// Показ промежуточных результатов
function showPartialResults() {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    
    const recentResults = analyzedResults.slice(-10);
    
    container.innerHTML = `
        <div class="summary">
            <h3>${TEXTS[currentLang].analyzing}</h3>
            <p>${TEXTS[currentLang].processed} ${analyzedResults.length}/${selectedChats.length}</p>
            <div class="progress-info">
                <div class="progress-bar-small">
                    <div class="progress-fill" style="width: ${(analyzedResults.length / selectedChats.length) * 100}%"></div>
                </div>
            </div>
        </div>
        <div class="results-list">
            ${recentResults.map((result, index) => `
                <div class="result-item ${result.status}">
                    <i class="fas ${result.icon}"></i>
                    <div class="result-info">
                        <div class="result-title">${result.title}</div>
                        <div class="result-desc">${result.description}</div>
                        <div class="result-username">@${result.username}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Показ окончательных результатов
function showResults() {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    
    // Группируем по статусу
    const stats = {
        active: analyzedResults.filter(r => r.status === 'active').length,
        inactive: analyzedResults.filter(r => r.status === 'inactive').length,
        dead: analyzedResults.filter(r => r.status === 'dead').length,
        toxic: analyzedResults.filter(r => r.status === 'toxic').length,
        duplicate: analyzedResults.filter(r => r.status === 'duplicate').length,
        spam: analyzedResults.filter(r => r.status === 'spam').length
    };
    
    const selectedCount = analyzedResults.filter(r => r.selected).length;
    const badChats = analyzedResults.filter(r => 
        r.status === 'dead' || r.status === 'toxic' || 
        r.status === 'duplicate' || r.status === 'spam' || 
        r.status === 'inactive'
    ).length;
    
    const texts = TEXTS[currentLang];
    
    container.innerHTML = `
        <div class="summary">
            <h3>${texts.summaryTitle} (${texts.totalFound} ${analyzedResults.length})</h3>
            <div class="summary-stats-grid">
                <div class="summary-item active">
                    <i class="fas fa-check-circle"></i>
                    <span>${texts.activeCount} <b>${stats.active}</b></span>
                </div>
                <div class="summary-item inactive">
                    <i class="fas fa-clock"></i>
                    <span>${texts.inactiveCount} <b>${stats.inactive}</b></span>
                </div>
                <div class="summary-item dead">
                    <i class="fas fa-skull-crossbones"></i>
                    <span>${texts.deadCount} <b>${stats.dead}</b></span>
                </div>
                <div class="summary-item toxic">
                    <i class="fas fa-radiation"></i>
                    <span>${texts.toxicCount} <b>${stats.toxic}</b></span>
                </div>
                <div class="summary-item duplicate">
                    <i class="fas fa-copy"></i>
                    <span>${texts.duplicateCount} <b>${stats.duplicate}</b></span>
                </div>
                <div class="summary-item spam">
                    <i class="fas fa-envelope"></i>
                    <span>${texts.spamCount} <b>${stats.spam}</b></span>
                </div>
            </div>
            <div class="selection-controls">
                <button class="btn-small btn-danger" onclick="selectAllBadChats()">
                    <i class="fas fa-filter"></i> ${texts.selectAllBad} (${badChats})
                </button>
                <button class="btn-small" onclick="unselectAllChats()">
                    <i class="fas fa-times"></i> ${texts.unselectAll}
                </button>
            </div>
            <div class="selected-info">
                <p class="selected-count">
                    ${texts.selectedForCleaning} <b>${selectedCount}</b>
                </p>
                <p class="recommendation">
                    <i class="fas fa-lightbulb"></i> ${texts.recommendations}: Рекомендуется очистить плохие чаты (${badChats})
                </p>
            </div>
        </div>
        <div class="results-list-container">
            <div class="results-header">
                <h4>${analyzedResults.length} ${texts[currentType + 'Title'].toLowerCase()}</h4>
                <div class="sort-controls">
                    <select id="sortSelect" onchange="sortResults()">
                        <option value="status">Сортировать по статусу</option>
                        <option value="name">Сортировать по названию</option>
                    </select>
                </div>
            </div>
            <div class="results-list" id="resultsList">
                ${analyzedResults.map((result, index) => `
                    <div class="result-item ${result.status}">
                        <i class="fas ${result.icon}"></i>
                        <div class="result-info">
                            <div class="result-title">
                                <span class="chat-name">${result.title}</span>
                                <span class="chat-type-badge">${result.type === 'channel' ? '📢' : result.type === 'group' ? '👥' : '🤖'} ${texts[result.type + 'sTitle']}</span>
                            </div>
                            <div class="result-username">@${result.username}</div>
                            <div class="result-desc">${result.description}</div>
                        </div>
                        <input type="checkbox" class="result-checkbox" 
                               onchange="toggleSelection(${index})"
                               ${result.selected ? 'checked' : ''}>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Выбрать только плохие чаты
function selectAllBadChats() {
    analyzedResults.forEach(result => {
        // Выбираем только плохие: мертвые, токсичные, дубликаты, спам, неактивные
        result.selected = (result.status === 'dead' || result.status === 'toxic' || 
                          result.status === 'duplicate' || result.status === 'spam' || 
                          result.status === 'inactive');
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

// Сортировка результатов
function sortResults() {
    const sortBy = document.getElementById('sortSelect').value;
    
    if (sortBy === 'name') {
        analyzedResults.sort((a, b) => a.title.localeCompare(b.title));
    } else {
        // Сортировка по статусу: плохие вверху
        const statusOrder = { 'dead': 1, 'toxic': 2, 'spam': 3, 'duplicate': 4, 'inactive': 5, 'active': 6 };
        analyzedResults.sort((a, b) => (statusOrder[a.status] || 7) - (statusOrder[b.status] || 7));
    }
    
    showResults();
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
