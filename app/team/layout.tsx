import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Team Directory | FirstByte",
  description: "Meet the talented individuals behind FirstByte who are dedicated to bringing coding education to young learners everywhere.",
  openGraph: {
    title: "Team Directory | FirstByte",
    description: "Meet the talented individuals behind FirstByte who are dedicated to bringing coding education to young learners everywhere.",
    url: "/team",
    siteName: "FirstByte",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Team Directory | FirstByte",
    description: "Meet the talented individuals behind FirstByte who are dedicated to bringing coding education to young learners everywhere.",
  },
}

export default function TeamLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {children}
    </>
  )
} 