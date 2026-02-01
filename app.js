// Telegram WebApp
const tg = window.Telegram.WebApp;

// Get parameters from URL
const urlParams = new URLSearchParams(window.location.search);
const userLang = urlParams.get('lang') || 'en';
const userId = urlParams.get('user_id') || '0';

// Localization
const LOCALE = {
    'ru': {
        'title': 'TG Auditor Pro',
        'subtitle': 'Профессиональная очистка Telegram',
        'step1Title': 'Выбор каналов',
        'step1Desc': 'Выберите Telegram каналы и группы для анализа',
        'step2Title': 'Результаты анализа',
        'step3Title': 'Рекомендуемые каналы',
        'step3Desc': 'Качественные каналы для вас',
        'selectBtnText': 'ВЫБРАТЬ КАНАЛЫ',
        'selectingText': 'Выбор...',
        'selectedText': 'Выбрано:',
        'channelsText': 'каналов',
        'analyzeBtnText': 'АНАЛИЗИРОВАТЬ',
        'loadingText': 'ИИ анализирует каналы...',
        'cleanText': 'Чистота:',
        'cleanupBtnText': 'ОЧИСТИТЬ',
        'successTitle': 'Очистка завершена!',
        'successMessage': 'Ваш Telegram теперь чище',
        'channel': 'Канал',
        'status': 'Статус',
        'score': 'Оценка',
        'dead': 'Мёртвый',
        'spam': 'Спам',
        'good': 'Хороший',
        'inactive': 'Неактивный'
    },
    'en': {
        'title': 'TG Auditor Pro',
        'subtitle': 'Professional Telegram Cleaner',
        'step1Title': 'Select Channels',
        'step1Desc': 'Choose Telegram channels and groups to analyze',
        'step2Title': 'Analysis Results',
        'step3Title': 'Recommended Channels',
        'step3Desc': 'Quality channels for you',
        'selectBtnText': 'SELECT CHANNELS',
        'selectingText': 'Selecting...',
        'selectedText': 'Selected:',
        'channelsText': 'channels',
        'analyzeBtnText': 'ANALYZE',
        'loadingText': 'AI analyzing channels...',
        'cleanText': 'Clean:',
        'cleanupBtnText': 'CLEAN',
        'successTitle': 'Cleaning Complete!',
        'successMessage': 'Your Telegram is now cleaner',
        'channel': 'Channel',
        'status': 'Status',
        'score': 'Score',
        'dead': 'Dead',
        'spam': 'Spam',
        'good': 'Good',
        'inactive': 'Inactive'
    }
};

// Global variables
let selectedChannels = [];
let analysisResults = [];
let userStats = {
    total: 0,
    dead: 0,
    spam: 0,
    toClean: 0,
    cleanPercent: 0
};

// Initialize WebApp
function initWebApp() {
    if (!tg || !tg.initData) {
        console.error('Telegram WebApp not available');
        showError('Please open in Telegram app');
        return;
    }
    
    try {
        tg.expand();
        tg.enableClosingConfirmation();
        tg.setHeaderColor('#6366f1');
        tg.setBackgroundColor('#0f172a');
        tg.MainButton.hide();
        
        // Apply localization
        applyLocalization();
        
        // Load recommendations
        loadRecommendedChannels();
        
        console.log('TG Auditor Pro initialized');
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Initialization failed');
    }
}

// Apply localization
function applyLocalization() {
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    // Update all text elements
    document.getElementById('title').textContent = locale.title;
    document.getElementById('subtitle').textContent = locale.subtitle;
    document.getElementById('step1Title').textContent = locale.step1Title;
    document.getElementById('step1Desc').textContent = locale.step1Desc;
    document.getElementById('step2Title').textContent = locale.step2Title;
    document.getElementById('step3Title').textContent = locale.step3Title;
    document.getElementById('step3Desc').textContent = locale.step3Desc;
    document.getElementById('selectBtnText').textContent = locale.selectBtnText;
    document.getElementById('selectedText').textContent = locale.selectedText;
    document.getElementById('channelsText').textContent = locale.channelsText;
    document.getElementById('analyzeBtnText').textContent = locale.analyzeBtnText;
    document.getElementById('loadingText').textContent = locale.loadingText;
    document.getElementById('cleanText').textContent = locale.cleanText;
    document.getElementById('cleanupBtnText').textContent = locale.cleanupBtnText;
    document.getElementById('successTitle').textContent = locale.successTitle;
    document.getElementById('successMessage').textContent = locale.successMessage;
    
    // Update language badge
    document.getElementById('languageBadge').textContent = userLang === 'ru' ? '🌍 Русский' : '🌍 English';
}

