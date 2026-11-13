import { useCallback, useEffect, useState } from 'react'
import { pedir } from '../adminApi.js'
import { cop } from '../utils/formato.js'

const NUEVO = {
  numero: '', categoria: 'skincare', coleccion: 'basic',
  nombre: '', precio: '', descripcion: '', imagen: '', disponible: 1,
}

export default function AdminProductos() {
  const [lista, setLista] = useState([])
  const [form, setForm] = useState(NUEVO)
  const [editId, setEditId] = useState(null)
  const [busca, setBusca] = useState('')
  const [cargando, setCargando] = useState(true)
  const [aviso, setAviso] = useState({ tipo: '', texto: '' })

  const avisar = useCallback((tipo, texto) => setAviso({ tipo, texto }), [])
  const fallo = useCallback((e) => avisar('error', e.status === 401 ? 'Tu sesión expiró. Recarga e inicia sesión.' : e.message), [avisar])

  const cargar = useCallback(() =>
    pedir('/api/productos').then(setLista).catch(fallo).finally(() => setCargando(false))
  , [fallo])

  useEffect(() => { cargar() }, [cargar])

  const cambiar = (c) => (e) => setForm({ ...form, [c]: e.target.value })

  const guardar = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || !(Number(form.precio) > 0)) {
      return avisar('error', 'Escribe un nombre y un precio mayor a 0.')
    }
    try {
      if (editId) {
        await pedir(`/api/productos/${editId}`, {
          metodo: 'PUT',
          cuerpo: {
            nombre: form.nombre, precio: Number(form.precio), descripcion: form.descripcion,
            imagen: form.imagen, disponible: Number(form.disponible),
          },
        })
        avisar('ok', 'Producto actualizado.')
      } else {
        if (!form.numero.trim()) return avisar('error', 'Escribe el número del producto (ej. 21).')
        const carpeta = form.categoria === 'skincare' ? 'skincare' : 'accesorio'
        await pedir('/api/productos', {
          metodo: 'POST',
          cuerpo: {
            ...form,
            precio: Number(form.precio),
            disponible: Number(form.disponible),
            coleccion: form.categoria === 'skincare' ? form.coleccion : null,
            imagen: form.imagen || `/img/${carpeta}-${form.numero}.jpg`,
          },
        })
        avisar('ok', 'Producto creado.')
      }
      setForm(NUEVO)
      setEditId(null)
      cargar()
    } catch (err) { fallo(err) }
  }

  const editar = (p) => {
    setEditId(p.id)
    setForm({ ...p, precio: String(p.precio), descripcion: p.descripcion ?? '', imagen: p.imagen ?? '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelar = () => { setEditId(null); setForm(NUEVO) }

  const eliminar = async (p) => {
    if (!window.confirm(`¿Eliminar "${p.nombre}"?`)) return
    try { await pedir(`/api/productos/${p.id}`, { metodo: 'DELETE' }); avisar('ok', 'Producto eliminado.'); cargar() }
    catch (err) { fallo(err) }
  }

  const alternarDisponible = async (p) => {
    try {
      await pedir(`/api/productos/${p.id}`, {
        metodo: 'PUT',
        cuerpo: { nombre: p.nombre, precio: p.precio, descripcion: p.descripcion, imagen: p.imagen, disponible: p.disponible ? 0 : 1 },
      })
      cargar()
    } catch (err) { fallo(err) }
  }

  const visibles = lista.filter((p) => p.nombre.toLowerCase().includes(busca.toLowerCase()))

  return (
    <div>
      <form className="admin-form" onSubmit={guardar} noValidate>
        <h3>{editId ? 'Editar producto' : 'Nuevo producto'}</h3>
        <div className="admin-campos">
          <label>Número<input value={form.numero} onChange={cambiar('numero')} disabled={!!editId} /></label>
          <label>Categoría
            <select value={form.categoria} onChange={cambiar('categoria')} disabled={!!editId}>
              <option value="skincare">SKINCARE</option>
              <option value="accesorios">ACCESORIOS</option>
            </select>
          </label>
          {form.categoria === 'skincare' && (
            <label>Colección
              <select value={form.coleccion ?? 'basic'} onChange={cambiar('coleccion')} disabled={!!editId}>
                <option value="basic">BASIC</option>
                <option value="premium">PREMIUM</option>
              </select>
            </label>
          )}
          <label>Nombre<input value={form.nombre} onChange={cambiar('nombre')} /></label>
          <label>Precio (COP)<input type="number" min="0" value={form.precio} onChange={cambiar('precio')} /></label>
          <label>Imagen (ruta)<input placeholder="/img/skincare-01.jpg" value={form.imagen} onChange={cambiar('imagen')} /></label>
          <label>Disponible
            <select value={form.disponible} onChange={cambiar('disponible')}>
              <option value={1}>Sí</option>
              <option value={0}>Agotado</option>
            </select>
          </label>
        </div>
        <label>Descripción<textarea rows="2" value={form.descripcion} onChange={cambiar('descripcion')} /></label>

        {aviso.texto && <p className={`estado ${aviso.tipo}`}>{aviso.texto}</p>}
        <div className="admin-botones">
          <button className="btn btn-principal">{editId ? 'Guardar cambios' : 'Crear producto'}</button>
          {editId && <button type="button" className="btn btn-suave" onClick={cancelar}>Cancelar</button>}
        </div>
      </form>

      <input className="admin-busca" type="search" placeholder="Buscar producto…" value={busca} onChange={(e) => setBusca(e.target.value)} />

      {cargando ? <p className="estado">Cargando…</p> : (
        <div className="tabla-wrap">
          <table>
            <thead><tr><th>N.º</th><th>Nombre</th><th>Tipo</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
            <tbody>
              {visibles.map((p) => (
                <tr key={p.id}>
                  <td>{p.numero}</td>
                  <td>{p.nombre}</td>
                  <td>{p.coleccion ? p.coleccion.toUpperCase() : 'ACCESORIO'}</td>
                  <td>{cop(p.precio)}</td>
                  <td><button className="chip" onClick={() => alternarDisponible(p)}>{p.disponible ? 'Disponible' : 'Agotado'}</button></td>
                  <td className="acciones">
                    <button className="chip" onClick={() => editar(p)}>Editar</button>
                    <button className="chip peligro" onClick={() => eliminar(p)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}