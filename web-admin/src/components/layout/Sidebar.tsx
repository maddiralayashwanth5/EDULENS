import { Link, useLocation } from "react-router-dom";
import { 
  GraduationCap, 
  LayoutDashboard, 
  School, 
  Upload, 
  FileText, 
  Users, 
  Settings,
  MessageSquare,
  BarChart3,
  Shield,
  Building2,
  BookOpen,
  Landmark,
  Library,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/institutions", icon: Building2, label: "All Institutions", section: "Institutions" },
  { href: "/schools", icon: School, label: "Schools" },
  { href: "/colleges", icon: GraduationCap, label: "Colleges" },
  { href: "/universities", icon: Landmark, label: "Universities" },
  { href: "/coaching", icon: BookOpen, label: "Coaching Centers" },
  { href: "/societies", icon: Library, label: "Educational Societies" },
  { href: "/vocational", icon: Briefcase, label: "Vocational Institutes" },
  { href: "/upload", icon: Upload, label: "Upload Data", section: "Management" },
  { href: "/reviews", icon: MessageSquare, label: "Reviews" },
  { href: "/complaints", icon: FileText, label: "Complaints" },
  { href: "/verification", icon: Shield, label: "Verification" },
  { href: "/users", icon: Users, label: "Users" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-[hsl(var(--sidebar))]">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-[hsl(var(--primary))]" />
            <span className="text-xl font-bold text-[hsl(var(--primary))]">EduLens</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                    : "text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--accent))]"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center text-white font-medium">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">admin@edulens.in</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
