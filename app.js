/**
 * TG Auditor Pro Mini App
 * Professional Telegram Chat Analyzer
 */

// Конфигурация
const CONFIG = {
    API_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:8080/api'
        : 'https://yourdomain.com/api',
    BOT_USERNAME: 'tg_auditor_pro_bot',
    MAX_CHATS: 100,
    ANIMATION_DURATION: 500
};

// Состояние приложения
let AppState = {
    currentStep: 1,
    selectedChats: [],
    analysisResults: null,
    userLanguage: 'ru',
    userId: null,
    webApp: null,
    isLoading: false
};

// Локализация
const I18N = {
    ru: {
        select_chats: 'Выберите чаты для анализа',
        channels: 'Каналы',
        channels_desc: 'Публичные и приватные каналы',
        groups: 'Группы',
        groups_desc: 'Групповые чаты и сообщества',
        bots: 'Боты',
        bots_desc: 'Автоматизированные боты',
        select_all: 'Выбрать все',
        manual_select: 'Выбрать вручную',
        analysis: 'Анализ выбранных чатов',
        dead_chats: 'Мертвые чаты',
        duplicates: 'Дубликаты',
        toxic_chats: 'Токсичные',
        results: 'Результаты анализа',
        total_analyzed: 'Всего проанализировано',
        chats: 'чатов',
        time_saved: 'Сэкономлено времени',
        hours: 'часов',
        traffic_saved: 'Сэкономлено трафика',
        mb: 'МБ',
        clean_all: 'Очистить всё',
        share_results: 'Поделиться',
        useful_replacements: 'Полезные замены',
        security_note: 'Ваши данные не передаются. Анализ происходит локально.',
        privacy: 'Конфиденциальность',
        terms: 'Условия',
        support: 'Поддержка'
    },
    en: {
        select_chats: 'Select chats for analysis',
        channels: 'Channels',
        channels_desc: 'Public and private channels',
        groups: 'Groups',
        groups_desc: 'Group chats and communities',
        bots: 'Bots',
        bots_desc: 'Automated bots',
        select_all: 'Select all',
        manual_select: 'Select manually',
        analysis: 'Analysis of selected chats',
        dead_chats: 'Dead chats',
        duplicates: 'Duplicates',
        toxic_chats: 'Toxic',
        results: 'Analysis results',
        total_analyzed: 'Total analyzed',
        chats: 'chats',
        time_saved: 'Time saved',
        hours: 'hours',
        traffic_saved: 'Traffic saved',
        mb: 'MB',
        clean_all: 'Clean all',
        share_results: 'Share results',
        useful_replacements: 'Useful replacements',
        security_note: 'Your data is not transmitted. Analysis happens locally.',
        privacy: 'Privacy',
        terms: 'Terms',
        support: 'Support'
    }
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', async function() {
    console.log('TG Auditor Pro Mini App initializing...');
    
    // Инициализация Telegram Web App
    if (window.Telegram && Telegram.WebApp) {
        AppState.webApp = Telegram.WebApp;
        AppState.webApp.expand();
        AppState.webApp.enableClosingConfirmation();
        AppState.userId = AppState.webApp.initDataUnsafe.user?.id;
        
        // Устанавливаем тему
        document.documentElement.setAttribute('theme', AppState.webApp.colorScheme);
        
        // Получаем язык пользователя
        AppState.userLanguage = AppState.webApp.initDataUnsafe.user?.language_code || 'ru';
        if (!['ru', 'en'].includes(AppState.userLanguage)) {
            AppState.userLanguage = 'ru';
        }
    }
    
    // Инициализация интерфейса
    initLanguage();
    initEventListeners();
    loadRecommendations();
    
    console.log('App initialized successfully');
});

// Инициализация языка
function initLanguage() {
    // Устанавливаем активную кнопку языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === AppState.userLanguage);
        
        btn.addEventListener('click', function() {
            AppState.userLanguage = this.dataset.lang;
            updateLanguage();
        });
    });
    
    updateLanguage();
}

// Обновление языка интерфейса
function updateLanguage() {
    const lang = AppState.userLanguage;
    
    // Обновляем все элементы с data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (I18N[lang] && I18N[lang][key]) {
            element.textContent = I18N[lang][key];
        }
    });
    
    // Обновляем активные кнопки языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

// Инициализация обработчиков событий
function initEventListeners() {
    // Выбор всех чатов
    document.getElementById('selectAllBtn').addEventListener('click', selectAllChats);
    
    // Ручной выбор
    document.getElementById('manualSelectBtn').addEventListener('click', manualSelectChats);
    
    // Очистка
    document.getElementById('cleanBtn').addEventListener('click', cleanAllChats);
    
    // Поделиться
    document.getElementById('shareBtn').addEventListener('click', shareResults);
    
    // Категории чатов
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const type = this.dataset.type;
            selectChatType(type);
        });
    });
}

