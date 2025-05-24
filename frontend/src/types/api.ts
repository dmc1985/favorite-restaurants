export interface Restaurant {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  notes?: string;
  rating: number;
  created_at: string;
}

export type CreateRestaurantDTO = Omit<Restaurant, 'id' | 'created_at'>;
export type UpdateRestaurantDTO = Partial<CreateRestaurantDTO>;

export interface PaginatedResponse<T>{
  results: T[];
  count: number;
  previous: string | null;
  next: string | null;
}

export interface ApiResponse<T> {
  data: PaginatedResponse<T>;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
