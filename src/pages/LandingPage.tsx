import { useState } from 'react';
import Header from '../components/Header';
import PatientManager from '../components/PatientManager/PatientManager';
import NewPatientRegister from '../components/UserManagement/NewPatientRegister';
import ProcessEpisode from '../components/ProcessEpisode';
import type { Episode } from '../types/episode';
import EditPatientModal from '../components/PatientManager/EditPatientModal';
import type { Patient } from '../types/patient';
import CreateEpisodeModal from '../components/PatientManager/CreateEpisodeModal';
import type { Doctor } from '../types/doctor';

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [processModalOpen, setProcessModalOpen] = useState(false);
  const [editPatientModalOpen, setEditPatientModalOpen] = useState(false);
  const [createEpisodeModalOpen, setCreateEpisodeModalOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [patientForNewEpisode, setPatientForNewEpisode] = useState<number | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const handleModalToggle = () => setModalOpen(!modalOpen);

  const handleProcessEpisode = (episode?: Episode) => {
    setProcessModalOpen(!processModalOpen);
    setSelectedEpisode(episode || null);
  };

  const handleEditPatientModalToggle = (patient?: Patient) => {
    setPatientToEdit(patient || null);
    setEditPatientModalOpen(!editPatientModalOpen);
  };

  const handleCreateEpisodeModalToggle = (patientId?: number) => {
    setPatientForNewEpisode(patientId || null);
    setCreateEpisodeModalOpen(!createEpisodeModalOpen);
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

      <PatientManager
        onProcessEpisode={handleProcessEpisode}
        onEditPatient={handleEditPatientModalToggle}
        onOpenCreateEpisodeModal={handleCreateEpisodeModalToggle}
        setDoctors={setDoctors}
      />

      <NewPatientRegister
        isOpen={modalOpen}
        onClose={handleModalToggle}
      />

      <ProcessEpisode
        isOpen={processModalOpen}
        onClose={handleProcessEpisode}
        episode={selectedEpisode}
      />

      <EditPatientModal
        isOpen={editPatientModalOpen}
        onClose={() => handleEditPatientModalToggle()}
        patient={patientToEdit}
      />

      <CreateEpisodeModal
        isOpen={createEpisodeModalOpen}
        onClose={() => handleCreateEpisodeModalToggle()}
        patientId={patientForNewEpisode}
        doctors={doctors}
      />
    </>
  );
}