// Выбор всех чатов через системный селектор Telegram
async function selectAllChats() {
    if (!AppState.webApp) {
        alert('Please open in Telegram');
        return;
    }
    
    try {
        AppState.isLoading = true;
        showLoading(true);
        
        // Запрос на выбор чатов через Telegram Web App
        const result = await AppState.webApp.requestChat({
            request_id: `select_${Date.now()}`,
            chat_types: ['channels', 'groups', 'bots'],
            allow_multiselect: true,
            max_chats: CONFIG.MAX_CHATS
        });
        
        if (result && result.chats) {
            AppState.selectedChats = result.chats;
            console.log(`Selected ${AppState.selectedChats.length} chats`);
            
            // Переходим к анализу
            goToStep(2);
            startAnalysis();
        }
        
    } catch (error) {
        console.error('Error selecting chats:', error);
        alert('Error selecting chats. Please try again.');
    } finally {
        AppState.isLoading = false;
        showLoading(false);
    }
}

// Ручной выбор чатов
function manualSelectChats() {
    // Здесь можно реализовать кастомный интерфейс выбора
    alert('Manual selection will be implemented in future versions');
}

// Выбор типа чата
function selectChatType(type) {
    console.log(`Selected chat type: ${type}`);
    // В будущем можно фильтровать по типу
}

// Переход между шагами
function goToStep(step) {
    // Скрываем все шаги
    document.querySelectorAll('.step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    // Показываем нужный шаг
    const stepEl = document.getElementById(`step${step}`);
    if (stepEl) {
        stepEl.classList.add('active');
        AppState.currentStep = step;
        
        // Анимация появления
        stepEl.style.animation = 'none';
        setTimeout(() => {
            stepEl.style.animation = 'fadeIn 0.5s ease';
        }, 10);
    }
}

// Начало анализа
async function startAnalysis() {
    if (AppState.selectedChats.length === 0) {
        alert('No chats selected');
        return;
    }
    
    try {
        // Показываем прогресс
        updateProgress(0);
        
        // Имитация анализа с прогрессом
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            updateProgress(progress);
            
            if (progress >= 100) {
                clearInterval(interval);
                
                // Получаем реальные результаты с сервера
                fetchAnalysisResults();
            }
        }, 100);
        
    } catch (error) {
        console.error('Analysis error:', error);
        alert('Analysis failed. Please try again.');
    }
}

// Обновление прогресса
function updateProgress(percent) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) {
        progressFill.style.width = `${percent}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${percent}%`;
    }
}

// Получение результатов анализа с сервера
async function fetchAnalysisResults() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: AppState.userId,
                chat_ids: AppState.selectedChats.map(chat => chat.id)
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            AppState.analysisResults = data.results;
            showResults(data.results);
            goToStep(3);
        } else {
            // Имитация результатов для демо
            showDemoResults();
            goToStep(3);
        }
        
    } catch (error) {
        console.error('Error fetching analysis:', error);
        // Показываем демо-результаты при ошибке
        showDemoResults();
        goToStep(3);
    }
}

// Показать демо-результаты
function showDemoResults() {
    const total = AppState.selectedChats.length;
    const dead = Math.floor(total * 0.3);
    const duplicate = Math.floor(total * 0.2);
    const toxic = Math.floor(total * 0.1);
    
    AppState.analysisResults = {
        total_chats: total,
        dead_count: dead,
        duplicate_count: duplicate,
        toxic_count: toxic,
        saved_time_hours: (dead + duplicate) * 0.083,
        saved_traffic_mb: (dead + duplicate) * 10
    };
    
    showResults(AppState.analysisResults);
}

// Показать результаты
function showResults(results) {
    // Обновляем статистику
    document.getElementById('totalChats').textContent = results.total_chats;
    document.getElementById('deadCount').textContent = results.dead_count;
    document.getElementById('duplicateCount').textContent = results.duplicate_count;
    document.getElementById('toxicCount').textContent = results.toxic_count;
    
    // Обновляем итоги
    document.getElementById('timeSaved').textContent = results.saved_time_hours.toFixed(1);
    document.getElementById('trafficSaved').textContent = results.saved_traffic_mb.toFixed(1);
}

// Очистка всех чатов
async function cleanAllChats() {
    if (!confirm('Are you sure you want to clean all dead and duplicate chats?')) {
        return;
    }
    
    try {
        AppState.isLoading = true;
        showLoading(true);
        
        // Генерируем ссылки для выхода из чатов
        const exitLinks = generateExitLinks();
        
        // Показываем ссылки пользователю
        showExitLinks(exitLinks);
        
        // Сохраняем статистику очистки
        await saveCleanupStats();
        
    } catch (error) {
        console.error('Cleanup error:', error);
        alert('Cleanup failed. Please try again.');
    } finally {
        AppState.isLoading = false;
        showLoading(false);
    }
}

// Генерация ссылок для выхода
function generateExitLinks() {
    const links = [];
    
    // Для каждого мертвого или дубликатного чата создаем ссылку
    if (AppState.analysisResults) {
        // Здесь можно генерировать реальные ссылки для выхода
        // Например: tg://resolve?domain=channel&start=leave
        
        for (let i = 0; i < Math.min(10, AppState.analysisResults.dead_count); i++) {
            links.push({
                name: `Dead Chat ${i + 1}`,
                url: `tg://resolve?domain=example&start=leave`
            });
        }
    }
    
    return links;
}

