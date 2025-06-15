import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';

// PrimeNG imports
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DragDropModule } from 'primeng/dragdrop';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CalendarModule } from 'primeng/calendar';


interface Resource {
  id: string;
  name: string;
  avatar: string;
  role: string;
  groupId: string;
}

interface ResourceGroup {
  id: string;
  name: string;
  expanded: boolean;
  resources: Resource[];
}

interface Task {
  id: string;
  title: string;
  resourceId: string;
  startTime: Date;
  endTime: Date;
  color: string;
  status: string;
}

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss']
})
export class CalenderComponent implements OnInit {

  // Timeline data
  resourceGroups: ResourceGroup[] = [];
  tasks: Task[] = [];
  timeSlots: Date[] = [];
  currentDate = new Date();
  
  // Dialog state
  displayTaskDialog = false;
  selectedTask: Task | null = null;
  
  // Dropdown options
  viewOptions: DropdownOption[] = [
    { label: 'Timeline', value: 'timeline' },
    { label: 'Calendar', value: 'calendar' },
    { label: 'Agenda', value: 'agenda' }
  ];
  
  statusOptions: DropdownOption[] = [
    { label: 'All Status', value: 'all' },
    { label: 'In Progress', value: 'progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Pending', value: 'pending' }
  ];
  
  // Selected dropdown values
  selectedView = 'timeline';
  selectedStatus = 'all';
  
  // Drag and drop
  draggedTask: Task | null = null;
  
  ngOnInit() {
    this.initializeData();
    this.generateTimeSlots();
  }
  

  
  generateTimeSlots() {
    this.timeSlots = [];
    const startHour = 8;
    const endHour = 18;
    
    for (let hour = startHour; hour <= endHour; hour++) {
      this.timeSlots.push(new Date(2025, 0, 15, hour, 0));
    }
  }
  
  toggleGroup(groupId: string) {
    const group = this.resourceGroups.find(g => g.id === groupId);
    if (group) {
      group.expanded = !group.expanded;
    }
  }
  
  getTasksForResource(resourceId: string): Task[] {
    return this.tasks.filter(task => task.resourceId === resourceId);
  }
  
  getTaskPosition(task: Task): any {
    const startHour = 8;
    const totalHours = 10; // 8 AM to 6 PM
    const containerWidth = 100; // percentage
    
    const taskStart = task.startTime.getHours() + (task.startTime.getMinutes() / 60);
    const taskEnd = task.endTime.getHours() + (task.endTime.getMinutes() / 60);
    const taskDuration = taskEnd - taskStart;
    
    const left = ((taskStart - startHour) / totalHours) * containerWidth;
    const width = (taskDuration / totalHours) * containerWidth;
    
    return {
      left: `${left}%`,
      width: `${width}%`
    };
  }
  
  getResourceName(resourceId: string): string {
    for (const group of this.resourceGroups) {
      const resource = group.resources.find(r => r.id === resourceId);
      if (resource) {
        return resource.name;
      }
    }
    return 'Unknown Resource';
  }
  
  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }
  
  openTaskDialog(task: Task) {
    this.selectedTask = task;
    this.displayTaskDialog = true;
  }
  
  closeTaskDialog() {
    this.displayTaskDialog = false;
    this.selectedTask = null;
  }
  
  // Drag and drop methods
  onTaskDragStart(task: Task) {
    this.draggedTask = task;
  }
  
  onTaskDragEnd() {
    this.draggedTask = null;
  }
  
  onResourceDrop(event: any, resourceId: string) {
    if (this.draggedTask) {
      // Update task resource
      const taskIndex = this.tasks.findIndex(t => t.id === this.draggedTask!.id);
      if (taskIndex !== -1) {
        this.tasks[taskIndex].resourceId = resourceId;
      }
    }
  }
  
  onResourceDragOver(event: any) {
    event.preventDefault();
  }
  
  // Navigation methods
  previousDay() {
    this.currentDate = new Date(this.currentDate.getTime() - 24 * 60 * 60 * 1000);
    this.generateTimeSlots();
  }
  
  nextDay() {
    this.currentDate = new Date(this.currentDate.getTime() + 24 * 60 * 60 * 1000);
    this.generateTimeSlots();
  }
  
  goToToday() {
    this.currentDate = new Date();
    this.generateTimeSlots();
  }
  
  formatCurrentDate(): string {
    return this.currentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

}

// bootstrapApplication(AppComponent, {
//   providers: [
//     importProvidersFrom(BrowserAnimationsModule)
//   ]
// });

