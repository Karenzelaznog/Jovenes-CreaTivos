import { Router } from 'express'
import db from '../db.js'
import requiereAdmin from '../middleware/auth.js'

const router = Router()
router.use(requiereAdmin) // todo lo de este archivo exige sesión de admin

router.get('/pedidos', (req, res) => {
  res.json(db.prepare('SELECT * FROM pedidos ORDER BY id DESC').all())
})

// Busca la tabla de mensajes de contacto sin depender de su nombre exacto
router.get('/mensajes', (req, res) => {
  const t = db.prepare(`
    SELECT name FROM sqlite_master
    WHERE type = 'table' AND (name LIKE '%contacto%' OR name LIKE '%mensaje%') LIMIT 1
  `).get()
  if (!t) return res.json([])
  res.json(db.prepare(`SELECT * FROM "${t.name}" ORDER BY rowid DESC`).all())
})

export default router