import { Component, signal, computed, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Search, Plus, CalendarDays, Pencil, Trash2, LucideAngularModule } from 'lucide-angular';

interface Task {
  id: number;
  title: string;
  category: string;
  priority: string;
  dueDate: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LucideAngularModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly Search = Search;
  readonly CalendarDays = CalendarDays;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly Plus = Plus;
  taskTitle = signal('');
  taskCategory = signal('');
  taskPriority = signal('');
  taskDueDate = signal('');
  editingTaskId = signal<number | null>(null);
  selectedTab = signal<'All' | 'Active' | 'Completed'>('All');

  constructor() {
    effect(() => {
      const currentTasks = this.tasks();

      try {
        localStorage.setItem(
          'taskflow-tasks',
          JSON.stringify(currentTasks)
        );
      } catch (error) {
        console.error('Could not save tasks:', error);
      }
    });
  }

  tasks = signal<Task[]>(this.loadTasks());

  private loadTasks(): Task[] {
    const defaultTasks: Task[] = [
      {
        id: 1,
        title: 'task2',
        category: 'Personal',
        priority: 'High',
        dueDate: 'May 29, 2026',
        completed: false
      },
      {
        id: 2,
        title: 'abc',
        category: 'Personal',
        priority: 'Medium',
        dueDate: 'May 28, 2026',
        completed: false
      },
      {
        id: 3,
        title: 'test',
        category: 'Others',
        priority: 'Medium',
        dueDate: '',
        completed: true
      }
    ];

    try {
      const savedTasks = localStorage.getItem('taskflow-tasks');

      if (savedTasks !== null) {
        return JSON.parse(savedTasks) as Task[];
      }
    } catch (error) {
      console.error('Could not load saved tasks:', error);
    }

    return defaultTasks;
  }

  totalTasks = computed(() => this.tasks().length)

  completedCount = computed(() => 
    this.tasks().filter(task => task.completed).length
  )

  pendingCount = computed(() => 
    this.tasks().filter(task => !task.completed).length
  )

  progressPercentage = computed(() => {
    const total = this.totalTasks();

    if(total === 0)
    {
      return 0;
    }

    return (this.completedCount() / total) * 100;
  })

  addTask(task: Omit<Task, 'id'>) {
    const newTask: Task = {
      ...task,
      id: Date.now()
    };

    this.tasks.update(currentTasks => [
      ...currentTasks, newTask
    ])
  }

  showAddTaskModal = signal(false)

  openAddTaskModal() {
    this.resetTaskForm();
    this.showAddTaskModal.set(true);
  }

  closeAddTaskModal() {
    this.showAddTaskModal.set(false)
  }

  submitTask() {
    const title = this.taskTitle().trim()

    if(!title) {
      return;
    }

    const taskData = {
      title,
      category: this.taskCategory(),
      priority: this.taskPriority(),
      dueDate: this.taskDueDate(),
      completed: false
    };

    const editingId = this.editingTaskId();

    if (editingId !== null) {
      this.tasks.update(currentTasks =>
        currentTasks.map(task =>
          task.id === editingId
            ? { ...task, ...taskData, completed: task.completed }
            : task
        )
      );
    } else {
      this.addTask(taskData);
    }

    this.resetTaskForm();
    this.closeAddTaskModal();
  }

  editTask(id: number) {
    const task = this.tasks().find(task => task.id === id)

    if(!task)
    {
      return;
    }

    this.editingTaskId.set(task.id);
    this.taskTitle.set(task.title);
    this.taskCategory.set(task.category);
    this.taskPriority.set(task.priority);
    this.taskDueDate.set(task.dueDate);
    this.showAddTaskModal.set(true);
  }

  resetTaskForm() {
    this.editingTaskId.set(null);
    this.taskTitle.set('');
    this.taskCategory.set('');
    this.taskPriority.set('');
    this.taskDueDate.set('');
  }

  deleteTask(id: number) {
    this.tasks.update(currentTasks => 
      currentTasks.filter(task => task.id !== id)
    )
  }

  clearCompleted() {
    this.tasks.update(currentTasks => 
      currentTasks.filter(task => !task.completed)
    )
  }

  toggleTask(id: number) {
    this.tasks.update(currentTasks => 
      currentTasks.map(task => 
        task.id === id
        ? {...task, completed: !task.completed}
        : task
      )
    )
  }

  filteredTasks = computed(() => {
    const tab = this.selectedTab();

    return this.tasks().filter(task => {
      if (tab === 'Active') {
        return !task.completed;
      }

      if (tab === 'Completed') {
        return task.completed;
      }

      return true;
    });
  });
}
