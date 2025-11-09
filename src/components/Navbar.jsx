import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Dumbbell, ListPlus, Home, User } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';

// Barra de navegación principal
export default function Navbar() {
  const { user, isGuest } = useAuth();
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2 font-bold text-orange-600">
          <Dumbbell className="w-5 h-5" />
          <span>FitnessApp</span>
        </Link>
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `flex items-center gap-1 text-sm font-medium ${isActive ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
          >
            <Home className="w-4 h-4" /> Inicio
          </NavLink>
          <NavLink
            to="/rutinas"
            className={({ isActive }) => `flex items-center gap-1 text-sm font-medium ${isActive ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
          >
            <ListPlus className="w-4 h-4" /> Rutinas
          </NavLink>
        </div>
        <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-500" />
            <div className="text-xs leading-tight">
              <p className="font-semibold text-gray-700">{user?.nombre || 'Invitado'}</p>
              <p className="text-gray-500">{isGuest ? 'Modo invitado' : 'Usuario activo'}</p>
            </div>
        </div>
      </div>
    </nav>
  );
}
