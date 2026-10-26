'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { defaultPortfolio, type PortfolioData } from '@/lib/cms-schema';
import { type WorkCategory, type WorkItem } from '@/content/work';
const ContentContext = createContext<PortfolioData>(defaultPortfolio());
const useContent = () => useContext(ContentContext);

type Page = 'home'|'work'|'blogs'|'about';
type Filter = 'all'|WorkCategory;
const categories: {id:Filter;label:string}[] = [
 {id:'all',label:'All'}, {id:'projects',label:'Projects'}, {id:'research',label:'Research'},
 {id:'hackathons',label:'Hackathons'}, {id:'open-source',label:'Open Source'}
];
const greetings = ['నమస్తే!', 'Hello!', 'Bonjour!', 'नमस्ते!', 'வணக்கம்!', 'World!'];

function ProjectDialog({item,onClose}:{item:WorkItem;onClose:()=>void}){
 const panel=useRef<HTMLDivElement>(null);
 const reduced=useReducedMotion();
 useEffect(()=>{
   const last=document.activeElement as HTMLElement|null;
   panel.current?.focus();
   const previous=document.body.style.overflow; document.body.style.overflow='hidden';
   const key=(event:KeyboardEvent)=>{
     if(event.key==='Escape'){event.preventDefault();onClose()}
     if(event.key==='Tab'&&panel.current){
       const nodes=Array.from(panel.current.querySelectorAll<HTMLElement>('button,a[href]')).filter(n=>!n.hasAttribute('disabled'));
       if(!nodes.length)return;
       const first=nodes[0], lastNode=nodes[nodes.length-1];
       if(event.shiftKey&&document.activeElement===first){event.preventDefault();lastNode.focus()}
       else if(event.shiftKey&&document.activeElement===panel.current){event.preventDefault();lastNode.focus()}
       else if(!event.shiftKey&&document.activeElement===lastNode){event.preventDefault();first.focus()}
     }
   };
   document.addEventListener('keydown',key);
   return ()=>{document.removeEventListener('keydown',key);document.body.style.overflow=previous;last?.focus()};
 },[onClose]);
 return <motion.div className="dialog-backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduced?0:0.15}}>
  <motion.div ref={panel} className="paper-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabIndex={-1} initial={{opacity:0,y:reduced?0:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduced?0:10}} transition={{duration:reduced?0:0.2}}>
    <div className="dialog-top"><span className="eyebrow">A page from my notebook</span><button className="outline-action compact" onClick={onClose} aria-label="Close project details">✕</button></div>
    <span className="paper-tag">{item.category.replace('-',' ')} · {item.status}</span>
    <h2 id="dialog-title">{item.name}</h2>
    <p className="dialog-summary">{item.summary}</p><p className="dialog-detail">{item.detail}</p>
    <div className="tag-row" aria-label="Technologies">{item.stack.map(x=><span className="tag" key={x}>{x}</span>)}</div>
    <div className="dialog-links">
     {item.github&&<a href={item.github} target="_blank" rel="noopener noreferrer" className="outline-action">GitHub ↗</a>}
     {item.live&&<a href={item.live} target="_blank" rel="noopener noreferrer" className="outline-action">Live demo ↗</a>}
     {item.paper&&<a href={item.paper} target="_blank" rel="noopener noreferrer" className="outline-action">Read paper ↗</a>}
     {!item.github&&!item.live&&!item.paper&&<p className="fineprint">No public artifact link has been verified for this entry yet.</p>}
    </div>
  </motion.div>
 </motion.div>;
}

