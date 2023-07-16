import React from 'react';
import { createRoot } from 'react-dom/client';
import Level1 from './components/Level1/Level1';

const rootElement = document.getElementById('root');

createRoot(rootElement).render(
  <React.StrictMode>
    <Level1 />
  </React.StrictMode>
);
