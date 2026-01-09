import { useState } from 'react';
import { Link } from 'react-router-dom';
import './SettingsPage.css';

function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    soundAlerts: false,
    showDelayedOnly: false,
    defaultStation: 'CTR',
    timeFormat: '12h',
    language: 'en'
  });

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="SettingsPage">
      <div className="settings-header">
        <Link to="/" className="backLink">← Back to Departures</Link>
        <h1 className="settingsTitle">Settings</h1>
      </div>

      <div className="settings-card">
        <h2 style={{ fontSize: '15px', marginBottom: '16px', color: '#333' }}>Display Preferences</h2>
        
        <div className="setting-row">
          <div className="setting-label">
            <span className="label-text">Theme</span>
            <span style={{ fontSize: '11px', color: '#999' }}>Choose your preferred color scheme</span>
          </div>
          <select 
            value={settings.theme}
            onChange={(e) => handleChange('theme', e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '13px',
              backgroundColor: 'white'
            }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System Default</option>
          </select>
        </div>

        <div className="setting-row">
          <div className="setting-label">
            <span className="label-text">Time Format</span>
          </div>
          <select 
            value={settings.timeFormat}
            onChange={(e) => handleChange('timeFormat', e.target.value)}
            className="selectInput"
          >
            <option value="12h">12-hour (2:30 PM)</option>
            <option value="24h">24-hour (14:30)</option>
          </select>
        </div>

        <div className="setting-row">
          <div className="setting-label">
            <span className="label-text">Language</span>
          </div>
          <select 
            value={settings.language}
            onChange={(e) => handleChange('language', e.target.value)}
            className="selectInput"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="zh">中文</option>
          </select>
        </div>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        border: '1px solid #ddd', 
        borderRadius: '6px', 
        padding: '20px',
        marginBottom: '16px'
      }}>
        <h2 style={{ fontSize: '15px', marginBottom: '16px', color: '#333' }}>Notifications</h2>
        
        <div className="setting-row">
          <div className="setting-label">
            <span className="label-text">Push Notifications</span>
            <span style={{ fontSize: '11px', color: '#999' }}>Get alerts for delays and cancellations</span>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={settings.notifications}
              onChange={(e) => handleChange('notifications', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-row">
          <div className="setting-label">
            <span className="label-text">Sound Alerts</span>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={settings.soundAlerts}
              onChange={(e) => handleChange('soundAlerts', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="settings-card">
        <h2 style={{ fontSize: '15px', marginBottom: '16px', color: '#333' }}>Default View</h2>
        
        <div className="setting-row">
          <div className="setting-label">
            <span className="label-text">Default Station</span>
          </div>
          <select 
            value={settings.defaultStation}
            onChange={(e) => handleChange('defaultStation', e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '13px',
              backgroundColor: 'white',
              minWidth: '180px'
            }}
          >
            <option value="CTR">Central Station</option>
            <option value="WFT">Waterfront Terminal</option>
            <option value="NGT">Northgate Transit Center</option>
            <option value="YCA">Cascadia International Airport</option>
            <option value="UNV">University District</option>
          </select>
        </div>

        <div className="setting-row">
          <div className="setting-label">
            <span className="label-text">Show Delayed Routes Only</span>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={settings.showDelayedOnly}
              onChange={(e) => handleChange('showDelayedOnly', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <button 
          onClick={() => alert('Settings saved!')}
          style={{
            backgroundColor: '#4a90a4',
            color: 'white',
            border: 'none',
            padding: '12px 32px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Save Changes
        </button>
      </div>

      <p style={{ 
        textAlign: 'center', 
        marginTop: '20px', 
        fontSize: '12px', 
        color: '#999' 
      }}>
        Cascadia Metro Transit v1.0.0
      </p>
    </div>
  );
}

export default SettingsPage;


