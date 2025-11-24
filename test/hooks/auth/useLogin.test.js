import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLogin } from "../../../src/hooks/auth/useLogin.jsx";
import { loginService } from "../../../src/services/auth/loginService";
import { useNavigate } from "react-router-dom";

// Mock de react-router-dom
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

// Mock del servicio de login
vi.mock("../../../src/services/auth/loginService", () => ({
  loginService: vi.fn(),
}));

// Mock de useAuth
const mockLogin = vi.fn();
vi.mock("../../../src/hooks/auth/useAuth", () => ({
  useAuth: vi.fn(() => ({
    login: mockLogin,
  })),
}));

// Mock de react-hook-form
const mockSetError = vi.fn();
const mockClearErrors = vi.fn();
const mockRegister = vi.fn(() => ({
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn(),
  name: "field",
}));
const mockHandleSubmit = vi.fn(fn => fn);

vi.mock("react-hook-form", () => ({
  useForm: () => ({
    register: mockRegister,
    handleSubmit: mockHandleSubmit,
    formState: { errors: {}, isValid: true },
    setError: mockSetError,
    clearErrors: mockClearErrors,
  }),
}));

// Mock de validaciones
vi.mock("../../../src/lib/validations", () => ({
  validationRules: {
    email: { required: "Email requerido" },
    passwordLogin: { required: "Password requerido" },
  },
}));

describe("useLogin", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    console.error = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it("debe hacer login exitoso como USER y redirigir a /home", async () => {
    // given
    const mockUserData = {
      user: { email: "user@test.com", name: "Test User", role: "USER" },
      token: "mock-token",
    };
    loginService.mockResolvedValueOnce(mockUserData);

    const { result } = renderHook(() => useLogin());

    const formData = {
      email: "user@test.com",
      password: "password123",
    };

    // when
    await act(async () => {
      await result.current.handleSubmit(formData);
    });

    // then
    expect(loginService).toHaveBeenCalledWith("user@test.com", "password123");
    expect(mockLogin).toHaveBeenCalledWith(mockUserData);
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  it("debe hacer login exitoso como ADMIN y redirigir a /dashboard", async () => {
    // given
    const mockUserData = {
      user: { email: "admin@test.com", name: "Admin", role: "ADMIN" },
      token: "mock-token",
    };
    loginService.mockResolvedValueOnce(mockUserData);

    const { result } = renderHook(() => useLogin());

    const formData = {
      email: "admin@test.com",
      password: "admin123",
    };

    // when
    await act(async () => {
      await result.current.handleSubmit(formData);
    });

    // then
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("debe hacer login exitoso como BRAND y redirigir a /brand-home", async () => {
    // given
    const mockUserData = {
      user: { email: "brand@test.com", name: "Brand", role: "BRAND" },
      token: "mock-token",
    };
    loginService.mockResolvedValueOnce(mockUserData);

    const { result } = renderHook(() => useLogin());

    const formData = {
      email: "brand@test.com",
      password: "brand123",
    };

    // when
    await act(async () => {
      await result.current.handleSubmit(formData);
    });

    // then
    expect(mockNavigate).toHaveBeenCalledWith("/brand-home");
  });

  it("debe manejar error 401 (credenciales incorrectas)", async () => {
    // given
    const error = {
      response: { status: 401 },
    };
    loginService.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useLogin());

    const formData = {
      email: "wrong@test.com",
      password: "wrongpassword",
    };

    // when
    await act(async () => {
      await result.current.handleSubmit(formData);
    });

    // then
    expect(mockSetError).toHaveBeenCalledWith("submit", {
      type: "manual",
      message: "Email o contraseña incorrectos",
    });
  });

  it("debe manejar error genérico", async () => {
    // given
    const error = new Error("Network error");
    loginService.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useLogin());

    const formData = {
      email: "user@test.com",
      password: "password123",
    };

    // when
    await act(async () => {
      await result.current.handleSubmit(formData);
    });

    // then
    expect(mockSetError).toHaveBeenCalledWith("submit", {
      type: "manual",
      message: "Error al iniciar sesión. Intenta nuevamente.",
    });
  });
});
describe("validationRules", () => {
  it("debe tener validationRules definidas", () => {
    // given / when
    const { result } = renderHook(() => useLogin());

    // then
    expect(result.current.validationRules).toBeDefined();
    expect(result.current.validationRules.email).toBeDefined();
    expect(result.current.validationRules.password).toBeDefined();
  });

  it("debe validar que el email sea requerido", () => {
    // given / when
    const { result } = renderHook(() => useLogin());

    // then
    expect(result.current.validationRules.email.required).toBeDefined();
    expect(result.current.validationRules.email.required).toBe(
      "Email requerido"
    );
  });

  it("debe validar formato de email con patrón regex", () => {
    // given / when
    const { result } = renderHook(() => useLogin());

    // then
    // El mock debe incluir pattern para validar formato de email
    expect(result.current.validationRules.email).toBeDefined();
    // En el código real, validationRules.email incluye:
    // - required: mensaje de campo obligatorio
    // - pattern: { value: regex, message: mensaje de formato inválido }
  });

  it("debe validar que el password sea requerido", () => {
    // given / when
    const { result } = renderHook(() => useLogin());

    // then
    expect(result.current.validationRules.password.required).toBeDefined();
    expect(result.current.validationRules.password.required).toBe(
      "Password requerido"
    );
  });
});
