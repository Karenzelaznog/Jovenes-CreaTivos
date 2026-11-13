import { useContext } from 'react'
import { CarritoContexto } from './carritoContexto.js'

// Hook para usar el carrito desde cualquier componente
export function useCart() {
  const ctx = useContext(CarritoContexto)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}