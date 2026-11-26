const API_BASE_URL = 'http://127.0.0.1:8000/api';

const getAccessToken = () => {
  return sessionStorage.getItem('access_token');
};

export const adminRequest = async (endpoint, options = {}) => {
  const token = getAccessToken();

  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (!(options.body instanceof FormData) && options.body) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    window.location.href = '/admin/login';
    throw new Error('Your session has expired. Please sign in again.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail ||
      errorData.message ||
      'The request could not be completed.'
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export default adminRequest;