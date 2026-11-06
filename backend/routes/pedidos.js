import { Router } from 'express'
import db from '../db.js'

const router = Router()

// POST /api/pedidos -> público. Guarda el pedido; el total se calcula con precios de la base.
router.post('/', (req, res) => {
  const { nombre, telefono, ciudad, direccion, entrega, observaciones, items } = req.body

  if (!nombre || !telefono || !ciudad || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Faltan datos del pedido' })
  }

  const buscar = db.prepare('SELECT nombre, precio FROM productos WHERE id = ?')
  let total = 0
  const lineas = []

  for (const it of items) {
    const p = buscar.get(it.id)
    if (!p) continue
    const cantidad = Math.max(1, Math.min(99, Number(it.cantidad) || 1))
    total += p.precio * cantidad
    lineas.push(`${p.nombre} x${cantidad} = $${(p.precio * cantidad).toLocaleString('es-CO')}`)
  }

  if (lineas.length === 0) return res.status(400).json({ error: 'Productos no válidos' })

  const r = db.prepare(`
    INSERT INTO pedidos (nombre, telefono, ciudad, direccion, entrega, observaciones, detalle, total)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    String(nombre), String(telefono), String(ciudad),
    String(direccion ?? ''), String(entrega ?? ''), String(observaciones ?? ''),
    lineas.join(' | '), total
  )

  res.status(201).json({ id: Number(r.lastInsertRowid), total })
})

export default router