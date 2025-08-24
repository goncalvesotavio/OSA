import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css'
import { BrowserRouter } from 'react-router-dom';
import { CarrinhoProvider } from './context/CarrinhoContext';
import { AlertProvider } from './context/AlertContext'; // Importe o novo provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AlertProvider> 
        <CarrinhoProvider>
          <App />
        </CarrinhoProvider>
      </AlertProvider>
    </BrowserRouter>
  </React.StrictMode>
);
