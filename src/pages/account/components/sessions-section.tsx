import { useState } from 'react';
import { useSessions } from '@/hooks/useSessions';
import {
  Monitor,
  Smartphone,
  Tablet,
  Trash2,
  RefreshCw
} from 'lucide-react';

export const SessionsSection = () => {
  const { sessions, loading, error, revokeSession, revokeAllSessions, fetchSessions } = useSessions();
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-6 w-6 text-gray-400" />;
      case 'tablet':
        return <Tablet className="h-6 w-6 text-gray-400" />;
      default:
        return <Monitor className="h-6 w-6 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRevokeSession = async (sessionId: number) => {
    if (!confirm('¿Estás seguro de que deseas cerrar esta sesión?')) {
      return;
    }

    setActionLoading(sessionId);
    try {
      await revokeSession(sessionId);
    } catch (error) {
      console.error('Error al revocar sesión:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeAllSessions = async () => {
    if (!confirm('¿Estás seguro de que deseas cerrar todas las sesiones excepto la actual?')) {
      return;
    }

    setActionLoading(-1);
    try {
      await revokeAllSessions(true);
    } catch (error) {
      console.error('Error al revocar sesiones:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && sessions.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Sesiones Activas</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Sesiones Activas</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchSessions}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {sessions.length > 1 && (
            <button
              onClick={handleRevokeAllSessions}
              disabled={actionLoading !== null}
              className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
            >
              {actionLoading === -1 ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cerrar todas las demás
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {sessions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay sesiones activas</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="border border-gray-200 rounded-lg p-4 flex items-start justify-between hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div className="shrink-0 mt-1">
                  {getDeviceIcon(session.device_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {session.browser} en {session.os}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    IP: {session.ip_address}
                  </p>
                  <div className="mt-2 flex flex-col text-xs text-gray-500 space-y-1">
                    <span>
                      Última actividad: {formatDate(session.last_activity)}
                    </span>
                    <span>
                      Creada: {formatDate(session.created_at)}
                    </span>
                    <span>
                      Expira: {formatDate(session.expires_at)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRevokeSession(session.id)}
                disabled={actionLoading === session.id}
                className="ml-4 inline-flex items-center p-2 border border-transparent rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50"
                title="Cerrar sesión"
              >
                {actionLoading === session.id ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                ) : (
                  <Trash2 className="h-5 w-5" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>
          Las sesiones expiran automáticamente después de un período de inactividad.
          Puedes cerrar sesiones sospechosas o que ya no estés usando.
        </p>
      </div>
    </div>
  );
};

