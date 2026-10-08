export function newsSlug(story: { id: number; title: string }) {
  const title = story.title.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 140).replace(/-$/, "");
  return `${title || "story"}-${story.id}`;
}

export function newsId(value: string) {
  const match = value.match(/(?:^|-)(\d+)$/);
  return match ? Number(match[1]) : null;
}