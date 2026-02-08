import React from 'react';
import { Task } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { canEditTask, canDeleteTask, getStatusColor, getStatusLabel } from '../../utils/permissions';
import { Button } from '../common/Button';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const { user } = useAuth();

  const showEditButton = canEditTask(task, user);
  const showDeleteButton = canDeleteTask(task, user);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const cardStyles: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
  };

  const titleStyles: React.CSSProperties = {
    margin: 0,
    fontSize: '18px',
    fontWeight: 600,
    color: '#111827',
    flex: 1,
  };

  const statusStyles: React.CSSProperties = {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 500,
    color: 'white',
    backgroundColor: getStatusColor(task.status),
    whiteSpace: 'nowrap',
  };

  const descriptionStyles: React.CSSProperties = {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: 1.5,
    margin: '0 0 16px 0',
  };

  const metaStyles: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '16px',
    paddingTop: '12px',
    borderTop: '1px solid #f3f4f6',
  };

  const metaItemStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  };

  const metaLabelStyles: React.CSSProperties = {
    fontSize: '11px',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const metaValueStyles: React.CSSProperties = {
    fontSize: '13px',
    color: '#374151',
    fontWeight: 500,
  };

  const actionsStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    paddingTop: '12px',
    borderTop: '1px solid #f3f4f6',
  };

  return (
    <div style={cardStyles}>
      <div style={headerStyles}>
        <h3 style={titleStyles}>{task.title}</h3>
        <span style={statusStyles}>{getStatusLabel(task.status)}</span>
      </div>

      {task.description && (
        <p style={descriptionStyles}>{task.description}</p>
      )}

      <div style={metaStyles}>
        <div style={metaItemStyles}>
          <span style={metaLabelStyles}>Created by</span>
          <span style={metaValueStyles}>{task.createdByUsername}</span>
        </div>
        {task.assignedToUsername && (
          <div style={metaItemStyles}>
            <span style={metaLabelStyles}>Assigned to</span>
            <span style={metaValueStyles}>{task.assignedToUsername}</span>
          </div>
        )}
        <div style={metaItemStyles}>
          <span style={metaLabelStyles}>Created</span>
          <span style={metaValueStyles}>{formatDate(task.createdAt)}</span>
        </div>
      </div>

      {(showEditButton || showDeleteButton) && (
        <div style={actionsStyles}>
          {showEditButton && (
            <Button variant="secondary" size="small" onClick={() => onEdit(task)}>
              ✏️ Edit
            </Button>
          )}
          {showDeleteButton && (
            <Button variant="danger" size="small" onClick={() => onDelete(task)}>
              🗑️ Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
};