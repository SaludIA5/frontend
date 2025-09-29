import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import Routing from './common/Routing.tsx'

import { PatientsProvider } from './context/PatientContext.tsx'; // BORRAR CUANDO HAYA BACKEND

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PatientsProvider>
        <Routing />
      </PatientsProvider>
    </BrowserRouter>
  </StrictMode>,
)
