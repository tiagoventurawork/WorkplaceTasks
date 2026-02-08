import React from 'react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    backgroundColor: '#fee2e2',
    border: '1px solid #fca5a5',
    color: '#dc2626',
  };

  const textStyles: React.CSSProperties = {
    flex: 1,
  };

  const dismissStyles: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '0 4px',
    lineHeight: 1,
    opacity: 0.7,
    color: '#dc2626',
  };

  return (
    <div style={containerStyles}>
      <span style={textStyles}>{message}</span>
      {onDismiss && (
        <button style={dismissStyles} onClick={onDismiss}>×</button>
      )}
    </div>
  );
};