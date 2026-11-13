import { Router } from 'express'
import db from '../db.js'

const router = Router()

// Límite simple por IP: 20 mensajes cada 10 minutos
const usos = new Map()
function limitar(ip) {
  const ahora = Date.now()
  const lista = (usos.get(ip) || []).filter((t) => ahora - t < 10 * 60 * 1000)
  if (lista.length >= 20) return true
  lista.push(ahora)
  usos.set(ip, lista)
  return false
}

const cop = (n) => `$${n.toLocaleString('es-CO')} COP`

// Instrucciones del asistente con el catálogo real de la base de datos
function construirSistema() {
  const productos = db
    .prepare('SELECT categoria, coleccion, nombre, precio, descripcion FROM productos WHERE disponible = 1 ORDER BY categoria, numero')
    .all()

  const catalogo = productos
    .map((p) => `- ${p.categoria}${p.coleccion ? ' ' + p.coleccion.toUpperCase() : ''} | ${p.nombre} | ${cop(p.precio)} | ${p.descripcion}`)
    .join('\n')

  return `Eres "JesChat", el asistente virtual de SKINCARY, una tienda colombiana de skincare y accesorios con estética azul pastel, nubes y estrellas.

TONO: cálido, tierno, juvenil y claro. Tutea. Máximo 1 emoji por respuesta (☁ ✦). Respuestas cortas: 2 a 4 frases. Texto plano, sin markdown ni asteriscos.

REGLAS:
- Recomienda SOLO productos del catálogo de abajo, con su nombre exacto y precio en pesos colombianos (COP).
- Si piden algo que no está en el catálogo, dilo con amabilidad y ofrece la alternativa más cercana.
- BASIC son los esenciales accesibles; PREMIUM son fórmulas avanzadas con detalles azul hielo y plateados.
- No inventes ingredientes, resultados, descuentos, tiempos de envío ni promociones.
- No des diagnósticos ni consejos médicos. Si hay irritación fuerte, alergia o condición de piel, sugiere consultar a un dermatólogo.
- No pidas datos personales (nombre completo, teléfono, dirección). Eso se pide solo al finalizar el pedido.
- Para comprar, indica que pueden agregar al carrito y finalizar el pedido por WhatsApp.
- Si piden una rutina: limpiar, hidratar y proteger con SPF por la mañana.
- Si preguntan algo ajeno a SKINCARY, responde breve y vuelve al tema de la tienda.

CATÁLOGO DISPONIBLE:
${catalogo}`
}

// Respaldo gratis sin IA: busca productos por palabras clave del mensaje
function respuestaBasica(texto) {
  const t = texto.toLowerCase()
  const temas = [
    [/sol|spf|protector|solar/, '%SPF%'],
    [/limpi|espuma|lavar/, '%Limpi%'],
    [/hidrat|crema|seca/, '%Hidrat%'],
    [/labio|bálsamo|balsamo|lips/, '%Lips%'],
    [/ojo|ojera|contorno/, '%Eyes%'],
    [/mascarilla|mask|arcilla/, '%Mask%'],
    [/serum|sérum|vitamina|manchas/, '%Serum%'],
    [/tónico|tonico|toner/, '%Toner%'],
    [/regalo|accesorio|cosmetiquera|kit|combo/, null],
  ]
  for (const [re, patron] of temas) {
    if (!re.test(t)) continue
    const filas = patron
      ? db.prepare('SELECT nombre, precio FROM productos WHERE nombre LIKE ? AND disponible = 1 LIMIT 3').all(patron)
      : db.prepare("SELECT nombre, precio FROM productos WHERE categoria = 'accesorios' AND disponible = 1 LIMIT 3").all()
    if (filas.length) {
      return `Te sugiero: ${filas.map((p) => `${p.nombre} (${cop(p.precio)})`).join(', ')}. Puedes agregarlos al carrito y finalizar tu pedido por WhatsApp ☁`
    }
  }
  return 'Ahora mismo estoy descansando un poquito ☁ Cuéntame si buscas limpiador, hidratante, protector solar, mascarilla o accesorios, y te sugiero algo de la tienda.'
}

// POST /api/chat  { mensajes: [{ rol: 'user' | 'assistant', texto: '...' }] }
router.post('/', async (req, res) => {
  if (limitar(req.ip)) {
    return res.status(429).json({ error: 'Muchos mensajes seguidos. Intenta en unos minutos.' })
  }

  // Últimos 10 mensajes, 500 caracteres cada uno
  const mensajes = (Array.isArray(req.body.mensajes) ? req.body.mensajes : [])
    .slice(-10)
    .map((m) => ({ rol: m.rol === 'assistant' ? 'model' : 'user', texto: String(m.texto ?? '').slice(0, 500) }))
    .filter((m) => m.texto.trim())

  // Gemini exige que la conversación empiece con un mensaje del usuario
  while (mensajes.length && mensajes[0].rol !== 'user') mensajes.shift()
  if (mensajes.length === 0) return res.status(400).json({ error: 'Escribe un mensaje.' })

  const ultimo = mensajes[mensajes.length - 1].texto

  // Sin clave configurada: funciona igual con el respaldo gratis
  if (!process.env.GEMINI_API_KEY || !process.env.GEMINI_MODEL) {
    console.warn('Chat: falta GEMINI_API_KEY o GEMINI_MODEL en .env, usando respaldo')
    return res.json({ respuesta: respuestaBasica(ultimo) })
  }

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: construirSistema() }] },
          contents: mensajes.map((m) => ({ role: m.rol, parts: [{ text: m.texto }] })),
          generationConfig: { maxOutputTokens: 800 },
        }),
      }
    )

    const datos = await r.json()
    if (!r.ok) {
      console.error('Error de Gemini:', r.status, JSON.stringify(datos).slice(0, 400))
      return res.json({ respuesta: respuestaBasica(ultimo) }) // cuota agotada u otro fallo
    }

    const respuesta = (datos.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('').trim()
    res.json({ respuesta: respuesta || respuestaBasica(ultimo) })
  } catch (e) {
    console.error('Error en /api/chat:', e)
    res.json({ respuesta: respuestaBasica(ultimo) })
  }
})

export default router