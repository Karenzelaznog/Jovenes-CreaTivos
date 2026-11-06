import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { WHATSAPP_NUMERO } from '../config.js'
import { cop } from '../utils/formato.js'

const VACIO = { nombre: '', telefono: '', ciudad: '', direccion: '', entrega: 'Domicilio', observaciones: '' }

export default function Checkout({ cerrar }) {
  const { items, total, vaciar } = useCart()
  const [datos, setDatos] = useState(VACIO)
  const [paso, setPaso] = useState('datos') // 'datos' | 'resumen'
  const [error, setError] = useState('')

  const cambiar = (c) => (e) => setDatos({ ...datos, [c]: e.target.value })

  const irAResumen = (e) => {
    e.preventDefault()
    if (datos.nombre.trim().length < 3) return setError('Escribe tu nombre completo.')
    if (!/^[0-9+\s-]{7,15}$/.test(datos.telefono.trim())) return setError('Escribe un teléfono o WhatsApp válido.')
    if (!datos.ciudad.trim()) return setError('Escribe tu ciudad.')
    if (datos.entrega === 'Domicilio' && !datos.direccion.trim()) return setError('Escribe tu dirección para el domicilio.')
    setError('')
    setPaso('resumen')
  }

    // Arma el mensaje organizado, guarda el pedido y abre WhatsApp
  const enviar = () => {
    if (!WHATSAPP_NUMERO) {
      return setError('Falta configurar el número de WhatsApp en src/config.js')
    }
    const lineas = items.map(
      (i) => `• ${i.nombre} x${i.cantidad} — ${cop(i.precio)} c/u = ${cop(i.precio * i.cantidad)}`
    )
    const msg = [
      '☁ *Nuevo pedido SKINCARY* ☁',
      '',
      '*Productos:*',
      ...lineas,
      '',
      `*TOTAL: ${cop(total)}*`,
      '',
      '*Datos del comprador:*',
      `Nombre: ${datos.nombre}`,
      `Teléfono: ${datos.telefono}`,
      `Ciudad: ${datos.ciudad}`,
      `Entrega: ${datos.entrega}`,
      datos.entrega === 'Domicilio' ? `Dirección: ${datos.direccion}` : null,
      datos.observaciones ? `Observaciones: ${datos.observaciones}` : null,
    ].filter((l) => l !== null).join('\n')

    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(msg)}`

    // Guarda el pedido para verlo en el panel admin (sin esperar la respuesta)
    fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({ ...datos, items: items.map((i) => ({ id: i.id, cantidad: i.cantidad })) }),
    }).catch(() => { /* si falla, el pedido igual sale por WhatsApp */ })

    // Abre WhatsApp en otra pestaña; si el navegador la bloquea, usa la misma pestaña
    const ventana = window.open(url, '_blank')
    if (ventana) ventana.opener = null
    else window.location.href = url

    vaciar()
    cerrar()
  }

  return (
    <div className="modal-fondo" onClick={cerrar}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="cerrar" onClick={cerrar} aria-label="Cerrar">✕</button>

        {paso === 'datos' ? (
          <form onSubmit={irAResumen} noValidate>
            <h3>Datos del comprador</h3>
            <label>Nombre completo<input value={datos.nombre} onChange={cambiar('nombre')} /></label>
            <label>Teléfono o WhatsApp<input value={datos.telefono} onChange={cambiar('telefono')} inputMode="tel" /></label>
            <label>Ciudad<input value={datos.ciudad} onChange={cambiar('ciudad')} /></label>
            <label>Método de entrega
              <select value={datos.entrega} onChange={cambiar('entrega')}>
                <option>Domicilio</option>
                <option>Recoger en punto de entrega</option>
              </select>
            </label>
            {datos.entrega === 'Domicilio' && (
              <label>Dirección<input value={datos.direccion} onChange={cambiar('direccion')} /></label>
            )}
            <label>Observaciones del pedido (opcional)
              <textarea rows="3" value={datos.observaciones} onChange={cambiar('observaciones')} />
            </label>
            {error && <p className="estado error">{error}</p>}
            <button className="btn btn-principal" type="submit">Ver resumen</button>
          </form>
        ) : (
          <div>
            <h3>Resumen del pedido</h3>
            <ul className="resumen">
              {items.map((i) => (
                <li key={i.id}><span>{i.nombre} x{i.cantidad}</span><b>{cop(i.precio * i.cantidad)}</b></li>
              ))}
            </ul>
            <p className="total">Total: <strong>{cop(total)}</strong></p>
            <p className="datos-resumen">
              {datos.nombre} · {datos.telefono}<br />
              {datos.ciudad} · {datos.entrega}{datos.entrega === 'Domicilio' ? ` · ${datos.direccion}` : ''}
              {datos.observaciones && <><br />Obs.: {datos.observaciones}</>}
            </p>
            {error && <p className="estado error">{error}</p>}
            <button className="btn btn-principal" onClick={enviar}>Enviar pedido por WhatsApp</button>
            <button className="btn btn-suave" onClick={() => setPaso('datos')}>Volver a editar</button>
          </div>
        )}
      </div>
    </div>
  )
}