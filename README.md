# Variables de entorno (Vite)

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `VITE_API_BASE_URL` | URL pública para el backend (`/api`) | `https://outfitlab.com.ar/api` |
| `VITE_MP_PUBLIC_KEY` | Public key de Mercado Pago | `APP_USR-xxxx` |

Estas variables deben existir al momento del build (`npm run build` / Docker). En GitHub Actions se definen como Secrets y se pasan como `build-args` (ver `.github/workflows/ci.yml`).
