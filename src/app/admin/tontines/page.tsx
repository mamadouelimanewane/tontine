
"use client";

import React from 'react';
import { useTontine } from '../../context/TontineContext';
import { formatMoney } from '../../data';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Icons } from '../../components/ui/Icons';
import { MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';

export default function AdminTontinesPage() {
    const { tontines, contributions } = useTontine();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1b2559', margin: 0 }}>Gestion des Tontines</h2>
                <Button onClick={() => { }} style={{ padding: '0.75rem 1.5rem' }}>
                    <Icons.Plus /> Créer une Tontine
                </Button>
            </div>

            <Card style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #f4f7fe', textAlign: 'left' }}>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>ID</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Nom</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Montant</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Fréquence</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Tour Actuel</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Utilisateurs</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Statut</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tontines.map((t) => (
                            <tr key={t.id} style={{ borderBottom: '1px solid #f4f7fe' }}>
                                <td style={{ padding: '1.25rem', fontSize: '0.875rem', color: '#707eae' }}>#{t.id}</td>
                                <td style={{ padding: '1.25rem', fontWeight: 700, color: '#1b2559' }}>{t.name}</td>
                                <td style={{ padding: '1.25rem', fontWeight: 600, color: '#1b2559' }}>{formatMoney(t.amount)}</td>
                                <td style={{ padding: '1.25rem', color: '#1b2559' }}>{t.frequency}</td>
                                <td style={{ padding: '1.25rem', fontWeight: 600, color: '#1b2559' }}>{t.currentCycle}/{t.totalCycles}</td>
                                <td style={{ padding: '1.25rem', color: '#1b2559' }}>{t.members.length} membres</td>
                                <td style={{ padding: '1.25rem' }}>
                                    <Badge
                                        bg={t.status === 'active' ? '#d1fae5' : '#fef3c7'}
                                        color={t.status === 'active' ? '#065f46' : '#92400e'}
                                    >
                                        {t.status}
                                    </Badge>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button style={{ background: '#f4f7fe', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', color: '#1b2559' }}><Eye size={18} /></button>
                                        <button style={{ background: '#f4f7fe', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', color: 'var(--primary)' }}><Edit2 size={18} /></button>
                                        <button style={{ background: '#f4f7fe', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', color: '#ff4d4f' }}><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
