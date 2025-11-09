import React, { useState } from 'react';
import { upsertUserRoutine, deleteUserRoutine } from '../services/routines.js';

// Gestor simple de rutinas del usuario: duplicar defaults, crear nuevas, editar nombre/config y eliminar.
// Nota: Edición de ejercicios se planifica como mejora posterior.
export default function RoutinesManager({ userId, routines, onRefresh, onSelect }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ name: '', rounds: 3, restSeconds: 20, weeklyTarget: 4, estimatedMin: 20, estimatedMax: 25, advice: '' });

  // Inicia edición para una rutina de usuario
  const startEdit = (r) => {
    setEditingId(r.id);
    setDraft({
      name: r.name || '',
      rounds: r?.config?.rounds ?? 3,
      restSeconds: r?.config?.restSeconds ?? 20,
      weeklyTarget: r?.meta?.weeklyTarget ?? 4,
      estimatedMin: r?.meta?.estimatedMinutes?.min ?? 20,
      estimatedMax: r?.meta?.estimatedMinutes?.max ?? 25,
      advice: (r?.advice || []).join('\n')
    });
  };

  // Guarda cambios básicos (nombre y config)
  const saveEdit = (r) => {
    const updated = {
      ...r,
      name: draft.name || r.name,
      config: {
        rounds: Number(draft.rounds) || 1,
        restSeconds: Number(draft.restSeconds) || 0,
      },
      meta: {
        weeklyTarget: Number(draft.weeklyTarget) || 1,
        estimatedMinutes: {
          min: Number(draft.estimatedMin) || 0,
          max: Number(draft.estimatedMax) || Number(draft.estimatedMin) || 0
        }
      },
      advice: (draft.advice || '')
        .split(/\n+/)
        .map(a => a.trim())
        .filter(Boolean)
    };
    upsertUserRoutine(userId, updated);
    setEditingId(null);
    onRefresh?.();
  };

  // Crea rutina vacía básica
  const handleCreate = () => {
    const id = `custom-${Date.now()}`;
    const routine = {
      id,
      name: 'Nueva rutina',
      description: 'Rutina personalizada',
      config: { rounds: 3, restSeconds: 20 },
      warmup: [],
      mainCircuit: [],
      cooldown: [],
    };
    upsertUserRoutine(userId, routine);
    onRefresh?.();
    onSelect?.(id);
    setEditingId(id);
  setDraft({ name: routine.name, rounds: 3, restSeconds: 20, weeklyTarget: 4, estimatedMin: 20, estimatedMax: 25, advice: '' });
  };

  // Duplica rutina por defecto a rutinas del usuario
  const handleDuplicate = (r) => {
    const id = `${r.id}-copy-${Date.now()}`;
    const copy = {
      ...r,
      id,
      name: `Copia de ${r.name}`,
    };
    // Asegurar que no arrastre flag de isDefault
    delete copy.isDefault;
    upsertUserRoutine(userId, copy);
    onRefresh?.();
    onSelect?.(id);
    setEditingId(id);
    setDraft({
      name: copy.name,
      rounds: copy?.config?.rounds ?? 3,
      restSeconds: copy?.config?.restSeconds ?? 20,
      weeklyTarget: copy?.meta?.weeklyTarget ?? 4,
      estimatedMin: copy?.meta?.estimatedMinutes?.min ?? 20,
      estimatedMax: copy?.meta?.estimatedMinutes?.max ?? 25,
      advice: (copy?.advice || []).join('\n')
    });
  };

  const handleDelete = (r) => {
    deleteUserRoutine(userId, r.id);
    onRefresh?.();
  };

  const isUserRoutine = (r) => !r.isDefault;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Gestionar rutinas</h3>
        <button onClick={handleCreate} className="px-3 py-2 text-sm rounded-lg bg-orange-500 text-white hover:bg-orange-600">Crear nueva</button>
      </div>
      <div className="space-y-2">
        {routines.map((r) => (
          <div key={r.id} className="border rounded-lg p-3 bg-white flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {r.name}{' '}
                  <span className={`text-xs ${r.isDefault ? 'text-gray-500' : 'text-emerald-600'}`}>
                    {r.isDefault ? '(default)' : '(usuario)'}
                  </span>
                </p>
                <p className="text-xs text-gray-500">Rounds: {r?.config?.rounds ?? 3} · Descanso: {r?.config?.restSeconds ?? 20}s</p>
              </div>
              <div className="flex items-center gap-2">
                {r.isDefault ? (
                  <button onClick={() => handleDuplicate(r)} className="px-2 py-1 text-xs border rounded hover:bg-orange-50 border-orange-300 text-orange-600">Duplicar</button>
                ) : (
                  <>
                    {editingId === r.id ? (
                      <>
                        <button onClick={() => saveEdit(r)} className="px-2 py-1 text-xs rounded bg-emerald-500 text-white hover:bg-emerald-600">Guardar</button>
                        <button onClick={() => setEditingId(null)} className="px-2 py-1 text-xs rounded border hover:bg-gray-50">Cancelar</button>
                      </>
                    ) : (
                      <button onClick={() => startEdit(r)} className="px-2 py-1 text-xs border rounded hover:bg-gray-50">Editar</button>
                    )}
                    <button onClick={() => handleDelete(r)} className="px-2 py-1 text-xs border rounded hover:bg-red-50 border-red-300 text-red-600">Eliminar</button>
                  </>
                )}
                <button onClick={() => onSelect?.(r.id)} className="px-2 py-1 text-xs rounded bg-gray-800 text-white hover:bg-black">Usar</button>
              </div>
            </div>
            {editingId === r.id && !r.isDefault && (
              <div className="grid gap-3 md:grid-cols-3">
                <div className="space-y-1 md:col-span-1">
                  <label className="text-xs text-gray-600">Nombre</label>
                  <input value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} className="w-full border rounded px-2 py-1 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-600">Rounds</label>
                  <input type="number" min={1} max={10} value={draft.rounds} onChange={(e) => setDraft((d) => ({ ...d, rounds: e.target.value }))} className="w-full border rounded px-2 py-1 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-600">Descanso (s)</label>
                  <input type="number" min={0} max={180} value={draft.restSeconds} onChange={(e) => setDraft((d) => ({ ...d, restSeconds: e.target.value }))} className="w-full border rounded px-2 py-1 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-600">Sesiones/sem (meta)</label>
                  <input type="number" min={1} max={7} value={draft.weeklyTarget} onChange={(e) => setDraft((d) => ({ ...d, weeklyTarget: e.target.value }))} className="w-full border rounded px-2 py-1 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-600">Min estimado (mín)</label>
                  <input type="number" min={1} max={120} value={draft.estimatedMin} onChange={(e) => setDraft((d) => ({ ...d, estimatedMin: e.target.value }))} className="w-full border rounded px-2 py-1 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-600">Min estimado (máx)</label>
                  <input type="number" min={1} max={180} value={draft.estimatedMax} onChange={(e) => setDraft((d) => ({ ...d, estimatedMax: e.target.value }))} className="w-full border rounded px-2 py-1 text-sm" />
                </div>
                <div className="space-y-1 md:col-span-3">
                  <label className="text-xs text-gray-600">Consejos (uno por línea)</label>
                  <textarea rows={3} value={draft.advice} onChange={(e) => setDraft((d) => ({ ...d, advice: e.target.value }))} className="w-full border rounded px-2 py-1 text-xs resize-y" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">Consejo: Duplica una rutina por defecto para personalizarla rápidamente.</p>
    </div>
  );
}
