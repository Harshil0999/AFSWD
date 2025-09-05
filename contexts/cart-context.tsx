"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

interface CartItem {
  id: string
  title: string
  instructor: string
  price: number
  originalPrice?: number
  thumbnail: string
  category: string
  level: "Beginner" | "Intermediate" | "Advanced"
  duration: string
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  isOpen: boolean
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      if (existingItem) {
        // Course already in cart, don't add duplicate
        return state
      }

      const newItems = [...state.items, action.payload]
      const newTotal = newItems.reduce((sum, item) => sum + item.price, 0)

      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItems.length,
      }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      const newTotal = newItems.reduce((sum, item) => sum + item.price, 0)

      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItems.length,
      }
    }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
      }

    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: !state.isOpen,
      }

    case "OPEN_CART":
      return {
        ...state,
        isOpen: true,
      }

    case "CLOSE_CART":
      return {
        ...state,
        isOpen: false,
      }

    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false,
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("edustream-cart")
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart)
        cartData.items.forEach((item: CartItem) => {
          dispatch({ type: "ADD_ITEM", payload: item })
        })
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("edustream-cart", JSON.stringify({ items: state.items }))
  }, [state.items])

  const addItem = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" })
  }

  const openCart = () => {
    dispatch({ type: "OPEN_CART" })
  }

  const closeCart = () => {
    dispatch({ type: "CLOSE_CART" })
  }

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        removeItem,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
