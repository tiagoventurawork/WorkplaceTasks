import api from './api';

interface User {
  id: string;
  username: string;
  email: string;
  role: number;
  roleName: string;
}

interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface UpdateUserRoleRequest {
  role: number;
}

export const userService = {
  async getUsers(pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<User>> {
    const response = await api.get<PaginatedResponse<User>>('/users', {
      params: { pageNumber, pageSize }
    });
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async updateUserRole(id: string, role: number): Promise<User> {
    const response = await api.put<User>(`/users/${id}/role`, { role } as UpdateUserRoleRequest);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }
};