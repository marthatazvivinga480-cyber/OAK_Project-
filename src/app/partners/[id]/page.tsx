import PartnerDetail from "@/components/PartnerDetails/PartnerDetails";

export default async function PartnerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PartnerDetail id={id} />;
}