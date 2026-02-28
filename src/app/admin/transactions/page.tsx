
"use client";

import React, { useState } from 'react';
import { useTontine } from '../../context/TontineContext';
import { formatMoney, getStatusBadge } from '../../data';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Download, Search, Table, List, Filter } from 'lucide-react';

export default function AdminTransactionsPage() {
    const { contributions, tontines, members } = useTontine();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTransactions = contributions.filter(c => {
        const member = members.find(m => m.id === c.memberId);
        const tontine = tontines.find(t => t.id === c.tontineId);
        return (
            member?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tontine?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1b2559', margin: 0 }}>Journal des Transactions</h2>
                    <p style={{ color: '#a3aed0', margin: '4px 0 0', fontSize: '0.875rem' }}>Suivez l'historique de toutes les cotisations et retards.</p>
                </div>
                <button style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '16px',
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: 700,
                    color: '#1b2559',
                    cursor: 'pointer'
                }}>
                    <Download size={18} /> Exporter Rapport CSV
                </button>
            </div>

            <Card style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a3aed0' }} size={20} />
                    <input
                        type="text"
                        placeholder="Rechercher par membre, tontine ou statut..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.75rem',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#f4f7fe',
                            outline: 'none',
                            fontSize: '0.875rem'
                        }}
                    />
                </div>
                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#fff',
                    color: '#707eae',
                    fontWeight: 600,
                    cursor: 'pointer'
                }}>
                    <Filter size={18} /> Filtres Avancés
                </button>
            </Card>

            <Card style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #f4f7fe', textAlign: 'left' }}>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>ID</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Membre</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Tontine</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Tour</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Échéance</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Montant</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((c) => {
                            const member = members.find(m => m.id === c.memberId);
                            const tontine = tontines.find(t => t.id === c.tontineId);
                            const badge = getStatusBadge(c.status);
                            return (
                                <tr key={c.id} style={{ borderBottom: '1px solid #f4f7fe' }}>
                                    <td style={{ padding: '1.25rem', color: '#707eae', fontSize: '0.75rem' }}>#{c.id.slice(-6)}</td>
                                    <td style={{ padding: '1.25rem', fontWeight: 700, color: '#1b2559' }}>{member?.name}</td>
                                    <td style={{ padding: '1.25rem', color: '#1b2559' }}>{tontine?.name}</td>
                                    <td style={{ padding: '1.25rem', color: '#1b2559', fontWeight: 600 }}>T{c.cycle}</td>
                                    <td style={{ padding: '1.25rem', color: '#707eae', fontSize: '0.875rem' }}>{c.dueDate}</td>
                                    <td style={{ padding: '1.25rem', color: '#1b2559', fontWeight: 700 }}>{formatMoney(c.amount)}</td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <Badge bg={badge.bg} color={badge.color}>
                                            {badge.label}
                                        </Badge>
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
