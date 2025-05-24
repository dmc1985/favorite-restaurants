declare global {
  interface Window {
    google: typeof google;
  }
}

export interface GoogleMapPlace extends google.maps.places.PlaceResult {
  formatted_address?: string;
  geometry?: {
    location: google.maps.LatLng;
  };
}

export interface MapConfig {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

export interface MarkerConfig {
  position: {
    lat: number;
    lng: number;
  };
  map: google.maps.Map;
  title: string;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}
