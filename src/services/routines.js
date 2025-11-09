// Servicio de rutinas: carga rutinas por defecto y del usuario (localStorage)
// Comentarios en español; preparado para futura integración con backend/admin externo.

import defaults from "../data/routines/defaults.json";

const LS_KEY = (userId) => `routines:${userId}`;

/**
 * Estructura base de una rutina
 * {
 *  id, name, description,
 *  config: { rounds: number, restSeconds: number },
 *  warmup: Exercise[], mainCircuit: Exercise[], cooldown: Exercise[]
 * }
 */

// Obtiene rutinas por defecto (inmutables)
export function getDefaultRoutines() {
  return defaults.routines || [];
}

// Obtiene rutinas del usuario desde localStorage
export function getUserRoutines(userId) {
  try {
    const raw = localStorage.getItem(LS_KEY(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

// Guarda las rutinas del usuario en localStorage
export function saveUserRoutines(userId, routines) {
  try {
    localStorage.setItem(LS_KEY(userId), JSON.stringify(routines || []));
  } catch {
    // ignorar errores de almacenamiento
  }
}

// Devuelve todas las rutinas combinadas (default + usuario)
export function getAllRoutines(userId) {
  const base = getDefaultRoutines().map((r) => ({ ...r, isDefault: true }));
  const user = getUserRoutines(userId).map((r) => ({ ...r, isDefault: false }));
  // Evitar colisiones por id: prioridad usuario
  const map = new Map();
  for (const r of base) map.set(r.id, r);
  for (const r of user) map.set(r.id, r);
  return Array.from(map.values());
}

export function getRoutineById(userId, routineId) {
  return getAllRoutines(userId).find((r) => r.id === routineId) || null;
}

export function upsertUserRoutine(userId, routine) {
  const list = getUserRoutines(userId);
  const idx = list.findIndex((r) => r.id === routine.id);
  if (idx >= 0) list[idx] = routine;
  else list.push(routine);
  saveUserRoutines(userId, list);
  return routine;
}

export function deleteUserRoutine(userId, routineId) {
  const list = getUserRoutines(userId).filter((r) => r.id !== routineId);
  saveUserRoutines(userId, list);
}
