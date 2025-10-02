import { useState } from 'react';
import Header from '../components/Header';
import PatientManager from '../components/PatientManager/PatientManager';
import NewPatientRegister from '../components/NewPatientRegister';
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
      <Header onLogout={() => { }} />

      <div className="flex justify-center my-4">
        <button
          onClick={handleModalToggle}
          className="rounded-xl bg-blue-600 px-6 py-2 text-white shadow hover:bg-blue-700"
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