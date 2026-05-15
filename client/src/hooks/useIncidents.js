import { useEffect, useState } from 'react';
import { api } from '../services/api';

export const useIncidents = (enabled = true) => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    if (!enabled) {
      setLoading(false);
      return Promise.resolve();
    }
    return api.get('/api/incidents')
      .then((res) => setIncidents(res.data))
      .catch(() => setIncidents([]))
      .finally(() => setLoading(false));
  };
  useEffect(() => { refresh(); }, [enabled]);

  return { incidents, loading, refresh, setIncidents };
};
