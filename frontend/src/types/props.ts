import type { Restaurant, CreateRestaurantDTO } from './api';

export interface MapProps {
  restaurants: Restaurant[];
  onMarkerClick?: (restaurant: Restaurant) => void;
  initialCenter?: {
    lat: number;
    lng: number;
  };
  initialZoom?: number;
}

export interface RestaurantFormProps {
  onSubmit: (data: CreateRestaurantDTO) => Promise<void>;
  initialData?: Partial<CreateRestaurantDTO>;
  isLoading?: boolean;
  error?: string | null;
}

export interface RestaurantCardProps {
  restaurant: Restaurant;
  onClose: () => void;
}
