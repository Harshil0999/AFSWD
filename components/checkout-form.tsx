"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, Lock } from "lucide-react"

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

interface CheckoutFormProps {
  items: CartItem[]
  total: number
  onSuccess: () => void
  onCancel: () => void
}

export function CheckoutForm({ items, total, onSuccess, onCancel }: CheckoutFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
    city: "",
    zipCode: "",
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.firstName) newErrors.firstName = "First name is required"
    if (!formData.lastName) newErrors.lastName = "Last name is required"
    if (!formData.cardNumber) newErrors.cardNumber = "Card number is required"
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required"
    if (!formData.cvv) newErrors.cvv = "CVV is required"
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms"

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Basic card number validation (simplified)
    if (formData.cardNumber && formData.cardNumber.replace(/\s/g, "").length < 16) {
      newErrors.cardNumber = "Please enter a valid card number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      onSuccess()
    } catch (error) {
      console.error("Payment failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const totalWithTax = total * 1.1

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <img
                src={item.thumbnail || "/placeholder.svg"}
                alt={item.title}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                <p className="text-xs text-muted-foreground">by {item.instructor}</p>
              </div>
              <span className="text-sm font-medium">${item.price}</span>
            </div>
          ))}
          <Separator />
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${(total * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${totalWithTax.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={errors.firstName ? "border-destructive" : ""}
                />
                {errors.firstName && <p className="text-sm text-destructive mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className={errors.lastName ? "border-destructive" : ""}
                />
                {errors.lastName && <p className="text-sm text-destructive mt-1">{errors.lastName}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Credit/Debit Card
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === "card" && (
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                    className={errors.cardNumber ? "border-destructive" : ""}
                    maxLength={19}
                  />
                  {errors.cardNumber && <p className="text-sm text-destructive mt-1">{errors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                      className={errors.expiryDate ? "border-destructive" : ""}
                    />
                    {errors.expiryDate && <p className="text-sm text-destructive mt-1">{errors.expiryDate}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange("cvv", e.target.value)}
                      className={errors.cvv ? "border-destructive" : ""}
                      maxLength={4}
                    />
                    {errors.cvv && <p className="text-sm text-destructive mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="terms" className="text-sm font-normal">
              I agree to the{" "}
              <Button variant="link" className="p-0 h-auto text-sm">
                Terms of Service
              </Button>{" "}
              and{" "}
              <Button variant="link" className="p-0 h-auto text-sm">
                Privacy Policy
              </Button>
            </Label>
            {errors.agreeToTerms && <p className="text-sm text-destructive">{errors.agreeToTerms}</p>}
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Your payment information is encrypted and secure. We never store your card details.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
            Back to Cart
          </Button>
          <Button type="submit" disabled={isProcessing} className="flex-1">
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Complete Purchase ${totalWithTax.toFixed(2)}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
