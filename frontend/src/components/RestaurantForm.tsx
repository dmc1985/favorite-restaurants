import { useState, useEffect } from 'react';
import { mapsLoader } from '../config/maps';
import type { RestaurantFormProps } from '../types/props';
import type { CreateRestaurantDTO } from '../types/api';
import Select from 'react-select';

export function RestaurantForm({ onSubmit, initialData, isLoading, error }: RestaurantFormProps) {
  const [formData, setFormData] = useState<CreateRestaurantDTO>({
    name: initialData?.name || '',
    address: initialData?.address || '',
    latitude: initialData?.latitude || 0,
    longitude: initialData?.longitude || 0,
    notes: initialData?.notes || '',
    rating: initialData?.rating || 5,
  });

  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>();

  useEffect(() => {
    mapsLoader.importLibrary('places').then(() => {
      const autocompleteService = new google.maps.places.AutocompleteService();

      autocompleteService.getPlacePredictions(
        {
          input: inputValue,
          types: ['restaurant', 'food', 'cafe', 'bar'],
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            setPredictions(results);
          } else {
            setPredictions([]);
          }
        }
      );
    });
  }, [inputValue]);

  useEffect(() => {
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    if (!selectedPlaceId) return;

    service.getDetails(
      { placeId: selectedPlaceId, fields: ['name', 'formatted_address', 'geometry', 'rating'] },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          setFormData({
            name: place.name || '',
            address: place.formatted_address || '',
            latitude: place.geometry?.location?.lat() || 0,
            longitude: place.geometry?.location?.lng() || 0,
            notes: formData.notes,
            rating: formData.rating,
          });
        } else {
          console.error('Place details lookup failed due to:', status);
        }
      }
    );
  }, [selectedPlaceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <label htmlFor="restaurant-select" className="block text-sm font-medium text-gray-700">
          Search for a restaurant
        </label>
        <div className="relative mt-1">
          <Select
            inputValue={inputValue}
            onInputChange={value => setInputValue(value)}
            onChange={option => {
              setSelectedPlaceId(option?.value);
            }}
            options={predictions.map(prediction => ({
              value: prediction.place_id,
              label: prediction.description,
            }))}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Restaurant Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
          Rating (1-10)
        </label>
        <input
          type="number"
          id="rating"
          min="1"
          max="10"
          value={formData.rating}
          onChange={e => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${
              isLoading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
        >
          {isLoading ? 'Saving...' : 'Save Restaurant'}
        </button>
      </div>
    </form>
  );
}
