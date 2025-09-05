"use client"

import type React from "react"

import { forwardRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  touched?: boolean
  success?: boolean
  showPasswordToggle?: boolean
  icon?: React.ReactNode
  helperText?: string
}

export const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
  (
    { label, error, touched, success, showPasswordToggle, icon, helperText, className, type = "text", ...props },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const hasError = touched && error
    const hasSuccess = touched && !error && props.value

    const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type

    return (
      <div className="space-y-2">
        <Label htmlFor={props.id} className="text-sm font-medium">
          {label}
          {props.required && <span className="text-destructive ml-1">*</span>}
        </Label>

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">{icon}</div>
          )}

          <Input
            ref={ref}
            type={inputType}
            className={cn(
              "transition-all duration-200",
              icon && "pl-10",
              showPasswordToggle && "pr-10",
              hasError && "border-destructive focus:border-destructive focus:ring-destructive/20",
              hasSuccess && "border-accent focus:border-accent focus:ring-accent/20",
              className,
            )}
            {...props}
          />

          {showPasswordToggle && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          )}

          {hasSuccess && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <CheckCircle className="h-4 w-4 text-accent" />
            </div>
          )}

          {hasError && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
          )}
        </div>

        {hasError && (
          <p className="text-sm text-destructive flex items-center animate-in slide-in-from-left-1 duration-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            {error}
          </p>
        )}

        {helperText && !hasError && <p className="text-xs text-muted-foreground">{helperText}</p>}
      </div>
    )
  },
)

ValidatedInput.displayName = "ValidatedInput"
