import type { Project } from '../content/projects';
const symbol: Record<string, string> = {
  Research: '⌁',
  Healthcare: '✳',
  'AI Products': '◈',
  'Agents & Infrastructure': '⌘',
  Cybersecurity: '⟁',
  'Applied Engineering': '◇',
  Explorations: '✺',
};
/** These are illustrated system diagrams, NOT live outputs or measured plots. */
export function ProjectVisual({ project }: { project: Project }) {
  const s = project.slug;
  const special = s.includes('qtagger')
    ? 'quantum'
    : s.includes('resume') || s.includes('chrono') || s.includes('mcp') || s.includes('life-sync')
      ? 'agent'
      : s.includes('skin') || s.includes('derma')
        ? 'vision'
        : s.includes('clarion') || s.includes('no-hack')
          ? 'graph'
          : s.includes('riskpulse') || s.includes('soochana')
            ? 'signals'
            : 'generic';
  return (
    <div
      className={'project-visual project-visual-' + special}
      role="img"
      aria-label={`Conceptual, decorative ${special} system diagram illustrating ${project.name}; not measured results.`}
    >
      <div className="visual-raster" />
      <div className="visual-axis">FIG — {project.slug.replaceAll('-', ' ').toUpperCase()}</div>
      {special === 'quantum' && (
        <svg className="schema-svg" viewBox="0 0 420 210" aria-hidden="true">
          <g stroke="currentColor" strokeOpacity=".36">
            {[42, 86, 130, 174].map((y) => (
              <path key={y} d={`M 18 ${y} H 399`} />
            ))}
          </g>
          {[
            [80, 42, 'H'],
            [130, 86, 'X'],
            [180, 130, 'R'],
            [240, 174, 'Z'],
            [300, 42, 'M'],
            [352, 130, 'H'],
          ].map(([x, y, t], i) => (
            <g key={i} className="gate">
              <rect x={Number(x) - 18} y={Number(y) - 18} width="36" height="36" rx="7" />
              <text x={x} y={Number(y) + 5} textAnchor="middle">
                {t}
              </text>
            </g>
          ))}
          <g className="chart-edges" stroke="currentColor">
            <path d="M130 42 V86 M240 86 V174" />
          </g>
        </svg>
      )}
      {special === 'agent' && (
        <svg className="schema-svg" viewBox="0 0 420 210" aria-hidden="true">
          <g className="schema-lines">
            <path d="M80 107 H150 L210 51 H280 M150 107 L210 156 H280 M280 51 L345 107 M280 156 L345 107" />
          </g>
          {[
            [65, 107, 'IN'],
            [210, 51, 'A1'],
            [210, 156, 'A2'],
            [351, 107, 'OUT'],
          ].map(([x, y, t], i) => (
            <g className="agent-node" key={i}>
              <circle cx={x} cy={y} r={25} />
              <text x={x} y={Number(y) + 5} textAnchor="middle">
                {t}
              </text>
            </g>
          ))}
          <circle className="signal-particle" r="5">
            <animateMotion
              dur="5s"
              repeatCount="indefinite"
              path="M80,107 L150,107 L210,51 L280,51 L345,107"
            />
          </circle>
        </svg>
      )}
      {special === 'vision' && (
        <svg className="schema-svg" viewBox="0 0 420 210" aria-hidden="true">
          <g className="vision-grid">
            {Array.from({ length: 6 }, (_, i) =>
              Array.from({ length: 5 }, (_, j) => (
                <rect
                  key={`${i}-${j}`}
                  x={35 + i * 34}
                  y={30 + j * 34}
                  width="25"
                  height="25"
                  rx="3"
                  style={{ animationDelay: `${(i + j) * 0.11}s` }}
                />
              )),
            )}
          </g>
          <path className="schema-lines" d="M256 106 H300 M290 98 L300 106 L290 114" />
          <g className="agent-node">
            <rect x="315" y="70" width="85" height="72" rx="9" />
            <text x="357" y="100" textAnchor="middle">
              MODEL
            </text>
            <text x="357" y="121" textAnchor="middle">
              ?
            </text>
          </g>
        </svg>
      )}
      {special === 'graph' && (
        <svg className="schema-svg" viewBox="0 0 420 210" aria-hidden="true">
          <g className="schema-lines">
            {[
              [60, 90, 130, 40],
              [60, 90, 155, 160],
              [130, 40, 220, 90],
              [155, 160, 220, 90],
              [220, 90, 330, 40],
              [220, 90, 340, 165],
              [330, 40, 340, 165],
            ].map(([x, y, a, b], i) => (
              <line key={i} x1={x} y1={y} x2={a} y2={b} />
            ))}
          </g>
          {[
            [60, 90],
            [130, 40],
            [155, 160],
            [220, 90],
            [330, 40],
            [340, 165],
          ].map(([x, y], i) => (
            <circle
              key={i}
              className={`graph-point point-${i}`}
              cx={x}
              cy={y}
              r={i === 3 ? 17 : 11}
            />
          ))}
        </svg>
      )}
      {special === 'signals' && (
        <svg className="schema-svg" viewBox="0 0 420 210" aria-hidden="true">
          <g className="schema-lines">
            <path d="M 25 158 H 399 M25 55 V159" />
          </g>
          <polyline
            className="signal-chart"
            points="30,137 72,124 119,144 153,87 192,99 229,58 263,82 311,44 356,70 392,39"
          />
          <path className="signal-projection" d="M 311 44 L392 39 L392 158 L311 158 Z" />
        </svg>
      )}
      {special === 'generic' && (
        <>
          <div className="visual-orbit orbit-1" />
          <div className="visual-orbit orbit-2" />
          <div className="visual-center">{symbol[project.category] || '◇'}</div>
          <div className="visual-nodes">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </>
      )}
      <div className="visual-bottom">
        <span>SCHEMATIC / ILLUSTRATIVE</span>
        <span>{project.tags.slice(0, 3).join(' · ')}</span>
      </div>
    </div>
  );
}