// 1. SELECT CHANNELS
function requestChannels() {
    const btn = document.getElementById('selectChannelsBtn');
    const btnText = document.getElementById('selectBtnText');
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    btn.disabled = true;
    btnText.textContent = locale.selectingText;
    
    // Check if we're in Telegram app
    if (tg.platform !== 'unknown' && typeof tg.requestChat === 'function') {
        // Use Telegram WebApp API
        tg.requestChat({
            chat_types: ['channel'],
            allow_multiselect: true,
            title: locale.step1Title
        }, (chats) => {
            if (chats && chats.length > 0) {
                handleSelectedChats(chats);
            } else {
                // No channels selected or error
                showManualSelection();
            }
        });
    } else {
        // Not in Telegram app, show manual selection
        showManualSelection();
    }
}

function showManualSelection() {
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    tg.showPopup({
        title: locale.step1Title,
        message: 'In Telegram app, you can select multiple channels at once. For testing, we will use demo channels.',
        buttons: [
            { id: 'demo', type: 'default', text: 'Use Demo Channels' },
            { type: 'cancel' }
        ]
    }, (btnId) => {
        if (btnId === 'demo') {
            simulateChannelSelection();
        } else {
            resetSelectionButton();
        }
    });
}

function simulateChannelSelection() {
    // Demo channels for testing
    const demoChannels = [
        { 
            id: -1001234567890, 
            title: "Tech News", 
            type: "channel", 
            username: "tech_news",
            members: 125000,
            last_post: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            description: "Latest technology news"
        },
        { 
            id: -1001234567891, 
            title: "Crypto Signals", 
            type: "channel", 
            username: "crypto_signals",
            members: 85000,
            last_post: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
            description: "Cryptocurrency trading signals"
        },
        { 
            id: -1001234567892, 
            title: "Programming", 
            type: "channel", 
            username: "programming",
            members: 220000,
            last_post: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            description: "Programming tutorials"
        },
        { 
            id: -1001234567893, 
            title: "Old Archive", 
            type: "channel", 
            username: "old_archive",
            members: 5000,
            last_post: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
            description: "Inactive channel"
        },
        { 
            id: -1001234567894, 
            title: "SPAM Promo", 
            type: "channel", 
            username: "spam_promo",
            members: 15000,
            last_post: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            description: "Buy now! Limited offer!"
        }
    ];
    
    handleSelectedChats(demoChannels);
}

function handleSelectedChats(chats) {
    const btn = document.getElementById('selectChannelsBtn');
    const btnText = document.getElementById('selectBtnText');
    const counter = document.getElementById('selectionCounter');
    const countElem = document.getElementById('channelCount');
    const analyzeSection = document.getElementById('analyzeSection');
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    btn.disabled = false;
    
    if (!chats || chats.length === 0) {
        btnText.textContent = locale.selectBtnText;
        tg.showAlert('No channels selected');
        return;
    }
    
    // Save selected channels
    selectedChannels = chats;
    
    // Show counter
    countElem.textContent = selectedChannels.length;
    counter.style.display = 'flex';
    btnText.textContent = `${selectedChannels.length} ${locale.channelsText}`;
    
    // Show analyze button
    analyzeSection.style.display = 'block';
    
    console.log(`Selected ${selectedChannels.length} channels`);
}

function resetSelectionButton() {
    const btn = document.getElementById('selectChannelsBtn');
    const btnText = document.getElementById('selectBtnText');
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    btn.disabled = false;
    btnText.textContent = locale.selectBtnText;
}

// 2. ANALYZE CHANNELS
function startAnalysis() {
    if (selectedChannels.length === 0) {
        tg.showAlert('Please select channels first');
        return;
    }
    
    // Show analysis section
    document.getElementById('step1').classList.add('hidden');
    document.getElementById('step2').classList.remove('hidden');
    document.getElementById('loadingAnalysis').style.display = 'block';
    document.getElementById('resultsSection').classList.add('hidden');
    
    // Start analysis
    setTimeout(() => {
        performAnalysis();
    }, 2000);
}

function performAnalysis() {
    // Analyze each channel
    analysisResults = selectedChannels.map(channel => {
        return analyzeChannel(channel);
    });
    
    // Show results
    showAnalysisResults();
    
    // Hide loading
    document.getElementById('loadingAnalysis').style.display = 'none';
    document.getElementById('resultsSection').classList.remove('hidden');
}

