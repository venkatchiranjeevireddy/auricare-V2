import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/features", label: "Features" },
  { to: "/chatbot", label: "Chatbot" },
  { to: "/dashboard", label: "Progress" },
  { to: "/appointments", label: "Appointments" },
  { to: "/community", label: "Community" },
  { to: "/resources", label: "Resources" },
  { to: "/team", label: "Team" },
  { to: "/about", label: "About" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-heading text-xl">
          <span className="inline-block h-4 w-4 rounded-full bg-primary shadow-[var(--shadow-glow)]" aria-hidden />
          AuriCare
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition-colors hover:text-foreground ${isActive ? 'text-foreground' : 'text-muted-foreground'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/contact"><Button variant="glow" size="sm">Get Started</Button></Link>
        </div>

        <button className="md:hidden p-2" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          <Menu className="size-6" />
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-3 grid grid-cols-2 gap-3">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className="text-sm text-muted-foreground" onClick={() => setOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <Link to="/contact" onClick={() => setOpen(false)} className="col-span-2"><Button className="w-full" variant="glow">Create profile</Button></Link>
          </nav>
        </div>
      )}
    </header>
  );
}
