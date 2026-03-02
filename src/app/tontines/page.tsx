
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { SAMPLE_TONTINES, SAMPLE_MEMBERS, generateContributions, formatMoney } from '../data';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { EmptyState } from '../components/ui/EmptyState';

export default function TontinesPage() {
    const router = useRouter();
    const tontines = SAMPLE_TONTINES;
    const members = SAMPLE_MEMBERS;
    const contributions = generateContributions();

    return (
        <div style={{ padding: "0 16px 100px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0" }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Mes Tontines</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {tontines.map((tontine) => {
                    const memberObjs = tontine.members.map((id) => members.find((m) => m.id === id)).filter(Boolean);
                    const tc = contributions.filter((c) => c.tontineId === tontine.id && c.cycle === tontine.currentCycle);
                    const paid = tc.filter((c) => c.status === "paid").length;

                    return (
                        <Card key={tontine.id} onClick={() => router.push(`/tontines/${tontine.id}`)}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                                <div>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{tontine.name}</div>
                                    <div style={{ fontSize: 13, color: "#6B7280" }}>{tontine.description}</div>
                                </div>
                                <Badge bg="#D1FAE5" color="#065F46">Actif</Badge>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                                <div style={{ padding: "10px 12px", background: "#F9FAFB", borderRadius: 10 }}>
                                    <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Cotisation</div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{formatMoney(tontine.amount)}</div>
                                </div>
                                <div style={{ padding: "10px 12px", background: "#F9FAFB", borderRadius: 10 }}>
                                    <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Fréquence</div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
                                        {tontine.frequency === "monthly" ? "Mensuelle" : tontine.frequency === "weekly" ? "Hebdo" : "Bimensuelle"}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ display: "flex" }}>
                                    {memberObjs.slice(0, 5).map((m, i) => (
                                        // eslint-disable-next-line react/no-array-index-key
                                        <div key={i} style={{ marginLeft: i > 0 ? -8 : 0, zIndex: 5 - i }}>
                                            <Avatar emoji={m?.avatar} size={30} bg="#E5E7EB" />
                                        </div>
                                    ))}
                                    {memberObjs.length > 5 && (
                                        <div style={{ marginLeft: -8, width: 30, height: 30, borderRadius: "50%", background: "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#6B7280" }}>
                                            +{memberObjs.length - 5}
                                        </div>
                                    )}
                                </div>
                                <div style={{ fontSize: 13, color: "#6B7280" }}>
                                    <span style={{ fontWeight: 700, color: "#2D9D6F" }}>{paid}</span>/{tc.length} payés
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {tontines.length === 0 && <EmptyState icon="🤝" title="Aucune tontine" subtitle="Contactez votre administrateur pour rejoindre une tontine." />}
        </div>
    );
}
