export default function DownloadButton ({fileUrl}){
    return (
        <button
            onClick={() => {
                const link = document.createElement("a");
                link.href = fileUrl;
                link.download = fileUrl;
                link.click();
            }}
            >
                Descargar archivo
            </button>
    )
} 