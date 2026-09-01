import { NAV_LINKS, PROFILE } from '../lib/data';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer>
      <div className="footer-logo">
        <Logo size={28} />
      </div>
      <div className="footer-links">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
      <div className="footer-copy">
        © 2026 {PROFILE.name} · v{PROFILE.version}
      </div>
    </footer>
  );
}
