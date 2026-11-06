import { irA } from '../utils/formato.js'

export default function Hero({ elegirCategoria }) {
  return (
    <section id="inicio" className="hero">
      <span className="deco nube n1">☁</span>
      <span className="deco nube n2">☁</span>
      <span className="deco estrella e1">✦</span>
      <span className="deco estrella e2">✧</span>
      <span className="deco estrella e3">✦</span>

      <p className="hero-logo">☁ SKINCARY</p>
      <h1>Tu momento de cuidado, tu momento SKINCARY</h1>
      <p className="hero-texto">
        Skincare y accesorios con una estética suave, juvenil y delicada. Rutinas simples
        para tu piel real, hechas en Colombia con mucho cariño.
      </p>

      <div className="hero-botones">
        <button className="btn btn-principal" onClick={() => irA('tienda')}>Explorar productos</button>
        <button className="btn btn-suave" onClick={() => elegirCategoria('skincare', '')}>SKINCARE</button>
        <button className="btn btn-suave" onClick={() => elegirCategoria('accesorios', '')}>ACCESSORIES</button>
      </div>
    </section>
  )
}