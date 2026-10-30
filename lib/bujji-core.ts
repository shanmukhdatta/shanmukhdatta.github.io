import type { PortfolioData } from './cms-schema';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };
export function parseMessages(value: unknown): ChatMessage[] | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > 9) return null;
  const messages: ChatMessage[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object' || (item.role !== 'user' && item.role !== 'assistant') || typeof item.content !== 'string' || !item.content.trim() || item.content.length > 1600) return null;
    if (item.role === messages.at(-1)?.role) return null;
    messages.push({ role: item.role, content: item.content.trim() });
  }
  return messages[0].role === 'user' && messages.at(-1)?.role === 'user' ? messages : null;
}

/** Pure retrieval fallback, based exclusively on the currently published content. */
export function notebookReply(question: string, data: PortfolioData): string {
  const q = question.toLowerCase();
  const match = data.workItems.find(item => q.includes(item.name.toLowerCase()));
  if (match) return `${match.name} — ${match.status}\n\n${match.detail}\n\nTechnologies: ${match.stack.join(', ')}. Open its card in Work for available links.`;
  if (/research|paper|publication/.test(q)) {
    const items = data.workItems.filter(item => item.category === 'research');
    return items.length ? `The research notebook includes:\n\n${items.map(item => `${item.name} — ${item.status}. ${item.summary}`).join('\n\n')}\n\nSee Work → Research for ongoing and published entries.` : 'There are no research entries in the published notebook yet.';
  }
  if (/project|work|build/.test(q)) return data.workItems.length ? `A few pages from the workbench:\n\n${data.workItems.slice(0, 3).map(item => `${item.name} — ${item.status}. ${item.summary}`).join('\n\n')}\n\nAsk me about a project by name, or open Work to explore everything.` : 'The work notebook is waiting for its first published project.';
  if (/contact|email|hire|connect|resume|résumé|cv/.test(q)) return `You can contact ${data.profile.shortName} at ${data.profile.email}. Use View CV on Home for the current résumé. I can explain the portfolio, but I cannot send messages or make commitments on his behalf.`;
  if (/skill|stack|technolog|language/.test(q)) return data.skills.map(group => `${group.group}: ${group.items.join(', ')}`).join('\n\n');
  if (/experience|intern/.test(q)) return data.experiences.map(item => `${item.role}\n${item.organization} · ${item.period}\n${item.description}`).join('\n\n') || 'No experience entries are published yet.';
  if (/education|study|college|about|who/.test(q)) return `${data.profile.hello} ${data.profile.introduction}\n\n${data.profile.degree} · ${data.profile.school}\nMinor: ${data.profile.minor} · ${data.profile.years}`;
  return `I'm Bujji, ${data.profile.shortName}'s notebook guide. I can help you explore projects, research, skills, experience, education, or contact details. Try “Show me the research” or ask about a project by name.`;
}

/** Bounded local fallback; production can use the shared Redis limit in the route. */
export function createLocalLimiter(limit = 12, windowMs = 60_000, capacity = 2000) {
  const buckets = new Map<string, { count: number; expires: number }>();
  return (key: string, now = Date.now()): boolean => {
    for (const [id, entry] of buckets) if (entry.expires <= now) buckets.delete(id);
    const existing = buckets.get(key);
    if (existing) { existing.count++; return existing.count <= limit; }
    if (buckets.size >= capacity) return false;
    buckets.set(key, { count: 1, expires: now + windowMs });
    return true;
  };
}
