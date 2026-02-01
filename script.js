// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
let currentUser = null;
let currentLang = 'ru';
let currentType = null;
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
        cleaned: "Очищено",
        startAnalysis: "Начать анализ",
        selectTypeFirst: "Сначала выберите тип контента",
        noChatsSelected: "Чаты не выбраны",
        analysisComplete: "Анализ завершен"
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
        analysisComplete: "Analysis complete"
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
    
    // Обновляем текст кнопки анализа
    const analysisBtn = document.getElementById('startAnalysisBtn');
    if (analysisBtn) {
        if (currentType) {
            analysisBtn.innerHTML = `<i class="fas fa-play"></i> ${texts.startAnalysis} ${texts[currentType]}`;
        } else {
            analysisBtn.innerHTML = `<i class="fas fa-play"></i> ${texts.startAnalysis}`;
        }
    }
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
        cleaned_channels: localStorage.getItem('cleanedChannels') || 0,
        cleaned_groups: localStorage.getItem('cleanedGroups') || 0,
        cleaned_bots: localStorage.getItem('cleanedBots') || 0
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
    
    // Обновляем UI
    document.querySelectorAll('.selection-card').forEach(card => {
        card.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Обновляем текст кнопки
    updateTexts();
    
    // Показываем кнопку анализа
    document.getElementById('startAnalysisBtn').style.display = 'flex';
    
    // Обновляем текст в кнопке
    const typeText = TEXTS[currentLang][type];
    document.getElementById('startAnalysisBtn').innerHTML = 
        `<i class="fas fa-play"></i> ${TEXTS[currentLang].startAnalysis} ${typeText}`;
}

// Запрос чатов у Telegram
function requestChats() {
    if (!currentType) {
        tg.showAlert(TEXTS[currentLang].selectTypeFirst);
        return;
    }
    
    const params = {
        chat_types: getChatTypesForCurrentType(),
        allow_multiselect: true,
        title: `${TEXTS[currentLang][currentType]} - Telegram Auditor`
    };
    
    console.log('Requesting chats with params:', params);
    
    tg.requestChat({
        ...params,
        onSuccess: (data) => {
            console.log('Chats selected:', data);
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
    // Преобразуем данные в массив
    selectedChats = Array.isArray(chatData) ? chatData : [chatData];
    
    if (selectedChats.length === 0) {
        tg.showAlert(TEXTS[currentLang].noChatsSelected);
        return;
    }
    
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
        
        // Показываем промежуточные результаты
        if (i % 5 === 0 || i === selectedChats.length - 1) {
            showPartialResults();
        }
        
        // Небольшая задержка для анимации
        await sleep(50);
    }
    
    // Показываем финальные результаты
    showResults();
    updateProgress(100);
    
    // Активируем кнопку очистки
    document.getElementById('cleanBtn').disabled = false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Анализ чата
async function analyzeChat(chat) {
    // Симуляция анализа с разным временем для разных типов
    const analysisTime = Math.random() * 300 + 100;
    await sleep(analysisTime);
    
    // Определяем тип чата
    let chatType = 'unknown';
    if (chat.type === 'channel') chatType = 'channel';
    else if (chat.type === 'group') chatType = 'group';
    else if (chat.type === 'bot') chatType = 'bot';
    
    // Генерируем случайный статус с разными вероятностями
    const rand = Math.random();
    let status, icon, description;
    
    if (rand < 0.3) {
        status = 'active';
        icon = 'fa-check-circle';
        description = currentLang === 'ru' ? 'Активный, можно оставить' : 'Active, can keep';
    } else if (rand < 0.6) {
        status = 'inactive';
        icon = 'fa-clock';
        description = currentLang === 'ru' ? 'Неактивный более 1 месяца' : 'Inactive for more than 1 month';
    } else if (rand < 0.8) {
        status = 'dead';
        icon = 'fa-skull-crossbones';
        description = currentLang === 'ru' ? 'Неактивный более 6 месяцев' : 'Inactive for more than 6 months';
    } else {
        status = 'toxic';
        icon = 'fa-radiation';
        description = currentLang === 'ru' ? 'Токсичный контент' : 'Toxic content';
    }
    
    return {
        id: chat.id || Math.random(),
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
        
        // Анимация заполнения
        progressBar.style.transition = 'width 0.3s ease';
    }
}

// Показ промежуточных результатов
function showPartialResults() {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    
    const recentResults = analyzedResults.slice(-5);
    
    container.innerHTML = recentResults.map((result, index) => `
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
    `).join('');
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
    
    // Показываем уведомление о завершении
    tg.showAlert(TEXTS[currentLang].analysisComplete);
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
    let currentCleanedChannels = parseInt(localStorage.getItem('cleanedChannels') || 0);
    let currentCleanedGroups = parseInt(localStorage.getItem('cleanedGroups') || 0);
    let currentCleanedBots = parseInt(localStorage.getItem('cleanedBots') || 0);
    
    // Считаем по типам
    const channelsCleaned = selected.filter(r => r.type === 'channel').length;
    const groupsCleaned = selected.filter(r => r.type === 'group').length;
    const botsCleaned = selected.filter(r => r.type === 'bot').length;
    
    localStorage.setItem('analyzedCount', currentAnalyzed + analyzedResults.length);
    localStorage.setItem('cleanedChannels', currentCleanedChannels + channelsCleaned);
    localStorage.setItem('cleanedGroups', currentCleanedGroups + groupsCleaned);
    localStorage.setItem('cleanedBots', currentCleanedBots + botsCleaned);
    
    // Показываем уведомление
    tg.showAlert(currentLang === 'ru' ? 
        `Успешно очищено: ${selected.length} чатов\n• Каналов: ${channelsCleaned}\n• Групп: ${groupsCleaned}\n• Ботов: ${botsCleaned}` :
        `Successfully cleaned: ${selected.length} chats\n• Channels: ${channelsCleaned}\n• Groups: ${groupsCleaned}\n• Bots: ${botsCleaned}`);
    
    // Обновляем статистику на экране
    loadStats();
    
    // Возвращаем на главный экран
    goBack();
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
    document.getElementById('startAnalysisBtn').style.display = 'none';
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
