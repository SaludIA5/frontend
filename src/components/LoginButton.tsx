import { useState } from 'react';
import LoginModal from './LoginModal';

const LoginButton = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
                Iniciar sesión
            </button>
            {open && <LoginModal />}
        </>
    );
};

export default LoginButton;
