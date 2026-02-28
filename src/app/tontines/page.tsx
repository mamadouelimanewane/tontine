
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SAMPLE_TONTINES, SAMPLE_MEMBERS, generateContributions, generateId, formatMoney, Tontine, Frequency } from '../data';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Icons } from '../components/ui/Icons';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { EmptyState } from '../components/ui/EmptyState';

export default function TontinesPage() {
    const router = useRouter();
    const [tontines, setTontines] = useState<Tontine[]>(SAMPLE_TONTINES);
    const [members] = useState(SAMPLE_MEMBERS);
    const [contributions] = useState(generateContributions());
    const [showCreate, setShowCreate] = useState(false);

    // New tontine form state
    const [newTontineName, setNewTontineName] = useState("");
    const [newTontineDesc, setNewTontineDesc] = useState("");
    const [newTontineAmount, setNewTontineAmount] = useState("");
    const [newTontineFreq, setNewTontineFreq] = useState("monthly");

    const handleCreate = () => {
        if (!newTontineName || !newTontineAmount) return;

        const newTontine: Tontine = {
            id: generateId(),
            name: newTontineName,
            description: newTontineDesc,
            amount: parseInt(newTontineAmount),
            currency: "FCFA",
            frequency: newTontineFreq as Frequency,
            startDate: new Date().toISOString().split("T")[0],
            members: ["m1"],
            currentCycle: 1,
            totalCycles: 1,
            currentBeneficiary: "m1",
            status: "active",
            createdBy: "m1",
            rules: "",
            drawStrategy: 'ROTATIVE',
            fineAmount: 0,
            loanInterestEnabled: false,
            loanInterestRate: 0,
            maxLoanAmount: 0,
        };

        setTontines((prev) => [...prev, newTontine]);
        setShowCreate(false);

        // Reset form
        setNewTontineName("");
        setNewTontineDesc("");
        setNewTontineAmount("");
        setNewTontineFreq("monthly");
    };

    return (
        <div style={{ padding: "0 16px 100px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0" }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Mes Tontines</h2>
                <Button onClick={() => setShowCreate(true)} size="sm"><Icons.Plus /> Créer</Button>
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

            {tontines.length === 0 && <EmptyState icon="🤝" title="Aucune tontine" subtitle="Créez votre première tontine !" />}

            <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Nouvelle Tontine">
                <Input
                    label="Nom de la tontine"
                    value={newTontineName}
                    onChange={setNewTontineName}
                    placeholder="Ex: Tontine Famille"
                />
                <Input
                    label="Description"
                    value={newTontineDesc}
                    onChange={setNewTontineDesc}
                    placeholder="Ex: Tontine mensuelle"
                />
                <Input
                    label="Montant (FCFA)"
                    value={newTontineAmount}
                    onChange={setNewTontineAmount}
                    placeholder="25000"
                    type="number"
                />
                <Select
                    label="Fréquence"
                    value={newTontineFreq}
                    onChange={setNewTontineFreq}
                    options={[
                        { value: "weekly", label: "Hebdomadaire" },
                        { value: "biweekly", label: "Bimensuelle" },
                        { value: "monthly", label: "Mensuelle" }
                    ]}
                />
                <Button onClick={handleCreate} style={{ width: "100%", marginTop: 8 }} size="lg">Créer la tontine</Button>
            </Modal>
        </div>
    );
}
