import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import { Portfolio } from '../components/Portfolio';
import { ArchivePage } from '../components/ArchivePage';
import { PhotoGallery } from '../components/SceneEnhancements';
import { ContactForm } from '../components/ContactForm';
import { DemoLab } from '../components/demo/DemoLab';
import { ControlCenter } from '../components/admin/ControlCenter';
import { editorial } from '../content/editorial';
import { site, milestones, mindTopics, skills } from '../content/site';
import { projects } from '../content/projects';
const data = { site, milestones, mindTopics, skills, projects, ...editorial };
beforeEach(() => {
  vi.mocked(window.matchMedia).mockImplementation(
    (query) =>
      ({
        matches: query.includes('prefers-reduced-motion: reduce'),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as any,
  );
  vi.stubGlobal(
    'fetch',
    vi.fn(
      async () =>
        new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } }),
    ),
  );
});
describe('gallery and demo assets', () => {
  it('cycles through all five images in either direction', () => {
    render(<PhotoGallery photos={site.gallery} />);
    expect(screen.getByAltText(/Demo photograph 1/)).toHaveAttribute('src', '/demo/gallery-1.jpg');
    fireEvent.click(screen.getByRole('button', { name: 'Next photograph' }));
    expect(screen.getByAltText(/Demo photograph 2/)).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Previous photograph' }));
    fireEvent.click(screen.getByRole('button', { name: 'Previous photograph' }));
    expect(screen.getByAltText(/Demo photograph 5/)).toBeVisible();
  });
  it('keeps demo drafts private until publish, then restores a snapshot', () => {
    render(<DemoLab />);
    const title = screen.getByLabelText('Demo project title');
    fireEvent.change(title, { target: { value: 'Edited demo' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save demo draft' }));
    expect(screen.queryByRole('heading', { name: 'Edited demo' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Publish demo' }));
    expect(screen.getByRole('heading', { name: 'Edited demo' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Restore draft revision 1' }));
    expect(title).toHaveValue('Evidence Explorer — Demo');
    expect(screen.getByRole('heading', { name: 'Edited demo' })).toBeVisible();
  });
  it('labels simulated delivery as demo rather than real email', () => {
    render(<DemoLab />);
    fireEvent.click(screen.getByRole('button', { name: 'Simulate success' }));
    expect(screen.getByText('DEMO: simulated success; no message was sent.')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Simulate failure' }));
    expect(screen.getByText(/DEMO: simulated delivery error/)).toBeVisible();
  });
});
describe('public portfolio interactions', () => {
  it('skips the intro and auto-finishes a replay', () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {})),
    );
    vi.mocked(window.matchMedia).mockImplementation(
      (query) =>
        ({
          matches: false,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as any,
    );
    render(<Portfolio initialData={data} />);
    expect(screen.getByRole('dialog', { name: 'Welcome introduction' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: /Skip intro/ }));
    expect(screen.queryByRole('dialog', { name: 'Welcome introduction' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Replay intro' }));
    act(() => vi.advanceTimersByTime(2200));
    expect(screen.queryByRole('dialog', { name: 'Welcome introduction' })).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('switches modes, persists preferences and opens the Journey detail', () => {
    render(<Portfolio initialData={data} />);
    fireEvent.click(screen.getByRole('button', { name: 'Explore' }));
    expect(localStorage.getItem('shanx-mode')).toBe('explore');
    fireEvent.click(screen.getByRole('button', { name: 'Open milestone: NIT Jalandhar' }));
    expect(screen.getByRole('dialog', { name: 'NIT Jalandhar' })).toBeVisible();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('searches command items for resume and Maya and closes with Escape', () => {
    render(<Portfolio initialData={data} />);
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    const dialog = screen.getByRole('dialog', { name: 'Command palette' });
    fireEvent.change(within(dialog).getByPlaceholderText('Search sections or projects…'), {
      target: { value: 'Maya' },
    });
    fireEvent.click(within(dialog).getByRole('button', { name: /Ask Maya/ }));
    expect(screen.getByRole('region', { name: 'Maya portfolio guide' })).toBeVisible();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('region', { name: 'Maya portfolio guide' })).not.toBeInTheDocument();
  });
  it('changes project with arrow keys and updates the chalkboard drawer', () => {
    render(<Portfolio initialData={data} />);
    const carousel = screen.getByRole('region', { name: 'Featured projects' });
    expect(within(carousel).getByRole('heading', { name: 'QTagger+' })).toBeVisible();
    fireEvent.keyDown(carousel, { key: 'ArrowRight' });
    expect(
      within(carousel).getByRole('heading', { name: 'Dravidian Cultural Alignment' }),
    ).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: /Cultural AI/ }));
    expect(screen.getByRole('heading', { name: 'Cultural AI' })).toBeVisible();
  });
  it('falls back to public project facts when Maya is unavailable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url) =>
        String(url).includes('/api/maya')
          ? new Response('{}', { status: 503 })
          : Response.json(data),
      ),
    );
    render(<Portfolio initialData={data} />);
    fireEvent.click(screen.getByRole('button', { name: 'Ask Maya about the portfolio' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Ask Maya' }), {
      target: { value: 'RiskPulse AI' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send question' }));
    await waitFor(() => expect(screen.getByText(/RiskPulse AI —/)).toBeVisible());
    expect(
      within(screen.getByRole('region', { name: 'Maya portfolio guide' })).getByRole('link', {
        name: /Read case study/,
      }),
    ).toHaveAttribute('href', '/projects/riskpulse-ai/');
  });
  it('filters project records and resets filters', () => {
    render(<ArchivePage initialProjects={projects} />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Search project library' }), {
      target: { value: 'qtagger' },
    });
    expect(screen.getByText(/1 matching records/)).toBeVisible();
    fireEvent.change(screen.getByLabelText('Stage'), { target: { value: 'Architecture' } });
    expect(screen.getByText(/No matching case studies/)).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Reset filters' }));
    expect(screen.getByText(/29 matching records/)).toBeVisible();
  });
});
describe('contact response handling', () => {
  function fill() {
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Demo Visitor' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'sample@example.com' } });
    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'A sample message for testing the form.' },
    });
    fireEvent.submit(screen.getByRole('button', { name: /Send message/ }).closest('form')!);
  }
  it('reports provider acceptance only after a successful response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ ok: true })),
    );
    render(<ContactForm email={site.email} />);
    fill();
    await waitFor(() => expect(screen.getByText(/accepted by the email provider/)).toBeVisible());
  });
  it('shows email fallback when delivery fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ error: 'Provider unavailable' }, { status: 503 })),
    );
    render(<ContactForm email={site.email} />);
    fill();
    await waitFor(() => expect(screen.getByText('Provider unavailable')).toBeVisible());
    expect(screen.getByRole('link', { name: /Use your email application/ })).toHaveAttribute(
      'href',
      'mailto:' + site.email,
    );
  });
});
describe('private control center', () => {
  it('does not show private editor controls to an unauthenticated visitor', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ authorized: false })),
    );
    render(<ControlCenter />);
    expect(await screen.findByText('Private mission control.')).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Publish changes' })).not.toBeInTheDocument();
  });
  it('loads authenticated drafts, saves without publishing and explicitly publishes', async () => {
    const calls: any[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url, options) => {
        calls.push([url, options]);
        if (String(url).includes('/session')) return Response.json({ authorized: true });
        if (options?.method === 'PUT') return Response.json({ ok: true });
        return Response.json({ documents: [], baseline: data });
      }),
    );
    render(<ControlCenter />);
    const editor = await screen.findByRole('textbox', { name: 'Edit content as JSON' });
    await waitFor(() => expect((editor as HTMLTextAreaElement).value).toContain('shanXAI'));
    fireEvent.click(screen.getByRole('button', { name: 'Save private draft' }));
    await waitFor(() =>
      expect(calls.some(([, o]) => o?.body && JSON.parse(o.body).action === 'save')).toBe(true),
    );
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Save private draft' })).not.toBeDisabled(),
    );
    fireEvent.click(screen.getByRole('checkbox', { name: /I reviewed the preview/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Publish changes' }));
    await waitFor(() =>
      expect(calls.some(([, o]) => o?.body && JSON.parse(o.body).action === 'publish')).toBe(true),
    );
  });
});
