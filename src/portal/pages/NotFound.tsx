import { Link } from "react-router-dom";
import { Button } from "@/portal/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream px-4 text-center">
      <div>
        <div className="font-heading text-6xl font-bold text-primary">404</div>
        <p className="mt-2 text-muted-foreground">Page not found.</p>
      </div>
      <Button asChild variant="coral">
        <Link to="/reports/portal">Back to portal</Link>
      </Button>
    </div>
  );
}
