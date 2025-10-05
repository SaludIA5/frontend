import LoginButton from './LoginButton';

const LoginModal = () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Iniciar sesión para continuar
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Por favor, inicie sesión para acceder al sistema.
                    </p>
                    <LoginButton />
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
