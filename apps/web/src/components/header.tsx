"use client";

import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoMwhehCompact } from "@/components/logo-mwheh";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 mx-auto flex w-full max-w-[1024px] items-center justify-between px-5 py-3">
      {/* Logo only - no dropdown */}
      <div className="flex items-center gap-2">
        <LogoMwhehCompact className="h-8 w-8" />
        <span className="text-lg font-bold">Mwheh</span>
      </div>

      {/* User menu */}
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
