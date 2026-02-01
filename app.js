// Telegram Web App Initialization
const tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

// State Management
let state = {
    language: 'ru',
    selectedChats: [],
    analysisResults: null,
    currentScreen: 'welcome',
    userId: null,
    botUsername: null
};

// Localization
const locales = {
    ru: {
        welcome_title: 'Анализ Telegram Аккаунта',
        welcome_text: 'Проанализируем ваши каналы, группы и боты. Найдем мусорные, дублирующие и неактивные чаты.',
        start_analysis: 'Начать анализ',
        select_chats: 'Выберите чаты для анализа',
        select_subtitle: 'Используйте системный селектор Telegram',
        channels: 'Каналы',
        groups: 'Группы',
        bots: 'Боты',
        select_all: 'Выбрать все',
        analyze: 'Анализировать',
        selected_chats: 'Выбранные чаты',
        no_chats_selected: 'Чаты не выбраны. Нажмите "Выбрать все" или выберите вручную.',
        analyzing: 'Анализируем...',
        analyzing_subtitle: 'Проверяем активность, ищем дубликаты и токсичный контент',
        results: 'Результаты анализа',
        digital_weight: 'Цифровой вес',
        dead_chats: 'Мертвые',
        dead_desc: 'Нет постов >30 дней',
        duplicates: 'Дубликаты',
        duplicates_desc: 'Одинаковый контент',
        toxic: 'Токсичные',
        toxic_desc: 'Спам и реклама',
        total: 'Всего',
        total_desc: 'Проанализировано',
        clean_chats: 'Очистить чаты',
        share_stats: 'Поделиться',
        recommendations: 'Рекомендации',
        recommendations_title: 'Рекомендации',
        recommendations_subtitle: 'Полезные каналы на замену',
        back: 'Назад к результатам',
        footer_text: 'TG Auditor Pro 2026 • Безопасная очистка Telegram',
        share_app: 'Поделиться',
        refresh: 'Обновить',
        select_chats_modal: 'Выбор чатов через Telegram',
        select_chats_modal_desc: 'Используйте системный селектор Telegram для выбора чатов. Вы можете выбрать несколько чатов одновременно.'
    },
    en: {
        welcome_title: 'Telegram Account Analysis',
        welcome_text: 'We will analyze your channels, groups and bots. Find junk, duplicate and inactive chats.',
        start_analysis: 'Start Analysis',
        select_chats: 'Select chats for analysis',
        select_subtitle: 'Use Telegram system selector',
        channels: 'Channels',
        groups: 'Groups',
        bots: 'Bots',
        select_all: 'Select All',
        analyze: 'Analyze',
        selected_chats: 'Selected chats',
        no_chats_selected: 'No chats selected. Press "Select All" or select manually.',
        analyzing: 'Analyzing...',
        analyzing_subtitle: 'Checking activity, looking for duplicates and toxic content',
        results: 'Analysis Results',
        digital_weight: 'Digital Weight',
        dead_chats: 'Dead',
        dead_desc: 'No posts >30 days',
        duplicates: 'Duplicates',
        duplicates_desc: 'Same content',
        toxic: 'Toxic',
        toxic_desc: 'Spam and ads',
        total: 'Total',
        total_desc: 'Analyzed',
        clean_chats: 'Clean Chats',
        share_stats: 'Share',
        recommendations: 'Recommendations',
        recommendations_title: 'Recommendations',
        recommendations_subtitle: 'Useful channels for replacement',
        back: 'Back to results',
        footer_text: 'TG Auditor Pro 2026 • Safe Telegram Cleaning',
        share_app: 'Share',
        refresh: 'Refresh',
        select_chats_modal: 'Chat selection via Telegram',
        select_chats_modal_desc: 'Use Telegram system selector to choose chats. You can select multiple chats at once.'
    }
};

