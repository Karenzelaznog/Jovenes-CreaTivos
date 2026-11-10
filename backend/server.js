import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import productosRouter from './routes/productos.js'
import contactoRouter from './routes/contacto.js'
import pedidosRoutes from './routes/pedidos.js'
import adminRoutes from './routes/admin.js'
import authRoutes from './routes/auth.js'

const app = express()
const PORT = process.env.PORT || 3000

// Permite que el frontend (otro puerto) hable con esta API y envíe cookies
app.use(cors({
  origin: (origin, cb) => cb(null, !origin || /^http:\/\/(?:localhost|127\.0\.0\.1):\d+$/.test(origin)),
  credentials: true,
}))
app.use(express.json())
// Permite leer la cookie con el token de sesión
app.use(cookieParser())

// Ruta de prueba para comprobar que la API responde
app.get('/api/salud', (req, res) => {
  res.json({ ok: true, mensaje: 'API de SKINCARY funcionando' })
})

// Rutas de la API
app.use('/api/auth', authRoutes)
app.use('/api/productos', productosRouter)
app.use('/api/pedidos', pedidosRoutes)
app.use('/api/contacto', contactoRouter)
app.use('/api/admin', adminRoutes)

app.listen(PORT, () => {
  console.log(`API de SKINCARY escuchando en http://localhost:${PORT}`)
})