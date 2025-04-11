import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, Twitter, Linkedin, Bitcoin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="flex items-center text-xl font-bold mb-4">
              <Bitcoin className="h-5 w-5 mr-2 text-primary" />
              <span className="gradient-text">DeFi Genius</span>
            </h3>
            <p className="text-foreground/70 mb-4 max-w-md">
              AI-powered lending platform for smarter decentralized finance on Rootstock.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#dashboard" className="text-foreground/70 hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="#ai-advisor" className="text-foreground/70 hover:text-primary transition-colors">
                  AI Advisor
                </Link>
              </li>
              <li>
                <Link href="#markets" className="text-foreground/70 hover:text-primary transition-colors">
                  Markets
                </Link>
              </li>
              <li>
                <Link href="#calculator" className="text-foreground/70 hover:text-primary transition-colors">
                  Loan Calculator
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
                  Rootstock Docs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
                  thirdweb
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
                  Alchemy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-foreground/60">
          <p>© {new Date().getFullYear()} DeFi Genius. Built for AI BUIDL Lab on Rootstock.</p>
        </div>
      </div>
    </footer>
  )
}

