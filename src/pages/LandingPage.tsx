import { useState } from 'react'
import PatientList from '../components/PatientList'
import type { User } from '../types/user'
import NewPatientRegister from '../components/NewPatientRegister'

export default function LandingPage() {
    const [patients, setPatients] = useState<User[]>([])
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
            <PatientList patients={patients} />
            <button onClick={handleModalToggle}>Agregar Paciente</button>
            <NewPatientRegister isOpen={modalOpen} onClose={handleModalToggle} onSave={handleAddUser}/>
        </>
    )
}