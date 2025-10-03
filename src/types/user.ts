import type { BloodPressure, Procedures } from "./patientInfo"

export interface User {
    firstName: string
    lastName: string
    secondLastname?: string
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
    { firstName: "Juan", lastName: "Pérez", secondLastname: "González", isEligible: true, rut: "12.345.678-9", sex: "M", age: "30" },
    { firstName: "María", lastName: "Rodríguez", secondLastname: "López", isEligible: false, rut: "9.876.543-2", sex: "F", age: "25" },
    { firstName: "Carlos", lastName: "Soto", secondLastname: "Ramírez", isEligible: true, rut: "15.234.567-8", sex: "M", age: "40" },
    { firstName: "Ana", lastName: "Torres", isEligible: true, rut: "7.654.321-K", sex: "F", age: "28" },
    { firstName: "Pedro", lastName: "Muñoz", secondLastname: "Aravena", isEligible: false, rut: "18.765.432-1", sex: "M", age: "35" },
    { firstName: "Sofía", lastName: "Hernández", secondLastname: "Vega", isEligible: true, rut: "11.223.344-5", sex: "F", age: "22" },
    { firstName: "Andrés", lastName: "Fuentes", isEligible: false, rut: "6.543.210-9", sex: "M", age: "33" },
    { firstName: "Camila", lastName: "Navarro", secondLastname: "Pizarro", isEligible: true, rut: "13.579.246-8", sex: "F", age: "27" },
    { firstName: "Felipe", lastName: "Morales", isEligible: true, rut: "22.334.455-6", sex: "M", age: "31" },
    { firstName: "Valentina", lastName: "Reyes", isEligible: false, rut: "10.987.654-3", sex: "F", age: "29" },
    { firstName: "Diego", lastName: "Castillo", secondLastname: "Figueroa", isEligible: true, rut: "14.321.987-0", sex: "M", age: "36" },
    { firstName: "Constanza", lastName: "Silva", isEligible: false, rut: "8.765.432-1", sex: "F", age: "24" },
    { firstName: "José", lastName: "Cárdenas", secondLastname: "Ortiz", isEligible: true, rut: "19.876.543-2", sex: "M", age: "38" },
    { firstName: "Francisca", lastName: "Rojas", secondLastname: "Martínez", isEligible: true, rut: "16.543.219-K", sex: "F", age: "26" },
    { firstName: "Matías", lastName: "Vargas", secondLastname: "Contreras", isEligible: false, rut: "21.234.567-8", sex: "ND", age: "32" },
]