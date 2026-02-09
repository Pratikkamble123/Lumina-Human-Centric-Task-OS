
import React from 'react';
import { ViewType } from '../types';
import { useStore } from '../store';
import { IconGrid, IconList, IconCalendar, IconSparkles, IconSun, IconMoon } from './Icons';

export const Sidebar: React.FC = () => {
  const { view, setView, isDarkMode, toggleDarkMode, currentUser } = useStore();

  const navItems = [
    { type: ViewType.BOARD, label: 'Board', icon: <IconGrid /> },
    { type: ViewType.LIST, label: 'List', icon: <IconList /> },
    { type: ViewType.CALENDAR, label: 'Calendar', icon: <IconCalendar /> },
    { type: ViewType.INSIGHTS, label: 'Insights', icon: <IconSparkles /> },
  ];

  return (
    <aside className="w-64 h-screen border-r border-gray-200 dark:border-gray-800 bg-[#F9FAFB] dark:bg-[#0B0C0E] flex flex-col p-4">
      <div className="flex items-center space-x-2 px-2 mb-8">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
        <span className="text-lg font-semibold tracking-tight">Lumina</span>
      </div>

      <nav className="flex-1 space-y-1">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Workspace</div>
        {navItems.map((item) => (
          <button
            key={item.type}
            onClick={() => setView(item.type)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              view === item.type 
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm font-medium' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
            }`}
          >
            <span className={view === item.type ? 'text-blue-600' : 'text-gray-400'}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mb-2"
        >
          {isDarkMode ? <IconSun /> : <IconMoon />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        
        <div className="flex items-center space-x-3 px-2 py-3">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">{currentUser.name}</span>
            <span className="text-[10px] text-gray-500 truncate">{currentUser.role}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
