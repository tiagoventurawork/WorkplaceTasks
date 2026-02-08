import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { ErrorMessage } from '../common/ErrorMessage';

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await register(formData);
      navigate('/tasks');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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

  const isFormValid = formData.username && formData.email && formData.password && formData.confirmPassword;

  return (
    <div style={containerStyles}>
      <div style={cardStyles}>
        <div style={headerStyles}>
          <h1 style={titleStyles}>Create Account</h1>
          <p style={subtitleStyles}>Join Workplace Tasks today</p>
        </div>

        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

        <form onSubmit={handleSubmit} style={formStyles}>
          <div style={inputGroupStyles}>
            <label style={labelStyles}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
              style={inputStyles}
            />
          </div>

          <div style={inputGroupStyles}>
            <label style={labelStyles}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              style={inputStyles}
            />
          </div>

          <div style={inputGroupStyles}>
            <label style={labelStyles}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              style={inputStyles}
            />
          </div>

          <div style={inputGroupStyles}>
            <label style={labelStyles}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              style={inputStyles}
            />
          </div>

          <Button type="submit" fullWidth loading={isLoading} disabled={!isFormValid}>
            Create Account
          </Button>
        </form>

        <div style={footerStyles}>
          <p style={{ margin: 0 }}>
            Already have an account?{' '}
            <Link to="/login" style={linkStyles}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};