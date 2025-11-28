import { Link } from "react-router-dom";
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const footerLinks = {
  product: [
    { href: "/institutions", label: "Explore Institutions" },
    { href: "/institutions?type=school", label: "Schools" },
    { href: "/institutions?type=college", label: "Colleges" },
    { href: "/institutions?type=coaching", label: "Coaching Centers" },
    { href: "/compare", label: "Compare" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[hsl(var(--muted))] border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <GraduationCap className="h-8 w-8 text-[hsl(var(--primary))]" />
              <span className="text-xl font-bold text-[hsl(var(--primary))]">EduLens</span>
            </Link>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
              Empowering parents to make informed decisions about their children's education.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
          <p>&copy; {new Date().getFullYear()} EduLens. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
