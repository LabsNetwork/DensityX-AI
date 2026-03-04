import React, { useEffect, useState } from 'react';

export default function Diagnostic() {
  const [status, setStatus] = useState({
    frontend: 'Loading...',
    backend: 'Loading...',
    api: 'Loading...'
  });

  useEffect(() => {
    (async () => {
      try {
        // Check backend health
        const healthRes = await fetch('https://densityx-ai.onrender.com/health');
        const healthData = await healthRes.json();
        setStatus(prev => ({ ...prev, backend: 'OK - ' + JSON.stringify(healthData) }));
      } catch (e) {
        setStatus(prev => ({ ...prev, backend: 'FAILED - ' + e.message }));
      }

      try {
        // Check API
        const apiRes = await fetch('https://densityx-ai.onrender.com/crowd/locations');
        const apiData = await apiRes.json();
        setStatus(prev => ({ ...prev, api: 'OK - ' + apiData.count + ' points' }));
      } catch (e) {
        setStatus(prev => ({ ...prev, api: 'FAILED - ' + e.message }));
      }

      setStatus(prev => ({ ...prev, frontend: 'OK - React loaded' }));
    })();
  }, []);

  return (
    <div style={{
      padding: '40px',
      background: '#1a1a1a',
      color: '#00ff00',
      fontFamily: 'monospace',
      height: '100vh',
      overflow: 'auto'
    }}>
      <h1>DensityX Diagnostic Report</h1>
      <pre>{JSON.stringify(status, null, 2)}</pre>
    </div>
  );
}
