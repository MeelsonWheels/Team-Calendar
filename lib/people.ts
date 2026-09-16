// Central config: everyone who can be booked, their timezone, and default
// working hours. Edit this file to add/remove people or change hours.
// IMPORTANT: replace the placeholder @sisu.com emails with real addresses.

export interface WorkingHours {
  /** 0 = Sunday ... 6 = Saturday. Omit a day to mark it unavailable. */
  [weekday: number]: { start: string; end: string }; // "HH:mm" in the person's timezone
}

export interface Person {
  slug: string;
  name: string;
  title: string;
  email: string;
  timezone: string; // IANA tz, e.g. "Europe/London"
  workingHours: WorkingHours;
  /** Optional path under /public, e.g. "/people/lindi.jpg". Falls back to initials. */
  photo?: string;
  /** False for people who are only bookable as part of a team, not on their own. Defaults to true. */
  individuallyBookable?: boolean;
}

export interface Team {
  slug: string;
  name: string;
  memberSlugs: string[];
}

const DEFAULT_HOURS: WorkingHours = {
  1: { start: "09:00", end: "17:30" },
  2: { start: "09:00", end: "17:30" },
  3: { start: "09:00", end: "17:30" },
  4: { start: "09:00", end: "17:30" },
  5: { start: "09:00", end: "17:00" },
};

export const PEOPLE: Person[] = [
  {
    slug: "lindi",
    name: "Lindi Ngwenga",
    title: "Managing Director",
    email: "lindi@sisusportsmanagement.com",
    timezone: "Europe/London",
    workingHours: DEFAULT_HOURS,
    photo: "/people/lindi.jpg",
  },
  {
    slug: "addy",
    name: "Addy Ekhaese",
    title: "Director of Marketing & Partnerships",
    email: "addy@sisusportsmanagement.com",
    timezone: "Europe/London",
    workingHours: DEFAULT_HOURS,
    photo: "/people/addy.jpg",
  },
  {
    slug: "leo",
    name: "Leo Tillemont",
    title: "Managing Partner, Sisu Americas",
    email: "leo@sisuamericas.com",
    timezone: "America/New_York",
    workingHours: DEFAULT_HOURS,
    photo: "/people/leo.jpg",
  },
  {
    slug: "oscar",
    name: "Oscar Ncube",
    title: "Managing Partner, Sisu Asia-Pacific",
    email: "apac@sisusportsmanagement.com",
    timezone: "Australia/Melbourne",
    workingHours: DEFAULT_HOURS,
    photo: "/people/oscar.jpg",
  },
  {
    slug: "emelia",
    name: "Emelia Aggouras",
    title: "Managing Partner, Sisu Africa & Europe",
    email: "emelia@sisusportsmanagement.com",
    timezone: "Europe/Berlin",
    workingHours: DEFAULT_HOURS,
    photo: "/people/emelia.jpg",
  },
  {
    slug: "adam",
    name: "Adam Mizrahi",
    title: "African Women's Scouting Hub",
    email: "adam@sisusportsmanagement.com",
    timezone: "Europe/London",
    workingHours: DEFAULT_HOURS,
    individuallyBookable: false,
  },
];

/** Individually-bookable people, for the "Individuals" picker and /book/[slug] links. */
export const INDIVIDUALS: Person[] = PEOPLE.filter((p) => p.individuallyBookable !== false);

export const TEAMS: Team[] = [
  {
    slug: "sisu-commercial",
    name: "Sisu Commercial",
    memberSlugs: ["lindi", "leo", "addy", "emelia"],
  },
  {
    slug: "african-womens-scouting-hub",
    name: "Sisu African Women's Scouting Hub",
    memberSlugs: ["emelia", "adam"],
  },
  {
    slug: "african-mens-scouting-hub",
    name: "Sisu African Men's Scouting Hub",
    memberSlugs: ["emelia", "lindi"],
  },
  {
    slug: "social-media",
    name: "Sisu Social Media",
    memberSlugs: ["emelia"],
  },
];

export function getPerson(slug: string): Person | undefined {
  return PEOPLE.find((p) => p.slug === slug);
}

export function getTeam(slug: string): Team | undefined {
  return TEAMS.find((t) => t.slug === slug);
}

export function resolvePeople(slugs: string[]): Person[] {
  const set = new Map<string, Person>();
  for (const slug of slugs) {
    const p = getPerson(slug);
    if (p) set.set(p.slug, p);
  }
  return [...set.values()];
}

export function expandSelection(personSlugs: string[], teamSlugs: string[]): Person[] {
  const allSlugs = new Set<string>(personSlugs);
  for (const teamSlug of teamSlugs) {
    const team = getTeam(teamSlug);
    if (team) team.memberSlugs.forEach((s) => allSlugs.add(s));
  }
  return resolvePeople([...allSlugs]);
}
