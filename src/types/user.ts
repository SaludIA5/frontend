import type { Episode } from "./episode";

export interface Patient {
    name: string
    rut: string
    sex: string
    age: string
    episodes?: Episode[]
    currentEpisode: Episode
}

export const mockPatients: Patient[] = [
    { name: "Juan Pérez González", rut: "12.345.678-9", sex: "M", age: "30", currentEpisode: {isEligible: false} },
    { name: "María Rodríguez López", rut: "9.876.543-2", sex: "F", age: "25", currentEpisode: {isEligible: false} },
    { name: "Carlos Soto Ramírez", rut: "15.234.567-8", sex: "M", age: "40", currentEpisode: {isEligible: false} },
    { name: "Ana Torres", rut: "7.654.321-K", sex: "F", age: "28", currentEpisode: {isEligible: false} },
    { name: "Pedro Muñoz Aravena", rut: "18.765.432-1", sex: "M", age: "35", currentEpisode: {isEligible: false} },
    { name: "Sofía Hernández Vega", rut: "11.223.344-5", sex: "F", age: "22", currentEpisode: {isEligible: false} },
    { name: "Andrés Fuentes", rut: "6.543.210-9", sex: "M", age: "33", currentEpisode: {isEligible: false} },
    { name: "Camila Navarro Pizarro", rut: "13.579.246-8", sex: "F", age: "27", currentEpisode: {isEligible: false} },
    { name: "Felipe Morales", rut: "22.334.455-6", sex: "M", age: "31", currentEpisode: {isEligible: false} },
    { name: "Valentina Reyes", rut: "10.987.654-3", sex: "F", age: "29", currentEpisode: {isEligible: false} },
    { name: "Diego Castillo Figueroa", rut: "14.321.987-0", sex: "M", age: "36", currentEpisode: {isEligible: false} },
    { name: "Constanza Silva", rut: "8.765.432-1", sex: "F", age: "24", currentEpisode: {isEligible: false} },
    { name: "José Cárdenas Ortiz", rut: "19.876.543-2", sex: "M", age: "38", currentEpisode: {isEligible: false} },
    { name: "Francisca Rojas Martínez", rut: "16.543.219-K", sex: "F", age: "26", currentEpisode: {isEligible: false} },
    { name: "Matías Vargas Contreras", rut: "21.234.567-8", sex: "ND", age: "32", currentEpisode: {isEligible: false} },
]