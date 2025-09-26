import { useState } from 'react'
import NewPatientRegister from '../components/NewPatientRegister'

export default function LandingPage() {
    const [modalOpen, setModalOpen] = useState(false)

    const handleModalToggle = () => {
        setModalOpen(!modalOpen)
    }

    return (
        <>
            {/* <PatientList /> */}
            <button onClick={handleModalToggle}>Agregar Paciente</button>
            <NewPatientRegister isOpen={modalOpen} onClose={handleModalToggle}/>
        </>
    )
}