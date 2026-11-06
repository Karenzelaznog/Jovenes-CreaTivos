import { useEffect, useState } from 'react'
import { CartProvider, useCart } from './context/CartContext.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Destacados from './components/Destacados.jsx'
import Tienda from './components/Tienda.jsx'
import Carrito from './components/Carrito.jsx'
import Checkout from './components/Checkout.jsx'
import Contacto from './components/Contacto.jsx'
import Admin from './components/Admin.jsx'
import { irA } from './utils/formato.js'
import './tienda.css'

const FILTROS_INICIALES = { q: '', categoria: '', coleccion: '', min: '', max: '' }

function Tiendita() {
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [checkout, setCheckout] = useState(false)
  const { items } = useCart()

  // Los accesos de portada y colecciones aplican el filtro y bajan a la tienda
  const elegirCategoria = (categoria, coleccion) => {
    setFiltros({ ...FILTROS_INICIALES, categoria, coleccion })
    setTimeout(() => irA('tienda'), 50)
  }

  return (
    <>
      <Header abrirCarrito={() => setCarritoAbierto(true)} />
      <main>
        <Hero elegirCategoria={elegirCategoria} />
        <Destacados elegirCategoria={elegirCategoria} />
        <Tienda filtros={filtros} setFiltros={setFiltros} />
        <section id="contacto"><Contacto /></section>
      </main>
      <footer className="footer">
        © 2026 SKINCARY · Hecho con cariño en Colombia ☁ · <a href="#/admin">Admin</a>
      </footer>

      <Carrito
        abierto={carritoAbierto}
        cerrar={() => setCarritoAbierto(false)}
        finalizar={() => { setCarritoAbierto(false); if (items.length) setCheckout(true) }}
      />
      {checkout && <Checkout cerrar={() => setCheckout(false)} />}
    </>
  )
}

export default function App() {
  // Ruta por hash: funciona en GitHub Pages sin errores 404 al recargar
  const [ruta, setRuta] = useState(window.location.hash)
  useEffect(() => {
    const actualizar = () => setRuta(window.location.hash)
    window.addEventListener('hashchange', actualizar)
    return () => window.removeEventListener('hashchange', actualizar)
  }, [])

  if (ruta === '#/admin') return <Admin />

  return (
    <CartProvider>
      <Tiendita />
    </CartProvider>
  )
}