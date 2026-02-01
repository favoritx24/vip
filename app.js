// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();

// Глобальные переменные
let currentLanguage = 'ru';
let userId = null;
let selectedChannels = [];
let selectedGroups = [];
let selectedBots = [];

// Тексты для разных языков
const TEXTS = {
    ru: {
        loading: "Загрузка...",
        selectAllChannels: "Выбрать все каналы",
        selectAllGroups: "Выбрать все группы",
        selectAllBots: "Выбрать всех ботов",
        analysisComplete: "Анализ завершен!",
        channels: "Каналы",
        groups: "Группы",
        bots: "Боты",
        inactive: "Неактивный",
        toxic: "Токсичный",
        duplicate: "Дубликат",
        cleanSelected: "Очистить выбранное",
        saveReport: "Сохранить отчет",
        recommended: "Рекомендуемые каналы",
        safe: "Безопасно",
        fast: "Быстро",
        free: "Бесплатно"
    },
    en: {
        loading: "Loading...",
        selectAllChannels: "Select all channels",
        selectAllGroups: "Select all groups",
        selectAllBots: "Select all bots",
        analysisComplete: "Analysis complete!",
        channels: "Channels",
        groups: "Groups",
        bots: "Bots",
        inactive: "Inactive",
        toxic: "Toxic",
        duplicate: "Duplicate",
        cleanSelected: "Clean selected",
        saveReport: "Save report",
        recommended: "Recommended channels",
        safe: "Safe",
        fast: "Fast",
        free: "Free"
    }
};

// Инициализация приложения
async function initApp() {
    // Получаем параметры из URL
    const urlParams = new URLSearchParams(window.location.search);
    userId = urlParams.get('user_id') || tg.initDataUnsafe.user?.id;
    currentLanguage = urlParams.get('lang') || 'ru';
    
    // Инициализируем Telegram Web App
    tg.ready();
    tg.setHeaderColor('#0088cc');
    tg.setBackgroundColor('#f5f5f5');
    
    // Загружаем пользовательскую статистику
    await loadUserStats();
    
    // Загружаем рекомендации
    await loadRecommendations();
    
    // Показываем основной интерфейс
    document.getElementById('loading').style.display = 'none';
    document.getElementById('mainInterface').style.display = 'block';
    
    // Применяем язык
    applyLanguage();
    
    // Инициализируем обработчики событий
    initEventHandlers();
}

// Загрузка статистики пользователя
async function loadUserStats() {
    try {
        // В реальном приложении здесь был бы запрос к API
        const stats = {
            channels: 12,
            groups: 5,
            bots: 3
        };
        
        // Обновляем UI
        document.querySelectorAll('.stat-card h3')[0].textContent = stats.channels;
        document.querySelectorAll('.stat-card h3')[1].textContent = stats.groups;
        document.querySelectorAll('.stat-card h3')[2].textContent = stats.bots;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Загрузка рекомендаций
async function loadRecommendations() {
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';
    
    // Пример рекомендаций (в реальном приложении будут с сервера)
    const recommendations = currentLanguage === 'ru' ? [
        {
            title: "Крипто Альфа",
            description: "Лучшие сигналы и аналитика крипторынка",
            username: "crypto_alpha"
        },
        {
            title: "ИИ Новости",
            description: "Последние новости из мира искусственного интеллекта",
            username: "ai_news"
        },
        {
            title: "Технологии Будущего",
            description: "Инновации и технологии завтрашнего дня",
            username: "future_tech"
        }
    ] : [
        {
            title: "Crypto Alpha",
            description: "Best crypto signals and market analytics",
            username: "crypto_alpha_en"
        },
        {
            title: "AI News",
            description: "Latest news from the world of artificial intelligence",
            username: "ai_news_en"
        },
        {
            title: "Future Tech",
            description: "Innovations and technologies of tomorrow",
            username: "future_tech_en"
        }
    ];
    
    recommendations.forEach(rec => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        card.innerHTML = `
            <h3>${rec.title}</h3>
            <p>${rec.description}</p>
            <div class="recommendation-actions">
                <button class="subscribe-btn" data-username="${rec.username}">
                    <i class="fas fa-plus"></i> Подписаться
                </button>
            </div>
        `;
        recommendationsList.appendChild(card);
    });
}

// Применение языка
function applyLanguage() {
    const texts = TEXTS[currentLanguage];
    
    // Обновляем тексты
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (texts[key]) {
            element.textContent = texts[key];
        }
    });
    
    // Обновляем кнопки языков
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === currentLanguage) {
            btn.classList.add('active');
        }
    });
}

// Инициализация обработчиков событий
function initEventHandlers() {
    // Переключение языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentLanguage = btn.dataset.lang;
            applyLanguage();
            loadRecommendations();
        });
    });
    
    // Кнопки анализа
    document.querySelectorAll('.analysis-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            openChannelSelection(type);
        });
    });
    
    // Полный анализ
    document.getElementById('fullAnalysis').addEventListener('click', () => {
        openChannelSelection('all');
    });
    
    // Выбор всех каналов
    document.getElementById('selectAllChannels').addEventListener('click', async () => {
        await selectAllChannels();
    });
    
    // Выбор всех групп
    document.getElementById('selectAllGroups').addEventListener('click', async () => {
        await selectAllGroups();
    });
    
    // Выбор всех ботов
    document.getElementById('selectAllBots').addEventListener('click', async () => {
        await selectAllBots();
    });
    
    // Закрытие модального окна
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('channelModal').style.display = 'none';
    });
    
    // Кнопка очистки
    document.getElementById('cleanBtn').addEventListener('click', cleanSelected);
    
    // Кнопка сохранения
    document.getElementById('saveBtn').addEventListener('click', saveReport);
}