function Intro({enter}:{enter:()=>void}){
 const [index,setIndex]=useState(0);
 const motionPreference=useReducedMotion();
 // Keep server and first client render identical; media queries are client-only.
 // This prevents React hydration mismatches for reduced-motion visitors.
 const [mounted,setMounted]=useState(false);
 useEffect(()=>setMounted(true),[]);
 const reduced=mounted && Boolean(motionPreference);
 useEffect(()=>{if(reduced)return;const timer=window.setInterval(()=>setIndex(n=>(n+1)%greetings.length),1200);return ()=>window.clearInterval(timer)},[reduced]);
 return <section className="intro-stage notebook-grid" aria-label="Multilingual portfolio welcome">
   <span className="eyebrow">✦ A LITTLE INTRODUCTION ✦</span>
   <div className="intro-greeting"><AnimatePresence mode="wait">
    <motion.span key={reduced?'all':index} initial={{opacity:reduced?1:0,y:reduced?0:10}} animate={{opacity:1,y:0}} exit={{opacity:reduced?1:0,y:reduced?0:-10}} transition={{duration:reduced?0:0.3}}>
     {reduced?'Namaste · Hello · Bonjour':greetings[index]}
    </motion.span>
   </AnimatePresence></div>
   <p className="eyebrow intro-caption">WELCOME TO MY SPACE ON THE INTERNET</p>
   <button className="outline-action primary enter-button" onClick={enter}>ENTER MY PORTFOLIO ↗</button>
   <span className="intro-doodle doodle-left" aria-hidden="true">✳</span><span className="intro-doodle doodle-right" aria-hidden="true">↗</span>
 </section>;
}

function Home({navigate,openWork}:{navigate:(page:Page)=>void;openWork:(category:Filter)=>void}){
 const {profile,experiences,achievements}=useContent();
 const [experienceIndex,setExperienceIndex]=useState(0);
 const experience=experiences[experienceIndex] || {role:'',organization:'',description:'',period:'',kind:'Internship' as const};
 const reduced=useReducedMotion();
 function changeExperience(direction:number){if(experiences.length)setExperienceIndex(n=>(n+direction+experiences.length)%experiences.length)}
 return <>
  <section className="hero notebook-grid" aria-labelledby="home-heading">
   <div className="hero-text"><div className="eyebrow">01 / MEET THE STUDENT</div>
    <h1 id="home-heading">Learning.<br/>Building.<br/><mark>Exploring.</mark></h1>
    <p>{profile.hello} {profile.introduction}</p>
    <div className="hero-actions"><a className="outline-action primary" href={profile.resume} target="_blank" rel="noopener noreferrer">VIEW CV ↗</a><a className="outline-action" href={profile.resume} download="Shanmukh_Datta_Resume.pdf">DOWNLOAD CV ↓</a></div>
    <span className="scribble hero-hint">↓ take a look at my work</span>
   </div>
   <div className="hero-portrait"><img src={profile.portrait} alt="Shanmukh standing in front of an ornate building" className="hero-image content-image-fill"/>
    <span className="portrait-note scribble">that's me ↑</span>
   </div>
  </section>
  <section className="paper-section notebook-grid" aria-labelledby="inside-heading">
   <div className="section-heading"><h2 id="inside-heading">Inside my notebook.</h2><span className="scribble">✎ explore</span></div>
   <div className="mosaic">
    <div className="diagonal-tile">
     <button type="button" className="diagonal-choice diagonal-projects" onClick={()=>openWork('projects')} aria-label="View projects"><strong>PROJECTS</strong><small>01 / BUILD ↗</small></button>
     <button type="button" className="diagonal-choice diagonal-research" onClick={()=>openWork('research')} aria-label="View research"><small>02 / DISCOVER ↗</small><strong>RESEARCH</strong></button>
    </div>
    <button className="mosaic-tile tile-yellow" onClick={()=>openWork('hackathons')}><span>[ 03 — EXPERIMENT ]</span><strong>HACKATHONS ↗</strong></button>
    <button className="mosaic-tile tile-white" onClick={()=>openWork('open-source')}><span>[ 04 — CONTRIBUTE ]</span><strong>OPEN SOURCE ↗</strong></button>
   </div>
   <div className="quick-links"><button onClick={()=>navigate('work')}>WORK ↗</button><button onClick={()=>navigate('blogs')}>BLOGS ↗</button><button onClick={()=>navigate('about')}>ABOUT ↗</button></div>
  </section>
  <section className="blackboard" aria-label="Internships and work experience slideshow">
   <span className="eyebrow board-eyebrow">CHALKBOARD / EXPERIENCE LOG</span><h2 className="scribble">Where I've been learning & working ✳</h2>
   <div className="experience-card" aria-live="polite" aria-atomic="true">
    <AnimatePresence mode="wait">
     <motion.div key={experienceIndex} initial={{opacity:0,x:reduced?0:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:reduced?0:-12}} transition={{duration:reduced?0:0.2}} className="experience-inner">
      <span className="eyebrow board-gold">{String(experienceIndex+1).padStart(2,'0')} / {String(experiences.length).padStart(2,'0')} · {experience.kind.toUpperCase()}</span>
      <h3>{experience.role}</h3><p className="scribble org">{experience.organization}</p><p>{experience.description}</p><span className="eyebrow board-gold">{experience.period}</span>
     </motion.div>
    </AnimatePresence>
   </div>
   <div className="experience-controls"><button aria-label="Previous experience" onClick={()=>changeExperience(-1)}>←</button><span className="slide-dots" aria-label={`Experience ${experienceIndex+1} of ${experiences.length}`}>{experiences.map((_,i)=><span key={i} aria-hidden="true">{i===experienceIndex?'●':'○'}</span>)}</span><button aria-label="Next experience" onClick={()=>changeExperience(1)}>→</button></div>
  </section>
  <section className="paper-section notebook-grid noticeboard" aria-labelledby="notice-heading"><div className="section-heading"><h2 id="notice-heading">On the noticeboard.</h2><span className="scribble">✳ achievements</span></div>
   <div className="milestone-list">{achievements.map(a=><div className="milestone" key={a.title}><span>{a.year}</span><div><strong>{a.title}</strong><p>{a.description}</p></div></div>)}</div>
  </section>
 </>;
}

