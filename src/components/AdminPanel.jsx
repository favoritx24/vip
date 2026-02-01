import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft, Users, BarChart3, Settings,
  Megaphone, TrendingUp, Shield, Globe,
  Plus, Edit2, Trash2, Send,
  Image, Link, Calendar, Filter
} from 'lucide-react';

const AdminPanel = ({ onBack, language }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const translations = {
    ru: {
      admin: "Админ панель",
      overview: "Обзор",
      broadcast: "Рассылка",
      ads: "Реклама",
      subscriptions: "Подписки",
      users: "Пользователи",
      settings: "Настройки",
      totalUsers: "Всего пользователей",
      activeToday: "Активных сегодня",
      totalScans: "Всего сканирований",
      conversionRate: "Конверсия",
      newUsers: "Новых пользователей",
      growth: "Рост",
      createBroadcast: "Создать рассылку",
      scheduledBroadcasts: "Запланированные рассылки",
      createAd: "Создать рекламу",
      activeAds: "Активная реклама",
      manageSubscriptions: "Управление подписками",
      mandatoryChannels: "Обязательные каналы",
      userManagement: "Управление пользователями",
      searchUsers: "Поиск пользователей",
      botSettings: "Настройки бота",
      languageSettings: "Настройки языка",
      createNew: "Создать новую",
      edit: "Редактировать",
      delete: "Удалить",
      send: "Отправить",
      save: "Сохранить",
      cancel: "Отмена",
      title: "Заголовок",
      description: "Описание",
      imageUrl: "URL изображения",
      buttonText: "Текст кнопки",
      buttonUrl: "URL кнопки",
      targetGeo: "Целевая гео",
      selectGeo: "Выберите гео",
      all: "Все",
      russia: "Россия",
      english: "Англия",
      position: "Позиция",
      priority: "Приоритет",
      channelLink: "Ссылка на канал",
      requiredInvites: "Требуется инвайтов",
      forRu: "Для RU",
      forEn: "Для EN",
    },
    en: {
      admin: "Admin Panel",
      overview: "Overview",
      broadcast: "Broadcast",
      ads: "Ads",
      subscriptions: "Subscriptions",
      users: "Users",
      settings: "Settings",
      totalUsers: "Total users",
      activeToday: "Active today",
      totalScans: "Total scans",
      conversionRate: "Conversion rate",
      newUsers: "New users",
      growth: "Growth",
      createBroadcast: "Create broadcast",
      scheduledBroadcasts: "Scheduled broadcasts",
      createAd: "Create ad",
      activeAds: "Active ads",
      manageSubscriptions: "Manage subscriptions",
      mandatoryChannels: "Mandatory channels",
      userManagement: "User management",
      searchUsers: "Search users",
      botSettings: "Bot settings",
      languageSettings: "Language settings",
      createNew: "Create new",
      edit: "Edit",
      delete: "Delete",
      send: "Send",
      save: "Save",
      cancel: "Cancel",
      title: "Title",
      description: "Description",
      imageUrl: "Image URL",
      buttonText: "Button text",
      buttonUrl: "Button URL",
      targetGeo: "Target geo",
      selectGeo: "Select geo",
      all: "All",
      russia: "Russia",
      english: "England",
      position: "Position",
      priority: "Priority",
      channelLink: "Channel link",
      requiredInvites: "Required invites",
      forRu: "For RU",
      forEn: "For EN",
    }
  };
  
  const t = translations[language];
  
  const tabs = [
    { id: 'overview', label: t.overview, icon: <BarChart3 size={20} /> },
    { id: 'broadcast', label: t.broadcast, icon: <Megaphone size={20} /> },
    { id: 'ads', label: t.ads, icon: <TrendingUp size={20} /> },
    { id: 'subscriptions', label: t.subscriptions, icon: <Shield size={20} /> },
    { id: 'users', label: t.users, icon: <Users size={20} /> },
    { id: 'settings', label: t.settings, icon: <Settings size={20} /> },
  ];
  
  const stats = [
    { label: t.totalUsers, value: '1,234', change: '+12%' },
    { label: t.activeToday, value: '456', change: '+5%' },
    { label: t.totalScans, value: '8,901', change: '+23%' },
    { label: t.conversionRate, value: '34%', change: '+8%' },
  ];
  
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="stat-card"
          >
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
            <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full inline-block">
              {stat.change}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Быстрые действия */}
      <div className="stat-card">
        <h4 className="font-bold mb-4">Быстрые действия</h4>
        <div className="grid grid-cols-2 gap-3">
          <button className="p-4 rounded-xl bg-dark-800 hover:bg-dark-700 transition-colors text-left">
            <Plus size={24} className="mb-2 text-blue-400" />
            <div className="font-medium">{t.createBroadcast}</div>
          </button>
          <button className="p-4 rounded-xl bg-dark-800 hover:bg-dark-700 transition-colors text-left">
            <Plus size={24} className="mb-2 text-green-400" />
            <div className="font-medium">{t.createAd}</div>
          </button>
        </div>
      </div>
    </div>
  );
  
  const renderBroadcast = () => (
    <div className="space-y-6">
      <button className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 
                        text-white font-bold flex items-center justify-center">
        <Plus size={20} className="mr-2" />
        {t.createBroadcast}
      </button>
      
      <div className="stat-card">
        <h4 className="font-bold mb-4">{t.scheduledBroadcasts}</h4>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 rounded-lg bg-dark-800 flex items-center justify-between">
              <div>
                <div className="font-medium">Рассылка #{i}</div>
                <div className="text-sm text-gray-400 flex items-center">
                  <Calendar size={14} className="mr-2" />
                  Запланировано на 25.12.2023
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30">
                  <Edit2 size={18} className="text-blue-400" />
                </button>
                <button className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30">
                  <Trash2 size={18} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  const renderAds = () => (
    <div className="space-y-6">
      <button className="w-full p-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 
                        text-white font-bold flex items-center justify-center">
        <Plus size={20} className="mr-2" />
        {t.createAd}
      </button>
      
      <div className="stat-card">
        <h4 className="font-bold mb-4">{t.activeAds}</h4>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 rounded-lg bg-dark-800">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium">Рекламная кампания #{i}</div>
                <div className="flex items-center text-sm text-green-400">
                  <TrendingUp size={14} className="mr-1" />
                  +45 кликов
                </div>
              </div>
              <div className="text-sm text-gray-400 mb-3">
                Категория: {i === 1 ? 'RU' : i === 2 ? 'EN' : 'ALL'} • Приоритет: {i}
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400">
                  {t.edit}
                </button>
                <button className="flex-1 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400">
                  {t.delete}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return renderOverview();
      case 'broadcast': return renderBroadcast();
      case 'ads': return renderAds();
      default: return renderOverview();
    }
  };
  
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
        <h1 className="text-2xl font-bold">{t.admin}</h1>
      </div>
      
      {/* Вкладки */}
      <div className="flex overflow-x-auto mb-8 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center whitespace-nowrap px-4 py-3 rounded-xl mr-2 transition-colors ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-dark-800 hover:bg-dark-700 text-gray-300'
            }`}
          >
            {tab.icon}
            <span className="ml-2 font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
      
      {/* Контент */}
      {renderContent()}
    </div>
  );
};

export default AdminPanel;
