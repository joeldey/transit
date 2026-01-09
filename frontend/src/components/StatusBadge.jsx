function StatusBadge({ status }) {
  const getStatusStyle = () => {
    if (status === 'on-time') {
      return { 
        backgroundColor: '#28a745', 
        color: 'white',
        padding: '4px 8px',
        borderRadius: '3px',
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'uppercase',
        fontFamily: 'Arial, sans-serif',
        display: 'inline-block'
      };
    } else if (status === 'delayed') {
      return { 
        backgroundColor: '#ffc107', 
        color: '#333333',
        padding: '4px 8px',
        borderRadius: '3px',
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'uppercase',
        fontFamily: 'Arial, sans-serif',
        display: 'inline-block'
      };
    } else if (status === 'cancelled') {
      return { 
        backgroundColor: '#dc3545', 
        color: 'white',
        padding: '4px 8px',
        borderRadius: '3px',
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'uppercase',
        fontFamily: 'Arial, sans-serif',
        display: 'inline-block'
      };
    }
    return {
      backgroundColor: '#6c757d',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '3px',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase',
      fontFamily: 'Arial, sans-serif',
      display: 'inline-block'
    };
  };

  const formatStatus = (s) => {
    return s.replace('-', ' ');
  };

  return (
    <span style={getStatusStyle()}>
      {formatStatus(status)}
    </span>
  );
}

export default StatusBadge;