// DOM Elements
const elements = {
    screens: {
        welcome: document.getElementById('welcome-screen'),
        selection: document.getElementById('selection-screen'),
        analysis: document.getElementById('analysis-screen'),
        recommendations: document.getElementById('recommendations-screen')
    },
    buttons: {
        startAnalysis: document.getElementById('start-analysis'),
        selectAll: document.getElementById('select-all'),
        analyzeSelected: document.getElementById('analyze-selected'),
        cleanChats: document.getElementById('clean-chats'),
        shareStats: document.getElementById('share-stats'),
        getRecommendations: document.getElementById('get-recommendations'),
        backToAnalysis: document.getElementById('back-to-analysis'),
        openTelegramSelector: document.getElementById('open-telegram-selector'),
        closeModal: document.getElementById('close-modal'),
        shareApp: document.getElementById('share-app'),
        refresh: document.getElementById('refresh'),
        langRu: document.getElementById('lang-ru'),
        langEn: document.getElementById('lang-en')
    },
    counters: {
        channels: document.getElementById('channels-count'),
        groups: document.getElementById('groups-count'),
        bots: document.getElementById('bots-count'),
        dead: document.getElementById('dead-count'),
        duplicates: document.getElementById('duplicates-count'),
        toxic: document.getElementById('toxic-count'),
        total: document.getElementById('total-count'),
        digitalWeight: document.getElementById('digital-weight-value')
    },
    lists: {
        selectedChats: document.getElementById('selected-chats-list'),
        recommendations: document.getElementById('recommendations-list')
    },
    modal: document.getElementById('chat-selector-modal')
};

// Initialize
function init() {
    // Get parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    state.userId = urlParams.get('user_id');
    state.language = urlParams.get('lang') || 'ru';
    state.botUsername = tg.initDataUnsafe.user?.username || 'tg_auditor_pro_bot';
    
    // Set language
    updateLanguage(state.language);
    
    // Event Listeners
    setupEventListeners();
    
    // Show welcome screen
    showScreen('welcome');
    
    // Initialize Telegram Web App
    tg.ready();
    
    console.log('TG Auditor Pro Mini App initialized');
}

// Language Management
function updateLanguage(lang) {
    state.language = lang;
    
    // Update language buttons
    elements.buttons.langRu.classList.toggle('active', lang === 'ru');
    elements.buttons.langEn.classList.toggle('active', lang === 'en');
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (locales[lang] && locales[lang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = locales[lang][key];
            } else {
                element.textContent = locales[lang][key];
            }
        }
    });
    
    // Update button text with counts
    updateAnalyzeButton();
}

// Screen Management
function showScreen(screenName) {
    // Hide all screens
    Object.values(elements.screens).forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    if (elements.screens[screenName]) {
        elements.screens[screenName].classList.add('active');
        state.currentScreen = screenName;
    }
}

// Event Listeners
function setupEventListeners() {
    // Language switchers
    elements.buttons.langRu.addEventListener('click', () => updateLanguage('ru'));
    elements.buttons.langEn.addEventListener('click', () => updateLanguage('en'));
    
    // Navigation
    elements.buttons.startAnalysis.addEventListener('click', () => showScreen('selection'));
    
    // Chat selection
    elements.buttons.selectAll.addEventListener('click', openTelegramSelector);
    elements.buttons.openTelegramSelector.addEventListener('click', openTelegramSelector);
    elements.buttons.closeModal.addEventListener('click', () => {
        elements.modal.classList.remove('active');
    });
    
    // Analysis
    elements.buttons.analyzeSelected.addEventListener('click', analyzeSelectedChats);
    
    // Results actions
    elements.buttons.cleanChats.addEventListener('click', cleanChats);
    elements.buttons.shareStats.addEventListener('click', shareStatistics);
    elements.buttons.getRecommendations.addEventListener('click', getRecommendations);
    elements.buttons.backToAnalysis.addEventListener('click', () => showScreen('analysis'));
    
    // Footer actions
    elements.buttons.shareApp.addEventListener('click', shareApp);
    elements.buttons.refresh.addEventListener('click', refreshApp);
    
    // Telegram event listeners
    tg.onEvent('themeChanged', updateTheme);
    tg.onEvent('viewportChanged', updateViewport);
}

// Telegram Selector
function openTelegramSelector() {
    elements.modal.classList.add('active');
    
    // In production, this would use Telegram's web_app_request_chat
    // For demo purposes, we'll simulate with mock data
    setTimeout(() => {
        simulateChatSelection();
        elements.modal.classList.remove('active');
    }, 1000);
}

