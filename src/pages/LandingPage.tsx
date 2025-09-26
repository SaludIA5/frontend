import { useState } from 'react'
import PatientManager from '../components/PatientManager'
import type { User } from '../types/user'
import { mockPatients } from '../types/user'
import NewPatientRegister from '../components/NewPatientRegister'

export default function LandingPage() {
    const [patients, setPatients] = useState<User[]>(mockPatients)
    const [modalOpen, setModalOpen] = useState(false)

    const handleAddUser = (newPatient: User) => {
        setPatients([...patients, newPatient])
        setModalOpen(false)
    }

    const handleModalToggle = () => {
        setModalOpen(!modalOpen)
    }

    return (
        <>
            <button onClick={handleModalToggle}>Agregar Paciente</button>
            <PatientManager patients={patients} />
            <NewPatientRegister isOpen={modalOpen} onClose={handleModalToggle} onSave={handleAddUser}/>
        </>
    )
}