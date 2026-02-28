
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SAMPLE_MEMBERS, SAMPLE_TONTINES, generateContributions, getStatusBadge, PAYMENT_METHODS, formatMoney } from '../data';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Icons } from '../components/ui/Icons';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';

export default function PaymentsPage() {
    const router = useRouter();
    const [members] = useState(SAMPLE_MEMBERS);
    const [tontines] = useState(SAMPLE_TONTINES);
    const [contributions, setContributions] = useState(generateContributions());

    const [showPayment, setShowPayment] = useState(false);
    const [selectedContributionId, setSelectedContributionId] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState("wave");

    // Filter pending contributions
    const pendingContributions = contributions.filter((c) => c.status === "pending" || c.status === "late");

    const handlePayment = () => {
        if (selectedContributionId) {
            setContributions((prev) =>
                prev.map((c) =>
                    c.id === selectedContributionId
                        ? { ...c, status: "paid", paymentMethod, paidDate: new Date().toISOString().split("T")[0] }
                        : c
                )
            );
            setShowPayment(false);
            setSelectedContributionId(null);
        }
    };

    const openPaymentModal = (contribId: string) => {
        setSelectedContributionId(contribId);
        setShowPayment(true);
    };

    const selectedContrib = contributions.find(c => c.id === selectedContributionId);
    const selectedTontine = tontines.find(t => t.id === selectedContrib?.tontineId);
    const selectedMember = members.find(m => m.id === selectedContrib?.memberId);

    return (
        <div style={{ padding: "0 16px 100px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0" }}>
                <div>
                    <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>Paiements</h2>
                    <p style={{ margin: 0, fontSize: 14, color: "#6B7280" }}>Cotisations en attente</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => router.push('/paiements/prets')}>
                    <Icons.Wallet /> Mes Prêts
                </Button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {pendingContributions.map((contrib) => {
                    const tontine = tontines.find((t) => t.id === contrib.tontineId);
                    const member = members.find((m) => m.id === contrib.memberId);
                    const status = getStatusBadge(contrib.status);

                    if (!tontine || !member) return null;

                    return (
                        <Card key={contrib.id}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 2 }}>{tontine.name}</div>
                                    <div style={{ fontSize: 13, color: "#6B7280" }}>Tour {contrib.cycle}</div>
                                </div>
                                <Badge bg={status.bg} color={status.color}>{status.icon} {status.label}</Badge>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                                <Avatar emoji={member.avatar} size={40} />
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 600 }}>{member.name}</div>
                                    <div style={{ fontSize: 12, color: "#6B7280" }}>{member.phone}</div>
                                </div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid #F3F4F6" }}>
                                <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>{formatMoney(contrib.amount)}</div>
                                <Button size="sm" onClick={() => openPaymentModal(contrib.id)}>Payer</Button>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {pendingContributions.length === 0 && <EmptyState icon="🎉" title="Tout est payé !" subtitle="Aucune cotisation en attente." />}

            <Modal isOpen={showPayment} onClose={() => setShowPayment(false)} title="Confirmer le paiement">
                <div style={{ marginBottom: 16, padding: "12px", background: "#F9FAFB", borderRadius: 12 }}>
                    <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>Montant à payer</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>{selectedContrib && formatMoney(selectedContrib.amount)}</div>
                    <div style={{ fontSize: 13, color: "#374151", marginTop: 4 }}>
                        Pour : <strong>{selectedMember?.name}</strong><br />
                        Tontine : <strong>{selectedTontine?.name}</strong>
                    </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Mode de paiement</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        {PAYMENT_METHODS.map((method) => (
                            <div key={method.id} onClick={() => setPaymentMethod(method.id)} style={{
                                display: "flex", alignItems: "center", gap: 8, padding: 12, borderRadius: 12, cursor: "pointer",
                                background: paymentMethod === method.id ? `${method.color}15` : "#F9FAFB",
                                border: paymentMethod === method.id ? `2px solid ${method.color}` : "2px solid transparent",
                            }}>
                                <span style={{ fontSize: 20 }}>{method.icon}</span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: paymentMethod === method.id ? method.color : "#374151" }}>{method.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <Button onClick={handlePayment} style={{ width: "100%" }} size="lg">Confirmer le paiement</Button>
            </Modal>
        </div>
    );
}
