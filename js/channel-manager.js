// ============================================
// ФАЙЛ: js/channel-manager.js
// Управление каналами: загрузка, выбор, действия
// ============================================

class ChannelManager {
  constructor() {
    this.allChannels = []; // Все каналы
    this.selectedChannels = new Set(); // Выбранные каналы
    this.displayedChannels = 20; // Сколько показывать сначала
    this.isLoading = false;
  }

  // Загружаем каналы (заглушка - в реальности с API)
  async loadChannels() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    const container = document.getElementById('channels-container');
    container.innerHTML = '<div class="loading">' + window.i18n.t('loading') + '</div>';
    
    try {
      // Имитация загрузки с API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Заглушка с тестовыми данными
      this.allChannels = this.generateMockChannels(50); // 50 тестовых каналов
      
      // Показываем первые N каналов
      this.displayChannels();
      
    } catch (error) {
      console.error('Error loading channels:', error);
      container.innerHTML = '<div class="error">Ошибка загрузки каналов</div>';
    } finally {
      this.isLoading = false;
    }
  }

  // Генерация тестовых каналов (удалите когда будет реальное API)
  generateMockChannels(count) {
    const channels = [];
    const names = [
      'Новости Telegram', 'Криптовалюты', 'IT Новости', 'Мемы', 'Спорт',
      'Кулинария', 'Путешествия', 'Технологии', 'Игры', 'Кино',
      'Музыка', 'Книги', 'Образование', 'Здоровье', 'Бизнес',
      'Дизайн', 'Фотография', 'Искусство', 'Наука', 'Юмор'
    ];
    
    for (let i = 1; i <= count; i++) {
      channels.push({
        id: `channel_${i}`,
        name: `${names[i % names.length]} ${Math.floor(i / 10) + 1}`,
        members_count: Math.floor(Math.random() * 10000) + 100,
        is_member: Math.random() > 0.3
      });
    }
    
    return channels;
  }

  // Отображаем каналы
  displayChannels() {
    const container = document.getElementById('channels-container');
    const channelsToShow = this.allChannels.slice(0, this.displayedChannels);
    
    if (channelsToShow.length === 0) {
      container.innerHTML = '<div class="loading">Нет каналов для отображения</div>';
      return;
    }
    
    container.innerHTML = '';
    
    channelsToShow.forEach(channel => {
      const channelElement = this.createChannelElement(channel);
      container.appendChild(channelElement);
    });
    
    // Кнопка "Загрузить еще" если есть еще каналы
    if (this.displayedChannels < this.allChannels.length) {
      this.addLoadMoreButton(container);
    }
    
    // Обновляем счетчик выбранных
    this.updateSelectedCount();
  }

  // Создаем HTML элемент канала
  createChannelElement(channel) {
    const isSelected = this.selectedChannels.has(channel.id);
    
    const div = document.createElement('div');
    div.className = `channel-item ${isSelected ? 'selected' : ''}`;
    div.dataset.channelId = channel.id;
    
    div.innerHTML = `
      <input type="checkbox" class="channel-checkbox" 
             ${isSelected ? 'checked' : ''}
             onchange="window.channelManager.toggleChannel('${channel.id}')">
      
      <div class="channel-info">
        <span class="channel-name">${channel.name}</span>
        <span class="channel-members">${channel.members_count} участников</span>
      </div>
      
      <div class="channel-actions">
        <button class="btn-channel-action btn-leave" 
                onclick="window.channelManager.leaveChannel('${channel.id}')"
                title="${window.i18n.t('leave')}">
          ${window.i18n.getIcon('exit')} ${window.i18n.t('leave')}
        </button>
        <button class="btn-channel-action btn-block" 
                onclick="window.channelManager.blockChannel('${channel.id}')"
                title="${window.i18n.t('block')}">
          ${window.i18n.getIcon('block')} ${window.i18n.t('block')}
        </button>
        <button class="btn-channel-action btn-delete" 
                onclick="window.channelManager.deleteHistory('${channel.id}')"
                title="${window.i18n.t('delete_history')}">
          ${window.i18n.getIcon('delete')} ${window.i18n.t('delete_history')}
        </button>
      </div>
    `;
    
    return div;
  }

  // Добавляем кнопку "Загрузить еще"
  addLoadMoreButton(container) {
    const button = document.createElement('button');
    button.className = 'btn-load-more';
    button.textContent = window.i18n.t('load_more');
    button.onclick = () => {
      this.displayedChannels += 20;
      this.displayChannels();
    };
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginTop = '15px';
    buttonContainer.appendChild(button);
    container.appendChild(buttonContainer);
  }

  // Переключить выбор канала
  toggleChannel(channelId) {
    if (this.selectedChannels.has(channelId)) {
      this.selectedChannels.delete(channelId);
    } else {
      this.selectedChannels.add(channelId);
    }
    
    // Обновляем стиль элемента
    const element = document.querySelector(`[data-channel-id="${channelId}"]`);
    if (element) {
      element.classList.toggle('selected');
      const checkbox = element.querySelector('.channel-checkbox');
      if (checkbox) {
        checkbox.checked = this.selectedChannels.has(channelId);
      }
    }
    
    this.updateSelectedCount();
  }

  // Выбрать все каналы
  selectAllChannels() {
    const currentChannels = this.allChannels.slice(0, this.displayedChannels);
    currentChannels.forEach(channel => {
      this.selectedChannels.add(channel.id);
    });
    
    this.displayChannels(); // Перерисовываем
  }

  // Снять все выделения
  deselectAllChannels() {
    this.selectedChannels.clear();
    this.displayChannels(); // Перерисовываем
  }

  // Обновить счетчик выбранных
  updateSelectedCount() {
    const element = document.getElementById('selected-count');
    if (element) {
      element.textContent = window.i18n.t('channels_selected', { 
        count: this.selectedChannels.size 
      });
    }
  }

  // Выйти из канала
  async leaveChannel(channelId) {
    if (!confirm(window.i18n.t('confirm_leave'))) return;
    
    try {
      // Здесь будет API запрос
      console.log('Leaving channel:', channelId);
      
      // Имитация запроса
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Показываем уведомление
      showNotification(window.i18n.t('left_successfully'), 'success');
      
      // Обновляем список (убираем канал)
      this.allChannels = this.allChannels.filter(ch => ch.id !== channelId);
      this.selectedChannels.delete(channelId);
      this.displayChannels();
      
    } catch (error) {
      console.error('Error leaving channel:', error);
      showNotification('Ошибка при выходе из канала', 'error');
    }
  }

  // Заблокировать канал
  async blockChannel(channelId) {
    if (!confirm(window.i18n.t('confirm_block'))) return;
    
    try {
      // Здесь будет API запрос
      console.log('Blocking channel:', channelId);
      
      // Имитация запроса
      await new Promise(resolve => setTimeout(resolve, 500));
      
      showNotification(window.i18n.t('blocked_successfully'), 'success');
      
    } catch (error) {
      console.error('Error blocking channel:', error);
      showNotification('Ошибка при блокировке канала', 'error');
    }
  }

  // Удалить историю
  async deleteHistory(channelId) {
    try {
      // Здесь будет API запрос
      console.log('Deleting history for channel:', channelId);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      showNotification('История удалена', 'success');
      
    } catch (error) {
      console.error('Error deleting history:', error);
      showNotification('Ошибка при удалении истории', 'error');
    }
  }

  // Получить выбранные каналы
  getSelectedChannels() {
    return Array.from(this.selectedChannels);
  }
}

// Создаем глобальный менеджер каналов
window.channelManager = new ChannelManager();

// Загружаем каналы при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.channelManager.loadChannels();
  }, 500);
});
