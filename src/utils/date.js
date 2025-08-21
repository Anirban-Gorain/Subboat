export function formatTimeAgo(iso) {
  const d = new Date(iso);
  let diff = Date.now() - d.getTime();

  if (diff < 0) diff = 0;

  const s = Math.floor(diff / 1000);

  if (s < 5) return "Just now";
  if (s < 60) return `${s}s ago`;

  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;

  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;

  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d ago`;

  return d.toLocaleDateString();
}
