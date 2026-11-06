import { useCart } from '../context/CartContext.jsx'
import { cop, rutaImagen } from '../utils/formato.js'

export default function ProductoCard({ producto }) {
  const { agregar } = useCart()
  const disponible = producto.disponible === 1

  return (
    <article className="card">
      <div className="card-img">
        {producto.coleccion && (
          <span className={`etiqueta ${producto.coleccion}`}>{producto.coleccion.toUpperCase()}</span>
        )}
        <img
          src={rutaImagen(producto.imagen)}
          alt={producto.nombre}
          loading="lazy"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = rutaImagen('/img/placeholder.svg') }}
        />
        {/* Sello pequeño estilo sticker. Reemplázalo por public/img/sello.png si tienes uno propio */}
        <span className="sello" title="SKINCARY">☁</span>
      </div>

      <div className="card-cuerpo">
        <small className="numero">N.º {producto.numero}</small>
        <h3>{producto.nombre}</h3>
        <p className="desc">{producto.descripcion}</p>
        <p className="precio">{cop(producto.precio)}</p>
        <p className={`stock ${disponible ? 'si' : 'no'}`}>{disponible ? '● Disponible' : '● Agotado'}</p>
        <button className="btn btn-principal" disabled={!disponible} onClick={() => agregar(producto)}>
          Agregar al carrito
        </button>
      </div>
    </article>
  )
}