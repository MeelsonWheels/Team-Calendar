import { notFound } from "next/navigation";
import { getTeam } from "@/lib/people";
import BookingWidget from "@/components/BookingWidget";

export default async function TeamBookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const team = getTeam(slug);
  if (!team) return notFound();

  return (
    <BookingWidget
      heading={`Book time with ${team.name}`}
      subheading="We'll find a time that works for the whole team."
      initialTeamSlugs={[team.slug]}
      lockSelection
    />
  );
}