function Work({selectedFilter,setSelectedFilter,onSelect}:{selectedFilter:Filter;setSelectedFilter:(f:Filter)=>void;onSelect:(item:WorkItem)=>void}){
 const {workItems}=useContent();
 const [researchStatus,setResearchStatus]=useState<'ongoing'|'published'>('ongoing');
 const filtered=workItems.filter(w=>(selectedFilter==='all'||w.category===selectedFilter) && (w.category!=='research'||selectedFilter==='all'||w.publicationStatus===researchStatus));
 return <section className="paper-section notebook-grid content-page" aria-labelledby="work-heading">
  <div className="eyebrow">02 / ASSIGNMENTS, EXPERIMENTS & IDEAS</div><h1 id="work-heading" className="page-title">Things I made<span className="red-dot">.</span></h1><p className="scribble section-subtitle">Organized like subject folders ↘</p>
  <div className="filter-row" role="group" aria-label="Filter work by category">{categories.map(cat=><button key={cat.id} aria-pressed={selectedFilter===cat.id} onClick={()=>setSelectedFilter(cat.id)}>{cat.label}</button>)}</div>
  {selectedFilter==='research'&&<div className="filter-row research-filters" role="group" aria-label="Research publication status"><button aria-pressed={researchStatus==='ongoing'} onClick={()=>setResearchStatus('ongoing')}>✎ Ongoing</button><button aria-pressed={researchStatus==='published'} onClick={()=>setResearchStatus('published')}>✓ Published</button></div>}
  {filtered.length>0?<div className="work-grid">{filtered.map((item,i)=><motion.button key={item.id} layout className={`work-paper paper-color-${i%4}`} onClick={()=>onSelect(item)} aria-label={`Read details about ${item.name}`} whileHover={{y:-3}} whileTap={{scale:0.99}}>
   <span className="paper-tag">{item.category.replace('-',' ')} · {item.status}</span><strong>{item.name} ↗</strong><p>{item.summary}</p><small>{item.stack.join(' · ')}</small>
  </motion.button>)}</div>:<div className="empty-paper"><h2>{selectedFilter==='research'&&researchStatus==='published'?'Published papers archive':'Nothing here yet'}</h2><p>{selectedFilter==='research'&&researchStatus==='published'?'No publications have been verified for this portfolio. When a paper is published, its title, venue, DOI and PDF link can be added here.':'This category will show items when verified content is added.'}</p></div>}
  <p className="fineprint under-cards">Entries distinguish completed, in-development, planned and ongoing research work. Select a paper card for details.</p>
 </section>;
}

