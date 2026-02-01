import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Scan, Users, Bot, ChevronLeft, 
  Loader2, CheckCircle, XCircle,
  AlertTriangle, Filter, RefreshCw
} from 'lucide-react';

const Scanner = ({ onBack, onComplete, language }) => {
  const [scanType, setScanType] = useState('channels');
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedChats, setSelectedChats] = useState([]);
  
  const translations = {
    ru: {
      title: "Сканер Telegram",
      selectType: "Выберите тип сканирования",
      channels: "Каналы",
      groups: "Группы",
      bots: "Боты",
      startScan: "Начать сканирование",
      scanning: "Сканирование...",
      analyzing: "Анализ контента...",
      checkingActivity: "Проверка активности...",
      detectingDuplicates: "Поиск дубликатов...",
      scanComplete: "Сканирование завершено!",
      selectAll: "Выбрать все",
      selected: "Выбрано",
      items: "элементов",
      advancedFilters: "Расширенные фильтры",
      deadChats: "Мёртвые чаты",
      toxicContent: "Токсичный контент",
      duplicates: "Дубликаты",
      applyFilters: "Применить фильтры",
    },
    en: {
      title: "Telegram Scanner",
      selectType: "Select scan type",
      channels: "Channels",
      groups: "Groups",
      bots: "Bots",
      startScan: "Start scanning",
      scanning: "Scanning...",
      analyzing: "Analyzing content...",
      checkingActivity: "Checking activity...",
      detectingDuplicates: "Detecting duplicates...",
      scanComplete: "Scan complete!",
      selectAll: "Select all",
      selected: "Selected",
      items: "items",
      advancedFilters: "Advanced filters",
      deadChats: "Dead chats",
      toxicContent: "Toxic content",
      duplicates: "Duplicates",
      applyFilters: "Apply filters",
    }
  };
  
  const t = translations[language];
  
  const scanTypes = [
    { id: 'channels', icon: <Scan size={24} />, label: t.channels, color: 'blue', count: 154 },
    { id: 'groups', icon: <Users size={24} />, label: t.groups, color: 'purple', count: 42 },
    { id: 'bots', icon: <Bot size={24} />, label: t.bots, color: 'green', count: 28 },
  ];
  
  const scanSteps = [
    { label: t.scanning, icon: <Scan size={20} /> },
    { label: t.analyzing, icon: <Filter size={20} /> },
    { label: t.checkingActivity, icon: <RefreshCw size={20} /> },
    { label: t.detectingDuplicates, icon: <AlertTriangle size={20} /> },
  ];
  
  const startScan = () => {
    setIsScanning(true);
    
    // Имитация процесса сканирования
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 1;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        
        // Имитация результатов
        setTimeout(() => {
          onComplete({
            type: scanType,
            total: Math.floor(Math.random() * 100) + 50,
            dead: Math.floor(Math.random() * 20),
            toxic: Math.floor(Math.random() * 15),
            duplicates: Math.floor(Math.random() * 10),
            recommendedDelete: Math.floor(Math.random() * 30),
            chats: Array.from({ length: 20 }, (_, i) => ({
              id: i,
              title: `Chat ${i + 1}`,
              type: scanType.slice(0, -1),
              members: Math.floor(Math.random() * 10000),
              activity: Math.floor(Math.random() * 100),
              toxicity: Math.floor(Math.random() * 100),
              isDead: Math.random() > 0.7,
              isDuplicate: Math.random() > 0.8,
              category: ['crypto', 'news', 'memes', 'tech', 'business'][i % 5],
              recommendedAction: Math.random() > 0.5 ? 'delete' : 'keep',
            }))
          });
        }, 1000);
      }
    }, 50);
  };
  
  const handleSelectAll = () => {
    // В реальном приложении здесь будет вызов Telegram Web App API
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.requestChat({
        allow_multiselect: true,
        chat_types: [scanType.slice(0, -1)], // Преобразуем 'channels' в 'channel'
      });
    }
  };
  
  if (isScanning) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="relative mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 mx-auto"
            >
              <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
              <div className="absolute inset-4 border-4 border-transparent border-t-blue-500 rounded-full" />
            </motion.div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <Scan className="text-blue-400" size={48} />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-6">{t.scanning}</h2>
          
          <div className="w-full max-w-md space-y-4 mb-8">
            {scanSteps.map((step, index) => (
              <motion.div
                key={step.label}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.3 }}
                className="flex items-center justify-between p-3 rounded-lg bg-dark-800"
              >
                <div className="flex items-center">
                  <div className="mr-3">
                    {step.icon}
                  </div>
                  <span>{step.label}</span>
                </div>
                {progress > (index + 1) * 25 ? (
                  <CheckCircle className="text-green-400" size={20} />
                ) : (
                  <Loader2 className="animate-spin text-gray-400" size={20} />
                )}
              </motion.div>
            ))}
          </div>
          
          {/* Прогресс бар */}
          <div className="w-full max-w-md mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>{progress}%</span>
              <span>{t.scanComplete}</span>
            </div>
            <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-4">
      {/* Заголовок */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors mr-4"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">{t.title}</h1>
      </div>
      
      {/* Выбор типа сканирования */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-300">{t.selectType}</h2>
        <div className="grid grid-cols-3 gap-3">
          {scanTypes.map((type) => (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setScanType(type.id)}
              className={`p-4 rounded-xl text-center transition-all ${
                scanType === type.id 
                  ? `bg-gradient-to-r from-${type.color}-500 to-${type.color}-600 shadow-lg shadow-${type.color}-500/30`
                  : 'bg-dark-800 hover:bg-dark-700'
              }`}
            >
              <div className={`mx-auto mb-3 p-3 rounded-lg ${
                scanType === type.id ? 'bg-white/20' : `bg-${type.color}-500/20`
              }`}>
                {type.icon}
              </div>
              <div className="font-bold mb-1">{type.label}</div>
              <div className="text-sm opacity-75">{type.count}</div>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Кнопка выбора всех чатов */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <button
          onClick={handleSelectAll}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 
                   text-white font-bold text-lg shadow-lg shadow-blue-500/30
                   hover:shadow-xl hover:shadow-blue-500/40 transition-all
                   flex items-center justify-center"
        >
          <Users className="mr-3" size={24} />
          {t.selectAll}
        </button>
        
        {selectedChats.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center text-gray-400"
          >
            {t.selected}: {selectedChats.length} {t.items}
          </motion.div>
        )}
      </motion.div>
      
      {/* Расширенные фильтры */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="card mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg flex items-center">
            <Filter className="mr-2" size={20} />
            {t.advancedFilters}
          </h3>
          <button className="text-sm text-blue-400 hover:text-blue-300">
            {t.applyFilters}
          </button>
        </div>
        
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg bg-dark-800/50">
            <span className="flex items-center">
              <XCircle className="mr-3 text-red-400" size={20} />
              {t.deadChats}
            </span>
            <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
          </label>
          
          <label className="flex items-center justify-between p-3 rounded-lg bg-dark-800/50">
            <span className="flex items-center">
              <AlertTriangle className="mr-3 text-yellow-400" size={20} />
              {t.toxicContent}
            </span>
            <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
          </label>
          
          <label className="flex items-center justify-between p-3 rounded-lg bg-dark-800/50">
            <span className="flex items-center">
              <AlertTriangle className="mr-3 text-orange-400" size={20} />
              {t.duplicates}
            </span>
            <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
          </label>
        </div>
      </motion.div>
      
      {/* Кнопка начала сканирования */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={startScan}
        disabled={selectedChats.length === 0}
        className={`w-full py-4 rounded-2xl font-bold text-lg
          ${selectedChats.length > 0 
            ? 'btn-primary' 
            : 'bg-gray-800 text-gray-400 cursor-not-allowed'}`}
      >
        {t.startScan}
      </motion.button>
    </div>
  );
};

export default Scanner;
