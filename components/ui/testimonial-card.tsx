import { cn } from "@/lib/utils"
import Image from "next/image"

export interface TestimonialAuthor {
  name: string
  title?: string
  avatar?: string
}

interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
}

export function TestimonialCard({ author, text, href, className }: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "flex w-[350px] flex-col rounded-xl border p-6 shadow-sm",
        "bg-background text-foreground",
        "dark:bg-background/5 dark:border-white/10",
        className,
      )}
    >
      <div className="flex-1">
        <p className="text-muted-foreground">"{text}"</p>
      </div>
      <div className="mt-6 flex items-center gap-3">
        {author.avatar ? (
          <Image
            src={author.avatar || "/placeholder.svg"}
            alt={author.name}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            {author.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-medium">{author.name}</p>
          {author.title && <p className="text-sm text-muted-foreground">{author.title}</p>}
        </div>
      </div>
    </div>
  )
}

