import { Link, useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/portal/lib/auth";
import { Button } from "@/portal/components/ui/button";

export function AppHeader() {
  const { user, isMkAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/reports/portal/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-cream/85 backdrop-blur supports-[backdrop-filter]:bg-cream/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/reports/portal" className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-md font-heading text-base font-bold"
            style={{ background: "#041122", color: "#FF5C5C" }}
            aria-hidden
          >
            M
          </div>
          <div className="leading-tight">
            <div className="font-heading font-semibold text-primary">MonteKristo</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Client Portal
            </div>
          </div>
        </Link>
        {user ? (
          <div className="flex items-center gap-3">
            {isMkAdmin && (
              <Link
                to="/reports/portal/admin"
                className="flex items-center gap-1.5 rounded-md border border-coral px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/5"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin
              </Link>
            )}
            <span className="hidden text-xs text-muted-foreground md:inline">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Sign out</span>
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
