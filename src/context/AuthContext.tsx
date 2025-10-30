import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContextBase';
import type { AuthContextValue, AuthUser } from './AuthContextBase';

type JwtPayload = {
    sub?: string | number;
    email?: string;
    is_doctor?: unknown;
    is_chief_doctor?: unknown;
};

const STORAGE_KEY = 'auth_token';
const baseURL: string | undefined = import.meta.env.VITE_BACKEND_URL;

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (baseURL) {
            axios.defaults.baseURL = baseURL;
        }
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setToken(saved);
        }
        setInitialized(true);
    }, []);

    useEffect(() => {
        if (token) {
            localStorage.setItem(STORAGE_KEY, token);
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            try {
                const base64 = token.split('.')[1] || '';
                const decoded = base64 ? atob(base64) : '{}';
                const payload = JSON.parse(decoded) as unknown as JwtPayload;
                const idValue = typeof payload.sub === 'string' || typeof payload.sub === 'number' ? Number(payload.sub) : NaN;
                const emailValue = typeof payload.email === 'string' ? payload.email : '';
                if (!Number.isNaN(idValue) && emailValue) {
                    setUser({
                        id: idValue,
                        email: emailValue,
                        isDoctor: Boolean(payload.is_doctor),
                        isChiefDoctor: Boolean(payload.is_chief_doctor),
                    });
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            }
        } else {
            localStorage.removeItem(STORAGE_KEY);
            delete axios.defaults.headers.common.Authorization;
            setUser(null);
        }
    }, [token]);

    const login = async (email: string, password: string) => {
        const url = baseURL ? `${baseURL}/auth/login` : '/auth/login';
        const res = await axios.post(url, { email, password }, { withCredentials: true });
        setToken(res.data.access_token);
    };

    const signup = async (name: string, rut: string, email: string, password: string, opts?: { isDoctor?: boolean; isChiefDoctor?: boolean }) => {
        const url = baseURL ? `${baseURL}/users` : '/users';
        await axios.post(url, {
            name,
            rut,
            email,
            password,
            is_doctor: Boolean(opts?.isDoctor) || false,
            is_chief_doctor: Boolean(opts?.isChiefDoctor) || false,
        });
    };

    const logout = () => setToken(null);

    const value = useMemo<AuthContextValue>(() => ({
        isAuthenticated: Boolean(token),
        user,
        token,
        login,
        logout,
        signup,
    }), [token, user]);

    if (!initialized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Cargando...</div>
            </div>
        );
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


