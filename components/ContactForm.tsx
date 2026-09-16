"use client";

import { useState } from "react";

const CONTACT_EMAIL = "emelia@the12thplayer.net";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = `Team Calendar enquiry from ${name || "website visitor"}`;
    const body = `${message}\n\n—\n${name}\n${email}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
      <input
        required
        className="w-full border rounded-md px-3 py-2"
        style={{ borderColor: "var(--brand-border)" }}
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        required
        type="email"
        className="w-full border rounded-md px-3 py-2"
        style={{ borderColor: "var(--brand-border)" }}
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <textarea
        required
        rows={4}
        className="w-full border rounded-md px-3 py-2"
        style={{ borderColor: "var(--brand-border)" }}
        placeholder="How can we help?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className="text-white rounded-md py-2 px-5"
        style={{ background: "var(--brand-gradient)" }}
      >
        Send message
      </button>
      <p className="text-xs text-neutral-500">Opens your email app to send this to {CONTACT_EMAIL}.</p>
    </form>
  );
}
