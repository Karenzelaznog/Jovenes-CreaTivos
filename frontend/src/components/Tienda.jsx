import { useEffect, useState } from 'react'
import { getProductos } from '../api.js'
import ProductoCard from './ProductoCard.jsx'

const RANGOS = [
  { label: 'Todos los precios', min: '', max: '' },
  { label: 'Hasta $30.000', min: '', max: 30000 },
  { label: '$30.000 – $60.000', min: 30000, max: 60000 },
  { label: '$60.000 – $90.000', min: 60000, max: 90000 },
  { label: 'Más de $90.000', min: 90000, max: '' },
]

export default function Tienda({ filtros, setFiltros }) {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState(filtros.q)

  // Espera 300 ms después de escribir para no pedir datos en cada tecla
  useEffect(() => {
    const t = setTimeout(() => setFiltros((f) => ({ ...f, q: busqueda })), 300)
    return () => clearTimeout(t)
  }, [busqueda, setFiltros])

  useEffect(() => {
    let activo = true
    setCargando(true)
    setError('')
    getProductos({ q: filtros.q, categoria: filtros.categoria, coleccion: filtros.coleccion, min: filtros.min, max: filtros.max })
      .then((d) => activo && setProductos(d))
      .catch((e) => activo && setError(e.message))
      .finally(() => activo && setCargando(false))
    return () => { activo = false }
  }, [filtros])

  const cambiar = (campo) => (e) => setFiltros((f) => ({ ...f, [campo]: e.target.value }))

  const cambiarRango = (e) => {
    const r = RANGOS[e.target.value]
    setFiltros((f) => ({ ...f, min: r.min, max: r.max }))
  }

  const limpiar = () => { setBusqueda(''); setFiltros({ q: '', categoria: '', coleccion: '', min: '', max: '' }) }

  return (
    <section id="tienda" className="tienda">
      <h2>Tienda SKINCARY</h2>

      <div className="filtros">
        <input type="search" placeholder="Buscar por nombre…" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        <select value={filtros.categoria} onChange={cambiar('categoria')}>
          <option value="">Todas las categorías</option>
          <option value="skincare">SKINCARE</option>
          <option value="accesorios">ACCESORIOS</option>
        </select>
        <select value={filtros.coleccion} onChange={cambiar('coleccion')}>
          <option value="">BASIC y PREMIUM</option>
          <option value="basic">Solo BASIC</option>
          <option value="premium">Solo PREMIUM</option>
        </select>
        <select onChange={cambiarRango} defaultValue="0">
          {RANGOS.map((r, i) => <option key={r.label} value={i}>{r.label}</option>)}
        </select>
        <button className="btn btn-suave" onClick={limpiar}>Limpiar</button>
      </div>

      {cargando && <p className="estado">Cargando productos…</p>}
      {error && <p className="estado error">{error}. Verifica que el servidor esté activo.</p>}
      {!cargando && !error && productos.length === 0 && (
        <p className="estado">No encontramos productos con esos filtros.</p>
      )}

      <div className="grid">
        {productos.map((p) => <ProductoCard key={p.id} producto={p} />)}
      </div>
    </section>
  )
}