import Link from "next/link";
import { Container } from "./container";
import { cn } from "@/lib/utils";

export interface FooterLink {
  href: string;
  label: string;
}

interface SiteFooterProps {
  navigation?: FooterLink[];
  copyrightName?: string;
  className?: string;
}

export function SiteFooter({
  navigation = [],
  copyrightName = "Susan Mohr Art",
  className,
}: SiteFooterProps) {
  return (
    <footer
      className={cn(
        "relative border-t border-border/40 bg-background/85 backdrop-blur",
        className,
      )}
    >
      <Container className="relative flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.3em] text-muted-foreground">
            {copyrightName}
          </p>
          <p className="mt-2 text-sm text-muted-foreground/80">
            © {new Date().getFullYear()} Crafted with light, layers, and love.
          </p>
        </div>
        {navigation.length ? (
          <nav className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground/80">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </Container>
    </footer>
  );
}
