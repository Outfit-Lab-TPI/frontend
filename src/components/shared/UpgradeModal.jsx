import { X } from "lucide-react";
import Button from "./Button.jsx";

function UpgradeModal({ open, onClose, info }) {
  if (!open) return null;

  const { message, limitType, currentUsage, maxAllowed } = info || {};
  const hasUsage = currentUsage !== undefined && currentUsage !== null &&
                   maxAllowed !== undefined && maxAllowed !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop estilo payment dialog */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-black/90 border border-primary/30 rounded-xl shadow-xl max-w-md w-full mx-4 p-6 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray hover:text-white transition-colors hover:cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-2">
          <h3 className="font-semibold text-xl text-white">Límite alcanzado</h3>
        </div>

        <p className="text-sm text-gray-300 mb-3">
          {"Actualiza tu plan y desbloquea más funciones y límites"}
        </p>

        {hasUsage && (
          <div className="text-sm text-gray/80 mb-6">
            Uso: {currentUsage} / {maxAllowed} {limitType || "acciones"}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button variant="outline" color="gray" width="full" onClick={onClose}>
            Cerrar
          </Button>
          <Button
            width="full"
            onClick={() => window.location.assign("/suscripcion")}
          >
            Actualizar plan
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UpgradeModal;
