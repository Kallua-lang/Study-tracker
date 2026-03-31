
// StudyFlow Vanilla Logic
// Handles Tasks, Timer, Subjects, Stats, and LocalStorage

interface Task {
  id: string;
  text: string;
  subject: string;
  completed: boolean;
  date: string;
}

interface Subject {
  id: string;
  name: string;
}

interface AppState {
  tasks: Task[];
  subjects: Subject[];
  totalStudyTime: number; // in seconds
  lastStudyDate: string | null;
  streak: number;
  todayStudyTime: number; // in seconds
}

const STORAGE_KEY = 'studyflow_data';

class StudyFlow {
  private state: AppState;
  private timerInterval: number | null = null;
  private timerSeconds: number = 0;
  private isTimerRunning: boolean = false;

  constructor() {
    this.state = this.loadState();
    this.checkStreak();
    this.init();
  }

  private loadState(): AppState {
    // Step 1: Read from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    
    // Step 2: Required subjects
    const requiredSubjectNames = [
      'C++ (OOPS)',
      'DSA',
      'Maths',
      'Computer Organization',
      'AI/ML'
    ];

    let state: AppState;

    if (saved) {
      state = JSON.parse(saved);
      // Ensure subjects array exists
      if (!state.subjects) state.subjects = [];
    } else {
      // Initialize empty state if null
      state = {
        tasks: [],
        subjects: [],
        totalStudyTime: 0,
        lastStudyDate: null,
        streak: 0,
        todayStudyTime: 0
      };
    }

    // Step 3: Loop through required subjects and merge (STRICT LOGIC)
    let subjectsAdded = false;
    requiredSubjectNames.forEach(name => {
      // Check if it already exists (compare by name) using .some()
      const exists = state.subjects.some(s => s.name === name);
      if (!exists) {
        // If NOT found -> add it
        state.subjects.push({
          id: 'init-' + Math.random().toString(36).substring(2, 11),
          name: name
        });
        subjectsAdded = true;
      }
      // If found -> do nothing
    });

    // Reset today's stats if it's a new day
    const today = new Date().toDateString();
    if (state.lastStudyDate !== today) {
      state.todayStudyTime = 0;
    }

    // Step 4: Save the UPDATED state back to localStorage if changes were made
    if (subjectsAdded || !saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    return state;
  }

  private saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    this.render();
  }

