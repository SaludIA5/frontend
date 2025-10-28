import { useState } from 'react';
import Header from '../components/Header';
import PatientManager from '../components/PatientManager/PatientManager';
import NewPatientRegister from '../components/UserManagement/NewPatientRegister';
import ProcessPatient from '../components/ProcessPatient';

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [processModalOpen, setProcessModalOpen] = useState(false);
  const [selectedPatientRut, setSelectedPatientRut] = useState<string>('');

  const handleModalToggle = () => setModalOpen(!modalOpen);
  const handleProcessModalToggle = (patientRut?: string) => {
    setProcessModalOpen(!processModalOpen);
    setSelectedPatientRut(patientRut || '');
  };


  return (
    <>
      <Header />
      <div className='flex justify-center my-3 pt-6 text-3xl font-bold'>
        <p>Pacientes Activos</p>
      </div>
      <div className="flex justify-end my-4 mr-15 px-6">
        <button
          onClick={handleModalToggle}
          className="rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
        >
          Agregar Paciente
        </button>
      </div>

      <PatientManager onProcessPatient={handleProcessModalToggle} />

      <NewPatientRegister
        isOpen={modalOpen}
        onClose={handleModalToggle}
      />

      <ProcessPatient
        isOpen={processModalOpen}
        onClose={() => handleProcessModalToggle()}
        patientRut={selectedPatientRut}
      />
    </>
  );
}