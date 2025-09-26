"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Container } from "./container";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface NavigationItem {
  href: string;
  label: string;
  target?: "_blank" | "_self";
}

interface SiteHeaderProps {
  logoLabel?: string;
  logoTagline?: string;
  navigation?: NavigationItem[];
  cta?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function SiteHeader({
  logoLabel = "Susan Mohr Art",
  logoTagline,
  navigation = [],
  cta,
  className,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

  const NavLinks = ({
    className,
    onNavigate,
  }: {
    className?: string;
    onNavigate?: () => void;
  }) => (
    <nav className={cn("flex flex-col gap-4 text-lg md:flex-row md:items-center md:text-sm", className)}>
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          target={item.target}
          className="transition-colors hover:text-primary"
          onClick={onNavigate}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-xl transition-colors",
        className,
      )}
    >
      <Container className="relative flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
            {logoLabel}
          </span>
          {logoTagline ? (
            <span className="hidden text-sm text-muted-foreground sm:block">
              {logoTagline}
            </span>
          ) : null}
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <NavLinks />
          {cta ? (
            <Button asChild>
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          ) : null}
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          {cta ? (
            <Button size="sm" asChild>
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          ) : null}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" aria-label="Open navigation">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <NavLinks className="mt-6" onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
