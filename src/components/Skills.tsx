import { useMemo } from 'react';
import { SKILLS } from '../lib/data';
import { skillCardUri } from '../lib/skillCards';
import { useTheme } from '../lib/theme';
import { useMediaQuery } from '../hooks/useMediaQuery';
import CircularGallery from './CircularGallery';
import { Reveal } from './Reveal';

export function Skills() {
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const items = useMemo(
    () => SKILLS.map((skill) => ({ image: skillCardUri(skill, theme), text: skill.name })),
    [theme],
  );

  const gold = theme === 'dark' ? '#D4AF60' : '#9A7028';

  return (
    <section id="skills">
      <Reveal className="section-header" as="header">
        <span className="section-num">02</span>
        <div className="section-line" />
        <h2 className="section-title">Skills</h2>
      </Reveal>

      {isMobile || reduceMotion ? (
        <Reveal className="skills-chips">
          {SKILLS.map((skill) => (
            <div className="skill-chip" key={skill.name}>
              <span className="skill-chip-name">{skill.name}</span>
              <span className="skill-chip-tag">{skill.tag}</span>
            </div>
          ))}
        </Reveal>
      ) : (
        <Reveal className="skills-gallery">
          <CircularGallery
            key={theme}
            items={items}
            bend={3}
            textColor={gold}
            borderRadius={0.06}
            font="500 28px 'DM Sans'"
            scrollSpeed={2}
            scrollEase={0.05}
          />
          <p className="gallery-hint">Drag to spin</p>
        </Reveal>
      )}
    </section>
  );
}
