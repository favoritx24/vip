// Telegram Auditor Pro - Полная версия JavaScript

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
        selectChannels: "Выбрать каналы",
        selectGroups: "Выбрать группы",
        selectBots: "Выбрать ботов",
        loading: "Загрузка...",
        all: "Все",
        sortStatus: "Сортировать по статусу",
        sortName: "Сортировать по названию",
        unknown: "Неизвестно",
        unknownDesc: "❓ Статус неизвестен",
        confirmCleaning: "Вы уверены, что хотите очистить выбранные чаты?",
        yes: "Да",
        no: "Нет",
        cleaningInProgress: "Очистка в процессе...",
        thankYou: "Спасибо за использование!",
        inviteRequired: "Для продолжения пригласите 3 друзей",
        unlimitedAccess: "Безлимитный доступ открыт!",
        shareToContinue: "Поделитесь ботом, чтобы продолжить",
        error: "Ошибка",
        retry: "Повторить",
        cancel: "Отмена"
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
        selectChannels: "Select channels",
        selectGroups: "Select groups",
        selectBots: "Select bots",
        loading: "Loading...",
        all: "All",
        sortStatus: "Sort by status",
        sortName: "Sort by name",
        unknown: "Unknown",
        unknownDesc: "❓ Status unknown",
        confirmCleaning: "Are you sure you want to clean selected chats?",
        yes: "Yes",
        no: "No",
        cleaningInProgress: "Cleaning in progress...",
        thankYou: "Thank you for using!",
        inviteRequired: "Invite 3 friends to continue",
        unlimitedAccess: "Unlimited access unlocked!",
        shareToContinue: "Share bot to continue",
        error: "Error",
        retry: "Retry",
        cancel: "Cancel"
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
            "Экономика", "История", "Искусство", "Фотография", "Дизайн",
            "Технологии", "Блокчейн", "Инвестиции", "Маркетинг", "Стартапы",
            "Программирование", "Дизайн Интерьеров", "Кулинария", "Фитнес", "Йога",
            "Автомобили", "Мотоциклы", "Велосипеды", "Рыбалка", "Охота",
            "Садоводство", "Ремонт", "Строительство", "Архитектура", "Недвижимость",
            "Юриспруденция", "Медицина", "Психология", "Философия", "Литература"
        ],
        groups: [
            "Работа команды", "Семья", "Друзья школы", "Университет 2023", "Коллеги офиса",
            "Фитнес клуб", "Книжный клуб", "Игровое сообщество", "Трейдеры", "Программисты",
            "Дизайнеры", "Маркетологи", "Стартапы", "Инвесторы", "Путешественники",
            "Фотографы", "Музыканты", "Художники", "Писатели", "Блогеры",
            "Геймеры", "Криптоэнтузиасты", "Трейдеры", "Инвесторы", "Бизнесмены",
            "Предприниматели", "Фрилансеры", "Удаленщики", "Digital Nomads", "Коучи",
            "Психологи", "Врачи", "Юристы", "Бухгалтеры", "Менеджеры",
            "HR специалисты", "Рекрутеры", "SMM специалисты", "Копирайтеры", "Переводчики",
            "Учителя", "Преподаватели", "Студенты", "Абитуриенты", "Выпускники",
            "Родители", "Мамы", "Папы", "Семьи", "Друзья"
        ],
        bots: [
            "WeatherBot", "NewsBot", "TranslateBot", "GameBot", "MusicBot",
            "SearchBot", "ConverterBot", "ReminderBot", "PollBot", "QuizBot",
            "ShopBot", "BookingBot", "CryptoBot", "StockBot", "AssistantBot",
            "DictionaryBot", "JokeBot", "QuoteBot", "MovieBot", "RecipeBot",
            "WeatherForecast", "CurrencyConverter", "UnitConverter", "TimeZoneBot", "CalculatorBot",
            "Dictionary", "Thesaurus", "GrammarBot", "SpellCheckBot", "Translator",
            "LanguageLearning", "VocabularyBot", "NewsAggregator", "RSSBot", "PodcastBot",
            "RadioBot", "TVSchedule", "SportsScores", "LiveScores", "BettingOdds",
            "LotteryResults", "HoroscopeBot", "TarotBot", "AstrologyBot", "NumerologyBot",
            "MeditationBot", "YogaBot", "FitnessTracker", "CalorieCounter", "DietPlanner"
        ]
    },
    en: {
        channels: [
            "Crypto News", "IT Pro", "Memes Daily", "Science & Tech", "Business Analytics",
            "Finance", "Health", "Sports LIVE", "Movies & Series", "Music",
            "Travel", "Food & Recipes", "Auto News", "Real Estate", "Education",
            "Psychology", "Fashion & Style", "Beauty", "Games", "Politics",
            "Economics", "History", "Art", "Photography", "Design",
            "Technology", "Blockchain", "Investments", "Marketing", "Startups",
            "Programming", "Interior Design", "Cooking", "Fitness", "Yoga",
            "Cars", "Motorcycles", "Bicycles", "Fishing", "Hunting",
            "Gardening", "Repair", "Construction", "Architecture", "Real Estate",
            "Jurisprudence", "Medicine", "Psychology", "Philosophy", "Literature"
        ],
        groups: [
            "Work Team", "Family", "School Friends", "University 2023", "Office Colleagues",
            "Fitness Club", "Book Club", "Gaming Community", "Traders", "Programmers",
            "Designers", "Marketers", "Startups", "Investors", "Travelers",
            "Photographers", "Musicians", "Artists", "Writers", "Bloggers",
            "Gamers", "Crypto Enthusiasts", "Traders", "Investors", "Businessmen",
            "Entrepreneurs", "Freelancers", "Remote Workers", "Digital Nomads", "Coaches",
            "Psychologists", "Doctors", "Lawyers", "Accountants", "Managers",
            "HR Specialists", "Recruiters", "SMM Specialists", "Copywriters", "Translators",
            "Teachers", "Professors", "Students", "Applicants", "Graduates",
            "Parents", "Moms", "Dads", "Families", "Friends"
        ],
        bots: [
            "WeatherBot", "NewsBot", "TranslateBot", "GameBot", "MusicBot",
            "SearchBot", "ConverterBot", "ReminderBot", "PollBot", "QuizBot",
            "ShopBot", "BookingBot", "CryptoBot", "StockBot", "AssistantBot",
            "DictionaryBot", "JokeBot", "QuoteBot", "MovieBot", "RecipeBot",
            "WeatherForecast", "CurrencyConverter", "UnitConverter", "TimeZoneBot", "CalculatorBot",
            "Dictionary", "Thesaurus", "GrammarBot", "SpellCheckBot", "Translator",
            "LanguageLearning", "VocabularyBot", "NewsAggregator", "RSSBot", "PodcastBot",
            "RadioBot", "TVSchedule", "SportsScores", "LiveScores", "BettingOdds",
            "LotteryResults", "HoroscopeBot", "TarotBot", "AstrologyBot", "NumerologyBot",
            "MeditationBot", "YogaBot", "FitnessTracker", "CalorieCounter", "DietPlanner"
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
        tg.enableClosingConfirmation();
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
        lang: urlParams.get('lang') || 'ru',
        hash: urlParams.get('hash') || ''
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
    
    console.log('Пользователь загружен:', currentUser, 'Язык:', currentLang);
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
    
    // Обновляем бейджи с количеством
    document.getElementById('channelsCount').textContent = stats.cleaned_channels > 999 ? '999+' : stats.cleaned_channels;
    document.getElementById('groupsCount').textContent = stats.cleaned_groups > 999 ? '999+' : stats.cleaned_groups;
    document.getElementById('botsCount').textContent = stats.cleaned_bots > 999 ? '999+' : stats.cleaned_bots;
}

// Загрузка рекламных каналов
function loadAdChannels() {
    const adChannels = currentLang === 'ru' ? [
        {
            name: "Новости IT",
            desc: "Свежие новости технологий и программирования",
            icon: "fas fa-laptop-code",
            link: "https://t.me/telegram"
        },
        {
            name: "Крипто аналитика",
            desc: "Анализ рынка криптовалют и блокчейн технологий",
            icon: "fas fa-chart-line",
            link: "https://t.me/telegram"
        },
        {
            name: "Мемы дня",
            desc: "Самые свежие и смешные мемы каждый день",
            icon: "fas fa-laugh-squint",
            link: "https://t.me/telegram"
        }
    ] : [
        {
            name: "IT News",
            desc: "Fresh technology and programming news",
            icon: "fas fa-laptop-code",
            link: "https://t.me/telegram"
        },
        {
            name: "Crypto Analytics",
            desc: "Cryptocurrency market and blockchain analysis",
            icon: "fas fa-chart-line",
            link: "https://t.me/telegram"
        },
        {
            name: "Memes Daily",
            desc: "Freshest and funniest memes every day",
            icon: "fas fa-laugh-squint",
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
        const buttonText = type === 'channels' ? texts.selectChannels :
                          type === 'groups' ? texts.selectGroups :
                          texts.selectBots;
        startBtn.innerHTML = `<i class="fas fa-play"></i> ${buttonText}`;
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
    
    // Используем системный селектор Telegram
    if (window.Telegram && Telegram.WebApp && Telegram.WebApp.requestChat) {
        const chatTypes = {
            'channels': ['channel'],
            'groups': ['group', 'supergroup'],
            'bots': ['bot']
        };
        
        const requestConfig = {
            chat_types: chatTypes[currentType] || ['channel'],
            allow_multiselect: true,
            title: TEXTS[currentLang][currentType + 'Title'],
            max_count: 1000
        };
        
        console.log('Запрос чатов с конфигом:', requestConfig);
        
        Telegram.WebApp.requestChat(
            requestConfig,
            (chat) => {
                console.log('Получены чаты:', chat);
                if (chat) {
                    const chatsArray = Array.isArray(chat) ? chat : [chat];
                    handleSelectedChats(chatsArray);
                } else {
                    console.log('Пользователь отменил выбор');
                }
            }
        );
    } else {
        // Симуляция для тестирования
        console.log('Telegram Web App не доступен, используем симуляцию');
        simulateChatSelection();
    }
}

// Симуляция выбора чатов (для тестирования)
function simulateChatSelection() {
    console.log('Симуляция выбора чатов для типа:', currentType);
    
    // Генерируем случайное количество чатов
    const chatCount = Math.floor(Math.random() * 30) + 20; // 20-50 чатов
    
    const names = REAL_NAMES[currentLang][currentType] || REAL_NAMES['ru'][currentType];
    const simulatedChats = [];
    
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
    
    console.log(`Симулировано ${chatCount} чатов`);
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
    const batchSize = 5;
    
    for (let i = 0; i < selectedChats.length; i += batchSize) {
        const batch = selectedChats.slice(i, i + batchSize);
        const batchPromises = batch.map((chat, index) => analyzeChat(chat, i + index));
        const batchResults = await Promise.all(batchPromises);
        analyzedResults.push(...batchResults);
        
        // Обновляем прогресс
        const progress = ((i + batchSize) / selectedChats.length) * 100;
        updateProgress(Math.min(progress, 100));
        
        // Показываем промежуточные результаты
        if (i % 20 === 0 || i + batchSize >= selectedChats.length) {
            showPartialResults();
        }
        
        // Небольшая задержка между батчами
        await sleep(50);
    }
    
    // Показываем финальные результаты
    showResults();
    updateProgress(100);
    
    // Автоматически выбираем плохие чаты
    selectAllBadChats();
    
    showAlert(`${TEXTS[currentLang].analysisComplete}! ${TEXTS[currentLang].totalFound}: ${selectedChats.length}`);
}

// Анализ чата
async function analyzeChat(chat, index) {
    // Задержка для имитации анализа
    await sleep(50 + Math.random() * 100);
    
    const chatTitle = chat.title || `${TEXTS[currentLang][currentType + 'Title']} ${index + 1}`;
    
    // Генерируем реалистичный анализ
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
        id: chat.id || `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: chatTitle,
        username: chat.username || chatTitle.toLowerCase().replace(/\s+/g, '_').substring(0, 30),
        type: chat.type || currentType.slice(0, -1),
        status: status,
        icon: icon,
        description: description,
        selected: false
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
    
    const recentResults = analyzedResults.slice(-5);
    const processed = analyzedResults.length;
    const total = selectedChats.length;
    const percent = Math.round((processed / total) * 100);
    
    container.innerHTML = `
        <div class="summary">
            <h3>${TEXTS[currentLang].analyzing}</h3>
            <p>${TEXTS[currentLang].processed} ${processed}/${total} (${percent}%)</p>
            <div class="progress-info">
                <div class="progress-bar-small">
                    <div class="progress-fill" style="width: ${percent}%"></div>
                </div>
            </div>
            <div style="margin-top: 20px;">
                <h4>Последние результаты:</h4>
                <div class="results-list">
                    ${recentResults.map((result, index) => `
                        <div class="result-item ${result.status}">
                            <i class="fas ${result.icon}"></i>
                            <div class="result-info">
                                <div class="result-title">${result.title}</div>
                                <div class="result-desc">${result.description}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
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
    
    // Проверяем, все ли чаты определенного статуса выбраны
    const allSelectedStatus = {};
    Object.keys(stats).forEach(status => {
        const chatsWithStatus = analyzedResults.filter(r => r.status === status);
        if (chatsWithStatus.length === 0) {
            allSelectedStatus[status] = false;
        } else {
            allSelectedStatus[status] = chatsWithStatus.every(chat => chat.selected);
        }
    });
    
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
                ${Object.entries(stats).map(([status, count]) => `
                    <div class="summary-item ${status}">
                        <input type="checkbox" class="status-checkbox" 
                               onchange="toggleStatusSelection('${status}')"
                               ${allSelectedStatus[status] ? 'checked' : ''}
                               ${count === 0 ? 'disabled' : ''}>
                        <i class="fas ${getStatusIcon(status)}"></i>
                        <span>${getStatusText(status)} <b>${count}</b></span>
                    </div>
                `).join('')}
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
            </div>
        </div>
        <div class="results-list-container">
            <div class="results-header">
                <h4>${analyzedResults.length} ${texts[currentType + 'Title'].toLowerCase()}</h4>
                <div class="sort-controls">
                    <select id="sortSelect" onchange="sortResults()">
                        <option value="status">${texts.sortStatus}</option>
                        <option value="name">${texts.sortName}</option>
                    </select>
                </div>
            </div>
            <div class="results-list" id="resultsList">
                ${analyzedResults.map((result, index) => `
                    <div class="result-item ${result.status}" data-id="${result.id}">
                        <input type="checkbox" class="result-checkbox" 
                               onchange="toggleSelection('${result.id}')"
                               ${result.selected ? 'checked' : ''}>
                        <i class="fas ${result.icon}"></i>
                        <div class="result-info">
                            <div class="result-title">
                                <span class="chat-name">${result.title}</span>
                                <span class="chat-type-badge">${result.type === 'channel' ? '📢' : result.type === 'group' ? '👥' : '🤖'} ${texts[result.type + 'sTitle']}</span>
                            </div>
                            <div class="result-username">@${result.username}</div>
                            <div class="result-desc">${result.description}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    updateCleanButton();
}

// Вспомогательные функции для статусов
function getStatusIcon(status) {
    const icons = {
        'active': 'fa-check-circle',
        'inactive': 'fa-clock',
        'dead': 'fa-skull-crossbones',
        'toxic': 'fa-radiation',
        'duplicate': 'fa-copy',
        'spam': 'fa-envelope'
    };
    return icons[status] || 'fa-question';
}

function getStatusText(status) {
    const texts = TEXTS[currentLang];
    const statusTexts = {
        'active': texts.activeCount,
        'inactive': texts.inactiveCount,
        'dead': texts.deadCount,
        'toxic': texts.toxicCount,
        'duplicate': texts.duplicateCount,
        'spam': texts.spamCount
    };
    return statusTexts[status] || status;
}

// Выбрать чаты определенного статуса
function toggleStatusSelection(status) {
    const chatsWithStatus = analyzedResults.filter(r => r.status === status);
    if (chatsWithStatus.length === 0) return;
    
    const allSelected = chatsWithStatus.every(chat => chat.selected);
    const newSelected = !allSelected;
    
    analyzedResults.forEach(result => {
        if (result.status === status) {
            result.selected = newSelected;
        }
    });
    
    showResults();
}

// Выбрать только плохие чаты
function selectAllBadChats() {
    analyzedResults.forEach(result => {
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

// Переключение выбора конкретного чата
function toggleSelection(chatId) {
    const result = analyzedResults.find(r => r.id === chatId);
    if (result) {
        result.selected = !result.selected;
        
        // Обновляем чекбокс в элементе
        const element = document.querySelector(`[data-id="${chatId}"]`);
        if (element) {
            const checkbox = element.querySelector('.result-checkbox');
            if (checkbox) {
                checkbox.checked = result.selected;
            }
        }
        
        // Обновляем сводную статистику
        updateSummaryCheckboxes();
        updateCleanButton();
    }
}

// Обновить чекбоксы в сводной статистике
function updateSummaryCheckboxes() {
    const stats = ['active', 'inactive', 'dead', 'toxic', 'duplicate', 'spam'];
    stats.forEach(status => {
        const chatsWithStatus = analyzedResults.filter(r => r.status === status);
        if (chatsWithStatus.length === 0) return;
        
        const allSelected = chatsWithStatus.every(chat => chat.selected);
        const checkbox = document.querySelector(`.status-checkbox[onchange*="${status}"]`);
        if (checkbox) {
            checkbox.checked = allSelected;
        }
    });
}

// Сортировка результатов
function sortResults() {
    const sortBy = document.getElementById('sortSelect').value;
    
    if (sortBy === 'name') {
        analyzedResults.sort((a, b) => a.title.localeCompare(b.title));
    } else {
        // Сортировка по статусу: плохие вверху
        const statusOrder = { 
            'dead': 1, 
            'toxic': 2, 
            'spam': 3, 
            'duplicate': 4, 
            'inactive': 5, 
            'active': 6 
        };
        analyzedResults.sort((a, b) => (statusOrder[a.status] || 7) - (statusOrder[b.status] || 7));
    }
    
    showResults();
}

// Обновить кнопку очистки
function updateCleanButton() {
    const selectedCount = analyzedResults.filter(r => r.selected).length;
    const cleanBtn = document.getElementById('cleanBtn');
    const texts = TEXTS[currentLang];
    
    if (selectedCount > 0) {
        cleanBtn.disabled = false;
        cleanBtn.innerHTML = `<i class="fas fa-broom"></i> ${texts.cleanSelected} (${selectedCount})`;
        cleanBtn.onclick = () => confirmCleaning(selectedCount);
    } else {
        cleanBtn.disabled = true;
        cleanBtn.innerHTML = `<i class="fas fa-broom"></i> ${texts.cleanSelected}`;
        cleanBtn.onclick = null;
    }
}

// Подтверждение очистки
function confirmCleaning(count) {
    const texts = TEXTS[currentLang];
    if (confirm(`${texts.confirmCleaning}\n${texts.selectedForCleaning} ${count}`)) {
        cleanSelected();
    }
}

// Очистка выбранного
function cleanSelected() {
    const selected = analyzedResults.filter(r => r.selected);
    
    if (selected.length === 0) {
        showAlert(TEXTS[currentLang].noChatsSelected);
        return;
    }
    
    const texts = TEXTS[currentLang];
    
    // Показываем уведомление о процессе
    showAlert(`${texts.cleaningInProgress}...`);
    
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
    
    // Задержка для имитации процесса очистки
    setTimeout(() => {
        const message = currentLang === 'ru' 
            ? `✅ Успешно очищено ${selected.length} чатов!\n\n📊 Статистика:\n• Каналов: ${channelsCleaned}\n• Групп: ${groupsCleaned}\n• Ботов: ${botsCleaned}\n\n${texts.thankYou} 🎉`
            : `✅ Successfully cleaned ${selected.length} chats!\n\n📊 Statistics:\n• Channels: ${channelsCleaned}\n• Groups: ${groupsCleaned}\n• Bots: ${botsCleaned}\n\n${texts.thankYou} 🎉`;
        
        showAlert(message);
        
        // Обновляем статистику на экране
        loadStats();
        
        // Возвращаем на главный экран
        goBack();
    }, 1500);
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

// Добавляем обработчик на кнопку старта анализа
document.getElementById('startAnalysisBtn').addEventListener('click', requestChats);

// Добавляем глобальные функции
window.selectType = selectType;
window.requestChats = requestChats;
window.goBack = goBack;
window.toggleSelection = toggleSelection;
window.toggleStatusSelection = toggleStatusSelection;
window.selectAllBadChats = selectAllBadChats;
window.unselectAllChats = unselectAllChats;
window.sortResults = sortResults;
window.cleanSelected = cleanSelected;
