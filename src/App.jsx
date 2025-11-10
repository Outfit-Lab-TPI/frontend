import { BrowserRouter } from "react-router-dom";
import AppContent from "./AppContent";
import ErrorBoundary from "./pages/errors/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import MercadoPagoWrapper from "./components/MercadoPagoWrapper"; 

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MercadoPagoWrapper>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </MercadoPagoWrapper>
      </AuthProvider>
    </ErrorBoundary>
  );
}
