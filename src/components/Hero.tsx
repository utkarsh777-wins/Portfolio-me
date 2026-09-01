import { PROFILE } from '../lib/data';

export function Hero() {
  return (
    <section className="hero" id="home">
      <p className="hero-label">{PROFILE.title}</p>
      <h1>
        Engineering that'll <em>actually</em> matter.
      </h1>
      <p className="hero-tagline">
        On-device systems, hardware, and shipped web — built with curiosity, finished with care.
      </p>
      <div className="hero-cta">
        <a href="#projects" className="btn btn-primary">
          See my work
        </a>
        <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
          GitHub ↗
        </a>
      </div>
      <div className="hero-scroll" aria-hidden>
        <div className="scroll-line" />
        Scroll
      </div>
    </section>
  );
}
