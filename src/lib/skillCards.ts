import type { Skill } from './data';
import type { Theme } from './theme';

const palette = {
  light: {
    bg: '#F6F1E7',
    ink: '#221C13',
    gold: '#9A7028',
    border: '#DDD0B5',
    pale: '#F4EAD0',
  },
  dark: {
    bg: '#131109',
    ink: '#EDE8DC',
    gold: '#D4AF60',
    border: '#2A2518',
    pale: '#1D1A0F',
  },
} as const;

export function skillCardUri(skill: Skill, theme: Theme): string {
  const c = palette[theme];
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="${c.bg}"/>
  <rect x="28" y="28" width="744" height="544" rx="32" fill="${c.pale}" stroke="${c.border}" stroke-width="2"/>
  <circle cx="88" cy="88" r="9" fill="${c.gold}"/>
  <text x="88" y="318" font-family="Georgia, 'Times New Roman', serif" font-size="58" fill="${c.ink}">${escapeXml(skill.name)}</text>
  <text x="88" y="372" font-family="Arial, Helvetica, sans-serif" font-size="22" letter-spacing="4.2" fill="${c.gold}">${escapeXml(skill.tag.toUpperCase())}</text>
  <line x1="88" y1="404" x2="268" y2="404" stroke="${c.gold}" stroke-width="1.6"/>
</svg>`.trim();
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
