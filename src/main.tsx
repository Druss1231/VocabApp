import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import Page600 from './pages/Page600.tsx'; // create these pages
import Page700 from './pages/Page700.tsx';
import Page800 from './pages/Page800.tsx';
import Page900 from './pages/Page900.tsx';
import Meaning from './pages/Meaning.tsx';
import React from 'react';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/600" element={<Page600 />} />
        <Route path="/700" element={<Page700 />} />
        <Route path="/800" element={<Page800 />} />
        <Route path="/900" element={<Page900 />} />
        <Route path="/meaning" element={<Meaning />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
