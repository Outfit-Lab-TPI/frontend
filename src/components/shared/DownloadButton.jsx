import { ArrowDownToLine } from "lucide-react";
export default function DownloadButton ({fileUrl}){
    const handleDownload = async (e) => {
        e.stopPropagation();

        try {
            const response = await fetch(fileUrl, {
            mode: "cors"
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `combinacion_${fileUrl}.png`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
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