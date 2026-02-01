import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scan, Users, Bot, BarChart3, Share2, 
  Globe, Settings, ChevronRight, Zap, 
  Trash2, AlertTriangle, Copy, Check,
  Rocket, Crown, Megaphone, TrendingUp,
  Sparkles, Shield, Filter, RefreshCw
} from 'lucide-react';
import Scanner from './components/Scanner';
import Results from './components/Results';
import Stats from './components/Stats';
import AdminPanel from './components/AdminPanel';
import LanguageSelector from './components/LanguageSelector';

function App() {
  const [currentView, setCurrentView] = useState('main');
  const [language, setLanguage] = useState('en');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [ads, setAds] = useState([]);
  
  // Получаем параметры из URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang') || 'en';
    const userId = urlParams.get('user_id');
    const scanType = urlParams.get('type');
    
    setLanguage(lang);
    
    if (userId) {
      fetchUserData(userId);
      fetchAds(userId);
    }
    
    if (scanType) {
      setCurrentView('scanner');
    }
    
    // Расширяем WebApp на весь экран
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.setHeaderColor('#0f172a');
      window.Telegram.WebApp.setBackgroundColor('#020617');
    }
  }, []);
  
  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`https://ваш-бэкенд.com/api/stats/${userId}`);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  
  const fetchAds = async (userId) => {
    try {
      const response = await fetch(`https://ваш-бэкенд.com/api/ads/${userId}`);
      const data = await response.json();
      setAds(data.ads);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };
  
  const translations = {
    ru: {
      mainTitle: "Telegram Auditor Pro",
      tagline: "Очистите свой Telegram за 1 клик",
      scanChannels: "Сканировать каналы",
      scanGroups: "Сканировать группы",
      scanBots: "Сканировать ботов",
      myStats: "Моя статистика",
      inviteFriends: "Пригласить друзей",
      shareBot: "Поделиться ботом",
      adminPanel: "Админ панель",
      changeLanguage: "Сменить язык",
      recommendedForYou: "Рекомендуем для вас",
      featuredChannels: "Популярные каналы",
      premiumFeatures: "Премиум функции",
      unlimitedScans: "Неограниченное сканирование",
      prioritySupport: "Приоритетная поддержка",
      advancedFilters: "Расширенные фильтры",
      upgradeNow: "Апгрейдить сейчас",
    },
    en: {
      mainTitle: "Telegram Auditor Pro",
      tagline: "Clean your Telegram in 1 click",
      scanChannels: "Scan channels",
      scanGroups: "Scan groups",
      scanBots: "Scan bots",
      myStats: "My statistics",
      inviteFriends: "Invite friends",
      shareBot: "Share bot",
      adminPanel: "Admin panel",
      changeLanguage: "Change language",
      recommendedForYou: "Recommended for you",
      featuredChannels: "Featured channels",
      premiumFeatures: "Premium features",
      unlimitedScans: "Unlimited scans",
      prioritySupport: "Priority support",
      advancedFilters: "Advanced filters",
      upgradeNow: "Upgrade now",
    }
  };
  
  const t = translations[language];
  
  const menuItems = [
    { 
      id: 'scan_channels', 
      icon: <Scan size={24} />, 
      label: t.scanChannels, 
      color: 'from-blue-500 to-cyan-500',
      description: language === 'ru' ? 'Анализ всех каналов' : 'Analyze all channels'
    },
    { 
      id: 'scan_groups', 
      icon: <Users size={24} />, 
      label: t.scanGroups, 
      color: 'from-purple-500 to-pink-500',
      description: language === 'ru' ? 'Проверка групп' : 'Check groups'
    },
    { 
      id: 'scan_bots', 
      icon: <Bot size={24} />, 
      label: t.scanBots, 
      color: 'from-green-500 to-emerald-500',
      description: language === 'ru' ? 'Аудит ботов' : 'Audit bots'
    },
    { 
      id: 'stats', 
      icon: <BarChart3 size={24} />, 
      label: t.myStats, 
      color: 'from-orange-500 to-red-500',
      description: language === 'ru' ? 'Ваша статистика' : 'Your statistics'
    },
    { 
      id: 'invite', 
      icon: <Users size={24} />, 
      label: t.inviteFriends, 
      color: 'from-indigo-500 to-blue-500',
      description: language === 'ru' ? 'Пригласить друзей' : 'Invite friends'
    },
    { 
      id: 'share', 
      icon: <Share2 size={24} />, 
      label: t.shareBot, 
      color: 'from-violet-500 to-purple-500',
      description: language === 'ru' ? 'Поделиться ботом' : 'Share bot'
    },
  ];
  
  const renderMainView = () => (
    <div className="min-h-screen p-4 pb-20">
      {/* Заголовок */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">
          {t.mainTitle}
        </h1>
        <p className="text-gray-400 text-lg">{t.tagline}</p>
      </motion.div>
      
      {/* Статистика пользователя */}
      {userData && (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="stat-card mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-bold">@{userData.user.username || 'user'}</h3>
                <p className="text-sm text-gray-400">Уровень: {userData.user.is_premium ? 'Premium' : 'Basic'}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold gradient-text">
                {userData.stats.total_channels_scanned || 0}
              </div>
              <p className="text-sm text-gray-400">просканировано</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold">{userData.stats.channels_deleted || 0}</div>
              <p className="text-xs text-gray-400">удалено</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{userData.user.referrals || 0}</div>
              <p className="text-xs text-gray-400">рефералов</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{userData.stats.total_saved_mb || 0}MB</div>
              <p className="text-xs text-gray-400">сэкономлено</p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Главное меню */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMenuItemClick(item.id)}
            className={`card text-left hover:shadow-2xl transition-all duration-300`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-3`}>
              {item.icon}
            </div>
            <h3 className="font-bold text-lg mb-1">{item.label}</h3>
            <p className="text-sm text-gray-400">{item.description}</p>
            <ChevronRight className="absolute right-4 top-4 text-gray-500" size={20} />
          </motion.button>
        ))}
      </div>
      
      {/* Рекламные баннеры */}
      <AnimatePresence>
        {ads.filter(ad => ad.position === 'main').map((ad, index) => (
          <motion.div
            key={ad.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.2 }}
            className="mb-6 relative overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20" />
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-xl mb-2">{ad.title}</h3>
                  <p className="text-gray-300 mb-4">{ad.description}</p>
                </div>
                <Rocket className="text-blue-400" size={24} />
              </div>
              <button 
                onClick={() => window.open(ad.button_url, '_blank')}
                className="btn-primary w-full"
              >
                {ad.button_text}
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Премиум секция */}
      {!userData?.user?.is_premium && (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8 relative overflow-hidden rounded-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/20 to-orange-900/20" />
          <div className="relative p-6">
            <div className="flex items-center mb-4">
              <Crown className="text-yellow-400 mr-3" size={28} />
              <h3 className="font-bold text-xl">{t.premiumFeatures}</h3>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <Zap className="text-green-400 mr-3" size={20} />
                <span>{t.unlimitedScans}</span>
              </div>
              <div className="flex items-center">
                <Shield className="text-blue-400 mr-3" size={20} />
                <span>{t.prioritySupport}</span>
              </div>
              <div className="flex items-center">
                <Filter className="text-purple-400 mr-3" size={20} />
                <span>{t.advancedFilters}</span>
              </div>
            </div>
            
            <button className="btn-primary w-full bg-gradient-to-r from-yellow-500 to-orange-500">
              {t.upgradeNow}
            </button>
          </div>
        </motion.div>
      )}
      
      {/* Кнопка смены языка */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={() => setCurrentView('language')}
        className="btn-secondary w-full flex items-center justify-center"
      >
        <Globe className="mr-2" size={20} />
        {t.changeLanguage}
      </motion.button>
    </div>
  );
  
  const handleMenuItemClick = (itemId) => {
    switch(itemId) {
      case 'scan_channels':
      case 'scan_groups':
      case 'scan_bots':
        setCurrentView('scanner');
        break;
      case 'stats':
        setCurrentView('stats');
        break;
      case 'admin':
        setCurrentView('admin');
        break;
      case 'language':
        setCurrentView('language');
        break;
      default:
        break;
    }
  };
  
  const handleScanComplete = (results) => {
    setScanResults(results);
    setCurrentView('results');
  };
  
  return (
    <div className="min-h-screen bg-dark-950">
      <AnimatePresence mode="wait">
        {currentView === 'main' && renderMainView()}
        {currentView === 'scanner' && (
          <Scanner 
            onBack={() => setCurrentView('main')}
            onComplete={handleScanComplete}
            language={language}
          />
        )}
        {currentView === 'results' && (
          <Results 
            results={scanResults}
            onBack={() => setCurrentView('main')}
            language={language}
          />
        )}
        {currentView === 'stats' && (
          <Stats 
            userData={userData}
            onBack={() => setCurrentView('main')}
            language={language}
          />
        )}
        {currentView === 'admin' && (
          <AdminPanel 
            onBack={() => setCurrentView('main')}
            language={language}
          />
        )}
        {currentView === 'language' && (
          <LanguageSelector 
            onBack={() => setCurrentView('main')}
            onLanguageChange={setLanguage}
            currentLanguage={language}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
