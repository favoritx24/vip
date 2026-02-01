// ============================================
// ФАЙЛ: js/analysis-service.js
// Анализ каналов с прогресс-баром
// ============================================

class AnalysisService {
  constructor() {
    this.currentTaskId = null;
    this.progressInterval = null;
    this.isAnalyzing = false;
  }

  // Начать анализ выбранных каналов
  async startAnalysis() {
    if (this.isAnalyzing) {
      showNotification('Анализ уже выполняется', 'warning');
      return;
    }
    
    const selectedChannels = window.channelManager.getSelectedChannels();
    
    if (selectedChannels.length === 0) {
      showNotification('Выберите хотя бы один канал для анализа', 'warning');
      return;
    }
    
    this.isAnalyzing = true;
    
    // Показываем прогресс-бар
    this.showProgressOverlay();
    
    // Имитируем анализ (в реальности здесь будет API запрос)
    this.simulateAnalysis(selectedChannels);
  }

  // Показать прогресс-бар
  showProgressOverlay() {
    const overlay = document.getElementById('progress-overlay');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (overlay && progressFill && progressText) {
      overlay.style.display = 'flex';
      progressFill.style.width = '0%';
      progressText.textContent = '0/0 ' + window.i18n.t('channels');
    }
  }

  // Скрыть прогресс-бар
  hideProgressOverlay() {
    const overlay = document.getElementById('progress-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }

  // Обновить прогресс-бар
  updateProgress(current, total) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (progressFill && progressText) {
      const percentage = (current / total) * 100;
      progressFill.style.width = `${percentage}%`;
      progressText.textContent = `${current}/${total} ${window.i18n.t('channels')}`;
    }
  }

  // Имитация анализа (замените на реальный API)
  async simulateAnalysis(channelIds) {
    const total = channelIds.length;
    let current = 0;
    
    // Обновляем каждую секунду
    const interval = setInterval(() => {
      current++;
      this.updateProgress(current, total);
      
      if (current >= total) {
        clearInterval(interval);
        
        // Завершаем анализ через 1 секунду
        setTimeout(() => {
          this.completeAnalysis();
        }, 1000);
      }
    }, 1000);
  }

  // Завершение анализа
  completeAnalysis() {
    this.isAnalyzing = false;
    this.hideProgressOverlay();
    
    // Показываем результаты
    const results = {
      analyzed: window.channelManager.selectedChannels.size,
      threats_found: Math.floor(Math.random() * 5),
      recommendations: [
        'Рекомендуется выйти из 3 подозрительных каналов',
        'Обнаружены спам-боты в 2 каналах',
        'Повысьте безопасность: включите двухфакторную аутентификацию'
      ]
    };
    
    this.showResultsModal(results);
  }

  // Показать модальное окно с результатами
  showResultsModal(results) {
    const modalTitle = 'Результаты анализа';
    const modalBody = `
      <div class="analysis-results">
        <div class="result-item success">
          <strong>✅ Проанализировано каналов:</strong> ${results.analyzed}
        </div>
        
        <div class="result-item ${results.threats_found > 0 ? 'warning' : 'success'}">
          <strong>${results.threats_found > 0 ? '⚠️' : '✅'} Обнаружено угроз:</strong> ${results.threats_found}
        </div>
        
        <div class="recommendations">
          <h4>Рекомендации:</h4>
          <ul>
            ${results.recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
        
        <div class="actions">
          <button class="btn-analyze" onclick="quickCleanup()">
            ${window.i18n.getIcon('delete')} Быстрая очистка
          </button>
          <button class="btn-load-more" onclick="closeModal()">
            Закрыть
          </button>
        </div>
      </div>
    `;
    
    showModal(modalTitle, modalBody);
  }
}

// Создаем глобальный сервис анализа
window.analysisService = new AnalysisService();

// Функция для быстрой очистки
function quickCleanup() {
  const selected = window.channelManager.getSelectedChannels();
  
  if (selected.length === 0) {
    showNotification('Нет выбранных каналов для очистки', 'warning');
    return;
  }
  
  if (confirm(`Вы уверены, что хотите выйти из ${selected.length} каналов?`)) {
    // Имитация очистки
    selected.forEach(channelId => {
      window.channelManager.leaveChannel(channelId);
    });
    
    showNotification(`Выполнен выход из ${selected.length} каналов`, 'success');
    closeModal();
  }
}
