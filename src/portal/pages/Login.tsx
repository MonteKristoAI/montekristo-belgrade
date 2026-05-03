import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Mail, ArrowRight } from "lucide-react";
import { useAuth } from "@/portal/lib/auth";
import { Button } from "@/portal/components/ui/button";
import { Input } from "@/portal/components/ui/input";
import { Label } from "@/portal/components/ui/label";

export default function LoginPage() {
  const { session, signInWithEmail, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  if (!loading && session) return <Navigate to="/reports/portal" replace />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    const { error } = await signInWithEmail(email.trim());
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't send link", { description: error });
      return;
    }
    setSent(true);
    toast.success("Check your inbox", { description: "Magic link is on the way." });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-md font-heading text-lg font-bold"
            style={{ background: "#041122", color: "#FF5C5C" }}
          >
            M
          </div>
          <h1 className="font-heading text-2xl font-semibold text-primary">
            MonteKristo · Client Portal
          </h1>
          <p className="max-w-sm text-center text-sm text-muted-foreground">
            Sign in with your email — we&apos;ll send a one-click magic link.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-8 shadow-sm">
          {sent ? (
            <div className="space-y-3 text-center">
              <Mail className="mx-auto h-10 w-10 text-accent" />
              <h2 className="font-heading text-lg font-semibold text-primary">Check your inbox</h2>
              <p className="text-sm text-muted-foreground">
                We sent a sign-in link to <span className="font-medium text-foreground">{email}</span>.
                It expires in 1 hour.
              </p>
              <Button variant="ghost" size="sm" onClick={() => setSent(false)}>
                Use a different email
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                variant="coral"
                size="lg"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Send magic link"}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                We never use passwords. Each link is single-use and expires automatically.
              </p>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By signing in you agree to our terms. Need help? Email{" "}
          <a href="mailto:contact@montekristobelgrade.com" className="text-accent hover:underline">
            contact@montekristobelgrade.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
