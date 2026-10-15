/** Public, explicitly approved portfolio facts. No private repositories or draft content. */
export const site = {
  name: 'Boda Shanmukh Datta',
  shortName: 'Shanmukh Datta',
  brand: 'shanXAI',
  headline: 'Building reliable AI, thoughtful systems, and tools people can use.',
  tagline: 'Undergraduate AI researcher & software builder',
  description: 'AI research and engineering spanning multilingual evaluation, quantum machine learning, cybersecurity, health AI, agents and open developer tools.',
  institute: 'Dr B R Ambedkar National Institute of Technology Jalandhar',
  program: 'B.Tech · Instrumentation & Control Engineering · Minor in Artificial Intelligence',
  location: 'Jalandhar, India',
  email: 'bodasd.ic.24@nitj.ac.in',
  links: {
    github: 'https://github.com/shanmukhdatta',
    linkedin: 'https://www.linkedin.com/in/Shanmukh-Datta',
    scholar: null as string | null,
    resume: null as string | null,
  },
  availability: 'Open to research collaborations and engineering opportunities',
  quote: 'Stop Thinking. Start Doing.',
  aboutTitle: 'Curious by default. Practical by design.',
  aboutIntro: 'I am an undergraduate researcher and builder studying at NIT Jalandhar. I spend my time turning questions into experiments and experiments into usable systems.',
  aboutDetail: 'My work moves between multilingual AI, security, health computer vision, autonomous agents and developer infrastructure. Different domains, one approach: be curious, measure carefully, and make the result useful.',
  currentlyExploring: 'Reliable evaluation · Agent systems · AI products',
  signalAccent: true, 
  gallery: [] as {src:string;title:string;place:string;year?:string}[],
};

export const milestones = [
  { date: '2024', label: 'NIT Jalandhar', type: 'Education', note: 'Started engineering and began exploring the connections between hardware, software, and intelligent systems.' },
  { date: '2025', label: 'Infosys Springboard', type: 'Experience', note: 'Software engineering internship focused on an AI-assisted music application.' },
  { date: '2025–2026', label: 'Campus development & AI leadership', type: 'Leadership', note: 'Contributions to student engineering communities, developer groups, and campus software.' },
  { date: '2026', label: 'QWorld QIntern', type: 'Research', note: 'Quantum-kernel malware classification, augmentation methods, and multi-seed evaluation.' },
  { date: '2026', label: 'Research, open source & hackathons', type: 'Research', note: 'Multilingual cultural alignment, healthcare AI, agent systems, security ML, and experimentation.' },
];

export const skills: Record<string, string[]> = {
  'Research & Machine Learning': ['PyTorch', 'TensorFlow', 'scikit-learn', 'XGBoost', 'Statistics', 'Evaluation design', 'Computer vision'],
  'LLMs & Agents': ['LangGraph', 'LangChain', 'MCP', 'RAG', 'Hugging Face', 'Inference pipelines'],
  'Engineering': ['Python', 'TypeScript', 'JavaScript', 'C++', 'Java', 'SQL', 'FastAPI', 'React', 'Next.js'],
  'Systems & Infrastructure': ['Docker', 'GitHub Actions', 'Linux', 'Firebase', 'PostgreSQL', 'SQLite', 'Vercel', 'Kaggle'],
};

export const mindTopics = [
  { title: 'Quantum learning', chain: 'Quantum kernels → QML → reproducibility', project: 'qtagger-plus', detail: 'Can quantum classifiers generalize beyond a familiar dataset? Diagnostics and multi-seed testing matter as much as headline results.' },
  { title: 'Cultural AI', chain: 'Dravidian languages → human evaluation → alignment', project: 'dravidian-cultural-alignment', detail: 'How do the language of a prompt and the cultural framing of a dilemma affect model responses?' },
  { title: 'Clinical vision', chain: 'Synthetic data → leakage audits → uncertainty', project: 'facial-skin-disease-research', detail: 'A technically convincing medical model needs evaluation discipline and a careful separation from clinical claims.' },
  { title: 'Agent systems', chain: 'LangGraph → tools → MCP → orchestration', project: 'workspace-mcp', detail: 'Useful assistants require permissioned tools, recoverable workflows, and observable behavior—not just prompts.' },
  { title: 'Threat intelligence', chain: 'Network flows → anomaly fusion → explanations', project: 'no-hack', detail: 'Combining supervised detection and novelty scoring helps reveal disagreement and uncertainty.' },
  { title: 'Evidence graphs', chain: 'Bitcoin chain → network observations → hypotheses', project: 'clarion', detail: 'Cross-layer evidence must preserve provenance and abstain from unsupported identity claims.' },
  { title: 'Financial reasoning', chain: 'Events → signals → constrained scenarios', project: 'riskpulse-ai', detail: 'Separating event interpretation from portfolio simulation makes assumptions reviewable.' },
  { title: 'Offline intelligence', chain: 'Speech → local retrieval → small language models', project: 'voice-doctor-ai', detail: 'Latency, memory, language coverage, and safe limits are all part of the on-device challenge.' },
  { title: 'Personal AI', chain: 'Planning → scheduling → feedback → agency', project: 'chronomind-ai', detail: 'Task automation should remain explainable and put human approval ahead of risky changes.' },
];
