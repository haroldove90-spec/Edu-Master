import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('EduMaster: Iniciando aplicación...');

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("EduMaster Crítico: No se encontró el elemento #root en el DOM.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('EduMaster: Aplicación montada exitosamente.');
  } catch (error) {
    console.error('EduMaster: Error al montar la aplicación:', error);
  }
}
