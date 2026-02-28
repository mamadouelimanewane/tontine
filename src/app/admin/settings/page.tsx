
"use client";

import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Shield, Bell, Smartphone, Globe, Save } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export default function AdminSettingsPage() {
    const [appName, setAppName] = useState("TontinePay");
    const [currency, setCurrency] = useState("FCFA");

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1b2559', margin: 0 }}>Paramètres du Système</h2>
                <Button style={{ padding: '0.75rem 1.5rem' }}>
                    <Save size={18} style={{ marginRight: '0.5rem' }} /> Enregistrer les modifications
                </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* General Settings */}
                <Card style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <Globe color="var(--primary)" size={24} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1b2559', margin: 0 }}>Général</h3>
                    </div>

                    <Input
                        label="Nom de l'application"
                        value={appName}
                        onChange={setAppName}
                    />

                    <Select
                        label="Devise Principale"
                        value={currency}
                        onChange={setCurrency}
                        options={[
                            { value: "FCFA", label: "Franc CFA (XOF)" },
                            { value: "EUR", label: "Euro (€)" },
                            { value: "USD", label: "Dollar ($)" }
                        ]}
                    />

                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Langue par défaut</label>
                        <Select
                            value="fr"
                            onChange={() => { }}
                            options={[
                                { value: "fr", label: "Français" },
                                { value: "en", label: "English" },
                                { value: "wolof", label: "Wolof" }
                            ]}
                        />
                    </div>
                </Card>

                {/* Security Settings */}
                <Card style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <Shield color="#ff4d4f" size={24} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1b2559', margin: 0 }}>Sécurité</h3>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #f4f7fe' }}>
                        <div>
                            <p style={{ margin: 0, fontWeight: 600, color: '#1b2559' }}>Authentification à deux facteurs</p>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#a3aed0' }}>Ajoutez une couche de sécurité supplémentaire</p>
                        </div>
                        <input type="checkbox" defaultChecked style={{ width: '40px', height: '20px', cursor: 'pointer' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #f4f7fe' }}>
                        <div>
                            <p style={{ margin: 0, fontWeight: 600, color: '#1b2559' }}>Validation manuelle des gros paiements</p>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#a3aed0' }}>Pour les transactions {'>'} 500 000 FCFA</p>
                        </div>
                        <input type="checkbox" defaultChecked style={{ width: '40px', height: '20px', cursor: 'pointer' }} />
                    </div>
                </Card>

                {/* Notification Settings */}
                <Card style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <Bell color="#4318FF" size={24} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1b2559', margin: 0 }}>Notifications</h3>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #f4f7fe' }}>
                        <div>
                            <p style={{ margin: 0, fontWeight: 600, color: '#1b2559' }}>Alertes SMS pour retards</p>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#a3aed0' }}>Envoyer un SMS automatique après 24h de retard</p>
                        </div>
                        <input type="checkbox" defaultChecked style={{ width: '40px', height: '20px', cursor: 'pointer' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
                        <div>
                            <p style={{ margin: 0, fontWeight: 600, color: '#1b2559' }}>Notifications Push App</p>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#a3aed0' }}>Paiements reçus et nouveaux tours</p>
                        </div>
                        <input type="checkbox" defaultChecked style={{ width: '40px', height: '20px', cursor: 'pointer' }} />
                    </div>
                </Card>

                {/* Integration Settings */}
                <Card style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <Smartphone color="#6AD2FF" size={24} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1b2559', margin: 0 }}>Intégrations Paiement</h3>
                    </div>

                    {['Wave', 'Orange Money', 'Free Money'].map((provider) => (
                        <div key={provider} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #f4f7fe' }}>
                            <p style={{ margin: 0, fontWeight: 600, color: '#1b2559' }}>{provider} API</p>
                            <Badge bg="#d1fae5" color="#065f46">Connecté</Badge>
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    );
}
