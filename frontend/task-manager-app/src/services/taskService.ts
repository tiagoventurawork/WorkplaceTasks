import api from './api';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskQueryParams, PaginatedResponse } from '../types';

export const taskService = {
  async getTasks(params?: TaskQueryParams): Promise<PaginatedResponse<Task>> {
    const response = await api.get<PaginatedResponse<Task>>('/tasks', { params });
    return response.data;
  },

  async getTaskById(id: string): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  async createTask(data: CreateTaskRequest): Promise<Task> {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  }
};