"use client";

import { useEffect, useRef, useState } from "react";
import type { Person } from "@/lib/people";

const GRADIENTS = [
  "linear-gradient(135deg, #f0a875, #b18ad6)",
  "linear-gradient(135deg, #b18ad6, #7fabd9)",
  "linear-gradient(135deg, #7fabd9, #f0a875)",
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function gradientFor(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash + slug.charCodeAt(i)) % GRADIENTS.length;
  return GRADIENTS[hash];
}

export default function Avatar({ person, size = 40 }: { person: Person; size?: number }) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // The image can finish loading (and fail) before React attaches the
    // onError listener during hydration, so check the already-settled
    // state on mount too, not just future error events.
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setFailed(true);
    }
  }, [person.photo]);

  if (person.photo && !failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        ref={imgRef}
        src={person.photo}
        alt={person.name}
        width={size}
        height={size}
        onError={() => setFailed(true)}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-medium flex-shrink-0"
      style={{ width: size, height: size, background: gradientFor(person.slug), fontSize: size * 0.4 }}
    >
      {initials(person.name)}
    </div>
  );
}
