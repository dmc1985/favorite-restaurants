import { useNavigate } from 'react-router-dom';
import { RestaurantForm } from '../components/RestaurantForm';
import { restaurantsApi, type Restaurant } from '../services/api';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export function AddRestaurantPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: Omit<Restaurant, 'id' | 'created_at'>) => {
    try {
      await restaurantsApi.create(data);
      navigate('/');
    } catch (error) {
      console.error('Error creating restaurant:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Add New Restaurant</h1>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RestaurantForm onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  );
}
