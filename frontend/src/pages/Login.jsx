import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Heart, Mail, Lock, AlertCircle, Loader } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.auth.login({
        email: formData.email,
        password: formData.password,
      });

      if (data.role === 'ADMIN') {
        navigate('/admin');
      } else if (data.role === 'RECIPIENT') {
        navigate('/recipient');
      } else {
        navigate('/donor');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card card">
        <div className="auth-header">
          <Link to="/" className="brand-logo">
            <Heart size={36} fill="#f43f5e" color="#f43f5e" className="pulse" />
          </Link>
          <h2>Welcome Back</h2>
          <p>Login to manage your profile or request urgent blood donations</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                name="email"
                required
                className="form-control"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                name="password"
                required
                className="form-control"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader size={18} className="spin" /> Logging in...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign up here</Link>
        </div>
      </div>

      <style>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, var(--bg-secondary) 0%, var(--bg-primary) 100%);
          padding: 24px;
        }

        .auth-card {
          width: 100%;
          max-width: 450px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
          border: 1px solid var(--card-border);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .brand-logo {
          display: inline-block;
          margin-bottom: 15px;
        }

        .auth-header h2 {
          font-size: 26px;
          margin-bottom: 8px;
        }

        .auth-header p {
          color: var(--text-secondary);
          font-size: 14.5px;
        }

        /* Input Icons */
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .input-with-icon .form-control {
          padding-left: 46px;
        }

        .w-full {
          width: 100%;
          margin-top: 10px;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .auth-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 14px;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
