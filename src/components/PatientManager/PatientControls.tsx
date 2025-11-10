type Props = {
    search: string
    setSearch: (v: string) => void
    filterEligible: "all" | "PERTINENTE" | "NO PERTINENTE"
    setFilterEligible: (v: "all" | "PERTINENTE" | "NO PERTINENTE") => void
    sortBy: "name" | "rut"
    setSortBy: (v: "name" | "rut") => void
}

export default function PatientControls({
    search,
    setSearch,
    filterEligible,
    setFilterEligible,
    sortBy,
    setSortBy
}: Props) {
    return (
        <div className="flex flex-wrap justify-center gap-4 mb-6">
            <input
                type="text"
                placeholder="Buscar paciente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg bg-white p-2 w-64"
            />

            <select
                value={filterEligible}
                onChange={(e) => setFilterEligible(e.target.value as "all" | "PERTINENTE" | "NO PERTINENTE")}
                className="rounded-lg bg-white p-2"
            >
                <option value="all">Todos</option>
                <option value="PERTINENTE">Solo aplica</option>
                <option value="NO PERTINENTE">No aplica</option>
            </select>

            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "rut")}
                className="rounded-lg bg-white p-2"
            >
                <option value="name">Ordenar por Nombre</option>
                <option value="rut">Ordenar por RUT</option>
            </select>
        </div>
    )
}