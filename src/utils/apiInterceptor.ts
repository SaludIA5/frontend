import type { AxiosError } from 'axios';

export function handleUnauthorized(error: unknown, logout: () => void) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
        logout();
    }
    throw error;
}

