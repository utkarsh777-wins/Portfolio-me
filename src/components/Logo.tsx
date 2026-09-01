import { useTheme } from '../lib/theme';

type LogoProps = {
  size?: number;
  title?: string;
};

export function Logo({ size = 36, title = 'Utkarsh Kumar' }: LogoProps) {
  const { theme } = useTheme();
  const gold = theme === 'dark' ? '#D4AF60' : '#9A7028';

  return (
    <svg
      viewBox="0 0 22 32"
      width={Math.round(size * 0.7)}
      height={size}
      role="img"
      aria-label={title}
      className="site-logo"
    >
      <text
        x="11"
        y="26"
        textAnchor="middle"
        fontFamily="Instrument Serif, Georgia, serif"
        fontStyle="italic"
        fontSize="28"
        fill={gold}
      >
        U
      </text>
    </svg>
  );
}
