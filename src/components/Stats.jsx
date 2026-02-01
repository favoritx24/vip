import React from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft, BarChart3, Users, Zap,
  TrendingUp, Calendar, Target, Award,
  Clock, Download, Share2, Crown,
  Sparkles, Filter, RefreshCw
} from 'lucide-react';

const Stats = ({ userData, onBack, language }) => {
  const translations = {
    ru: {
      stats: "Моя статистика",
      overview: "Обзор",
      scans: "Сканирования",
      cleanup: "Очистка",
      referrals: "Рефералы",
      achievements: "Достижения",
      totalScans: "Всего сканирований",
      channelsScanned: "Каналов просканировано",
      groupsScanned: "Групп просканировано",
      botsScanned: "Ботов просканировано",
      totalDeleted: "Всего удалено",
      spaceSaved: "Места сэкономлено",
      avgToxicity: "Средняя токсичность",
      activeDays: "Активных дней",
      totalReferrals: "Всего рефералов",
      completedInvites: "Завершённых приглашений",
      requiredInvites: "Требуется приглашений",
      conversionRate: "Конверсия",
      achievementsEarned: "Получено достижений",
      streak: "Серия дней",
      lastActivity: "Последняя активность",
      nextLevel: "Следующий уровень",
      shareStats: "Поделиться статистикой",
      exportData: "Экспорт данных",
      upgradeForMore: "Апгрейд для получения больше статистики",
    },
    en: {
      stats: "My Statistics",
      overview: "Overview",
      scans: "Scans",
      cleanup: "Cleanup",
      referrals: "Referrals",
      achievements: "Achievements",
      totalScans: "Total scans",
      channelsScanned: "Channels scanned",
      groupsScanned: "Groups scanned",
      botsScanned: "Bots scanned",
      totalDeleted: "Total deleted",
      spaceSaved: "Space saved",
      avgToxicity: "Average toxicity",
      activeDays: "Active days",
      totalReferrals: "Total referrals",
      completedInvites: "Completed invites",
      requiredInvites: "Required invites",
      conversionRate: "Conversion rate",
      achievementsEarned: "Achievements earned",
      streak: "Day streak",
      lastActivity: "Last activity",
      nextLevel: "Next level",
      shareStats: "Share statistics",
      exportData: "Export data",
      upgradeForMore: "Upgrade for more statistics",
    }
  };
  
  const t = translations[language];
  
  const statsData = userData || {
    user: {
      username: 'user',
      is_premium: false,
      referrals: 0,
      completed_invites: 0,
      required_invites: 2,
    },
    stats: {
      total_channels_scanned: 0,
      channels_deleted: 0,
      groups_scanned: 0,
      bots_scanned: 0,
      total_saved_mb: 0,
    }
  };
  
  const scanStats = [
    { 
      label: t.totalScans, 
      value: statsData.stats.total_channels_scanned + statsData.stats.groups_scanned + statsData.stats.bots_scanned,
      icon: <BarChart3 size={20} />,
      color: 'blue',
      change: '+12%'
    },
    { 
      label: t.channelsScanned, 
      value: statsData.stats.total_channels_scanned,
      icon: <Filter size={20} />,
      color: 'purple',
      change: '+8%'
    },
    { 
      label: t.groupsScanned, 
      value: statsData.stats.groups_scanned,
      icon: <Users size={20} />,
      color: 'green',
      change: '+15%'
    },
    { 
      label: t.botsScanned, 
      value: statsData.stats.bots_scanned,
      icon: <Zap size={20} />,
      color: 'yellow',
      change: '+5%'
    },
  ];
  
  const cleanupStats = [
    { 
      label: t.totalDeleted, 
      value: statsData.stats.channels_deleted,
      icon: <TrendingUp size={20} />,
      color: 'red'
    },
    { 
      label: t.spaceSaved, 
      value: `${statsData.stats.total_saved_mb || 0} MB`,
      icon: <Download size={20} />,
      color: 'green'
    },
    { 
      label: t.avgToxicity, 
      value: '24%',
      icon: <Target size={20} />,
      color: 'orange'
    },
    { 
      label: t.activeDays, 
      value: '7',
      icon: <Calendar size={20} />,
      color: 'blue'
    },
  ];
  
  const achievements = [
    { title: 'Первое сканирование', description: 'Завершите первое сканирование', earned: true },
    { title: 'Очистка 50 каналов', description: 'Удалите 50 мёртвых каналов', earned: true },
    { title: 'Неделя активности', description: 'Используйте бота 7 дней подряд', earned: false },
    { title: 'Мастер рефералов', description: 'Пригласите 10 друзей', earned: false },
  ];
  
  return (
    <div className="min-h-screen p-4">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">{t.stats}</h1>
        <div className="flex space-x-2">
          <button className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors">
            <Share2 size={20} />
          </button>
          <button className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors">
            <Download size={20} />
          </button>
        </div>
      </div>
      
      {/* Статус пользователя */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="stat-card mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-xl mb-1">@{statsData.user.username}</h3>
            <div className="flex items-center">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                statsData.user.is_premium
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                  : 'bg-gray-800 text-gray-300'
              }`}>
                {statsData.user.is_premium ? 'PREMIUM' : 'BASIC'}
              </div>
              <div className="ml-3 flex items-center text-sm text-gray-400">
                <Award size={16} className="mr-1" />
                Уровень 2
              </div>
            </div>
          </div>
          
          {!statsData.user.is_premium && (
            <button className="btn-primary py-2 px-4 text-sm">
              <Crown size={16} className="mr-2" />
              Апгрейд
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold gradient-text">{statsData.user.completed_invites}/{statsData.user.required_invites}</div>
            <div className="text-sm text-gray-400">{t.completedInvites}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold gradient-text">{statsData.user.referrals}</div>
            <div className="text-sm text-gray-400">{t.totalReferrals}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold gradient-text">7</div>
            <div className="text-sm text-gray-400">{t.streak}</div>
          </div>
        </div>
      </motion.div>
      
      {/* Статистика сканирований */}
      <div className="mb-8">
        <h3 className="font-bold text-lg mb-4 flex items-center">
          <BarChart3 className="mr-2" size={20} />
          {t.scans}
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          {scanStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="stat-card"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-${stat.color}-500/20`}>
                  {stat.icon}
                </div>
                {stat.change && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Статистика очистки */}
      <div className="mb-8">
        <h3 className="font-bold text-lg mb-4 flex items-center">
          <TrendingUp className="mr-2" size={20} />
          {t.cleanup}
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          {cleanupStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="stat-card"
            >
              <div className="flex items-center mb-2">
                <div className={`p-2 rounded-lg bg-${stat.color}-500/20`}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Достижения */}
      <div className="mb-8">
        <h3 className="font-bold text-lg mb-4 flex items-center">
          <Award className="mr-2" size={20} />
          {t.achievements}
        </h3>
        
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`p-4 rounded-xl flex items-center justify-between ${
                achievement.earned
                  ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20'
                  : 'bg-dark-800'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                  achievement.earned
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : 'bg-gray-800'
                }`}>
                  {achievement.earned ? (
                    <Sparkles size={20} className="text-white" />
                  ) : (
                    <Award size={20} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold">{achievement.title}</h4>
                  <p className="text-sm text-gray-400">{achievement.description}</p>
                </div>
              </div>
              
              {achievement.earned ? (
                <div className="text-green-400 text-sm font-medium">
                  Получено
                </div>
              ) : (
                <div className="text-gray-400 text-sm">
                  0%
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Прогресс до следующего уровня */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="stat-card"
      >
        <h4 className="font-bold mb-4 flex items-center">
          <Target className="mr-2" size={20} />
          {t.nextLevel}
        </h4>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Уровень 2</span>
            <span>65%</span>
          </div>
          <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600" style={{ width: '65%' }} />
          </div>
        </div>
        
        <p className="text-sm text-gray-400">
          Отсканируйте ещё 15 каналов для получения уровня 3
        </p>
      </motion.div>
    </div>
  );
};

export default Stats;
