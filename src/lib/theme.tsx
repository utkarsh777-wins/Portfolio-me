import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark' || attr === 'light') return attr;
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    /* ignore */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyFavicons(theme: Theme) {
  const mark = theme === 'dark' ? '/logos/favicon-dark.svg' : '/logos/favicon-light.svg';
  const apple = theme === 'dark' ? '/logos/logo-dark.svg' : '/logos/logo-light.svg';

  const icon = document.querySelector<HTMLLinkElement>('link[data-favicon="dynamic"]');
  if (icon) {
    icon.href = `${mark}?v=${theme}`;
  }

  const appleLink = document.querySelector<HTMLLinkElement>('link[data-apple-touch="dynamic"]');
  if (appleLink) {
    appleLink.href = `${apple}?v=${theme}`;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* ignore */
    }
    applyFavicons(theme);
    const id = window.setTimeout(() => root.classList.remove('theme-transitioning'), 500);
    return () => window.clearTimeout(id);
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => {
      try {
        if (!localStorage.getItem('theme')) {
          setTheme(event.matches ? 'dark' : 'light');
        }
      } catch {
        setTheme(event.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', onChange);
    applyFavicons(theme);
    return () => mq.removeEventListener('change', onChange);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
