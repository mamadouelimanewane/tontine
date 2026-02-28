
"use client";

import React from 'react';
import { useTontine } from '../context/TontineContext';
import { formatMoney } from '../data';
import {
    Users,
    HandCoins,
    TrendingUp,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { ScoreRing } from '../components/ui/ScoreRing';
import { ProgressBar } from '../components/ui/ProgressBar';

export default function AdminDashboard() {
    const { tontines, members, contributions } = useTontine();

    const totalVolume = contributions.filter(c => c.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
    const pendingVolume = contributions.filter(c => c.status === 'pending' || c.status === 'late').reduce((acc, curr) => acc + curr.amount, 0);
    const lateContributions = contributions.filter(c => c.status === 'late');

    const stats = [
        { title: 'Volume Total', value: formatMoney(totalVolume), icon: TrendingUp, color: '#4318FF', trend: '+12.5%', trendType: 'up' },
        { title: 'Contributions en Attente', value: formatMoney(pendingVolume), icon: HandCoins, color: '#6AD2FF', trend: '-2.4%', trendType: 'down' },
        { title: 'Membres Actifs', value: members.length.toString(), icon: Users, color: '#059669', trend: '+4', trendType: 'up' },
        { title: 'Signalements Retards', value: lateContributions.length.toString(), icon: AlertCircle, color: '#EF4444', trend: '+2', trendType: 'up' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Stats Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                {stats.map((stat, i) => (
                    <Card key={i} style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            backgroundColor: '#f4f7fe',
                            padding: '1rem',
                            borderRadius: '50%',
                            color: stat.color
                        }}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p style={{ color: '#a3aed0', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>{stat.title}</p>
                            <h3 style={{ color: '#1b2559', fontSize: '1.5rem', fontWeight: 700, margin: '0.25rem 0' }}>{stat.value}</h3>
                            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: stat.trendType === 'up' ? '#05ce91' : '#f04438' }}>
                                {stat.trend} <span style={{ color: '#a3aed0', fontWeight: 500 }}>depuis le mois dernier</span>
                            </p>
                        </div>
                    </Card>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Recent Transactions / Active Tontines Table */}
                <Card style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1b2559', margin: 0 }}>Aperçu des Tontines</h3>
                        <button style={{ color: 'var(--primary)', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer' }}>Tout voir</button>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #f4f7fe' }}>
                                <th style={{ textAlign: 'left', padding: '1rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Nom</th>
                                <th style={{ textAlign: 'left', padding: '1rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Progression</th>
                                <th style={{ textAlign: 'left', padding: '1rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Membres</th>
                                <th style={{ textAlign: 'left', padding: '1rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Mise</th>
                                <th style={{ textAlign: 'left', padding: '1rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tontines.map((tontine) => {
                                const tc = contributions.filter(c => c.tontineId === tontine.id && c.cycle === tontine.currentCycle);
                                const paid = tc.filter(c => c.status === 'paid').length;
                                const progress = Math.round((paid / tc.length) * 100) || 0;

                                return (
                                    <tr key={tontine.id} style={{ borderBottom: '1px solid #f4f7fe' }}>
                                        <td style={{ padding: '1rem', fontWeight: 700, color: '#1b2559' }}>{tontine.name}</td>
                                        <td style={{ padding: '1rem', width: '200px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1b2559' }}>{progress}%</span>
                                                <ProgressBar value={paid} max={tc.length} />
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', color: '#1b2559', fontWeight: 600 }}>{tontine.members.length}</td>
                                        <td style={{ padding: '1rem', color: '#1b2559', fontWeight: 600 }}>{formatMoney(tontine.amount)}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                backgroundColor: tontine.status === 'active' ? '#d1fae5' : '#fef3c7',
                                                color: tontine.status === 'active' ? '#065f46' : '#92400e',
                                                fontSize: '0.75rem',
                                                fontWeight: 700
                                            }}>{tontine.status}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </Card>

                {/* Top Reliability Scores */}
                <Card style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1b2559', marginBottom: '1.5rem' }}>Top Fiabilité</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {members.sort((a, b) => b.score - a.score).slice(0, 5).map((member) => (
                            <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <ScoreRing score={member.score} size={48} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, fontWeight: 700, color: '#1b2559' }}>{member.name}</p>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#a3aed0' }}>{member.phone}</p>
                                </div>
                                <div style={{
                                    backgroundColor: '#f4f7fe',
                                    padding: '0.5rem',
                                    borderRadius: '8px',
                                    color: 'var(--primary)',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <ArrowUpRight size={16} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button style={{
                        width: '100%',
                        marginTop: '2rem',
                        padding: '1rem',
                        borderRadius: '16px',
                        backgroundColor: 'var(--primary)',
                        color: '#fff',
                        border: 'none',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0px 10px 20px rgba(5, 150, 105, 0.2)'
                    }}>
                        Gérer tous les utilisateurs
                    </button>
                </Card>
            </div>
        </div>
    );
}
