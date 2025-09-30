import { useState } from 'react';
import { userAPI } from '../services/api';

function TestConnection() {
  const [status, setStatus] = useState('idle'); // idle, testing, success, error
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const testConnection = async () => {
    setStatus('testing');
    setUserData(null);
    setErrorMessage('');

    try {
      const response = await userAPI.getUserById(1);
      setUserData(response.data);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      if (error.code === 'ECONNABORTED') {
        setErrorMessage('Connection timeout - Backend might be offline');
      } else if (error.response) {
        setErrorMessage(`Server error: ${error.response.status} - ${error.response.data?.error || error.message}`);
      } else if (error.request) {
        setErrorMessage('Network error - Cannot reach backend server. Make sure it\'s running on http://localhost:8080');
      } else {
        setErrorMessage(`Error: ${error.message}`);
      }
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success': return '#4caf50';
      case 'error': return '#f44336';
      case 'testing': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'success': return '✓ Connected';
      case 'error': return '✗ Connection Failed';
      case 'testing': return '⟳ Testing...';
      default: return '○ Not Tested';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Backend Connection Test</h1>

        <div style={styles.statusContainer}>
          <div style={{...styles.statusIndicator, backgroundColor: getStatusColor()}} />
          <span style={styles.statusText}>{getStatusText()}</span>
        </div>

        <div style={styles.info}>
          <p><strong>Backend URL:</strong> http://localhost:8080</p>
          <p><strong>Test Endpoint:</strong> GET /api/users/1</p>
        </div>

        <button
          onClick={testConnection}
          disabled={status === 'testing'}
          style={{
            ...styles.button,
            opacity: status === 'testing' ? 0.6 : 1,
            cursor: status === 'testing' ? 'not-allowed' : 'pointer'
          }}
        >
          {status === 'testing' ? 'Testing...' : 'Test Connection'}
        </button>

        {userData && (
          <div style={styles.successBox}>
            <h3 style={styles.resultTitle}>✓ Response Data:</h3>
            <div style={styles.dataDisplay}>
              <p><strong>User ID:</strong> {userData.id}</p>
              <p><strong>Name:</strong> {userData.name}</p>
            </div>
            <pre style={styles.jsonDisplay}>
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>
        )}

        {errorMessage && (
          <div style={styles.errorBox}>
            <h3 style={styles.resultTitle}>✗ Error:</h3>
            <p style={styles.errorText}>{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: 'calc(100vh - 120px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  card: {
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    color: '#DDD',
    textAlign: 'center',
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    gap: '0.75rem',
  },
  statusIndicator: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
  },
  statusText: {
    fontSize: '1.1rem',
    fontWeight: '500',
  },
  info: {
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#2196f3',
    border: 'none',
    borderRadius: '8px',
    transition: 'background-color 0.3s',
  },
  successBox: {
    marginTop: '1.5rem',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #DDD',
    borderLeft: '4px solid #4caf50',
  },
  errorBox: {
    marginTop: '1.5rem',
    padding: '1rem',
    borderRadius: '8px',
    borderLeft: '4px solid #f44336',
  },
  resultTitle: {
    margin: '0 0 0.75rem 0',
    fontSize: '1rem',
    color: '#DDD',
  },
  dataDisplay: {
    marginBottom: '0.75rem',
  },
  jsonDisplay: {
    padding: '0.75rem',
    borderRadius: '4px',
    fontSize: '0.85rem',
    overflow: 'auto',
    border: '1px solid #DDD',
  },
  errorText: {
    margin: 0,
    color: '#d32f2f',
    fontSize: '0.95rem',
  },
};

export default TestConnection;
