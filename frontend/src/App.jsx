import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { api } from './services/api';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import DonorDashboard from './pages/DonorDashboard';
import RecipientDashboard from './pages/RecipientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DonorSearch from './pages/DonorSearch';
import DashboardLayout from './components/DashboardLayout';
import { Heart } from 'lucide-react';

/**
 * Route protector checking role privileges and login state
 */
function ProtectedPage({ component: Component, allowedRoles }) {
  const user = api.auth.getCurrentUser();
  
  if (!user || !user.loggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect wrong role to their appropriate base dashboard
    return user.role === 'ADMIN' 
      ? <Navigate to="/admin" replace /> 
      : (user.role === 'RECIPIENT' 
        ? <Navigate to="/recipient" replace />
        : <Navigate to="/donor" replace />);
  }

  return (
    <DashboardLayout user={user}>
      <Component user={user} />
    </DashboardLayout>
  );
}

/**
 * Custom search route enabling both authenticated dashboard wrapping and public guest mode
 */
function SearchRoute() {
  const user = api.auth.getCurrentUser();
  
  if (user && user.loggedIn) {
    return (
      <DashboardLayout user={user}>
        <DonorSearch />
      </DashboardLayout>
    );
  }
  
  return (
    <div className="guest-search-container">
      <div className="container">
        <nav className="landing-nav">
          <Link to="/" className="nav-brand">
            <Heart size={26} fill="#f43f5e" color="#f43f5e" />
            <h1>Blood Life</h1>
          </Link>
          <div className="nav-links">
            <Link to="/" className="btn btn-secondary">Home</Link>
            <Link to="/login" className="btn btn-primary">Login</Link>
          </div>
        </nav>
        <main className="guest-search-main animate-fade-in">
          <DonorSearch />
        </main>
      </div>
      <style>{`
        .guest-search-container {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--bg-primary) 60%, var(--bg-secondary) 100%);
        }
        .landing-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 0;
          border-bottom: 1px solid var(--card-border);
          margin-bottom: 30px;
        }
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .nav-brand h1 {
          font-size: 24px;
        }
        .guest-search-main {
          padding-bottom: 50px;
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Public/Protected Hybrid Route */}
        <Route path="/search" element={<SearchRoute />} />

        {/* Authenticated Donor Routes */}
        <Route 
          path="/donor" 
          element={<ProtectedPage component={DonorDashboard} allowedRoles={['DONOR']} />} 
        />

        {/* Authenticated Recipient Routes */}
        <Route 
          path="/recipient" 
          element={<ProtectedPage component={RecipientDashboard} allowedRoles={['RECIPIENT']} />} 
        />

        {/* Authenticated Admin Routes */}
        <Route 
          path="/admin" 
          element={<ProtectedPage component={AdminDashboard} allowedRoles={['ADMIN']} />} 
        />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
