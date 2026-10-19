import { Component, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Moon, Search, Plus, CalendarDays, Pencil, Trash2, LucideAngularModule } from 'lucide-angular';

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
  readonly Moon = Moon;
  readonly Search = Search;
  readonly CalendarDays = CalendarDays;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly Plus = Plus;
  taskTitle = signal('');
  taskCategory = signal('Personal');
  taskPriority = signal('Medium');
  taskDueDate = signal('');

  tasks = signal<Task[]>([
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
  ]);

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
    this.showAddTaskModal.set(true)
  }

  closeAddTaskModal() {
    this.showAddTaskModal.set(false)
  }

  submitTask() {
    const title = this.taskTitle().trim()

    if(!title) {
      return;
    }

    this.addTask({
      title,
      category: this.taskCategory(),
      priority: this.taskPriority(),
      dueDate: this.taskDueDate(),
      completed: false
    });

    this.taskTitle.set('');
    this.taskCategory.set('Personal');
    this.taskPriority.set('Medium');
    this.taskDueDate.set('');

    this.closeAddTaskModal();
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
}
