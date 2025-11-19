import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.tsx';
import AuthGuard from '../components/UserManagement/AuthGuard.tsx';
import MetricsPage from '../pages/MetricsPage.tsx';
import DetailedMetricsPage from '../pages/DetailedMetricsPage.tsx';
import AdminPage from '../pages/AdminPage.tsx';
import AdminEpisodeManagerPage from '../pages/AdminEpisodeManagerPage.tsx';

function Routing() {
    return (
        <AuthGuard>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path='metrics' element={<MetricsPage /> } />
                <Route path='metrics/:id' element={<DetailedMetricsPage /> } />
                <Route path='admin' element={<AdminPage />} />
                <Route path='admin/episodes' element={<AdminEpisodeManagerPage />} />
            </Routes>
        </AuthGuard>
    )
}

export default Routing