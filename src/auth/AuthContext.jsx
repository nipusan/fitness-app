import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Contexto de autenticación básico con usuario mock "invitado".
// Esta capa permitirá integrar un login externo en el futuro sin tocar el resto de la app.

const AuthContext = createContext(null);

// Usuario mock por defecto
const GUEST_USER = {
  id: 'guest-000',
  nombre: 'Invitado',
  email: 'invitado@example.com',
  roles: ['guest'],
  permisos: [],
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carga inicial: intenta leer de localStorage; si no hay, setea invitado.
  useEffect(() => {
    try {
      const raw = localStorage.getItem('auth:user');
      if (raw) {
        setUser(JSON.parse(raw));
      } else {
        setUser(GUEST_USER);
      }
    } catch (e) {
      // En caso de error, mantiene usuario invitado
      setUser(GUEST_USER);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sincroniza cambios con localStorage (simple persistencia local)
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('auth:user', JSON.stringify(user));
      } catch {
        // Ignorar errores de almacenamiento (modo incógnito, espacio, etc.)
      }
    }
  }, [user, loading]);

  // Métodos stub para futura integración
  const login = async (_tokenOrPayload) => {
    // TODO: integrar contra app externa de login cuando esté disponible
    // Por ahora, se mantiene usuario invitado
    setUser(GUEST_USER);
    return GUEST_USER;
  };

  const logout = async () => {
    setUser(GUEST_USER);
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    isGuest: user?.id === GUEST_USER.id,
    loading,
    login,
    logout,
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
};
