// src/App.jsx
import { useState } from 'react';
import Feed from './components/Feed';
import { AuthProvider, useAuth } from './context/AuthContext';
import './Login.css';

const LoginForm = () => {
  const { setTokens } = useAuth();
  const [id, setId] = useState('');
  const [error, setError] = useState('');

  const login = async () => {
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    console.log('Response status:', res.status); // 👈 Log status

    const data = await res.json();
    console.log('Response body:', data); // 👈 Log full body

    if (!res.ok) {
      setError(data.message || 'Invalid user ID');
      return;
    }

    if (!data.token) {
      setError('Token not received from server');
      return;
    }

    setTokens(data.token);
    setError('');
  } catch (err) {
    console.error('Login error:', err);
    setError('Something went wrong');
  }
};



  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>Login</h2>
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Enter ID (u1 or u2)"
        />
        {error && <p className="error">{error}</p>}
        <button onClick={login}>Login</button>
      </div>
    </div>
  );
};


const AppContent = () => {
  const { token } = useAuth();
  return token ? <Feed /> : <LoginForm />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
