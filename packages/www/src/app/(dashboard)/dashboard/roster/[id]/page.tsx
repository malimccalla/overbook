export default function ArtistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Artist Detail</h1>
    </div>
  );
}
