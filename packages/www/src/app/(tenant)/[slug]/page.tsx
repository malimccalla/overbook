export default async function TenantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">{slug}</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        Public agency page.
      </p>
    </div>
  );
}
