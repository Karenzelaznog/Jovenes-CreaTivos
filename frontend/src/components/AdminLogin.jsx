import { useState } from 'react'
import { pedir } from '../adminApi.js'

export default function AdminLogin({ onOk }) {
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const entrar = async (e) => {
    e.preventDefault()
    if (!usuario.trim() || !clave) return setError('Escribe tu usuario y contraseña.')
    setError('')
    setCargando(true)
    try {
      await pedir('/api/auth/login', { metodo: 'POST', cuerpo: { usuario, clave } })
      onOk()
    } catch (err) {
      setError(err.status === 401 ? 'Usuario o contraseña incorrectos.' : 'No pudimos conectar con el servidor.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="admin-login">
      <form onSubmit={entrar} noValidate>
        <h2>☁ Admin SKINCARY</h2>
        <label>Usuario
          <input value={usuario} onChange={(e) => setUsuario(e.target.value)} autoComplete="username" />
        </label>
        <label>Contraseña
          <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} autoComplete="current-password" />
        </label>
        {error && <p className="estado error">{error}</p>}
        <button className="btn btn-principal" disabled={cargando}>{cargando ? 'Entrando…' : 'Entrar'}</button>
        <a href="#" className="volver">← Volver a la tienda</a>
      </form>
    </div>
  )
}