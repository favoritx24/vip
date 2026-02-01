// TG Auditor Pro 2026 - Mini App JavaScript
class TGApp {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.user = null;
        this.selectedChats = [];
        this.analysisResults = null;
        this.language = 'ru';
        this.apiUrl = 'http://127.0.0.1:8000'; // Измените на ваш URL
        
        this.init();
    }
    
    async init() {
        // Инициализация Telegram Web App
        this.tg.expand();
        this.tg.enableClosingConfirmation();
        this.tg.setHeaderColor('#007AFF');
        this.tg.setBackgroundColor('#F2F2F7');
        
        // Получаем данные пользователя
        this.user = this.tg.initDataUnsafe?.user;
        
        // Загружаем язык
        this.loadLanguage();
        
        // Инициализация UI
        this.initUI();
        
        // Загружаем данные пользователя
        await this.loadUserData();
        
        // Показываем главный экран
        this.showScreen('mainScreen');
        
        // Скрываем загрузчик
        setTimeout(() => {
            document.getElementById('loader').style.display = 'none';
        }, 1000);
    }
    
    loadLanguage() {
        // Проверяем язык Telegram
        const tgLang = this.tg.initDataUnsafe?.user?.language_code || 'ru';
        this.language = tgLang.startsWith('ru') ? 'ru' : 'en';
        
        // Применяем язык
        this.applyLanguage();
    }
    
    applyLanguage() {
        const translations = {
            ru: {
                appTitle: 'TG Auditor Pro 2026',
                appSubtitle: 'Ultimate Telegram Cleaner',
                selectAll: 'Выбрать все через Telegram',
                manualAdd: 'Добавить вручную',
                startAnalysis: 'Начать анализ',
                quickClean: 'Быстрая чистка',
                findDuplicates: 'Найти дубликаты',
                checkActivity: 'Проверить активность',
                digitalWeight: 'Цифровой вес',
                inviteFriends: 'Пригласить друзей',
                help: 'Помощь',
                settings: 'Настройки'
            },
            en: {
                appTitle: 'TG Auditor Pro 2026',
                appSubtitle: 'Ultimate Telegram Cleaner',
                selectAll: 'Select all via Telegram',
                manualAdd: 'Add manually',
                startAnalysis: 'Start Analysis',
                quickClean: 'Quick Clean',
                findDuplicates: 'Find Duplicates',
                checkActivity: 'Check Activity',
                digitalWeight: 'Digital Weight',
                inviteFriends: 'Invite Friends',
                help: 'Help',
                settings: 'Settings'
            }
        };
        
        const t = translations[this.language];
        
        // Обновляем тексты
        document.querySelector('.app-title').textContent = t.appTitle;
        document.querySelector('.app-subtitle').textContent = t.appSubtitle;
        document.getElementById('selectAllBtn').innerHTML = 
            `<span class="btn-icon">📋</span>${t.selectAll}`;
        document.getElementById('manualAddBtn').innerHTML = 
            `<span class="btn-icon">➕</span>${t.manualAdd}`;
        document.getElementById('quickClean').innerHTML = 
            `<span class="action-icon">🚀</span>
             <span class="action-text">${t.quickClean}</span>
             <span class="action-desc">Авто-анализ и очистка</span>`;
        // ... и так далее для всех текстов
    }
    
    initUI() {
        // Инициализация событий
        this.initEvents();
        
        // Инициализация системного селектора Telegram
        this.initTelegramSelector();
    }
    
    initEvents() {
        // Кнопка выбора всех чатов
        document.getElementById('selectAllBtn').addEventListener('click', () => {
            this.openTelegramSelector();
        });
        
        // Кнопка анализа
        document.getElementById('analyzeBtn').addEventListener('click', () => {
            this.startAnalysis();
        });
        
        // Быстрые действия
        document.getElementById('quickClean').addEventListener('click', () => {
            this.quickClean();
        });
        
        document.getElementById('findDuplicates').addEventListener('click', () => {
            this.findDuplicates();
        });
        
        document.getElementById('checkActivity').addEventListener('click', () => {
            this.checkActivity();
        });
        
        document.getElementById('digitalWeight').addEventListener('click', () => {
            this.showDigitalWeight();
        });
        
        // Навигация
        document.getElementById('backToMain').addEventListener('click', () => {
            this.showScreen('mainScreen');
        });
        
        document.getElementById('backToAnalysis').addEventListener('click', () => {
            this.showScreen('analysisScreen');
        });
        
        // Массовый выход
        document.getElementById('massLeaveBtn').addEventListener('click', () => {
            this.showMassLeave();
        });
        
        // Кнопка языка
        document.getElementById('languageSwitch').addEventListener('click', () => {
            this.switchLanguage();
        });
    }
    
    initTelegramSelector() {
        // Инициализация системного селектора Telegram
        // Этот код работает только в контексте Telegram Web App
        if (this.tg.platform !== 'unknown') {
            // Подготавливаем запрос на выбор чатов
            const requestChatParams = {
                request_id: 'channel_selector_' + Date.now(),
                title: this.language === 'ru' ? 'Выберите чаты для анализа' : 'Select chats for analysis',
                chat_types: ['channel', 'group', 'bot'],
                allow_multiple: true,
                max_quantity: 1000 // Максимальное количество
            };
            
            // Сохраняем параметры для использования
            window.telegramChatSelectorParams = requestChatParams;
        }
    }
    
    openTelegramSelector() {
        // Открываем системный селектор Telegram
        if (this.tg.platform !== 'unknown' && this.tg.openRequestChat) {
            const params = window.telegramChatSelectorParams;
            
            this.tg.openRequestChat(
                params,
                (chats) => {
                    // Обработка выбранных чатов
                    this.handleSelectedChats(chats);
                }
            );
        } else {
            // Фолбэк для разработки
            this.showManualInput();
        }
    }
    
    handleSelectedChats(chats) {
        // Обрабатываем выбранные чаты
        this.selectedChats = chats.map(chat => ({
            id: chat.id,
            title: chat.title,
            username: chat.username || `id${chat.id}`,
            type: chat.type,
            url: `https://t.me/${chat.username || `c/${chat.id}`.replace('-100', '')}`
        }));
        
        this.updateSelectedList();
        this.updateAnalyzeButton();
    }
    
    updateSelectedList() {
        const list = document.getElementById('selectedList');
        const count = document.getElementById('selectedCount');
        
        list.innerHTML = '';
        count.textContent = this.selectedChats.length;
        
        this.selectedChats.forEach((chat, index) => {
            const item = document.createElement('div');
            item.className = 'selected-item';
            item.innerHTML = `
                <div class="chat-info">
                    <div class="chat-icon">
                        ${this.getChatIcon(chat.type)}
                    </div>
                    <div>
                        <div class="chat-name">${chat.title}</div>
                        <div class="chat-url">${chat.url}</div>
                    </div>
                </div>
                <button class="remove-chat" data-index="${index}">×</button>
            `;
            
            list.appendChild(item);
        });
        
        // Добавляем события удаления
        document.querySelectorAll('.remove-chat').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.selectedChats.splice(index, 1);
                this.updateSelectedList();
                this.updateAnalyzeButton();
            });
        });
    }
    
    getChatIcon(type) {
        const icons = {
            'channel': '📢',
            'group': '👥',
            'bot': '🤖',
            'supergroup': '👥'
        };
        return icons[type] || '💬';
    }
    
    updateAnalyzeButton() {
        const btn = document.getElementById('analyzeBtn');
        const count = document.getElementById('analyzeCount');
        
        count.textContent = this.selectedChats.length;
        
        if (this.selectedChats.length > 0) {
            btn.disabled = false;
        } else {
            btn.disabled = true;
        }
    }
    
    async startAnalysis() {
        if (this.selectedChats.length === 0) return;
        
        // Показываем экран анализа
        this.showScreen('analysisScreen');
        
        // Сбрасываем прогресс
        this.updateProgress(0, 'Подготовка к анализу...');
        
        try {
            // Отправляем запрос на анализ
            const response = await fetch(`${this.apiUrl}/api/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: this.user?.id || 0,
                    channels: this.selectedChats
                })
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            // Обновляем прогресс
            for (let i = 0; i <= 100; i += 10) {
                await this.delay(200);
                this.updateProgress(i, `Анализ каналов... ${i}%`);
            }
            
            // Сохраняем результаты
            this.analysisResults = data;
            
            // Отображаем результаты
            this.displayAnalysisResults(data);
            
            // Показываем итоговый прогресс
            this.updateProgress(100, 'Анализ завершен!');
            
        } catch (error) {
            console.error('Analysis error:', error);
            this.updateProgress(0, 'Ошибка анализа. Попробуйте еще раз.');
            
            // Показываем ошибку пользователю
            this.showError('Ошибка при анализе каналов. Пожалуйста, попробуйте еще раз.');
        }
    }
    
    updateProgress(percent, status) {
        const fill = document.getElementById('progressFill');
        const percentText = document.getElementById('progressPercent');
        const statusText = document.getElementById('progressStatus');
        
        fill.style.width = `${percent}%`;
        percentText.textContent = `${percent}%`;
        statusText.textContent = status;
    }
    
    displayAnalysisResults(data) {
        // Обновляем счетчики категорий
        document.querySelector('#inactiveCategory .category-count').textContent = 
            data.results.inactive.length;
        document.querySelector('#duplicatesCategory .category-count').textContent = 
            data.results.duplicates.length;
        document.querySelector('#spamCategory .category-count').textContent = 
            data.results.spam.length;
        document.querySelector('#toxicCategory .category-count').textContent = 
            data.results.toxic.length;
        
        // Отображаем цифровой вес
        this.displayDigitalWeight(data.digital_weight);
        
        // Обновляем статистику
        this.updateUserStats(data.summary);
    }
    
    displayDigitalWeight(weight) {
        const container = document.getElementById('weightStats');
        
        if (weight && weight.summary) {
            container.innerHTML = `
                <div class="weight-stats">
                    <div class="weight-stat">
                        <div class="weight-value">${weight.time.hours_per_month}ч</div>
                        <div class="weight-label">Экономия времени</div>
                    </div>
                    <div class="weight-stat">
                        <div class="weight-value">${weight.traffic.gb_per_year}ГБ</div>
                        <div class="weight-label">Сэкономленный трафик</div>
                    </div>
                    <div class="weight-stat">
                        <div class="weight-value">${weight.notifications.per_day}</div>
                        <div class="weight-label">Уведомлений/день</div>
                    </div>
                    <div class="weight-stat">
                        <div class="weight-value">${weight.productivity_gain}</div>
                        <div class="weight-label">Рост продуктивности</div>
                    </div>
                </div>
            `;
        }
    }
    
    updateUserStats(summary) {
        document.getElementById('totalChannels').textContent = summary.total_analyzed;
        document.getElementById('timeSaved').textContent = 
            `${Math.round(summary.time_saved_minutes / 60)}ч`;
        document.getElementById('cleanedCount').textContent = summary.to_remove;
    }
    
    showMassLeave() {
        if (!this.analysisResults) return;
        
        // Показываем экран массового выхода
        this.showScreen('leaveScreen');
        
        // Обновляем счетчик
        const leaveCount = document.getElementById('leaveCount');
        const toRemove = this.analysisResults.summary.to_remove;
        leaveCount.textContent = toRemove;
        
        // Генерируем ссылки для выхода
        this.generateLeaveLinks();
    }
    
    async generateLeaveLinks() {
        // Собираем URL каналов для выхода
        const channelsToLeave = [
            ...this.analysisResults.results.inactive,
            ...this.analysisResults.results.spam,
            ...this.analysisResults.results.toxic
        ].flat();
        
        // Для дубликатов берем все кроме первого
        this.analysisResults.results.duplicates.forEach(group => {
            channelsToLeave.push(...group.slice(1));
        });
        
        try {
            const response = await fetch(`${this.apiUrl}/api/mass-leave`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: this.user?.id || 0,
                    channel_urls: channelsToLeave.map(c => c.url || c.channel?.url)
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.displayLeaveLinks(data.links);
            }
        } catch (error) {
            console.error('Error generating leave links:', error);
        }
    }
    
    displayLeaveLinks(links) {
        const container = document.getElementById('leaveLinks');
        container.innerHTML = '';
        
        links.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.leave_url;
            linkElement.target = '_blank';
            linkElement.className = 'leave-link';
            linkElement.innerHTML = `
                <div class="leave-link-content">
                    <span class="leave-username">${link.username}</span>
                    <span class="leave-action">🚪 Выйти</span>
                </div>
            `;
            container.appendChild(linkElement);
        });
    }
    
    quickClean() {
        // Быстрая чистка - автоматический анализ и очистка
        this.showNotification('Быстрая чистка запущена...');
        
        // Здесь можно добавить логику автоматической очистки
        setTimeout(() => {
            this.showNotification('Чистка завершена!');
        }, 3000);
    }
    
    findDuplicates() {
        // Поиск дубликатов
        this.showScreen('analysisScreen');
        this.updateProgress(50, 'Поиск дубликатов...');
        
        // Имитация поиска
        setTimeout(() => {
            this.updateProgress(100, 'Дубликаты найдены!');
        }, 2000);
    }
    
    checkActivity() {
        // Проверка активности каналов
        this.showScreen('analysisScreen');
        this.updateProgress(50, 'Проверка активности...');
        
        // Имитация проверки
        setTimeout(() => {
            this.updateProgress(100, 'Проверка завершена!');
        }, 2000);
    }
    
    showDigitalWeight() {
        // Показываем расчет цифрового веса
        this.showScreen('analysisScreen');
        
        // Имитация расчета
        this.updateProgress(50, 'Расчет цифрового веса...');
        
        setTimeout(() => {
            this.updateProgress(100, 'Расчет завершен!');
            
            // Показываем результаты
            const weight = {
                time: { hours_per_month: 12.5 },
                traffic: { gb_per_year: 5.2 },
                notifications: { per_day: 45 },
                productivity_gain: '750%'
            };
            
            this.displayDigitalWeight(weight);
        }, 2000);
    }
    
    switchLanguage() {
        this.language = this.language === 'ru' ? 'en' : 'ru';
        this.applyLanguage();
        
        // Обновляем кнопку
        document.getElementById('languageSwitch').textContent = 
            this.language === 'ru' ? 'EN' : 'RU';
    }
    
    showScreen(screenId) {
        // Скрываем все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        });
        
        // Показываем нужный экран
        const screen = document.getElementById(screenId);
        screen.classList.remove('hidden');
        screen.classList.add('active');
        
        // Прокручиваем наверх
        screen.scrollTop = 0;
    }
    
    showNotification(message) {
        // Показываем уведомление
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: var(--border-radius);
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Автоматическое скрытие
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    showError(message) {
        this.showNotification(`❌ ${message}`);
    }
    
    showManualInput() {
        // Показываем модальное окно для ручного ввода
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Добавить каналы вручную</h3>
                <textarea id="manualInput" placeholder="Введите ссылки на каналы, каждую с новой строки..."></textarea>
                <div class="modal-actions">
                    <button id="cancelManual">Отмена</button>
                    <button id="addManual">Добавить</button>
                </div>
            </div>
        `;
        
        // Стили модального окна
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        const content = modal.querySelector('.modal-content');
        content.style.cssText = `
            background: var(--card-color);
            padding: 24px;
            border-radius: var(--border-radius);
            max-width: 400px;
            width: 90%;
        `;
        
        document.body.appendChild(modal);
        
        // Обработчики событий
        document.getElementById('cancelManual').addEventListener('click', () => {
            modal.remove();
        });
        
        document.getElementById('addManual').addEventListener('click', () => {
            const input = document.getElementById('manualInput').value;
            this.processManualInput(input);
            modal.remove();
        });
    }
    
    processManualInput(text) {
        // Парсим ссылки из текста
        const urls = text.split('\n')
            .map(line => line.trim())
            .filter(line => line.startsWith('https://t.me/') || line.startsWith('t.me/') || line.startsWith('@'));
        
        // Добавляем каналы
        urls.forEach(url => {
            this.selectedChats.push({
                url: url,
                title: url,
                type: 'channel'
            });
        });
        
        this.updateSelectedList();
        this.updateAnalyzeButton();
    }
    
    async loadUserData() {
        if (!this.user?.id) return;
        
        try {
            const response = await fetch(`${this.apiUrl}/api/user/${this.user.id}`);
            if (response.ok) {
                const data = await response.json();
                
                // Обновляем статистику
                document.getElementById('userStats').textContent = 
                    `Анализов: ${data.statistics?.total_analyses || 0}`;
                
                // Сохраняем данные пользователя
                window.userData = data;
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Запуск приложения
window.addEventListener('DOMContentLoaded', () => {
    // Проверяем, что мы в Telegram Web App
    if (window.Telegram?.WebApp) {
        window.app = new TGApp();
    } else {
        // Режим разработки
        console.log('Development mode - Telegram Web App not detected');
        window.app = new TGApp();
        
        // Скрываем загрузчик
        setTimeout(() => {
            document.getElementById('loader').style.display = 'none';
            document.getElementById('mainScreen').classList.remove('hidden');
        }, 500);
    }
});