import { Link } from 'react-router-dom';
import './Header.css';

function Header({ stations, selectedStation, onStationChange, activeRouteType }) {
  const handleStationChange = (e) => {
    const stationId = parseInt(e.target.value);
    const station = stations.find(s => s.id === stationId);
    if (station) {
      onStationChange(station);
    }
  };

  const getRouteTypeColor = (type) => {
    if (type === 'bus') return '#6c757d';
    if (type === 'train') return '#4a90a4';
    if (type === 'rapid') return '#0d6efd';
    return '#7c3aed';
  };

  // Group stations by zone for the dropdown
  const stationsByZone = stations.reduce((acc, station) => {
    const zone = station.zone || 'Other';
    if (!acc[zone]) acc[zone] = [];
    acc[zone].push(station);
    return acc;
  }, {});

  return (
    <div className="Header">
      <div className="HeaderLeft">
        <div>
          <h1 className="HeaderTitle">Live Departures</h1>
          <span style={{ color: '#666666', fontSize: '13px' }}>
            Cascadia Metro Transit
          </span>
        </div>
      </div>
      <div className="HeaderCenter">
        <label style={{ fontSize: '12px', color: '#666666', marginRight: '8px' }}>
          Station:
        </label>
        <select
          value={selectedStation?.id || ''}
          onChange={handleStationChange}
          style={{
            padding: '8px 12px',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid #cccccc',
            borderRadius: '4px',
            backgroundColor: '#ffffff',
            color: '#333333',
            minWidth: '220px',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          {Object.entries(stationsByZone).map(([zone, zoneStations]) => (
            <optgroup key={zone} label={zone}>
              {zoneStations.map(station => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div className="HeaderRight">
        {activeRouteType && activeRouteType !== 'all' && (
          <span style={{
            backgroundColor: getRouteTypeColor(activeRouteType),
            color: 'white',
            padding: '4px 8px',
            borderRadius: '3px',
            fontSize: '11px',
            fontWeight: '600',
            textTransform: 'uppercase',
            marginRight: '12px'
          }}>
            {activeRouteType} only
          </span>
        )}
        <Link 
          to="/settings"
          style={{
            color: '#4a90a4',
            textDecoration: 'none',
            fontSize: '14px'
          }}
        >
          Settings
        </Link>
      </div>
    </div>
  );
}

export default Header;
