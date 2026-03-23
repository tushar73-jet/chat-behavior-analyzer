import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:3000/api/analyze';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('chatFile', file);

    try {
      const response = await axios.post(API_URL, formData);
      setData(response.data);
    } catch (err) {
      setError('Analysis failed. Ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <h1>Chat Analyzer</h1>
      
      {!data && (
        <div className="upload-card">
          <h3>Upload WhatsApp Chat (.txt)</h3>
          <input type="file" onChange={handleFileChange} />
          <button onClick={analyze} disabled={!file || loading}>
            {loading ? 'Analyzing...' : 'Analyze Behavior'}
          </button>
        </div>
      )}

      {error && <p style={{ color: '#dc3545' }}>{error}</p>}

      {data && (
        <div className="results-view">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Results: {data.metadata.totalMessages} Messages</h2>
            <button onClick={() => setData(null)}>New Analysis</button>
          </div>

          <div className="results-grid">
            {Object.entries(data.userStats).map(([user, stats]) => (
              <div key={user} className="user-stat-card">
                <h3>{user}</h3>
                <p>Messages: <strong>{stats.messageCount}</strong></p>
                <p>Initiations: <strong>{stats.initiationCount}</strong></p>
                <p>Avg Words/Msg: <strong>{stats.avgWordPerMessage}</strong></p>
                <p>Avg Response: <strong>{stats.avgResponseTimeMinutes}m</strong></p>
                <p>Sentiment Score: <strong>{stats.avgSentiment.toFixed(3)}</strong></p>
              </div>
            ))}
          </div>

          <div className="insights-panel" style={{ marginTop: '30px' }}>
            <h3>Behavioral Insights</h3>
            <ul className="insight-list">
              {data.insights.map((insight, i) => (
                <li key={i}>{insight}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
