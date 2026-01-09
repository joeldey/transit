import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import './RouteCard.css';

function RouteCard({ route }) {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getMinutesUntil = (dateString) => {
    const now = new Date();
    const arrival = new Date(dateString);
    const diffMs = arrival - now;
    const diffMins = Math.round(diffMs / 60000);
    return diffMins;
  };

  const minutesUntil = getMinutesUntil(route.nextArrival);

  const getRouteTypeStyle = () => {
    if (route.routeType === 'bus') {
      return { backgroundColor: '#6c757d', color: 'white' };
    } else if (route.routeType === 'train') {
      return { backgroundColor: '#4a90a4', color: 'white' };
    } else if (route.routeType === 'rapid') {
      return { backgroundColor: '#0d6efd', color: 'white' };
    } else {
      return { backgroundColor: '#7c3aed', color: 'white' };
    }
  };

  return (
    <div className="route-card">
      <div className="route-card-main">
        <div style={{ width: '120px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link 
            to={`/route/${encodeURIComponent(route.routeNumber)}`}
            style={{ textDecoration: 'none' }}
          >
            <span 
              style={{
                ...getRouteTypeStyle(),
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                fontFamily: 'Arial, sans-serif',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {route.routeNumber}
            </span>
          </Link>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <span className="route-destination">{route.destination}</span>
          <div style={{ 
            fontSize: '11px', 
            color: '#888888',
            marginTop: '2px'
          }}>
            {route.direction && <span>{route.direction}</span>}
            {route.platform && (
              <span style={{ marginLeft: route.direction ? '8px' : '0' }}>
                {route.routeType === 'bus' || route.routeType === 'rapid' || route.routeType === 'express' 
                  ? route.platform 
                  : `Platform ${route.platform}`}
              </span>
            )}
          </div>
        </div>

        <div style={{ width: '100px', textAlign: 'right' }}>
          <div className="route-time">{formatTime(route.nextArrival)}</div>
          <div style={{ 
            fontSize: '12px', 
            color: minutesUntil <= 5 ? '#28a745' : '#666666'
          }}>
            {minutesUntil <= 0 ? 'Arriving now' : `in ${minutesUntil} min`}
          </div>
        </div>

        <div style={{ width: '110px', textAlign: 'right' }}>
          <StatusBadge status={route.status} />
          {route.delayMinutes && (
            <div style={{ fontSize: '11px', color: '#dc3545', marginTop: '4px' }}>
              +{route.delayMinutes} min delay
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RouteCard;
