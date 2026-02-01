import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Trash2, CheckCircle, XCircle,
  AlertTriangle, Users, BarChart3, Download,
  Share2, Filter, ChevronDown, ChevronUp,
  Sparkles, Zap, Shield, Clock
} from 'lucide-react';

const Results = ({ results, onBack, language }) => {
  const [selectedChats, setSelectedChats] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  
  const translations = {
    ru: {
      results: "Результаты анализа",
      summary: "Сводка",
      totalScanned: "Всего просканировано",
      recommendedDelete: "Рекомендуется удалить",
      deadChats: "Мёртвые чаты",
      toxicChats: "Токсичные чаты",
      duplicates: "Дубликаты",
      savedSpace: "Сэкономлено места",
      chatList: "Список чатов",
      selectAll: "Выбрать всё",
      deleteSelected: "Удалить выбранное",
      keepSelected: "Оставить выбранное",
      muteSelected: "Заглушить выбранное",
      details: "Подробности",
      hideDetails: "Скрыть подробности",
      category: "Категория",
      members: "Участники",
      activity: "Активность",
      toxicity: "Токсичность",
      recommendation: "Рекомендация",
      keep: "Оставить",
      delete: "Удалить",
      mute: "Заглушить",
      congratulations: "Поздравляем!",
      cleanupComplete: "Очистка завершена",
      shareResults: "Поделиться результатами",
      exportData: "Экспорт данных",
      nextCleanup: "Следующая очистка через",
      days: "дней",
    },
    en: {
      results: "Analysis Results",
      summary: "Summary",
      totalScanned: "Total scanned",
      recommendedDelete: "Recommended to delete",
      deadChats: "Dead chats",
      toxicChats: "Toxic chats",
      duplicates: "Duplicates",
      savedSpace: "Space saved",
      chatList: "Chat list",
      selectAll: "Select all",
      deleteSelected: "Delete selected",
      keepSelected: "Keep selected",
      muteSelected: "Mute selected",
      details: "Details",
      hideDetails: "Hide details",
      category: "Category",
      members: "Members",
      activity: "Activity",
      toxicity: "Toxicity",
      recommendation: "Recommendation",
      keep: "Keep",
      delete: "Delete",
      mute: "Mute",
      congratulations: "Congratulations!",
      cleanupComplete: "Cleanup complete",
      shareResults: "Share results",
      exportData: "Export data",
      nextCleanup: "Next cleanup in",
      days: "days",
    }
  };
  
  const t = translations[language];
  
  if (!results) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No results</h2>
          <button
            onClick={onBack}
            className="btn-primary mt-4"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }
  
  const stats = [
    { 
      label: t.totalScanned, 
      value: results.total, 
      icon: <BarChart3 size={20} />,
      color: 'blue'
    },
    { 
      label: t.recommendedDelete, 
      value: results.recommendedDelete, 
      icon: <Trash2 size={20} />,
      color: 'red'
    },
    { 
      label: t.deadChats, 
      value: results.dead, 
      icon: <XCircle size={20} />,
      color: 'gray'
    },
    { 
      label: t.savedSpace, 
      value: `${(results.recommendedDelete * 2.5).toFixed(1)} MB`, 
      icon: <Download size={20} />,
      color: 'green'
    },
  ];
  
  const toggleSelectAll = () => {
    if (selectedChats.length === results.chats.length) {
      setSelectedChats([]);
    } else {
      setSelectedChats(results.chats.map(chat => chat.id));
    }
  };
  
  const toggleChatSelection = (chatId) => {
    setSelectedChats(prev => 
      prev.includes(chatId)
        ? prev.filter(id => id !== chatId)
        : [...prev, chatId]
    );
  };
  
  const getActionButton = (action) => {
    switch(action) {
      case 'delete':
        return <span className="text-red-400 flex items-center"><Trash2 size={16} className="mr-1" /> {t.delete}</span>;
      case 'keep':
        return <span className="text-green-400 flex items-center"><CheckCircle size={16} className="mr-1" /> {t.keep}</span>;
      case 'mute':
        return <span className="text-yellow-400 flex items-center"><Shield size={16} className="mr-1" /> {t.mute}</span>;
      default:
        return action;
    }
  };
  
  return (
    <div className="min-h-screen p-4 pb-24">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">{t.results}</h1>
        <div className="w-10" /> {/* Пустой элемент для выравнивания */}
      </div>
      
      {/* Статистика */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="grid grid-cols-2 gap-4 mb-8"
      >
        {stats.map((stat, index) => (
          <div 
            key={stat.label}
            className={`stat-card bg-gradient-to-br from-dark-800 to-dark-900`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg bg-${stat.color}-500/20`}>
                {stat.icon}
              </div>
              <span className={`text-${stat.color}-400 text-sm`}>{stat.label}</span>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </motion.div>
      
      {/* Поздравительное сообщение */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8 relative overflow-hidden rounded-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 to-emerald-900/20" />
        <div className="relative p-6">
          <div className="flex items-center mb-4">
            <Sparkles className="text-yellow-400 mr-3" size={28} />
            <div>
              <h3 className="font-bold text-xl">{t.congratulations}</h3>
              <p className="text-gray-300">{t.cleanupComplete}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="text-blue-400 mr-2" size={20} />
              <span className="text-sm">
                {t.nextCleanup}: <span className="font-bold">7 {t.days}</span>
              </span>
            </div>
            
            <div className="flex space-x-2">
              <button className="btn-secondary">
                <Share2 size={18} />
              </button>
              <button className="btn-secondary">
                <Download size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Кнопки управления */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={toggleSelectAll}
          className="flex-1 py-3 rounded-xl bg-dark-800 hover:bg-dark-700 transition-colors"
        >
          {t.selectAll}
        </button>
        <button
          className="flex-1 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
          disabled={selectedChats.length === 0}
        >
          {t.deleteSelected}
        </button>
      </div>
      
      {/* Детали */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-dark-800 hover:bg-dark-700 mb-4"
      >
        <span className="font-semibold">
          {showDetails ? t.hideDetails : t.details}
        </span>
        {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="space-y-2">
              {[
                { label: t.deadChats, value: results.dead, color: 'gray' },
                { label: t.toxicChats, value: results.toxic, color: 'orange' },
                { label: t.duplicates, value: results.duplicates, color: 'yellow' },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between p-3 rounded-lg bg-dark-800/50">
                  <span className="flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-${stat.color}-400 mr-3`} />
                    {stat.label}
                  </span>
                  <span className={`text-${stat.color}-400 font-bold`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Список чатов */}
      <h3 className="font-bold text-lg mb-4">{t.chatList}</h3>
      <div className="space-y-3 mb-24">
        {results.chats.map((chat) => (
          <motion.div
            key={chat.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`p-4 rounded-xl transition-all ${
              selectedChats.includes(chat.id) 
                ? 'bg-blue-500/10 border border-blue-500/30' 
                : 'bg-dark-800 hover:bg-dark-700'
            }`}
            onClick={() => toggleChatSelection(chat.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    chat.recommendedAction === 'delete' ? 'bg-red-400' :
                    chat.recommendedAction === 'keep' ? 'bg-green-400' :
                    'bg-yellow-400'
                  }`} />
                  <h4 className="font-bold truncate">{chat.title}</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Users size={14} className="mr-2" />
                    <span>{t.category}: {chat.category}</span>
                  </div>
                  <div className="flex items-center">
                    <BarChart3 size={14} className="mr-2" />
                    <span>{t.members}: {chat.members.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Zap size={14} className="mr-2" />
                    <span>{t.activity}: {chat.activity}%</span>
                  </div>
                  <div className="flex items-center">
                    <AlertTriangle size={14} className="mr-2" />
                    <span>{t.toxicity}: {chat.toxicity}%</span>
                  </div>
                </div>
              </div>
              
              <div className="ml-4">
                {getActionButton(chat.recommendedAction)}
              </div>
            </div>
            
            {chat.isDead && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-sm">
                <XCircle size={14} className="mr-1" /> {t.deadChats}
              </div>
            )}
            {chat.isDuplicate && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-800/30 text-yellow-400 text-sm ml-2">
                <AlertTriangle size={14} className="mr-1" /> {t.duplicates}
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Фиксированные кнопки действий */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-dark-950/90 backdrop-blur-lg border-t border-dark-800">
        <div className="flex space-x-3">
          <button className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors">
            {t.deleteSelected} ({selectedChats.length})
          </button>
          <button className="flex-1 py-3 rounded-xl bg-green-500/20 hover:bg-green-500/30 text-green-400 font-bold transition-colors">
            {t.keepSelected}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
