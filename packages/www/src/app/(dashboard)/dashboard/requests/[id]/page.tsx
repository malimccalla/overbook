export default function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Request Detail</h1>
    </div>
  );
}
