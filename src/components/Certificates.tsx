import { CERTIFICATES, PROFILE } from '../lib/data';
import { Reveal } from './Reveal';

export function Certificates() {
  return (
    <section id="certificates">
      <Reveal className="section-header" as="header">
        <span className="section-num">04</span>
        <div className="section-line" />
        <h2 className="section-title">Certificates</h2>
      </Reveal>

      <div className="cert-grid">
        {CERTIFICATES.map((cert) => (
          <Reveal className="cert-card" as="article" key={`${cert.issuer}-${cert.name}`}>
            <h3 className="cert-name">{cert.name}</h3>
            <p className="cert-meta">
              <span>{cert.issuer}</span>
              <span aria-hidden>·</span>
              <span>{cert.date}</span>
            </p>
            <a
              className="cert-verify"
              href={PROFILE.linkedinCerts}
              target="_blank"
              rel="noopener noreferrer"
            >
              Verify on LinkedIn ↗
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
