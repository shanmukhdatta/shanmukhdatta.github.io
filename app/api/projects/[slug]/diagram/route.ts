import { projectBySlug } from '../../../../../lib/portfolio-store';
export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params,
    p = await projectBySlug(slug);
  if (!p) return new Response('Project not found', { status: 404 });
  const text = `${p.name}\nConceptual architecture — not measured results\n\nProblem\n${p.problem}\n\nArchitecture\n${p.approach}\n\nInputs and technologies\n${p.tags.join(', ')}\n\nEvidence and limits\n${p.evidence}\n\nNext steps\n${p.next}\n`;
  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="${p.slug}-architecture.txt"`,
    },
  });
}
