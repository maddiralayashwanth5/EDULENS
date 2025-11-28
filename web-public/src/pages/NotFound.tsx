import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[hsl(var(--primary))]/20">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold mt-4 mb-2">Page Not Found</h2>
        <p className="text-[hsl(var(--muted-foreground))] mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button><Home className="mr-2 h-4 w-4" /> Go Home</Button>
          </Link>
          <Link to="/schools">
            <Button variant="outline"><Search className="mr-2 h-4 w-4" /> Browse Schools</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
