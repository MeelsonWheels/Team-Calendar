import { notFound } from "next/navigation";
import { getPerson } from "@/lib/people";
import BookingWidget from "@/components/BookingWidget";

export default async function PersonBookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = getPerson(slug);
  if (!person || person.individuallyBookable === false) return notFound();

  return (
    <BookingWidget
      heading={`Book time with ${person.name}`}
      subheading={person.title}
      initialPersonSlugs={[person.slug]}
      lockSelection
    />
  );
}
