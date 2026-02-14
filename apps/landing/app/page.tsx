// app/page.tsx
"use client"

import Link from "next/link";
import { useEffect } from "react";

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header />

      <Hero />

      <LogosStrip />

      <FeatureBand />

      <Metrics />

      <Platform />

      <Testimonials />

      <FinalCTA />

      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white">
            <span className="text-sm font-semibold">T</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">TessDental</div>
            <div className="text-xs text-slate-500">Open source dental PMS</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <a className="text-sm text-slate-600 hover:text-slate-900" href="#features">
            Features
          </a>
          <a className="text-sm text-slate-600 hover:text-slate-900" href="#platform">
            Platform
          </a>
          <a className="text-sm text-slate-600 hover:text-slate-900" href="#security">
            Security
          </a>
          <a className="text-sm text-slate-600 hover:text-slate-900" href="#testimonials">
            Reviews
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#cta"
            className="hidden rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 md:inline-flex"
          >
            Book a demo
          </a>
          <a
            href="https://github.com/sagearora/TessDental"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            View on GitHub
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200/70 via-sky-200/60 to-emerald-200/60 blur-3xl" />
        <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-gradient-to-br from-slate-100 via-indigo-100/60 to-sky-100/60 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        {/* copy */}
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
            <Pill>Open source</Pill>
            <Pill>On-prem or cloud</Pill>
            <Pill>Own your data</Pill>
            <Pill>Modern analytics</Pill>
          </div>

          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            One platform to run your entire dental practice, on your terms.
          </h1>

          <p className="mt-4 mx-auto max-w-2xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
            TessDental is an AI-native, open source dental PMS built for clinics that want speed, control, and clarity.
            Setup is fast, workflows are modern, and your practice data stays yours with first-class reporting.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#cta"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Schedule a demo
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Explore features
            </a>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-2xl mx-auto">
            <MiniStat label="Setup time" value="Minutes" />
            <MiniStat label="License" value="OSS" />
            <MiniStat label="Data access" value="Full" />
            <MiniStat label="Exports" value="Always" />
          </div>

          <div className="mt-6 text-xs text-slate-500">
            No lock-in. No hidden exports. Bring your own database, run it your way.
          </div>
        </div>

        {/* mock UI */}
        <div className="relative mt-12 md:mt-16">
          <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-xl shadow-slate-200/60 backdrop-blur md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <div className="text-xs font-medium text-slate-500">Scheduler • Tasks • Claims</div>
              <div className="h-8 w-20 rounded-xl bg-slate-100" />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-[220px_1fr]">
              {/* sidebar */}
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center text-xs font-semibold">
                    TD
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Today</div>
                    <div className="text-xs text-slate-500">Feb 14 • Friday</div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <SidebarItem title="Schedule" active />
                  <SidebarItem title="Patients" />
                  <SidebarItem title="Billing" />
                  <SidebarItem title="Claims" />
                  <SidebarItem title="Analytics" />
                  <SidebarItem title="Settings" />
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 p-3">
                  <div className="text-xs font-semibold text-slate-700">Quick actions</div>
                  <div className="mt-2 space-y-2">
                    <ActionRow label="New appointment" />
                    <ActionRow label="Check-in" />
                    <ActionRow label="Collect payment" />
                  </div>
                </div>
              </div>

              {/* calendar grid */}
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">Provider schedule</div>
                    <div className="text-xs text-slate-500">Color-coded blocks • drag-and-drop</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-9 w-24 rounded-xl bg-slate-100" />
                    <div className="h-9 w-24 rounded-xl bg-slate-100" />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3">
                  <CalendarCol title="Dr. A" />
                  <CalendarCol title="Dr. B" />
                  <CalendarCol title="Hygiene" />
                </div>

                <div className="mt-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">Analytics that actually helps</div>
                      <div className="text-xs text-slate-600">
                        Know what is happening in your practice without exporting to five tools.
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Pill tone="dark">Real-time</Pill>
                      <Pill tone="dark">Exportable</Pill>
                      <Pill tone="dark">Auditable</Pill>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <MetricCard title="Collections (MTD)" value="$128,420" sub="Up 12% vs last month" />
                    <MetricCard title="Open claims" value="37" sub="8 need attention today" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* floating badge */}
          <div className="absolute -bottom-6 left-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg shadow-slate-200/60">
            <div className="text-xs text-slate-500">Open source advantage</div>
            <div className="text-sm font-semibold">No lock-in. Full control.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LogosStrip() {
  return (
    <section className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
          Built for modern clinics and technical teams
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {["Open standards", "Postgres", "Hasura-ready", "On-prem", "Cloud", "API-first"].map((t) => (
            <div
              key={t}
              className="grid place-items-center rounded-2xl border border-slate-200 bg-white px-3 py-4 text-sm font-medium text-slate-700"
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureBand() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">A smarter way to run</div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Fast setup, clean workflows, and data you can trust.
          </h2>
          <p className="mt-3 text-slate-600">
            TessDental is designed to be simple to deploy and easy to operate. Everything is built around speed,
            auditability, and real reporting, not locked dashboards.
          </p>

          <div className="mt-6 space-y-2">
            <FeatureRow title="Open source core" desc="Inspect the code, extend the system, and avoid vendor lock-in." />
            <FeatureRow title="Easy deployment" desc="Run on-prem or in the cloud with predictable infrastructure." />
            <FeatureRow title="Own your analytics" desc="Your data stays queryable. Export whenever you want." />
            <FeatureRow title="Audit-ready access" desc="Guardrails and logs for who accessed what, and why." />
          </div>

          <div className="mt-6 flex flex-wrap gap-3" id="security">
            <Tag>Role-based access</Tag>
            <Tag>Immutable audit logs</Tag>
            <Tag>Data export by default</Tag>
            <Tag>Modern API layer</Tag>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Practice overview</div>
              <div className="text-xs text-slate-500">The dashboard you wished your PMS had</div>
            </div>
            <div className="h-9 w-28 rounded-xl bg-slate-100" />
          </div>

          <div className="mt-5 grid gap-3">
            <BigRow label="Today’s schedule utilization" value="92%" />
            <BigRow label="Unconfirmed appointments" value="6" />
            <BigRow label="Outstanding insurance follow-ups" value="14" />
            <BigRow label="Re-care opportunities" value="38" />
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-700">Why clinics switch</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              <li>• Faster workflows for front desk</li>
              <li>• Cleaner data for reporting</li>
              <li>• Transparent analytics without lock-in</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metrics() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricBig title="$8,000" sub="Potential yearly savings by reducing tool sprawl" />
        <MetricBig title="80 hours" sub="Saved per month with better workflows + automation" />
        <MetricBig title="100%" sub="Your data stays accessible, exportable, and auditable" />
      </div>
      <div className="mt-6 text-sm text-slate-600">
        These are common outcomes when clinics consolidate systems and stop paying “data access tax” to get basic reporting.
      </div>
    </section>
  );
}

function Platform() {
  return (
    <section id="platform" className="bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-300">Built as a platform</div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Works like a teammate, not a database with buttons.
            </h2>
            <p className="mt-3 text-slate-300">
              TessDental is designed for agentic workflows and real operations. Integrate automation safely with
              guardrails, audit logs, and clear permissions.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm font-semibold">What you get Day 1</div>
            <div className="mt-2 grid grid-cols-2 gap-3 text-sm text-slate-300">
              <div className="rounded-2xl bg-white/5 p-3">Scheduling</div>
              <div className="rounded-2xl bg-white/5 p-3">Patients & households</div>
              <div className="rounded-2xl bg-white/5 p-3">Billing & payments</div>
              <div className="rounded-2xl bg-white/5 p-3">Analytics & reporting</div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <DarkCard title="Scribe" desc="Turn conversations into structured notes with guardrails and approvals." />
          <DarkCard title="Connect" desc="Integrate imaging, claims, and communications with a clean API layer." />
          <DarkCard title="Verify" desc="Insurance verification workflows that reduce manual chasing." />
          <DarkCard title="Recover" desc="Re-care and unscheduled treatment workflows you can actually track." />
          <DarkCard title="Audit" desc="Immutable logs for who accessed data and what actions were taken." />
          <DarkCard title="Report" desc="Query your own data with confidence. Exports are always available." />
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/20 via-sky-500/10 to-emerald-500/10 p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold">Open source, but clinic-ready</div>
              <div className="mt-1 text-sm text-slate-300">
                Deploy it yourself, or use a managed setup. Either way, the practice stays in control.
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/sagearora/TessDental"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100"
              >
                Explore the repo
              </a>
              <a
                href="#cta"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Book a walkthrough
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      quote:
        "Finally a PMS that feels modern. The workflows are clean and the reporting is not a black box.",
      name: "Clinic owner",
      role: "Ontario",
    },
    {
      quote:
        "Open source changes the relationship. We can inspect data models, build integrations, and move fast.",
      name: "Technical lead",
      role: "Multi-location group",
    },
    {
      quote:
        "The audit trail and permissions are what we needed to take automation seriously.",
      name: "Operations manager",
      role: "Practice ops",
    },
    {
      quote:
        "Setup was straightforward. We stopped duct-taping exports across tools just to get simple answers.",
      name: "Administrator",
      role: "Front desk",
    },
  ];

  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-8 md:grid-cols-2 md:items-end">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Trusted by teams who want control
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Clinics upgrade when software stops fighting them.
          </h2>
          <p className="mt-3 text-slate-600">
            The goal is simple: fewer clicks, cleaner data, and analytics you can rely on.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="text-sm font-semibold">Support that understands practices</div>
          <div className="mt-2 text-sm text-slate-600">
            Get implementation help from people who have actually worked in dental operations and billing workflows.
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {items.map((t) => (
          <div key={t.quote} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <Stars />
            <p className="mt-3 text-slate-700">{t.quote}</p>
            <div className="mt-4 text-sm">
              <div className="font-semibold">{t.name}</div>
              <div className="text-slate-500">{t.role}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  useEffect(() => {
    // Load Tally embeds after component mounts and script is loaded
    const loadTally = () => {
      if (typeof window !== "undefined" && (window as any).Tally) {
        (window as any).Tally.loadEmbeds();
      } else {
        // Retry if Tally is not loaded yet
        setTimeout(loadTally, 100);
      }
    };
    loadTally();
  }, []);

  return (
    <section id="cta" className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            See why clinics choose TessDental
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Get a walkthrough of the stack.</h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            We will show the deployment model, the analytics layer, and how open source keeps your practice in control.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Tag>Open source</Tag>
            <Tag>On-prem ready</Tag>
            <Tag>Modern reporting</Tag>
            <Tag>Clean integrations</Tag>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
          <iframe
            data-tally-src="https://tally.so/embed/EkQ2WN?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
            loading="lazy"
            width="100%"
            height="582"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title="Get In Touch"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white">
                <span className="text-sm font-semibold">T</span>
              </div>
              <div>
                <div className="text-sm font-semibold">TessDental</div>
                <div className="text-xs text-slate-500">Open source, clinic-first</div>
              </div>
            </div>

            <p className="mt-3 max-w-md text-sm text-slate-600">
              A modern dental PMS that prioritizes speed, auditability, and ownership of your practice data.
            </p>
          </div>

          <FooterCol
            title="Product"
            links={[
              { label: "Features", href: "#features" },
              { label: "Platform", href: "#platform" },
              { label: "Security", href: "#security" },
              { label: "Reviews", href: "#testimonials" },
            ]}
          />
          <FooterCol
            title="Resources"
            links={[
              { label: "GitHub", href: "https://github.com/sagearora/TessDental" },
              { label: "Documentation", href: "#" },
              { label: "Deployment guide", href: "#" },
              { label: "Contact", href: "#cta" },
            ]}
          />
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} TessDental. All rights reserved.</div>
          <div className="flex gap-4">
            <a className="hover:text-slate-700" href="#">
              Privacy
            </a>
            <a className="hover:text-slate-700" href="#">
              Terms
            </a>
            <a className="hover:text-slate-700" href="#">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ----------------------------- UI primitives ----------------------------- */

function Pill({
  children,
  tone = "light",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  if (tone === "dark") {
    return (
      <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
        {children}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
      {children}
    </span>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

function SidebarItem({ title, active }: { title: string; active?: boolean }) {
  return (
    <div
      className={[
        "flex items-center justify-between rounded-xl px-3 py-2 text-sm",
        active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50",
      ].join(" ")}
    >
      <span className="font-medium">{title}</span>
      <span className={["h-2 w-2 rounded-full", active ? "bg-emerald-400" : "bg-slate-200"].join(" ")} />
    </div>
  );
}

function ActionRow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
      <span className="text-xs font-medium text-slate-700">{label}</span>
      <span className="h-6 w-10 rounded-lg bg-slate-100" />
    </div>
  );
}

function CalendarCol({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-slate-700">{title}</div>
        <div className="h-6 w-10 rounded-lg bg-white" />
      </div>

      <div className="mt-3 space-y-2">
        <Block tone="indigo" />
        <Block tone="emerald" />
        <Block tone="sky" />
        <Block tone="amber" />
      </div>
    </div>
  );
}

function Block({ tone }: { tone: "indigo" | "emerald" | "sky" | "amber" }) {
  const map: Record<string, string> = {
    indigo: "bg-indigo-200/70 border-indigo-200",
    emerald: "bg-emerald-200/70 border-emerald-200",
    sky: "bg-sky-200/70 border-sky-200",
    amber: "bg-amber-200/70 border-amber-200",
  };

  return (
    <div className={["rounded-xl border px-3 py-3", map[tone]].join(" ")}>
      <div className="h-2 w-20 rounded bg-white/70" />
      <div className="mt-2 h-2 w-28 rounded bg-white/60" />
    </div>
  );
}

function MetricCard({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
      <div className="text-xs font-semibold text-slate-500">{title}</div>
      <div className="mt-1 text-lg font-semibold text-slate-900">{value}</div>
      <div className="mt-1 text-xs text-slate-600">{sub}</div>
    </div>
  );
}

function FeatureRow({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white">
          <span className="text-xs font-semibold">✓</span>
        </div>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="mt-1 text-sm text-slate-600">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
      {children}
    </span>
  );
}

function BigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function MetricBig({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-3xl font-semibold tracking-tight">{title}</div>
      <div className="mt-2 text-sm text-slate-600">{sub}</div>
    </div>
  );
}

function DarkCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">{title}</div>
        <div className="h-8 w-8 rounded-xl bg-white/10" />
      </div>
      <div className="mt-2 text-sm text-slate-300">{desc}</div>
    </div>
  );
}

function Stars() {
  return (
    <div className="flex gap-1 text-amber-500" aria-label="5 star rating">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );
}

function InputLike({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <div className="text-xs font-semibold text-slate-600">{label}</div>
      <div className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-500">
        {placeholder}
      </div>
    </div>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-3 space-y-2">
        {links.map((l) => (
          <a key={l.label} href={l.href} className="block text-sm text-slate-600 hover:text-slate-900">
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
