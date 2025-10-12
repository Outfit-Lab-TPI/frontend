import { BrowserRouter } from "react-router-dom";
import AppContent from "./AppContent";
import ErrorBoundary from "./pages/errors/ErrorBoundary";
import { AuthProvider } from "./hooks/auth/useAuth";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
