import { X, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import Button from "./Button";

function PaymentStatusDialog({ isOpen, status, message, onClose }) {
  if (!isOpen) return null;

  const getStyles = () => {
    switch (status) {
      case "approved":
        return {
          icon: <CheckCircle className="h-10 w-10 text-green-400" />,
          titleColor: "text-green-400",
        };
      case "pending":
        return {
          icon: <Clock className="h-10 w-10 text-yellow-400" />,
          titleColor: "text-yellow-400",
        };
      default:
        return {
          icon: <AlertTriangle className="h-10 w-10 text-red-500" />,
          titleColor: "text-red-500",
        };
    }
  };

  const styles = getStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-black/90 border border-gray/40 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 text-center">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray hover:text-white transition-colors hover:cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon */}
        <div className="mb-4 flex justify-center">{styles.icon}</div>

        {/* Title */}
        <h3 className={`font-semibold text-xl mb-2 ${styles.titleColor}`}>
          {status === "approved"
            ? "Pago aprobado"
            : status === "pending"
            ? "Pago pendiente"
            : "Pago rechazado"}
        </h3>

        {/* Message */}
        <p className="text-sm text-gray-300 whitespace-pre-line">{message}</p>

        {/* Button */}
        <div className="mt-6 pt-4 border-t border-gray/20 hover:cursor-pointer">
           <Button 
                variant="outline" 
                color="gray" 
                width="full"
                onClick={onClose}
                className="hover:text-white hover:border-white">
                    Cerrar
            </Button>
        </div>
      </div>
    </div>
  );
}

export default PaymentStatusDialog;
