import { Loader } from '@googlemaps/js-api-loader';

export const mapsLoader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  version: 'beta',
  libraries: ['places', 'core'],
});

export const initializeMap = (element: HTMLElement) => {
  return new google.maps.Map(element, {
    center: { lat: 48.8566, lng: 2.3522 }, // Paris
    zoom: 13,
  });
};
