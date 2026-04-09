import { redirect } from "next/navigation";

export default async function PassportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/app/passports/${id}/overview`);
}
