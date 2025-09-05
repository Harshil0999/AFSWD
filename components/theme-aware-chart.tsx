"use client"

import type React from "react"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface ThemeAwareChartProps {
  children: React.ReactNode
}

export function ThemeAwareChart({ children }: ThemeAwareChartProps) {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[300px] bg-muted animate-pulse rounded" />
  }

  const currentTheme = theme === "system" ? systemTheme : theme
  const isDark = currentTheme === "dark"

  return (
    <div
      className="transition-colors duration-300 ease-in-out"
      style={
        {
          "--recharts-text-fill": isDark ? "hsl(var(--foreground))" : "hsl(var(--foreground))",
          "--recharts-grid-stroke": isDark ? "hsl(var(--border))" : "hsl(var(--border))",
          "--recharts-tooltip-bg": isDark ? "hsl(var(--popover))" : "hsl(var(--popover))",
          "--recharts-tooltip-border": isDark ? "hsl(var(--border))" : "hsl(var(--border))",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}
