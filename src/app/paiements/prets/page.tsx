
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTontine } from '../../../context/TontineContext';
import { formatMoney, getStatusBadge } from '../../../data';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Wallet, Plus, AlertCircle } from 'lucide-react';
import { Loan, Tontine } from '../../../data';

export default function LoansPage() {
    const { loans, tontines, requestLoan } = useTontine();
    const [showLoanModal, setShowLoanModal] = useState(false);

    // Form State
    const [selectedTontineId, setSelectedTontineId] = useState("");
    const [amount, setAmount] = useState("");

    const selectedTontine = tontines.find((t: Tontine) => t.id === selectedTontineId);
    const maxLoan = selectedTontine?.maxLoanAmount || 0;
    const interestRate = selectedTontine?.loanInterestRate || 0;

    const handleRequestLoan = () => {
        if (!selectedTontineId || !amount) return;

        // Hardcoded memberId for demo purposes (assuming logged user is 'm1')
        requestLoan({
            tontineId: selectedTontineId,
            memberId: 'm1',
            amount: Number(amount),
            interest: interestRate,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // +30 days
        });
        setShowLoanModal(false);
        setAmount("");
    };

    return (
        <div style={{ padding: "0 16px 100px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0" }}>
                <div>
                    <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>Mes Prêts</h2>
                    <p style={{ margin: 0, fontSize: 14, color: "#6B7280" }}>Gérez vos crédits et remboursements</p>
                </div>
                <Button size="sm" onClick={() => setShowLoanModal(true)}>
                    <Plus size={18} /> Demander
                </Button>
            </div>

            {loans.length === 0 ? (
                <Card style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <div style={{ background: '#F3F4F6', width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <Wallet size={30} color="#9CA3AF" />
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem', fontWeight: 700 }}>Aucun prêt en cours</h3>
                    <p style={{ color: '#6B7280', fontSize: 14 }}>Vous n'avez pas de prêt actif. Besoin d'un coup de pouce ?</p>
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {loans.map((loan: Loan) => {
                        const tontine = tontines.find((t: Tontine) => t.id === loan.tontineId);
                        const status = getStatusBadge(loan.status);

                        return (
                            <Card key={loan.id}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <div>
                                        <div style={{ fontSize: 15, fontWeight: 700 }}>{tontine?.name}</div>
                                        <div style={{ fontSize: 12, color: '#6B7280' }}>Échéance : {loan.dueDate}</div>
                                    </div>
                                    <Badge bg={status.bg} color={status.color}>{status.label}</Badge>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #F3F4F6' }}>
                                    <div>
                                        <div style={{ fontSize: 12, color: '#6B7280' }}>Montant à rembourser</div>
                                        <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>{formatMoney(loan.totalToRepay)}</div>
                                    </div>
                                    {loan.status === 'APPROVED' && (
                                        <Button size="sm" variant="outline">Rembourser</Button>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Loan Request Modal */}
            <Modal isOpen={showLoanModal} onClose={() => setShowLoanModal(false)} title="Demander un prêt">
                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600 }}>Tontine</label>
                    <select
                        value={selectedTontineId}
                        onChange={(e) => setSelectedTontineId(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #E5E7EB', outline: 'none' }}
                    >
                        <option value="">Choisir une tontine</option>
                        {tontines.filter((t: Tontine) => t.status === 'active').map((t: Tontine) => (
                            <option key={t.id} value={t.id}>{t.name} (Max: {formatMoney(t.maxLoanAmount)})</option>
                        ))}
                    </select>
                </div>

                {selectedTontine && (
                    <div style={{ marginBottom: 16, padding: 12, background: '#EFF6FF', borderRadius: 12, border: '1px solid #DBEAFE' }}>
                        {selectedTontine.loanInterestEnabled ? (
                            <div style={{ display: 'flex', gap: 8, fontSize: 13, color: '#1E40AF' }}>
                                <AlertCircle size={16} />
                                <span>Taux d'intérêt : <strong>{interestRate}%</strong></span>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: 8, fontSize: 13, color: '#047857' }}>
                                <AlertCircle size={16} />
                                <span><strong>Prêt sans intérêts</strong> (0%)</span>
                            </div>
                        )}
                        <div style={{ fontSize: 12, color: '#1E40AF', marginLeft: 24, marginTop: 4 }}>
                            Montant max : {formatMoney(maxLoan)}
                        </div>
                    </div>
                )}

                <Input
                    label="Montant souhaité"
                    type="number"
                    value={amount}
                    onChange={setAmount}
                    placeholder="Ex: 50000"
                />

                {amount && selectedTontine && (
                    <div style={{ marginBottom: 20, textAlign: 'right', fontSize: 14 }}>
                        {selectedTontine.loanInterestEnabled ? (
                            <>Total à rembourser : <strong>{formatMoney(Number(amount) + (Number(amount) * interestRate / 100))}</strong></>
                        ) : (
                            <>Total à rembourser : <strong>{formatMoney(Number(amount))}</strong> <span style={{ fontSize: 12, color: '#047857' }}>(Sans frais)</span></>
                        )}
                    </div>
                )}

                <Button onClick={handleRequestLoan} style={{ width: '100%' }} disabled={!selectedTontineId || !amount}>
                    Envoyer la demande
                </Button>
            </Modal>
        </div>
    );
}
