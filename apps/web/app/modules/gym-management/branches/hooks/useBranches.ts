import { useState, useCallback } from 'react';

export function useBranches() {
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Data hook placeholder
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, fetchData };
}
