import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CommandMenu } from "@/components/command-menu"

export const metadata = {
  title: "FirstByte - CS & STEM Education",
  description: "Empowering the next generation through CS & STEM education",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <CommandMenu />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'