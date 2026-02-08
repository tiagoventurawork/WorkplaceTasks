import React from 'react';
import { Task } from '../../types';
import { TaskCard } from './TaskCard';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, isLoading, onEdit, onDelete }) => {
  if (isLoading) {
    return <LoadingSpinner message="Loading tasks..." />;
  }

  if (tasks.length === 0) {
    const emptyStyles: React.CSSProperties = {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: '#f9fafb',
      borderRadius: '12px',
      border: '2px dashed #e5e7eb',
    };

    const iconStyles: React.CSSProperties = {
      fontSize: '48px',
      marginBottom: '16px',
    };

    const titleStyles: React.CSSProperties = {
      margin: '0 0 8px 0',
      fontSize: '20px',
      color: '#374151',
    };

    const textStyles: React.CSSProperties = {
      margin: 0,
      color: '#6b7280',
      fontSize: '15px',
    };

    return (
      <div style={emptyStyles}>
        <div style={iconStyles}>📋</div>
        <h3 style={titleStyles}>No tasks found</h3>
        <p style={textStyles}>Create your first task to get started!</p>
      </div>
    );
  }

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  };

  return (
    <div style={gridStyles}>
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};