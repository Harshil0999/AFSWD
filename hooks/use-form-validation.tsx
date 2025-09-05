"use client"

import { useState, useCallback, useEffect } from "react"

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | null
}

interface ValidationRules {
  [key: string]: ValidationRule
}

interface ValidationErrors {
  [key: string]: string
}

interface FormData {
  [key: string]: string
}

export function useFormValidation(initialData: FormData, rules: ValidationRules) {
  const [data, setData] = useState<FormData>(initialData)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})
  const [isValid, setIsValid] = useState(false)

  const validateField = useCallback(
    (name: string, value: string): string | null => {
      const rule = rules[name]
      if (!rule) return null

      // Required validation
      if (rule.required && (!value || value.trim() === "")) {
        return "This field is required"
      }

      // Skip other validations if field is empty and not required
      if (!value && !rule.required) return null

      // Min length validation
      if (rule.minLength && value.length < rule.minLength) {
        return `Must be at least ${rule.minLength} characters`
      }

      // Max length validation
      if (rule.maxLength && value.length > rule.maxLength) {
        return `Must be no more than ${rule.maxLength} characters`
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        if (name === "email") return "Please enter a valid email address"
        if (name === "password")
          return "Password must contain at least 8 characters, one uppercase, one lowercase, and one number"
        if (name === "cardNumber") return "Please enter a valid card number"
        if (name === "expiryDate") return "Please enter a valid expiry date (MM/YY)"
        if (name === "cvv") return "Please enter a valid CVV"
        return "Invalid format"
      }

      // Custom validation
      if (rule.custom) {
        return rule.custom(value)
      }

      return null
    },
    [rules],
  )

  const validateForm = useCallback(() => {
    const newErrors: ValidationErrors = {}
    let formIsValid = true

    Object.keys(rules).forEach((name) => {
      const error = validateField(name, data[name] || "")
      if (error) {
        newErrors[name] = error
        formIsValid = false
      }
    })

    setErrors(newErrors)
    setIsValid(formIsValid)
    return formIsValid
  }, [data, rules, validateField])

  const handleChange = useCallback(
    (name: string, value: string) => {
      setData((prev) => ({ ...prev, [name]: value }))

      // Real-time validation for touched fields
      if (touched[name]) {
        const error = validateField(name, value)
        setErrors((prev) => ({
          ...prev,
          [name]: error || "",
        }))
      }
    },
    [touched, validateField],
  )

  const handleBlur = useCallback(
    (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }))

      const error = validateField(name, data[name] || "")
      setErrors((prev) => ({
        ...prev,
        [name]: error || "",
      }))
    },
    [data, validateField],
  )

  const reset = useCallback(() => {
    setData(initialData)
    setErrors({})
    setTouched({})
    setIsValid(false)
  }, [initialData])

  // Validate form whenever data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      validateForm()
    }, 100)

    return () => clearTimeout(timer)
  }, [data, validateForm])

  return {
    data,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    validateForm,
    reset,
    setData,
  }
}
