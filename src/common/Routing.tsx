import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.tsx';
import PatientManager from '../components/PatientManager.tsx';
import ProcessPatient from '../components/ProcessPatient.tsx';


function Routing(){
    return (
        <>
        <Routes>   
            <Route path="/" element={<LandingPage />} />
            <Route path='/patientsList' element={<PatientManager />} />
            <Route path='/editPatient' element={<ProcessPatient />} />
        </Routes>
        </>

    )
}

export default Routing