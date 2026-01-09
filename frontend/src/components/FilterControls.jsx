import './FilterControls.css';

function FilterControls({ filters, onFilterChange }) {
  return (
    <div className="filter-container">
      <div className="filterGroup">
        <label className="filter-label">Route Type:</label>
        <select 
          className="filterSelect"
          value={filters.type}
          onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
        >
          <option value="all">All Types</option>
          <option value="train">Train</option>
          <option value="rapid">Rapid Bus</option>
          <option value="express">Express</option>
          <option value="bus">Local Bus</option>
        </select>
      </div>
      
      <div className="filterGroup">
        <label className="filter-label">Status:</label>
        <select 
          className="filterSelect"
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
        >
          <option value="all">All Statuses</option>
          <option value="on-time">On Time</option>
          <option value="delayed">Delayed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
}

export default FilterControls;
