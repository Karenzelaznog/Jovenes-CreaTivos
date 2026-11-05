import { Router } from 'express'
import db from '../db.js'

const router = Router()

// GET /api/productos           -> todos los productos
// GET /api/productos?coleccion=cinnamoroll -> solo de una colección
router.get('/', (req, res) => {
  const { coleccion } = req.query
  const productos = coleccion
    ? db.prepare('SELECT * FROM productos WHERE coleccion = ? ORDER BY id').all(coleccion)
    : db.prepare('SELECT * FROM productos ORDER BY id').all()
  res.json(productos)
})

// GET /api/productos/1 -> un producto por su id
router.get('/:id', (req, res) => {
  const producto = db.prepare('SELECT * FROM productos WHERE id = ?').get(req.params.id)
  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' })
  }
  res.json(producto)
})

export default router