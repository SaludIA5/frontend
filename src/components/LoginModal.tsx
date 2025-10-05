import { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const LoginModal = () => {
    const [showSignup, setShowSignup] = useState(false);
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {showSignup ? 'Crear cuenta' : 'Iniciar sesión para continuar'}
                    </h2>
                    {showSignup ? (
                        <SignupForm onSuccess={() => setShowSignup(false)} onCancel={() => setShowSignup(false)} />
                    ) : (
                        <>
                            <p className="text-gray-600 mb-6">Por favor, inicie sesión para acceder al sistema.</p>
                            <LoginForm />
                            <div className="mt-4 text-sm text-gray-500">
                                ¿No tienes cuenta?{' '}
                                <button type="button" onClick={() => setShowSignup(true)} className="text-blue-600 hover:text-blue-700 underline border-0 outline-none focus:outline-none focus:ring-0 appearance-none bg-transparent p-0">
                                    Regístrate aquí
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
