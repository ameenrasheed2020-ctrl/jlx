const defaultApiUrl = import.meta.env.DEV ? "http://localhost:6500" : "";

export const API_BASE_URL = import.meta.env.VITE_API_URL || defaultApiUrl;

export const apiUrl = (path) => `${API_BASE_URL}${path}`;
