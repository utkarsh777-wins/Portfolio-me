import { PROJECTS } from '../lib/data';
import { Reveal } from './Reveal';

export function Projects() {
  return (
    <section id="projects">
      <Reveal className="section-header" as="header">
        <span className="section-num">03</span>
        <div className="section-line" />
        <h2 className="section-title">Projects</h2>
      </Reveal>

      <div className="project-list">
        {PROJECTS.map((project) => (
          <Reveal className="project-card" as="article" key={project.name}>
            <div>
              {project.inProgress && <div className="project-badge">In Progress</div>}
              <h3 className="project-name">{project.name}</h3>
              <p className="project-desc">{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span className="project-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {project.href && project.linkLabel && (
              <div>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  {project.linkLabel} ↗
                </a>
              </div>
            )}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
