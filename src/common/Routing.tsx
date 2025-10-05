import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.tsx';
import AuthGuard from '../components/AuthGuard.tsx';

function Routing() {
    return (
        <AuthGuard>
            <Routes>
                <Route path="/" element={<LandingPage />} />
            </Routes>
        </AuthGuard>
    )
}

export default Routing