// Открытие выбора каналов
function openChannelSelection(type) {
    const modal = document.getElementById('channelModal');
    modal.style.display = 'flex';
    
    // В реальном приложении здесь будет вызов Telegram API
    // tg.showPopup({
    //     title: 'Выбор каналов',
    //     message: 'Выберите каналы для анализа',
    //     buttons: [
    //         {id: 'select_all', type: 'ok', text: 'Выбрать все'}
    //     ]
    // });
}

// Выбор всех каналов
async function selectAllChannels() {
    // Симуляция анализа
    simulateAnalysis('channel');
}

// Выбор всех групп
async function selectAllGroups() {
    simulateAnalysis('group');
}

// Выбор всех ботов
async function selectAllBots() {
    simulateAnalysis('bot');
}

// Симуляция анализа
async function simulateAnalysis(type) {
    const modal = document.getElementById('channelModal');
    modal.style.display = 'none';
    
    // Показываем индикатор загрузки
    tg.showPopup({
        title: 'Анализ',
        message: 'Идет анализ...',
    });
    
    // Имитация задержки
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Генерация тестовых результатов
    const results = generateTestResults(type);
    
    // Отображение результатов
    displayResults(results, type);
    
    tg.showPopup({
        title: 'Готово!',
        message: `Анализ завершен. Найдено: ${results.length} элементов`,
    });
}

// Генерация тестовых результатов
function generateTestResults(type) {
    const results = [];
    const count = Math.floor(Math.random() * 20) + 5;
    
    for (let i = 0; i < count; i++) {
        const status = Math.random() > 0.7 ? 'inactive' : 
                      Math.random() > 0.8 ? 'toxic' : 
                      Math.random() > 0.9 ? 'duplicate' : 'normal';
        
        results.push({
            id: i + 1,
            name: `${type === 'channel' ? 'Канал' : type === 'group' ? 'Группа' : 'Бот'} ${i + 1}`,
            status: status,
            lastActivity: Math.floor(Math.random() * 365) + 1,
            members: Math.floor(Math.random() * 10000)
        });
    }
    
    return results;
}

// Отображение результатов
function displayResults(results, type) {
    const resultsSection = document.getElementById('resultsSection');
    const resultsGrid = document.getElementById('resultsGrid');
    
    resultsSection.style.display = 'block';
    resultsGrid.innerHTML = '';
    
    results.forEach(result => {
        const item = document.createElement('div');
        item.className = `result-item ${result.status}`;
        item.innerHTML = `
            <div class="info">
                <i class="fas fa-${type === 'channel' ? 'hashtag' : type === 'group' ? 'users' : 'robot'}"></i>
                <div>
                    <h4>${result.name}</h4>
                    <small>${result.members.toLocaleString()} участников</small>
                </div>
            </div>
            <div class="actions">
                ${result.status !== 'normal' ? `<span class="badge ${result.status}">${TEXTS[currentLanguage][result.status]}</span>` : ''}
                <input type="checkbox" class="select-item" data-id="${result.id}">
            </div>
        `;
        resultsGrid.appendChild(item);
    });
    
    // Прокрутка к результатам
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Очистка выбранного
function cleanSelected() {
    const selectedItems = document.querySelectorAll('.select-item:checked');
    
    if (selectedItems.length === 0) {
        tg.showPopup({
            title: 'Внимание',
            message: 'Выберите элементы для очистки',
        });
        return;
    }
    
    tg.showPopup({
        title: 'Очистка',
        message: `Вы уверены, что хотите удалить ${selectedItems.length} элементов?`,
        buttons: [
            {id: 'yes', type: 'destructive', text: 'Удалить'},
            {id: 'no', type: 'cancel', text: 'Отмена'}
        ]
    }, (buttonId) => {
        if (buttonId === 'yes') {
            // Симуляция удаления
            selectedItems.forEach(item => {
                item.closest('.result-item').style.opacity = '0.5';
                item.disabled = true;
            });
            
            // Отправка данных в бот
            sendDataToBot({
                action: 'save_analysis',
                channels_cleaned: document.querySelectorAll('.result-item .fa-hashtag').length,
                groups_cleaned: document.querySelectorAll('.result-item .fa-users').length,
                bots_cleaned: document.querySelectorAll('.result-item .fa-robot').length
            });
            
            tg.showPopup({
                title: 'Успех!',
                message: `Удалено ${selectedItems.length} элементов`,
            });
        }
    });
}

// Сохранение отчета
function saveReport() {
    tg.showPopup({
        title: 'Отчет',
        message: 'Отчет сохранен в истории бота',
    });
}

// Отправка данных в бот
function sendDataToBot(data) {
    if (tg.sendData) {
        tg.sendData(JSON.stringify(data));
    }
    
    // Альтернативный метод через обратный вызов
    tg.close();
}

// Запуск приложения при загрузке
document.addEventListener('DOMContentLoaded', initApp);