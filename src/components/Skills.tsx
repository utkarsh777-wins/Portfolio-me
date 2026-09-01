import { useEffect, useRef, useState } from 'react';
import { SKILLS } from '../lib/data';
import { Reveal } from './Reveal';
import { SkillIcon } from './SkillIcon';

export function Skills() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max <= 0 ? 1 : el.scrollLeft / max);
    };
    const onWheel = (event: WheelEvent) => {
      if (!event.shiftKey) return;
      event.preventDefault();
      el.scrollLeft += event.deltaY;
    };

    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('wheel', onWheel);
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
        {SKILLS.map((skill) => (
          <article className="skill-card" key={skill.name}>
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
