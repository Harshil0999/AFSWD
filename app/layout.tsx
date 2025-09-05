import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/contexts/cart-context"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "EduStream - Online Learning Platform",
  description: "Interactive online courses with multimedia-rich content and personalized learning experiences",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
            storageKey="edustream-theme"
          >
            <CartProvider>{children}</CartProvider>
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
