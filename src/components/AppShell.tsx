import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/email", label: "Email" },
  { to: "/notes", label: "Meeting Notes" },
  { to: "/planner", label: "Task Planner" },
  { to: "/research", label: "Research" },
  { to: "/chat", label: "Chat" },
] as const;

function AuroraBackdrop() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 bg-background">
      <div className="absolute -left-32 -top-32 size-[480px] rounded-full bg-acc/18 blur-[140px]" />
      <div className="absolute -right-40 top-1/4 size-[460px] rounded-full bg-acc2/16 blur-[140px]" />
      <div className="absolute bottom-[-10rem] left-1/4 size-[420px] rounded-full bg-acc3/12 blur-[140px]" />
    </div>
  );
}

function NavList({
  onNavigate,
  orientation = "horizontal",
}: {
  onNavigate?: (() => void) | undefined;
  orientation?: "horizontal" | "vertical";
}) {
  const base =
    orientation === "horizontal"
      ? "flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
      : "flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground";
  const active =
    orientation === "horizontal"
      ? "flex items-center gap-2 rounded-lg bg-foreground/6 px-3 py-2 text-[13px] font-medium text-foreground ring-1 ring-line"
      : "flex items-center gap-3 rounded-lg bg-foreground/6 px-3 py-2.5 font-medium text-foreground ring-1 ring-line";

  return (
    <nav
      className={
        orientation === "horizontal" ? "flex flex-wrap items-center gap-1" : "mt-4 space-y-0.5"
      }
    >
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: item.to === "/" }}
          className={base}
          activeProps={{ className: active }}
        >
          {({ isActive }) => (
            <>
              <span
                className={`size-1.5 rounded-full ${isActive ? "bg-acc" : "bg-line"}`}
                aria-hidden
              />
              <span>{item.label}</span>
            </>
          )}
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-acc to-acc2 font-display text-[15px] font-bold text-background shadow-lg shadow-acc/10">
        V
      </div>
      <div className="leading-tight">
        <p className="font-display text-[16px] font-semibold tracking-tight">Veridian</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Work OS
        </p>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  badge,
  children,
}: {
  title: string;
  badge: string;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <AuroraBackdrop />
      <div className="flex min-h-screen flex-col bg-background/55 font-body text-sm text-foreground backdrop-blur-2xl">
        <header className="sticky top-0 z-20 border-b border-line bg-background/70 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-[1500px] items-center gap-4 px-4 py-2.5 sm:px-6">
            <Brand />

            <div className="hidden flex-1 lg:block">
              <NavList />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <span className="hidden rounded-md bg-panel2 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground ring-1 ring-line sm:inline">
                {badge}
              </span>
              <div className="hidden items-center gap-2 sm:flex">
                <div className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-acc2 to-acc font-display text-[11px] font-semibold text-background">
                  AR
                </div>
                <div className="hidden leading-tight md:block">
                  <p className="text-[13px] font-medium">Amara Reyes</p>
                  <p className="font-mono text-[10px] text-muted-foreground">amara@veridian</p>
                </div>
              </div>
              <button
                className="grid size-8 place-items-center rounded-lg text-muted-foreground ring-1 ring-line transition hover:bg-foreground/5 lg:hidden"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle navigation"
              >
                {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="border-t border-line px-4 pb-4 lg:hidden">
              <NavList orientation="vertical" onNavigate={() => setMobileOpen(false)} />
            </div>
          )}
        </header>

        <div className="mx-auto flex w-full max-w-[1500px] min-w-0 flex-1 flex-col px-0">
          <div className="px-4 pt-5 font-display text-[15px] font-semibold tracking-tight sm:px-6">
            {title}
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
