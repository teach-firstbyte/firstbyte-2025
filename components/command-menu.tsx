"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList,
  CommandSeparator
} from "@/components/ui/command"
import { 
  Book, 
  Contact, 
  FileCode, 
  HelpCircle, 
  Home, 
  Mail, 
  Moon, 
  Search, 
  Sun, 
  Users
} from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { DialogTitle } from "@/components/ui/dialog"

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const { setTheme, theme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Command Menu</DialogTitle>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/#home"))}
          >
            <Home className="mr-2 h-4 w-4" />
            <span>Home</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/#about"))}
          >
            <FileCode className="mr-2 h-4 w-4" />
            <span>About</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/#programs"))}
          >
            <Book className="mr-2 h-4 w-4" />
            <span>Programs</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/#team"))}
          >
            <Users className="mr-2 h-4 w-4" />
            <span>Team</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/#contact"))}
          >
            <Contact className="mr-2 h-4 w-4" />
            <span>Contact</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))}
          >
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>Toggle Theme</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => window.open("mailto:info@firstbyte.org", "_blank"))}
          >
            <Mail className="mr-2 h-4 w-4" />
            <span>Email us</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/#about"))}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
} 