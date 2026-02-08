import React, { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

interface User {
  id: string;
  username: string;
  email: string;
  role: number;
  roleName: string;
}

const getRoleLabel = (role: number): string => {
  const labels: Record<number, string> = {
    0: 'Member',
    1: 'Manager',
    2: 'Admin'
  };
  return labels[role] || 'Unknown';
};

const getRoleBadgeColor = (role: number): string => {
  const colors: Record<number, string> = {
    0: '#3b82f6',
    1: '#f59e0b',
    2: '#10b981'
  };
  return colors[role] || '#6b7280';
};

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<number>(0);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userService.getUsers(1, 50);
      setUsers(response.items);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setSelectedRole(user.role);
  };

  const handleUpdateRole = async () => {
    if (!editingUser) return;

    setIsSubmitting(true);
    try {
      await userService.updateUserRole(editingUser.id, selectedRole);
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;

    setIsSubmitting(true);
    try {
      await userService.deleteUser(deletingUser.id);
      setDeletingUser(null);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styles
  const pageStyles: React.CSSProperties = {
    paddingBottom: '40px',
  };

  const headerStyles: React.CSSProperties = {
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

  const tableContainerStyles: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  };

  const tableStyles: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyles: React.CSSProperties = {
    padding: '16px 20px',
    textAlign: 'left',
    backgroundColor: '#f9fafb',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#6b7280',
    borderBottom: '1px solid #e5e7eb',
  };

  const tdStyles: React.CSSProperties = {
    padding: '16px 20px',
    borderBottom: '1px solid #f3f4f6',
  };

  const usernameStyles: React.CSSProperties = {
    fontWeight: 600,
    color: '#111827',
  };

  const emailStyles: React.CSSProperties = {
    color: '#6b7280',
    fontSize: '14px',
  };

  const badgeStyles = (role: number): React.CSSProperties => ({
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 500,
    color: 'white',
    backgroundColor: getRoleBadgeColor(role),
  });

  const actionsStyles: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
  };

  const formGroupStyles: React.CSSProperties = {
    marginBottom: '20px',
  };

  const labelStyles: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: '#374151',
    marginBottom: '6px',
  };

  const selectStyles: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '15px',
    cursor: 'pointer',
    backgroundColor: 'white',
  };

  const permissionsBoxStyles: React.CSSProperties = {
    backgroundColor: '#f9fafb',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px',
  };

  const permissionsTitleStyles: React.CSSProperties = {
    margin: '0 0 12px 0',
    fontSize: '14px',
    color: '#374151',
    fontWeight: 600,
  };

  const permissionsListStyles: React.CSSProperties = {
    margin: 0,
    paddingLeft: '20px',
  };

  const permissionsItemStyles: React.CSSProperties = {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '4px',
  };

  const modalActionsStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb',
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

  if (isLoading) {
    return (
      <div style={pageStyles}>
        <div style={headerStyles}>
          <h1 style={titleStyles}>User Management</h1>
          <p style={subtitleStyles}>Manage user roles and permissions (Admin only)</p>
        </div>
        <LoadingSpinner message="Loading users..." />
      </div>
    );
  }

  return (
    <div style={pageStyles}>
      <div style={headerStyles}>
        <h1 style={titleStyles}>User Management</h1>
        <p style={subtitleStyles}>Manage user roles and permissions (Admin only)</p>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <div style={tableContainerStyles}>
        <table style={tableStyles}>
          <thead>
            <tr>
              <th style={thStyles}>Username</th>
              <th style={thStyles}>Email</th>
              <th style={thStyles}>Role</th>
              <th style={thStyles}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={tdStyles}>
                  <span style={usernameStyles}>{user.username}</span>
                </td>
                <td style={tdStyles}>
                  <span style={emailStyles}>{user.email}</span>
                </td>
                <td style={tdStyles}>
                  <span style={badgeStyles(user.role)}>{getRoleLabel(user.role)}</span>
                </td>
                <td style={tdStyles}>
                  <div style={actionsStyles}>
                    <Button variant="secondary" size="small" onClick={() => handleEditClick(user)}>
                      ✏️ Edit Role
                    </Button>
                    <Button variant="danger" size="small" onClick={() => setDeletingUser(user)}>
                      🗑️ Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          No users found.
        </div>
      )}

      {/* Edit Role Modal */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit User Role"
      >
        <div>
          <p style={{ margin: '0 0 20px 0', color: '#374151' }}>
            Change role for <strong>{editingUser?.username}</strong>
          </p>

          <div style={formGroupStyles}>
            <label style={labelStyles}>Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(parseInt(e.target.value, 10))}
              style={selectStyles}
            >
              <option value={0}>Member</option>
              <option value={1}>Manager</option>
              <option value={2}>Admin</option>
            </select>
          </div>

          <div style={permissionsBoxStyles}>
            <h4 style={permissionsTitleStyles}>Role Permissions:</h4>
            {selectedRole === 0 && (
              <ul style={permissionsListStyles}>
                <li style={permissionsItemStyles}>Can create tasks</li>
                <li style={permissionsItemStyles}>Can view all tasks</li>
                <li style={permissionsItemStyles}>Can edit/delete own tasks only</li>
                <li style={permissionsItemStyles}>Can update status of assigned tasks</li>
              </ul>
            )}
            {selectedRole === 1 && (
              <ul style={permissionsListStyles}>
                <li style={permissionsItemStyles}>Can create tasks</li>
                <li style={permissionsItemStyles}>Can view all tasks</li>
                <li style={permissionsItemStyles}>Can edit any task</li>
                <li style={permissionsItemStyles}>Can delete own tasks only</li>
              </ul>
            )}
            {selectedRole === 2 && (
              <ul style={permissionsListStyles}>
                <li style={permissionsItemStyles}>Full access to all tasks</li>
                <li style={permissionsItemStyles}>Can manage users and roles</li>
                <li style={permissionsItemStyles}>Can delete any task</li>
              </ul>
            )}
          </div>

          <div style={modalActionsStyles}>
            <Button variant="secondary" onClick={() => setEditingUser(null)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} loading={isSubmitting}>
              Update Role
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        title="Delete User"
      >
        <div style={deleteConfirmStyles}>
          <p style={deleteTextStyles}>
            Are you sure you want to delete <strong>"{deletingUser?.username}"</strong>?
          </p>
          <p style={deleteWarningStyles}>
            This action cannot be undone. The user must not have any tasks.
          </p>
          <div style={deleteActionsStyles}>
            <Button variant="secondary" onClick={() => setDeletingUser(null)} disabled={isSubmitting}>
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