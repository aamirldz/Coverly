"use client";

// ═══════════════════════════════════════════
// ADMIN LAYOUT — Matching main site design
// Clean white sidebar, Playfair + Inter fonts
// ═══════════════════════════════════════════

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminStore } from "@/hooks/useAdmin";
import Link from "next/link";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    label: "Products",
    path: "/admin/products",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
  },
  {
    label: "Reports",
    path: "/admin/reports",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, checkAuth, logout, adminEmail } = useAdminStore();
  const [mounted, setMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    setMounted(true);
    if (!isLoginPage) {
      const isValid = checkAuth();
      if (!isValid) router.push("/admin/login");
    }
  }, [isLoginPage, pathname]);

  if (isLoginPage) return <>{children}</>;

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-body">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-text-muted text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const currentPage = NAV_ITEMS.find((n) => n.path === pathname)?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-gray-50 flex font-body">
      {/* ── SIDEBAR ── */}
      <aside className={`${sidebarCollapsed ? "w-[72px]" : "w-[260px]"} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 fixed inset-y-0 left-0 z-30`}>
        {/* Logo */}
        <div className="h-[72px] flex items-center justify-between px-5 border-b border-gray-100">
          {!sidebarCollapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-xl font-heading font-bold text-text-primary tracking-tight">
                LUXE<span className="text-accent">WRAP</span>
              </span>
            </Link>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-text-muted hover:text-text-primary transition-colors p-1.5 hover:bg-gray-50 rounded-lg"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={sidebarCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} />
            </svg>
          </button>
        </div>

        {/* Nav Section Label */}
        {!sidebarCollapsed && (
          <div className="px-5 pt-6 pb-2">
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-[0.15em]">Main Menu</p>
          </div>
        )}

        {/* Nav Items */}
        <nav className={`flex-1 ${sidebarCollapsed ? "py-4 px-2" : "px-3"} space-y-0.5`}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                title={sidebarCollapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-[13px] font-medium ${
                  isActive
                    ? "bg-accent/8 text-accent border border-accent/15"
                    : "text-text-secondary hover:text-text-primary hover:bg-gray-50"
                } ${sidebarCollapsed ? "justify-center" : ""}`}
              >
                <span className={isActive ? "text-accent" : "text-text-muted"}>{item.icon}</span>
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-gray-100 space-y-0.5">
          <a
            href="/"
            target="_blank"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-gray-50 transition-all text-[13px] font-medium ${sidebarCollapsed ? "justify-center" : ""}`}
          >
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            {!sidebarCollapsed && <span>View Store</span>}
          </a>
          <button
            onClick={() => { logout(); router.push("/admin/login"); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-error/70 hover:text-error hover:bg-error/5 transition-all text-[13px] font-medium ${sidebarCollapsed ? "justify-center" : ""}`}
          >
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className={`flex-1 ${sidebarCollapsed ? "ml-[72px]" : "ml-[260px]"} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="h-[72px] bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-heading font-bold text-text-primary">{currentPage}</h1>
            <p className="text-[11px] text-text-muted font-body">LuxeWrap India Admin</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Notification bell */}
            <button className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
            </button>

            <div className="h-8 w-px bg-gray-200" />

            {/* Admin profile */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[13px] font-semibold text-text-primary">Admin</p>
                <p className="text-[10px] text-text-muted">{adminEmail}</p>
              </div>
              <div className="w-9 h-9 bg-accent/10 rounded-xl flex items-center justify-center">
                <span className="text-accent font-bold text-sm">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
