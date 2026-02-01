// Telegram WebApp объект
const tg = window.Telegram.WebApp;

// Инициализация
tg.expand(); // Раскрываем на весь экран
tg.MainButton.setText("Start Analysis").show();

// Глобальные переменные
let selectedChannels = [];
let analysisResults = [];

// Основные функции
function requestChannels() {
    // В реальной версии здесь будет tg.requestChat
    // Для теста эмулируем выбор
    
    document.getElementById('selectBtn').innerHTML = '🔄 Selecting...';
    
    // Имитация выбора (в реальности Telegram откроет системное окно)
    setTimeout(() => {
        // Тестовые данные
        selectedChannels = [
            { id: 1, title: "Test Channel 1", type: "channel", last_post: "2023-01-15" },
            { id: 2, title: "Tech News", type: "channel", last_post: "2024-02-20" },
            { id: 3, title: "Crypto Signals", type: "channel", last_post: "2023-11-10" },
            { id: 4, title: "Memes", type: "channel", last_post: "2024-02-25" }
        ];
        
        document.getElementById('selectBtn').innerHTML = '✅ Channels Selected';
        document.getElementById('selectedCount').classList.remove('hidden');
        document.getElementById('count').textContent = selectedChannels.length;
        
        // Показываем кнопку анализа
        tg.MainButton.setText(`Analyze ${selectedChannels.length} channels`);
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
        <p>📊 Analysis Complete:</p>
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
            // Здесь будет реальное удаление
        }
    });
}

function loadRecommendations() {
    // В реальности здесь запрос к бекенду
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

// Загружаем рекомендации при старте
loadRecommendations();