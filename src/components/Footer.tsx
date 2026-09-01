import { NAV_LINKS, PROFILE } from '../lib/data';

export function Footer() {
  return (
    <footer>
      <div className="footer-name">{PROFILE.name}</div>
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
