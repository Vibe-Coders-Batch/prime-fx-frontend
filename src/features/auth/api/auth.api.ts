import { LoginDto, RegisterDto, LoginResponse, RegisterResponse, ForgotPasswordDto, ResetPasswordDto } from '../types';
import { parseJsonResponse, parseErrorResponse } from '@/lib/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const authApi = {
  async login(dto: LoginDto): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      throw new Error(error.message || error.error || 'Login failed');
    }

    return parseJsonResponse<LoginResponse>(response);
  },

  async register(dto: RegisterDto): Promise<RegisterResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      throw new Error(error.message || error.error || 'Registration failed');
    }

    return parseJsonResponse<RegisterResponse>(response);
  },

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      throw new Error(error.message || error.error || 'Failed to send reset email');
    }

    return parseJsonResponse<{ message: string }>(response);
  },

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      throw new Error(error.message || error.error || 'Password reset failed');
    }

    return parseJsonResponse<{ message: string }>(response);
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      throw new Error(error.message || error.error || 'Email verification failed');
    }

    return parseJsonResponse<{ message: string }>(response);
  },
};

