import { useEffect, useState } from 'react'
import { pedir } from '../adminApi.js'
import AdminLogin from './AdminLogin.jsx'
import AdminProductos from './AdminProductos.jsx'
import AdminLista from './AdminLista.jsx'
import '../admin.css'

export default function Admin() {
  const [sesion, setSesion] = useState('cargando') // cargando | no | si
  const [tab, setTab] = useState('productos')

  // Al abrir /#/admin pregunta al servidor si ya hay sesión válida
  useEffect(() => {
    pedir('/api/auth/me').then(() => setSesion('si')).catch(() => setSesion('no'))
  }, [])

  const salir = async () => {
    try { await pedir('/api/auth/logout', { metodo: 'POST' }) } finally { setSesion('no') }
  }

  if (sesion === 'cargando') return <p className="estado">Verificando sesión…</p>
  if (sesion === 'no') return <AdminLogin onOk={() => setSesion('si')} />

  return (
    <div className="admin">
      <header className="admin-top">
        <strong>☁ Panel SKINCARY</strong>
        <div>
          <a href="#" className="btn btn-suave">Ver tienda</a>
          <button className="btn btn-suave" onClick={salir}>Cerrar sesión</button>
        </div>
      </header>

      <nav className="admin-tabs">
        {[['productos', 'Productos'], ['pedidos', 'Pedidos'], ['mensajes', 'Mensajes']].map(([id, label]) => (
          <button key={id} className={tab === id ? 'activo' : ''} onClick={() => setTab(id)}>{label}</button>
        ))}
      </nav>

      <main className="admin-main">
        {tab === 'productos' && <AdminProductos />}
        {tab === 'pedidos' && <AdminLista ruta="/api/admin/pedidos" vacio="Aún no hay pedidos." />}
        {tab === 'mensajes' && <AdminLista ruta="/api/admin/mensajes" vacio="Aún no hay mensajes." />}
      </main>
    </div>
  )
}