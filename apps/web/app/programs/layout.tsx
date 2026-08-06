import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "FirstByte - Programs",
  description: "Explore our comprehensive range of programs designed to inspire, educate, and empower the next generation.",
}

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar activeSection="programs" />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
} 