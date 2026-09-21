"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Overview",
    href: "/",
    icon: "⌂",
  },
  {
    name: "Calls",
    href: "/calls",
    icon: "☎",
  },
  {
    name: "Leads",
    href: "/leads",
    icon: "◉",
  },
  {
    name: "Appointments",
    href: "/appointments",
    icon: "▣",
  },
  {
    name: "Conversations",
    href: "/conversations",
    icon: "◌",
  },
  {
    name: "AI Agent",
    href: "/agent",
    icon: "✦",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: "⚙",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="border-b border-gray-200 px-6 py-5">
        <div className="text-xl font-bold tracking-tight text-gray-900">
          2BIT AI
        </div>

        <div className="mt-1 text-xs text-gray-500">
          Customer & Sales Platform
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5">
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

      {/* Agent Status */}
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
    </aside>
  );
}