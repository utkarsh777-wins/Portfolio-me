import { useEffect, useRef, useState } from 'react';
import { SKILLS } from '../lib/data';
import { Reveal } from './Reveal';
import { SkillIcon } from './SkillIcon';

export function Skills() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max <= 0 ? 1 : el.scrollLeft / max);

      const row = el.getBoundingClientRect();
      const focusX = row.left + row.width * 0.38;
      const cards = Array.from(el.querySelectorAll<HTMLElement>('.skill-card'));
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((card, index) => {
        const box = card.getBoundingClientRect();
        const dist = Math.abs(box.left + box.width / 2 - focusX);
        if (dist < bestDist) {
          bestDist = dist;
          best = index;
        }
      });
      setActive(best);
    };

    const onWheel = (event: WheelEvent) => {
      if (!event.shiftKey) return;
      event.preventDefault();
      el.scrollLeft += event.deltaY;
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <section id="skills">
      <Reveal className="section-header" as="header">
        <span className="section-num">02</span>
        <div className="section-line" />
        <h2 className="section-title">Skills</h2>
      </Reveal>

      <div
        className="skills-strip"
        ref={scrollerRef}
        tabIndex={0}
        role="region"
        aria-label="Skills. Scroll horizontally to browse."
      >
        {SKILLS.map((skill, index) => (
          <article
            className={`skill-card${index === active ? ' is-active' : ''}`}
            key={skill.name}
          >
            <div className="skill-icon">
              <SkillIcon name={skill.name} />
            </div>
            <h3 className="skill-name">{skill.name}</h3>
            <p className="skill-tag">{skill.tag}</p>
          </article>
        ))}
      </div>
      <div className="skills-progress" aria-hidden>
        <span style={{ transform: `scaleX(${Math.max(progress, 0.08)})` }} />
      </div>
    </section>
  );
}
