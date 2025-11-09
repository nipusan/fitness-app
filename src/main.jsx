import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';
import './index.css';

// Punto de entrada principal. Renderiza la aplicación en el contenedor root.
const rootElement = document.getElementById('root');
createRoot(rootElement).render(
	<AuthProvider>
		<App />
	</AuthProvider>
);
