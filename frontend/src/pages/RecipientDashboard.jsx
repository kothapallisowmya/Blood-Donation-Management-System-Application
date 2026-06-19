import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  Activity, 
  AlertCircle,
  Plus,
  Loader,
  FileText,
  UserCheck,
  Clock
} from 'lucide-react';

export default function RecipientDashboard({ user }) {
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  
  // Request Form state
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestForm, setRequestForm] = useState({
    patientName: '',
    bloodGroup: 'A_POSITIVE',
    unitsRequired: 1,
    hospitalName: '',
    city: '',
    requiredDate: '',
    contactNumber: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [user.userId]);

  const fetchRequests = async () => {
    setLoadingRequests(true);
    setError('');
    try {
      const allRequests = await api.bloodRequests.getAll();
      setRequests(allRequests || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Could not connect to the server to fetch blood requests.');
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmittingRequest(true);

    try {
      const payload = {
        ...requestForm,
        userId: user.userId
      };
      await api.bloodRequests.create(payload);
      setSuccess('Blood request submitted successfully! It is now pending administrator approval.');
      setRequestForm({
        patientName: '',
        bloodGroup: 'A_POSITIVE',
        unitsRequired: 1,
        hospitalName: '',
        city: '',
        requiredDate: '',
        contactNumber: ''
      });
      // Refresh requests list
      fetchRequests();
    } catch (err) {
      setError(err.message || 'Failed to submit blood request.');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return <span className="badge badge-warning">Pending Approval</span>;
      case 'APPROVED': return <span className="badge badge-info">Approved</span>;
      case 'FULFILLED': return <span className="badge badge-success">Fulfilled</span>;
      case 'REJECTED': return <span className="badge badge-danger">Rejected</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  const formatBloodGroup = (bg) => {
    return bg ? bg.replace('_POSITIVE', '+').replace('_NEGATIVE', '-') : '';
  };

  // Filter requests
  const myRequests = requests.filter(req => req.userId === user.userId);
  const communityRequests = requests.filter(req => req.userId !== user.userId);

  return (
    <div className="recipient-dashboard animate-slide-up">
      <div className="dashboard-title-row">
        <div>
          <h1>Patient Portal</h1>
          <p className="text-secondary">Request emergency blood and track your status updates</p>
        </div>
      </div>

      {error && <div className="alert alert-danger"><AlertCircle size={18} /><span>{error}</span></div>}
      {success && <div className="alert alert-success"><CheckCircle size={18} /><span>{success}</span></div>}

      <div className="grid-2">
        {/* Left Column: Help / Guide Cards */}
        <div className="card-column">
          <div className="card guide-card">
            <Heart size={36} className="text-primary pulse" fill="#f43f5e" color="#f43f5e" />
            <h3>Requesting Blood: How it works</h3>
            
            <div className="step-list mt-20">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-desc">
                  <h4>Submit Urgent Request</h4>
                  <p className="text-secondary">Fill in patient details, hospital branch, blood group, and required units.</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-desc">
                  <h4>Admin Verification</h4>
                  <p className="text-secondary">System administrators will verify the hospital request detail and approve it.</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-desc">
                  <h4>Published for Donors</h4>
                  <p className="text-secondary">Once approved, it becomes active. Eligible donors in your city will see the request and get in touch.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card stat-card mt-20">
            <h3>Your Request Summary</h3>
            <div className="stats-row mt-20">
              <div className="stat-box">
                <span className="stat-lbl">Total Submitted</span>
                <span className="stat-val">{myRequests.length}</span>
              </div>
              <div className="stat-box">
                <span className="stat-lbl">Pending</span>
                <span className="stat-val text-warning">
                  {myRequests.filter(r => r.status === 'PENDING').length}
                </span>
              </div>
              <div className="stat-box">
                <span className="stat-lbl">Approved</span>
                <span className="stat-val text-info">
                  {myRequests.filter(r => r.status === 'APPROVED').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Request Blood Form */}
        <div className="card-column">
          <div className="card">
            <h3>Request Urgent Blood</h3>
            <p className="text-secondary mt-5">Submit a verified medical blood requirement request</p>

            <form onSubmit={handleRequestSubmit} className="request-form mt-20">
              <div className="form-group">
                <label className="form-label">Patient Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Jane Smith"
                  className="form-control"
                  value={requestForm.patientName}
                  onChange={e => setRequestForm({ ...requestForm, patientName: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Blood Group Required</label>
                  <select 
                    className="form-control form-select"
                    value={requestForm.bloodGroup}
                    onChange={e => setRequestForm({ ...requestForm, bloodGroup: e.target.value })}
                  >
                    <option value="A_POSITIVE">A+</option>
                    <option value="A_NEGATIVE">A-</option>
                    <option value="B_POSITIVE">B+</option>
                    <option value="B_NEGATIVE">B-</option>
                    <option value="AB_POSITIVE">AB+</option>
                    <option value="AB_NEGATIVE">AB-</option>
                    <option value="O_POSITIVE">O+</option>
                    <option value="O_NEGATIVE">O-</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Units Required (Bags)</label>
                  <input 
                    type="number" 
                    min="1" 
                    required
                    className="form-control"
                    value={requestForm.unitsRequired}
                    onChange={e => setRequestForm({ ...requestForm, unitsRequired: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Hospital Name & Branch</label>
                <input 
                  type="text" 
                  required
                  placeholder="City Central Hospital"
                  className="form-control"
                  value={requestForm.hospitalName}
                  onChange={e => setRequestForm({ ...requestForm, hospitalName: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Boston"
                    className="form-control"
                    value={requestForm.city}
                    onChange={e => setRequestForm({ ...requestForm, city: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Required By Date</label>
                  <input 
                    type="date" 
                    required
                    className="form-control"
                    value={requestForm.requiredDate}
                    onChange={e => setRequestForm({ ...requestForm, requiredDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input 
                  type="tel" 
                  required
                  placeholder="8888888888"
                  className="form-control"
                  value={requestForm.contactNumber}
                  onChange={e => setRequestForm({ ...requestForm, contactNumber: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={submittingRequest}>
                {submittingRequest ? <Loader size={18} className="spin" /> : <Plus size={18} />} Submit Request
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Section 1: My Requests */}
      <div className="requests-section mt-30">
        <div className="card">
          <div className="section-header">
            <h3>My Submitted Blood Requests</h3>
            <p className="text-secondary">Track the real-time status of your emergency requests</p>
          </div>
          
          {loadingRequests ? (
            <div className="loading-container mt-20">
              <Loader size={24} className="spin text-primary" />
              <p>Fetching requests...</p>
            </div>
          ) : myRequests.length === 0 ? (
            <div className="empty-requests-box mt-20">
              <FileText size={32} color="var(--text-muted)" />
              <p>You haven't submitted any blood requests yet.</p>
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
                    <th>Contact</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myRequests.map((req) => (
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
                      <td>{req.contactNumber}</td>
                      <td>{getStatusBadge(req.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Other Community Requests */}
      <div className="requests-section mt-30">
        <div className="card">
          <div className="section-header">
            <h3>Community Active Requests</h3>
            <p className="text-secondary">Other emergency blood requests in the system</p>
          </div>
          
          {loadingRequests ? (
            <div className="loading-container mt-20">
              <Loader size={24} className="spin text-primary" />
              <p>Fetching active requests...</p>
            </div>
          ) : communityRequests.length === 0 ? (
            <div className="empty-requests-box mt-20">
              <Activity size={32} color="var(--text-muted)" />
              <p>No other active blood requests found in the system.</p>
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
                    <th>Contact</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {communityRequests.map((req) => (
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
                      <td>{req.contactNumber}</td>
                      <td>{getStatusBadge(req.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .recipient-dashboard {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .dashboard-title-row {
          margin-bottom: 5px;
          text-align: left;
        }

        .mt-5 { margin-top: 5px; }
        .mt-20 { margin-top: 20px; }
        .mt-30 { margin-top: 30px; }

        .card-column {
          display: flex;
          flex-direction: column;
        }

        .guide-card {
          text-align: left;
          padding: 30px;
        }

        .step-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .step-item {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .step-number {
          background: rgba(244, 63, 94, 0.15);
          color: var(--primary);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
          font-size: 14px;
        }

        .step-desc {
          flex: 1;
        }

        .step-desc h4 {
          font-size: 15px;
          margin-bottom: 4px;
          color: #ffffff;
        }

        .step-desc p {
          font-size: 13px;
          line-height: 1.4;
        }

        .stat-card {
          text-align: left;
        }

        .stats-row {
          display: flex;
          gap: 15px;
        }

        .stat-box {
          flex: 1;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-md);
          padding: 15px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .stat-lbl {
          font-size: 12px;
          color: var(--text-secondary);
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .stat-val {
          font-size: 24px;
          font-weight: 700;
        }

        .requests-section {
          text-align: left;
        }
        
        .empty-requests-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 40px;
          border: 1.5px dashed var(--card-border);
          border-radius: var(--radius-md);
          color: var(--text-muted);
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 40px;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
