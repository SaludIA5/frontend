import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.tsx';
import PatientList from '../components/PatientList.tsx';
import ProcessPatient from '../components/ProcessPatient.tsx';


function Routing(){
    return (
        <>
        <Routes>   
            <Route path="/" element={<LandingPage />} />
            <Route path='/patientsList' element={<PatientList />} />
            <Route path='/editPatient' element={<ProcessPatient />} />
        </Routes>
        </>

    )
}

export default Routing