import { AlertTriangle, X } from "lucide-react";
import Button from "./Button";

function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title = "Confirmar acción",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger" // danger | warning | info
}) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: "text-error",
          confirmButton: "bg-red-600 hover:bg-red-700"
        };
      case "warning":
        return {
          icon: "text-warning",
          confirmButton: "bg-yellow-600 hover:bg-yellow-700"
        };
      default:
        return {
          icon: "text-blue-500",
          confirmButton: "bg-blue-600 hover:bg-blue-700"
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-black/90 border border-gray/20 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">

        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray hover:text-white transition-colors hover:cursor-pointer hover:text-white hover:border-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`flex-shrink-0 ${styles.icon}`}>
          </div>

          {/* Text content */}
          <div className=" flex-1 pt-1">
            <div className="flex items-baseline gap-2 mb-2">
            <AlertTriangle className="h-6 w-6" />
            <h3 className="font-semibold text-white">
              {title}
            </h3>
            </div>

            <div className="text-sm leading-relaxed whitespace-pre-line">
              {message}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray/20">
          <Button
            variant="outline"
            color="gray"
            onClick={onCancel}
            width="full"
            className="hover:text-white hover:border-white"
          >
            {cancelText}
          </Button>

          <Button
            onClick={onConfirm}
            width="full"
            color='error'
            className={`text-white ${styles.confirmButton} transition-colors`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;