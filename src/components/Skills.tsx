import { useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const maxScroll = () => Math.max(0, el.scrollWidth - el.clientWidth);

    const pinStart = () => {
      el.scrollLeft = 0;
    };
    pinStart();
    const rafZero = requestAnimationFrame(pinStart);
    const tZero = window.setTimeout(pinStart, 0);

    const logMetrics = () => {
      const first = el.querySelector<HTMLElement>('.skill-card');
      const strip = el.getBoundingClientRect();
      const card = first?.getBoundingClientRect();
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      const firstCardX = card ? card.left - strip.left + el.scrollLeft : -1;
      // Expected: firstCardX === 0, maxScrollLeft > 0, cardCount === SKILLS.length
      console.info('[skills-track]', {
        cardCount: el.querySelectorAll('.skill-card').length,
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
        maxScrollLeft,
        firstCardX,
        scrollLeft: el.scrollLeft,
      });
    };
    const tLog = window.setTimeout(logMetrics, 80);

    let paused = isMobile;
    let resumeAt = 0;
    let lastTs = 0;
    let raf = 0;

    const updateActive = () => {
      const max = maxScroll();
      setProgress(max <= 0 ? 1 : el.scrollLeft / max);

      const rowLeft = el.getBoundingClientRect().left;
      const cards = Array.from(el.querySelectorAll<HTMLElement>('.skill-card'));
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((card, index) => {
        const dist = Math.abs(card.getBoundingClientRect().left - rowLeft);
        if (dist < bestDist) {
          bestDist = dist;
          best = index;
        }
      });
      setActive(best);
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
        const max = maxScroll();
        if (max > 0) {
          const next = el.scrollLeft + AUTO_PX_PER_SEC * dt;
          el.scrollLeft = next >= max ? 0 : next;
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
      cancelAnimationFrame(rafZero);
      window.clearTimeout(tZero);
      window.clearTimeout(tLog);
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
