import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContextBase';
import type { AuthContextValue, AuthUser } from './AuthContextBase';

const STORAGE_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const baseURL: string | undefined = import.meta.env.VITE_BACKEND_URL;

function decodeJwt(token: string): { sub?: number; email?: string } | null {
    try {
        const part = token.split('.')[1];
        if (!part) return null;
        const decoded = atob(part);
        const obj = JSON.parse(decoded) as { sub?: string | number; email?: string };
        const subNum = typeof obj.sub === 'number' ? obj.sub : (typeof obj.sub === 'string' ? Number(obj.sub) : undefined);
        return { sub: subNum, email: obj.email };
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (baseURL) {
            axios.defaults.baseURL = baseURL;
        }
        const savedToken = localStorage.getItem(STORAGE_KEY);
        const savedUser = localStorage.getItem(USER_KEY);
        if (savedToken) setToken(savedToken);
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser) as AuthUser;
                setUser(parsed);
            } catch {
                setUser(null);
            }
        }
        setInitialized(true);
    }, []);

    useEffect(() => {
        if (token) {
            localStorage.setItem(STORAGE_KEY, token);
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            if (!user) {
                const payload = decodeJwt(token);
                if (payload?.sub && payload.email) {
                    setUser({ id: payload.sub, email: payload.email, isDoctor: false, isChiefDoctor: false, isAdmin: false });
                }
            }
        } else {
            localStorage.removeItem(STORAGE_KEY);
            delete axios.defaults.headers.common.Authorization;
        }
    }, [token]);

    const login = async (email: string, password: string) => {
        const url = baseURL ? `${baseURL}/auth/login` : '/auth/login';
        const res = await axios.post(url, { email, password }, {
            withCredentials: true,
            headers: {
                Authorization: undefined
            }
        });
        const data = res.data as {
            access_token: string;
            token_type: string;
            is_doctor: boolean;
            is_chief_doctor: boolean;
            is_admin: boolean;
            user_id: number;
        };
        setToken(data.access_token);
        const nextUser: AuthUser = {
            id: data.user_id,
            isDoctor: Boolean(data.is_doctor),
            isChiefDoctor: Boolean(data.is_chief_doctor),
            isAdmin: Boolean(data.is_admin),
            email,
        };
        setUser(nextUser);
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    };

    const signup = async (name: string, rut: string, email: string, password: string, turn: string, opts?: { isDoctor?: boolean; isChiefDoctor?: boolean }) => {
        const url = baseURL ? `${baseURL}/users` : '/users';
        await axios.post(url, {
            name,
            rut,
            email,
            password,
            turn,
            is_doctor: Boolean(opts?.isDoctor) || false,
            is_chief_doctor: Boolean(opts?.isChiefDoctor) || false,
        });
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(USER_KEY);
        delete axios.defaults.headers.common.Authorization;
    };

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


