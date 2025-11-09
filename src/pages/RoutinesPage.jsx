import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { getAllRoutines } from '../services/routines.js';
import RoutinesManager from '../components/RoutinesManager.jsx';
import { UserCircle } from 'lucide-react';

// Página dedicada a gestión de rutinas (duplicar, crear, editar básicas)
export default function RoutinesPage() {
  const { user, isGuest } = useAuth();
  const userId = user?.id || 'guest';
  const [routines, setRoutines] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const all = getAllRoutines(userId);
    setRoutines(all);
    if (!selected && all.length) setSelected(all[0].id);
  }, [userId]);

  const refresh = () => setRoutines(getAllRoutines(userId));
  const selectedRoutine = routines.find(r => r.id === selected);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Rutinas</h1>
            <p className="text-sm text-gray-600 mb-4">Duplica rutinas por defecto, crea nuevas y personaliza configuración básica.</p>
            <RoutinesManager
              userId={userId}
              routines={routines}
              onRefresh={refresh}
              onSelect={(id) => setSelected(id)}
            />
          </div>
        </div>
        <aside className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <UserCircle className="w-10 h-10 text-orange-500" />
              <div>
                <p className="text-sm font-semibold text-gray-800">{user?.nombre || 'Invitado'}</p>
                <p className="text-xs text-gray-500">{isGuest ? 'Modo invitado' : 'Usuario activo'}</p>
              </div>
            </div>
            <div className="text-xs text-gray-600 space-y-2">
              <p>Rutinas totales: {routines.length}</p>
              <p>Rutinas personalizadas: {routines.filter(r => !r.isDefault).length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Rutina seleccionada</h2>
            {selectedRoutine ? (
              <ul className="text-xs text-gray-600 space-y-1">
                <li><strong>Nombre:</strong> {selectedRoutine.name}</li>
                <li><strong>Rounds:</strong> {selectedRoutine?.config?.rounds ?? 3}</li>
                <li><strong>Descanso:</strong> {selectedRoutine?.config?.restSeconds ?? 20}s</li>
                <li><strong>Calentamiento:</strong> {selectedRoutine.warmup.length} ejercicios</li>
                <li><strong>Circuito:</strong> {selectedRoutine.mainCircuit.length} ejercicios</li>
                <li><strong>Enfriamiento:</strong> {selectedRoutine.cooldown.length} ejercicios</li>
              </ul>
            ) : <p className="text-xs text-gray-500">No hay rutina seleccionada</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
