export interface User {
    firstName: string
    lastName: string
    secondLastname?: string
    isEligible: boolean
    rut: string // 12.345.678-9
    sex: string // "M","F" o "ND"
}

export const mockPatients: User[] = [
    { firstName: "Juan", lastName: "Pérez", secondLastname: "González", isEligible: true, rut: "12.345.678-9", sex: "M" },
    { firstName: "María", lastName: "Rodríguez", secondLastname: "López", isEligible: false, rut: "9.876.543-2", sex: "F" },
    { firstName: "Carlos", lastName: "Soto", secondLastname: "Ramírez", isEligible: true, rut: "15.234.567-8", sex: "M" },
    { firstName: "Ana", lastName: "Torres", isEligible: true, rut: "7.654.321-K", sex: "F" },
    { firstName: "Pedro", lastName: "Muñoz", secondLastname: "Aravena", isEligible: false, rut: "18.765.432-1", sex: "M" },
    { firstName: "Sofía", lastName: "Hernández", secondLastname: "Vega", isEligible: true, rut: "11.223.344-5", sex: "F" },
    { firstName: "Andrés", lastName: "Fuentes", isEligible: false, rut: "6.543.210-9", sex: "M" },
    { firstName: "Camila", lastName: "Navarro", secondLastname: "Pizarro", isEligible: true, rut: "13.579.246-8", sex: "F" },
    { firstName: "Felipe", lastName: "Morales", isEligible: true, rut: "22.334.455-6", sex: "M" },
    { firstName: "Valentina", lastName: "Reyes", isEligible: false, rut: "10.987.654-3", sex: "F" },
    { firstName: "Diego", lastName: "Castillo", secondLastname: "Figueroa", isEligible: true, rut: "14.321.987-0", sex: "M" },
    { firstName: "Constanza", lastName: "Silva", isEligible: false, rut: "8.765.432-1", sex: "F" },
    { firstName: "José", lastName: "Cárdenas", secondLastname: "Ortiz", isEligible: true, rut: "19.876.543-2", sex: "M" },
    { firstName: "Francisca", lastName: "Rojas", secondLastname: "Martínez", isEligible: true, rut: "16.543.219-K", sex: "F" },
    { firstName: "Matías", lastName: "Vargas", secondLastname: "Contreras", isEligible: false, rut: "21.234.567-8", sex: "ND" },
  ]