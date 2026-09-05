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
      <div className="absolute -left-40 -top-40 size-[560px] rounded-full bg-acc/25 blur-[150px]" />
      <div className="absolute -right-48 top-1/3 size-[520px] rounded-full bg-acc2/25 blur-[150px]" />
      <div className="absolute bottom-[-12rem] left-1/3 size-[480px] rounded-full bg-acc3/15 blur-[150px]" />
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <nav className="mt-6 space-y-0.5">
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: item.to === "/" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
          activeProps={{
            className:
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-foreground bg-foreground/5 ring-1 ring-foreground/10",
          }}
        >
          {({ isActive }) => (
            <>
              <span
                className={`size-1.5 rounded-full ${isActive ? "bg-acc" : "bg-line"}`}
                aria-hidden
              />
              <span className="font-medium">{item.label}</span>
            </>
          )}
        </Link>
      ))}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-center gap-2.5 px-2 py-2">
        <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-acc to-acc2 font-display font-bold text-background">
          V
        </div>
        <div className="leading-tight">
          <p className="font-display text-[15px] font-semibold tracking-tight">Veridian</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Work OS
          </p>
        </div>
      </div>

      <NavList onNavigate={onNavigate} />

      <div className="mt-auto rounded-xl bg-panel2/60 p-3 ring-1 ring-foreground/5">
        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-acc2 to-acc font-display text-[11px] font-semibold text-background">
            AR
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-medium">Amara Reyes</p>
            <p className="font-mono text-[10px] text-muted-foreground">amara@veridian</p>
          </div>
        </div>
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
      <div className="flex min-h-screen bg-background/60 font-body text-sm text-foreground backdrop-blur-2xl">
        <aside className="hidden w-60 shrink-0 border-r border-line/80 bg-panel/40 backdrop-blur-xl md:block">
          <SidebarInner />
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-30 md:hidden">
            <button
              aria-label="Close navigation"
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-64 border-r border-line/80 bg-panel/95 backdrop-blur-xl">
              <SidebarInner onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line/70 bg-background/50 px-4 py-3.5 backdrop-blur-xl sm:px-6">
            <button
              className="grid size-8 place-items-center rounded-lg text-muted-foreground ring-1 ring-foreground/10 md:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
            <div className="font-display text-[15px] font-semibold tracking-tight">{title}</div>
            <span className="hidden rounded-full bg-acc/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-acc ring-1 ring-acc/20 sm:inline">
              {badge}
            </span>
          </header>

          {children}
        </div>
      </div>
    </>
  );
}
