import { useTheme } from '../lib/theme';

type LogoProps = {
  size?: number;
  title?: string;
};

export function Logo({ size = 32, title = 'Utkarsh Kumar' }: LogoProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      role="img"
      aria-label={title}
      className="site-logo"
    >
      <rect width="32" height="32" rx="6" fill={isDark ? '#131109' : '#F6F1E7'} />
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="5.5"
        fill="none"
        stroke={isDark ? '#2A2518' : '#DDD0B5'}
        strokeWidth="1"
      />
      <text
        x="16"
        y="24.2"
        textAnchor="middle"
        fontFamily="Instrument Serif, Georgia, serif"
        fontStyle="italic"
        fontSize="22"
        fill={isDark ? '#D4AF60' : 'none'}
        stroke={isDark ? 'none' : '#9A7028'}
        strokeWidth={isDark ? 0 : 1.4}
        strokeLinejoin="round"
      >
        U
      </text>
    </svg>
  );
}
