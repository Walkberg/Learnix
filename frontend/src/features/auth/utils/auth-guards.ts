import { getAuthToken } from '@/app/api';
import { redirect } from 'react-router-dom';

export function isAuthenticated(): boolean {
  const token = getAuthToken();

  return !!token;
}

export function requireAuth() {
  if (!isAuthenticated()) {
    return redirect('/login');
  }

  return null;
}

export function requireGuest() {
  if (isAuthenticated()) {
    return redirect('/');
  }

  return null;
}

export function getCurrentUser() {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  } catch {
    return null;
  }
}
