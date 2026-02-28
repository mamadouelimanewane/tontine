
"use client";

import React, { useState } from 'react';
import { SAMPLE_TONTINES, SAMPLE_MEMBERS, generateContributions, PAYMENT_METHODS, formatMoney } from '../data';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ScoreRing } from '../components/ui/ScoreRing';
import { Avatar } from '../components/ui/Avatar';

export default function StatisticsPage() {
    const [members] = useState(SAMPLE_MEMBERS);
    const [contributions] = useState(generateContributions());

    const totalCollected = contributions.filter((c) => c.status === "paid").reduce((sum, c) => sum + c.amount, 0);
    const totalPending = contributions.filter((c) => c.status === "pending").reduce((sum, c) => sum + c.amount, 0);
    const totalLate = contributions.filter((c) => c.status === "late").reduce((sum, c) => sum + c.amount, 0);
    const totalExpected = contributions.reduce((sum, c) => sum + c.amount, 0);
    const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

    const paymentMethodStats = PAYMENT_METHODS.map((method) => ({
        ...method, count: contributions.filter((c) => c.paymentMethod === method.id && c.status === "paid").length,
    })).sort((a, b) => b.count - a.count);

    const topMembers = [...members].sort((a, b) => b.score - a.score).slice(0, 5);

    return (
        <div style={{ padding: "0 16px 100px" }}>
            <div style={{ padding: "20px 0" }}>
                <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>Statistiques</h2>
                <p style={{ margin: 0, fontSize: 14, color: "#6B7280" }}>Vue d&apos;ensemble</p>
            </div>

            <Card style={{ marginBottom: 16, padding: 24, textAlign: "center" }}>
                <ScoreRing score={collectionRate} size={100} />
                <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginTop: 12 }}>Taux de collecte</div>
                <div style={{ fontSize: 13, color: "#6B7280" }}>{formatMoney(totalCollected)} / {formatMoney(totalExpected)}</div>
            </Card>

            <Card style={{ marginBottom: 16 }}>
                <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>💰 Résumé financier</h4>
                {[
                    { label: "Collecté", value: formatMoney(totalCollected), color: "#059669", bg: "#D1FAE5", amount: totalCollected },
                    { label: "En attente", value: formatMoney(totalPending), color: "#D97706", bg: "#FEF3C7", amount: totalPending },
                    { label: "En retard", value: formatMoney(totalLate), color: "#DC2626", bg: "#FEE2E2", amount: totalLate }
                ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: item.bg, borderRadius: 12, marginBottom: 8 }}>
                        <div style={{ flex: 1 }}><div style={{ fontSize: 13, color: "#6B7280" }}>{item.label}</div><div style={{ fontSize: 18, fontWeight: 800, color: item.color }}>{item.value}</div></div>
                        <div style={{ width: 60 }}><ProgressBar value={item.amount} max={totalExpected} color={item.color} /></div>
                    </div>
                ))}
            </Card>

            <Card style={{ marginBottom: 16 }}>
                <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>📱 Modes de paiement</h4>
                {paymentMethodStats.map((method) => {
                    const maxCount = Math.max(...paymentMethodStats.map((m) => m.count));
                    return (
                        <div key={method.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                            <div style={{ width: 36, textAlign: "center", fontSize: 20 }}>{method.icon}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 13, fontWeight: 600 }}>{method.name}</span><span style={{ fontSize: 13, fontWeight: 700, color: method.color }}>{method.count}</span></div>
                                <ProgressBar value={method.count} max={maxCount} color={method.color} height={6} />
                            </div>
                        </div>
                    );
                })}
            </Card>

            <Card>
                <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>⭐ Top Membres</h4>
                {topMembers.map((member, i) => (
                    <div key={member.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, background: i === 0 ? "#FEF3C7" : "#F9FAFB" }}>
                            {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                        </div>
                        <Avatar emoji={member.avatar} size={36} />
                        <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{member.name}</div>
                        <ScoreRing score={member.score} size={42} />
                    </div>
                ))}
            </Card>
        </div>
    );
}
