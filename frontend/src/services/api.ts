import axios, { AxiosError } from 'axios';
import type { Restaurant, CreateRestaurantDTO, UpdateRestaurantDTO, ApiResponse, ApiError } from '../types/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor to transform data
api.interceptors.response.use(
  (response) => {
    // Return the original response for successful requests
    return {
      ...response,
      data: {
        data: response.data,
        status: response.status,
        message: response.statusText,
      },
    };
  },
  (error: AxiosError<ApiError>) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message,
      status: error.response?.status || 500,
      errors: error.response?.data?.errors,
    };
    return Promise.reject(apiError);
  }
);

export const restaurantsApi = {
  getAll: () => 
    api.get<ApiResponse<Restaurant>>('/restaurants/'),
  
  getById: (id: string) => 
    api.get<ApiResponse<Restaurant>>(`/restaurants/${id}/`),
  
  create: (data: CreateRestaurantDTO) => 
    api.post<ApiResponse<Restaurant>>('/restaurants/', data),
  
  update: (id: string, data: UpdateRestaurantDTO) => 
    api.put<ApiResponse<Restaurant>>(`/restaurants/${id}/`, data),
  
  delete: (id: string) => 
    api.delete<ApiResponse<void>>(`/restaurants/${id}/`),
};
