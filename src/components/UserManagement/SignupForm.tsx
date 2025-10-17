import { useState } from 'react';
import { useAuth } from '../../context/AuthContextBase';

export default function SignupForm({ onSuccess, onCancel }: { onSuccess?: () => void; onCancel?: () => void }) {
    const { signup } = useAuth();
    const [name, setName] = useState('');
    const [rut, setRut] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isDoctor, setIsDoctor] = useState(false);
    const [isChiefDoctor, setIsChiefDoctor] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleRutChange = (value: string) => {
        let clean = value.replace(/[^0-9kK]/g, '');
        if (clean.length > 1) {
          let body = clean.slice(0, -1)
          const dv = clean.slice(-1)
          body = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          clean = body + "-" + dv
        }
    
        setRut(clean);
    };

    const setRutToNumeric = (formattedRut: string): string => {
        if (!formattedRut) return "";
      
        let clean = formattedRut.replace(/[.-]/g, "");
        clean = clean.toUpperCase();
        clean = clean.trim();
      
        return clean;
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        setIsLoading(true);
        try {
            await signup(name, setRutToNumeric(rut), email, password, { isDoctor, isChiefDoctor });
            onSuccess?.();
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { detail?: string } } };
            setError(axiosErr.response?.data?.detail || 'Error al registrarse');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
            )}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
                <input type="text" value={rut} onChange={(e) => handleRutChange(e.target.value)} required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                maxLength={12}
                placeholder="12.345.678-9" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Rol</label>
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
            <div className="flex space-x-2">
                {onCancel && (
                    <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 bg-gray-300 border border-gray-300 text-gray-500 rounded-md hover:bg-gray-100 transition-colors">Cancelar</button>
                )}
                <button type="submit" disabled={isLoading} className="flex-1 disabled:bg-blue-400 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    {isLoading ? 'Creando...' : 'Registrarse'}
                </button>
            </div>
        </form>
    );
}


