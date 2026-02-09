<div className="bg-red-500 dark:bg-green-500 text-white p-4">
  Tailwind Dark Mode Test (TSX)
</div>

import React, { useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { BoardView } from './components/BoardView';
import { InsightsView } from './components/InsightsView';
import { TaskModal } from './components/TaskModal';
import { useStore } from './store';
import { ViewType } from './types';
import { Button } from './components/Button';
import { IconSearch, IconPlus } from './components/Icons';

const ListView: React.FC = () => {
  const { tasks, setSelectedTaskId, selectedTags, searchQuery } = useStore();
  
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 || 
                          selectedTags.some(tag => task.tags.includes(tag));
      return matchesSearch && matchesTags;
    });
  }, [tasks, searchQuery, selectedTags]);

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
           <h1 className="text-2xl font-bold">List View</h1>
        </div>
        <div className="space-y-1">
          {filteredTasks.map(task => (
            <div 
              key={task.id} 
              onClick={() => setSelectedTaskId(task.id)}
              className="flex items-center space-x-4 p-4 bg-white dark:bg-[#161719] border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-sm cursor-pointer transition-all group"
            >
              <div className={`w-2 h-2 rounded-full shrink-0 ${task.priority === 'Urgent' ? 'bg-red-500' : 'bg-blue-500'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium truncate group-hover:text-blue-600 transition-colors">{task.title}</span>
                  {task.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-xs text-gray-400 w-24 truncate">{task.status}</span>
              <span className="text-xs text-gray-400 w-32 text-right">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
              </span>
            </div>
          ))}
          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-gray-500 italic">No matching tasks found</div>
          )}
        </div>
      </div>
    </div>
  );
};

const CalendarView: React.FC = () => (
  <div className="flex-1 flex items-center justify-center text-gray-400 italic">
    Calendar view coming in next update.
  </div>
);

const App: React.FC = () => {
  const { view, isDarkMode, addTask, searchQuery, setSearchQuery, selectedTaskId, tasks, selectedTags, toggleTag } = useStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const allUniqueTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach(t => t.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [tasks]);

  const renderView = () => {
    switch (view) {
      case ViewType.BOARD: return <BoardView />;
      case ViewType.LIST: return <ListView />;
      case ViewType.CALENDAR: return <CalendarView />;
      case ViewType.INSIGHTS: return <InsightsView />;
      default: return <BoardView />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FCFCFD] dark:bg-[#0B0C0E] text-gray-900 dark:text-gray-100">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-auto min-h-[4rem] border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0B0C0E]/80 backdrop-blur-md px-6 py-3 flex flex-col gap-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1 max-w-xl">
              <div className="relative w-full">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search anything..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button size="sm" variant="ghost" className="hidden sm:inline-flex">Invite Team</Button>
              <Button size="sm" icon={<IconPlus />} onClick={() => addTask({ status: 'Todo' })}>New Task</Button>
            </div>
          </div>

          {allUniqueTags.length > 0 && (
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Filter by tags:</span>
              <div className="flex items-center space-x-1.5">
                {allUniqueTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </header>

        <div className="flex-1 flex flex-col relative overflow-hidden">
          {renderView()}
        </div>
      </main>

      {selectedTaskId && <TaskModal />}
    </div>
  );
};

export default App;
