import { motion } from "framer-motion";
import { Eye, FileText, Building2, Map } from "lucide-react";

const FEATURES = [
  {
    icon: Eye,
    title: "AI Vision Detection",
    body: "Gemini-powered vision identifies the issue, classifies severity, and writes a concise description from a single photo.",
  },
  {
    icon: FileText,
    title: "Smart Complaint Generation",
    body: "A polished, professional complaint letter — fully editable — drafted in seconds. Translate to Hindi or Telugu in one tap.",
  },
  {
    icon: Building2,
    title: "Authority Recommendation",
    body: "Every issue is routed to the right Telangana authority — GHMC, HMWSSB, TSSPDCL, Traffic Police — with contact info.",
  },
  {
    icon: Map,
    title: "Community Mapping",
    body: "See every reported issue near you on a live map. Add your support, amplify the urgency, drive resolution faster.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">Built for citizens</div>
          <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Everything you need to be heard.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            JanMitra AI compresses an hour of paperwork into a single tap — without losing the rigor of an official
            complaint.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-3xl glass-card p-6 shadow-card transition-all hover:shadow-elegant"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-elegant">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}