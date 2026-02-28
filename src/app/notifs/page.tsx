
"use client";

import React, { useState } from 'react';
import { SAMPLE_NOTIFICATIONS } from '../data';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);

    const handleMarkRead = (id: string) => {
        setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    };

    const currentUnread = notifications.filter((n) => !n.read);
    const currentRead = notifications.filter((n) => n.read);

    return (
        <div style={{ padding: "0 16px 100px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0" }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Notifications</h2>
                {currentUnread.length > 0 && <Button variant="ghost" size="sm" onClick={() => notifications.forEach((n) => handleMarkRead(n.id))} style={{ color: "#2D9D6F" }}>Tout marquer lu</Button>}
            </div>

            {currentUnread.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", marginBottom: 10 }}>Non lues ({currentUnread.length})</div>
                    {currentUnread.map((n) => (
                        <Card key={n.id} onClick={() => handleMarkRead(n.id)} style={{ cursor: "pointer", background: "#F0FDF4", borderLeft: "3px solid #2D9D6F", marginBottom: 8 }}>
                            <div style={{ display: "flex", gap: 12 }}>
                                <div style={{ fontSize: 22 }}>{n.type === "payment" ? "✅" : n.type === "late" ? "⚠️" : n.type === "cycle" ? "🎉" : "🔔"}</div>
                                <div style={{ flex: 1 }}><div style={{ fontSize: 14, color: "#111827", lineHeight: 1.4 }}>{n.message}</div><div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 6 }}>{n.date}</div></div>
                                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#2D9D6F", marginTop: 6 }} />
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {currentRead.length > 0 && (
                <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", marginBottom: 10 }}>Lues</div>
                    {currentRead.map((n) => (
                        <Card key={n.id} style={{ opacity: 0.7, marginBottom: 8 }}>
                            <div style={{ display: "flex", gap: 12 }}>
                                <div style={{ fontSize: 22 }}>{n.type === "payment" ? "✅" : n.type === "late" ? "⚠️" : n.type === "cycle" ? "🎉" : "🔔"}</div>
                                <div style={{ flex: 1 }}><div style={{ fontSize: 14, color: "#374151", lineHeight: 1.4 }}>{n.message}</div><div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 6 }}>{n.date}</div></div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {notifications.length === 0 && <EmptyState icon="🔔" title="Aucune notification" subtitle="Vous êtes à jour !" />}
        </div>
    );
}
