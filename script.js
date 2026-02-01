// Конфигурация приложения
const APP_CONFIG = window.APP_CONFIG || {
    user_id: '123456',
    type: 'channels',
    lang: 'ru'
};

// Тексты локализации
const TEXTS = {
    ru: {
        welcomeTitle: 'Добро пожаловать в TG Auditor Pro!',
        welcomeText: 'Проанализируйте и очистите ваш Telegram от ненужных каналов, групп и ботов за несколько кликов.',
        auditTitle: 'Выберите что анализировать:',
        channelsTitle: 'Каналы',
        channelsText: 'Анализ подписок на каналы',
        channelsBtn: 'Выбрать каналы',
        groupsTitle: 'Группы',
        groupsText: 'Анализ участия в группах',
        groupsBtn: 'Выбрать группы',
        botsTitle: 'Боты',
        botsText: 'Анализ добавленных ботов',
        botsBtn: 'Выбрать ботов',
        resultsTitle: 'Результаты анализа',
        totalText: ' всего',
        inactiveTitle: 'Неактивные',
        duplicateTitle: 'Дубликаты',
        spamTitle: 'Спам',
        cleanBtn: 'Очистить выбранное',
        recommendBtn: 'Рекомендации',
        recommendationsTitle: 'Рекомендуемые каналы',
        loadingText: 'Анализируем...',
        loadingSubtext: 'Это может занять несколько секунд',
        usersText: ' пользователей',
        cleanedText: ' очищено',
        noChannels: 'Не выбрано ни одного канала',
        selectAll: 'Выбрать все',
        deselectAll: 'Снять выделение',
        leaveChannel: 'Покинуть',
        minutesSaved: 'мин сэкономлено',
        trafficSaved: 'МБ трафика сэкономлено',
        recommendationKeep: 'Рекомендуется оставить',
        recommendationRemove: 'Рекомендуется удалить'
    },
    en: {
        welcomeTitle: 'Welcome to TG Auditor Pro!',
        welcomeText: 'Analyze and clean your Telegram from unnecessary channels, groups and bots in a few clicks.',
        auditTitle: 'Choose what to analyze:',
        channelsTitle: 'Channels',
        channelsText: 'Channel subscriptions analysis',
        channelsBtn: 'Select channels',
        groupsTitle: 'Groups',
        groupsText: 'Group participation analysis',
        groupsBtn: 'Select groups',
        botsTitle: 'Bots',
        botsText: 'Added bots analysis',
        botsBtn: 'Select bots',
        resultsTitle: 'Analysis Results',
        totalText: ' total',
        inactiveTitle: 'Inactive',
        duplicateTitle: 'Duplicates',
        spamTitle: 'Spam',
        cleanBtn: 'Clean selected',
        recommendBtn: 'Recommendations',
        recommendationsTitle: 'Recommended Channels',
        loadingText: 'Analyzing...',
        loadingSubtext: 'This may take a few seconds',
        usersText: ' users',
        cleanedText: ' cleaned',
        noChannels: 'No channels selected',
        selectAll: 'Select all',
        deselectAll: 'Deselect all',
        leaveChannel: 'Leave',
        minutesSaved: 'minutes saved',
        trafficSaved: 'MB traffic saved',
        recommendationKeep: 'Recommended to keep',
        recommendationRemove: 'Recommended to remove'
    }
};

// Состояние приложения
let appState = {
    user_id: APP_CONFIG.user_id,
    audit_type: APP_CONFIG.type,
    language: APP_CONFIG.lang,
    selectedChats: [],
    analysisResults: [],
    recommendations: [],
    selectedChannels: new Set()
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    setupEventListeners();
});

function initApp() {
    // Устанавливаем язык
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
        langSelect.value = appState.language;
        updateTexts();
    }
    
    // Инициализируем Telegram Web App
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        
        // Получаем данные пользователя из Telegram
        const user = Telegram.WebApp.initDataUnsafe.user;
        if (user && user.id) {
            appState.user_id = user.id;
        }
    }
    
    // Загружаем статистику
    loadStats();
}

function setupEventListeners() {
    // Изменение языка
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
        langSelect.addEventListener('change', function() {
            appState.language = this.value;
            updateTexts();
        });
    }
}

function updateTexts() {
    const texts = TEXTS[appState.language];
    
    // Обновляем все тексты
    Object.keys(texts).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = texts[key];
        }
    });
}

