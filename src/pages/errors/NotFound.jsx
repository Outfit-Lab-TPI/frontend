import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className=" flex items-center justify-center">
      <div className="mt-32 max-w-md w-full shadow-lg rounded-lg p-8 text-center">
        <div className="mb-6">
          <p className="text-3xl font-medieum text-white mb-2">
            Página no encontrada
          </p>
          <p className="text-gray">
            La página que buscas no existe o ha sido movida.
          </p>
        </div>
        <button onClick={handleGoHome} className="w-full py-2 px-4 rounded-sm">
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default NotFound;
