import React from 'react';
import ReactDOM from 'react-dom/client';
import Board from './App.tsx'; // Importa o componente do Jogo da Velha
import './index.css';      // Importa os estilos globais

// Encontra o elemento 'root' no HTML e renderiza a aplicação dentro dele
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Board />
  </React.StrictMode>
);