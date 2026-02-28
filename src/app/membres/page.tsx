
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SAMPLE_MEMBERS, generateContributions, getScoreColor, getScoreLabel } from '../data';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Icons } from '../components/ui/Icons';
import { ScoreRing } from '../components/ui/ScoreRing';

export default function MembersPage() {
    const router = useRouter();
    const [members] = useState(SAMPLE_MEMBERS);
    const [contributions] = useState(generateContributions());
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("name");

    const filtered = members
        .filter((m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.phone.includes(search))
        .sort((a, b) => sortBy === "score" ? b.score - a.score : a.name.localeCompare(b.name));

    return (
        <div style={{ padding: "0 16px 100px" }}>
            <div style={{ padding: "20px 0" }}>
                <h2 style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 800 }}>Membres</h2>
                <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                    <div style={{ flex: 1, position: "relative" }}>
                        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}><Icons.Search /></div>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher..."
                            style={{ width: "100%", padding: "11px 14px 11px 38px", borderRadius: 12, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                        />
                    </div>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ padding: "11px 14px", borderRadius: 12, border: "1.5px solid #E5E7EB", fontSize: 13, fontFamily: "inherit", background: "#fff" }}
                    >
                        <option value="name">Nom</option>
                        <option value="score">Score</option>
                    </select>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filtered.map((member) => {
                    const mc = contributions.filter((c) => c.memberId === member.id);
                    const paidCount = mc.filter((c) => c.status === "paid").length;
                    const lateCount = mc.filter((c) => c.status === "late").length;

                    return (
                        <Card key={member.id} onClick={() => router.push(`/membres/${member.id}`)}>
                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                <ScoreRing score={member.score} size={56} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 2 }}>{member.name}</div>
                                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>{member.phone}</div>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <Badge bg="#D1FAE5" color="#065F46" style={{ fontSize: 11 }}>✓ {paidCount}</Badge>
                                        {lateCount > 0 && <Badge bg="#FEE2E2" color="#991B1B" style={{ fontSize: 11 }}>⚠ {lateCount}</Badge>}
                                    </div>
                                </div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: getScoreColor(member.score) }}>{getScoreLabel(member.score)}</div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