function Blogs(){const {blogPosts}=useContent();return <section className="paper-section notebook-grid content-page" aria-labelledby="blogs-heading"><div className="eyebrow">03 / PAGES FROM THE NOTEBOOK</div><h1 id="blogs-heading" className="page-title">Thoughts & scribbles ✎</h1>
  {blogPosts.length?<div className="work-grid">{blogPosts.map(post=><article key={post.slug} className="work-paper paper-color-0"><span className="paper-tag">{post.category} · {post.date}</span><h2>{post.title}</h2><p>{post.description}</p><p>{post.body}</p></article>)}</div>:<div className="empty-paper blog-empty"><span className="scribble">dear notebook...</span><h2>Pages are being written.</h2><p>No published blog posts have been provided yet. This space is ready for your articles, engineering notes and research reflections once you choose to publish them.</p></div>}
 </section>}

function About(){const {profile,experiences,skills,credentials,roadmap}=useContent();return <section className="paper-section notebook-grid content-page about-page" aria-labelledby="about-heading">
  <div className="eyebrow">04 / BEYOND THE CODE</div><h1 id="about-heading" className="page-title">A little about me.</h1><p className="about-lead">{profile.introduction} This page is my scrapbook: my photographs, education, experiences, interests and future plans.</p>
  <section className="about-subsection" aria-labelledby="gallery-heading"><h2 id="gallery-heading" className="scribble">My gallery ↘</h2><div className="gallery-grid">{profile.gallery.map(photo=><figure key={photo.src} className="gallery-photo"><div className="gallery-frame"><img src={photo.src} alt={photo.alt} className="gallery-image content-image-fill"/></div><figcaption>{photo.caption}</figcaption></figure>)}</div></section>
  <section className="about-subsection" aria-labelledby="education-heading"><h2 id="education-heading" className="scribble">Education / the classroom</h2><div className="shelf"><div><h3>{profile.school}</h3><p>{profile.degree}<br/>Minor: {profile.minor}<br/>{profile.years}</p></div><div><h3>Subjects in my notebook</h3><p>Data Structures · Operating Systems · Computer Networks · DBMS · OOP · Machine Learning · Probability & Statistics</p></div></div></section>
  <section className="about-subsection" aria-labelledby="experience-heading"><h2 id="experience-heading" className="scribble">Experience / lines from my journey</h2><div className="timeline">{experiences.map(item=><div key={item.role} className="timeline-item"><strong>{item.role}</strong><p>{item.organization}</p><small>{item.period}</small></div>)}</div></section>
  <section className="about-subsection" aria-labelledby="skills-heading"><h2 id="skills-heading" className="scribble">My toolbox / skills</h2><div className="skill-groups">{skills.map(group=><div key={group.group}><h3>{group.group}</h3><div className="tag-row">{group.items.map(item=><span className="tag" key={item}>{item}</span>)}</div></div>)}</div></section>
  <section className="about-subsection" aria-labelledby="credentials-heading"><h2 id="credentials-heading" className="scribble">Certificates & credentials ✳</h2><div className="shelf"><div><h3>Recognition</h3><p>Amazon ML Summer School 2026 — selected scholar (recognition, not represented as a completion certificate).</p></div><div><h3>Verified certificates</h3>{credentials.length?credentials.map(c=><p key={c.title}>{c.title} · {c.issuer} {c.verifyUrl&&<a href={c.verifyUrl} target="_blank" rel="noopener noreferrer">Verify ↗</a>}</p>):<p>Verified certificates and their links can be added here later. No unverified credentials are displayed.</p>}</div></div></section>
  <section className="about-subsection" aria-labelledby="roadmap-heading"><h2 id="roadmap-heading" className="scribble">My roadmap / where I’m heading ↘</h2><div className="timeline">{roadmap.map(step=><div className="timeline-item" key={step.phase}><strong>{step.phase} — {step.title}</strong><p>{step.description}</p></div>)}</div></section>
  <section className="about-subsection"><h2 className="scribble">Want to say hello?</h2><p className="about-lead">I’m open to conversations about engineering, open source and research.</p><a className="outline-action primary" href={`mailto:${profile.email}`}>SEND AN EMAIL ↗</a></section>
 </section>}

