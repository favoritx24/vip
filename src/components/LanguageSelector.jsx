import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Globe, Check } from 'lucide-react';

const LanguageSelector = ({ onBack, onLanguageChange, currentLanguage }) => {
  const languages = [
    { code: 'ru', name: 'Русский', flag: '🇷🇺', native: 'Русский' },
    { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
  ];
  
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
        <h1 className="text-2xl font-bold flex items-center">
          <Globe className="mr-3" size={24} />
          Выберите язык / Select language
        </h1>
      </div>
      
      {/* Список языков */}
      <div className="space-y-3">
        {languages.map((lang) => (
          <motion.button
            key={lang.code}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onLanguageChange(lang.code);
              onBack();
            }}
            className={`w-full p-4 rounded-xl text-left transition-all ${
              currentLanguage === lang.code
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30'
                : 'bg-dark-800 hover:bg-dark-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-4">{lang.flag}</span>
                <div>
                  <div className="font-bold text-lg">{lang.name}</div>
                  <div className="text-sm text-gray-400">{lang.native}</div>
                </div>
              </div>
              
              {currentLanguage === lang.code && (
                <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                  <Check size={20} className="text-white" />
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
      
      {/* Информация */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 p-4 rounded-xl bg-dark-800"
      >
        <h3 className="font-bold mb-2">Информация / Information</h3>
        <p className="text-sm text-gray-400 mb-2">
          Выбранный язык будет использоваться во всём интерфейсе бота и мини-приложения.
        </p>
        <p className="text-sm text-gray-400">
          The selected language will be used throughout the bot and mini-app interface.
        </p>
      </motion.div>
    </div>
  );
};

export default LanguageSelector;
