
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Wallet, Bell, PieChart } from "lucide-react";
import { TontineProvider, useTontine } from "./context/TontineContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');
    const isLanding = pathname === '/';

    if (isAdmin) {
        return (
            <TontineProvider>
                {children}
            </TontineProvider>
        );
    }

    if (isLanding) {
        return (
            <TontineProvider>
                {children}
            </TontineProvider>
        );
    }

    return (
        <TontineProvider>
            <div className="mobile-container">
                <main style={{ paddingBottom: '90px' }}>
                    {children}
                </main>
                <Navigation />
            </div>
        </TontineProvider>
    );
}

function Navigation() {
    const pathname = usePathname();
    const { notifications } = useTontine();
    const unreadCount = notifications.filter(n => !n.read).length;

    const isActive = (path: string) => pathname === path || (path !== '/' && pathname.startsWith(path));

    return (
        <nav className="bottom-nav">
            <Link href="/dashboard" className={`nav-item ${pathname === "/dashboard" ? "active" : ""}`}>
                <Home size={24} />
                <span>Accueil</span>
            </Link>
            <Link href="/tontines" className={`nav-item ${isActive("/tontines") ? "active" : ""}`}>
                <Users size={24} />
                <span>Tontines</span>
            </Link>
            <Link href="/paiements" className={`nav-item ${isActive("/paiements") ? "active" : ""}`}>
                <Wallet size={24} />
                <span>Payer</span>
            </Link>
            <Link href="/stats" className={`nav-item ${isActive("/stats") ? "active" : ""}`}>
                <PieChart size={24} />
                <span>Stats</span>
            </Link>
            <Link href="/notifs" className={`nav-item ${isActive("/notifs") ? "active" : ""}`}>
                <div style={{ position: 'relative' }}>
                    <Bell size={24} />
                    {unreadCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-2px',
                            right: '-2px',
                            width: '16px',
                            height: '16px',
                            backgroundColor: 'var(--danger)',
                            border: '2px solid white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            color: 'white',
                            fontWeight: 700
                        }}>
                            {unreadCount}
                        </span>
                    )}
                </div>
                <span>Rappels</span>
            </Link>
        </nav>
    );
}