function startAudit(type) {
    appState.audit_type = type;
    
    if (window.Telegram && Telegram.WebApp) {
        // Используем Telegram Web App для выбора чатов
        Telegram.WebApp.requestChat({
            type: type === 'channels' ? 'channel' : 
                  type === 'groups' ? 'group' : 'bot',
            allow_multiselect: true,
            max: 1000 // Максимальное количество чатов
        }, function(chat) {
            if (chat && chat.chats) {
                const chatIds = chat.chats.map(c => c.id);
                analyzeChats(chatIds);
            }
        });
    } else {
        // Для демо используем тестовые данные
        showLoading(true);
        setTimeout(() => {
            const mockChatIds = Array.from({length: 20}, (_, i) => `test_chat_${i}`);
            analyzeChats(mockChatIds);
        }, 2000);
    }
}

async function analyzeChats(chatIds) {
    showLoading(true);
    
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: appState.user_id,
                chat_ids: chatIds,
                type: appState.audit_type,
                lang: appState.language
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            appState.analysisResults = data.results;
            displayResults(data);
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('Ошибка соединения с сервером');
        // Для демо показываем тестовые данные
        displayMockResults();
    } finally {
        showLoading(false);
    }
}

function displayResults(data) {
    const resultsSection = document.getElementById('resultsSection');
    const channelsList = document.getElementById('channelsList');
    
    // Обновляем статистику
    document.getElementById('totalCount').textContent = data.summary.total;
    document.getElementById('inactiveCount').textContent = data.summary.inactive;
    document.getElementById('duplicateCount').textContent = data.summary.duplicates;
    document.getElementById('spamCount').textContent = data.summary.spam;
    
    // Очищаем список
    channelsList.innerHTML = '';
    
    // Добавляем заголовок с действиями
    const headerDiv = document.createElement('div');
    headerDiv.className = 'channels-header';
    headerDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 style="margin: 0;">${appState.audit_type === 'channels' ? 'Каналы' : 
                                  appState.audit_type === 'groups' ? 'Группы' : 'Боты'}</h4>
            <div>
                <button onclick="selectAllChannels()" class="btn-small" style="margin-right: 10px;">
                    ${TEXTS[appState.language].selectAll}
                </button>
                <button onclick="deselectAllChannels()" class="btn-small">
                    ${TEXTS[appState.language].deselectAll}
                </button>
            </div>
        </div>
    `;
    channelsList.appendChild(headerDiv);
    
    // Добавляем каналы
    data.results.forEach((channel, index) => {
        const channelElement = createChannelElement(channel, index);
        channelsList.appendChild(channelElement);
    });
    
    // Показываем секцию результатов
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Загружаем рекомендации
    loadRecommendations();
}

function createChannelElement(channel, index) {
    const div = document.createElement('div');
    div.className = 'channel-item';
    
    // Определяем класс статуса
    let statusClass = '';
    let statusText = '';
    
    if (channel.status === 'inactive') {
        statusClass = 'status-inactive';
        statusText = 'Неактивный';
    } else if (channel.is_duplicate) {
        statusClass = 'status-duplicate';
        statusText = 'Дубликат';
    } else if (channel.is_spam) {
        statusClass = 'status-spam';
        statusText = 'Спам';
    }
    
    div.innerHTML = `
        <div class="channel-checkbox">
            <input type="checkbox" id="channel_${index}" 
                   ${channel.recommendation === 'remove' ? 'checked' : ''}
                   onchange="toggleChannel(${index})">
        </div>
        <div class="channel-info">
            <h4>${channel.title}</h4>
            <p>${channel.description || 'Без описания'}</p>
            <p><small>Участников: ${channel.members_count || 'N/A'} • 
                Полезность: ${channel.usefulness_score || 0}%</small></p>
        </div>
        ${statusText ? `<span class="channel-status ${statusClass}">${statusText}</span>` : ''}
        <button class="btn-small" onclick="leaveChannel('${channel.id}', '${channel.title}')" 
                style="margin-left: 10px;">
            ${TEXTS[appState.language].leaveChannel}
        </button>
    `;
    
    // Если рекомендуется удалить, добавляем в выбранные
    if (channel.recommendation === 'remove') {
        appState.selectedChannels.add(index);
    }
    
    return div;
}

function displayMockResults() {
    // Тестовые данные для демо
    const mockData = {
        summary: {
            total: 25,
            inactive: 8,
            duplicates: 5,
            spam: 3
        },
        results: Array.from({length: 25}, (_, i) => ({
            id: `chat_${i}`,
            title: `Тестовый ${appState.audit_type} ${i + 1}`,
            description: i % 2 === 0 ? 'Интересный контент' : 'Рекламный канал',
            members_count: Math.floor(Math.random() * 10000) + 100,
            usefulness_score: Math.floor(Math.random() * 100),
            status: i < 8 ? 'inactive' : 'active',
            is_duplicate: i >= 8 && i < 13,
            is_spam: i >= 13 && i < 16,
            recommendation: i < 16 ? 'remove' : 'keep'
        }))
    };
    
    displayResults(mockData);
}

function selectAllChannels() {
    const checkboxes = document.querySelectorAll('.channel-checkbox input[type="checkbox"]');
    checkboxes.forEach((cb, index) => {
        cb.checked = true;
        appState.selectedChannels.add(index);
    });
}

function deselectAllChannels() {
    const checkboxes = document.querySelectorAll('.channel-checkbox input[type="checkbox"]');
    checkboxes.forEach((cb, index) => {
        cb.checked = false;
        appState.selectedChannels.delete(index);
    });
}

function toggleChannel(index) {
    const checkbox = document.getElementById(`channel_${index}`);
    if (checkbox.checked) {
        appState.selectedChannels.add(index);
    } else {
        appState.selectedChannels.delete(index);
    }
}

async function cleanSelected() {
    if (appState.selectedChannels.size === 0) {
        alert(TEXTS[appState.language].noChannels);
        return;
    }
    
    const selectedChannels = Array.from(appState.selectedChannels)
        .map(index => appState.analysisResults[index])
        .filter(channel => channel);
    
    try {
        const response = await fetch('/api/clean', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: appState.user_id,
                channels: selectedChannels
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            showSuccessMessage(`Успешно очищено ${data.count} каналов!`);
            
            // Обновляем статистику
            loadStats();
            
            // Очищаем выбранные
            appState.selectedChannels.clear();
            
            // Показываем рекомендации
            showRecommendations();
        }
    } catch (error) {
        showError('Ошибка при очистке');
    }
}

function leaveChannel(channelId, channelTitle) {
    if (confirm(`Вы уверены, что хотите покинуть "${channelTitle}"?`)) {
        // В реальном приложении здесь будет ссылка для выхода
        const telegramLink = `https://t.me/${channelId}?leave=1`;
        window.open(telegramLink, '_blank');
    }
}

