/** A saved revision gets a new URL while unchanged photos remain cacheable. */
export function teamPhotoUrl(id: number, updatedAt: string): string {
  return `/api/team/photo/${id}?v=${encodeURIComponent(updatedAt)}`;
}