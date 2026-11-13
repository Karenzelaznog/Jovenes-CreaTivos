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

  return `Eres "JesChat", la asistente virtual de SKINCARY, una tienda colombiana de skincare y accesorios.

TONO: amable, juvenil y claro. Tutea. Máximo 1 emoji por respuesta (☁ ✦). Respuestas cortas: 2 a 4 frases. Texto plano, sin markdown ni asteriscos.

REGLAS:
- Responde exclusivamente preguntas sobre SKINCARY, esta página, sus secciones, compras y productos.
- Solo cuando el mensaje sea claramente ajeno a la página y a sus productos, responde: "Lo siento, solo puedo ayudar con preguntas sobre SKINCARY, la página y sus productos ☁". No contestes el tema ajeno.
- Si una pregunta parece relacionada pero no hay información suficiente, dilo claramente y ofrece consultar por WhatsApp; no la trates como una pregunta ajena.
- Recomienda SOLO productos del catálogo de abajo, con su nombre exacto y precio en pesos colombianos (COP).
- Si piden algo que no está en el catálogo, dilo con amabilidad y ofrece la alternativa más cercana.
- BASIC son los esenciales accesibles; PREMIUM son fórmulas avanzadas con detalles azul hielo y plateados.
- No inventes ingredientes, resultados, descuentos, tiempos de envío ni promociones.
- No des diagnósticos ni consejos médicos. Si hay irritación fuerte, alergia o condición de piel, sugiere consultar a un dermatólogo.
- No pidas datos personales (nombre completo, teléfono, dirección). Eso se pide solo al finalizar el pedido.
- Para comprar, indica que pueden agregar productos al carrito y finalizar el pedido por WhatsApp. La página también ofrece entrega a domicilio o recoger en un punto de entrega; no inventes precios ni condiciones de entrega.
- Si piden una rutina: limpiar, hidratar y proteger con SPF por la mañana.

CATÁLOGO DISPONIBLE:
${catalogo}`
}

const normalizar = (texto) => texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

// Respaldo sin IA: contesta con datos confirmados o pide más contexto.
function respuestaBasica(texto) {
  const t = normalizar(texto)
  if (/^(hola|holi|buenas|buenos dias|buenas tardes|buenas noches)\b/.test(t)) {
    return '¡Hola! Soy JesChat, tu asistente de SKINCARY. Puedo ayudarte con la página y nuestros productos. ¿Qué te gustaría saber? ☁'
  }

  const productos = db
    .prepare('SELECT nombre, precio, descripcion, categoria, coleccion FROM productos WHERE disponible = 1 ORDER BY categoria, numero')
    .all()
  const consultado = productos.find((p) => t.includes(normalizar(p.nombre)))
  if (consultado) {
    return `${consultado.nombre}: ${cop(consultado.precio)}. ${consultado.descripcion}`
  }

  const temasProducto = [
    [/sol|spf|protector|solar/, /spf|protector solar/],
    [/limpi|espuma|lavar|limpieza/, /limpiador|limpiadora|clean/],
    [/hidrat|crema|seca/, /hidrat|crema/],
    [/labio|balsamo|lips/, /labial|lips/],
    [/ojo|ojera|contorno/, /eyes|ojos/],
    [/mascarilla|mask|arcilla/, /mask|mascarilla|arcilla/],
    [/serum|vitamina|manchas/, /serum|vitamin/],
    [/tonico|toner/, /toner|tonico/],
    [/regalo|accesorio|cosmetiquera|kit|combo|organizador/, null],
  ]
  for (const [pregunta, producto] of temasProducto) {
    if (pregunta.test(t)) {
      const filas = productos
        .filter((p) => producto
          ? producto.test(normalizar(`${p.nombre} ${p.descripcion}`))
          : p.categoria === 'accesorios')
        .slice(0, 3)
      if (filas.length) {
        return `Estas opciones podrían servirte: ${filas.map((p) => `${p.nombre} (${cop(p.precio)})`).join(', ')}. Puedes agregarlas al carrito y finalizar el pedido por WhatsApp ☁`
      }
    }
  }

  if (/envio|entrega|domicilio|recoger|punto de entrega/.test(t)) {
    return 'La página permite elegir entrega a domicilio o recoger en un punto de entrega al finalizar el pedido. No tengo información confirmada sobre costos o tiempos; puedes consultarlos por WhatsApp al hacer tu pedido.'
  }
  if (/pago|pagar|comprar|pedido|carrito|whatsapp/.test(t)) {
    return 'Agrega los productos al carrito y continúa al checkout para completar tus datos y enviar el pedido por WhatsApp. La página ofrece entrega a domicilio o recoger en un punto de entrega.'
  }
  if (/precio|precios|cuesta|cuestan|vale|valen|catalogo|productos|tienda|skincary|pagina|web|coleccion|basic|premium|recomiend|rutina|piel|facial|skincare|belleza/.test(t)) {
    return 'Puedo ayudarte con productos, precios y compras en SKINCARY. Dime el nombre del producto o qué tipo de producto buscas y te comparto las opciones disponibles.'
  }
  if (/capital|presidente|futbol|deporte|politica|programar|codigo|matematic|clima|pelicula|musica|historia|noticia/.test(t)) {
    return 'Lo siento, solo puedo ayudar con preguntas sobre SKINCARY, la página y sus productos ☁'
  }
  return '¿Tu pregunta es sobre la página o algún producto de SKINCARY? Cuéntame un poco más y con gusto te ayudo.'
}

// POST /api/chat  { mensajes: [{ rol: 'user' | 'assistant', texto: '...' }] }
router.post('/', async (req, res) => {
  if (limitar(req.ip)) {
    return res.status(429).json({ error: 'Muchos mensajes seguidos. Intenta en unos minutos.' })
  }

  // Últimos 10 mensajes, 500 caracteres cada uno
  let mensajes = (Array.isArray(req.body.mensajes) ? req.body.mensajes : [])
    .slice(-10)
    .map((m) => ({ rol: m.rol === 'assistant' ? 'model' : 'user', texto: String(m.texto ?? '').slice(0, 500) }))
    .filter((m) => m.texto.trim())

  // Gemini exige que la conversación empiece con un mensaje del usuario
  while (mensajes.length && mensajes[0].rol !== 'user') mensajes.shift()
  if (mensajes.length === 0) return res.status(400).json({ error: 'Escribe un mensaje.' })

  const ultimo = mensajes[mensajes.length - 1].texto

  const preguntaNormalizada = normalizar(ultimo)
  if (
    /envio|entrega|domicilio|recoger|punto de entrega/.test(preguntaNormalizada) ||
    /capital|presidente|futbol|deporte|politica|programar|codigo|matematic|clima|pelicula|musica|historia|noticia/.test(preguntaNormalizada)
  ) {
    return res.json({ respuesta: respuestaBasica(ultimo) })
  }

  // Sin clave configurada: funciona igual con el respaldo gratis
  if (!process.env.GEMINI_API_KEY || !process.env.GEMINI_MODEL) {
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