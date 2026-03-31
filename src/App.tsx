/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';

// We'll use a simple React wrapper to mount our vanilla-like logic
// as it's the standard for this environment, but we'll keep the logic
// very direct as requested.

export default function App() {
  useEffect(() => {
    // This is where our "Vanilla JS" logic lives
    const script = document.createElement('script');
    script.src = '/src/script.ts';
    script.type = 'module';
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-surface-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-slate-200 bg-white p-8 hidden md:block z-50">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-brand-indigo rounded-lg flex items-center justify-center text-white font-display font-bold">S</div>
          <span className="font-display font-bold text-xl tracking-tight">studyflow</span>
        </div>
        
        <nav className="space-y-6">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-4">Menu</p>
            <a href="#dashboard" className="flex items-center gap-3 text-slate-900 font-medium group relative">
              <div className="active-nav-dot"></div>
              Dashboard
            </a>
            <a href="#tasks" className="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-colors font-medium">
              Tasks
            </a>
            <a href="#timer" className="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-colors font-medium">
              Timer
            </a>
            <a href="#subjects" className="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-colors font-medium">
              Subjects
            </a>
          </div>

          <div className="pt-8 space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-4">Subjects</p>
            <div id="sidebar-subjects" className="space-y-2">
              {/* Subjects will be injected here */}
            </div>
          </div>
        </nav>

        <div className="absolute bottom-8 left-8">
          <p className="text-xs text-slate-400 font-medium">Developed by Vivek</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        {/* Hero Section (Atmospheric) */}
        <section id="dashboard" className="relative h-[60vh] bg-primary-dark flex flex-col items-center justify-center text-center px-6 overflow-hidden">
          {/* Background Glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-indigo/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full"></div>
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-6">
              <span className="w-2 h-2 bg-brand-indigo rounded-full animate-pulse"></span>
              <span className="text-[10px] text-white/80 uppercase tracking-widest font-bold">Focus Mode Active</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 leading-tight tracking-tight">
              Master your craft, <br />
              <span className="italic text-brand-indigo">one session</span> at a time.
            </h1>
            
            <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
              Track your progress, maintain your streaks, and build a consistent study habit with StudyFlow.
            </p>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mx-auto">
              <div className="glass-soft p-6 rounded-2xl text-left">
                <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-1">Study Time Today</p>
                <h3 id="stat-time" className="text-2xl font-display font-bold text-white">00:00</h3>
              </div>
              <div className="glass-soft p-6 rounded-2xl text-left">
                <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-1">Tasks Completed</p>
                <h3 id="stat-tasks" className="text-2xl font-display font-bold text-white">0</h3>
              </div>
              <div className="glass-soft p-6 rounded-2xl text-left">
                <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-1">Current Streak</p>
                <h3 id="stat-streak" className="text-2xl font-display font-bold text-white">0 Days</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <div className="max-w-5xl mx-auto p-8 md:p-12 space-y-24">
          
          {/* Timer Section */}
          <section id="timer" className="space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-brand-indigo font-display font-bold text-sm uppercase tracking-widest mb-2">Focus</p>
                <h2 className="text-4xl font-serif font-bold">Study Timer</h2>
              </div>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center shadow-sm">
              <div id="timer-display" className="text-8xl md:text-9xl font-display font-bold tracking-tighter mb-12">00:00</div>
              <div className="flex gap-4">
                <button id="timer-toggle" className="px-12 py-4 bg-brand-indigo text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20 cursor-pointer">
                  Start Session
                </button>
                <button id="timer-reset" className="px-8 py-4 bg-slate-100 text-slate-600 rounded-full font-bold hover:bg-slate-200 transition-colors cursor-pointer">
                  Reset
                </button>
              </div>
            </div>
          </section>

          {/* Tasks Section */}
          <section id="tasks" className="space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-brand-indigo font-display font-bold text-sm uppercase tracking-widest mb-2">Planning</p>
                <h2 className="text-4xl font-serif font-bold">Your Tasks</h2>
              </div>
            </div>

            {/* Vibe Input Box */}
            <div className="vibe-input-container relative group">
              <div className="vibe-input-glow"></div>
              <div className="relative bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                <textarea 
                  id="task-input"
                  placeholder="What are we studying today?" 
                  className="w-full text-xl font-medium border-none focus:ring-0 resize-none placeholder:text-slate-300 min-h-[60px]"
                ></textarea>
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="flex gap-2">
                    <select id="task-subject-select" className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border-none focus:ring-0 cursor-pointer">
                      <option value="">No Subject</option>
                      {/* Subjects will be injected here */}
                    </select>
                  </div>
                  <button id="add-task-btn" className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                  </button>
                </div>
              </div>
            </div>

            <div id="task-list" className="space-y-3">
              {/* Tasks will be injected here */}
            </div>
          </section>

          {/* Subjects Section */}
          <section id="subjects" className="space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-brand-indigo font-display font-bold text-sm uppercase tracking-widest mb-2">Organization</p>
                <h2 className="text-4xl font-serif font-bold">Subjects</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center gap-4 group hover:border-brand-indigo transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-brand-indigo transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                </div>
                <input 
                  id="new-subject-input"
                  type="text" 
                  placeholder="Add new subject..." 
                  className="bg-transparent border-none text-center focus:ring-0 font-bold placeholder:text-slate-400"
                />
              </div>
              <div id="subject-cards" className="contents">
                {/* Subject cards will be injected here */}
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer className="p-12 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-sm font-medium">Developed by Vivek</p>
        </footer>
      </main>
    </div>
  );
}
