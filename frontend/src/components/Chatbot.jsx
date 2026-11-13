import { useEffect, useRef, useState } from 'react'
import { API_URL } from '../config.js'
import './Chatbot.css'

const SALUDO = {
  rol: 'assistant',
  texto: '¡Hola! Soy JesChat, tu asistente de SKINCARY. Puedo ayudarte con nuestra página y productos. ¿Qué te gustaría saber? ☁',
}

export default function Chatbot() {
  const [abierto, setAbierto] = useState(false)
  const [mensajes, setMensajes] = useState([SALUDO])
  const [texto, setTexto] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const listaRef = useRef(null)

  useEffect(() => {
    if (abierto) listaRef.current?.scrollTo({ top: listaRef.current.scrollHeight, behavior: 'smooth' })
  }, [abierto, mensajes, cargando])

  const enviar = async (e) => {
    e.preventDefault()
    const pregunta = texto.trim()
    if (!pregunta || cargando) return

    const conversacion = [...mensajes, { rol: 'user', texto: pregunta }]
    setMensajes(conversacion)
    setTexto('')
    setError('')
    setCargando(true)

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensajes: conversacion }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'No pudimos enviar tu mensaje.')
      if (typeof data.respuesta !== 'string' || !data.respuesta.trim()) {
        throw new Error('No recibimos una respuesta. Inténtalo de nuevo.')
      }
      setMensajes((actuales) => [...actuales, { rol: 'assistant', texto: data.respuesta }])
    } catch (e) {
      setError(e.message || 'No pudimos conectar con JesChat. Inténtalo de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <aside className="jescha">
      {abierto && (
        <section className="jescha-ventana" aria-label="Chat con JesChat">
          <header className="jescha-cabecera">
            <div>
              <strong>JesChat</strong>
              <span>Asistente de SKINCARY</span>
            </div>
            <button type="button" onClick={() => setAbierto(false)} aria-label="Cerrar chat">×</button>
          </header>

          <div className="jescha-mensajes" ref={listaRef} aria-live="polite">
            {mensajes.map((mensaje, i) => (
              <p className={`jescha-mensaje ${mensaje.rol}`} key={`${i}-${mensaje.rol}`}>
                {mensaje.texto}
              </p>
            ))}
            {cargando && <p className="jescha-mensaje assistant">JesChat está escribiendo…</p>}
            {error && <p className="jescha-error" role="alert">{error}</p>}
          </div>

          <form className="jescha-formulario" onSubmit={enviar}>
            <input
              aria-label="Escribe tu pregunta"
              placeholder="Pregunta sobre la tienda o productos…"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              maxLength={500}
              disabled={cargando}
            />
            <button type="submit" disabled={cargando || !texto.trim()} aria-label="Enviar mensaje">
              Enviar
            </button>
          </form>
        </section>
      )}
      <button
        className="jescha-abrir"
        type="button"
        onClick={() => setAbierto((actual) => !actual)}
        aria-expanded={abierto}
        aria-label={abierto ? 'Cerrar chat con JesChat' : 'Abrir chat con JesChat'}
      >
        {abierto ? 'Cerrar' : '☁ Chatea con JesChat'}
      </button>
    </aside>
  )
}