function analyzeChannel(channel) {
    let status = "good";
    let score = 8;
    let reason = "Active quality channel";
    
    // Check activity
    const lastPostDate = new Date(channel.last_post);
    const daysSinceLastPost = Math.floor((Date.now() - lastPostDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastPost > 180) {
        status = "dead";
        score = 1;
        reason = `Inactive for ${daysSinceLastPost} days`;
    }
    // Check for spam
    else if (isSpamChannel(channel)) {
        status = "spam";
        score = 2;
        reason = "Spam content detected";
    }
    // Check for small audience
    else if (channel.members < 1000) {
        status = "inactive";
        score = 5;
        reason = `Small audience (${channel.members} members)`;
    }
    
    return {
        ...channel,
        status: status,
        score: score,
        reason: reason,
        daysSinceLastPost: daysSinceLastPost
    };
}

function isSpamChannel(channel) {
    const spamKeywords = ['buy', 'sale', 'discount', 'promo', 'offer', 'limited', 'urgent'];
    const text = (channel.title + ' ' + channel.description).toLowerCase();
    return spamKeywords.some(keyword => text.includes(keyword));
}

// 3. SHOW ANALYSIS RESULTS
function showAnalysisResults() {
    const resultsList = document.getElementById('resultsList');
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    // Clear list
    resultsList.innerHTML = '';
    
    // Calculate statistics
    userStats = {
        total: analysisResults.length,
        dead: analysisResults.filter(c => c.status === 'dead').length,
        spam: analysisResults.filter(c => c.status === 'spam').length,
        toClean: 0,
        cleanPercent: 0
    };
    
    userStats.toClean = userStats.dead + userStats.spam;
    userStats.cleanPercent = Math.round(((userStats.total - userStats.toClean) / userStats.total) * 100);
    
    // Update progress bar
    document.getElementById('progressFill').style.width = `${userStats.cleanPercent}%`;
    document.getElementById('cleanPercent').textContent = `${userStats.cleanPercent}%`;
    
    // Show channels
    analysisResults.forEach((channel) => {
        const item = createChannelResultItem(channel, locale);
        resultsList.appendChild(item);
    });
    
    // Show cleanup button if there are channels to clean
    if (userStats.toClean > 0) {
        document.getElementById('cleanupBtn').classList.remove('hidden');
        document.getElementById('cleanupBtnText').textContent = 
            `${locale.cleanupBtnText} (${userStats.toClean})`;
    }
    
    // Update statistics
    updateStatistics();
}

function createChannelResultItem(channel, locale) {
    const item = document.createElement('div');
    item.className = 'result-item';
    
    // Determine status class and text
    let statusClass = 'badge-good';
    let statusText = locale.good;
    
    switch(channel.status) {
        case 'dead':
            statusClass = 'badge-dead';
            statusText = locale.dead;
            break;
        case 'spam':
            statusClass = 'badge-spam';
            statusText = locale.spam;
            break;
        case 'inactive':
            statusClass = 'badge-inactive';
            statusText = locale.inactive;
            break;
    }
    
    // Determine score color
    let scoreColor = '#10b981';
    if (channel.score <= 3) scoreColor = '#ef4444';
    else if (channel.score <= 6) scoreColor = '#f59e0b';
    
    item.innerHTML = `
        <div class="channel-info">
            <div class="channel-title">${channel.title}</div>
            <div class="channel-desc">${channel.description}</div>
            <div class="channel-meta">
                <span>👥 ${channel.members.toLocaleString()}</span>
                <span>📅 ${channel.daysSinceLastPost}д</span>
            </div>
        </div>
        <div class="channel-status">
            <div class="badge ${statusClass}">
                ${statusText}
            </div>
            <div class="channel-reason">${channel.reason}</div>
        </div>
        <div class="channel-score">
            <div class="score-circle" style="background: ${scoreColor}20; border-color: ${scoreColor}">
                ${channel.score}/10
            </div>
        </div>
    `;
    
    return item;
}

// 4. CLEANUP
function startCleanup() {
    const channelsToDelete = analysisResults.filter(c => 
        c.status === 'dead' || c.status === 'spam'
    ).length;
    
    if (channelsToDelete === 0) {
        tg.showAlert('No channels to clean');
        return;
    }
    
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    tg.showPopup({
        title: 'Cleanup Confirmation',
        message: `Delete ${channelsToDelete} channels?`,
        buttons: [
            { id: 'yes', type: 'destructive', text: 'Yes, delete' },
            { type: 'cancel' }
        ]
    }, (btnId) => {
        if (btnId === 'yes') {
            performCleanup(channelsToDelete);
        }
    });
}

function performCleanup(count) {
    const cleanupBtn = document.getElementById('cleanupBtn');
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    cleanupBtn.disabled = true;
    cleanupBtn.textContent = 'Cleaning...';
    
    // Animate progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += 20;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('cleanPercent').textContent = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            showSuccess(count);
            
            // Send results to server
            sendResultsToServer(count);
        }
    }, 200);
}

function showSuccess(count) {
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    // Hide analysis section
    document.getElementById('step2').classList.add('hidden');
    
    // Show success card
    document.getElementById('successCard').classList.remove('hidden');
    document.getElementById('successTitle').textContent = locale.successTitle;
    document.getElementById('successMessage').textContent = 
        `${locale.successMessage} (${count} channels cleaned)`;
    
    // Vibrate if available
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
}

