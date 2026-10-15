import 'server-only';
import { publicRepoGroups } from '../content/catalog';
const record = (id: string, visibility: string, githubRepo: string | null) => ({
  id,
  githubRepo,
  visibility,
  sourceProvenance: githubRepo
    ? 'Public directory snapshot, 15 October 2026'
    : 'Private inventory slot; owner must supply name privately',
  ownershipRole: 'Not independently verified',
  projectFamily: 'Unclassified',
  stage: 'Needs editorial verification',
  evidence: githubRepo ? 'https://github.com/shanmukhdatta/' + githubRepo : 'Not public',
  publicationPermission: githubRepo
    ? 'Public directory listing only'
    : 'Private — no public permission',
  lastVerifiedAt: '2026-10-15',
  publicPlacement: githubRepo ? 'Repository directory' : 'Private only',
});
export const privateRegister = [
  ...publicRepoGroups
    .flatMap((g) => g.repos)
    .map((name, i) => record('public-' + (i + 1), 'public', name)),
  ...Array.from({ length: 5 }, (_, i) => record('private-' + (i + 1), 'private', null)),
];
