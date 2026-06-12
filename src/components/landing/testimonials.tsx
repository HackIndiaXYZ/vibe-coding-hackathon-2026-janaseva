import { Marquee } from "@/components/fx/marquee";
import { BlurFade } from "@/components/fx/blur-fade";
import { Star } from "lucide-react";

const QUOTES = [
  { name: "Priya Sharma", role: "Resident, Hyderabad", text: "I reported a broken streetlight in 30 seconds. TSSPDCL fixed it within 48 hours. This is the future of civic engagement." },
  { name: "Arjun Reddy", role: "Community organizer", text: "We rallied 200 neighbours through Community Pulse to fix a dangerous pothole. JanaSeva made it effortless." },
  { name: "Lakshmi Devi", role: "Senior citizen", text: "The AI writes my complaints in Telugu. I don't have to ask anyone for help anymore. Truly empowering." },
  { name: "Vikram Iyer", role: "RWA President, Banjara Hills", text: "We track 40+ complaints a month. The authority routing alone saves us hours of guesswork." },
  { name: "Sana Khan", role: "Student, Osmania University", text: "Snap, submit, done. I logged 6 issues on my street in one walk home. Real change happens." },
  { name: "Ravi Menon", role: "Auto driver", text: "Telugu voice input plus AI complaint — I can report bad roads while waiting for fares. Nothing else is this easy." },
];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <BlurFade>
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
              Citizens love it
            </div>
            <h2 className="mt-4 font-display text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Resolution, <span className="gradient-text">not red tape.</span>
            </h2>
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <span>4.9 from 1,240+ citizens</span>
            </div>
          </div>
        </BlurFade>
      </div>

      <div className="relative mt-14 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <Marquee>
          {QUOTES.map((q) => (
            <Card key={q.name} q={q} />
          ))}
        </Marquee>
        <Marquee reverse className="mt-4">
          {[...QUOTES].reverse().map((q) => (
            <Card key={q.name + "-r"} q={q} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}

function Card({ q }: { q: { name: string; role: string; text: string } }) {
  return (
    <figure className="w-[320px] shrink-0 rounded-3xl glass-card p-5 shadow-card">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
        ))}
      </div>
      <blockquote className="mt-3 text-sm leading-relaxed text-foreground/90">"{q.text}"</blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
          {q.name.slice(0, 1)}
        </div>
        <div>
          <div className="text-sm font-semibold">{q.name}</div>
          <div className="text-xs text-muted-foreground">{q.role}</div>
        </div>
      </figcaption>
    </figure>
  );
}