
"use client";

import React from 'react';
import { useTontine } from '../../context/TontineContext';
import { formatMoney, getScoreColor, getScoreLabel } from '../../data';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { ScoreRing } from '../../components/ui/ScoreRing';
import { Edit2, MoreVertical, ShieldCheck, UserMinus } from 'lucide-react';

export default function AdminUsersPage() {
    const { members, contributions } = useTontine();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1b2559', margin: 0 }}>Gestion des Utilisateurs</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#a3aed0', fontWeight: 500 }}>Total: <strong>{members.length}</strong></span>
                </div>
            </div>

            <Card style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #f4f7fe', textAlign: 'left' }}>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Utilisateur</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Phone</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Fiabilité</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Cotisations</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Date d'adhésion</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((m) => {
                            const mc = contributions.filter(c => c.memberId === m.id);
                            return (
                                <tr key={m.id} style={{ borderBottom: '1px solid #f4f7fe' }}>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <Avatar emoji={m.avatar} size={40} />
                                            <div>
                                                <div style={{ fontWeight: 700, color: '#1b2559' }}>{m.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#a3aed0' }}>ID: {m.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem', color: '#1b2559' }}>{m.phone}</td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <ScoreRing score={m.score} size={32} />
                                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: getScoreColor(m.score) }}>{getScoreLabel(m.score)}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem', color: '#1b2559' }}>{mc.length} participations</td>
                                    <td style={{ padding: '1.25rem', color: '#707eae' }}>{m.joinDate}</td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button title="Vérifier" style={{ background: '#f4f7fe', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', color: '#059669' }}><ShieldCheck size={18} /></button>
                                            <button title="Modifier" style={{ background: '#f4f7fe', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', color: 'var(--primary)' }}><Edit2 size={18} /></button>
                                            <button title="Bannir" style={{ background: '#f4f7fe', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', color: '#ff4d4f' }}><UserMinus size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