async function loadRecommendations() {
    try {
        const response = await fetch(`/api/ads/${appState.language}`);
        const data = await response.json();
        
        appState.recommendations = data.ads;
    } catch (error) {
        // Тестовые рекомендации
        appState.recommendations = [
            {
                id: 1,
                name: 'Технологии и IT',
                url: 'https://t.me/tech_channel',
                description: 'Последние новости из мира технологий',
                priority: 1
            },
            {
                id: 2,
                name: 'Криптовалюты',
                url: 'https://t.me/crypto_news',
                description: 'Аналитика и прогнозы крипторынка',
                priority: 2
            },
            {
                id: 3,
                name: 'Дизайн и креатив',
                url: 'https://t.me/design_ideas',
                description: 'Вдохновение для дизайнеров',
                priority: 3
            }
        ];
    }
}

function showRecommendations() {
    const section = document.getElementById('recommendationsSection');
    const list = document.getElementById('recommendationsList');
    
    list.innerHTML = '';
    
    appState.recommendations.forEach(rec => {
        const item = document.createElement('div');
        item.className = 'recommendation-item';
        item.innerHTML = `
            <div class="recommendation-icon">
                <i class="fas fa-star"></i>
            </div>
            <div class="recommendation-content">
                <h4>${rec.name}</h4>
                <p>${rec.description}</p>
                <a href="${rec.url}" target="_blank" class="recommendation-btn">
                    Подписаться
                </a>
            </div>
        `;
        list.appendChild(item);
    });
    
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth' });
}

function hideRecommendations() {
    const section = document.getElementById('recommendationsSection');
    section.style.display = 'none';
}

async function loadStats() {
    try {
        const response = await fetch(`/api/user/${appState.user_id}/stats`);
        const data = await response.json();
        
        // Обновляем статистику в футере
        document.getElementById('usersStat').textContent = '1000+'; // Заглушка
        document.getElementById('cleanedStat').textContent = data.total_cleaned || '50000+';
    } catch (error) {
        // Используем заглушки
        document.getElementById('usersStat').textContent = '1000+';
        document.getElementById('cleanedStat').textContent = '50000+';
    }
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
}

function showError(message) {
    alert(`Ошибка: ${message}`);
}

function showSuccessMessage(message) {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Добавляем стили для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .btn-small {
        padding: 6px 12px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        transition: background 0.3s ease;
    }
    
    .btn-small:hover {
        background: var(--primary-dark);
    }
`;
document.head.appendChild(style);