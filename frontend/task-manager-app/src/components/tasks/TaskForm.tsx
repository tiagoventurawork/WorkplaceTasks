import React, { useState, useEffect } from 'react';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus } from '../../types';
import { Button } from '../common/Button';
import { ErrorMessage } from '../common/ErrorMessage';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TaskStatus.Pending
  });
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!task;

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status
      });
    }
  }, [task]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save task');
    }
  };

  const formStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const inputGroupStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  };

  const labelStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: '#374151',
  };

  const inputStyles: React.CSSProperties = {
    padding: '12px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '15px',
    fontFamily: 'inherit',
  };

  const textareaStyles: React.CSSProperties = {
    ...inputStyles,
    resize: 'vertical',
    minHeight: '100px',
  };

  const selectStyles: React.CSSProperties = {
    ...inputStyles,
    cursor: 'pointer',
    backgroundColor: 'white',
  };

  const actionsStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '8px',
    paddingTop: '20px',
    borderTop: '1px solid #e5e7eb',
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles}>
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <div style={inputGroupStyles}>
        <label style={labelStyles}>Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          required
          maxLength={200}
          style={inputStyles}
        />
      </div>

      <div style={inputGroupStyles}>
        <label style={labelStyles}>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description (optional)"
          maxLength={2000}
          style={textareaStyles}
        />
      </div>

      <div style={inputGroupStyles}>
        <label style={labelStyles}>Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={selectStyles}
        >
          <option value={TaskStatus.Pending}>Pending</option>
          <option value={TaskStatus.InProgress}>In Progress</option>
          <option value={TaskStatus.Done}>Done</option>
        </select>
      </div>

      <div style={actionsStyles}>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading} disabled={!formData.title.trim()}>
          {isEditMode ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};