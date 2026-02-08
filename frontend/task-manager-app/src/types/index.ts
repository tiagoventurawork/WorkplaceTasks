export enum TaskStatus {
  Pending = 0,
  InProgress = 1,
  Done = 2
}

export enum UserRole {
  Member = 0,
  Manager = 1,
  Admin = 2
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  roleName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  expiration: string;
  user: User;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  statusName: string;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  createdByUsername: string;
  assignedToId?: string;
  assignedToUsername?: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  status?: TaskStatus;
  assignedToId?: string;
}

export interface UpdateTaskRequest {
  title: string;
  description: string;
  status: TaskStatus;
  assignedToId?: string;
}

export interface TaskQueryParams {
  pageNumber?: number;
  pageSize?: number;
  status?: TaskStatus;
  searchTerm?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}