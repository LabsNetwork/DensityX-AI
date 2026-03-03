import "./ControlPanel.css";

export function ControlPanel({
  alertThreshold,
  setAlertThreshold,
  minClusterSize,
  setMinClusterSize,
  eps,
  setEps,
}) {
  return (
    <div className="control-panel">
      <div className="panel-header">⚙️ Clustering Config</div>

      {/* Alert Threshold Control */}
      <div className="control-item">
        <label htmlFor="alert-threshold">Alert Threshold</label>
        <div className="slider-container">
          <input
            id="alert-threshold"
            type="range"
            min="20"
            max="200"
            value={alertThreshold}
            onChange={(e) => setAlertThreshold(parseInt(e.target.value, 10))}
            className="slider"
          />
          <span className="value-display">{alertThreshold}</span>
        </div>
        <p className="description">Trigger alert when cluster size ≥ this value</p>
      </div>

      {/* Minimum Cluster Size Control */}
      <div className="control-item">
        <label htmlFor="min-cluster">Min Cluster Size</label>
        <div className="slider-container">
          <input
            id="min-cluster"
            type="range"
            min="5"
            max="50"
            value={minClusterSize}
            onChange={(e) => setMinClusterSize(parseInt(e.target.value, 10))}
            className="slider"
          />
          <span className="value-display">{minClusterSize}</span>
        </div>
        <p className="description">Minimum points required to form a cluster</p>
      </div>

      {/* DBSCAN Epsilon Control */}
      <div className="control-item">
        <label htmlFor="eps">DBSCAN Epsilon (m)</label>
        <div className="slider-container">
          <input
            id="eps"
            type="range"
            min="10"
            max="100"
            step="5"
            value={eps}
            onChange={(e) => setEps(parseFloat(e.target.value))}
            className="slider"
          />
          <span className="value-display">{eps.toFixed(1)}m</span>
        </div>
        <p className="description">Search radius for neighborhood points</p>
      </div>

      <div className="panel-footer">📊 Live Updates Enabled</div>
    </div>
  );
}
