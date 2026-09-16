import Link from "next/link";
import { LogoIcon } from "@/components/Logo";
import ContactForm from "@/components/ContactForm";

const FEATURES = [
  {
    title: "One link, any combination",
    body: "Book one person, several people, or a whole team from a single link — Team Calendar finds the times that work for everyone selected.",
  },
  {
    title: "Time zones handled for you",
    body: "Every person's working hours are checked in their own time zone, and slots are shown to the booker in theirs — no manual conversion.",
  },
  {
    title: "Synced straight to Google Calendar",
    body: "Booking a slot creates a real calendar event with a Meet link and sends invites automatically — nothing to approve by hand.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="max-w-3xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="flex justify-center mb-6">
          <LogoIcon size={48} />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight mb-4">Team Calendar</h1>
        <p className="text-lg text-neutral-500 max-w-xl mx-auto mb-8">
          Book time with people and teams at Sisu — availability and time zones synced
          automatically, no back-and-forth emails.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/book"
            className="text-white rounded-md py-2.5 px-6 font-medium"
            style={{ background: "var(--brand-gradient)" }}
          >
            Book a meeting
          </Link>
          <Link
            href="/links"
            className="rounded-md py-2.5 px-6 font-medium border"
            style={{ borderColor: "var(--brand-border)" }}
          >
            Browse people & teams
          </Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-8 pb-20">
        <div className="grid sm:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border p-5"
              style={{ borderColor: "var(--brand-border)", background: "var(--brand-surface)" }}
            >
              <h3 className="font-medium mb-2">{f.title}</h3>
              <p className="text-sm text-neutral-500">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border-t px-8 py-16"
        style={{ borderColor: "var(--brand-border)", background: "var(--brand-surface)" }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-1">Questions?</h2>
          <p className="text-neutral-500 mb-6">Get in touch and we'll get back to you.</p>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
