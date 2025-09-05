"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ValidatedInput } from "@/components/validated-input"
import { useFormValidation } from "@/hooks/use-form-validation"
import { Mail, Lock, User, Loader2 } from "lucide-react"

const signInRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    required: true,
    minLength: 6,
  },
}

const signUpRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    custom: (value: string) => {
      if (value.length < 8) return "Password must be at least 8 characters"
      if (!/(?=.*[a-z])/.test(value)) return "Password must contain at least one lowercase letter"
      if (!/(?=.*[A-Z])/.test(value)) return "Password must contain at least one uppercase letter"
      if (!/(?=.*\d)/.test(value)) return "Password must contain at least one number"
      return null
    },
  },
  confirmPassword: {
    required: true,
    custom: (value: string, data?: any) => {
      if (data && value !== data.password) return "Passwords do not match"
      return null
    },
  },
}

export function AuthSection() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("signin")

  const signInForm = useFormValidation({ email: "", password: "" }, signInRules)

  const signUpForm = useFormValidation(
    { name: "", email: "", password: "", confirmPassword: "" },
    {
      ...signUpRules,
      confirmPassword: {
        ...signUpRules.confirmPassword,
        custom: (value: string) => {
          if (value !== signUpForm.data.password) return "Passwords do not match"
          return null
        },
      },
    },
  )

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signInForm.validateForm()) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Sign in successful:", signInForm.data)
    } catch (error) {
      console.error("Sign in failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signUpForm.validateForm()) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Sign up successful:", signUpForm.data)
    } catch (error) {
      console.error("Sign up failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <Card className="card-theme">
            <CardHeader className="text-center">
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>Sign in to your EduStream account to continue learning</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <ValidatedInput
                  id="signin-email"
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  icon={<Mail className="h-4 w-4" />}
                  value={signInForm.data.email}
                  onChange={(e) => signInForm.handleChange("email", e.target.value)}
                  onBlur={() => signInForm.handleBlur("email")}
                  error={signInForm.errors.email}
                  touched={signInForm.touched.email}
                  required
                />

                <ValidatedInput
                  id="signin-password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  icon={<Lock className="h-4 w-4" />}
                  showPasswordToggle
                  value={signInForm.data.password}
                  onChange={(e) => signInForm.handleChange("password", e.target.value)}
                  onBlur={() => signInForm.handleBlur("password")}
                  error={signInForm.errors.password}
                  touched={signInForm.touched.password}
                  required
                />

                <Button type="submit" className="w-full" disabled={isLoading || !signInForm.isValid}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="text-center">
                  <Button variant="link" className="text-sm text-muted-foreground">
                    Forgot your password?
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card className="card-theme">
            <CardHeader className="text-center">
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Join EduStream and start your learning journey today</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <ValidatedInput
                  id="signup-name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  icon={<User className="h-4 w-4" />}
                  value={signUpForm.data.name}
                  onChange={(e) => signUpForm.handleChange("name", e.target.value)}
                  onBlur={() => signUpForm.handleBlur("name")}
                  error={signUpForm.errors.name}
                  touched={signUpForm.touched.name}
                  helperText="Your display name on the platform"
                  required
                />

                <ValidatedInput
                  id="signup-email"
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  icon={<Mail className="h-4 w-4" />}
                  value={signUpForm.data.email}
                  onChange={(e) => signUpForm.handleChange("email", e.target.value)}
                  onBlur={() => signUpForm.handleBlur("email")}
                  error={signUpForm.errors.email}
                  touched={signUpForm.touched.email}
                  helperText="We'll never share your email with anyone"
                  required
                />

                <ValidatedInput
                  id="signup-password"
                  label="Password"
                  type="password"
                  placeholder="Create a strong password"
                  icon={<Lock className="h-4 w-4" />}
                  showPasswordToggle
                  value={signUpForm.data.password}
                  onChange={(e) => signUpForm.handleChange("password", e.target.value)}
                  onBlur={() => signUpForm.handleBlur("password")}
                  error={signUpForm.errors.password}
                  touched={signUpForm.touched.password}
                  helperText="Must contain uppercase, lowercase, and number"
                  required
                />

                <ValidatedInput
                  id="signup-confirm-password"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  icon={<Lock className="h-4 w-4" />}
                  showPasswordToggle
                  value={signUpForm.data.confirmPassword}
                  onChange={(e) => signUpForm.handleChange("confirmPassword", e.target.value)}
                  onBlur={() => signUpForm.handleBlur("confirmPassword")}
                  error={signUpForm.errors.confirmPassword}
                  touched={signUpForm.touched.confirmPassword}
                  required
                />

                <Button type="submit" className="w-full" disabled={isLoading || !signUpForm.isValid}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By creating an account, you agree to our{" "}
                  <Button variant="link" className="p-0 h-auto text-xs">
                    Terms of Service
                  </Button>{" "}
                  and{" "}
                  <Button variant="link" className="p-0 h-auto text-xs">
                    Privacy Policy
                  </Button>
                </p>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
