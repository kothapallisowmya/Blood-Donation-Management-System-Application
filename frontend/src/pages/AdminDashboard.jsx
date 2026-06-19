import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  Users, 
  Heart, 
  Activity, 
  PlusCircle, 
  Check, 
  X, 
  CheckCircle,
  Loader,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const dashboardStats = await api.admin.getStats();
      setStats(dashboardStats);
      
      const allRequests = await api.bloodRequests.getAll();
      setRequests(allRequests);
    } catch (err) {
      console.error('Admin fetch error:', err);
      setError('Could not connect to the backend server to pull administrative data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    setError('');
    setSuccess('');
    setActionLoadingId(requestId);

    try {
      await api.bloodRequests.updateStatus(requestId, newStatus);
      setSuccess(`Blood request status updated to ${newStatus} successfully!`);
      
      // Refresh requests list and stats
      const allRequests = await api.bloodRequests.getAll();
      setRequests(allRequests);
      const dashboardStats = await api.admin.getStats();
      setStats(dashboardStats);
    } catch (err) {
      setError(err.message || 'Failed to update request status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return <span className="badge badge-warning">Pending</span>;
      case 'APPROVED': return <span className="badge badge-info">Approved</span>;
      case 'FULFILLED': return <span className="badge badge-success">Fulfilled</span>;
      case 'REJECTED': return <span className="badge badge-danger">Rejected</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  const formatBloodGroup = (bg) => {
    return bg ? bg.replace('_POSITIVE', '+').replace('_NEGATIVE', '-') : '';
  };

  if (loading && !stats) {
    return (
      <div className="admin-loading">
        <Loader size={36} className="spin text-primary" />
        <p>Initializing Administrative Dashboard...</p>
      </div>
    );
  }

  // Calculate SVG Chart percentages if stats exist
  const getChartData = () => {
    if (!stats) return { donorPct: 0, pendingPct: 0 };
    const total = stats.totalUsers || 1;
    const donorPct = Math.round((stats.totalDonors / total) * 100);
    const pendingRequests = requests.filter(r => r.status === 'PENDING').length;
    const approvedRequests = requests.filter(r => r.status === 'APPROVED').length;
    const fulfilledRequests = requests.filter(r => r.status === 'FULFILLED').length;
    return {
      donorPct,
      pendingRequests,
      approvedRequests,
      fulfilledRequests
    };
  };

  const chartData = getChartData();

  return (
    <div className="admin-dashboard animate-slide-up">
      <div className="dashboard-title-row">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="text-secondary">System-wide monitoring and blood request management</p>
        </div>
      </div>

      {error && <div className="alert alert-danger"><AlertCircle size={18} /><span>{error}</span></div>}
      {success && <div className="alert alert-success"><CheckCircle size={18} /><span>{success}</span></div>}

      {/* Stats Cards Row */}
      {stats && (
        <div className="grid-4">
          <div className="stat-card card">
            <Users size={28} color="#60a5fa" />
            <span className="stat-num">{stats.totalUsers}</span>
            <span className="stat-label">Total Users Registered</span>
          </div>
          <div className="stat-card card">
            <Heart size={28} color="#f43f5e" fill="rgba(244, 63, 94, 0.1)" />
            <span className="stat-num">{stats.totalDonors}</span>
            <span className="stat-label">Total Donor Profiles</span>
          </div>
          <div className="stat-card card">
            <Activity size={28} color="#fbbf24" />
            <span className="stat-num">{stats.totalRequests}</span>
            <span className="stat-label">Total Blood Requests</span>
          </div>
          <div className="stat-card card highlight">
            <PlusCircle size={28} color="#34d399" />
            <span className="stat-num text-success">{stats.availableDonors}</span>
            <span className="stat-label">Active Available Donors</span>
          </div>
        </div>
      )}

      {/* Analytics Visualization Section */}
      <div className="grid-2 mt-30">
        <div className="card chart-card">
          <h3>User Segments</h3>
          <p className="text-secondary">Percentage of users registered as active donors</p>
          <div className="donut-chart-container mt-20">
            {/* Visual Donut Chart via SVG */}
            <svg viewBox="0 0 100 100" className="donut-svg">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--bg-tertiary)" strokeWidth="8" />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="transparent" 
                stroke="var(--primary)" 
                strokeWidth="8" 
                strokeDasharray={`${2.51 * chartData.donorPct} ${251 - (2.51 * chartData.donorPct)}`}
                strokeDashoffset="62.75"
                strokeLinecap="round"
                className="donut-segment"
              />
              <text x="50" y="52" textAnchor="middle" className="donut-text" fill="#ffffff">
                {chartData.donorPct}%
              </text>
            </svg>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="dot dot-primary"></span>
                <span>Donors ({stats?.totalDonors})</span>
              </div>
              <div className="legend-item">
                <span className="dot dot-muted"></span>
                <span>Recipients / Admins ({stats ? stats.totalUsers - stats.totalDonors : 0})</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card chart-card">
          <h3>Blood Request Funnel</h3>
          <p className="text-secondary">Current status of requested blood units</p>
          
          <div className="bar-chart-container mt-20">
            <div className="bar-item">
              <div className="bar-labels">
                <span>Pending Requests</span>
                <span className="text-warning font-bold">{chartData.pendingRequests}</span>
              </div>
              <div className="bar-track">
                <div 
                  className="bar-fill bg-warning" 
                  style={{ width: `${Math.min(100, (chartData.pendingRequests / (stats?.totalRequests || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bar-item">
              <div className="bar-labels">
                <span>Approved Requests</span>
                <span className="text-info font-bold">{chartData.approvedRequests}</span>
              </div>
              <div className="bar-track">
                <div 
                  className="bar-fill bg-info" 
                  style={{ width: `${Math.min(100, (chartData.approvedRequests / (stats?.totalRequests || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bar-item">
              <div className="bar-labels">
                <span>Fulfilled / Completed</span>
                <span className="text-success font-bold">{chartData.fulfilledRequests}</span>
              </div>
              <div className="bar-track">
                <div 
                  className="bar-fill bg-success" 
                  style={{ width: `${Math.min(100, (chartData.fulfilledRequests / (stats?.totalRequests || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blood Requests Approvals Panel */}
      <div className="requests-section mt-30">
        <div className="card">
          <div className="section-header">
            <h3>Request Approvals & Fulfillment Manager</h3>
            <p className="text-secondary">Review patient requirements and issue approvals</p>
          </div>

          {requests.length === 0 ? (
            <div className="empty-requests mt-20">
              <Activity size={32} color="var(--text-muted)" />
              <p>No active requests to display in system logs.</p>
            </div>
          ) : (
            <div className="table-container mt-20">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Blood Group</th>
                    <th>Units</th>
                    <th>Hospital</th>
                    <th>City</th>
                    <th>Required Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id}>
                      <td style={{ fontWeight: '600' }}>{req.patientName}</td>
                      <td>
                        <span className="badge badge-danger" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
                          {formatBloodGroup(req.bloodGroup)}
                        </span>
                      </td>
                      <td>{req.unitsRequired}</td>
                      <td>{req.hospitalName}</td>
                      <td>{req.city}</td>
                      <td>{req.requiredDate}</td>
                      <td>{getStatusBadge(req.status)}</td>
                      <td>
                        <div className="action-buttons-cell">
                          {req.status === 'PENDING' && (
                            <>
                              <button 
                                onClick={() => handleUpdateStatus(req.id, 'APPROVED')}
                                className="btn btn-success btn-icon-only btn-sm"
                                title="Approve Request"
                                disabled={actionLoadingId === req.id}
                              >
                                {actionLoadingId === req.id ? <Loader size={15} className="spin" /> : <Check size={15} />}
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                                className="btn btn-danger btn-icon-only btn-sm"
                                title="Reject Request"
                                disabled={actionLoadingId === req.id}
                              >
                                {actionLoadingId === req.id ? <Loader size={15} className="spin" /> : <X size={15} />}
                              </button>
                            </>
                          )}
                          {req.status === 'APPROVED' && (
                            <button 
                              onClick={() => handleUpdateStatus(req.id, 'FULFILLED')}
                              className="btn btn-primary btn-sm"
                              disabled={actionLoadingId === req.id}
                            >
                              {actionLoadingId === req.id ? <Loader size={15} className="spin" /> : <CheckCircle size={15} />}
                              <span>Mark Fulfilled</span>
                            </button>
                          )}
                          {req.status === 'FULFILLED' && (
                            <span className="text-muted text-sm">Fulfillment Completed</span>
                          )}
                          {req.status === 'REJECTED' && (
                            <span className="text-muted text-sm">Cancelled</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .admin-dashboard {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .dashboard-title-row {
          margin-bottom: 5px;
          text-align: left;
        }

        .mt-20 { margin-top: 20px; }
        .mt-30 { margin-top: 30px; }

        .admin-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 15px;
          min-height: 400px;
          color: var(--text-secondary);
        }

        /* SVG Donut Chart */
        .chart-card {
          text-align: left;
        }
        
        .donut-chart-container {
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 20px;
          padding: 10px 0;
        }

        .donut-svg {
          width: 150px;
          height: 150px;
        }

        .donut-segment {
          transition: stroke-dasharray 0.5s ease;
        }

        .donut-text {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 18px;
        }

        .chart-legend {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
        }
        .dot-primary { background-color: var(--primary); }
        .dot-muted { background-color: var(--bg-tertiary); }

        /* Bar Chart Styles */
        .bar-chart-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 10px 0;
        }
        
        .bar-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .bar-labels {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }

        .bar-track {
          width: 100%;
          height: 10px;
          background-color: var(--bg-tertiary);
          border-radius: var(--radius-full);
          overflow: hidden;
          border: 1px solid var(--card-border);
        }

        .bar-fill {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .bg-warning { background-color: var(--warning); }
        .bg-info { background-color: var(--info); }
        .bg-success { background-color: var(--success); }
        .font-bold { font-weight: 700; }
        .text-warning { color: #f59e0b; }
        .text-info { color: #3b82f6; }
        .text-success { color: #10b981; }
        .text-muted { color: var(--text-muted); }
        .text-sm { font-size: 12.5px; }

        /* Approvals table and cells */
        .requests-section {
          text-align: left;
        }

        .empty-requests {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 50px;
          color: var(--text-muted);
          border: 1.5px dashed var(--card-border);
          border-radius: var(--radius-md);
        }

        .action-buttons-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .btn-sm {
          padding: 6px 12px;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}
