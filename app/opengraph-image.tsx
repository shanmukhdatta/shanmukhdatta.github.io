import { ImageResponse } from 'next/og';
import { liveData } from '../lib/portfolio-store';
export const dynamic = 'force-dynamic';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default async function Image() {
  const { site } = await liveData();
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 80,
        width: '100%',
        height: '100%',
        background: '#050506',
        color: '#f5f5f7',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', color: '#ffb224', fontSize: 32 }}>
        shanXAI · Research. Build. Ship.
      </div>
      <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, maxWidth: 1000 }}>
        {site.shortName}
      </div>
      <div style={{ display: 'flex', fontSize: 30, color: '#c9cdd4' }}>{site.tagline}</div>
      <div style={{ display: 'flex', fontSize: 24, color: '#969a9f' }}>
        Stop Thinking. Start Doing.
      </div>
    </div>,
    size,
  );
}