  private checkStreak() {
    const today = new Date().toDateString();
    if (this.state.lastStudyDate === today) return;

    if (this.state.lastStudyDate) {
      const lastDate = new Date(this.state.lastStudyDate);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastDate.toDateString() === yesterday.toDateString()) {
        // Streak continues (will be updated when they study)
      } else if (lastDate.toDateString() !== today) {
        // Streak reset if missed more than a day
        this.state.streak = 0;
      }
    }
  }

  private init() {
    // Event Listeners
    document.getElementById('add-task-btn')?.addEventListener('click', () => this.addTask());
    document.getElementById('task-input')?.addEventListener('keypress', (e) => {
      if ((e as KeyboardEvent).key === 'Enter' && !(e as KeyboardEvent).shiftKey) {
        e.preventDefault();
        this.addTask();
      }
    });

    document.getElementById('new-subject-input')?.addEventListener('keypress', (e) => {
      if ((e as KeyboardEvent).key === 'Enter') {
        this.addSubject((e.target as HTMLInputElement).value);
        (e.target as HTMLInputElement).value = '';
      }
    });

    document.getElementById('timer-toggle')?.addEventListener('click', () => this.toggleTimer());
    document.getElementById('timer-reset')?.addEventListener('click', () => this.resetTimer());

    this.render();
  }

  // Task Management
  private addTask() {
    const input = document.getElementById('task-input') as HTMLTextAreaElement;
    const subjectSelect = document.getElementById('task-subject-select') as HTMLSelectElement;
    const text = input.value.trim();
    const subject = subjectSelect.value;

    if (!text) return;

    const newTask: Task = {
      id: Date.now().toString(),
      text,
      subject,
      completed: false,
      date: new Date().toDateString()
    };

    this.state.tasks.unshift(newTask);
    input.value = '';
    this.saveState();
  }

  public toggleTask(id: string) {
    const task = this.state.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveState();
    }
  }

  public deleteTask(id: string) {
    this.state.tasks = this.state.tasks.filter(t => t.id !== id);
    this.saveState();
  }

  // Subject Management
  private addSubject(name: string) {
    if (!name.trim()) return;
    if (this.state.subjects.some(s => s.name.toLowerCase() === name.toLowerCase())) return;

    this.state.subjects.push({
      id: Date.now().toString(),
      name: name.trim()
    });
    this.saveState();
  }

  // Timer Logic
  private toggleTimer() {
    const btn = document.getElementById('timer-toggle');
    if (this.isTimerRunning) {
      this.stopTimer();
      if (btn) btn.innerText = 'Start Session';
    } else {
      this.startTimer();
      if (btn) btn.innerText = 'Stop Session';
    }
  }

  private startTimer() {
    this.isTimerRunning = true;
    this.timerInterval = window.setInterval(() => {
      this.timerSeconds++;
      this.updateTimerDisplay();
    }, 1000);
  }

  private stopTimer() {
    this.isTimerRunning = false;
    if (this.timerInterval) clearInterval(this.timerInterval);
    
    // Save session
    if (this.timerSeconds > 0) {
      const today = new Date().toDateString();
      if (this.state.lastStudyDate !== today) {
        this.state.streak++;
        this.state.lastStudyDate = today;
      }
      this.state.todayStudyTime += this.timerSeconds;
      this.state.totalStudyTime += this.timerSeconds;
      this.timerSeconds = 0;
      this.saveState();
    }
    this.updateTimerDisplay();
  }

  private resetTimer() {
    this.stopTimer();
    this.timerSeconds = 0;
    this.updateTimerDisplay();
    const btn = document.getElementById('timer-toggle');
    if (btn) btn.innerText = 'Start Session';
  }

  private updateTimerDisplay() {
    const display = document.getElementById('timer-display');
    if (display) {
      const mins = Math.floor(this.timerSeconds / 60).toString().padStart(2, '0');
      const secs = (this.timerSeconds % 60).toString().padStart(2, '0');
      display.innerText = `${mins}:${secs}`;
    }
  }

  private formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  }

  // Rendering
  private render() {
    // Stats
    const statTime = document.getElementById('stat-time');
    const statTasks = document.getElementById('stat-tasks');
    const statStreak = document.getElementById('stat-streak');

    if (statTime) statTime.innerText = this.formatTime(this.state.todayStudyTime);
    if (statTasks) statTasks.innerText = this.state.tasks.filter(t => t.completed && t.date === new Date().toDateString()).length.toString();
    if (statStreak) statStreak.innerText = `${this.state.streak} Days`;

    // Task List
    const taskList = document.getElementById('task-list');
    if (taskList) {
      taskList.innerHTML = this.state.tasks.map(task => `
        <div class="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 group hover:border-slate-200 transition-all ${task.completed ? 'opacity-60' : ''}">
          <button onclick="window.app.toggleTask('${task.id}')" class="w-6 h-6 rounded-full border-2 ${task.completed ? 'bg-brand-indigo border-brand-indigo' : 'border-slate-200'} flex items-center justify-center transition-colors cursor-pointer">
            ${task.completed ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' : ''}
          </button>
          <div class="flex-1">
            <p class="font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}">${task.text}</p>
            ${task.subject ? `<span class="text-[10px] font-bold text-brand-indigo uppercase tracking-widest">${task.subject}</span>` : ''}
          </div>
          <button onclick="window.app.deleteTask('${task.id}')" class="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      `).join('');
    }

    // Subject Selects
    const subjectSelect = document.getElementById('task-subject-select');
    if (subjectSelect) {
      const options = this.state.subjects.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
      subjectSelect.innerHTML = `<option value="">No Subject</option>${options}`;
    }

    // Subject Cards
    const subjectCards = document.getElementById('subject-cards');
    if (subjectCards) {
      subjectCards.innerHTML = this.state.subjects.map(s => `
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
          <div class="flex justify-between items-start mb-4">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-brand-indigo flex items-center justify-center font-display font-bold">
              ${s.name.charAt(0)}
            </div>
            <button onclick="window.app.deleteSubject('${s.id}')" class="text-slate-200 hover:text-red-400 transition-colors cursor-pointer">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div>
            <h4 class="font-bold text-slate-900">${s.name}</h4>
            <p class="text-xs text-slate-400">${this.state.tasks.filter(t => t.subject === s.name).length} tasks</p>
          </div>
        </div>
      `).join('');
    }

    // Sidebar Subjects
    const sidebarSubjects = document.getElementById('sidebar-subjects');
    if (sidebarSubjects) {
      sidebarSubjects.innerHTML = this.state.subjects.map(s => `
        <a href="#tasks" class="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-colors font-medium text-sm">
          <span class="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
          ${s.name}
        </a>
      `).join('');
    }
  }

  public deleteSubject(id: string) {
    this.state.subjects = this.state.subjects.filter(s => s.id !== id);
    this.saveState();
  }
}

// Expose to window for inline onclick handlers
(window as any).app = new StudyFlow();
