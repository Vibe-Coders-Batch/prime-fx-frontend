import { apiClient } from '@/lib/api/client';
import { CreatePaymentDto, CreateBulkPaymentDto, PaymentResponse, VerifyPaymentDto, VerifyPaymentResponse } from '../types';

export interface Payment {
  paymentId: string;
  amount: number;
  currency: string;
  status: string;
  gateway: string;
  createdAt: string;
  userId?: string;
  courseId?: string;
  metadata?: Record<string, string>;
}

export interface PaymentsResponse {
  data: Payment[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
  };
}

export const paymentsApi = {
  async create(dto: CreatePaymentDto): Promise<PaymentResponse> {
    try {
      const { data } = await apiClient.post<PaymentResponse>('/payments', dto);
      return data as PaymentResponse;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create payment';
      throw new Error(errorMessage);
    }
  },

  async createBulk(dto: CreateBulkPaymentDto): Promise<PaymentResponse> {
    try {
      const { data } = await apiClient.post<PaymentResponse>('/payments/bulk', dto);
      return data as PaymentResponse;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create bulk payment';
      throw new Error(errorMessage);
    }
  },

  async verify(dto: VerifyPaymentDto): Promise<VerifyPaymentResponse> {
    try {
      const { data } = await apiClient.post<VerifyPaymentResponse>('/payments/verify', dto);
      return data as VerifyPaymentResponse;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to verify payment';
      throw new Error(errorMessage);
    }
  },

  async getAll(filters?: { search?: string; page?: number; limit?: number }): Promise<PaymentsResponse> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.set('search', filters.search);
      if (filters?.page) params.set('page', filters.page.toString());
      if (filters?.limit) params.set('limit', filters.limit.toString());

      const { data } = await apiClient.get<Payment[] | PaymentsResponse>(`/payments?${params.toString()}`);

      if (Array.isArray(data)) {
        return { data };
      }
      return data as PaymentsResponse;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch payments';
      throw new Error(errorMessage);
    }
  },
};

