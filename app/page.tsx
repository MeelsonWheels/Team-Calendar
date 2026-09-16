import Link from "next/link";
import { INDIVIDUALS, TEAMS } from "@/lib/people";
import Avatar from "@/components/Avatar";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-1">Sisu booking links</h1>
      <p className="text-neutral-500 mb-8">
        Share these links so people can book time directly on Sisu calendars.
      </p>

      <div className="mb-8">
        <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-2">
          Full link (any person, multiple people, or a team)
        </h2>
        <Link href="/book" className="text-blue-600 underline">
          /book
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-2">Individuals</h2>
        <ul className="space-y-3">
          {INDIVIDUALS.map((p) => (
            <li key={p.slug} className="flex items-center gap-3">
              <Avatar person={p} size={36} />
              <div>
                <Link href={`/book/${p.slug}`} className="text-blue-600 underline">
                  /book/{p.slug}
                </Link>{" "}
                <span className="text-neutral-400">
                  — {p.name}, {p.title}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-2">Teams</h2>
        <ul className="space-y-1">
          {TEAMS.map((t) => (
            <li key={t.slug}>
              <Link href={`/book/team/${t.slug}`} className="text-blue-600 underline">
                /book/team/{t.slug}
              </Link>{" "}
              <span className="text-neutral-400">— {t.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
