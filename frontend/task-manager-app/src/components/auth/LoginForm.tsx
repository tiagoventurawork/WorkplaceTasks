import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { ErrorMessage } from '../common/ErrorMessage';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/tasks');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    padding: '20px',
  };

  const cardStyles: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
  };

  const headerStyles: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '32px',
  };

  const titleStyles: React.CSSProperties = {
    margin: '0 0 8px 0',
    fontSize: '28px',
    fontWeight: 700,
    color: '#111827',
  };

  const subtitleStyles: React.CSSProperties = {
    margin: 0,
    color: '#6b7280',
    fontSize: '15px',
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
  };

  const footerStyles: React.CSSProperties = {
    marginTop: '24px',
    textAlign: 'center',
    paddingTop: '24px',
    borderTop: '1px solid #e5e7eb',
    color: '#6b7280',
    fontSize: '14px',
  };

  const linkStyles: React.CSSProperties = {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: 500,
  };

  return (
    <div style={containerStyles}>
      <div style={cardStyles}>
        <div style={headerStyles}>
          <h1 style={titleStyles}>Welcome Back</h1>
          <p style={subtitleStyles}>Sign in to your Workplace Tasks account</p>
        </div>

        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

        <form onSubmit={handleSubmit} style={formStyles}>
          <div style={inputGroupStyles}>
            <label style={labelStyles}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={inputStyles}
            />
          </div>

          <div style={inputGroupStyles}>
            <label style={labelStyles}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={inputStyles}
            />
          </div>

          <Button type="submit" fullWidth loading={isLoading} disabled={!email || !password}>
            Sign In
          </Button>
        </form>

        <div style={footerStyles}>
          <p style={{ margin: 0 }}>
            Don't have an account?{' '}
            <Link to="/register" style={linkStyles}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};