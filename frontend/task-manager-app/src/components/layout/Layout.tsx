import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const Layout: React.FC = () => {
  const layoutStyles: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f3f4f6',
  };

  const mainStyles: React.CSSProperties = {
    flex: 1,
    padding: '24px',
  };

  const containerStyles: React.CSSProperties = {
    maxWidth: '1280px',
    margin: '0 auto',
  };

  return (
    <div style={layoutStyles}>
      <Header />
      <main style={mainStyles}>
        <div style={containerStyles}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};