function simulateChatSelection() {
    // Mock data for demonstration
    const mockChats = [
        { id: 1, type: 'channel', title: 'Новости Telegram', username: 'telegram', members_count: 1000000 },
        { id: 2, type: 'channel', title: 'Мемы', username: 'memes', members_count: 500000 },
        { id: 3, type: 'group', title: 'Работа в IT', username: null, members_count: 10000 },
        { id: 4, type: 'bot', title: 'Weather Bot', username: 'weatherbot', members_count: 1 },
        { id: 5, type: 'channel', title: 'Криптовалюты', username: 'crypto', members_count: 200000 },
        { id: 6, type: 'channel', title: 'Ставки на спорт', username: 'bets', members_count: 300000 },
        { id: 7, type: 'group', title: 'Флудильня', username: null, members_count: 5000 },
        { id: 8, type: 'channel', title: 'Котики', username: 'cats', members_count: 150000 }
    ];
    
    state.selectedChats = mockChats;
    updateSelectedChatsList();
    updateCategoryCounts();
    updateAnalyzeButton();
}

function updateSelectedChatsList() {
    const list = elements.lists.selectedChats;
    
    if (state.selectedChats.length === 0) {
        list.innerHTML = `
            <p class="empty-message" data-i18n="no_chats_selected">
                ${locales[state.language].no_chats_selected}
            </p>
        `;
        return;
    }
    
    list.innerHTML = '';
    
    state.selectedChats.forEach(chat => {
        const chatElement = document.createElement('div');
        chatElement.className = 'chat-item';
        
        let icon = '';
        if (chat.type === 'channel') {
            icon = '<svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/></svg>';
        } else if (chat.type === 'group') {
            icon = '<svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>';
        } else {
            icon = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.51.88 4.93 1.78C15.57 19.36 13.86 20 12 20s-3.57-.64-4.93-1.72zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11z"/></svg>';
        }
        
        chatElement.innerHTML = `
            <div class="chat-icon">${icon}</div>
            <div class="chat-info">
                <div class="chat-title">${chat.title}</div>
                ${chat.username ? `<div class="chat-username">@${chat.username}</div>` : ''}
            </div>
            <button class="remove-chat" data-id="${chat.id}">
                <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
        `;
        
        list.appendChild(chatElement);
    });
    
    // Add remove event listeners
    list.querySelectorAll('.remove-chat').forEach(button => {
        button.addEventListener('click', (e) => {
            const chatId = parseInt(e.currentTarget.getAttribute('data-id'));
            state.selectedChats = state.selectedChats.filter(chat => chat.id !== chatId);
            updateSelectedChatsList();
            updateCategoryCounts();
            updateAnalyzeButton();
        });
    });
}

function updateCategoryCounts() {
    const channels = state.selectedChats.filter(chat => chat.type === 'channel').length;
    const groups = state.selectedChats.filter(chat => chat.type === 'group').length;
    const bots = state.selectedChats.filter(chat => chat.type === 'bot').length;
    
    elements.counters.channels.textContent = channels;
    elements.counters.groups.textContent = groups;
    elements.counters.bots.textContent = bots;
}

function updateAnalyzeButton() {
    const count = state.selectedChats.length;
    const button = elements.buttons.analyzeSelected;
    
    button.disabled = count === 0;
    button.innerHTML = `${locales[state.language].analyze} (${count})`;
}

// Analysis
async function analyzeSelectedChats() {
    showScreen('analysis');
    
    // Show loading state
    document.querySelector('.loading-container').style.display = 'block';
    document.querySelector('.results-container').style.display = 'none';
    
    // Send data to bot
    try {
        const response = await sendToBot({
            action: 'analyze_chats',
            chats: state.selectedChats
        });
        
        if (response && response.action === 'analysis_results') {
            displayAnalysisResults(response.data);
        }
    } catch (error) {
        console.error('Analysis error:', error);
        // Fallback to mock results
        setTimeout(() => {
            displayAnalysisResults(getMockAnalysisResults());
        }, 2000);
    }
}

function displayAnalysisResults(results) {
    state.analysisResults = results;
    
    // Update UI
    elements.counters.dead.textContent = results.dead;
    elements.counters.duplicates.textContent = results.duplicates;
    elements.counters.toxic.textContent = results.toxic;
    elements.counters.total.textContent = results.total;
    elements.counters.digitalWeight.textContent = results.digital_weight;
    
    // Show results
    document.querySelector('.loading-container').style.display = 'none';
    document.querySelector('.results-container').style.display = 'block';
}

