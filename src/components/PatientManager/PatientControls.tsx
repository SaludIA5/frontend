type Props = {
    search: string
    setSearch: (v: string) => void
    filterEligible: "all" | "yes" | "no"
    setFilterEligible: (v: "all" | "yes" | "no") => void
    filterGender: "all" | "M" | "F" | "ND"
    setFilterGender: (v: "all" | "M" | "F" | "ND") => void
    sortBy: "name" | "rut"
    setSortBy: (v: "name" | "rut") => void
}

export default function PatientControls({
    search,
    setSearch,
    filterEligible,
    setFilterEligible,
    filterGender,
    setFilterGender,
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
                className="rounded border p-2 w-64"
            />

            <select
                value={filterEligible}
                onChange={(e) => setFilterEligible(e.target.value as "all" | "yes" | "no")}
                className="rounded border p-2"
            >
                <option value="all">Todos</option>
                <option value="yes">Solo aplica</option>
                <option value="no">No aplica</option>
            </select>

            <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value as "all" | "M" | "F" | "ND")}
                className="rounded border p-2"
            >
                <option value="all">Todos</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="ND">No descrito</option>
            </select>

            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "rut")}
                className="rounded border p-2"
            >
                <option value="name">Ordenar por Nombre</option>
                <option value="rut">Ordenar por RUT</option>
            </select>
        </div>
    )
}