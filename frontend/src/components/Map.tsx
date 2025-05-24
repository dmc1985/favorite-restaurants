import { useEffect, useRef, useState } from 'react';
import { mapsLoader } from '../config/maps';
import type { MapProps } from '../types/props';
import type { MapConfig, MarkerConfig } from '../types/google-maps';



export function Map({ restaurants, onMarkerClick, initialCenter, initialZoom }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  const defaultCenter = { lat: 48.8566, lng: 2.3522 }; // Paris, France
  const defaultZoom = 4; 

  useEffect(() => {
    mapsLoader.load().then(() => {
      if (mapRef.current) {
        const mapConfig: MapConfig = {
          center: initialCenter || defaultCenter,
          zoom: initialZoom || defaultZoom,
        };
        const newMap = new google.maps.Map(mapRef.current, mapConfig);
        setMap(newMap);
      }
    });
  }, []);

  useEffect(() => {
    debugger;
    if (map) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));

      // Create new markers
      const newMarkers = (restaurants || []).map(restaurant => {
        const markerConfig: MarkerConfig = {
          position: { lat: restaurant.latitude, lng: restaurant.longitude },
          map,
          title: restaurant.name,
        };
        const marker = new google.maps.Marker(markerConfig);

        if (onMarkerClick) {
          marker.addListener('click', () => onMarkerClick(restaurant));
        }

        return marker;
      });

      setMarkers(newMarkers);

      // Adjust map bounds to show all markers
      if (newMarkers.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        newMarkers.forEach(marker => bounds.extend(marker.getPosition()!));
        map.fitBounds(bounds);
      }
    }
  }, [map, restaurants, onMarkerClick]);

  return (
    <div ref={mapRef} className="w-full h-full min-h-[400px] rounded-lg shadow-lg" />
  );
}
