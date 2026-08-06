import { MessageSquarePlus } from "lucide-react";
import { Button } from "./ui/button";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScxQObKPt3h9o1rvlRTabEvoI2ogJnzFIVKqDumV02j5ME67A/viewform?usp=header";

export function SuggestionBoxLink() {
  return (
    <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
      <a href={FORM_URL} target="_blank" rel="noopener noreferrer">
        <MessageSquarePlus className="size-4" />
        Share feedback or suggestions
      </a>
    </Button>
  );
}
