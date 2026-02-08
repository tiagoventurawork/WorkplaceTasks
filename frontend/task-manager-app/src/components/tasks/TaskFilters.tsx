import React from 'react';
import { TaskStatus, TaskQueryParams } from '../../types';
import { Button } from '../common/Button';

interface TaskFiltersProps {
  filters: TaskQueryParams;
  onFilterChange: (filters: TaskQueryParams) => void;
  onReset: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({ filters, onFilterChange, onReset }) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFilterChange({
      ...filters,
      status: value === '' ? undefined : parseInt(value, 10) as TaskStatus,
      pageNumber: 1
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      searchTerm: e.target.value || undefined,
      pageNumber: 1
    });
  };

  const hasActiveFilters = filters.status !== undefined || filters.searchTerm;

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    alignItems: 'flex-end',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '24px',
  };

  const filterGroupStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: '150px',
  };

  const labelStyles: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 500,
    color: '#6b7280',
  };

  const inputStyles: React.CSSProperties = {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    minWidth: '200px',
  };

  const selectStyles: React.CSSProperties = {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    backgroundColor: 'white',
  };

  return (
    <div style={containerStyles}>
      <div style={filterGroupStyles}>
        <label style={labelStyles}>Search</label>
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.searchTerm || ''}
          onChange={handleSearchChange}
          style={inputStyles}
        />
      </div>

      <div style={filterGroupStyles}>
        <label style={labelStyles}>Status</label>
        <select
          value={filters.status ?? ''}
          onChange={handleStatusChange}
          style={selectStyles}
        >
          <option value="">All Statuses</option>
          <option value={TaskStatus.Pending}>Pending</option>
          <option value={TaskStatus.InProgress}>In Progress</option>
          <option value={TaskStatus.Done}>Done</option>
        </select>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="small" onClick={onReset}>
          Clear Filters
        </Button>
      )}
    </div>
  );
};