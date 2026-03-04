import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

export function UserWebsite() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userTicketId, setUserTicketId] = useState('');
  const [formData, setFormData] = useState({
    ticketId: '',
    name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [gpsEnabled, setGpsEnabled] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const userTicketId = localStorage.getItem('userTicketId');
    if (userTicketId) {
      setIsLoggedIn(true);
      setUserTicketId(userTicketId);
      startGPSTracking(userTicketId);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startGPSTracking = (ticketId) => {
    if (navigator.geolocation) {
      // Get initial location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocationData({ latitude, longitude });
          try {
            await apiClient.updateLocation(ticketId, latitude, longitude, true);
            setGpsEnabled(true);
            setMessage('✅ GPS enabled! Your location is being tracked.');
            setMessageType('success');
          } catch (err) {
            setMessage('⚠️ GPS enabled but location upload failed');
            setMessageType('warning');
          }
        },
        (error) => {
          setMessage('❌ GPS permission denied');
          setMessageType('error');
        }
      );

      // Watch for continuous updates
      const watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocationData({ latitude, longitude });
          try {
            await apiClient.updateLocation(ticketId, latitude, longitude, true);
          } catch (err) {
            // Silent fail
          }
        },
        (error) => {
          // Silent fail
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!formData.ticketId.trim()) {
        throw new Error('❌ Please enter a valid ticket ID');
      }
      if (!formData.name.trim()) {
        throw new Error('❌ Please enter your name');
      }
      if (!formData.phone.trim() || formData.phone.length < 10) {
        throw new Error('❌ Please enter a valid phone number');
      }

      const response = await apiClient.registerUser(
        formData.ticketId.toUpperCase(),
        formData.name,
        formData.phone
      );

      setMessageType('success');
      setMessage(`✅ ${response.message || 'Registration successful!'}`);

      // Store user
      localStorage.setItem('userTicketId', formData.ticketId.toUpperCase());
      localStorage.setItem('userName', formData.name);
      
      // Login
      setIsLoggedIn(true);
      setUserTicketId(formData.ticketId.toUpperCase());
      
      // Start GPS tracking
      setTimeout(() => {
        startGPSTracking(formData.ticketId.toUpperCase());
      }, 1000);

    } catch (error) {
      setMessageType('error');
      setMessage(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userTicketId');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserTicketId('');
    setLocationData(null);
    setGpsEnabled(false);
    setFormData({ ticketId: '', name: '', phone: '' });
    setMessage('');
  };

  // Logged in view
  if (isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        color: 'white'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '12px',
          padding: '30px',
          color: '#333',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px'
          }}>
            <h1 style={{ margin: 0, fontSize: '24px' }}>🎯 DensityX User</h1>
            <button
              onClick={handleLogout}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              🚪 Logout
            </button>
          </div>

          {/* User Info */}
          <div style={{
            background: '#f0f0f0',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <div style={{ marginBottom: '12px' }}>
              <strong>Ticket ID:</strong> {userTicketId}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>Status:</strong> {gpsEnabled ? '✅ GPS Active' : '⏳ Enabling GPS...'}
            </div>
            {locationData && (
              <>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Latitude:</strong> {locationData.latitude.toFixed(6)}
                </div>
                <div>
                  <strong>Longitude:</strong> {locationData.longitude.toFixed(6)}
                </div>
              </>
            )}
          </div>

          {/* Message */}
          {message && (
            <div style={{
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
              color: messageType === 'success' ? '#155724' : '#721c24',
              textAlign: 'center',
              fontSize: '14px'
            }}>
              {message}
            </div>
          )}

          {/* Info Cards */}
          <div style={{
            background: '#e8eef7',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            lineHeight: '1.8'
          }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#667eea' }}>📍 What's Happening?</h3>
            <p style={{ margin: '8px 0' }}>
              ✅ Your ticket has been validated
            </p>
            <p style={{ margin: '8px 0' }}>
              ✅ GPS tracking is active
            </p>
            <p style={{ margin: '8px 0' }}>
              ✅ Your location is being sent to the monitoring system
            </p>
            <p style={{ margin: '8px 0' }}>
              ✅ You are visible on the admin crowd density map
            </p>
            <p style={{ margin: '8px 0' }}>
              📍 GPS updates every 10 seconds
            </p>
          </div>

          {/* Status Info */}
          <div style={{
            background: '#fef3cd',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#856404'
          }}>
            <strong>💡 Note:</strong> Keep this app open or in background for GPS to work. Your location helps crowd monitoring system detect density areas.
          </div>
        </div>
      </div>
    );
  }

  // Registration view
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '450px',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '30px 20px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>🎯 DensityX</h1>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>User Registration</p>
        </div>

        {/* Content */}
        <div style={{ padding: '30px' }}>
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#333'
              }}>
                🎫 Ticket ID
              </label>
              <input
                type="text"
                name="ticketId"
                placeholder="e.g., DX-005491"
                value={formData.ticketId}
                onChange={handleInputChange}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'monospace',
                  transition: 'border-color 0.3s',
                  backgroundColor: '#fafafa'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#333'
              }}>
                👤 Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  backgroundColor: '#fafafa'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#333'
              }}>
                📱 Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="10+ digits"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  backgroundColor: '#fafafa'
                }}
              />
            </div>

            {message && (
              <div style={{
                padding: '12px',
                borderRadius: '6px',
                backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
                color: messageType === 'success' ? '#155724' : '#721c24',
                fontSize: '13px',
                textAlign: 'center'
              }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s'
              }}
            >
              {loading ? '⏳ Registering...' : '✅ Register & Enable GPS'}
            </button>

            <small style={{ color: '#666', textAlign: 'center', marginTop: '10px' }}>
              By registering, you agree to share your location for crowd monitoring
            </small>
          </form>
        </div>
      </div>
    </div>
  );
}
