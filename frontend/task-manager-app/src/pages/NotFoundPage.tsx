import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  const containerStyles: React.CSSProperties = {
    minHeight: 'calc(100vh - 200px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '40px 20px',
  };

  const codeStyles: React.CSSProperties = {
    fontSize: '120px',
    margin: 0,
    color: '#e5e7eb',
    fontWeight: 700,
    lineHeight: 1,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '28px',
    margin: '0 0 12px 0',
    color: '#111827',
  };

  const textStyles: React.CSSProperties = {
    color: '#6b7280',
    margin: '0 0 24px 0',
    fontSize: '16px',
  };

  return (
    <div style={containerStyles}>
      <div>
        <h1 style={codeStyles}>404</h1>
        <h2 style={titleStyles}>Page Not Found</h2>
        <p style={textStyles}>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/">
          <Button>Go to Home</Button>
        </Link>
      </div>
    </div>
  );
};