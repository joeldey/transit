import RouteCard from './RouteCard';
import './RouteList.css';

function RouteList({ routes, loading }) {
  if (loading) {
    return (
      <div className="route-list-container">
        <div style={{ textAlign: 'center', padding: '40px', color: '#666666' }}>
          Loading routes...
        </div>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="route-list-container">
        <div style={{ textAlign: 'center', padding: '40px', color: '#666666' }}>
          No routes found matching your filters.
        </div>
      </div>
    );
  }

  return (
    <div className="route-list-container">
      <div style={{ 
        display: 'flex', 
        padding: '10px 16px', 
        backgroundColor: '#f9f9f9',
        borderBottom: '1px solid #dddddd',
        fontSize: '12px',
        color: '#666666',
        fontWeight: '600',
        textTransform: 'uppercase'
      }}>
        <span style={{ width: '120px' }}>Route</span>
        <span style={{ flex: 1 }}>Destination</span>
        <span style={{ width: '100px', textAlign: 'right' }}>Departure</span>
        <span style={{ width: '110px', textAlign: 'right' }}>Status</span>
      </div>
      
      {routes.map((route) => (
        <RouteCard key={route.id} route={route} />
      ))}
    </div>
  );
}

export default RouteList;
