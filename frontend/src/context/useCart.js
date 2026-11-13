import { useContext } from 'react'
import { CartContext } from './cartContext.js'

export const useCart = () => useContext(CartContext)
