import { Router } from 'express'
import db from '../db.js'
import requiereAdmin from '../middleware/auth.js'

const router = Router()

// GET /api/productos?q=serum&categoria=skincare&coleccion=premium&min=20000&max=90000
router.get('/', (req, res) => {
  const { q, categoria, coleccion, min, max } = req.query
  let sql = 'SELECT * FROM productos WHERE 1=1'
  const params = []

  if (q)         { sql += ' AND nombre LIKE ?'; params.push(`%${q}%`) }
  if (categoria) { sql += ' AND categoria = ?'; params.push(categoria) }
  if (coleccion) { sql += ' AND coleccion = ?'; params.push(coleccion) }
  if (min)       { sql += ' AND precio >= ?';   params.push(Number(min)) }
  if (max)       { sql += ' AND precio <= ?';   params.push(Number(max)) }

  sql += ' ORDER BY categoria, numero'
  res.json(db.prepare(sql).all(...params))
})

// GET /api/productos/1 -> un producto por su id
router.get('/:id', (req, res) => {
  const producto = db.prepare('SELECT * FROM productos WHERE id = ?').get(req.params.id)
  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' })
  }
  res.json(producto)
})

// --- Solo admin ---
router.post('/', requiereAdmin, (req, res) => {
  const { numero, categoria, coleccion, nombre, precio, descripcion, imagen, disponible } = req.body
  const r = db.prepare(`
    INSERT INTO productos (numero, categoria, coleccion, nombre, precio, descripcion, imagen, disponible)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(numero, categoria, coleccion || null, nombre, precio, descripcion, imagen, disponible ?? 1)
  res.status(201).json({ id: Number(r.lastInsertRowid) })
})

router.put('/:id', requiereAdmin, (req, res) => {
  const { nombre, precio, descripcion, imagen, disponible } = req.body
  db.prepare(`
    UPDATE productos SET nombre = ?, precio = ?, descripcion = ?, imagen = ?, disponible = ? WHERE id = ?
  `).run(nombre, precio, descripcion, imagen, disponible, req.params.id)
  res.json({ ok: true })
})

router.delete('/:id', requiereAdmin, (req, res) => {
  db.prepare('DELETE FROM productos WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

export default router