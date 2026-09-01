import { useTheme } from '../lib/theme';

type LogoProps = {
  size?: number;
  title?: string;
};

export function Logo({ size = 34, title = 'Utkarsh Kumar' }: LogoProps) {
  const { theme } = useTheme();
  const gold = theme === 'dark' ? '#D4AF60' : '#9A7028';
  const width = Math.round(size * 0.78);

  return (
    <svg
      viewBox="0 0 26 36"
      width={width}
      height={size}
      role="img"
      aria-label={title}
      className="site-logo"
    >
      <text
        x="13"
        y="30"
        textAnchor="middle"
        fontFamily="Instrument Serif, Georgia, serif"
        fontStyle="italic"
        fontSize="32"
        fontWeight="400"
        fill={gold}
        stroke={gold}
        strokeWidth="1.55"
        strokeLinejoin="round"
        paintOrder="stroke fill"
      >
        U
      </text>
    </svg>
  );
}
