"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigation = [
  { name: "Overview", href: "/", icon: "⌂" },
  { name: "Calls", href: "/calls", icon: "☎" },
  { name: "Leads", href: "/leads", icon: "◉" },
  { name: "Appointments", href: "/appointments", icon: "▣" },
  { name: "Conversations", href: "/conversations", icon: "◌" },
  { name: "AI Agent", href: "/agent", icon: "✦" },
  { name: "Settings", href: "/settings", icon: "⚙" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navigationContent = (
    <>
      <div className="border-b border-gray-200 px-6 py-5">
        <div className="text-xl font-bold tracking-tight text-gray-900">
          2BIT AI
        </div>

        <div className="mt-1 text-xs text-gray-500">
          Customer & Sales Platform
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Workspace
        </div>

        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className="flex w-5 justify-center text-base">
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-gray-200 p-4">
        <div className="rounded-xl bg-gray-50 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
              N
            </div>

            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-gray-900">
                Noura
              </div>

              <div className="text-xs text-gray-500">
                AI Sales Assistant
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Active
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-gray-200 bg-white md:flex">
        {navigationContent}
      </aside>

      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-lg text-gray-700 shadow-sm transition hover:bg-gray-50 md:hidden"
      >
        ☰
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-gray-200 bg-white shadow-xl transition-transform duration-200 md:hidden ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end border-b border-gray-200 px-4 py-3">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            ×
          </button>
        </div>

        {navigationContent}
      </aside>
    </>
  );
}