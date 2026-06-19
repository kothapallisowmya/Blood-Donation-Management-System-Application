const BASE_URL = '/api';

/**
 * Standard fetch helper that handles JSON content-type and parses responses
 */
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Response is not JSON
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  // Authentication Module
  auth: {
    register: (userData) => request('/auth/register', {
      method: 'POST',
      body: userData,
    }),
    login: async (credentials) => {
      const data = await request('/auth/login', {
        method: 'POST',
        body: credentials,
      });
      // Store session data in localStorage
      localStorage.setItem('user', JSON.stringify({
        email: data.email,
        role: data.role,
        userId: data.userId,
        loggedIn: true
      }));
      return data;
    },
    logout: () => {
      localStorage.removeItem('user');
    },
    getCurrentUser: () => {
      try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
      } catch (e) {
        return null;
      }
    }
  },

  // Donor Management Module
  donors: {
    register: (donorProfile) => request('/donors', {
      method: 'POST',
      body: donorProfile,
    }),
    getAll: () => request('/donors', {
      method: 'GET',
    }),
    getById: (id) => request(`/donors/${id}`, {
      method: 'GET',
    }),
    update: (id, donorProfile) => request(`/donors/${id}`, {
      method: 'PUT',
      body: donorProfile,
    }),
    delete: (id) => request(`/donors/${id}`, {
      method: 'DELETE',
    }),
    searchByBloodGroup: (bloodGroup) => request(`/donors/search/blood-group/${bloodGroup}`, {
      method: 'GET',
    }),
    searchByCity: (city) => request(`/donors/search/city/${city}`, {
      method: 'GET',
    }),
    searchAvailable: () => request('/donors/search/available', {
      method: 'GET',
    }),
  },

  // Blood Request Module
  bloodRequests: {
    create: (requestData) => request('/blood-requests', {
      method: 'POST',
      body: requestData,
    }),
    getAll: () => request('/blood-requests', {
      method: 'GET',
    }),
    updateStatus: (id, status) => request(`/blood-requests/${id}/status`, {
      method: 'PUT',
      body: { status },
    }),
  },

  // Admin Dashboard Module
  admin: {
    getStats: () => request('/admin/dashboard', {
      method: 'GET',
    }),
  },

  // Notification Module
  notifications: {
    getUserNotifications: (userId) => request(`/notifications/user/${userId}`, {
      method: 'GET',
    }),
    markAsRead: (id) => request(`/notifications/${id}/read`, {
      method: 'PUT',
    }),
    getUnreadCount: (userId) => request(`/notifications/user/${userId}/unread-count`, {
      method: 'GET',
    }),
  }
};
