import { modelo3DService } from "@/services/modelo3DService";
import { ArrowDownToLine } from "lucide-react";
export default function DownloadButton ({fileUrl}){
    const handleDownload = async (e) => {
        e.stopPropagation();

        try {
            const extension = fileUrl.split(".").pop().toLowerCase();
            let blob;
            if (extension === 'glb') {
                blob = await modelo3DService.downloadModel(fileUrl);
            } else {
                const response = await fetch(fileUrl, { mode: "cors" });
                if(!response.ok){
                    throw new Error("No se pudo descargar el archivo.")
                }
                blob = await response.blob();
            }

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            if(extension === 'glb' || extension === 'hdr') {
                link.download = fileUrl.split("/").pop(); // el nombre original del archivo
            }else {
                link.download = `combinacion_${Date.now()}.${extension}`;   
                 document.body.appendChild(link);
            }

            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            if (error.upgradeRequired) {
                const detail = error.currentUsage !== undefined && error.maxAllowed !== undefined
                  ? ` (${error.currentUsage}/${error.maxAllowed})`
                  : '';
                alert(`${error.message || 'Has alcanzado el límite de modelos 3D'}${detail}. Actualiza tu plan para continuar.`);
                return;
            }
            console.error("Error descargando imagen:", error);
        }
    };

    return (
        <button
        
                className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
            onClick={handleDownload}
            style={{
                color: "#fff",
                fontSize: '.8rem'
            }}
            >
                <ArrowDownToLine />
            </button>
    )
} 
