import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { irA } from '../utils/formato.js'

export default function Header({ abrirCarrito }) {
  const [menu, setMenu] = useState(false)
  const { cantidad } = useCart()

  const ir = (id) => { setMenu(false); irA(id) }

  return (
    <header className="header">
      <button className="logo" onClick={() => ir('inicio')}>☁ SKINCARY</button>

      <nav className={`nav ${menu ? 'abierto' : ''}`}>
        <button onClick={() => ir('inicio')}>Inicio</button>
        <button onClick={() => ir('tienda')}>Tienda</button>
        <button onClick={() => ir('destacados')}>Colecciones</button>
        <button onClick={() => ir('contacto')}>Contacto</button>
      </nav>

      <div className="header-acciones">
        <button className="btn-carrito" onClick={abrirCarrito} aria-label="Abrir carrito">
          🛒 {cantidad > 0 && <span className="badge">{cantidad}</span>}
        </button>
        <button className="btn-menu" onClick={() => setMenu(!menu)} aria-label="Menú">☰</button>
      </div>
    </header>
  )
}