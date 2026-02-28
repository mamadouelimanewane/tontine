
"use client";

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
    SAMPLE_TONTINES,
    SAMPLE_MEMBERS,
    generateContributions,
    PAYMENT_METHODS,
    formatMoney,
    getScoreColor,
    getStatusBadge
} from '../../data';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Icons } from '../../components/ui/Icons';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { ProgressBar } from '../../components/ui/ProgressBar';

export default function TontineDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);

    const [tontines] = useState(SAMPLE_TONTINES);
    const [members] = useState(SAMPLE_MEMBERS);
    const [contributions, setContributions] = useState(generateContributions());

    const [activeTab, setActiveTab] = useState("overview");
    const [showPayment, setShowPayment] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState("wave");

    // Draw State
    const [drawResult, setDrawResult] = useState<string | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const tontine = tontines.find((t) => t.id === id);

    if (!tontine) return <EmptyState icon="❌" title="Tontine non trouvée" subtitle="Cette tontine n'existe pas ou a été supprimée." />;

    const memberObjs = tontine.members.map((mid) => members.find((m) => m.id === mid)).filter(Boolean);
    const currentContribs = contributions.filter((c) => c.tontineId === id && c.cycle === tontine.currentCycle);
    const allContribs = contributions.filter((c) => c.tontineId === id);
    // Note: tontine.currentBeneficiary might be undefined in strict mode if not added to type definition yet, but checking data.ts it is not there properly.
    // For now, let's assume we find the beneficiary from recent draw or just mock it.
    // In data.ts Tontine interface does not have currentBeneficiary. I need to fix that visually or use state.
    // Let's assume the beneficiary is determined by the cycle index for ROTATIVE.
    const beneficiaryId = tontine.drawStrategy === 'ROTATIVE'
        ? tontine.members[(tontine.currentCycle - 1) % tontine.members.length]
        : drawResult;

    const beneficiary = members.find((m) => m.id === beneficiaryId);

    const totalPool = tontine.amount * tontine.members.length;
    const paidThisCycle = currentContribs.filter((c) => c.status === "paid").length;

    const handlePayment = () => {
        if (selectedMemberId) {
            setContributions((prev) =>
                prev.map((c) =>
                    c.tontineId === id && c.memberId === selectedMemberId && c.status !== "paid"
                        ? { ...c, status: "paid", paymentMethod, paidDate: new Date().toISOString().split("T")[0] }
                        : c
                )
            );
            setShowPayment(false);
            setSelectedMemberId(null);
        }
    };

    const performDraw = () => {
        setIsDrawing(true);
        setTimeout(() => {
            const eligibleMembers = tontine.members; // In real app, filter out those who already won
            const winnerId = eligibleMembers[Math.floor(Math.random() * eligibleMembers.length)];
            setDrawResult(winnerId);
            setIsDrawing(false);
        }, 2000);
    };

    return (
        <div style={{ paddingBottom: 100 }}>
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg, #0F4C35 0%, #1B6B4A 50%, #2D9D6F 100%)", padding: "20px 16px 24px", color: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
                        <Icons.ArrowLeft />
                    </button>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, flex: 1 }}>{tontine.name}</h2>
                    <Badge bg="rgba(255,255,255,0.2)" color="#fff">{tontine.frequency}</Badge>
                </div>

                <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 16, padding: 16 }}>
                    <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>🎯 Bénéficiaire du tour {tontine.currentCycle}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {beneficiary ? (
                            <>
                                <Avatar emoji={beneficiary.avatar} size={48} bg="rgba(255,255,255,0.2)" />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 17, fontWeight: 700 }}>{beneficiary.name}</div>
                                    <div style={{ fontSize: 13, opacity: 0.8 }}>Recevra {formatMoney(totalPool)}</div>
                                </div>
                            </>
                        ) : (
                            <div style={{ flex: 1, fontStyle: 'italic', opacity: 0.8 }}>En attente du tirage...</div>
                        )}
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 24, fontWeight: 800 }}>{paidThisCycle}/{tontine.members.length}</div>
                            <div style={{ fontSize: 11, opacity: 0.7 }}>payés</div>
                        </div>
                    </div>
                    <div style={{ marginTop: 12 }}><ProgressBar value={paidThisCycle} max={tontine.members.length} color="#fff" height={6} /></div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", padding: "0 16px", borderBottom: "1px solid #F1F1F4", background: "#fff", position: "sticky", top: 0, zIndex: 10, overflowX: 'auto' }}>
                {["overview", "members", "history", "draw", "rules"].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        flex: 1, minWidth: '80px', padding: "14px 8px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit",
                        color: activeTab === tab ? "#1B6B4A" : "#9CA3AF", borderBottom: activeTab === tab ? "2.5px solid #1B6B4A" : "2.5px solid transparent",
                    }}>
                        {tab === "overview" ? "Aperçu" :
                            tab === "members" ? "Membres" :
                                tab === "history" ? "Historique" :
                                    tab === "draw" ? "Tirage" : "Règles"}
                    </button>
                ))}
            </div>

            <div style={{ padding: 16 }}>
                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                            {[
                                { label: "Cotisation", value: formatMoney(tontine.amount), icon: "💵" },
                                { label: "Cagnotte", value: formatMoney(totalPool), icon: "🏦" },
                                { label: "Tour", value: `${tontine.currentCycle}/${tontine.totalCycles}`, icon: "🔄" },
                                { label: "Membres", value: tontine.members.length, icon: "👥" }
                            ].map((s, i) => (
                                <Card key={i} style={{ padding: 14 }}>
                                    <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                                    <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>{s.label}</div>
                                    <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>{s.value}</div>
                                </Card>
                            ))}
                        </div>

                        <h4 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700 }}>Cotisations du tour {tontine.currentCycle}</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {currentContribs.map((contrib) => {
                                const member = members.find((m) => m.id === contrib.memberId);
                                const status = getStatusBadge(contrib.status);
                                const method = PAYMENT_METHODS.find((p) => p.id === contrib.paymentMethod);
                                return (
                                    <div key={contrib.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#fff", borderRadius: 12, border: "1px solid #F1F1F4" }}>
                                        <Avatar emoji={member?.avatar} size={38} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{member?.name}</div>
                                            {contrib.status === "paid" && method && <div style={{ fontSize: 12, color: "#6B7280" }}>via {method.icon} {method.name}</div>}
                                            {contrib.status === "late" && <div style={{ fontSize: 11, color: "#DC2626", fontWeight: 600 }}>+ Amende: {formatMoney(tontine.fineAmount)}</div>}
                                        </div>
                                        <Badge bg={status.bg} color={status.color}>{status.icon} {status.label}</Badge>
                                    </div>
                                );
                            })}
                        </div>

                        <Button onClick={() => setShowPayment(true)} style={{ width: "100%", marginTop: 20 }} size="lg" variant="accent">
                            <Icons.Wallet /> Enregistrer un paiement
                        </Button>
                    </div>
                )}

                {/* Draw Tab */}
                {activeTab === "draw" && (
                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ fontSize: 60, marginBottom: 10 }}>🔮</div>
                            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Tirage au Sort</h3>
                            <p style={{ color: "#6B7280", margin: "8px 0 0" }}>Mode : <strong>{tontine.drawStrategy === 'ROTATIVE' ? 'Rotatif (Prédéfini)' : tontine.drawStrategy === 'RANDOM' ? 'Aléatoire' : 'Vote'}</strong></p>
                        </div>

                        {tontine.drawStrategy === 'RANDOM' ? (
                            <Card style={{ padding: 30 }}>
                                {isDrawing ? (
                                    <div style={{ fontSize: 24, fontWeight: 700, color: "#D97706" }}>Tirage en cours... 🎲</div>
                                ) : drawResult ? (
                                    <div>
                                        <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 10 }}>Le gagnant est</div>
                                        <Avatar emoji={members.find(m => m.id === drawResult)?.avatar} size={80} style={{ margin: "0 auto 10px" }} />
                                        <div style={{ fontSize: 24, fontWeight: 800, color: "#059669" }}>{members.find(m => m.id === drawResult)?.name}</div>
                                        <div style={{ marginTop: 20 }}>
                                            <Button onClick={() => setDrawResult(null)} variant="outline">Relancer</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p style={{ marginBottom: 20 }}>Le tirage pour le tour {tontine.currentCycle} n'a pas encore été effectué.</p>
                                        <Button onClick={performDraw} size="lg" style={{ width: "100%" }}>Lancer le tirage</Button>
                                    </div>
                                )}
                            </Card>
                        ) : (
                            <Card style={{ padding: 20, textAlign: 'left' }}>
                                <p>Ce mode de tirage ({tontine.drawStrategy}) ne nécessite pas d'action manuelle ou n'est pas encore supporté interactivement.</p>
                                <div style={{ background: '#F9FAFB', padding: 10, borderRadius: 8, marginTop: 10 }}>
                                    <strong>Prochain bénéficiaire :</strong><br />
                                    {members.find(m => m.id === beneficiaryId)?.name || "Non défini"}
                                </div>
                            </Card>
                        )}
                    </div>
                )}

                {/* Members Tab */}
                {activeTab === "members" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {memberObjs.map((member, index) => {
                            if (!member) return null;
                            const mc = allContribs.filter((c) => c.memberId === member.id);
                            return (
                                <Card key={member.id} onClick={() => router.push(`/membres/${member.id}`)}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                        <div style={{ position: "relative" }}>
                                            <Avatar emoji={member.avatar} size={48} />
                                            <div style={{ position: "absolute", bottom: -2, right: -2, background: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: getScoreColor(member.score), border: `2px solid ${getScoreColor(member.score)}` }}>{member.score}</div>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 15, fontWeight: 600 }}>
                                                {member.name}
                                                <Badge bg="#F3F4F6" color="#374151" style={{ marginLeft: 6, fontSize: 10 }}>{member.role}</Badge>
                                            </div>
                                            <div style={{ fontSize: 12, color: "#6B7280" }}>{member.phone}</div>
                                        </div>
                                        {((tontine.drawStrategy === 'ROTATIVE' && index + 1 === tontine.currentCycle) || (member.id === drawResult)) &&
                                            <Badge bg="#FEF3C7" color="#92400E">🎯 Bénéf.</Badge>
                                        }
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* History Tab */}
                {activeTab === "history" && (
                    <div>
                        {Array.from({ length: tontine.currentCycle }, (_, i) => tontine.currentCycle - i).map((cycle) => {
                            const cc = allContribs.filter((c) => c.cycle === cycle);
                            const cp = cc.filter((c) => c.status === "paid").length;
                            const cbId = tontine.drawStrategy === 'ROTATIVE' ? tontine.members[(cycle - 1) % tontine.members.length] : undefined;
                            const cb = members.find((m) => m.id === cbId);

                            return (
                                <div key={cycle} style={{ marginBottom: 20 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <Badge bg={cycle === tontine.currentCycle ? "#D1FAE5" : "#F3F4F6"} color={cycle === tontine.currentCycle ? "#065F46" : "#6B7280"}>Tour {cycle}</Badge>
                                            {cb && <span style={{ fontSize: 12, color: "#6B7280" }}>→ {cb.avatar} {cb.name}</span>}
                                        </div>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: "#2D9D6F" }}>{cp}/{cc.length}</span>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                        {cc.map((contrib) => {
                                            const member = members.find((m) => m.id === contrib.memberId);
                                            const status = getStatusBadge(contrib.status);
                                            return (
                                                <div key={contrib.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#F9FAFB", borderRadius: 10 }}>
                                                    <Avatar emoji={member?.avatar} size={28} />
                                                    <span style={{ flex: 1, fontSize: 13, color: "#374151" }}>{member?.name}</span>
                                                    <span style={{ fontSize: 12, color: status.color, fontWeight: 600 }}>{status.icon} {status.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Rules Tab */}
                {activeTab === "rules" && (
                    <div>
                        <Card style={{ marginBottom: 16 }}>
                            <h4 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700 }}>Paramètres Avancés</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <div style={{ background: '#F9FAFB', padding: 10, borderRadius: 8 }}>
                                    <div style={{ fontSize: 11, color: '#6B7280' }}>Amende Retard</div>
                                    <div style={{ fontWeight: 700 }}>{formatMoney(tontine.fineAmount)} / jour</div>
                                </div>
                                <div style={{ background: '#F9FAFB', padding: 10, borderRadius: 8 }}>
                                    <div style={{ fontSize: 11, color: '#6B7280' }}>Taux Prêt</div>
                                    <div style={{ fontWeight: 700 }}>{tontine.loanInterestRate}%</div>
                                </div>
                                <div style={{ background: '#F9FAFB', padding: 10, borderRadius: 8 }}>
                                    <div style={{ fontSize: 11, color: '#6B7280' }}>Mode Tirage</div>
                                    <div style={{ fontWeight: 700 }}>{tontine.drawStrategy}</div>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <h4 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700 }}>📅 Calendrier des tours</h4>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {tontine.members.map((memberId, index) => {
                                    const member = members.find((m) => m.id === memberId);
                                    const isCurrent = index + 1 === tontine.currentCycle;
                                    const isPast = index + 1 < tontine.currentCycle;
                                    return (
                                        <div key={memberId} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: isCurrent ? "#F0FDF4" : "#F9FAFB", borderRadius: 10, border: isCurrent ? "1.5px solid #2D9D6F" : "1px solid transparent", opacity: isPast ? 0.5 : 1 }}>
                                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: isCurrent ? "#2D9D6F" : isPast ? "#D1FAE5" : "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: isCurrent ? "#fff" : "#6B7280" }}>{isPast ? "✓" : index + 1}</div>
                                            <Avatar emoji={member?.avatar} size={30} />
                                            <span style={{ flex: 1, fontSize: 13, fontWeight: isCurrent ? 700 : 400, color: isCurrent ? "#065F46" : "#374151" }}>{member?.name}</span>
                                            {isCurrent && <Badge bg="#D1FAE5" color="#065F46">En cours</Badge>}
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            <Modal isOpen={showPayment} onClose={() => setShowPayment(false)} title="Enregistrer un paiement">
                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Membre à débiter</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {currentContribs.filter((c) => c.status !== "paid").map((contrib) => {
                            const member = members.find((m) => m.id === contrib.memberId);
                            const isSelected = selectedMemberId === contrib.memberId;
                            return (
                                <div key={contrib.memberId} onClick={() => setSelectedMemberId(contrib.memberId)} style={{
                                    display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, cursor: "pointer",
                                    background: isSelected ? "#F0FDF4" : "#F9FAFB", border: isSelected ? "2px solid #2D9D6F" : "2px solid transparent",
                                }}>
                                    <Avatar emoji={member?.avatar} size={36} />
                                    <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{member?.name}</div><div style={{ fontSize: 12, color: "#6B7280" }}>{formatMoney(tontine.amount)}</div></div>
                                    {isSelected && <div style={{ color: "#2D9D6F" }}><Icons.Check /></div>}
                                </div>
                            );
                        })}
                        {currentContribs.filter((c) => c.status !== "paid").length === 0 && <div style={{ textAlign: "center", padding: 20, color: "#9CA3AF", fontSize: 14 }}>✅ Tous les membres ont payé !</div>}
                    </div>
                </div>

                <Button onClick={handlePayment} style={{ width: "100%" }} size="lg" disabled={!selectedMemberId}>Confirmer le paiement</Button>
            </Modal>
        </div>
    );
}
