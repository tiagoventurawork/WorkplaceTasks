import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { canManageUsers, getRoleLabel } from '../../utils/permissions';
import { Button } from '../common/Button';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const headerStyles: React.CSSProperties = {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  };

  const containerStyles: React.CSSProperties = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
  };

  const logoStyles: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 700,
    color: '#111827',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const navStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    marginLeft: '32px',
  };

  const navLinkStyles: React.CSSProperties = {
    padding: '8px 16px',
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: 500,
    borderRadius: '8px',
  };

  const actionsStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };

  const userInfoStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  };

  const userNameStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#111827',
  };

  const userRoleStyles: React.CSSProperties = {
    fontSize: '12px',
    color: '#6b7280',
  };

  return (
    <header style={headerStyles}>
      <div style={containerStyles}>
        <Link to="/" style={logoStyles}>
          📋 Workplace Tasks
        </Link>

        {isAuthenticated && user && (
          <nav style={navStyles}>
            <Link to="/tasks" style={navLinkStyles}>Tasks</Link>
            {canManageUsers(user) && (
              <Link to="/users" style={navLinkStyles}>Users</Link>
            )}
          </nav>
        )}

        <div style={actionsStyles}>
          {isAuthenticated && user ? (
            <>
              <div style={userInfoStyles}>
                <span style={userNameStyles}>{user.username}</span>
                <span style={userRoleStyles}>{getRoleLabel(user.role)}</span>
              </div>
              <Button variant="ghost" size="small" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="small">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="small">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};