import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AddRestaurantPage } from './pages/AddRestaurantPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddRestaurantPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
