# Pawtrait — retratos de mascotas automáticos (EE.UU.)

El cliente sube una foto → elige estilo → ve una vista previa con marca de agua (gratis) → arma su carrito (cuadros, lienzos, playeras, sudaderas, tazas, bolsas, cobijas o descarga digital) → paga con Stripe → Printful fabrica y envía todo en un solo pedido. **Nadie tiene que hacer nada a mano.**

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
| `PRINTFUL_AUTO_CONFIRM` | Opcional. `false` = los pedidos quedan en borrador en Printful para revisarlos antes de producir (recomendado las primeras semanas). |
| `PRINTFUL_PRODUCT_<ID>` | Opcional, solo si el paso 3 marca un producto mal (ej. `PRINTFUL_PRODUCT_TOTE=367`). |

3. **Verifica Printful:** `PRINTFUL_API_KEY=... npm run printful:variants`. Revisa que cada producto (playera, taza, lienzo, bolsa, cobija…) apunte al artículo correcto y que todas las tallas/colores existan. Los IDs del catálogo son los de Printful que yo conozco; **la bolsa (84) y la cobija (423) son los menos seguros**, confírmalos aquí.
4. Haz un pedido de prueba con la tarjeta de Stripe `4242 4242 4242 4242` usando llaves `sk_test_`.

## Productos y números (aprox., envío gratis incluido)

| Producto | Precio | Costo Printful aprox. (con envío) |
| --- | --- | --- |
| Descarga digital | $29 | ~$0.05 de IA |
| Cuadro enmarcado 12×16″ / 18×24″ | $89 / $129 | ~$40 / ~$65 |
| Lienzo 12×16″ / 16×20″ / 18×24″ | $69 / $89 / $109 | ~$35 / ~$45 / ~$55 |
| Playera | $34 | ~$17 |
| Sudadera con capucha | $59 | ~$35 |
| Taza 11 oz / 15 oz | $24 / $27 | ~$12 / ~$14 |
| Bolsa | $29 | ~$18 |
| Cobija 50×60″ | $79 | ~$45 |

Menos la comisión de Stripe (~3%). Son estimados: el script del paso 3 muestra el costo real de cada variante. Precios y opciones se cambian en `src/catalogo.js`.

## Antes de lanzar

- Reemplaza las imágenes de muestra (`src/catalogo.js`, campo `sample`) por archivos propios en `public/`. Ahora apuntan al CDN de Higgsfield.
- Revisa los textos legales (`/terms`, `/privacy`) con alguien que sepa del tema; son plantillas.
- No publiques reseñas inventadas; agrega testimonios reales cuando lleguen.

## Etsy

Ver [ETSY.md](ETSY.md).
