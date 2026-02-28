
"use client";

import React from 'react';
import { useTontine } from '../../context/TontineContext';
import { formatMoney, getStatusBadge, PAYMENT_METHODS } from '../../data';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Search, Download, Calendar } from 'lucide-react';

export default function AdminTransactionsPage() {
    const { contributions, members, tontines } = useTontine();

    const sortedContributions = [...contributions].sort((a, b) => {
        if (!a.paidDate) return 1;
        if (!b.paidDate) return -1;
        return b.paidDate.localeCompare(a.paidDate);
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1b2559', margin: 0 }}>Historique Financier</h2>
                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.25rem',
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                }}>
                    <Download size={18} /> Exporter CSV
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                <Card style={{ padding: '1.5rem' }}>
                    <p style={{ color: '#a3aed0', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>Total Collecté</p>
                    <h3 style={{ color: '#1b2559', fontSize: '1.5rem', fontWeight: 700 }}>{formatMoney(contributions.filter(c => c.status === 'paid').reduce((a, b) => a + b.amount, 0))}</h3>
                </Card>
                <Card style={{ padding: '1.5rem' }}>
                    <p style={{ color: '#a3aed0', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>Transactions (30j)</p>
                    <h3 style={{ color: '#1b2559', fontSize: '1.5rem', fontWeight: 700 }}>{contributions.filter(c => c.status === 'paid').length}</h3>
                </Card>
                <Card style={{ padding: '1.5rem' }}>
                    <p style={{ color: '#a3aed0', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>Moyenne Mise</p>
                    <h3 style={{ color: '#1b2559', fontSize: '1.5rem', fontWeight: 700 }}>{formatMoney(17500)}</h3>
                </Card>
            </div>

            <Card style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #f4f7fe', textAlign: 'left' }}>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Date</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Membre</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Tontine</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Montant</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Méthode</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedContributions.map((c) => {
                            const member = members.find(m => m.id === c.memberId);
                            const tontine = tontines.find(t => t.id === c.tontineId);
                            const status = getStatusBadge(c.status);
                            const method = PAYMENT_METHODS.find(p => p.id === c.paymentMethod);

                            return (
                                <tr key={c.id} style={{ borderBottom: '1px solid #f4f7fe' }}>
                                    <td style={{ padding: '1.25rem', color: '#707eae', fontSize: '0.875rem' }}>
                                        {c.paidDate || c.dueDate}
                                    </td>
                                    <td style={{ padding: '1.25rem', fontWeight: 700, color: '#1b2559' }}>{member?.name}</td>
                                    <td style={{ padding: '1.25rem', color: '#1b2559' }}>{tontine?.name}</td>
                                    <td style={{ padding: '1.25rem', fontWeight: 800, color: c.status === 'paid' ? '#059669' : '#1b2559' }}>
                                        {c.status === 'paid' ? '+' : ''}{formatMoney(c.amount)}
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1b2559' }}>
                                            <span>{method?.icon}</span>
                                            <span>{method?.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <Badge bg={status.bg} color={status.color}>{status.label}</Badge>
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
