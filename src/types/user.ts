import type { BloodPressure, Procedures } from "./patientInfo"

export interface User {
    name: string
    rut: string
    sex: string
    isEligible: boolean
    examPerformed?: string | number | readonly string[] | undefined
    oxygenSaturation?: string | number | readonly string[] | undefined
    heartRate?: string | number | readonly string[] | undefined
    bloodPressure?: BloodPressure
    cardiacHistory?: boolean
    diabetesHistory?: boolean
    hypertensionHistory?: boolean
    proceduresDone?: Procedures
    age: string
}

export const mockPatients: User[] = [
    { name: "Juan Pérez González", isEligible: true, rut: "12.345.678-9", sex: "M", age: "30" },
    { name: "María Rodríguez López", isEligible: false, rut: "9.876.543-2", sex: "F", age: "25" },
    { name: "Carlos Soto Ramírez", isEligible: true, rut: "15.234.567-8", sex: "M", age: "40" },
    { name: "Ana Torres", isEligible: true, rut: "7.654.321-K", sex: "F", age: "28" },
    { name: "Pedro Muñoz Aravena", isEligible: false, rut: "18.765.432-1", sex: "M", age: "35" },
    { name: "Sofía Hernández Vega", isEligible: true, rut: "11.223.344-5", sex: "F", age: "22" },
    { name: "Andrés Fuentes", isEligible: false, rut: "6.543.210-9", sex: "M", age: "33" },
    { name: "Camila Navarro Pizarro", isEligible: true, rut: "13.579.246-8", sex: "F", age: "27" },
    { name: "Felipe Morales", isEligible: true, rut: "22.334.455-6", sex: "M", age: "31" },
    { name: "Valentina Reyes", isEligible: false, rut: "10.987.654-3", sex: "F", age: "29" },
    { name: "Diego Castillo Figueroa", isEligible: true, rut: "14.321.987-0", sex: "M", age: "36" },
    { name: "Constanza Silva", isEligible: false, rut: "8.765.432-1", sex: "F", age: "24" },
    { name: "José Cárdenas Ortiz", isEligible: true, rut: "19.876.543-2", sex: "M", age: "38" },
    { name: "Francisca Rojas Martínez", isEligible: true, rut: "16.543.219-K", sex: "F", age: "26" },
    { name: "Matías Vargas Contreras", isEligible: false, rut: "21.234.567-8", sex: "ND", age: "32" },
]