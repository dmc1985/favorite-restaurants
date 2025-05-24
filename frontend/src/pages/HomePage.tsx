import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Map } from '../components/Map';
import { restaurantsApi } from '../services/api';
import type { Restaurant } from '../types/api';
import { PlusIcon } from '@heroicons/react/24/solid';

export function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await restaurantsApi.getAll();
        if (response.data.data.results) {
          setRestaurants(response.data.data.results);
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Favorite Restaurants</h1>
          <Link
            to="/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Restaurant
          </Link>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-[calc(100vh-12rem)]">
            <Map 
              restaurants={restaurants}
              onMarkerClick={setSelectedRestaurant}
              initialCenter={{ lat: 48.8566, lng: 2.3522 }} // Paris, France
              initialZoom={13}
            />
            
            {selectedRestaurant && (
              <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold">{selectedRestaurant.name}</h2>
                <p className="text-gray-600 text-sm mt-1">{selectedRestaurant.address}</p>
                {selectedRestaurant.notes && (
                  <p className="text-gray-600 mt-2">{selectedRestaurant.notes}</p>
                )}
                <div className="mt-2 flex items-center">
                  <span className="text-yellow-500 font-semibold">
                    Rating: {selectedRestaurant.rating}/10
                  </span>
                </div>
                <button
                  onClick={() => setSelectedRestaurant(null)}
                  className="mt-3 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
