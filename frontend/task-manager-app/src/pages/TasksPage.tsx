import React, { useState, useEffect, useCallback } from 'react';
import { Task, TaskQueryParams, CreateTaskRequest, UpdateTaskRequest } from '../types';
import { taskService } from '../services/taskService';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { ErrorMessage } from '../components/common/ErrorMessage';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<TaskQueryParams>({
    pageNumber: 1,
    pageSize: 10
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await taskService.getTasks(filters);
      setTasks(response.items);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleFilterChange = (newFilters: TaskQueryParams) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({ pageNumber: 1, pageSize: 10 });
  };

  const handleCreateTask = async (data: CreateTaskRequest) => {
    setIsSubmitting(true);
    try {
      await taskService.createTask(data);
      setIsCreateModalOpen(false);
      fetchTasks();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (data: UpdateTaskRequest) => {
    if (!editingTask) return;

    setIsSubmitting(true);
    try {
      await taskService.updateTask(editingTask.id, data);
      setEditingTask(null);
      fetchTasks();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTask) return;

    setIsSubmitting(true);
    try {
      await taskService.deleteTask(deletingTask.id);
      setDeletingTask(null);
      fetchTasks();
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageStyles: React.CSSProperties = {
    paddingBottom: '40px',
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  };

  const titleStyles: React.CSSProperties = {
    margin: '0 0 4px 0',
    fontSize: '28px',
    fontWeight: 700,
    color: '#111827',
  };

  const subtitleStyles: React.CSSProperties = {
    margin: 0,
    color: '#6b7280',
    fontSize: '15px',
  };

  const deleteConfirmStyles: React.CSSProperties = {
    textAlign: 'center',
  };

  const deleteTextStyles: React.CSSProperties = {
    margin: '0 0 12px 0',
    color: '#374151',
    fontSize: '15px',
  };

  const deleteWarningStyles: React.CSSProperties = {
    color: '#dc2626',
    fontSize: '13px',
    margin: '0 0 24px 0',
  };

  const deleteActionsStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
  };

  return (
    <div style={pageStyles}>
      <div style={headerStyles}>
        <div>
          <h1 style={titleStyles}>Tasks</h1>
          <p style={subtitleStyles}>Manage your workplace tasks</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>+ New Task</Button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <TaskFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        onEdit={setEditingTask}
        onDelete={setDeletingTask}
      />

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleUpdateTask}
          onCancel={() => setEditingTask(null)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        title="Delete Task"
      >
        <div style={deleteConfirmStyles}>
          <p style={deleteTextStyles}>
            Are you sure you want to delete <strong>"{deletingTask?.title}"</strong>?
          </p>
          <p style={deleteWarningStyles}>This action cannot be undone.</p>
          <div style={deleteActionsStyles}>
            <Button variant="secondary" onClick={() => setDeletingTask(null)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm} loading={isSubmitting}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};