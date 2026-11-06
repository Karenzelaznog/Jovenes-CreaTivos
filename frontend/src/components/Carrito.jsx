import { useCart } from '../context/CartContext.jsx'
import { cop, rutaImagen } from '../utils/formato.js'

export default function Carrito({ abierto, cerrar, finalizar }) {
  const { items, sumar, restar, quitar, vaciar, total } = useCart()

  return (
    <>
      {abierto && <div className="fondo" onClick={cerrar} />}
      <aside className={`carrito ${abierto ? 'abierto' : ''}`} aria-hidden={!abierto}>
        <div className="carrito-top">
          <h3>Tu carrito</h3>
          <button className="cerrar" onClick={cerrar} aria-label="Cerrar">✕</button>
        </div>

        {items.length === 0 ? (
          <p className="estado">Tu carrito está vacío ☁</p>
        ) : (
          <>
            <ul className="carrito-lista">
              {items.map((i) => (
                <li key={i.id}>
                  <img src={rutaImagen(i.imagen)} alt={i.nombre}
                       onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = rutaImagen('/img/placeholder.svg') }} />
                  <div className="item-info">
                    <strong>{i.nombre}</strong>
                    <span>{cop(i.precio)}</span>
                    <div className="cantidad">
                      <button onClick={() => restar(i.id)} aria-label="Disminuir">−</button>
                      <span>{i.cantidad}</span>
                      <button onClick={() => sumar(i.id)} aria-label="Aumentar">+</button>
                      <button className="quitar" onClick={() => quitar(i.id)}>Eliminar</button>
                    </div>
                  </div>
                  <b>{cop(i.precio * i.cantidad)}</b>
                </li>
              ))}
            </ul>

            <div className="carrito-pie">
              <p className="total">Total: <strong>{cop(total)}</strong></p>
              <button className="btn btn-principal" onClick={finalizar}>Finalizar pedido</button>
              <button className="btn btn-suave" onClick={vaciar}>Vaciar carrito</button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}