import { Link } from "@tanstack/react-router";
import { navItems } from "@/lib/pages";
import { ThemeToggle } from "@/components/ThemeAutoSync";

export function Navbar() {
  return (
    <div className="flex items-center justify-between gap-3">
      <Link
        to="/"
        className="text-sm font-semibold tracking-tight transition hover:opacity-80"
      >
        Blog Meow
      </Link>
      <nav className="flex items-center gap-2">
        {navItems.map((item) => (
          <Link
            key={item.slug}
            to="/$slug"
            params={{ slug: item.slug }}
            className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            activeProps={{ className: "text-foreground font-medium" }}
          >
            {item.label}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </div>
  );
}
