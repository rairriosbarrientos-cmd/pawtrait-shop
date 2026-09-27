# Pawtrait — retratos de mascotas automáticos (EE.UU.)

El cliente sube una foto → elige estilo → ve una vista previa con marca de agua (gratis) → paga con Stripe → Printful imprime, enmarca y envía. **Nadie tiene que hacer nada a mano.**

Sin llaves, la tienda funciona en **modo demo** (retratos de muestra, sin cobro) para que puedas verla publicada desde el día uno.

## Cómo funciona

| Paso | Quién lo hace |
| --- | --- |
| Generar el retrato | fal.ai (modelo FLUX Kontext) vía `/api/generar` + `/api/estado` |
| Vista previa con marca de agua | La tienda (`sharp`), guardada en Netlify Blobs |
| Cobro | Stripe Checkout (`/api/checkout`) |
| Imprimir, enmarcar y enviar | Printful, automático desde el webhook de Stripe (`/api/stripe-webhook`) |
| Descarga digital | Enlace firmado en la página de gracias (`/api/pedido`) |

La imagen en alta resolución solo se entrega con enlace firmado (a Printful y al cliente que pagó). Cada visitante tiene máximo 8 vistas previas al día para cuidar tu gasto de IA.

## Puesta en marcha

1. **Netlify:** conecta este repo (build `npm run build`, carpeta `dist`; ya viene en `netlify.toml`).
2. **Variables de entorno** en Netlify → Site configuration → Environment variables:

| Variable | De dónde sale |
| --- | --- |
| `IMAGE_SIGNING_SECRET` | Cualquier texto largo al azar (obligatoria). |
| `FAL_KEY` | fal.ai → Dashboard → Keys. Sin ella: modo demo. |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys (empieza con `sk_live_` o `sk_test_`). |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks → Add endpoint `https://TU-SITIO/api/stripe-webhook`, evento `checkout.session.completed`. Copia el "Signing secret" (`whsec_...`). |
| `PRINTFUL_API_KEY` | Printful → Settings → API → token privado. |
| `PRINTFUL_VARIANT_12X16`, `PRINTFUL_VARIANT_18X24` | Corre `PRINTFUL_API_KEY=... npm run printful:variants` y copia los IDs del marco negro. |
| `PRINTFUL_AUTO_CONFIRM` | Opcional. `false` = los pedidos quedan en borrador en Printful para revisarlos antes de producir (recomendado las primeras semanas). |

3. Haz un pedido de prueba con la tarjeta de Stripe `4242 4242 4242 4242` usando llaves `sk_test_`.

## Números (aprox.)

| Producto | Precio | Costo Printful aprox. | Margen aprox. |
| --- | --- | --- | --- |
| Descarga digital | $29 | ~$0.05 de IA | ~$28 |
| Enmarcado 12×16″ | $89 | ~$35–45 con envío | ~$40 |
| Enmarcado 18×24″ | $129 | ~$55–70 con envío | ~$55 |

Menos la comisión de Stripe (~3%). Verifica los costos reales en tu cuenta de Printful antes de lanzar.

## Antes de lanzar

- Reemplaza las imágenes de muestra (`src/catalogo.js`, campo `sample`) por archivos propios en `public/`. Ahora apuntan al CDN de Higgsfield.
- Revisa los textos legales (`/terms`, `/privacy`) con alguien que sepa del tema; son plantillas.
- No publiques reseñas inventadas; agrega testimonios reales cuando lleguen.

## Etsy

Ver [ETSY.md](ETSY.md).
