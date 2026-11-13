import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import db from './db.js'
import productosRouter from './routes/productos.js'
import contactoRouter from './routes/contacto.js'
import authRoutes from './routes/auth.js'
import pedidosRoutes from './routes/pedidos.js'
import adminRoutes from './routes/admin.js'
import chatRoutes from './routes/chat.js'

// Si la base está vacía (el hosting gratis borra los archivos al reiniciar), se llena sola
const tabla = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='productos'").get()
const total = tabla ? db.prepare('SELECT COUNT(*) AS n FROM productos').get().n : 0
if (total === 0) await import('./seed.js')

const app = express()
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'

// Detrás del proxy de Render, para que req.ip sea la IP real del visitante
app.set('trust proxy', 1)

// Frontends permitidos: cualquier localhost y la dirección publicada (FRONTEND_URL)
const permitidos = [process.env.FRONTEND_URL].filter(Boolean)
app.use(cors({
  origin: (origin, cb) =>
    cb(null,
      !origin ||
      /^http:\/\/(?:localhost|127\.0\.0\.1):\d+$/.test(origin) ||
      permitidos.includes(origin)
    ),
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

// Ruta de prueba para comprobar que la API responde
app.get('/api/salud', (req, res) => {
  res.json({ ok: true, mensaje: 'API de SKINCARY funcionando' })
})

app.use('/api/auth', authRoutes)
app.use('/api/productos', productosRouter)
app.use('/api/contacto', contactoRouter)
app.use('/api/pedidos', pedidosRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/chat', chatRoutes)

app.listen(PORT, HOST, () => {
  console.log(`API de SKINCARY escuchando en http://${HOST}:${PORT}`)
})