function Footer(){const {profile}=useContent();return <footer className="page-footer"><div><span className="eyebrow">A NOTE BEFORE YOU GO</span><h2>Stop doing.<br/><span>Start doing. ↗</span></h2><a className="email-link" href={`mailto:${profile.email}`}>✉ {profile.email}</a></div><div><span className="eyebrow social-heading">CONNECT / TRAFFIC LIGHT</span><div className="traffic-lights"><a href={profile.github} target="_blank" rel="noopener noreferrer" className="light red-light" aria-label="GitHub (opens in new tab)">GH</a><a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="light yellow-light" aria-label="LinkedIn (opens in new tab)">in</a><a href={`mailto:${profile.email}`} className="light green-light" aria-label="Send Shanmukh an email">@</a></div></div></footer>}

export default function Portfolio({initialContent}:{initialContent:PortfolioData}){
 const [intro,setIntro]=useState(true);
 const [page,setPage]=useState<Page>('home');
 const [filter,setFilter]=useState<Filter>('all');
 const [opened,setOpened]=useState<WorkItem|null>(null);
 const reduced=useReducedMotion();
 const mainRef=useRef<HTMLElement|null>(null);
 useEffect(()=>{try{if(window.sessionStorage.getItem('student-blackboard-intro-seen')==='1')setIntro(false)}catch{}},[]);
 function enter(){setIntro(false);try{window.sessionStorage.setItem('student-blackboard-intro-seen','1')}catch{}}
 function navigate(next:Page){setPage(next);window.scrollTo({top:0,behavior:'auto'});window.setTimeout(()=>mainRef.current?.focus(),0)}
 function openWork(next:Filter){setFilter(next);navigate('work')}
 return <ContentContext.Provider value={initialContent}><div className="site-outer"><div className="portfolio-frame"><header className="site-header"><span className="brand">✳ MY NOTEBOOK / PORTFOLIO</span><span className="year">CLASS OF IDEAS · 2026</span><button className="replay" type="button" onClick={()=>setIntro(true)} aria-label="Replay multilingual introduction">↺ INTRO</button></header>
   {intro?<Intro enter={enter}/>:<>
    <nav className="main-nav" aria-label="Main navigation">{(['home','work','blogs','about'] as const).map((id,i)=><button type="button" key={id} className={`nav-box nav-${i}`} aria-current={page===id?'page':undefined} onClick={()=>navigate(id)}>{id==='about'?'About Me':id}</button>)}</nav>
    <main id="content" tabIndex={-1} ref={mainRef}><AnimatePresence mode="wait" initial={false}>
      <motion.div key={page} initial={{opacity:reduced?1:0,y:reduced?0:8}} animate={{opacity:1,y:0}} exit={{opacity:reduced?1:0,y:reduced?0:-8}} transition={{duration:reduced?0:0.17}}>
        {page==='home'?<Home navigate={navigate} openWork={openWork}/>:page==='work'?<Work selectedFilter={filter} setSelectedFilter={setFilter} onSelect={setOpened}/>:page==='blogs'?<Blogs/>:<About/>}
      </motion.div>
    </AnimatePresence></main><Footer/>
   </>}
  </div>
  <AnimatePresence>{opened&&<ProjectDialog item={opened} onClose={()=>setOpened(null)}/>}</AnimatePresence>
  </div></ContentContext.Provider>;
}
