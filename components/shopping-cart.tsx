"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCart, Trash2, CreditCard, Lock, X } from "lucide-react"
import { CheckoutForm } from "@/components/checkout-form"

export function CartIcon() {
  const { state, toggleCart } = useCart()

  return (
    <Button variant="ghost" size="sm" onClick={toggleCart} className="relative">
      <ShoppingCart className="h-4 w-4" />
      {state.itemCount > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
          {state.itemCount}
        </Badge>
      )}
    </Button>
  )
}

export function ShoppingCartDrawer() {
  const { state, removeItem, clearCart, closeCart } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-accent/10 text-accent"
      case "Intermediate":
        return "bg-primary/10 text-primary"
      case "Advanced":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted"
    }
  }

  const handleCheckoutSuccess = () => {
    clearCart()
    setShowCheckout(false)
    closeCart()
  }

  if (showCheckout) {
    return (
      <Sheet open={state.isOpen} onOpenChange={closeCart}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Secure Checkout
              </SheetTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowCheckout(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <SheetDescription>Complete your purchase securely</SheetDescription>
          </SheetHeader>

          <div className="mt-6">
            <CheckoutForm
              items={state.items}
              total={state.total}
              onSuccess={handleCheckoutSuccess}
              onCancel={() => setShowCheckout(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={state.isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Shopping Cart ({state.itemCount})
          </SheetTitle>
          <SheetDescription>Review your selected courses before checkout</SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex-1 overflow-y-auto">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">Add some courses to get started with your learning journey</p>
              <Button onClick={closeCart}>Browse Courses</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-2">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">by {item.instructor}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getLevelColor(item.level)} variant="secondary">
                            {item.level}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{item.duration}</span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2">
                            {item.originalPrice && (
                              <span className="text-xs text-muted-foreground line-through">${item.originalPrice}</span>
                            )}
                            <span className="font-bold text-primary">${item.price}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${(state.total * 0.1).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${(state.total * 1.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button className="w-full" onClick={() => setShowCheckout(true)}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
