
import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { getWeeklySummary, getSmartSuggestions } from '../geminiService';
import { Button } from './Button';
import { IconSparkles } from './Icons';

export const InsightsView: React.FC = () => {
  const { tasks } = useStore();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const [summ, sugg] = await Promise.all([
        getWeeklySummary(tasks),
        getSmartSuggestions(tasks)
      ]);
      setSummary(summ);
      setSuggestions(sugg || []);
    } catch (err) {
      console.error("Failed to fetch AI insights", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tasks.length > 0 && !summary) {
      fetchInsights();
    }
  }, [tasks]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 animate-pulse font-medium">Lumina AI is analyzing your workflow...</p>
      </div>
    );
  }

  // Helper to safely render summary text
  const renderSummaryText = () => {
    if (!summary || !summary.summary) return null;
    if (typeof summary.summary === 'string') return summary.summary;
    if (typeof summary.summary === 'object') return JSON.stringify(summary.summary);
    return String(summary.summary);
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#FCFCFD] dark:bg-[#0B0C0E]">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Workspace Insights</h1>
            <p className="text-gray-500">Intelligent overview of your team's velocity and mental load.</p>
          </div>
          <Button onClick={fetchInsights} icon={<IconSparkles />}>Refresh Analysis</Button>
        </header>

        {summary ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <section className="bg-white dark:bg-[#161719] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Weekly Narrative</h2>
                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                  {renderSummaryText()}
                </div>
              </section>

              <section className="bg-white dark:bg-[#161719] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Smart Suggestions</h2>
                <div className="space-y-3">
                  {suggestions.map((s, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100/50 dark:border-blue-800/20">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300 text-xs font-bold">
                        {i + 1}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-200">{s}</span>
                    </div>
                  ))}
                  {suggestions.length === 0 && <p className="text-xs text-gray-400 italic">No specific suggestions at this time.</p>}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="bg-white dark:bg-[#161719] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm text-center">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Burnout Risk</h2>
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32">
                    <circle 
                      cx="64" cy="64" r="58" 
                      className="stroke-gray-100 dark:stroke-gray-800 fill-none" 
                      strokeWidth="8"
                    />
                    <circle 
                      cx="64" cy="64" r="58" 
                      className={`${(summary.burnoutRisk || 0) > 70 ? 'stroke-red-500' : 'stroke-blue-500'} fill-none transition-all duration-1000`} 
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 58}`}
                      strokeDashoffset={`${2 * Math.PI * 58 * (1 - (summary.burnoutRisk || 0) / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-2xl font-bold">{summary.burnoutRisk || 0}%</span>
                </div>
                <p className="mt-4 text-xs text-gray-500">
                  {(summary.burnoutRisk || 0) > 70 ? 'High workload. Consider delegating tasks.' : 'Steady pace. Capacity is looking good.'}
                </p>
              </section>

              <section className="bg-white dark:bg-[#161719] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Focus Areas</h2>
                <ul className="space-y-2">
                  {(summary.focusAreas || []).map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                  {(!summary.focusAreas || summary.focusAreas.length === 0) && <li className="text-xs text-gray-400 italic">No specific focus areas identified.</li>}
                </ul>
              </section>
            </div>
          </div>
        ) : (
          <div className="text-center p-12 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
            <IconSparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium">No Analysis Available</h3>
            <p className="text-gray-500 max-w-xs mx-auto mt-2">Add some tasks and click refresh to get AI-driven workspace insights.</p>
          </div>
        )}
      </div>
    </div>
  );
};
