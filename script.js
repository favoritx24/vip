// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
let currentUser = null;
let currentLang = 'ru';
let currentType = 'channels';
let selectedChats = [];
let analyzedResults = [];

// Инициализация
tg.expand();
tg.ready();

// Получаем параметры из URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('user_id');
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
        cleaned: "Очищено"
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
        cleaned: "Cleaned"
    }
};

// Обновляем тексты на странице
function updateTexts() {
    const texts = TEXTS[currentLang];
    document.querySelector('h1').textContent = texts.welcome;
    document.querySelector('.welcome-card h2').textContent = texts.welcome;
    document.querySelectorAll('.selection-card h3')[0].textContent = texts.channels;
    document.querySelectorAll('.selection-card h3')[1].textContent = texts.groups;
    document.querySelectorAll('.selection-card h3')[2].textContent = texts.bots;
    document.getElementById('cleanBtn').innerHTML = `<i class="fas fa-broom"></i> ${texts.cleanSelected}`;
    document.querySelector('.recommendations h3').innerHTML = `<i class="fas fa-fire"></i> ${texts.recommendations}`;
}

// Загрузка пользователя
async function loadUser() {
    if (userId) {
        document.getElementById('userInfo').innerHTML = `
            <i class="fas fa-user"></i>
            <span>ID: ${userId}</span>
        `;
        
        // Загружаем статистику
        loadStats();
        // Загружаем рекламные каналы
        loadAdChannels();
    }
}

// Загрузка статистики
function loadStats() {
    // В реальном приложении здесь был бы запрос к API
    const stats = {
        analyzed: localStorage.getItem('analyzedCount') || 0,
        cleaned: localStorage.getItem('cleanedCount') || 0
    };
    
    document.getElementById('analyzedCount').textContent = stats.analyzed;
    document.getElementById('cleanedCount').textContent = stats.cleaned;
}

