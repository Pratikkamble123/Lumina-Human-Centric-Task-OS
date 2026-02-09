
import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Status, Task, Priority } from '../types';
import { IconPlus } from './Icons';

const COLUMNS: Status[] = ['Todo', 'In Progress', 'Review', 'Done'];

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const colors = {
    Low: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    Medium: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    High: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    Urgent: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
  };
  return <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${colors[priority]}`}>{priority}</span>;
};

export const BoardView: React.FC = () => {
  const { tasks, moveTask, addTask, setSelectedTaskId, selectedTags, searchQuery } = useStore();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 || 
                          selectedTags.some(tag => task.tags.includes(tag));
      return matchesSearch && matchesTags;
    });
  }, [tasks, searchQuery, selectedTags]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData('taskId', id);
  };

  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('taskId');
    moveTask(id, status);
    setDraggedTaskId(null);
  };

  return (
    <div className="flex-1 overflow-x-auto p-6 bg-[#FCFCFD] dark:bg-[#0B0C0E]">
      <div className="flex space-x-6 h-full min-w-max">
        {COLUMNS.map((status) => (
          <div 
            key={status} 
            className="w-80 flex flex-col"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div className="flex items-center justify-between px-2 mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{status}</h3>
                <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {filteredTasks.filter(t => t.status === status).length}
                </span>
              </div>
              <button 
                onClick={() => addTask({ status })}
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <IconPlus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3 p-1 rounded-xl transition-colors min-h-[500px]">
              {filteredTasks.filter(t => t.status === status).map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`bg-white dark:bg-[#161719] border border-gray-200 dark:border-gray-800 p-4 rounded-xl shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-400 dark:hover:border-blue-500 transition-all ${
                    draggedTaskId === task.id ? 'opacity-40 grayscale' : 'opacity-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <PriorityBadge priority={task.priority} />
                    <div className="flex items-center space-x-2">
                      {task.dependencies.length > 0 && (
                        <div className="text-gray-400" title={`Depends on ${task.dependencies.length} task(s)`}>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </div>
                      )}
                      {task.assigneeId && (
                        <img 
                          src={`https://picsum.photos/seed/${task.assigneeId}/32/32`} 
                          className="w-5 h-5 rounded-full border border-white dark:border-gray-800" 
                          alt="assignee"
                        />
                      )}
                    </div>
                  </div>
                  <h4 className="text-sm font-medium mb-1 line-clamp-2">{task.title}</h4>
                  
                  {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {task.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                    {task.description || 'No description provided.'}
                  </p>
                  
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <div className="flex -space-x-1.5 items-center">
                      {task.comments.length > 0 && (
                        <span className="flex items-center space-x-1">
                          <span>💬</span>
                          <span>{task.comments.length}</span>
                        </span>
                      )}
                    </div>
                    {task.dueDate && (
                      <span className="flex items-center">
                        📅 {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              {filteredTasks.filter(t => t.status === status).length === 0 && (
                <div className="h-24 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-center text-gray-300 dark:text-gray-700 text-sm">
                  No matching tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
