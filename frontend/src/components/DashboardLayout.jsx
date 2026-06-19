import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Heart, 
  User, 
  PlusCircle, 
  Search, 
  LogOut, 
  Activity, 
  Shield, 
  Menu, 
  X,
  Users,
  Bell
} from 'lucide-react';

export default function DashboardLayout({ children, user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    if (user && user.userId) {
      fetchNotifications();
      // Poll every 15 seconds to check for new approvals
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const data = await api.notifications.getUserNotifications(user.userId);
      setNotifications(data || []);
      const count = await api.notifications.getUnreadCount(user.userId);
      setUnreadCount(count || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.notifications.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleLogout = () => {
    api.auth.logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  // Define sidebar navigation links based on user role
  const getNavItems = () => {
    if (user.role === 'ADMIN') {
      return [
        { label: 'Admin Dashboard', path: '/admin', icon: <Activity size={20} /> },
        { label: 'Donor Database', path: '/search', icon: <Users size={20} /> },
      ];
    } else if (user.role === 'RECIPIENT') {
      return [
        { label: 'Patient Portal', path: '/recipient', icon: <User size={20} /> },
        { label: 'Find Donors', path: '/search', icon: <Search size={20} /> },
      ];
    } else {
      return [
        { label: 'Donor Portal', path: '/donor', icon: <User size={20} /> },
        { label: 'Find Donors', path: '/search', icon: <Search size={20} /> },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="dashboard-container">
      {/* Sidebar navigation */}
      <aside className={`dashboard-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <Heart size={28} className="brand-icon pulse" fill="#f43f5e" color="#f43f5e" />
          <h2>Blood Life</h2>
        </div>

        <div className="user-profile-summary">
          <div className="avatar">
            {user.role === 'ADMIN' ? <Shield size={22} color="#fbbf24" /> : <User size={22} color="#f43f5e" />}
          </div>
          <div className="user-details">
            <span className="user-email" title={user.email}>{user.email}</span>
            <span className="role-tag">{user.role}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`nav-link ${isActive(item.path)}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
            <li className="logout-nav">
              <button onClick={handleLogout} className="nav-link logout-btn">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main dashboard content */}
      <div className="dashboard-main">
        <header className="dashboard-header">
          <button 
            className="mobile-toggle-btn btn-icon-only btn-secondary" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="header-actions">
            {user && user.role !== 'ADMIN' && (
              <div className="notification-bell-container">
                <button 
                  className={`btn-icon-only btn-secondary notification-bell-btn ${notificationsOpen ? 'active' : ''}`}
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                </button>

                {notificationsOpen && (
                  <div className="notification-dropdown">
                    <div className="dropdown-header">
                      <h4>Notifications</h4>
                      {unreadCount > 0 && <span className="unread-lbl">{unreadCount} new</span>}
                    </div>
                    <div className="dropdown-body">
                      {notifications.length === 0 ? (
                        <div className="empty-notifications">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className={`notification-item ${!notif.read ? 'unread' : ''}`}
                            onClick={() => {
                              handleMarkAsRead(notif.id);
                              setNotificationsOpen(false);
                            }}
                          >
                            <div className="notification-content-row">
                              <p className="notification-msg">{notif.message}</p>
                              {!notif.read && <span className="read-dot" />}
                            </div>
                            <span className="notification-time">
                              {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Link to="/" className="home-link btn btn-secondary">
              Go to Home Page
            </Link>
          </div>
        </header>

        <main className="dashboard-content animate-fade-in">
          {children}
        </main>
      </div>

      <style>{`
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          width: 100%;
          background-color: var(--bg-primary);
        }

        /* Sidebar Style */
        .dashboard-sidebar {
          width: 280px;
          background-color: var(--bg-secondary);
          border-right: 1px solid var(--card-border);
          display: flex;
          flex-direction: column;
          padding: 30px 20px;
          transition: transform var(--transition-normal);
          z-index: 100;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 35px;
          padding-left: 10px;
        }
        .sidebar-brand h2 {
          font-size: 22px;
          background: linear-gradient(135deg, #ffffff 30%, var(--text-secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .pulse {
          animation: pulseGlow 2s infinite ease-in-out;
        }

        .user-profile-summary {
          display: flex;
          align-items: center;
          gap: 15px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-md);
          padding: 15px;
          margin-bottom: 30px;
        }
        
        .avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--card-border);
        }

        .user-details {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .user-email {
          font-size: 13.5px;
          font-weight: 500;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .role-tag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--primary);
          text-transform: uppercase;
          margin-top: 2px;
        }

        /* Sidebar Navigation */
        .sidebar-nav {
          flex: 1;
        }
        .sidebar-nav ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          height: 100%;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          font-size: 15px;
          font-weight: 500;
          transition: all var(--transition-fast);
          width: 100%;
          text-align: left;
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .nav-link:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.03);
        }

        .nav-link.active {
          color: #ffffff;
          background: var(--primary);
          box-shadow: 0 4px 15px var(--primary-glow);
        }
        
        .logout-nav {
          margin-top: auto;
          border-top: 1px solid var(--card-border);
          padding-top: 15px;
        }
        .logout-btn {
          color: #f87171;
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.08);
          color: #ef4444;
        }

        /* Main Dashboard Space */
        .dashboard-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          overflow-y: auto;
        }

        .dashboard-header {
          height: 70px;
          border-bottom: 1px solid var(--card-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 35px;
          background: rgba(11, 15, 25, 0.5);
          backdrop-filter: blur(8px);
        }

        .mobile-toggle-btn {
          display: none;
        }

        .dashboard-content {
          padding: 35px;
          flex: 1;
        }

        /* Header Actions and Notification Bell */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-left: auto;
        }

        .notification-bell-container {
          position: relative;
        }

        .notification-bell-btn {
          position: relative;
        }

        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background-color: var(--primary);
          color: white;
          border-radius: 50%;
          font-size: 10px;
          font-weight: 700;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-secondary);
        }

        .notification-dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          width: 320px;
          background: var(--bg-secondary);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-md);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          z-index: 200;
          overflow: hidden;
          animation: dropdownSlide 0.2s ease-out;
        }

        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-header {
          padding: 15px;
          border-bottom: 1px solid var(--card-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dropdown-header h4 {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
        }

        .unread-lbl {
          font-size: 11px;
          background: rgba(244, 63, 94, 0.15);
          color: var(--primary);
          padding: 2px 8px;
          border-radius: 10px;
          font-weight: 700;
        }

        .dropdown-body {
          max-height: 300px;
          overflow-y: auto;
        }

        .empty-notifications {
          padding: 30px;
          text-align: center;
          color: var(--text-secondary);
          font-size: 13.5px;
        }

        .notification-item {
          padding: 15px;
          border-bottom: 1px solid var(--card-border);
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }

        .notification-item:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .notification-item.unread {
          background: rgba(244, 63, 94, 0.03);
        }

        .notification-content-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
        }

        .notification-msg {
          font-size: 13.5px;
          color: var(--text-primary);
          line-height: 1.4;
          margin: 0;
          flex: 1;
        }

        .read-dot {
          width: 8px;
          height: 8px;
          background-color: var(--primary);
          border-radius: 50%;
          margin-top: 5px;
          flex-shrink: 0;
        }

        .notification-time {
          font-size: 11px;
          color: var(--text-secondary);
        }

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
          .mobile-toggle-btn {
            display: inline-flex;
          }

          .dashboard-sidebar {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            transform: translateX(-100%);
            box-shadow: 10px 0 30px rgba(0, 0, 0, 0.5);
          }

          .dashboard-sidebar.mobile-open {
            transform: translateX(0);
          }

          .dashboard-header {
            padding: 0 20px;
          }
          
          .dashboard-content {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
