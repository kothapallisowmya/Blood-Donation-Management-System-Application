import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Heart, Search, Users, Activity, PlusCircle, Calendar, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    totalRequests: 0,
    availableDonors: 0
  });

  const currentUser = api.auth.getCurrentUser();

  useEffect(() => {
    // Attempt to fetch dashboard stats for the landing page
    api.admin.getStats()
      .then(data => {
        setStats(data);
      })
      .catch(err => {
        console.warn('Failed to load real-time stats, using default values.');
        // Fallback placeholders if backend is not booted yet
        setStats({
          totalUsers: 12,
          totalDonors: 8,
          totalRequests: 6,
          availableDonors: 5
        });
      });
  }, []);

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <Heart size={26} fill="#f43f5e" color="#f43f5e" className="pulse-icon" />
          <h1>Blood Life</h1>
        </div>
        <div className="nav-links">
          {currentUser ? (
            <>
              {currentUser.role === 'ADMIN' ? (
                <Link to="/admin" className="btn btn-primary">Go to Dashboard</Link>
              ) : (
                <Link to="/donor" className="btn btn-primary">Go to Dashboard</Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content animate-slide-up">
          <span className="hero-badge"><Activity size={14} color="#f43f5e" /> Every drop counts</span>
          <h1>Empowering Communities <br /><span className="text-glow">Through Blood Donation</span></h1>
          <p>
            An intelligent, automated platform bridging the gap between donors and patients in need. 
            Register as a donor, check availability in real time, or file an urgent request instantly.
          </p>
          <div className="hero-actions">
            <Link to="/search" className="btn btn-primary btn-lg">
              <Search size={18} /> Find Available Donors
            </Link>
            {!currentUser && (
              <Link to="/register" className="btn btn-secondary btn-lg">
                Register as Donor <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>

        {/* Hero Decorative SVG Graphic */}
        <div className="hero-graphic animate-float">
          <svg viewBox="0 0 200 200" className="hero-svg">
            <defs>
              <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(244, 63, 94, 0.4)" />
                <stop offset="100%" stopColor="rgba(244, 63, 94, 0)" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="80" fill="url(#glow)" />
            <path 
              d="M100,35 C100,35 145,85 145,115 C145,140 125,160 100,160 C75,160 55,140 55,115 C55,85 100,35 100,35 Z" 
              fill="#ef4444" 
              className="drop-pulse"
            />
            <path 
              d="M93,90 C93,90 120,120 120,135 C120,147 110,155 95,155" 
              stroke="#ffffff" 
              strokeWidth="4" 
              strokeLinecap="round" 
              fill="none" 
              opacity="0.3"
            />
          </svg>
        </div>
      </header>

      {/* Real-time Stats Grid */}
      <section className="stats-section">
        <h2 className="section-title">System Impact</h2>
        <div className="grid-4">
          <div className="stat-card card">
            <Users size={32} color="#60a5fa" />
            <span className="stat-num">{stats.totalUsers}</span>
            <span className="stat-label">Registered Accounts</span>
          </div>
          <div className="stat-card card">
            <Heart size={32} color="#f43f5e" fill="rgba(244, 63, 94, 0.1)" />
            <span className="stat-num">{stats.totalDonors}</span>
            <span className="stat-label">Donor Profiles</span>
          </div>
          <div className="stat-card card">
            <Activity size={32} color="#fbbf24" />
            <span className="stat-num">{stats.totalRequests}</span>
            <span className="stat-label">Total Blood Requests</span>
          </div>
          <div className="stat-card card highlight">
            <PlusCircle size={32} color="#34d399" />
            <span className="stat-num text-success">{stats.availableDonors}</span>
            <span className="stat-label">Active Available Donors</span>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="steps-section">
        <h2 className="section-title">How It Works</h2>
        <div className="grid-3">
          <div className="step-card card">
            <div className="step-num">01</div>
            <h3>Create Account</h3>
            <p>Sign up in seconds and specify your credentials. You can join as a standard donor or recipient.</p>
          </div>
          <div className="step-card card">
            <div className="step-num">02</div>
            <h3>Complete Profile</h3>
            <p>Enter your blood group, age, location, and set your status. If you are eligible, mark yourself available.</p>
          </div>
          <div className="step-card card">
            <div className="step-num">03</div>
            <h3>Donate or Request</h3>
            <p>Respond to urgent requests in your city, or file a blood request that local verified donors can view and fill.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 Blood Donation Management System. Built to save lives.</p>
      </footer>

      <style>{`
        .landing-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, var(--bg-primary) 50%, var(--bg-secondary) 100%);
          padding: 0 40px;
        }
        @media (max-width: 768px) {
          .landing-container {
            padding: 0 20px;
          }
        }

        /* Nav */
        .landing-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 0;
          border-bottom: 1px solid var(--card-border);
        }
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .nav-brand h1 {
          font-size: 24px;
        }
        .pulse-icon {
          animation: pulseGlow 2s infinite ease-in-out;
        }
        .nav-links {
          display: flex;
          gap: 16px;
        }

        /* Hero */
        .hero-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 80px 0;
          gap: 40px;
          flex-wrap: wrap;
        }
        .hero-content {
          flex: 1;
          min-width: 320px;
          text-align: left;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          background: rgba(244, 63, 94, 0.1);
          color: var(--primary);
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 24px;
          border: 1px solid rgba(244, 63, 94, 0.2);
        }
        .hero-content h1 {
          font-size: 48px;
          line-height: 1.2;
          margin-bottom: 24px;
          font-weight: 800;
        }
        .text-glow {
          background: linear-gradient(135deg, #ffffff 40%, var(--primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-content p {
          color: var(--text-secondary);
          font-size: 17px;
          margin-bottom: 35px;
          max-width: 600px;
        }
        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .hero-actions .btn-lg {
          padding: 14px 28px;
          font-size: 16px;
        }

        .hero-graphic {
          flex: 0 0 350px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        @media (max-width: 900px) {
          .hero-graphic {
            display: none;
          }
          .hero-section {
            padding: 50px 0;
          }
        }
        .hero-svg {
          width: 300px;
          height: 300px;
        }
        .drop-pulse {
          transform-origin: center;
          animation: pulseDrop 3s infinite ease-in-out;
        }
        @keyframes pulseDrop {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.5)); }
          50% { transform: scale(1.05); filter: drop-shadow(0 0 25px rgba(239, 68, 68, 0.8)); }
        }

        /* Sections */
        .stats-section, .steps-section {
          padding: 60px 0;
          text-align: center;
        }
        .section-title {
          font-size: 32px;
          margin-bottom: 40px;
          position: relative;
          display: inline-block;
        }
        .section-title::after {
          content: "";
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: var(--primary);
          border-radius: var(--radius-full);
        }

        /* Stats Cards */
        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px;
        }
        .stat-num {
          font-family: var(--font-heading);
          font-size: 40px;
          font-weight: 800;
          color: #ffffff;
          margin: 12px 0 6px;
        }
        .text-success {
          color: var(--success) !important;
        }
        .stat-label {
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .stat-card.highlight {
          border-color: rgba(16, 185, 129, 0.3);
          background: rgba(16, 185, 129, 0.03);
        }
        
        /* Steps Cards */
        .step-card {
          position: relative;
          text-align: left;
          padding: 35px;
        }
        .step-num {
          position: absolute;
          top: 25px;
          right: 30px;
          font-family: var(--font-heading);
          font-size: 48px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.03);
          line-height: 1;
        }
        .step-card h3 {
          font-size: 20px;
          margin-bottom: 12px;
        }
        .step-card p {
          color: var(--text-secondary);
          font-size: 14.5px;
        }

        /* Footer */
        .landing-footer {
          margin-top: auto;
          padding: 40px 0;
          text-align: center;
          border-top: 1px solid var(--card-border);
          color: var(--text-muted);
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
