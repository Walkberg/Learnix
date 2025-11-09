import { redirect } from 'react-router-dom';

/**
 * Check if the user is authenticated
 * This is a simple check - replace with your actual auth logic
 */
export function isAuthenticated(): boolean {
  // Check for token in localStorage

  const token = localStorage.getItem('token');

  // TODO: Add token validation, expiry check, etc.
  return !!token;
}

/**
 * Loader guard for protected routes
 * Redirects to login if user is not authenticated
 */
export function requireAuth() {
  if (!isAuthenticated()) {
    // Return a redirect response - this will happen before the route renders
    return redirect('/login');
  }

  // User is authenticated, allow access
  return null;
}

/**
 * Loader guard for public-only routes (login, register)
 * Redirects to home if user is already authenticated
 */
export function requireGuest() {
  if (isAuthenticated()) {
    // User is already logged in, redirect to home
    return redirect('/');
  }

  // User is not authenticated, allow access to login/register
  return null;
}

/**
 * Get current user from localStorage
 * This is a simple implementation - replace with your actual user fetch logic
 */
export function getCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  // TODO: Decode token or fetch user from API
  // For now, return a mock user
  try {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  } catch {
    return null;
  }
}
