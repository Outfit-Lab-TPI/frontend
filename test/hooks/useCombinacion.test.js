import { renderHook, act, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useCombinacion } from "../../src/hooks/useCombinacion/";
import { combinacionService } from "../../src/services/combinacionService";

// mock the service
vi.mock("../../src/services/combinacionService", () => ({
  combinacionService: {
    combinarPrendas: vi.fn(),
  },
}));

describe("useCombinacion", () => {
    const prendaSuperior = { imagenUrl: "url-superior.jpg" };
    const prendaInferior = { imagenUrl: "url-inferior.jpg" };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("combinarPrendas", () => {
        it("debe settear un error si el tipo de avatar no es booleano", async () => {
            const { result } = renderHook(() => useCombinacion());

            await act(async () => {
            await result.current.combinarPrendas(
                "string",
                prendaSuperior,
                prendaInferior
            );
            });

            expect(result.current.error).toBe(
            "El tipo de avatar debe ser especificado"
            );
            expect(result.current.loading).toBe(false);
        });

        it("debe settear un error si no recibe prendaSuperior", async () => {
            const { result } = renderHook(() => useCombinacion());

            await act(async () => {
            await result.current.combinarPrendas(true, null, prendaInferior);
            });

            expect(result.current.error).toBe("Debe seleccionar una prenda superior");
        });

        it("debe settear un error si no recibe prendaInferior", async () => {
            const { result } = renderHook(() => useCombinacion());

            await act(async () => {
            await result.current.combinarPrendas(true, prendaSuperior, null, 'default');
            });

            expect(result.current.error).toBe("Debe seleccionar una prenda inferior");
        });

        it("debe auto-determinar avatarType basado en isMan cuando es true", async () => {
            const mockImageUrl = "result.jpg";
            combinacionService.combinarPrendas.mockResolvedValueOnce(mockImageUrl);

            const { result } = renderHook(() => useCombinacion());

            await act(async () => {
            await result.current.combinarPrendas(true, prendaSuperior, prendaInferior);
            });

            expect(combinacionService.combinarPrendas).toHaveBeenCalledWith(
            "url-superior.jpg",
            "url-inferior.jpg",
            true,
            'MAN'
            );
        });

        it("debe auto-determinar avatarType basado en isMan cuando es false", async () => {
            const mockImageUrl = "result.jpg";
            combinacionService.combinarPrendas.mockResolvedValueOnce(mockImageUrl);

            const { result } = renderHook(() => useCombinacion());

            await act(async () => {
            await result.current.combinarPrendas(false, prendaSuperior, prendaInferior);
            });

            expect(combinacionService.combinarPrendas).toHaveBeenCalledWith(
            "url-superior.jpg",
            "url-inferior.jpg",
            false,
            'WOMAN'
            );
        });

        it("debe llamar a combinacionService y settear resultado en caso de éxito", async () => {
            const mockImageUrl = "result.jpg";
            combinacionService.combinarPrendas.mockResolvedValueOnce(mockImageUrl);

            const { result } = renderHook(() => useCombinacion());

            await act(async () => {
            const response = await result.current.combinarPrendas(
                true,
                prendaSuperior,
                prendaInferior
            );
            expect(response).toEqual({ imageUrl: mockImageUrl });
            });

            await waitFor(() => expect(result.current.loading).toBe(false));
            expect(result.current.resultado).toEqual({ imageUrl: mockImageUrl });
            expect(result.current.error).toBe(null);
            expect(combinacionService.combinarPrendas).toHaveBeenCalledWith(
            "url-superior.jpg",
            "url-inferior.jpg",
            true,
            'MAN'
            );
        });

        it("debe manejar errores de la API", async () => {
            combinacionService.combinarPrendas.mockRejectedValueOnce(
            new Error("Network error")
            );

            const { result } = renderHook(() => useCombinacion());

            await act(async () => {
            await result.current.combinarPrendas(
                true,
                prendaSuperior,
                prendaInferior
            );
            });

            await waitFor(() => expect(result.current.loading).toBe(false));
            expect(result.current.error).toBe("Network error");
            expect(result.current.resultado).toBe(null);
        });
    });

describe("limpiarResultado", () => {
  it("debe limpiar resultado y error", async () => {
    combinacionService.combinarPrendas.mockRejectedValueOnce(new Error('error'))

    const { result } = renderHook(() => useCombinacion())

    // Provocar un error real
    await act(async () => {
      await result.current.combinarPrendas(true, null, null)
    })

    expect(result.current.error).toBe('Debe seleccionar una prenda superior') // o el error que surja

    // Ahora limpiar
    await act(() => {
      result.current.limpiarResultado()
    })

    expect(result.current.error).toBe(null)
    expect(result.current.resultado).toBe(null)
  })
})
});
