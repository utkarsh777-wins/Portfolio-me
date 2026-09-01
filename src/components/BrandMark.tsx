import { PROFILE } from '../lib/data';
import { Logo } from './Logo';

export function BrandMark() {
  return (
    <a href="#home" className="brand-mark">
      <Logo size={36} />
      <span className="sr-only">{PROFILE.name}</span>
    </a>
  );
}
