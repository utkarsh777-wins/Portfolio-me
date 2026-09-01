import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type RefObject } from 'react';
import { HAS_RESUME, NAV_LINKS, PROFILE } from '../lib/data';
import { useMediaQuery } from '../hooks/useMediaQuery';

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contactBtnRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const contactId = useId();

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setContactOpen(false);
        setMenuOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setContactOpen(false);
        setMenuOpen(false);
        contactBtnRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setMenuOpen(false);
      setContactOpen(false);
    }
  }, [isMobile]);

  const closeAll = () => {
    setContactOpen(false);
    setMenuOpen(false);
  };

  return (
    <>
      {isMobile && menuOpen && (
        <button
          className="nav-backdrop"
          type="button"
          aria-label="Close menu"
          onClick={closeAll}
        />
      )}
      <header className={`nav-wrap${isMobile ? ' is-mobile' : ''}`} ref={wrapperRef}>
        <nav className="nav-pill" aria-label="Primary">
          {!isMobile && (
            <ul className="nav-links">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
              <li>
                <ContactMenu
                  open={contactOpen}
                  setOpen={setContactOpen}
                  hasResume={HAS_RESUME}
                  menuId={contactId}
                  buttonRef={contactBtnRef}
                />
              </li>
            </ul>
          )}

          {isMobile && (
            <button
              className={`nav-burger${menuOpen ? ' is-open' : ''}`}
              type="button"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => {
                setContactOpen(false);
                setMenuOpen((v) => !v);
              }}
            >
              <span />
              <span />
            </button>
          )}
        </nav>

        {isMobile && menuOpen && (
          <div className="nav-sheet" id={menuId}>
            {NAV_LINKS.map((link) => (
              <a key={link.href} className="nav-sheet-item" href={link.href} onClick={closeAll}>
                {link.label}
              </a>
            ))}
            <button
              className="nav-sheet-item"
              type="button"
              aria-expanded={contactOpen}
              onClick={() => setContactOpen((v) => !v)}
            >
              Contact
            </button>
            {contactOpen && (
              <>
                <a className="nav-sheet-item is-nested" href={`mailto:${PROFILE.email}`} onClick={closeAll}>
                  Email
                </a>
                <a
                  className="nav-sheet-item is-nested"
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeAll}
                >
                  LinkedIn
                </a>
                <a
                  className="nav-sheet-item is-nested"
                  href={PROFILE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeAll}
                >
                  GitHub
                </a>
                {HAS_RESUME && (
                  <a className="nav-sheet-item is-nested" href="/resume.pdf" onClick={closeAll}>
                    Resume PDF
                  </a>
                )}
              </>
            )}
          </div>
        )}
      </header>
    </>
  );
}

function ContactMenu({
  open,
  setOpen,
  hasResume,
  menuId,
  buttonRef,
}: {
  open: boolean;
  setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  hasResume: boolean;
  menuId: string;
  buttonRef: RefObject<HTMLButtonElement | null>;
}) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const onKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!open) setOpen(true);
      requestAnimationFrame(() => firstLinkRef.current?.focus());
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen((v) => !v);
    }
  };

  return (
    <div className="contact-nav-wrapper">
      <button
        ref={buttonRef}
        className="contact-nav-btn"
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
      >
        Contact <span className="chevron" aria-hidden>▾</span>
      </button>
      <div
        className={`contact-dropdown ${open ? 'open' : ''}`}
        id={menuId}
        role="menu"
        hidden={!open}
      >
        <div className="dropdown-label">Get in touch</div>
        <div className="dropdown-divider" />
        <a
          ref={firstLinkRef}
          className="dropdown-link"
          href={`mailto:${PROFILE.email}`}
          role="menuitem"
        >
          Email
          <span className="dropdown-link-sub">utkarsh777wins</span>
        </a>
        <a
          className="dropdown-link"
          href={PROFILE.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          role="menuitem"
        >
          LinkedIn
          <span className="dropdown-link-sub">{PROFILE.linkedinHandle}</span>
        </a>
        <a
          className="dropdown-link"
          href={PROFILE.github}
          target="_blank"
          rel="noopener noreferrer"
          role="menuitem"
        >
          GitHub
          <span className="dropdown-link-sub">{PROFILE.githubHandle}</span>
        </a>
        {hasResume && (
          <a className="dropdown-link" href="/resume.pdf" role="menuitem">
            Resume PDF
            <span className="dropdown-link-sub">PDF</span>
          </a>
        )}
      </div>
    </div>
  );
}
