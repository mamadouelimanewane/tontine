
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    LogOut,
    Menu,
    Bell,
    Search,
    HandCoins
} from 'lucide-react';
import { useTontine } from '../context/TontineContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { notifications } = useTontine();
    const unreadCount = notifications.filter(n => !n.read).length;

    const menuItems = [
        { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { title: 'Gestion Tontines', href: '/admin/tontines', icon: HandCoins },
        { title: 'Utilisateurs', href: '/admin/users', icon: Users },
        { title: 'Transactions', href: '/admin/transactions', icon: FileText },
        { title: 'Paramètres', href: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7fe' }}>
            {/* Sidebar */}
            <aside style={{
                width: '280px',
                backgroundColor: '#fff',
                borderRight: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 10
            }}>
                <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff'
                    }}>
                        <HandCoins size={24} />
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1b2559' }}>TontinePay Admin</span>
                </div>

                <nav style={{ flex: 1, padding: '0 1rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a3aed0', padding: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Menu Principal</p>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href} style={{ marginBottom: '0.5rem' }}>
                                    <Link href={item.href} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '12px',
                                        textDecoration: 'none',
                                        color: isActive ? '#1b2559' : '#a3aed0',
                                        backgroundColor: isActive ? '#f4f7fe' : 'transparent',
                                        fontWeight: isActive ? 700 : 500,
                                        transition: 'all 0.2s'
                                    }}>
                                        <Icon size={20} color={isActive ? 'var(--primary)' : '#a3aed0'} />
                                        {item.title}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div style={{ padding: '1.5rem', borderTop: '1px solid #f4f7fe' }}>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        width: '100%',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#ff4d4f',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}>
                        <LogOut size={20} />
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, marginLeft: '280px', padding: '2rem' }}>
                {/* Header Area */}
                <header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(10px)',
                    padding: '1rem 1.5rem',
                    borderRadius: '20px',
                    border: '1px solid #fff'
                }}>
                    <div>
                        <p style={{ fontSize: '0.875rem', color: '#707eae', fontWeight: 500 }}>Pages / {pathname.split('/').pop() || 'Dashboard'}</p>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1b2559', margin: 0 }}>
                            {menuItems.find(i => i.href === pathname)?.title || 'Dashboard'}
                        </h1>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        padding: '0.5rem',
                        backgroundColor: '#fff',
                        borderRadius: '30px',
                        boxShadow: '14px 17px 40px 4px rgba(112, 144, 176, 0.08)'
                    }}>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <div style={{ position: 'absolute', left: '12px', color: '#a3aed0' }}><Search size={18} /></div>
                            <input
                                placeholder="Rechercher..."
                                style={{
                                    backgroundColor: '#f4f7fe',
                                    border: 'none',
                                    borderRadius: '20px',
                                    padding: '0.5rem 1rem 0.5rem 2.5rem',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                    width: '200px'
                                }}
                            />
                        </div>

                        <div style={{ position: 'relative', cursor: 'pointer' }}>
                            <Bell size={20} color="#a3aed0" />
                            {unreadCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-4px',
                                    right: '-4px',
                                    width: '14px',
                                    height: '14px',
                                    backgroundColor: '#ff4d4f',
                                    borderRadius: '50%',
                                    border: '2px solid #fff',
                                    fontSize: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    fontWeight: 700
                                }}>{unreadCount}</span>
                            )}
                        </div>

                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#e2e8f0',
                            backgroundImage: 'url(https://github.com/shadcn.png)', // Placeholder
                            backgroundSize: 'cover'
                        }}></div>
                    </div>
                </header>

                {children}
            </main>
        </div>
    );
}
