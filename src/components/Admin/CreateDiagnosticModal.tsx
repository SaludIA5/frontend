import { useState } from "react"
import type { Diagnostic } from "../../types/patientInfo"
import axios from "axios";

interface Props {
    handleClose: () => void
}

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

export default function CreateDiagnosticModal({ handleClose } : Props){
    const [diagnostic, setDiagnostic] = useState<Diagnostic>({
        id: -1,
        cie_code: "",
        description: ""
    });

    const resetForm = () => {
        setDiagnostic({
            id: -1,
            cie_code: "",
            description: ""
        })
    }

    const handleSubmit = async () => {
        try {
            await api.post('/diagnostics', {
                cie_code: diagnostic.cie_code,
                description: diagnostic.description.toUpperCase()
            });
      
            resetForm();
            handleClose();
          } catch (error) {
            console.error("Error adding patient with episode:", error);
          } finally{
            window.location.reload();
          }
    }
    return(
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
        <div className="bg-white rounded-2xl p-6 w-96 shadow-lg text-black">
          <h2 className="text-xl font-bold mb-4">Agregar Diagnóstico</h2>
          <input
            type="text"
            placeholder="Código CIE"
            className="w-full mb-3 rounded border border-gray-300 p-2"
            value={diagnostic?.cie_code}
            onChange={(e) =>
              setDiagnostic({ ...diagnostic, cie_code: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Descripción"
            className="w-full mb-3 rounded border border-gray-300 p-2"
            value={diagnostic?.description}
            onChange={(e) =>
              setDiagnostic({ ...diagnostic, description: e.target.value })
            }
          />
  
          <div className="flex justify-center space-x-3">
            <button
              className="rounded-xl bg-gray-300 px-4 py-2 hover:bg-gray-400"
              onClick={handleClose}
            >
              Cancelar
            </button>
            <button
              className="rounded-xl px-4 py-2 text-white"
              onClick={handleSubmit}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    )
}