import { useEffect, useState } from 'react'
import { pedir } from '../adminApi.js'
import { cop } from '../utils/formato.js'

export default function AdminLista({ ruta, vacio }) {
  const [filas, setFilas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setCargando(true)
    pedir(ruta)
      .then(setFilas)
      .catch((e) => setError(e.status === 401 ? 'Tu sesión expiró. Recarga e inicia sesión.' : e.message))
      .finally(() => setCargando(false))
  }, [ruta])

  if (cargando) return <p className="estado">Cargando…</p>
  if (error) return <p className="estado error">{error}</p>
  if (filas.length === 0) return <p className="estado">{vacio}</p>

  const columnas = Object.keys(filas[0])

  return (
    <div className="tabla-wrap">
      <table>
        <thead><tr>{columnas.map((c) => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>
          {filas.map((f, i) => (
            <tr key={f.id ?? i}>
              {columnas.map((c) => <td key={c}>{c === 'total' ? cop(f[c]) : String(f[c] ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}