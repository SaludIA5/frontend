import { createContext, useContext } from 'react';

export type AuthUser = {
    id: number;
    email: string;
    isDoctor: boolean;
    isChiefDoctor: boolean;
};

export type AuthContextValue = {
    isAuthenticated: boolean;
    user: AuthUser | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    signup: (
        name: string,
        rut: string,
        email: string,
        password: string,
        opts?: { isDoctor?: boolean; isChiefDoctor?: boolean }
    ) => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}


