import { useState } from 'react';
import Header from '../components/Header';
import PatientManager from '../components/PatientManager';
import NewPatientRegister from '../components/NewPatientRegister';

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalToggle = () => setModalOpen(!modalOpen);


  return (
    <>
      <Header onLogout={() => { /* manejar logout */ }} />
      
      <div className="flex justify-center my-4">
        <button
          onClick={handleModalToggle}
          className="rounded-xl bg-blue-600 px-6 py-2 text-white shadow hover:bg-blue-700"
        >
          Agregar Paciente
        </button>
      </div>

      <PatientManager />

      <NewPatientRegister
        isOpen={modalOpen}
        onClose={handleModalToggle}
      />
    </>
  );
}