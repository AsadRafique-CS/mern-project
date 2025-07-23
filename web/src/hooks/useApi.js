import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const cache = {};

export default function useApi(resource, options = {}) {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!cache[resource]);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);

  useEffect(() => {
    if (cache[resource]) {
      setData(cache[resource]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    fetch(`/api/${resource}`, {
      ...options,
      signal: controller.signal,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(json => {
        cache[resource] = json;
        setData(json);
      })
      .catch(err => {
        if (err.name !== 'AbortError') setError(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [resource]);

  return { data, loading, error };
}
