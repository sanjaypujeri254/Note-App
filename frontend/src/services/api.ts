import axios from 'axios';
import { SignupData, SigninData, Note } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't automatically redirect on 401 errors
    // Let components handle authentication errors individually
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  sendSignupOTP: (data: { email: string; fullName: string; dateOfBirth: string }) =>
    api.post('/auth/signup/send-otp', data),
  
  verifySignupOTP: (data: SignupData) =>
    api.post('/auth/signup/verify-otp', data),
  
  sendSigninOTP: (data: { email: string }) =>
    api.post('/auth/signin/send-otp', data),
  
  verifySigninOTP: (data: SigninData) =>
    api.post('/auth/signin/verify-otp', data),
  
  logout: () =>
    api.post('/auth/logout'),
  
  getProfile: () =>
    api.get('/auth/profile'),
};

// Notes API
export const notesAPI = {
  getNotes: () =>
    api.get('/notes'),
  
  createNote: (data: { title: string; content: string }) =>
    api.post('/notes', data),
  
  updateNote: (id: string, data: { title: string; content: string }) =>
    api.put(`/notes/${id}`, data),
  
  deleteNote: (id: string) =>
    api.delete(`/notes/${id}`),
};

export default api;
