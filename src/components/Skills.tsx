import { useEffect, useMemo, useRef, useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { SKILLS } from '../lib/data';
import { Reveal } from './Reveal';
import { SkillIcon } from './SkillIcon';

const AUTO_PX_PER_SEC = 28;
const RESUME_MS = 3000;

export function Skills() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const items = useMemo(() => (isMobile ? [...SKILLS] : [...SKILLS, ...SKILLS]), [isMobile]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    el.scrollLeft = 0;
    const zero = () => {
      el.scrollLeft = 0;
    };
    requestAnimationFrame(zero);
    const zeroTimer = window.setTimeout(zero, 50);

    let paused = isMobile;
    let resumeAt = 0;
    let lastTs = 0;
    let raf = 0;

    const loopWidth = () => (isMobile ? el.scrollWidth : el.scrollWidth / 2);

    const updateActive = () => {
      const half = loopWidth();
      const max = Math.max(1, half - el.clientWidth);
      const pos = isMobile ? el.scrollLeft : el.scrollLeft % half;
      setProgress(Math.min(1, pos / max));

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
      setActive(best % SKILLS.length);
    };

    const onUser = () => {
      if (isMobile) return;
      paused = true;
      resumeAt = performance.now() + RESUME_MS;
      el.classList.remove('is-autoplaying');
    };

    const onWheel = (event: WheelEvent) => {
      onUser();
      if (!event.shiftKey) return;
      event.preventDefault();
      el.scrollLeft += event.deltaY;
    };

    const tick = (ts: number) => {
      raf = requestAnimationFrame(tick);
      if (!lastTs) lastTs = ts;
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;

      if (!isMobile && paused && ts >= resumeAt) {
        paused = false;
        el.classList.add('is-autoplaying');
      }

      if (!isMobile && !paused) {
        el.scrollLeft += AUTO_PX_PER_SEC * dt;
        const half = loopWidth();
        if (half > 0 && el.scrollLeft >= half) {
          el.scrollLeft -= half;
        }
      }
      updateActive();
    };

    updateActive();
    if (!isMobile) {
      el.classList.add('is-autoplaying');
      raf = requestAnimationFrame(tick);
    }

    el.addEventListener('scroll', updateActive, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('pointerdown', onUser);
    el.addEventListener('touchstart', onUser, { passive: true });
    window.addEventListener('resize', updateActive);
    return () => {
      window.clearTimeout(zeroTimer);
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', updateActive);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('pointerdown', onUser);
      el.removeEventListener('touchstart', onUser);
      window.removeEventListener('resize', updateActive);
    };
  }, [isMobile]);

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
        {items.map((skill, index) => (
          <article
            className={`skill-card${index % SKILLS.length === active ? ' is-active' : ''}`}
            key={`${skill.name}-${index}`}
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
