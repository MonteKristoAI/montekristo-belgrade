import { type ReactNode } from "react";
import { AppHeader } from "./AppHeader";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <AppHeader />
      <main className="container flex-1 py-8 animate-fade-in">{children}</main>
      <footer className="border-t bg-cream/60 py-6">
        <div className="container flex items-center justify-between text-xs text-muted-foreground">
          <div>© MonteKristo AI · montekristobelgrade.com</div>
          <a href="mailto:contact@montekristobelgrade.com" className="hover:text-accent">
            contact@montekristobelgrade.com
          </a>
        </div>
      </footer>
    </div>
  );
}
