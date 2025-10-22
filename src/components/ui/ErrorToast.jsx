import { toast } from "react-toastify";

export default function ErrorToast(message) {
  toast.error(message, {
    style: {
      backgroundColor: "var(--color-error)",
      color: "var(--white)",
      border: "1px solid var(--white)",
      borderRadius: "12px",
      fontFamily: "Bebas Neue, sans-serif",
      letterSpacing: "0.5px",
    },
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
  });
}
