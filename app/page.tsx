import Link from "next/link";
import { INDIVIDUALS, TEAMS } from "@/lib/people";
import Avatar from "@/components/Avatar";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-1">Sisu booking links</h1>
      <p className="text-neutral-500 mb-8">Click a person or team to open their booking page.</p>

      <Link
        href="/book"
        className="block rounded-lg border p-4 mb-8 transition hover:opacity-80"
        style={{ borderColor: "var(--brand-border)", background: "var(--brand-surface)" }}
      >
        <div className="font-medium">Book with anyone</div>
        <div className="text-sm text-neutral-500">Pick any person, multiple people, or a team</div>
      </Link>

      <div className="mb-8">
        <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-3">Individuals</h2>
        <div className="space-y-2">
          {INDIVIDUALS.map((p) => (
            <Link
              key={p.slug}
              href={`/book/${p.slug}`}
              className="flex items-center gap-3 rounded-lg border p-3 transition hover:opacity-80"
              style={{ borderColor: "var(--brand-border)", background: "var(--brand-surface)" }}
            >
              <Avatar person={p} size={40} />
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-neutral-500">{p.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-3">Teams</h2>
        <div className="space-y-2">
          {TEAMS.map((t) => (
            <Link
              key={t.slug}
              href={`/book/team/${t.slug}`}
              className="block rounded-lg border p-3 font-medium transition hover:opacity-80"
              style={{ borderColor: "var(--brand-border)", background: "var(--brand-surface)" }}
            >
              {t.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
