import { motion } from "framer-motion";
import { Camera, Brain, FileText, Building2, Send, Users } from "lucide-react";

const STEPS = [
  { icon: Camera, title: "Upload Photo", body: "Snap or drag a photo of the issue." },
  { icon: Brain, title: "AI Analysis", body: "Gemini Vision identifies type & severity." },
  { icon: FileText, title: "Complaint Drafted", body: "A polished complaint is written for you." },
  { icon: Building2, title: "Authority Routed", body: "Mapped to the right civic body." },
  { icon: Send, title: "Submit Report", body: "One tap. Stored, tracked, accountable." },
  { icon: Users, title: "Community Impact", body: "Neighbors can support and amplify." },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-mesh opacity-50" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">How it works</div>
          <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">From photo to resolution in 6 steps.</h2>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative rounded-3xl glass-card p-6 shadow-card"
              >
                <div className="absolute -top-3 left-6 rounded-full gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-elegant">
                  Step {i + 1}
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{s.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}