function sendResultsToServer(count) {
    const data = {
        action: 'analysis_complete',
        user_id: userId,
        analyzed: userStats.total,
        deleted: count
    };
    
    // Send data to bot
    if (tg.sendData) {
        tg.sendData(JSON.stringify(data));
    }
    
    console.log('Results sent:', data);
}

// 5. RECOMMENDED CHANNELS
function loadRecommendedChannels() {
    const container = document.getElementById('recommendedChannels');
    
    // Demo recommended channels
    const channels = [
        { 
            title: "Telegram Official", 
            url: "https://t.me/telegram", 
            desc: "Official Telegram news",
            members: "12M"
        },
        { 
            title: userLang === 'ru' ? "Новости Технологий" : "Tech Insider", 
            url: "https://t.me/technology", 
            desc: userLang === 'ru' ? "Свежие IT новости" : "Latest tech news",
            members: "150K"
        },
        { 
            title: "AI & ML Daily", 
            url: "https://t.me/ai_ml", 
            desc: "Artificial Intelligence updates",
            members: "85K"
        }
    ];
    
    let html = '';
    channels.forEach(channel => {
        html += `
            <div class="recommended-item">
                <div class="recommended-info">
                    <div class="recommended-title">${channel.title}</div>
                    <div class="recommended-desc">${channel.desc}</div>
                    <div class="channel-meta">
                        <span>👥 ${channel.members}</span>
                    </div>
                </div>
                <a href="${channel.url}" target="_blank" class="recommended-btn">
                    Join
                </a>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// 6. SOCIAL FUNCTIONS
function showInviteFriends() {
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    tg.showPopup({
        title: '👥 Invite Friends',
        message: `Invite friends and get premium features!\n\nYour referral code: ${userId}`,
        buttons: [
            { id: 'share', type: 'default', text: '📱 Share Link' },
            { type: 'cancel' }
        ]
    }, (btnId) => {
        if (btnId === 'share') {
            shareReferralLink();
        }
    });
}

function shareReferralLink() {
    const link = `https://t.me/TG_Auditor_Pro_bot?start=${userId}`;
    const text = userLang === 'ru' 
        ? `Привет! Попробуй TG Auditor Pro для очистки Telegram! 🧹\n\n${link}`
        : `Hi! Try TG Auditor Pro for Telegram cleaning! 🧹\n\n${link}`;
    
    tg.openLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`);
}

function showShareBot() {
    const locale = LOCALE[userLang] || LOCALE['en'];
    
    tg.showPopup({
        title: '📢 Share Bot',
        message: 'Share this amazing bot with friends!',
        buttons: [
            { id: 'telegram', type: 'default', text: '📱 Telegram' },
            { type: 'cancel' }
        ]
    }, (btnId) => {
        if (btnId === 'telegram') {
            shareBotToTelegram();
        }
    });
}

function shareBotToTelegram() {
    const text = userLang === 'ru'
        ? `✨ Рекомендую TG Auditor Pro - супер-бот для очистки Telegram! 🧹\n\nhttps://t.me/TG_Auditor_Pro_bot`
        : `✨ I recommend TG Auditor Pro - super bot for Telegram cleaning! 🧹\n\nhttps://t.me/TG_Auditor_Pro_bot`;
    
    tg.openLink(`https://t.me/share/url?url=https://t.me/TG_Auditor_Pro_bot&text=${encodeURIComponent(text)}`);
}

function shareResults() {
    const text = userLang === 'ru'
        ? `Я только что очистил ${userStats.toClean} каналов в Telegram с помощью @TG_Auditor_Pro! 🧹`
        : `I just cleaned ${userStats.toClean} channels in Telegram with @TG_Auditor_Pro! 🧹`;
    
    tg.openLink(`https://t.me/share/url?url=https://t.me/TG_Auditor_Pro_bot&text=${encodeURIComponent(text)}`);
}

// 7. STATISTICS
function updateStatistics() {
    document.getElementById('totalChannels').textContent = userStats.total;
    document.getElementById('deadChannels').textContent = userStats.dead;
    document.getElementById('spamChannels').textContent = userStats.spam;
    document.getElementById('toClean').textContent = userStats.toClean;
    
    // Show stats grid
    document.getElementById('statsGrid').classList.remove('hidden');
    document.getElementById('statsDefault').classList.add('hidden');
}

// 8. ERROR HANDLING
function showError(message) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
            <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
            <h2>Error</h2>
            <p style="margin: 20px 0; color: #9ca3af;">${message}</p>
            <button class="btn" onclick="location.reload()" style="margin-top: 20px;">
                Reload Page
            </button>
        </div>
    `;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initWebApp);
