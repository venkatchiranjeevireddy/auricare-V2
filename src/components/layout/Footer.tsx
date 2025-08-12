import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-10 grid gap-8 md:grid-cols-4">
        <div>
          <Link to="/" className="font-heading text-lg">AuriCare</Link>
          <p className="mt-2 text-sm text-muted-foreground">Calm, accessible autism support for families and therapists.</p>
          <div className="mt-4">
            <label htmlFor="language" className="text-sm text-muted-foreground">Language</label>
            <select id="language" className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
              <option>English</option>
              <option>Español</option>
              <option>Français</option>
              <option>Deutsch</option>
              <option>हिन्दी</option>
              <option>中文</option>
              <option>日本語</option>
              <option>한국어</option>
              <option>Português</option>
              <option>العربية</option>
            </select>
          </div>
        </div>

        <div>
          <h3 className="font-medium">Product</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/chatbot">Chatbot</Link></li>
            <li><Link to="/dashboard">Progress</Link></li>
            <li><Link to="/appointments">Teletherapy</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/team">Team</Link></li>
            <li><Link to="/community">Community</Link></li>
            <li><Link to="/resources">Resources</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium">Legal</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacy">Privacy & Compliance</Link></li>
            <li><Link to="/contact">Contact / Emergency</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto py-6 text-sm text-muted-foreground flex items-center justify-between">
          <p>© {new Date().getFullYear()} AuriCare. All rights reserved.</p>
          <Link to="/privacy">HIPAA/GDPR</Link>
        </div>
      </div>
    </footer>
  );
}
