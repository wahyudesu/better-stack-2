import { ChevronDown, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 mx-auto flex w-full max-w-[1024px] items-center justify-between px-5 py-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 rounded-xl border border-border/60 bg-card/90 px-3 shadow-sm backdrop-blur-xl text-sm font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
              A
            </div>
            Acme Corp
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem>
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground">A</div>
            <span className="ml-2">Acme Corp</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex h-6 w-6 items-center justify-center rounded bg-success text-xs font-bold text-success-foreground">S</div>
            <span className="ml-2">Side Project</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Create workspace...</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full border border-border/60 bg-card/90 shadow-sm backdrop-blur-xl">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://i.pravatar.cc/150?u=admin" />
              <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Preferences</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
