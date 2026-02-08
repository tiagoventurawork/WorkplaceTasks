import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const containerStyles: React.CSSProperties = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
  };

  const heroStyles: React.CSSProperties = {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    color: 'white',
    marginBottom: '60px',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '42px',
    margin: '0 0 16px 0',
    fontWeight: 700,
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: '18px',
    margin: '0 0 32px 0',
    opacity: 0.9,
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
    lineHeight: 1.6,
  };

  const actionsStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  };

  const sectionTitleStyles: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '32px',
    margin: '0 0 32px 0',
    color: '#111827',
  };

  const featuresGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '24px',
    marginBottom: '60px',
  };

  const featureCardStyles: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '32px 24px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  };

  const featureIconStyles: React.CSSProperties = {
    fontSize: '40px',
    marginBottom: '16px',
  };

  const featureTitleStyles: React.CSSProperties = {
    margin: '0 0 12px 0',
    fontSize: '18px',
    color: '#111827',
  };

  const featureTextStyles: React.CSSProperties = {
    margin: 0,
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: 1.5,
  };

  const rolesGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  };

  const roleCardStyles: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '28px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    borderTop: '4px solid #3b82f6',
  };

  const roleTitleStyles: React.CSSProperties = {
    margin: '0 0 16px 0',
    fontSize: '20px',
    color: '#111827',
  };

  const roleListStyles: React.CSSProperties = {
    margin: 0,
    paddingLeft: '20px',
  };

  const roleItemStyles: React.CSSProperties = {
    color: '#6b7280',
    fontSize: '14px',
    marginBottom: '8px',
    lineHeight: 1.4,
  };

  return (
    <div style={containerStyles}>
      <div style={heroStyles}>
        <h1 style={titleStyles}>Welcome to Workplace Tasks</h1>
        <p style={subtitleStyles}>
          A simple and efficient task management system with role-based access control.
          Organize your team's work with ease.
        </p>

        <div style={actionsStyles}>
          {isAuthenticated ? (
            <Link to="/tasks">
              <Button size="large">Go to Tasks</Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button size="large">Get Started</Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="large">Sign In</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <h2 style={sectionTitleStyles}>Features</h2>
      <div style={featuresGridStyles}>
        <div style={featureCardStyles}>
          <div style={featureIconStyles}>📋</div>
          <h3 style={featureTitleStyles}>Task Management</h3>
          <p style={featureTextStyles}>Create, edit, and organize tasks with status tracking.</p>
        </div>

        <div style={featureCardStyles}>
          <div style={featureIconStyles}>👥</div>
          <h3 style={featureTitleStyles}>Role-Based Access</h3>
          <p style={featureTextStyles}>Three roles with different permissions: Admin, Manager, and Member.</p>
        </div>

        <div style={featureCardStyles}>
          <div style={featureIconStyles}>🔒</div>
          <h3 style={featureTitleStyles}>Secure Authentication</h3>
          <p style={featureTextStyles}>JWT-based authentication to keep your data safe.</p>
        </div>

        <div style={featureCardStyles}>
          <div style={featureIconStyles}>🔍</div>
          <h3 style={featureTitleStyles}>Search & Filter</h3>
          <p style={featureTextStyles}>Easily find tasks with powerful search and filtering options.</p>
        </div>
      </div>

      <h2 style={sectionTitleStyles}>User Roles</h2>
      <div style={rolesGridStyles}>
        <div style={roleCardStyles}>
          <h3 style={roleTitleStyles}>👤 Member</h3>
          <ul style={roleListStyles}>
            <li style={roleItemStyles}>Create and view tasks</li>
            <li style={roleItemStyles}>Edit and delete own tasks</li>
            <li style={roleItemStyles}>Update status of assigned tasks</li>
          </ul>
        </div>

        <div style={roleCardStyles}>
          <h3 style={roleTitleStyles}>👔 Manager</h3>
          <ul style={roleListStyles}>
            <li style={roleItemStyles}>All Member permissions</li>
            <li style={roleItemStyles}>Edit any task</li>
            <li style={roleItemStyles}>Delete tasks they created</li>
          </ul>
        </div>

        <div style={{ ...roleCardStyles, borderTopColor: '#10b981' }}>
          <h3 style={roleTitleStyles}>🛡️ Admin</h3>
          <ul style={roleListStyles}>
            <li style={roleItemStyles}>Full access to all tasks</li>
            <li style={roleItemStyles}>Manage users and roles</li>
            <li style={roleItemStyles}>Delete any task</li>
          </ul>
        </div>
      </div>
    </div>
  );
};