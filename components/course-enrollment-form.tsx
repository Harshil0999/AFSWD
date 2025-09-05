"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ValidatedInput } from "@/components/validated-input"
import { useFormValidation } from "@/hooks/use-form-validation"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Mail, Phone, GraduationCap, Target, Loader2, CheckCircle } from "lucide-react"

interface Course {
  id: string
  title: string
  instructor: string
  price: number
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
}

interface CourseEnrollmentFormProps {
  course: Course
  onSuccess?: () => void
  onCancel?: () => void
}

const enrollmentRules = {
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    required: true,
    pattern: /^[+]?[1-9][\d]{0,15}$/,
  },
  experience: {
    required: true,
  },
  goals: {
    required: true,
    minLength: 10,
    maxLength: 500,
  },
}

export function CourseEnrollmentForm({ course, onSuccess, onCancel }: CourseEnrollmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useFormValidation(
    {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      experience: "",
      goals: "",
    },
    enrollmentRules,
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.validateForm()) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsSuccess(true)
      setTimeout(() => {
        onSuccess?.()
      }, 1500)
    } catch (error) {
      console.error("Enrollment failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="card-theme">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-accent" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Enrollment Successful!</h3>
          <p className="text-muted-foreground mb-4">
            Welcome to {course.title}! You'll receive a confirmation email shortly with access details.
          </p>
          <Button onClick={onSuccess} className="w-full">
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-theme">
      <CardHeader>
        <CardTitle className="flex items-center">
          <GraduationCap className="h-5 w-5 mr-2" />
          Enroll in Course
        </CardTitle>
        <CardDescription>Complete your enrollment for {course.title}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Course Summary */}
        <div className="bg-muted/30 p-4 rounded-lg mb-6">
          <h4 className="font-semibold mb-2">{course.title}</h4>
          <p className="text-sm text-muted-foreground mb-3">by {course.instructor}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <Badge variant="outline">{course.level}</Badge>
              <span>{course.duration}</span>
            </div>
            <span className="text-lg font-bold text-primary">${course.price}</span>
          </div>
        </div>

        <Separator className="mb-6" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h5 className="font-medium flex items-center">
              <User className="h-4 w-4 mr-2" />
              Personal Information
            </h5>

            <div className="grid grid-cols-2 gap-4">
              <ValidatedInput
                id="firstName"
                label="First Name"
                placeholder="John"
                value={form.data.firstName}
                onChange={(e) => form.handleChange("firstName", e.target.value)}
                onBlur={() => form.handleBlur("firstName")}
                error={form.errors.firstName}
                touched={form.touched.firstName}
                required
              />

              <ValidatedInput
                id="lastName"
                label="Last Name"
                placeholder="Doe"
                value={form.data.lastName}
                onChange={(e) => form.handleChange("lastName", e.target.value)}
                onBlur={() => form.handleBlur("lastName")}
                error={form.errors.lastName}
                touched={form.touched.lastName}
                required
              />
            </div>

            <ValidatedInput
              id="email"
              label="Email Address"
              type="email"
              placeholder="john.doe@example.com"
              icon={<Mail className="h-4 w-4" />}
              value={form.data.email}
              onChange={(e) => form.handleChange("email", e.target.value)}
              onBlur={() => form.handleBlur("email")}
              error={form.errors.email}
              touched={form.touched.email}
              helperText="Course updates and materials will be sent here"
              required
            />

            <ValidatedInput
              id="phone"
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 123-4567"
              icon={<Phone className="h-4 w-4" />}
              value={form.data.phone}
              onChange={(e) => form.handleChange("phone", e.target.value)}
              onBlur={() => form.handleBlur("phone")}
              error={form.errors.phone}
              touched={form.touched.phone}
              helperText="For important course notifications"
              required
            />
          </div>

          {/* Experience Level */}
          <div className="space-y-4">
            <h5 className="font-medium">Experience Level</h5>
            <RadioGroup value={form.data.experience} onValueChange={(value) => form.handleChange("experience", value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner">Beginner - New to this topic</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate">Intermediate - Some experience</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced">Advanced - Extensive experience</Label>
              </div>
            </RadioGroup>
            {form.touched.experience && form.errors.experience && (
              <p className="text-sm text-destructive">{form.errors.experience}</p>
            )}
          </div>

          {/* Learning Goals */}
          <div className="space-y-2">
            <Label htmlFor="goals" className="flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Learning Goals
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Textarea
              id="goals"
              placeholder="What do you hope to achieve from this course? What specific skills or knowledge are you looking to gain?"
              value={form.data.goals}
              onChange={(e) => form.handleChange("goals", e.target.value)}
              onBlur={() => form.handleBlur("goals")}
              className={`min-h-[100px] transition-all duration-200 ${
                form.touched.goals && form.errors.goals
                  ? "border-destructive focus:border-destructive"
                  : form.touched.goals && !form.errors.goals && form.data.goals
                    ? "border-accent focus:border-accent"
                    : ""
              }`}
              maxLength={500}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {form.touched.goals && form.errors.goals && (
                  <span className="text-destructive">{form.errors.goals}</span>
                )}
              </span>
              <span>{form.data.goals.length}/500</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !form.isValid} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Enroll Now - $${course.price}`
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
