"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

const ORDER = ["light", "dark", "system"] as const;

type Mode = (typeof ORDER)[number];

const LABELS: Record<Mode, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

const ICONS: Record<Mode, React.ComponentType<{ className?: string }>> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  // `theme` is undefined until next-themes reads storage on the client. Render a
  // same-size placeholder so the button doesn't resize or swap icons on hydration.
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon-sm"
        className={className}
        disabled
        aria-hidden
      />
    );
  }

  const current = (ORDER.find((m) => m === theme) ?? "system") as Mode;
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
  const Icon = ICONS[current];

  return (
    <Button
      variant="outline"
      size="icon-sm"
      className={className}
      onClick={() => setTheme(next)}
      title={`Theme: ${LABELS[current]} — click for ${LABELS[next].toLowerCase()}`}
      aria-label={`Theme: ${LABELS[current]}. Switch to ${LABELS[next].toLowerCase()}.`}
    >
      <Icon className="size-4" />
      <span className="sr-only">Current theme: {LABELS[current]}</span>
    </Button>
  );
}