// Загрузка рекламных каналов
function loadAdChannels() {
    const adChannels = [
        {
            name: currentLang === 'ru' ? "Новости IT" : "IT News",
            desc: currentLang === 'ru' ? "Свежие новости технологий" : "Fresh technology news",
            icon: "fas fa-laptop-code",
            link: "https://t.me/example"
        },
        {
            name: currentLang === 'ru' ? "Крипто аналитика" : "Crypto Analytics",
            desc: currentLang === 'ru' ? "Анализ рынка криптовалют" : "Cryptocurrency market analysis",
            icon: "fas fa-chart-line",
            link: "https://t.me/example2"
        }
    ];
    
    const container = document.getElementById('adChannels');
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

// Выбор типа контента
function selectType(type) {
    currentType = type;
    const typeText = TEXTS[currentLang][type];
    document.getElementById('currentType').textContent = typeText.toLowerCase();
    
    // Показываем экран анализа
    document.getElementById('mainScreen').style.display = 'none';
    document.getElementById('analysisScreen').style.display = 'block';
}

// Назад на главный экран
function goBack() {
    document.getElementById('mainScreen').style.display = 'block';
    document.getElementById('analysisScreen').style.display = 'none';
    analyzedResults = [];
    selectedChats = [];
}

// Запрос чатов у Telegram
function requestChats() {
    const params = {
        chat_types: getChatTypesForCurrentType(),
        allow_multiselect: true,
        title: TEXTS[currentLang][currentType]
    };
    
    tg.requestChat({
        ...params,
        onSuccess: (data) => {
            handleSelectedChats(data);
        },
        onError: (error) => {
            console.error('Error requesting chats:', error);
            tg.showAlert(currentLang === 'ru' ? 
                'Ошибка при выборе чатов' : 'Error selecting chats');
        }
    });
}

function getChatTypesForCurrentType() {
    switch(currentType) {
        case 'channels': return ['channel'];
        case 'groups': return ['group'];
        case 'bots': return ['bot'];
        default: return ['channel', 'group', 'bot'];
    }
}

// Обработка выбранных чатов
async function handleSelectedChats(chatData) {
    selectedChats = Array.isArray(chatData) ? chatData : [chatData];
    
    // Показываем прогресс
    updateProgress(0);
    
    // Анализируем каждый чат
    for (let i = 0; i < selectedChats.length; i++) {
        const chat = selectedChats[i];
        await analyzeChat(chat);
        updateProgress(((i + 1) / selectedChats.length) * 100);
    }
    
    // Показываем результаты
    showResults();
    updateProgress(100);
}

// Анализ чата
async function analyzeChat(chat) {
    // Симуляция анализа
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const statuses = ['active', 'inactive', 'dead', 'toxic'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    const result = {
        id: chat.id || Math.random(),
        title: chat.title || `Чат ${analyzedResults.length + 1}`,
        type: chat.type || currentType.slice(0, -1),
        status: randomStatus,
        description: getStatusDescription(randomStatus)
    };
    
    analyzedResults.push(result);
    return result;
}

function getStatusDescription(status) {
    const texts = {
        ru: {
            active: "Активный, можно оставить",
            inactive: "Неактивный более 1 месяца",
            dead: "Неактивный более 6 месяцев",
            toxic: "Токсичный контент"
        },
        en: {
            active: "Active, can keep",
            inactive: "Inactive for more than 1 month",
            dead: "Inactive for more than 6 months",
            toxic: "Toxic content"
        }
    };
    
    return texts[currentLang][status] || texts[currentLang].active;
}

// Обновление прогресс-бара
function updateProgress(percent) {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    progressBar.style.width = `${percent}%`;
    progressText.textContent = `${Math.round(percent)}%`;
}

// Показ результатов
function showResults() {
    const container = document.getElementById('resultsContainer');
    
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
    
    container.innerHTML = analyzedResults.map((result, index) => `
        <div class="result-item ${result.status}">
            <i class="fas ${getIconForStatus(result.status)}"></i>
            <div class="result-info">
                <div class="result-title">${result.title}</div>
                <div class="result-desc">${result.description}</div>
            </div>
            <input type="checkbox" class="result-checkbox" 
                   onchange="toggleSelection(${index})"
                   ${result.status === 'dead' || result.status === 'toxic' ? 'checked' : ''}>
        </div>
    `).join('');
    
    // Активируем кнопку очистки
    document.getElementById('cleanBtn').disabled = false;
}

function getIconForStatus(status) {
    switch(status) {
        case 'active': return 'fa-check-circle';
        case 'inactive': return 'fa-clock';
        case 'dead': return 'fa-skull-crossbones';
        case 'toxic': return 'fa-radiation';
        default: return 'fa-question-circle';
    }
}

// Переключение выбора
function toggleSelection(index) {
    analyzedResults[index].selected = !analyzedResults[index].selected;
}

// Очистка выбранного
function cleanSelected() {
    const selected = analyzedResults.filter(r => r.selected);
    
    if (selected.length === 0) {
        tg.showAlert(currentLang === 'ru' ? 
            'Выберите хотя бы один чат для очистки' : 
            'Select at least one chat to clean');
        return;
    }
    
    // Обновляем статистику
    const currentAnalyzed = parseInt(localStorage.getItem('analyzedCount') || 0);
    const currentCleaned = parseInt(localStorage.getItem('cleanedCount') || 0);
    
    localStorage.setItem('analyzedCount', currentAnalyzed + analyzedResults.length);
    localStorage.setItem('cleanedCount', currentCleaned + selected.length);
    
    // Показываем уведомление
    tg.showAlert(currentLang === 'ru' ? 
        `Успешно очищено ${selected.length} чатов!` :
        `Successfully cleaned ${selected.length} chats!`);
    
    // Обновляем статистику на экране
    loadStats();
    
    // Возвращаем на главный экран
    goBack();
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    updateTexts();
    loadUser();
    
    // Устанавливаем счетчики
    document.getElementById('channelsCount').textContent = '∞';
    document.getElementById('groupsCount').textContent = '∞';
    document.getElementById('botsCount').textContent = '∞';
});