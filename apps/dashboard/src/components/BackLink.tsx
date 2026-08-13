import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

export function BackLink({
  href = "/",
  label = "Back to dashboard",
  exitsZone = false,
}: {
  href?: string;
  label?: string;
  /**
   * Set when `href` points outside this Multi-Zone app (e.g. the marketing
   * site's own routes). next/link prefixes basePath, so "/" through a Link
   * lands on /dashboard instead of the site root; a plain anchor is not
   * prefixed and does a full navigation to the other zone. See lib/paths.ts.
   */
  exitsZone?: boolean;
}) {
  return (
    <Button asChild variant="ghost" size="sm">
      {exitsZone ? (
        <a href={href}>
          <ArrowLeft />
          {label}
        </a>
      ) : (
        <Link href={href}>
          <ArrowLeft />
          {label}
        </Link>
      )}
    </Button>
  );
}
