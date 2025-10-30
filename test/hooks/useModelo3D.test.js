import { renderHook, act, waitFor } from "@testing-library/react";
import { useModelo3D } from "../../src/hooks/useModelo3D";
import { modelo3DService } from "../../src/services/modelo3DService";
import { vi } from "vitest";
import { desc } from "framer-motion/client";

// Mock del servicio
vi.mock("../../src/services/modelo3DService", () => ({
  modelo3DService: {
    generarModelo: vi.fn(),
  },
}));

describe("useModelo3D", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("generarModelo3D", () => {

        it("debe generar un modelo 3D exitosamente", async () => {
            const mockUrl = "https://modelo.glb";
            modelo3DService.generarModelo.mockResolvedValueOnce({ modeloUrl: mockUrl });

            const { result } = renderHook(() => useModelo3D());

            await act(async () => {
                await result.current.generarModelo3D("https://outfit.jpg");
            });

            expect(modelo3DService.generarModelo).toHaveBeenCalledWith(
                "https://outfit.jpg"
            );
            expect(result.current.modeloUrl).toBe(mockUrl);
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe(null);
        });

        it("debe mostrar error si conjuntoUrl es null", async () => {
            const { result } = renderHook(() => useModelo3D());

            await act(async () => {
                await result.current.generarModelo3D(null);
            });

            expect(result.current.error).toBe("URL del conjunto es requerida");
            expect(modelo3DService.generarModelo).not.toHaveBeenCalled();
        });

        it("debe manejar error si el servicio falla", async () => {
            modelo3DService.generarModelo.mockRejectedValueOnce(new Error("error"));

            const { result } = renderHook(() => useModelo3D());

            await act(async () => {
                await result.current.generarModelo3D("https://outfit.jpg");
            });

            expect(result.current.error).toBe("error");
            expect(result.current.modeloUrl).toBe(null);
            expect(result.current.loading).toBe(false);
        });

        it('isGenerating debe ser true mientras genera el modelo', async () => {
            const mockUrl = 'https://modelo.glb'

            modelo3DService.generarModelo.mockImplementation(
                // Simula delay
                () => new Promise(resolve => setTimeout(() => resolve({ modeloUrl: mockUrl }), 1000))
            )

            const { result } = renderHook(() => useModelo3D())

            result.current.generarModelo3D('https://outfit.jpg')

            await waitFor(() => expect(result.current.isGenerating).toBe(true))
            // Espera a que termine la generacion
            await waitFor(() => expect(result.current.isGenerating).toBe(false), { timeout: 1500 })

            expect(modelo3DService.generarModelo).toHaveBeenCalledTimes(1)
            expect(result.current.modeloUrl).toBe(mockUrl)
        })

    });
    
    describe("limpiarModelo", () => {
        it("limpiarModelo debe limpiar modeloUrl y error", async () => {
            const { result } = renderHook(() => useModelo3D());

            await act(() => {
            // Seteamos manualmente un estado previo
            result.current.limpiarModelo();
            });

            expect(result.current.modeloUrl).toBe(null);
            expect(result.current.error).toBe(null);
        });
    });
});
