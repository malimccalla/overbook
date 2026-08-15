export default async function TenantArtistPage({
  params,
}: {
  params: Promise<{ slug: string; artist: string }>;
}) {
  const { slug, artist } = await params;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm text-zinc-500">{slug}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">{artist}</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">Artist press kit.</p>
    </div>
  );
}
