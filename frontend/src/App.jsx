import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DeparturesPage from './pages/DeparturesPage';
import RouteDetailPage from './pages/RouteDetailPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DeparturesPage />} />
        <Route path="/route/:routeNumber" element={<RouteDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
