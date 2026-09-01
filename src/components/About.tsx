import { PROFILE } from '../lib/data';
import { Reveal } from './Reveal';

export function About() {
  return (
    <section id="about">
      <Reveal className="section-header" as="header">
        <span className="section-num">01</span>
        <div className="section-line" />
        <h2 className="section-title">About Me</h2>
      </Reveal>
      <div className="about-inner">
        <Reveal className="about-text">
          <p>
            I'm <span>{PROFILE.name}</span> — {PROFILE.degree} at {PROFILE.school}, CGPA{' '}
            {PROFILE.cgpa}. I build on-device systems, hardware, and shipped web: ESP32, Flutter,
            Flask, and React.
          </p>
          <p>
            Curiosity is the engine, not an alibi. I still take things apart — the point is to
            understand them well enough to ship something that holds.
          </p>
        </Reveal>
        <Reveal className="about-aside">
          <div className="about-stat">
            <div className="about-stat-label">Focus Area</div>
            <div className="about-stat-value">AI/ML + Embedded</div>
          </div>
          <div className="about-stat">
            <div className="about-stat-label">Current Mode</div>
            <div className="about-stat-value">Building</div>
          </div>
          <div className="about-stat">
            <div className="about-stat-label">GitHub</div>
            <div className="about-stat-value">
              <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">
                {PROFILE.githubHandle} ↗
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
