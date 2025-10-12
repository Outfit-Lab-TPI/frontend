import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ThemedToast() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      theme="colored"
      toastStyle={{
        backgroundColor: "var(--primary)",
        color: "var(--white)",
        border: "1px solid var(--secondary)",
        borderRadius: "12px",
        fontFamily: "Bebas Neue, sans-serif",
        letterSpacing: "0.5px",
      }}
      progressStyle={{
        background: "var(--tertiary)",
      }}
    />
  );
}
