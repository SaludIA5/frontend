import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import axios from "axios";
import CreateUserModal from "../components/Admin/CreateUserModal";
import EditUserModal from "../components/Admin/EditUserModal";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

interface User {
    id: number;
    name: string;
    rut: string;
    email: string;
    turn: string;
    is_doctor: boolean;
    is_chief_doctor: boolean;
    is_admin?: boolean;
}

interface PaginationMeta {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
}

export default function AdminUserManagerPage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = async (page: number = 1) => {
        setLoading(true);
        try {
            const res = await api.get(`/users?page=${page}&page_size=10`);
            let usersData: User[] = [];
            if (Array.isArray(res.data)) {
                usersData = res.data;
            } else if (res.data?.items && Array.isArray(res.data.items)) {
                usersData = res.data.items;
                if (res.data.meta) {
                    setPaginationMeta(res.data.meta);
                }
            }
            setUsers(usersData.sort((a, b) => a.id - b.id));
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        fetchUsers(currentPage);
    };

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
        fetchUsers(currentPage);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            return;
        }
        try {
            await api.delete(`/users/${id}`);
            fetchUsers(currentPage);
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Error al eliminar usuario");
        }
    };

    const formatRut = (rut: string): string => {
        if (!rut) return "";
        const clean = rut.replace(/[.-]/g, '');
        if (clean.length <= 1) return clean;
        const body = clean.slice(0, -1);
        const dv = clean.slice(-1);
        const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return formattedBody + "-" + dv;
    };

    return (
        <>
            <Header />
            <div className="px-10 py-6">
                <div className="flex items-center flex-start">
                    <button
                        onClick={() => navigate("/admin")}
                        className="rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
                    >
                        Volver a Panel de Administrador
                    </button>
                </div>
                <h2 className="text-2xl font-bold w-full text-center py-4">Usuarios</h2>
                <div className="flex items-center justify-end mb-4">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
                    >
                        Crear Usuario
                    </button>
                </div>
                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Cargando...</p>
                    </div>
                ) : (
                    <ul className="px-4 md:px-8 lg:px-16">
                        <div className="grid grid-cols-[0.5fr_2.5fr_1.5fr_2.5fr_1fr_1fr_1fr_2fr] gap-4 px-4 py-2 font-semibold">
                            <p>ID</p>
                            <p>Nombre</p>
                            <p>RUT</p>
                            <p>Email</p>
                            <p>Turno</p>
                            <p>Médico</p>
                            <p>Médico Jefe</p>
                            <p>Acciones</p>
                        </div>
                        {users.map((user) => {
                            return (
                                <li
                                    key={user.id}
                                    className="my-1.5 border border-gray-200 rounded-2xl shadow-sm bg-white transition-all duration-200 hover:shadow-md p-4"
                                >
                                    <div className="grid grid-cols-[0.5fr_2.5fr_1.5fr_2.5fr_1fr_1fr_1fr_2fr] gap-4 items-center overflow-x-auto">
                                        <p>{user.id}</p>
                                        <p className="text-ellipsis whitespace-nowrap overflow-hidden">{user.name}</p>
                                        <p>{user.is_admin ? "-" : formatRut(user.rut)}</p>
                                        <p className="text-ellipsis whitespace-nowrap overflow-hidden">{user.email}</p>
                                        <p>{user.is_admin ? "-" : (user.turn || "-")}</p>
                                        <p>{user.is_doctor ? "Sí" : "No"}</p>
                                        <p>{user.is_chief_doctor ? "Sí" : "No"}</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="rounded-xl px-4 py-2 text-white shadow bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-sm"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="rounded-xl px-4 py-2 text-white shadow bg-red-500 hover:bg-red-600 text-sm"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
                {paginationMeta && paginationMeta.total_pages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6 mb-4">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="rounded-xl px-4 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Anterior
                        </button>
                        <span className="px-4 py-2 text-gray-700">
                            Página {paginationMeta.page} de {paginationMeta.total_pages} ({paginationMeta.total_items} usuarios)
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(paginationMeta.total_pages, prev + 1))}
                            disabled={currentPage === paginationMeta.total_pages}
                            className="rounded-xl px-4 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
                {isCreateModalOpen && <CreateUserModal handleClose={() => setIsCreateModalOpen(false)} onSuccess={handleCreateSuccess} />}
                {isEditModalOpen && selectedUser && (
                    <EditUserModal
                        user={selectedUser}
                        handleClose={() => {
                            setIsEditModalOpen(false);
                            setSelectedUser(null);
                        }}
                        onSuccess={handleEditSuccess}
                    />
                )}
            </div>
        </>
    );
}

