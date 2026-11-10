// Crea tablas y carga los 40 productos. Crea un usuario admin si hay credenciales configuradas.
// Ejecutar desde /backend: node seed.js
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import db from './db.js'

db.exec(`
  DROP TABLE IF EXISTS productos;
  CREATE TABLE productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero TEXT NOT NULL,
    categoria TEXT NOT NULL,      -- 'skincare' | 'accesorios'
    coleccion TEXT,               -- 'basic' | 'premium' | NULL
    nombre TEXT NOT NULL,
    precio INTEGER NOT NULL,      -- pesos colombianos
    descripcion TEXT,
    imagen TEXT,
    disponible INTEGER DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT UNIQUE NOT NULL,
    clave_hash TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT, telefono TEXT, ciudad TEXT, direccion TEXT,
    entrega TEXT, observaciones TEXT,
    detalle TEXT, total INTEGER,
    creado TEXT DEFAULT CURRENT_TIMESTAMP
  );
`)

// [numero, nombre, precio, descripcion]  (impares = BASIC, pares = PREMIUM)
const skincare = [
  ['01', 'Escudo Diario SPF 50', 68000, 'Protector solar facial. Envase blanco con detalles azul cielo.'],
  ['02', 'CinnaShield Ultra SPF 50+', 89000, 'Protector solar facial. Azul hielo con detalles plateados.'],
  ['03', 'Espuma Suave Limpiadora', 52000, 'Limpiador facial en espuma. Envase blanco y azul pastel.'],
  ['04', 'CinnaCloud Deep Clean', 72000, 'Limpiador facial premium con detalles plateados.'],
  ['05', 'Hidratante Ligero 24H', 59000, 'Crema hidratante facial. Envase blanco con azul cielo.'],
  ['06', 'CinnaCloud Hydro Barrier', 82000, 'Hidratante facial premium. Envase blanco y azul hielo.'],
  ['07', 'CinnaSoft Rice Scrub', 45000, 'Exfoliante facial de arroz. Envase pequeño y elegante.'],
  ['08', 'CinnaGlow Renewal', 69000, 'Exfoliante facial premium. Envase elegante.'],
  ['09', 'CinnaMilk Soft Mask', 39000, 'Mascarilla facial suave. Envase blanco con azul pastel.'],
  ['10', 'CinnaDream Hydro Mask', 58000, 'Mascarilla facial hidratante. Presentación premium.'],
  ['11', 'CinnaBright Vitamin Serum', 55000, 'Sérum facial con vitaminas. Frasco con gotero.'],
  ['12', 'CinnaBright Radiance Pro', 85000, 'Sérum facial premium. Gotero con detalles plateados.'],
  ['13', 'CinnaFresh Balance Toner', 42000, 'Tónico facial. Botella blanca y azul cielo.'],
  ['14', 'CinnaBalance Niacin Toner', 65000, 'Tónico facial premium. Botella elegante.'],
  ['15', 'CinnaEyes Soft Cream', 48000, 'Crema para el contorno de ojos. Envase pequeño y delicado.'],
  ['16', 'CinnaEyes Revive Peptide', 75000, 'Tratamiento premium para contorno de ojos.'],
  ['17', 'CinnaPure Clay Mask', 43000, 'Mascarilla de arcilla. Envase tipo tarro.'],
  ['18', 'CinnaPure Detox Complex', 62000, 'Mascarilla facial premium. Envase azul hielo.'],
  ['19', 'CinnaLips Sweet Balm', 25000, 'Bálsamo labial. Envase pequeño, bonito y práctico.'],
  ['20', 'CinnaLips Repair Butter', 39000, 'Bálsamo labial reparador. Presentación premium.'],
]

const accesorios = [
  ['01', 'SkinnaRoll Cloud Pouch', 35000, 'Cosmetiquera pequeña con diseño de nube.'],
  ['02', 'CinnaSkin Dream Band', 22000, 'Banda para recoger el cabello durante la rutina facial.'],
  ['03', 'SkinCinna Soft Scrunchie', 15000, 'Coletero de tela suave.'],
  ['04', 'CinnaRoll Beauty Case', 48000, 'Cosmetiquera de mayor tamaño.'],
  ['05', 'CinnaCloud Wristies', 18000, 'Muñequeras para que el agua no baje por los brazos al lavarte la cara.'],
  ['06', 'SkinnaRoll Face Towel', 20000, 'Toalla facial suave.'],
  ['07', 'CinnaMirror Glow', 19000, 'Espejo compacto.'],
  ['08', 'SkinCinna Mask Brush', 16000, 'Brocha para aplicar mascarillas.'],
  ['09', 'CinnaCloud Hair Clip', 17000, 'Pinza para el cabello.'],
  ['10', 'SkinnaRoll Travel Drops', 28000, 'Envases pequeños para llevar tus productos en viajes.'],
  ['11', 'CinnaSoft Beauty Sponge', 14000, 'Esponja suave de belleza.'],
  ['12', 'SkinCinna Hair Cloud', 29000, 'Toalla tipo turbante para el cabello.'],
  ['13', 'CinnaGlow Organizer', 32000, 'Organizador de productos de belleza.'],
  ['14', 'SkinnaRoll Sleep Mask', 24000, 'Antifaz suave para dormir.'],
  ['15', 'CinnaSkin Spa Gloves', 21000, 'Guantes suaves para rutinas de cuidado personal.'],
  ['16', 'CinnaSkin Spa Day Set', 38000, 'Combo: banda para el cabello y muñequeras.'],
  ['17', 'SkinnaRoll Travel Beauty Kit', 55000, 'Kit: cosmetiquera pequeña, toalla facial y coletero.'],
  ['18', 'CinnaGlow Facial Ritual', 39000, 'Kit: brocha para mascarillas, espejo compacto y esponja.'],
  ['19', 'CinnaCloud Hair Care Duo', 43000, 'Dúo: turbante para el cabello y pinza.'],
  ['20', 'SkinnaRoll Dream Collection', 69000, 'Colección: cosmetiquera grande, antifaz y organizador pequeño.'],
]

const insertar = db.prepare(`
  INSERT INTO productos (numero, categoria, coleccion, nombre, precio, descripcion, imagen)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`)

db.exec('BEGIN')
try {
  for (const [numero, nombre, precio, descripcion] of skincare) {
    const coleccion = Number(numero) % 2 === 1 ? 'basic' : 'premium'
    insertar.run(numero, 'skincare', coleccion, nombre, precio, descripcion, `/img/skincare-${numero}.jpg`)
  }
  for (const [numero, nombre, precio, descripcion] of accesorios) {
    insertar.run(numero, 'accesorios', null, nombre, precio, descripcion, `/img/accesorio-${numero}.jpg`)
  }

  if (process.env.ADMIN_USER && process.env.ADMIN_PASS) {
    const hash = bcrypt.hashSync(process.env.ADMIN_PASS, 10)
    db.prepare('INSERT OR REPLACE INTO usuarios (id, usuario, clave_hash) VALUES (1, ?, ?)')
      .run(process.env.ADMIN_USER, hash)
  } else {
    console.warn('Se omitió crear el usuario admin: configura ADMIN_USER y ADMIN_PASS en .env.')
  }

  db.exec('COMMIT')
  console.log('Listo: 40 productos cargados.')
} catch (e) {
  db.exec('ROLLBACK')
  console.error('Error en seed:', e)
}