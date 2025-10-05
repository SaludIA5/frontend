import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

type AuthUser = {
    id: number;
    email: string;
    isDoctor: boolean;
    isChiefDoctor: boolean;
};

type AuthContextValue = {
    isAuthenticated: boolean;
    user: AuthUser | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    signup: (name: string, rut: string, email: string, password: string, opts?: { isDoctor?: boolean; isChiefDoctor?: boolean }) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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
                const payload = JSON.parse(atob(token.split('.')[1] || '')) as any;
                setUser({
                    id: Number(payload.sub),
                    email: payload.email,
                    isDoctor: Boolean(payload.is_doctor),
                    isChiefDoctor: Boolean(payload.is_chief_doctor),
                });
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
        const res = await axios.post(url, { email, password });
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

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}


