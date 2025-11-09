import React, { useState, useEffect } from 'react';
import { useAuth } from './auth/AuthContext.jsx';
import { getAllRoutines } from './services/routines.js';
import { Play, Pause, RotateCcw, CheckCircle, Calendar, TrendingUp, Award } from 'lucide-react';

// Componente principal de la aplicación de fitness.
// Controla las fases del entrenamiento: inicio -> calentamiento -> circuito (3 rondas) -> enfriamiento -> completado.
// Incluye temporizador, progreso y almacenamiento simple en memoria de rutinas completadas.
const FitnessApp = () => {
  const [currentPhase, setCurrentPhase] = useState('inicio');
  const [currentRound, setCurrentRound] = useState(1);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [showQR, setShowQR] = useState(false);
  const { user, isGuest } = useAuth();

  // Rutinas parametrizadas (por usuario + defaults)
  const [routines, setRoutines] = useState([]);
  const [selectedRoutineId, setSelectedRoutineId] = useState(null);
  const selectedRoutine = routines.find(r => r.id === selectedRoutineId);
  const rounds = selectedRoutine?.config?.rounds ?? 3;
  const restSeconds = selectedRoutine?.config?.restSeconds ?? 20;
  const warmup = selectedRoutine?.warmup ?? [];
  const mainCircuit = selectedRoutine?.mainCircuit ?? [];
  const cooldown = selectedRoutine?.cooldown ?? [];
  const workSeconds = mainCircuit[0]?.duration ?? 40;

  // Carga de rutinas por usuario
  useEffect(() => {
    const all = getAllRoutines(user?.id || 'guest');
    setRoutines(all);
    const saved = localStorage.getItem('routines:selected');
    const initial = saved && all.some(r => r.id === saved) ? saved : all[0]?.id;
    setSelectedRoutineId(initial || null);
  }, [user?.id]);

  // Persistir rutina seleccionada
  useEffect(() => {
    if (selectedRoutineId) {
      localStorage.setItem('routines:selected', selectedRoutineId);
    }
  }, [selectedRoutineId]);

  // Efecto para manejar el temporizador.
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleExerciseComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Lógica al terminar cada ejercicio.
  const handleExerciseComplete = () => {
    setIsActive(false);
    if (currentPhase === 'calentamiento') {
      if (currentExercise < warmup.length - 1) {
        setCurrentExercise(prev => prev + 1);
      } else {
        setCurrentPhase('circuito');
        setCurrentExercise(0);
        setCurrentRound(1);
      }
    } else if (currentPhase === 'circuito') {
      if (isResting) {
        setIsResting(false);
        if (currentExercise < mainCircuit.length - 1) {
          setCurrentExercise(prev => prev + 1);
        } else if (currentRound < rounds) {
          setCurrentRound(prev => prev + 1);
          setCurrentExercise(0);
        } else {
          setCurrentPhase('enfriamiento');
          setCurrentExercise(0);
        }
      } else {
        setIsResting(true);
        setTimeLeft(restSeconds); // Descanso parametrizado
        setIsActive(true);
      }
    } else if (currentPhase === 'enfriamiento') {
      if (currentExercise < cooldown.length - 1) {
        setCurrentExercise(prev => prev + 1);
      } else {
        completeWorkout();
      }
    }
  };

  // Marca el entrenamiento como completado.
  const completeWorkout = () => {
    const today = new Date().toISOString().split('T')[0];
    const newWorkouts = [...completedWorkouts, today];
    setCompletedWorkouts(newWorkouts);
    setCurrentPhase('completado');
  };

  // Inicia el temporizador del ejercicio actual.
  const startExercise = () => {
    let duration = 0;
    if (currentPhase === 'calentamiento') {
      duration = warmup[currentExercise].duration;
    } else if (currentPhase === 'circuito') {
      duration = isResting ? restSeconds : mainCircuit[currentExercise].duration;
    } else if (currentPhase === 'enfriamiento') {
      duration = cooldown[currentExercise].duration;
    }
    setTimeLeft(duration);
    setIsActive(true);
  };

  const togglePause = () => setIsActive(!isActive);

  // Reinicia todo el flujo.
  const resetWorkout = () => {
    setCurrentPhase('inicio');
    setCurrentRound(1);
    setCurrentExercise(0);
    setTimeLeft(0);
    setIsActive(false);
    setIsResting(false);
  };

  const startWorkout = () => {
    setCurrentPhase('calentamiento');
    setCurrentExercise(0);
  };

  // Helpers de nombres / descripciones.
  const getCurrentExerciseName = () => {
    if (isResting) return '⏸️ Descanso';
    if (currentPhase === 'calentamiento') return warmup[currentExercise].name;
    if (currentPhase === 'circuito') return mainCircuit[currentExercise].name;
    if (currentPhase === 'enfriamiento') return cooldown[currentExercise].name;
    return '';
  };

  const getCurrentExerciseDesc = () => {
    if (isResting) return 'Recupera el aliento, mantén el abdomen contraído';
    if (currentPhase === 'circuito') return mainCircuit[currentExercise].desc;
    return '';
  };

  // Calcula porcentaje de avance total.
  const getProgress = () => {
  const totalExercises = warmup.length + (mainCircuit.length * rounds) + cooldown.length;
    let completed = 0;
    if (currentPhase === 'calentamiento') {
      completed = currentExercise;
    } else if (currentPhase === 'circuito') {
      completed = warmup.length + ((currentRound - 1) * mainCircuit.length) + currentExercise;
    } else if (currentPhase === 'enfriamiento') {
      completed = warmup.length + (mainCircuit.length * rounds) + currentExercise;
    } else if (currentPhase === 'completado') {
      completed = totalExercises;
    }
    return Math.round((completed / totalExercises) * 100);
  };

  const getWeeklyProgress = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return completedWorkouts.filter(date => new Date(date) > weekAgo).length;
  };

  // Vista QR.
  if (showQR) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Escanea para acceder</h2>
          <div className="bg-white p-4 rounded-xl inline-block mb-4">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://claude.ai/share/rutina-quema-grasa"
              alt="QR Code"
              className="w-64 h-64"
            />
          </div>
          <p className="text-gray-600 mb-6">Guarda este QR para acceder rápidamente a tu rutina</p>
          <button
            onClick={() => setShowQR(false)}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600"
          >
            Volver a la app
          </button>
        </div>
      </div>
    );
  }

  // Pantalla inicial.
  if (currentPhase === 'inicio') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">🔥 Quema Grasa Abdominal</h1>
              <p className="text-sm text-gray-500">Usuario: {user?.nombre}{isGuest ? ' (Invitado)' : ''}</p>
              <p className="text-gray-600">Rutina de pie - Sin equipo necesario</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-orange-50 rounded-xl p-4 text-center">
                <Calendar className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{getWeeklyProgress()}/4</p>
                <p className="text-sm text-gray-600">Esta semana</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 text-center">
                <TrendingUp className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">20-25</p>
                <p className="text-sm text-gray-600">Minutos</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 text-center">
                <Award className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{completedWorkouts.length}</p>
                <p className="text-sm text-gray-600">Completadas</p>
              </div>
            </div>
            <div className="space-y-4 mb-8">
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2">📋 Estructura</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Calentamiento: {Math.round(warmup.reduce((a, b) => a + (b.duration || 0), 0) / 60)} minutos</li>
                  <li>• Circuito principal: {rounds} rondas ({workSeconds}s trabajo + {restSeconds}s descanso)</li>
                  <li>• Enfriamiento: {Math.round(cooldown.reduce((a, b) => a + (b.duration || 0), 0) / 60)} minutos</li>
                </ul>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2">💡 Consejos clave</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Mantén el abdomen contraído siempre</li>
                  <li>• Movimientos controlados, no por inercia</li>
                  <li>• Combina con déficit calórico ligero</li>
                  <li>• Realiza 4 veces por semana</li>
                </ul>
              </div>
            </div>
            <div className="grid gap-4 mb-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-600">Selecciona rutina</label>
                <select
                  value={selectedRoutineId || ''}
                  onChange={e => setSelectedRoutineId(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {routines.map(r => (
                    <option key={r.id} value={r.id}>{r.name}{r.isDefault ? ' (default)' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-600">Resumen</label>
                <div className="text-xs bg-orange-50 rounded-lg p-3 border border-orange-200">
                  {selectedRoutine ? (
                    <p className="text-gray-700">Rounds: {rounds} · Trabajo: {workSeconds}s · Descanso: {restSeconds}s</p>
                  ) : <p className="text-gray-400">Sin rutina seleccionada</p>}
                </div>
              </div>
            </div>
            <button
              onClick={startWorkout}
              disabled={!selectedRoutine}
              className="w-full disabled:opacity-50 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg mb-4"
            >
              {selectedRoutine ? 'Comenzar Rutina' : 'Selecciona una rutina'}
            </button>
            <button
              onClick={() => setShowQR(true)}
              className="w-full border-2 border-orange-500 text-orange-500 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all"
            >
              Generar QR de acceso rápido
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla final.
  if (currentPhase === 'completado') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Rutina Completada! 🎉</h2>
          <p className="text-xs text-gray-500 mb-4">Usuario: {user?.nombre}{isGuest ? ' (Invitado)' : ''}</p>
          <p className="text-gray-600 mb-2">Has quemado calorías y fortalecido tu core</p>
          <p className="text-sm text-gray-500 mb-8">Recuerda: La constancia es la clave del éxito</p>
          <div className="bg-green-50 rounded-xl p-4 mb-6">
            <p className="text-2xl font-bold text-green-600">{completedWorkouts.length}</p>
            <p className="text-sm text-gray-600">Entrenamientos completados</p>
          </div>
          <button
            onClick={resetWorkout}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Vista principal durante ejercicio.
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 uppercase font-semibold">
                {currentPhase === 'calentamiento' ? '🔥 Calentamiento' : currentPhase === 'circuito' ? `💪 Circuito - Ronda ${currentRound}/${rounds}` : '🧘 Enfriamiento'}
              </p>
              <h2 className="text-2xl font-bold text-gray-800">{getCurrentExerciseName()}</h2>
              <p className="text-xs text-gray-500">{user?.nombre}{isGuest ? ' (Invitado)' : ''}</p>
              {getCurrentExerciseDesc() && <p className="text-sm text-gray-600 mt-1">{getCurrentExerciseDesc()}</p>}
            </div>
          </div>
          <div className="mb-6">
            <div className="bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 text-right">{getProgress()}% completado</p>
          </div>
          <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-8 mb-6 text-center">
            <div className="text-7xl font-bold text-gray-800 mb-2">{timeLeft > 0 ? timeLeft : '00'}</div>
            <p className="text-gray-600 font-semibold">{timeLeft > 0 ? 'segundos' : isActive ? 'Preparado...' : 'Presiona Iniciar'}</p>
          </div>
          <div className="flex gap-4">
            {!isActive && timeLeft === 0 ? (
              <button
                onClick={startExercise}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-6 h-6" />
                Iniciar
              </button>
            ) : (
              <button
                onClick={togglePause}
                className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
              >
                {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                {isActive ? 'Pausar' : 'Continuar'}
              </button>
            )}
            <button
              onClick={resetWorkout}
              className="bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-bold hover:bg-gray-300 transition-all flex items-center justify-center"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </div>
        {currentPhase === 'circuito' && (
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-3">Ejercicios del circuito:</h3>
            <div className="space-y-2">
              {mainCircuit.map((ex, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg flex items-center gap-3 ${idx === currentExercise && !isResting ? 'bg-orange-50 border-2 border-orange-500' : 'bg-gray-50'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${idx === currentExercise && !isResting ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-600'}`}
                  >
                    {idx + 1}
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{ex.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FitnessApp;
