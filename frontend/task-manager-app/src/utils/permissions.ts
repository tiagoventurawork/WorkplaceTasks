import { Task, User, UserRole } from '../types';

export const canEditTask = (task: Task, user: User | null): boolean => {
  if (!user) return false;
  
  switch (user.role) {
    case UserRole.Admin:
      return true;
    case UserRole.Manager:
      return true;
    case UserRole.Member:
      return task.createdById === user.id || task.assignedToId === user.id;
    default:
      return false;
  }
};

export const canDeleteTask = (task: Task, user: User | null): boolean => {
  if (!user) return false;
  
  switch (user.role) {
    case UserRole.Admin:
      return true;
    case UserRole.Manager:
      return task.createdById === user.id;
    case UserRole.Member:
      return task.createdById === user.id;
    default:
      return false;
  }
};

export const canManageUsers = (user: User | null): boolean => {
  return user?.role === UserRole.Admin;
};

export const getStatusLabel = (status: number): string => {
  const labels: Record<number, string> = {
    0: 'Pending',
    1: 'In Progress',
    2: 'Done'
  };
  return labels[status] || 'Unknown';
};

export const getStatusColor = (status: number): string => {
  const colors: Record<number, string> = {
    0: '#f59e0b',
    1: '#3b82f6',
    2: '#10b981'
  };
  return colors[status] || '#6b7280';
};

export const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    [UserRole.Member]: 'Member',
    [UserRole.Manager]: 'Manager',
    [UserRole.Admin]: 'Admin'
  };
  return labels[role];
};