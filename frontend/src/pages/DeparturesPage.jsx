import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import FilterControls from '../components/FilterControls';
import RouteList from '../components/RouteList';

function DeparturesPage() {
  const [searchParams] = useSearchParams();
  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all'
  });

  // Fetch stations on mount
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch('/api/stations');
        const data = await response.json();
        setStations(data);
        
        // Check for stationId in URL params
        const stationIdParam = searchParams.get('stationId');
        if (stationIdParam) {
          const station = data.find(s => s.id === parseInt(stationIdParam));
          if (station) {
            setSelectedStation(station);
            return;
          }
        }
        
        // Default to Central Station
        const centralStation = data.find(s => s.code === 'CTR');
        if (centralStation) {
          setSelectedStation(centralStation);
        } else if (data.length > 0) {
          setSelectedStation(data[0]);
        }
      } catch (error) {
        console.error('Error fetching stations:', error);
      }
    };
    fetchStations();
  }, [searchParams]);

  const fetchRoutes = async () => {
    if (!selectedStation) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('stationId', selectedStation.id);
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.status !== 'all') params.append('status', filters.status);
      
      const response = await fetch(`/api/routes?${params}`);
      const data = await response.json();
      setRoutes(data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [filters, selectedStation]);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header 
        stations={stations}
        selectedStation={selectedStation}
        onStationChange={setSelectedStation}
        activeRouteType={filters.type}
      />
      
      <div style={{ marginTop: '8px' }}>
        <FilterControls 
          filters={filters} 
          onFilterChange={setFilters} 
        />
      </div>
      
      <RouteList routes={routes} loading={loading} />
      
      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        textAlign: 'center',
        fontSize: '12px',
        color: '#999999',
        fontFamily: 'Arial, sans-serif'
      }}>
        Last updated: {new Date().toLocaleTimeString()}
        {' • '}
        <span 
          style={{ 
            color: '#4a90a4', 
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
          onClick={() => fetchRoutes()}
        >
          Refresh
        </span>
      </div>
    </div>
  );
}

export default DeparturesPage;

