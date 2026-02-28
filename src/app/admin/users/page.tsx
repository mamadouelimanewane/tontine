
"use client";

import React, { useState } from 'react';
import { useTontine } from '../../context/TontineContext';
import { getScoreColor } from '../../data';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Search, Mail, Phone, ShieldCheck, UserPlus, Filter } from 'lucide-react';

export default function AdminUsersPage() {
    const { members } = useTontine();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone.includes(searchTerm)
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1b2559', margin: 0 }}>Gestion des Utilisateurs</h2>
                    <p style={{ color: '#a3aed0', margin: '4px 0 0', fontSize: '0.875rem' }}>Visualisez et gérez les rôles de vos membres.</p>
                </div>
                <Button style={{ padding: '0.75rem 1.5rem', display: 'flex', gap: '8px' }}>
                    <UserPlus size={20} /> Inviter un membre
                </Button>
            </div>

            <Card style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a3aed0' }} size={20} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou téléphone..."
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
                    <Filter size={18} /> Filtres
                </button>
            </Card>

            <Card style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #f4f7fe', textAlign: 'left' }}>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Utilisateur</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Rôle</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Fiabilité</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Date d'adhésion</th>
                            <th style={{ padding: '1.25rem', color: '#a3aed0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.map((m) => (
                            <tr key={m.id} style={{ borderBottom: '1px solid #f4f7fe' }}>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <Avatar emoji={m.avatar} size={40} />
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 700, color: '#1b2559' }}>{m.name}</p>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#a3aed0' }}>{m.phone}</p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <Badge bg={m.role === 'ADMIN' ? '#e1e7ff' : '#f4f7fe'} color={m.role === 'ADMIN' ? '#4318ff' : '#a3aed0'}>
                                        {m.role}
                                    </Badge>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '48px', height: '8px', backgroundColor: '#f4f7fe', borderRadius: '10px', overflow: 'hidden' }}>
                                            <div style={{ width: `${m.score}%`, height: '100%', backgroundColor: getScoreColor(m.score) }} />
                                        </div>
                                        <span style={{ fontWeight: 700, color: '#1b2559', fontSize: '0.875rem' }}>{m.score}%</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem', color: '#707eae', fontSize: '0.875rem' }}>{m.joinDate}</td>
                                <td style={{ padding: '1.25rem' }}>
                                    <button style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '10px',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: 'transparent',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        color: '#1b2559',
                                        cursor: 'pointer'
                                    }}>Editer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
