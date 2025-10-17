import { useState } from 'react';
import Header from '../components/Header';
import PatientManager from '../components/PatientManager/PatientManager';
import NewPatientRegister from '../components/UserManagement/NewPatientRegister';
import ProcessPatient from '../components/ProcessPatient';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate()
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

      <div className="flex justify-between my-4 mx-6 px-6">
        <button
          onClick={()=> navigate("/metrics")}
          className="rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
        >
          Ver episodios anteriores
        </button>
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