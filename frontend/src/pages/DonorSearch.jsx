import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  AlertCircle,
  Loader,
  Heart,
  Filter
} from 'lucide-react';

export default function DonorSearch() {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search filter states
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('ALL');
  const [searchCity, setSearchCity] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(true);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.donors.getAll();
      setDonors(data);
      setFilteredDonors(data);
    } catch (err) {
      console.error('Fetch donors error:', err);
      setError('Could not query the donor directory from the database.');
    } finally {
      setLoading(false);
    }
  };

  // Perform client-side filter for real-time reactivity
  useEffect(() => {
    let result = [...donors];

    // Filter by Blood Group
    if (selectedBloodGroup !== 'ALL') {
      result = result.filter(d => d.bloodGroup === selectedBloodGroup);
    }

    // Filter by City
    if (searchCity.trim()) {
      const query = searchCity.toLowerCase().trim();
      result = result.filter(d => d.city && d.city.toLowerCase().includes(query));
    }

    // Filter by Availability
    if (onlyAvailable) {
      result = result.filter(d => d.availableForDonation);
    }

    setFilteredDonors(result);
  }, [selectedBloodGroup, searchCity, onlyAvailable, donors]);

  const formatBloodGroup = (bg) => {
    return bg ? bg.replace('_POSITIVE', '+').replace('_NEGATIVE', '-') : '';
  };

  const getInitials = (name) => {
    if (!name) return 'BD';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <div className="donor-search animate-slide-up">
      <div className="dashboard-title-row">
        <div>
          <h1>Find Blood Donors</h1>
          <p className="text-secondary">Search verified profiles in our global database</p>
        </div>
      </div>

      {error && <div className="alert alert-danger"><AlertCircle size={18} /><span>{error}</span></div>}

      {/* Filter Control Box */}
      <div className="card filter-card">
        <div className="filter-header">
          <Filter size={18} color="var(--primary)" />
          <h3>Search Filters</h3>
        </div>
        
        <div className="filter-grid mt-20">
          <div className="form-group">
            <label className="form-label">Blood Group</label>
            <select
              className="form-control form-select"
              value={selectedBloodGroup}
              onChange={e => setSelectedBloodGroup(e.target.value)}
            >
              <option value="ALL">All Blood Groups</option>
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
            <label className="form-label">City / Town</label>
            <div className="input-with-icon">
              <Search size={18} className="input-icon" />
              <input
                type="text"
                className="form-control"
                placeholder="Search by city name..."
                value={searchCity}
                onChange={e => setSearchCity(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group flex-center-y">
            <label className="switch-container">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={e => setOnlyAvailable(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
              <div>
                <span className="form-label mb-0" style={{ cursor: 'pointer' }}>Show Available Only</span>
                <span className="text-secondary text-xs">Excludes donors recently active or on rest</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="search-results-box mt-30">
        {loading ? (
          <div className="loading-box">
            <Loader size={30} className="spin text-primary" />
            <p>Filtering database profiles...</p>
          </div>
        ) : filteredDonors.length === 0 ? (
          <div className="card empty-search-card">
            <Heart size={40} className="text-muted" />
            <h3>No Donors Found</h3>
            <p className="text-secondary">Try widening your search filters or searching a different city.</p>
          </div>
        ) : (
          <div className="grid-3">
            {filteredDonors.map((donor) => (
              <div key={donor.id} className="card donor-card animate-fade-in">
                <div className="donor-card-header">
                  <div className="donor-avatar">
                    {getInitials(donor.fullName)}
                  </div>
                  <div className="donor-meta">
                    <h4>{donor.fullName}</h4>
                    <span className={`badge ${donor.availableForDonation ? 'badge-success' : 'badge-danger'}`}>
                      {donor.availableForDonation ? 'Available' : 'Resting'}
                    </span>
                  </div>
                  <div className="donor-blood-badge">
                    {formatBloodGroup(donor.bloodGroup)}
                  </div>
                </div>

                <div className="donor-card-body mt-20">
                  <div className="card-info-row">
                    <MapPin size={16} className="info-icon" />
                    <span>{donor.city}, {donor.state}</span>
                  </div>
                  <div className="card-info-row">
                    <Mail size={16} className="info-icon" />
                    <a href={`mailto:${donor.email}`} className="contact-link">{donor.email}</a>
                  </div>
                  <div className="card-info-row">
                    <Phone size={16} className="info-icon" />
                    <a href={`tel:${donor.phoneNumber}`} className="contact-link">{donor.phoneNumber}</a>
                  </div>
                  <div className="card-info-row text-xs mt-10">
                    <Calendar size={14} className="info-icon" />
                    <span className="text-secondary">Last Donated: {donor.lastDonationDate || 'Never'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .donor-search {
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
        .mb-0 { margin-bottom: 0; }
        .text-xs { font-size: 11px; }

        .filter-card {
          text-align: left;
          padding: 24px;
        }

        .filter-header {
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid var(--card-border);
          padding-bottom: 12px;
        }

        .filter-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          align-items: end;
        }
        @media (max-width: 900px) {
          .filter-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
        }

        .flex-center-y {
          display: flex;
          align-items: center;
          min-height: 50px;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
        }
        .input-with-icon .form-control {
          padding-left: 44px;
        }

        /* Results Box */
        .search-results-box {
          text-align: left;
        }

        .loading-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 60px;
          color: var(--text-secondary);
        }

        .empty-search-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-align: center;
          padding: 60px;
          color: var(--text-muted);
          border: 1.5px dashed var(--card-border);
        }

        /* Donor Profile Cards */
        .donor-card {
          padding: 24px;
          text-align: left;
        }

        .donor-card-header {
          display: flex;
          align-items: center;
          gap: 15px;
          position: relative;
          border-bottom: 1px solid var(--card-border);
          padding-bottom: 16px;
        }

        .donor-avatar {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--card-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 16px;
          color: var(--primary);
        }

        .donor-meta {
          flex: 1;
        }
        .donor-meta h4 {
          font-size: 16.5px;
          margin-bottom: 4px;
        }

        .donor-blood-badge {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.1);
          border: 1.5px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 14.5px;
        }

        .card-info-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          font-size: 14px;
          color: var(--text-secondary);
        }
        .card-info-row:last-child {
          margin-bottom: 0;
        }

        .info-icon {
          color: var(--text-muted);
        }

        .contact-link {
          color: var(--text-primary);
          transition: color var(--transition-fast);
        }
        .contact-link:hover {
          color: var(--primary);
        }
      `}</style>
    </div>
  );
}
