Resumen de cambios realizados

Manejo de límites y mensajes

Se agregó lógica de límite (403 upgradeRequired) a combinaciones, favoritos y modelos 3D:
Servicios: src/services/combinacionService.js, src/services/favoritosService.js, src/services/modelo3DService.js detectan 403 con upgradeRequired y propagan metadata (limitType, currentUsage, maxAllowed).
Hooks: src/hooks/useCombinacion.jsx y src/hooks/useFavoritos.jsx capturan esos errores; guardan estado y muestran feedback (alerta en favoritos/modelo 3D; mensaje legible en combinaciones).
Botón de descarga 3D: src/components/shared/DownloadButton.jsx usa modelo3DService (con token), y si hay límite muestra alerta.
Modal de límite: src/components/shared/UpgradeModal.jsx se rediseñó al estilo del modal de pago; mensaje fijo “Actualiza tu plan y desbloquea más funciones y límites”; oculta el texto de error HTTP y muestra uso sólo si hay datos.
Favoritos/combinaciones toggle

Se corrigió el uso de toggleCombinacionFavorita en src/components/Panel.jsx para no pasar un boolean como callback (evita TypeError).
Página de suscripción dinámica

Backend endpoints usados: GET /mp/subscriptions y GET /mp/user-subscription (con Authorization y opcional email).
Servicio: src/services/subscriptionService.js se ajustó a las respuestas reales, con logs de depuración.
Hook: src/hooks/useSubscription.jsx
Normaliza planes desde la API (name, price, description, feature1-4, max_garments, has_analytics, has_advanced_reports, planType/planCode).
Filtra por rol (USER vs BRAND) priorizando el segmento del planCode actual.
Logs de depuración para planes y suscripción actual.
Página: src/pages/Subscription.jsx
El bloque “Plan Actual” con contadores solo se muestra para rol USER.
BRAND ve solo las cards de planes de marca (cuando el backend los devuelve) y el plan actual se marca en la card.
Cards renderizan dinámicamente desde /mp/subscriptions; sin arrays hardcodeados.
Botón de suscripción deshabilitado si es el plan actual; usa planCode/price/currency del backend para iniciar checkout.
Misceláneos

Se agregó logging detallado en servicios de suscripción para revisar datos del backend.
Se evitó mostrar planes antiguos si falla la carga (useSubscription limpia planes en errores).
El filtrado ya no mezcla planes de usuario en BRAND; se basa en planType o planCode (brand-*).
Comportamiento esperado

Al exceder límites (favoritos/combinaciones/modelo 3D), aparece el modal de límite (o alerta en botones puntuales) con CTA a /suscripcion.
En /suscripcion:
USER: ve plan actual + contadores + cards de usuario.
BRAND: no ve el bloque superior; ve solo los planes de marca devueltos por la API y se marca “Tu plan” en la card correspondiente.
Descarga 3D pasa por apiClient para enviar token y respeta límites.