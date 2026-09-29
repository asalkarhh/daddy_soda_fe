import axios, { AxiosError } from 'axios';
import { ApiErrorResponse } from '../types/api.types';

export function getApiErrorMessage(error: unknown, fallback = 'An unexpected error occurred. Please try again.'): string {
  if (axios.isAxiosError(error) || (error && typeof error === 'object' && 'response' in error)) {
    const axiosErr = error as AxiosError<ApiErrorResponse>;

    // 1. Response error payload message
    if (axiosErr.response?.data) {
      const data = axiosErr.response.data;

      if (typeof data.message === 'string' && data.message.trim().length > 0) {
        return data.message;
      }

      // Check validation errors dictionary
      if (data.errors) {
        if (typeof data.errors === 'object' && !Array.isArray(data.errors)) {
          const firstKey = Object.keys(data.errors)[0];
          if (firstKey && data.errors[firstKey]) {
            return `${firstKey}: ${data.errors[firstKey]}`;
          }
        } else if (Array.isArray(data.errors) && data.errors.length > 0) {
          return String(data.errors[0]);
        }
      }
    }

    // 2. HTTP Status based descriptions
    if (axiosErr.response?.status === 401) {
      return 'Invalid credentials or session expired. Please log in again.';
    }
    if (axiosErr.response?.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (axiosErr.response?.status === 404) {
      return 'The requested resource was not found.';
    }
    if (axiosErr.response?.status && axiosErr.response.status >= 500) {
      return 'Server error. Please contact technical support if the issue persists.';
    }

    // 3. Network or connection errors
    if (axiosErr.code === 'ERR_NETWORK') {
      return 'Unable to connect to Daddy Soda server. Please ensure backend is running.';
    }

    if (axiosErr.message) {
      return axiosErr.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export const getErrorMessage = getApiErrorMessage;