function getMockAnalysisResults() {
    const total = state.selectedChats.length;
    return {
        total: total,
        dead: Math.floor(total * 0.2),
        duplicates: Math.floor(total * 0.1),
        toxic: Math.floor(total * 0.15),
        digital_weight: (total * 0.5).toFixed(1)
    };
}

// Actions
function cleanChats() {
    // Generate leave links
    const links = state.selectedChats.map(chat => {
        if (chat.username) {
            return `https://t.me/${chat.username}`;
        }
        return null;
    }).filter(link => link);
    
    // Show links to user
    let message = `Ссылки для выхода из чатов:\n\n`;
    links.slice(0, 5).forEach((link, i) => {
        message += `${i + 1}. ${link}\n`;
    });
    
    if (links.length > 5) {
        message += `\n... и еще ${links.length - 5} чатов`;
    }
    
    tg.showAlert(message);
}

async function shareStatistics() {
    if (!state.analysisResults) return;
    
    const stats = state.analysisResults;
    const shareText = `${locales[state.language].results}:\n\n` +
        `• ${locales[state.language].total}: ${stats.total}\n` +
        `• ${locales[state.language].dead_chats}: ${stats.dead}\n` +
        `• ${locales[state.language].duplicates}: ${stats.duplicates}\n` +
        `• ${locales[state.language].toxic}: ${stats.toxic}\n` +
        `• ${locales[state.language].digital_weight}: ${stats.digital_weight}\n\n` +
        `🚀 ${locales[state.language].footer_text}`;
    
    tg.shareMessage(shareText);
}

async function getRecommendations() {
    showScreen('recommendations');
    
    try {
        const response = await sendToBot({
            action: 'get_recommendations'
        });
        
        if (response && response.action === 'recommendations') {
            displayRecommendations(response.data);
        }
    } catch (error) {
        console.error('Recommendations error:', error);
        displayRecommendations(getMockRecommendations());
    }
}

function displayRecommendations(recommendations) {
    const list = elements.lists.recommendations;
    
    if (!recommendations || recommendations.length === 0) {
        list.innerHTML = `<p class="empty-message">${locales[state.language].no_recommendations}</p>`;
        return;
    }
    
    list.innerHTML = '';
    
    recommendations.forEach(rec => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        
        card.innerHTML = `
            <div class="recommendation-header">
                <div class="recommendation-title">${rec.channel_title}</div>
                <span class="recommendation-badge">Рекомендуем</span>
            </div>
            <p class="recommendation-description">${rec.description || 'Полезный канал по теме'}</p>
            <a href="https://t.me/${rec.channel_username}" 
               target="_blank" 
               class="recommendation-link">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                </svg>
                @${rec.channel_username}
            </a>
        `;
        
        list.appendChild(card);
    });
}

function getMockRecommendations() {
    return [
        {
            channel_title: 'Tech News',
            channel_username: 'technews',
            description: 'Последние новости из мира технологий'
        },
        {
            channel_title: 'Productivity Tips',
            channel_username: 'productivity',
            description: 'Советы по повышению продуктивности'
        },
        {
            channel_title: 'Design Inspiration',
            channel_username: 'design',
            description: 'Лучшие работы дизайнеров со всего мира'
        }
    ];
}

// Telegram Bot Communication
async function sendToBot(data) {
    // In production, this would send data via Telegram Web App
    // For demo, we'll simulate the response
    
    return new Promise((resolve) => {
        setTimeout(() => {
            if (data.action === 'analyze_chats') {
                resolve({
                    action: 'analysis_results',
                    data: getMockAnalysisResults()
                });
            } else if (data.action === 'get_recommendations') {
                resolve({
                    action: 'recommendations',
                    data: getMockRecommendations()
                });
            }
        }, 1500);
    });
}

// Utility Functions
function shareApp() {
    const shareUrl = `https://t.me/${state.botUsername}`;
    const shareText = `${locales[state.language].welcome_title} - ${locales[state.language].welcome_text}`;
    
    if (tg.isVersionAtLeast('6.1')) {
        tg.shareMessage(shareText);
    } else {
        tg.openLink(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`);
    }
}

function refreshApp() {
    window.location.reload();
}

function updateTheme() {
    document.body.className = tg.colorScheme;
}

function updateViewport() {
    // Handle viewport changes if needed
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);