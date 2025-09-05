import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { CartIcon, ShoppingCartDrawer } from "@/components/shopping-cart"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">ES</span>
            </div>
            <span className="text-xl font-bold">EduStream</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#courses" className="text-muted-foreground hover:text-foreground transition-colors">
            Courses
          </Link>
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <CartIcon />
          <Button variant="outline" size="sm">
            Sign In
          </Button>
          <Button size="sm">Get Started</Button>
        </div>
      </div>

      <ShoppingCartDrawer />
    </header>
  )
}
