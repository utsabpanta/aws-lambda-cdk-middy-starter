import { Task } from './taskTypes';

let tasks: Task[] = [];

export const taskStore = {
  addTask: (task: Task) => tasks.push(task),
  getTask: (id: string) => tasks.find((t) => t.id === id),
  updateTask: (id: string, updateData: Partial<Task>) => {
    const index = tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updateData };
      return tasks[index];
    }
    return null;
  },
  deleteTask: (id: string) => {
    const index = tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      tasks.splice(index, 1);
      return true;
    }
    return false;
  },
  listTasks: (status?: Task['status'], tag?: string) => {
    let filteredTasks = tasks;
    if (status) {
      filteredTasks = filteredTasks.filter((t) => t.status === status);
    }
    if (tag) {
      filteredTasks = filteredTasks.filter((t) => t.tags?.includes(tag));
    }
    return filteredTasks;
  },
};