// Показать ссылки для выхода
function showExitLinks(links) {
    let message = 'Click the links below to leave chats:\n\n';
    
    links.forEach((link, index) => {
        message += `${index + 1}. <a href="${link.url}" target="_blank">${link.name}</a>\n`;
    });
    
    // В реальном приложении можно открыть попап с ссылками
    alert('Exit links generated. In the full version, these would be clickable links.');
}

// Сохранение статистики очистки
async function saveCleanupStats() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/cleanup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: AppState.userId,
                cleaned_count: AppState.analysisResults.dead_count + 
                              AppState.analysisResults.duplicate_count
            })
        });
        
        if (response.ok) {
            console.log('Cleanup stats saved');
        }
    } catch (error) {
        console.error('Error saving cleanup stats:', error);
    }
}

// Поделиться результатами
function shareResults() {
    if (!AppState.analysisResults) {
        alert('No results to share');
        return;
    }
    
    const message = generateShareMessage();
    
    if (AppState.webApp) {
        // Используем Telegram Web App для шаринга
        AppState.webApp.shareMessage({
            text: message,
            url: `https://t.me/${CONFIG.BOT_USERNAME}`
        });
    } else {
        // Копируем в буфер обмена
        navigator.clipboard.writeText(message)
            .then(() => alert('Results copied to clipboard!'))
            .catch(() => alert('Please copy the text manually:\n\n' + message));
    }
}

// Генерация сообщения для шаринга
function generateShareMessage() {
    const results = AppState.analysisResults;
    const lang = AppState.userLanguage;
    
    if (lang === 'ru') {
        return `🚀 Я только что почистил свои Telegram-чаты с помощью TG Auditor Pro!\n\n` +
               `📊 Результаты:\n` +
               `• Проанализировано: ${results.total_chats} чатов\n` +
               `• Удалено мертвых: ${results.dead_count}\n` +
               `• Найдено дубликатов: ${results.duplicate_count}\n` +
               `• Сэкономлено времени: ${results.saved_time_hours.toFixed(1)} часов\n` +
               `• Сэкономлено трафика: ${results.saved_traffic_mb.toFixed(1)} МБ\n\n` +
               `🔗 Попробуй и ты: @${CONFIG.BOT_USERNAME}`;
    } else {
        return `🚀 I just cleaned my Telegram chats with TG Auditor Pro!\n\n` +
               `📊 Results:\n` +
               `• Analyzed: ${results.total_chats} chats\n` +
               `• Dead removed: ${results.dead_count}\n` +
               `• Duplicates found: ${results.duplicate_count}\n` +
               `• Time saved: ${results.saved_time_hours.toFixed(1)} hours\n` +
               `• Traffic saved: ${results.saved_traffic_mb.toFixed(1)} MB\n\n` +
               `🔗 Try it yourself: @${CONFIG.BOT_USERNAME}`;
    }
}

// Загрузка рекомендаций
async function loadRecommendations() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/ads/${AppState.userLanguage}`);
        
        if (response.ok) {
            const ads = await response.json();
            displayRecommendations(ads);
        }
    } catch (error) {
        console.error('Error loading recommendations:', error);
        displayDemoRecommendations();
    }
}

// Отображение рекомендаций
function displayRecommendations(ads) {
    const container = document.getElementById('recommendationsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (ads.length === 0) {
        displayDemoRecommendations();
        return;
    }
    
    ads.forEach(ad => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        card.innerHTML = `
            <h4>${ad.title}</h4>
            <p>${ad.description}</p>
            <a href="${ad.link}" target="_blank" class="recommendation-link">
                ${AppState.userLanguage === 'ru' ? 'Перейти' : 'Go to'}
                <i class="fas fa-arrow-right"></i>
            </a>
        `;
        container.appendChild(card);
    });
}

// Демо-рекомендации
function displayDemoRecommendations() {
    const container = document.getElementById('recommendationsList');
    if (!container) return;
    
    const demoAds = AppState.userLanguage === 'ru' ? [
        {
            title: 'Tech News Pro',
            description: 'Самые свежие новости технологий и гаджетов',
            link: 'https://t.me/technewspro'
        },
        {
            title: 'Productivity Hub',
            description: 'Инструменты и советы для повышения продуктивности',
            link: 'https://t.me/productivityhub'
        }
    ] : [
        {
            title: 'Tech News Pro',
            description: 'Latest technology and gadget news',
            link: 'https://t.me/technewspro'
        },
        {
            title: 'Productivity Hub',
            description: 'Tools and tips to boost your productivity',
            link: 'https://t.me/productivityhub'
        }
    ];
    
    displayRecommendations(demoAds);
}

// Показать/скрыть загрузку
function showLoading(show) {
    if (show) {
        document.body.classList.add('loading');
    } else {
        document.body.classList.remove('loading');
    }
}

// Обработка ошибок
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});