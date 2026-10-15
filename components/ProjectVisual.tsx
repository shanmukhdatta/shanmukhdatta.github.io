import type { Project } from '../content/projects';

const symbol:Record<string,string>={Research:'⌁',Healthcare:'✳','AI Products':'◈','Agents & Infrastructure':'⌘',Cybersecurity:'⟁','Applied Engineering':'◇',Explorations:'✺'};
/** A schematic illustration, not measured experimental data. */
export function ProjectVisual({project}: {project:Project}) {
 const lines = project.tags.slice(0,3);
 return <div className="project-visual" aria-label={`Abstract illustration for ${project.name}. Not measured data.`} role="img"><div className="visual-raster"/><div className="visual-axis">FIG — {project.slug.replaceAll('-',' ').toUpperCase()}</div><div className="visual-orbit orbit-1"/><div className="visual-orbit orbit-2"/><div className="visual-center">{symbol[project.category]||'◇'}</div><div className="visual-nodes"><i/><i/><i/><i/><i/><i/></div><div className="visual-bottom"><span>SCHEMATIC / CONCEPTUAL</span><span>{lines.join(' · ')}</span></div></div>;
}
