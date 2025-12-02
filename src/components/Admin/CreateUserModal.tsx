import { useState } from "react";
import axios from "axios";
import { validateRUT } from "../../utils/rutValidation";
import { validateEmail } from "../../utils/mailValidation";

interface Props {
    handleClose: () => void;
    onSuccess?: () => void;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

export default function CreateUserModal({ handleClose, onSuccess }: Props) {
    const [name, setName] = useState('');
    const [rut, setRut] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isDoctor, setIsDoctor] = useState(false);
    const [isChiefDoctor, setIsChiefDoctor] = useState(false);
    const [turn, setTurn] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const isRutValid = validateRUT(rut) || !rut;

    const isMailValid = validateEmail(email) || !email;

    const handleRutChange = (value: string) => {
        let clean = value.replace(/[^0-9kK]/g, '');
        if (clean.length > 1) {
            let body = clean.slice(0, -1);
            const dv = clean.slice(-1);
            body = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            clean = body + "-" + dv;
        }
        setRut(clean);
    };

    const setRutToNumeric = (formattedRut: string): string => {
        if (!formattedRut) return "";
        let clean = formattedRut.replace(/[.-]/g, "");
        clean = clean.toUpperCase();
        clean = clean.trim();
        return clean;
    };

    const resetForm = () => {
        setName('');
        setRut('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setIsDoctor(false);
        setIsChiefDoctor(false);
        setTurn("");
        setError(null);
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setError(null);

        if (!isMailValid) {
            setError('Por favor ingresar un email válido');
            return;
        }

        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (!isRutValid) {
            setError('Por favor ingresar RUT válido');
            return;
        }

        if (!rut) {
            setError('Por favor ingresar un RUT');
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/users', {
                name,
                rut: setRutToNumeric(rut),
                email,
                password,
                turn,
                is_doctor: Boolean(isDoctor) || false,
                is_chief_doctor: Boolean(isChiefDoctor) || false,
            });
            resetForm();
            handleClose();
            onSuccess?.();
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { detail?: string | string[] } } };
            const detail = axiosErr.response?.data?.detail;
            setError(Array.isArray(detail) ? detail.join(', ') : (detail || 'Error al crear usuario'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
            <div className="bg-white rounded-2xl p-6 w-96 shadow-lg text-black max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Crear Usuario</h2>

                {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">{error}</div>
                )}

                <form id="create-user-form" onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
                        <input
                            type="text"
                            value={rut}
                            onChange={(e) => handleRutChange(e.target.value)}
                            required
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${isRutValid
                                ? "border-gray-300 focus:border-black focus:ring-blue-500"
                                : "border-red-500 focus:border-red-500 focus:ring-red-300"
                            }`}
                            maxLength={12}
                            placeholder="12.345.678-9"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${isMailValid
                                ? "border-gray-300 focus:border-black focus:ring-blue-500"
                                : "border-red-500 focus:border-red-500 focus:ring-red-300"
                            }`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={8}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={turn}
                            onChange={(e) => setTurn(e.target.value)}
                            required
                        >
                            <option value="" disabled>Seleccione Turno</option>
                            <option value="A">Turno A</option>
                            <option value="B">Turno B</option>
                            <option value="C">Turno C</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isDoctor}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setIsDoctor(checked);
                                        if (checked) setIsChiefDoctor(false);
                                    }}
                                    className="mr-2"
                                />
                                <span className="text-sm text-gray-700">Médico</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isChiefDoctor}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setIsChiefDoctor(checked);
                                        if (checked) setIsDoctor(false);
                                    }}
                                    className="mr-2"
                                />
                                <span className="text-sm text-gray-700">Médico Jefe</span>
                            </label>
                        </div>
                    </div>
                </form>

                <div className="flex justify-center space-x-3 mt-6">
                    <button
                        type="button"
                        className="rounded-xl bg-gray-300 px-4 py-2 hover:bg-gray-400"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="create-user-form"
                        className="rounded-xl px-4 py-2 text-white bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] disabled:bg-blue-400"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creando...' : 'Crear Usuario'}
                    </button>
                </div>
            </div>
        </div>
    );
}

