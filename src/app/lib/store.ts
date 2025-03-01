"use client";

import { create } from "zustand";
import { Task } from "../types/index.types";

interface TaskState {
  tasks: Task[];
  activeTaskId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  setActiveTaskId: (id: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  activeTaskId: null,
  isLoading: false,
  error: null,
  
  // Actions
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) => 
    set((state) => ({
      tasks: state.tasks.map((task) => 
        task.id === id ? { ...task, ...updates } : task
      ),
    })),
  removeTask: (id) => 
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
  setActiveTaskId: (activeTaskId) => set({ activeTaskId }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
})); 