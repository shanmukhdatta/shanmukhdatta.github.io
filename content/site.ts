/** Facts from the user's résumé and approved portfolio discussion.
 * Add or correct facts here; nothing in the UI should invent accomplishments.
 * Phase 3 will replace these arrays with a CMS-backed data provider.
 */
export const profile = {
  name: 'Boda Shanmukh Datta',
  shortName: 'Shanmukh Datta',
  role: 'Engineering student · AI researcher & software builder',
  hello: 'Hi, I’m Shanmukh Datta.',
  introduction: 'I study engineering at NIT Jalandhar and enjoy turning questions into experiments, code, and tools people can use.',
  email: 'shanmukhadattaboda069@gmail.com',
  location: 'Jalandhar, India',
  school: 'Dr. B. R. Ambedkar National Institute of Technology Jalandhar',
  degree: 'B.Tech, Instrumentation and Control Engineering',
  minor: 'Artificial Intelligence',
  years: '2024–2028',
  portrait: '/images/shanmukh-hero.webp',
  gallery: [{ src:'/images/shanmukh-gallery.webp', alt:'Shanmukh standing in front of an ornate architectural facade', caption:'A page from my camera roll' }],
  resume: '/resume/Shanmukh_Datta_Resume.pdf',
  github: 'https://github.com/shanmukhdatta',
  linkedin: 'https://www.linkedin.com/in/Shanmukh-Datta',
  tagline: 'Stop doing. Start doing.',
} as const;

export type Experience = { role:string; organization:string; period:string; description:string; kind:'Internship'|'Campus experience' };
export const experiences: Experience[] = [
  {role:'Web Development Team Member', organization:'Center for Training & Placement · NIT Jalandhar', period:'Dec 2025 – Present', kind:'Campus experience',description:'Develop and maintain a MERN placement portal, including REST APIs for student and company registration.'},
  {role:'Research Intern — Quantum Machine Learning',organization:'QWorld · QIntern 2026',period:'Jun – Aug 2026',kind:'Internship',description:'Built and evaluated a malware classification pipeline using feature selection and quantum-kernel methods.'},
  {role:'Software Engineering Intern',organization:'Infosys Springboard',period:'Aug – Nov 2025',kind:'Internship',description:'Built a React/Flask music application using YAMNet for audio mood analysis and caching for repeated requests.'},
];

export const achievements = [
  {year:'2026',title:'Amazon ML Summer School',description:'Selected as a scholar for machine learning training.'},
  {year:'2026',title:'GSSoC — CodeGraphContext',description:'Contributed to cross-file call-graph resolution in an open-source project.'},
  {year:'Now',title:'Research and engineering',description:'Continuing experiments, prototypes, and open-source learning.'},
];

export const skills: {group:string;items:string[]}[] = [
  {group:'Languages',items:['Python','SQL','C++ (basic)']},
  {group:'AI & machine learning',items:['PyTorch','TensorFlow / Keras','scikit-learn','LangChain','LangGraph']},
  {group:'Web & backend',items:['React','FastAPI','Flask','REST APIs','Node.js']},
  {group:'Tools & systems',items:['Git','Linux','Docker','SQLite','MySQL','MongoDB','AWS basics']},
  {group:'Quantum',items:['PennyLane','Qiskit']},
];

export const roadmap = [
  {phase:'NOW',title:'Learn, experiment, document',description:'Study engineering and AI while developing practical tools and research prototypes.'},
  {phase:'NEXT',title:'Stronger reproducibility',description:'Improve evaluations, documentation, and dependable engineering workflows.'},
  {phase:'FUTURE',title:'Research and useful products',description:'Continue exploring meaningful AI research and production engineering.'},
];

/** Only verified credentials should be inserted here. Recognition is separate. */
export const credentials: {title:string;issuer:string;date?:string;verifyUrl?:string}[] = [];
