export function tagSlug(tag) {
  if (tag === 'C++') return 'cpp';
  return tag.normalize('NFKC').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\p{L}\p{N}-]+/gu, '').replace(/-+/g, '-');
}
export function tagUrl(tag) { return `/tags/${encodeURIComponent(tagSlug(tag))}/`; }
