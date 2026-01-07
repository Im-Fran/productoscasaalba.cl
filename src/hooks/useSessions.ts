import { useState, useEffect } from 'react';
import { AuthService } from '@/services/auth';
import type { UserSession } from '@/types/user';

export const useSessions = () => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AuthService.getSessions();
      setSessions(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener sesiones';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const revokeSession = async (sessionId: number) => {
    setLoading(true);
    setError(null);
    try {
      await AuthService.revokeSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al revocar sesión';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const revokeAllSessions = async (keepCurrent: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      await AuthService.revokeAllSessions(keepCurrent);
      if (!keepCurrent) {
        setSessions([]);
      } else {
        await fetchSessions();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al revocar sesiones';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    revokeSession,
    revokeAllSessions,
  };
};

