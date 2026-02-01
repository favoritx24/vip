// Telegram WebApp объект
const tg = window.Telegram.WebApp;

// Получаем параметры из URL
const urlParams = new URLSearchParams(window.location.search);
const userLang = urlParams.get('lang') || 'en';
const userId = urlParams.get('user_id') || '0';

// Локализация
const LOCALE = {
    'ru': {
        'title': 'TG Auditor Pro',
        'subtitle': 'Очистите Telegram в 1 клик',
        'select_channels': '🗂 Выбрать каналы',
        'analyze': '🔍 Анализировать',
        'selected': 'Выбрано:',
        'analysis': 'Результаты анализа',
        'delete': '🗑️ Удалить выбранное',
        'recommended': '💎 Рекомендуемые каналы',
        'stats': '📈 Ваша статистика'
    },
    'en': {
        'title': 'TG Auditor Pro',
        'subtitle': 'Clean your Telegram in 1 click',
        'select_channels': '🗂 Select Channels',
        'analyze': '🔍 Analyze',
        'selected': 'Selected:',
        'analysis': 'Analysis Results',
        'delete': '🗑️ Delete Selected',
        'recommended': '💎 Recommended Channels',
        'stats': '📈 Your Stats'
    }
};

// Применяем локализацию
document.querySelector('h1').textContent = LOCALE[userLang].title;
document.querySelector('.subtitle').textContent = LOCALE[userLang].subtitle;
document.querySelector('#analysisCard h2').textContent = LOCALE[userLang].analysis;
document.querySelector('#recommendations h2').textContent = LOCALE[userLang].recommended;
document.querySelectorAll('.card h2')[2].textContent = LOCALE[userLang].stats;

// Инициализация
tg.expand();
tg.MainButton.setText(LOCALE[userLang].analyze).show();

// Глобальные переменные
let selectedChannels = [];
let analysisResults = [];

// Основные функции
function requestChannels() {
    document.getElementById('selectBtn').innerHTML = '🔄 ' + LOCALE[userLang].select_channels + '...';
    
    // Имитация выбора
    setTimeout(() => {
        selectedChannels = [
            { id: 1, title: "Test Channel 1", type: "channel", last_post: "2023-01-15" },
            { id: 2, title: "Tech News", type: "channel", last_post: "2024-02-20" },
            { id: 3, title: "Crypto Signals", type: "channel", last_post: "2023-11-10" },
            { id: 4, title: "Memes", type: "channel", last_post: "2024-02-25" }
        ];
        
        document.getElementById('selectBtn').innerHTML = '✅ ' + LOCALE[userLang].select_channels;
        document.getElementById('selectedCount').classList.remove('hidden');
        document.getElementById('count').textContent = selectedChannels.length;
        
        // Показываем кнопку анализа
        tg.MainButton.setText(`${LOCALE[userLang].analyze} ${selectedChannels.length} channels`);
        tg.MainButton.onClick(analyzeChannels);
        tg.MainButton.show();
    }, 1000);
}

function analyzeChannels() {
    tg.MainButton.hide();
    document.getElementById('selectBtn').style.display = 'none';
    
    // Показываем анимацию загрузки
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>AI is analyzing your channels...</p>
        </div>
    `;
    
    document.getElementById('analysisCard').classList.remove('hidden');
    
    // Имитация анализа
    setTimeout(() => {
        analysisResults = [
            { id: 1, title: "Test Channel 1", status: "dead", reason: "No posts for 400+ days", score: 1 },
            { id: 2, title: "Tech News", status: "good", reason: "Active, quality content", score: 9 },
            { id: 3, title: "Crypto Signals", status: "spam", reason: "90% promotional content", score: 3 },
            { id: 4, title: "Memes", status: "good", reason: "Regular updates", score: 8 }
        ];
        
        showResults();
        loadRecommendations();
    }, 2000);
}

function showResults() {
    const resultsDiv = document.getElementById('results');
    let html = '';
    
    analysisResults.forEach(channel => {
        let badgeClass = 'badge-good';
        if (channel.status === 'dead') badgeClass = 'badge-dead';
        if (channel.status === 'spam') badgeClass = 'badge-spam';
        
        html += `
            <div class="result-item">
                <div>
                    <strong>${channel.title}</strong><br>
                    <small>${channel.reason}</small>
                </div>
                <div class="badge ${badgeClass}">
                    ${channel.score}/10
                </div>
            </div>
        `;
    });
    
    resultsDiv.innerHTML = html;
    
    // Статистика
    const deadChannels = analysisResults.filter(c => c.status === 'dead').length;
    const spamChannels = analysisResults.filter(c => c.status === 'spam').length;
    
    document.getElementById('stats').innerHTML = `
        <p>📊 ${LOCALE[userLang].analysis}:</p>
        <p>• Total channels: ${analysisResults.length}</p>
        <p>• Dead channels: ${deadChannels}</p>
        <p>• Spam channels: ${spamChannels}</p>
        <p>• Recommended to delete: ${deadChannels + spamChannels}</p>
    `;
}

function showCleanup() {
    const deadChannels = analysisResults.filter(c => c.status === 'dead').length;
    const spamChannels = analysisResults.filter(c => c.status === 'spam').length;
    
    tg.showPopup({
        title: "Cleanup Confirmation",
        message: `Delete ${deadChannels + spamChannels} channels?`,
        buttons: [
            { id: 'yes', type: 'default', text: 'Yes, delete!' },
            { type: 'cancel' }
        ]
    }, (btnId) => {
        if (btnId === 'yes') {
            tg.showAlert("✅ Cleanup completed! Your Telegram is now cleaner.");
        }
    });
}

function loadRecommendations() {
    const channels = [
        { title: "Telegram Official", link: "https://t.me/telegram", desc: "Official Telegram channel" },
        { title: "Durov's Channel", link: "https://t.me/durov", desc: "Founder of Telegram" },
        { title: "Tech News", link: "https://t.me/tech", desc: "Latest tech updates" }
    ];
    
    let html = '';
    channels.forEach(channel => {
        html += `
            <div class="result-item">
                <div>
                    <strong>${channel.title}</strong><br>
                    <small>${channel.desc}</small>
                </div>
                <a href="${channel.link}" target="_blank" class="badge badge-good">
                    Join
                </a>
            </div>
        `;
    });
    
    document.getElementById('channelsList').innerHTML = html;
}

// Обновляем текст кнопки
document.getElementById('selectBtn').textContent = LOCALE[userLang].select_channels;
document.querySelector('#analysisCard button').textContent = LOCALE[userLang].delete;

// Загружаем рекомендации при старте
loadRecommendations();

// Сохраняем user_id в localStorage
localStorage.setItem('tg_user_id', userId);
