export const API_CONFIG = {
  baseUrl: 'http://localhost:5500/api',
};

export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.baseUrl}${endpoint}`;
}; 