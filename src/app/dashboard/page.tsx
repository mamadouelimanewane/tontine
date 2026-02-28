
"use client";

import { Wallet, TrendingUp, Users, ArrowUpRight, Plus, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTontine } from '../context/TontineContext';
import { formatMoney, getStatusBadge } from '../data';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

export default function Dashboard() {
    const router = useRouter();
    const { tontines, contributions, notifications } = useTontine();

    const activeTontines = tontines.filter(t => t.status === 'active');
    const totalCollected = contributions.filter((c) => c.status === "paid").reduce((sum, c) => sum + c.amount, 0);

    // Recent activity from notifications
    const recentActivity = notifications.slice(0, 3).map(n => ({
        icon: n.type === "payment" ? "✅" : n.type === "late" ? "⚠️" : n.type === "cycle" ? "🎉" : "🔔",
        text: n.message,
        time: n.date,
        amount: n.message.match(/(\d+\s?\d*\s?FCFA)/)?.[0] || null
    }));

    return (
        <div>
            {/* Upper Header */}
            <div className="header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                            <img src="/logo.svg" alt="Logo" style={{ width: '100%', height: '100%' }} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>TontinePay</p>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Fatou Diop</h1>
                        </div>
                    </div>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', padding: '2px' }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                            👩🏾
                        </div>
                    </div>
                </div>

                <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '0.5rem' }}>Total collecté</p>
                            <h2 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>{formatMoney(totalCollected).replace(' FCFA', '')} <span style={{ fontSize: '1.25rem' }}>FCFA</span></h2>
                        </div>
                        <div className="flex-center" style={{ width: '40px', height: '40px', backgroundColor: 'var(--gold)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.2)', fontWeight: '700' }}>
                            95 / 100
                        </span>
                        <span style={{ opacity: 0.8 }}>Score de fiabilité excellent</span>
                    </div>
                </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <button onClick={() => router.push('/tontines')} className="btn btn-primary" style={{ flex: 1, height: 'auto', padding: '1.25rem 1rem', flexDirection: 'column' }}>
                        <Plus size={24} />
                        <span style={{ marginTop: '0.5rem' }}>Nouvelle Tontine</span>
                    </button>
                    <button onClick={() => router.push('/paiements')} className="btn" style={{ flex: 1, height: 'auto', padding: '1.25rem 1rem', flexDirection: 'column', backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)' }}>
                        <Wallet size={24} />
                        <span style={{ marginTop: '0.5rem' }}>Verser Cotisation</span>
                    </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700' }}>Mes Tontines Actives</h3>
                    <button onClick={() => router.push('/tontines')} style={{ color: 'var(--primary)', fontWeight: '700', border: 'none', background: 'none', fontSize: '0.875rem' }}>Tout voir</button>
                </div>

                {activeTontines.slice(0, 3).map((tontine) => {
                    const tc = contributions.filter((c) => c.tontineId === tontine.id && c.cycle === tontine.currentCycle);
                    const paid = tc.filter((c) => c.status === "paid").length;
                    const progress = Math.round((paid / tc.length) * 100) || 0;

                    return (
                        <div key={tontine.id} onClick={() => router.push(`/tontines/${tontine.id}`)} className="card" style={{ cursor: 'pointer' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <h4 style={{ fontWeight: '700', fontSize: '1.125rem' }}>{tontine.name}</h4>
                                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Mise : <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{formatMoney(tontine.amount)}</span></p>
                                </div>
                                <Badge bg={tontine.status === 'active' ? 'var(--primary-light)' : 'var(--gold-light)'} color={tontine.status === 'active' ? 'var(--primary-dark)' : 'var(--gold)'}>
                                    {tontine.status === 'active' ? 'En cours' : tontine.status}
                                </Badge>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                                <span>Tour {tontine.currentCycle}/{tontine.totalCycles}</span>
                                <span>{progress}% collecté</span>
                            </div>
                            <ProgressBar value={paid} max={tc.length} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Users size={16} color="#64748b" />
                                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>{tontine.members.length} membres</span>
                                </div>
                                <ChevronRight size={18} color="#cbd5e1" />
                            </div>
                        </div>
                    );
                })}

                {activeTontines.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem 0', color: '#94a3b8' }}>
                        Aucune tontine active. Créez-en une !
                    </div>
                )}

                <div style={{ marginTop: '2rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1.25rem' }}>Activité Récente</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recentActivity.map((act, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: i < recentActivity.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                <div style={{ fontSize: '1.5rem' }}>{act.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>{act.text}</p>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{act.time}</p>
                                </div>
                                {act.amount && <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.875rem' }}>{act.amount}</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
