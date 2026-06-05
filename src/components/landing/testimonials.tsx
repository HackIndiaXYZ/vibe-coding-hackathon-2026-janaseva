import { motion } from "framer-motion";

const QUOTES = [
  {
    name: "Priya Sharma",
    role: "Resident, Hyderabad",
    text: "I reported a broken streetlight in 30 seconds. TSSPDCL fixed it within 48 hours. This is the future of civic engagement.",
  },
  {
    name: "Arjun Reddy",
    role: "Community organizer",
    text: "We coordinated 200 neighbours through Community Pulse to fix a dangerous pothole. JanMitra made it effortless.",
  },
  {
    name: "Lakshmi Devi",
    role: "Senior citizen",
    text: "The AI writes my complaints in Telugu. I don't have to ask anyone for help anymore. Truly empowering.",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">Citizens love it</div>
          <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Resolution, not red tape.</h2>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <motion.figure
              key={q.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-3xl glass-card p-6 shadow-card"
            >
              <blockquote className="text-sm leading-relaxed text-foreground">"{q.text}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                  {q.name.slice(0, 1)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{q.name}</div>
                  <div className="text-xs text-muted-foreground">{q.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}