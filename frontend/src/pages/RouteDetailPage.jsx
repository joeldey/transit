import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './RouteDetailPage.css';

function RouteDetailPage() {
  const { routeNumber } = useParams();
  const navigate = useNavigate();
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRouteData = async () => {
      setLoading(true);
      try {
        // Fetch route pattern info
        const response = await fetch(`/api/route-patterns/${encodeURIComponent(routeNumber)}`);
        if (response.ok) {
          const data = await response.json();
          setRouteData(data);
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRouteData();
  }, [routeNumber]);

  const getRouteTypeColor = (type) => {
    if (type === 'bus') return '#6c757d';
    if (type === 'train') return '#4a90a4';
    if (type === 'rapid') return '#0d6efd';
    return '#7c3aed';
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatSchedulePattern = (pattern) => {
    if (!pattern) return [];
    return pattern.split(',').map(segment => {
      const [timeRange, freq] = segment.split('@');
      const [start, end] = timeRange.split('-');
      return { start, end, frequency: parseInt(freq) };
    });
  };

  if (loading) {
    return (
      <div className="route-detail-page">
        <div className="route-detail-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back
          </button>
        </div>
        <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
          Loading route information...
        </div>
      </div>
    );
  }

  if (!routeData) {
    return (
      <div className="route-detail-page">
        <div className="route-detail-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back
          </button>
        </div>
        <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
          Route not found.
        </div>
      </div>
    );
  }

  const scheduleSegments = formatSchedulePattern(routeData.schedulePattern);

  return (
    <div className="route-detail-page">
      <div className="route-detail-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
        <Link to="/settings" style={{ color: '#4a90a4', fontSize: '14px' }}>
          Settings
        </Link>
      </div>

      <div className="route-info-card">
        <div className="route-info-top">
          <span 
            className="route-badge-large"
            style={{ backgroundColor: getRouteTypeColor(routeData.routeType) }}
          >
            {routeData.routeNumber}
          </span>
          <div className="route-meta">
            <span className="route-type-label">{routeData.routeType.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="schedule-section">
        <h2 style={{ fontSize: '16px', marginBottom: '12px', color: '#333', fontWeight: 'bold' }}>
          Service Schedule
        </h2>
        <div className="schedule-table">
          <div className="schedule-header-row">
            <span>Time Period</span>
            <span>Frequency</span>
          </div>
          {scheduleSegments.map((seg, idx) => (
            <div key={idx} className="schedule-row">
              <span className="schedule-time">{seg.start} - {seg.end}</span>
              <span className="schedule-freq">Every {seg.frequency} min</span>
            </div>
          ))}
        </div>
      </div>

      <div className="stops-section">
        <h2 style={{ fontSize: '16px', marginBottom: '12px', color: '#333', fontWeight: 'bold' }}>
          Stations Served
        </h2>
        <div className="stops-list">
          {routeData.routeStops && routeData.routeStops.map((stop, idx) => (
            <div key={idx} className="stop-item">
              <div className="stop-name">{stop.station.name}</div>
              <div className="stop-details">
                <span style={{ color: '#666', fontSize: '12px' }}>
                  → {stop.destination}
                </span>
                {stop.platform && (
                  <span style={{ color: '#888', fontSize: '11px', marginLeft: '8px' }}>
                    Platform {stop.platform}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                <span style={{ 
                  fontSize: '10px', 
                  color: '#999',
                  textTransform: 'uppercase'
                }}>
                  Next: {formatTime(new Date(Date.now() + (idx + 1) * 8 * 60000).toISOString())}
                </span>
                <Link 
                  to={`/?stationId=${stop.station.id}`}
                  style={{ fontSize: '12px', color: '#4a90a4' }}
                >
                  View departures
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RouteDetailPage;

