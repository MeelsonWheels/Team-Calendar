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
    name: "Lindi",
    title: "Managing Director",
    email: "lindi@sisusportsmanagement.com",
    timezone: "Europe/London",
    workingHours: DEFAULT_HOURS,
  },
  {
    slug: "addy",
    name: "Addy",
    title: "Head of Partnerships",
    email: "addy@sisusportsmanagement.com",
    timezone: "Europe/London",
    workingHours: DEFAULT_HOURS,
  },
  {
    slug: "leo",
    name: "Leo",
    title: "Managing Partner, Americas",
    email: "leo@sisuamericas.com",
    timezone: "America/New_York",
    workingHours: DEFAULT_HOURS,
  },
  {
    slug: "oscar",
    name: "Oscar",
    title: "Managing Partner, Asia Pacific",
    email: "apac@sisusportsmanagement.com",
    timezone: "Australia/Melbourne",
    workingHours: DEFAULT_HOURS,
  },
  {
    slug: "emelia",
    name: "Emelia",
    title: "Managing Partner, Europe & Africa",
    email: "emelia@sisusportsmanagement.com",
    timezone: "Europe/Berlin",
    workingHours: DEFAULT_HOURS,
  },
  {
    slug: "adam",
    name: "Adam",
    title: "African Women's Scouting Hub",
    email: "adam@sisusportsmanagement.com",
    timezone: "Europe/London",
    workingHours: DEFAULT_HOURS,
  },
];

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
