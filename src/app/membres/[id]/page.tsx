
"use client";

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { SAMPLE_MEMBERS, SAMPLE_TONTINES, generateContributions, getScoreColor, getScoreLabel, formatMoney } from '../../data';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Icons } from '../../components/ui/Icons';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ScoreRing } from '../../components/ui/ScoreRing';
import { EmptyState } from '../../components/ui/EmptyState';

export default function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);

    const [members] = useState(SAMPLE_MEMBERS);
    const [tontines] = useState(SAMPLE_TONTINES);
    const [contributions] = useState(generateContributions());

    const member = members.find((m) => m.id === id);
    if (!member) return <EmptyState icon="❌" title="Membre non trouvé" subtitle="Ce membre n'existe pas." />;

    const mc = contributions.filter((c) => c.memberId === id);
    const paidCount = mc.filter((c) => c.status === "paid").length;
    const lateCount = mc.filter((c) => c.status === "late").length;
    const pendingCount = mc.filter((c) => c.status === "pending").length;
    const totalPaid = mc.filter((c) => c.status === "paid").reduce((sum, c) => sum + c.amount, 0);
    const memberTontines = tontines.filter((t) => t.members.includes(id));
    const reliabilityRate = mc.length > 0 ? Math.round((paidCount / mc.length) * 100) : 0;

    return (
        <div style={{ paddingBottom: 100 }}>
            <div style={{ background: "linear-gradient(135deg, #0F4C35 0%, #1B6B4A 50%, #2D9D6F 100%)", padding: "20px 16px 32px", color: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                    <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
                        <Icons.ArrowLeft />
                    </button>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Profil Membre</h2>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <Avatar emoji={member.avatar} size={72} bg="rgba(255,255,255,0.15)" />
                    <div>
                        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{member.name}</div>
                        <div style={{ fontSize: 14, opacity: 0.8 }}>{member.phone}</div>
                        <div style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>Depuis {member.joinDate}</div>
                    </div>
                </div>
            </div>

            <div style={{ padding: "0 16px", marginTop: -20 }}>
                <Card style={{ marginBottom: 20, padding: 24, textAlign: "center" }}>
                    <ScoreRing score={member.score} size={96} />
                    <div style={{ fontSize: 18, fontWeight: 700, color: getScoreColor(member.score), marginTop: 12 }}>Score : {getScoreLabel(member.score)}</div>
                    <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Basé sur la ponctualité des paiements</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 20 }}>
                        <div style={{ padding: 12, background: "#F0FDF4", borderRadius: 12 }}><div style={{ fontSize: 22, fontWeight: 800, color: "#059669" }}>{paidCount}</div><div style={{ fontSize: 11, color: "#6B7280" }}>Payés</div></div>
                        <div style={{ padding: 12, background: "#FEF3C7", borderRadius: 12 }}><div style={{ fontSize: 22, fontWeight: 800, color: "#D97706" }}>{pendingCount}</div><div style={{ fontSize: 11, color: "#6B7280" }}>En attente</div></div>
                        <div style={{ padding: 12, background: "#FEE2E2", borderRadius: 12 }}><div style={{ fontSize: 22, fontWeight: 800, color: "#DC2626" }}>{lateCount}</div><div style={{ fontSize: 11, color: "#6B7280" }}>Retards</div></div>
                    </div>
                </Card>

                <Card style={{ marginBottom: 20 }}>
                    <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>📊 Statistiques</h4>
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontSize: 13, color: "#6B7280" }}>Fiabilité</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: getScoreColor(reliabilityRate) }}>{reliabilityRate}%</span>
                        </div>
                        <ProgressBar value={reliabilityRate} max={100} color={getScoreColor(reliabilityRate)} />
                    </div>
                    {[
                        { l: "Total cotisé", v: formatMoney(totalPaid) },
                        { l: "Tontines actives", v: memberTontines.length },
                        { l: "Paiements", v: mc.length }
                    ].map((item, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
                            <span style={{ fontSize: 13, color: "#6B7280" }}>{item.l}</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{item.v}</span>
                        </div>
                    ))}
                </Card>

                <Card>
                    <h4 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700 }}>🤝 Tontines</h4>
                    {memberTontines.map((t) => (
                        <div key={t.id} onClick={() => router.push(`/tontines/${t.id}`)} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "#F9FAFB", borderRadius: 12, cursor: "pointer", marginBottom: 8 }}>
                            <div style={{ fontSize: 24 }}>🤝</div>
                            <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div><div style={{ fontSize: 12, color: "#6B7280" }}>{formatMoney(t.amount)}</div></div>
                            <span style={{ fontSize: 18, color: "#9CA3AF" }}>›</span>
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    );
}
