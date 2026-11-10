import { useState } from 'react'
import { API_URL } from '../config.js'
import './Contacto.css'

export default function Contacto() {
  const [datos, setDatos] = useState({ nombre: '', email: '', mensaje: '' })
  const [errores, setErrores] = useState({})
  // Estados posibles: 'inactivo' | 'enviando' | 'exito' | 'error'
  const [estado, setEstado] = useState('inactivo')

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value })

  const enviar = async (e) => {
    e.preventDefault()
    setEstado('enviando')
    setErrores({})

    try {
      const res = await fetch(`${API_URL}/api/contacto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      })
      const data = await res.json()

      // 400 = datos inválidos: mostramos el error debajo de cada campo
      if (res.status === 400) {
        setErrores(data.errores)
        setEstado('inactivo')
        return
      }
      if (!res.ok) throw new Error('Error del servidor')

      setDatos({ nombre: '', email: '', mensaje: '' })
      setEstado('exito')
    } catch {
      // Sin conexión o servidor caído
      setEstado('error')
    }
  }

  return (
    <section className="contacto" id="contacto">
      <h2>Escríbenos</h2>
      <p>¿Tienes dudas sobre tu rutina o tu pedido? Cuéntanos.</p>

      <form onSubmit={enviar} noValidate>
        <label>
          Nombre
          <input name="nombre" value={datos.nombre} onChange={cambiar} />
          {errores.nombre && <span className="error">{errores.nombre}</span>}
        </label>

        <label>
          Correo
          <input name="email" type="email" value={datos.email} onChange={cambiar} />
          {errores.email && <span className="error">{errores.email}</span>}
        </label>

        <label>
          Mensaje
          <textarea name="mensaje" rows="5" value={datos.mensaje} onChange={cambiar} />
          {errores.mensaje && <span className="error">{errores.mensaje}</span>}
        </label>

        <button type="submit" disabled={estado === 'enviando'}>
          {estado === 'enviando' ? 'Enviando...' : 'Enviar mensaje'}
        </button>

        {estado === 'exito' && (
          <p className="aviso exito">¡Gracias! Te responderemos pronto.</p>
        )}
        {estado === 'error' && (
          <p className="aviso fallo">No pudimos enviar tu mensaje. Inténtalo de nuevo en un momento.</p>
        )}
      </form>
    </section>
  )
}