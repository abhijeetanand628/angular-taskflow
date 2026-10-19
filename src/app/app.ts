import { Component, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Moon, Search, Plus, CalendarDays, Pencil, Trash2, LucideAngularModule } from 'lucide-angular';

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

  tasks = signal([
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
