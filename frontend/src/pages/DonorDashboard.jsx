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
  Edit2,
  Lock
} from 'lucide-react';

export default function DonorDashboard({ user }) {
  const [donorProfile, setDonorProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  
  // Profile Form state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    bloodGroup: 'O_POSITIVE',
    age: '',
    gender: 'Male',
    weight: '',
    city: '',
    state: '',
    lastDonationDate: '',
    availableForDonation: true
  });
  
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
    fetchData();
  }, [user.email]);

  const fetchData = async () => {
    setLoadingProfile(true);
    setLoadingRequests(true);
    setError('');

    try {
      // 1. Fetch all donors and find profile by user email
      const allDonors = await api.donors.getAll();
      const myProfile = allDonors.find(d => d.email === user.email);
      
      if (myProfile) {
        setDonorProfile(myProfile);
        setProfileForm({
          bloodGroup: myProfile.bloodGroup,
          age: myProfile.age,
          gender: myProfile.gender,
          weight: myProfile.weight,
          city: myProfile.city,
          state: myProfile.state,
          lastDonationDate: myProfile.lastDonationDate || '',
          availableForDonation: myProfile.availableForDonation
        });
      } else {
        setDonorProfile(null);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Could not connect to the server to fetch your profile.');
    } finally {
      setLoadingProfile(false);
    }

    try {
      // 2. Fetch all blood requests
      const allRequests = await api.bloodRequests.getAll();
      setRequests(allRequests);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoadingProfile(true);

    const payload = {
      userId: user.userId,
      bloodGroup: profileForm.bloodGroup,
      age: parseInt(profileForm.age),
      gender: profileForm.gender,
      weight: parseFloat(profileForm.weight),
      city: profileForm.city,
      state: profileForm.state,
      lastDonationDate: profileForm.lastDonationDate || null,
      availableForDonation: profileForm.availableForDonation
    };

    try {
      if (donorProfile) {
        // Update profile
        const updated = await api.donors.update(donorProfile.id, payload);
        setDonorProfile(updated);
        setSuccess('Profile updated successfully!');
      } else {
        // Create profile
        const created = await api.donors.register(payload);
        setDonorProfile(created);
        setSuccess('Donor profile created successfully!');
      }
      setEditingProfile(false);
    } catch (err) {
      setError(err.message || 'Failed to save profile details.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const toggleAvailability = async () => {
    if (!donorProfile) return;
    setError('');

    const newAvailability = !donorProfile.availableForDonation;
    const payload = {
      userId: user.userId,
      bloodGroup: donorProfile.bloodGroup,
      age: donorProfile.age,
      gender: donorProfile.gender,
      weight: donorProfile.weight,
      city: donorProfile.city,
      state: donorProfile.state,
      lastDonationDate: donorProfile.lastDonationDate,
      availableForDonation: newAvailability
    };

    try {
      const updated = await api.donors.update(donorProfile.id, payload);
      setDonorProfile(updated);
      setProfileForm(prev => ({ ...prev, availableForDonation: newAvailability }));
    } catch (err) {
      setError('Failed to update availability status.');
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
      setSuccess('Blood request submitted successfully!');
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
      const allRequests = await api.bloodRequests.getAll();
      setRequests(allRequests);
    } catch (err) {
      setError(err.message || 'Failed to submit blood request.');
    } finally {
      setSubmittingRequest(false);
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

  return (
    <div className="donor-dashboard animate-slide-up">
      <div className="dashboard-title-row">
        <div>
          <h1>Donor Portal</h1>
          <p className="text-secondary">Manage your donor health record and requests</p>
        </div>
      </div>

      {error && <div className="alert alert-danger"><AlertCircle size={18} /><span>{error}</span></div>}
      {success && <div className="alert alert-success"><CheckCircle size={18} /><span>{success}</span></div>}

      <div className="grid-2">
        {/* Left Column: Profile Card */}
        <div className="card-column">
          {loadingProfile ? (
            <div className="card loading-card">
              <Loader size={30} className="spin text-primary" />
              <p>Loading your profile...</p>
            </div>
          ) : !donorProfile && !editingProfile ? (
            <div className="card setup-profile-card">
              <Heart size={48} className="text-primary pulse" />
              <h3>Register as a Blood Donor</h3>
              <p>You have not completed your donor health profile yet. Complete it now to appear in local search results and start saving lives.</p>
              <button onClick={() => setEditingProfile(true)} className="btn btn-primary">
                Complete Donor Profile
              </button>
            </div>
          ) : editingProfile ? (
            <div className="card">
              <h3>{donorProfile ? 'Edit Donor Profile' : 'Register as Donor'}</h3>
              <form onSubmit={handleProfileSubmit} className="profile-form mt-20">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <select 
                      className="form-control form-select"
                      value={profileForm.bloodGroup}
                      onChange={e => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
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
                    <label className="form-label">Age</label>
                    <input 
                      type="number" 
                      min="18" 
                      max="100" 
                      required
                      placeholder="e.g. 25"
                      className="form-control"
                      value={profileForm.age}
                      onChange={e => setProfileForm({ ...profileForm, age: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select 
                      className="form-control form-select"
                      value={profileForm.gender}
                      onChange={e => setProfileForm({ ...profileForm, gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Weight (kg)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      min="45" 
                      required
                      placeholder="e.g. 70"
                      className="form-control"
                      value={profileForm.weight}
                      onChange={e => setProfileForm({ ...profileForm, weight: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Boston"
                      className="form-control"
                      value={profileForm.city}
                      onChange={e => setProfileForm({ ...profileForm, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. MA"
                      className="form-control"
                      value={profileForm.state}
                      onChange={e => setProfileForm({ ...profileForm, state: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Last Donation Date (Optional)</label>
                  <input 
                    type="date" 
                    className="form-control"
                    value={profileForm.lastDonationDate}
                    onChange={e => setProfileForm({ ...profileForm, lastDonationDate: e.target.value })}
                  />
                </div>

                <div className="form-actions mt-20">
                  <button type="submit" className="btn btn-primary">Save Profile</button>
                  <button type="button" onClick={() => setEditingProfile(false)} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="card profile-display-card">
              <div className="profile-display-header">
                <div className="profile-badge-circle">
                  <span>{formatBloodGroup(donorProfile.bloodGroup)}</span>
                </div>
                <div className="profile-header-meta">
                  <h3>{donorProfile.fullName}</h3>
                  <span className="text-secondary">{donorProfile.email}</span>
                </div>
                <button className="btn btn-secondary btn-icon-only edit-btn" onClick={() => setEditingProfile(true)}>
                  <Edit2 size={16} />
                </button>
              </div>

              <div className="availability-panel">
                <div className="availability-desc">
                  <h4>Available for Donation</h4>
                  <p className="text-secondary">Toggle off if you are temporarily ineligible or unavailable</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={donorProfile.availableForDonation} 
                    onChange={toggleAvailability}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="profile-details-list">
                <div className="detail-item">
                  <span className="detail-label">Age</span>
                  <span className="detail-val">{donorProfile.age} yrs</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Gender</span>
                  <span className="detail-val">{donorProfile.gender}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Weight</span>
                  <span className="detail-val">{donorProfile.weight} kg</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location</span>
                  <span className="detail-val"><MapPin size={14} /> {donorProfile.city}, {donorProfile.state}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Donation</span>
                  <span className="detail-val">
                    <Calendar size={14} /> {donorProfile.lastDonationDate ? donorProfile.lastDonationDate : 'Never'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Submit Blood Request Form */}
        <div className="card-column">
          <div className="card">
            <h3>Request Urgent Blood</h3>
            <p className="text-secondary mt-5">Create a community blood request for emergency hospital patients</p>

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

      {/* Full-width Section: Public Active Requests */}
      <div className="requests-section mt-30">
        <div className="card">
          <div className="section-header">
            <h3>Active Blood Requests</h3>
            <p className="text-secondary">List of emergency blood requirements across cities</p>
          </div>
          
          {loadingRequests ? (
            <div className="loading-container mt-20">
              <Loader size={24} className="spin text-primary" />
              <p>Fetching active requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="empty-requests-box mt-20">
              <Activity size={32} color="var(--text-muted)" />
              <p>No active blood requests found in the system.</p>
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
        .donor-dashboard {
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

        .loading-card, .setup-profile-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px 30px;
          gap: 15px;
          min-height: 380px;
        }

        .setup-profile-card p {
          color: var(--text-secondary);
          max-width: 320px;
          margin-bottom: 10px;
        }

        /* Profile Display Card Styles */
        .profile-display-card {
          text-align: left;
        }

        .profile-display-header {
          display: flex;
          align-items: center;
          gap: 20px;
          border-bottom: 1px solid var(--card-border);
          padding-bottom: 20px;
          position: relative;
        }

        .profile-badge-circle {
          width: 65px;
          height: 65px;
          background: radial-gradient(circle, #f43f5e 0%, #be123c 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 20px;
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(244, 63, 94, 0.4);
        }

        .profile-header-meta {
          flex: 1;
        }

        .profile-header-meta h3 {
          font-size: 20px;
        }

        .edit-btn {
          position: absolute;
          top: 0;
          right: 0;
        }

        /* Availability Panel */
        .availability-panel {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0;
          border-bottom: 1px solid var(--card-border);
        }
        .availability-desc h4 {
          font-size: 15px;
          margin-bottom: 3px;
        }
        .availability-desc p {
          font-size: 12.5px;
        }

        /* Details list */
        .profile-details-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-top: 20px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          font-size: 14.5px;
        }
        .detail-label {
          color: var(--text-secondary);
        }
        .detail-val {
          font-weight: 600;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Requests table */
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

        .form-actions {
          display: flex;
          gap: 12px;
        }
      `}</style>
    </div>
  );
}
