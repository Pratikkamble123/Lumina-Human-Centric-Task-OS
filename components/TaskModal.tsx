
import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Priority, Status, Task } from '../types';
import { Button } from './Button';

export const TaskModal: React.FC = () => {
  const { selectedTaskId, tasks, updateTask, setSelectedTaskId, addComment, currentUser } = useStore();
  const task = tasks.find(t => t.id === selectedTaskId);
  const [commentText, setCommentText] = useState('');
  const [dependencySearch, setDependencySearch] = useState('');
  const [showDepDropdown, setShowDepDropdown] = useState(false);
  const [tagInput, setTagInput] = useState('');

  if (!task) return null;

  const handleUpdate = (updates: Partial<Task>) => {
    updateTask(task.id, updates);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(task.id, commentText);
    setCommentText('');
  };

  const addDependency = (depId: string) => {
    if (!task.dependencies.includes(depId)) {
      handleUpdate({ dependencies: [...task.dependencies, depId] });
    }
    setDependencySearch('');
    setShowDepDropdown(false);
  };

  const removeDependency = (depId: string) => {
    handleUpdate({ dependencies: task.dependencies.filter(id => id !== depId) });
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/,/g, '');
      if (val && !task.tags.includes(val)) {
        handleUpdate({ tags: [...task.tags, val] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleUpdate({ tags: task.tags.filter(t => t !== tagToRemove) });
  };

  const availableTasks = useMemo(() => {
    return tasks.filter(t => 
      t.id !== task.id && 
      !task.dependencies.includes(t.id) &&
      t.title.toLowerCase().includes(dependencySearch.toLowerCase())
    );
  }, [tasks, task.id, task.dependencies, dependencySearch]);

  const dependencyTasks = useMemo(() => {
    return task.dependencies.map(id => tasks.find(t => t.id === id)).filter(Boolean) as Task[];
  }, [task.dependencies, tasks]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-[#0B0C0E] w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-4">
            <select 
              value={task.status}
              onChange={(e) => handleUpdate({ status: e.target.value as Status })}
              className="text-xs font-bold uppercase tracking-widest bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg focus:outline-none cursor-pointer"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Done">Done</option>
            </select>
            <span className="text-gray-300 dark:text-gray-700">/</span>
            <select 
              value={task.priority}
              onChange={(e) => handleUpdate({ priority: e.target.value as Priority })}
              className="text-xs font-medium text-gray-500 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Urgent">Urgent Priority</option>
            </select>
          </div>
          <button onClick={() => setSelectedTaskId(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-2xl p-2 leading-none">×</button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div>
            <input 
              value={task.title}
              onChange={(e) => handleUpdate({ title: e.target.value })}
              className="w-full text-2xl font-bold bg-transparent focus:outline-none mb-4 placeholder:text-gray-300"
              placeholder="Task title"
            />
            <textarea 
              value={task.description}
              onChange={(e) => handleUpdate({ description: e.target.value })}
              className="w-full text-gray-600 dark:text-gray-400 bg-transparent focus:outline-none resize-none leading-relaxed"
              placeholder="Describe this task..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-8 py-6 border-y border-gray-100 dark:border-gray-800">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Assignee</label>
              <div className="flex items-center space-x-2">
                <img src={`https://picsum.photos/seed/${task.assigneeId}/40/40`} className="w-6 h-6 rounded-full" alt="assignee" />
                <span className="text-sm font-medium">Assigned to you</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Due Date</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="date" 
                  value={task.dueDate ? task.dueDate.split('T')[0] : ''}
                  onChange={(e) => handleUpdate({ dueDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  className="block text-sm bg-transparent focus:outline-none dark:text-gray-200 cursor-pointer"
                />
                {task.dueDate && (
                  <button 
                    onClick={() => handleUpdate({ dueDate: null })}
                    className="text-[10px] text-gray-400 hover:text-red-500 transition-colors uppercase font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {task.tags.map(tag => (
                <span key={tag} className="flex items-center space-x-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium border border-blue-100 dark:border-blue-800/50">
                  <span>{tag}</span>
                  <button onClick={() => removeTag(tag)} className="hover:text-blue-800 dark:hover:text-blue-200">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </span>
              ))}
              <input 
                type="text"
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                className="text-xs bg-transparent border-none focus:ring-0 w-24 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Dependencies Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Dependencies</h3>
            
            <div className="relative">
              <div className="flex flex-wrap gap-2 mb-3">
                {dependencyTasks.map(dep => (
                  <div key={dep.id} className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-xs font-medium max-w-[150px] truncate">{dep.title}</span>
                    <button 
                      onClick={() => removeDependency(dep.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                {dependencyTasks.length === 0 && (
                  <span className="text-sm text-gray-400 italic">No dependencies set</span>
                )}
              </div>

              <div className="relative">
                <input 
                  type="text"
                  placeholder="Link to another task..."
                  value={dependencySearch}
                  onFocus={() => setShowDepDropdown(true)}
                  onChange={(e) => setDependencySearch(e.target.value)}
                  className="w-full text-sm bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                
                {showDepDropdown && dependencySearch && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#161719] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-20 overflow-hidden">
                    <div className="max-h-48 overflow-y-auto">
                      {availableTasks.length > 0 ? (
                        availableTasks.map(t => (
                          <button
                            key={t.id}
                            onClick={() => addDependency(t.id)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0"
                          >
                            <div className="font-medium truncate">{t.title}</div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-widest">{t.status}</div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-400 italic">No matching tasks found</div>
                      )}
                    </div>
                  </div>
                )}
                {showDepDropdown && (
                  <div 
                    className="fixed inset-0 z-[-1]" 
                    onClick={() => setShowDepDropdown(false)} 
                  />
                )}
              </div>
            </div>
          </div>

          {/* Discussion Section */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Discussion</h3>
            <div className="space-y-6">
              {task.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-4">
                  <img src={`https://picsum.photos/seed/${comment.userId}/40/40`} className="w-8 h-8 rounded-full shrink-0" alt="user" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-bold">{comment.userId === currentUser.id ? 'You' : 'Member'}</span>
                      <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleCommentSubmit} className="flex items-start space-x-4 mt-6">
              <img src={currentUser.avatar} className="w-8 h-8 rounded-full" alt="current user" />
              <div className="flex-1 space-y-3">
                <textarea 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  rows={2}
                />
                <Button type="submit" size="sm" disabled={!commentText.trim()}>Post Comment</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
