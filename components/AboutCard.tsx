export function AboutCard({
  name,
  bio,
}: {
  name: string;
  bio?: string;
}) {
  if (!bio) return null;
  const cleanName = name.replace(/\s*\([^)]*\)\s*$/, "").trim();
  return (
    <section className="mt-10 rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
      <h2 className="text-lg font-semibold">About {cleanName}</h2>
      <p className="mt-2 text-ink-600 leading-relaxed text-[15px]">{bio}</p>
    </section>
  );
}
