
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SAMPLE_MEMBERS, SAMPLE_TONTINES, generateContributions, getStatusBadge, PAYMENT_METHODS, formatMoney } from '../data';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Icons } from '../components/ui/Icons';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import {
    PaymentStatus,
    PaymentTransaction,
    PaymentProvider,
    PROVIDER_CONFIG,
    validatePhone,
    initiatePayment,
} from '../services/paymentApi';

// ---- Payment Flow Steps ----
type FlowStep = 'SELECT_METHOD' | 'ENTER_PHONE' | 'CONFIRM' | 'PROCESSING' | 'RESULT';

export default function PaymentsPage() {
    const router = useRouter();
    const [members] = useState(SAMPLE_MEMBERS);
    const [tontines] = useState(SAMPLE_TONTINES);
    const [contributions, setContributions] = useState(generateContributions());

    // Modal state
    const [showPayment, setShowPayment] = useState(false);
    const [selectedContributionId, setSelectedContributionId] = useState<string | null>(null);

    // Payment flow state
    const [flowStep, setFlowStep] = useState<FlowStep>('SELECT_METHOD');
    const [paymentMethod, setPaymentMethod] = useState<PaymentProvider>('wave');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('IDLE');
    const [transaction, setTransaction] = useState<PaymentTransaction | null>(null);
    const [cancelFn, setCancelFn] = useState<(() => void) | null>(null);

    // Filter pending contributions
    const pendingContributions = contributions.filter((c) => c.status === "pending" || c.status === "late");
    const selectedContrib = contributions.find(c => c.id === selectedContributionId);
    const selectedTontine = tontines.find(t => t.id === selectedContrib?.tontineId);
    const selectedMember = members.find(m => m.id === selectedContrib?.memberId);

    const resetFlow = useCallback(() => {
        setFlowStep('SELECT_METHOD');
        setPaymentMethod('wave');
        setPhoneNumber('');
        setPhoneError('');
        setPaymentStatus('IDLE');
        setTransaction(null);
        if (cancelFn) cancelFn();
        setCancelFn(null);
    }, [cancelFn]);

    const openPaymentModal = (contribId: string) => {
        resetFlow();
        setSelectedContributionId(contribId);
        setShowPayment(true);
    };

    const closeModal = () => {
        if (cancelFn) cancelFn();
        setShowPayment(false);
        setSelectedContributionId(null);
        resetFlow();
    };

    // Step 1 → Step 2
    const handleSelectMethod = (method: PaymentProvider) => {
        setPaymentMethod(method);
        if (method === 'cash') {
            setFlowStep('CONFIRM');
        } else {
            setFlowStep('ENTER_PHONE');
        }
    };

    // Step 2 → Step 3
    const handlePhoneSubmit = () => {
        const result = validatePhone(phoneNumber);
        if (!result.valid) {
            setPhoneError('Numéro invalide. Format : 77 123 45 67');
            return;
        }
        setPhoneError('');
        setFlowStep('CONFIRM');
    };

    // Step 3 → Step 4 (initiate payment)
    const handleConfirmPayment = () => {
        if (!selectedContrib) return;
        setFlowStep('PROCESSING');

        const { cancel } = initiatePayment(
            paymentMethod,
            phoneNumber,
            selectedContrib.amount,
            (status: PaymentStatus, txn?: PaymentTransaction) => {
                setPaymentStatus(status);
                if (txn) setTransaction(txn);

                if (status === 'SUCCESS') {
                    setFlowStep('RESULT');
                    // Update contribution
                    setContributions((prev) =>
                        prev.map((c) =>
                            c.id === selectedContributionId
                                ? { ...c, status: "paid", paymentMethod, paidDate: new Date().toISOString().split("T")[0] }
                                : c
                        )
                    );
                } else if (status === 'FAILED') {
                    setFlowStep('RESULT');
                }
            }
        );
        setCancelFn(() => cancel);
    };

    const config = PROVIDER_CONFIG[paymentMethod];
    const phoneValidation = validatePhone(phoneNumber);

    // ---- Processing status messages ----
    const getStatusMessage = () => {
        switch (paymentStatus) {
            case 'INITIATING':
                return `📡 Connexion à ${config.name}...`;
            case 'WAITING_USSD':
                return `📱 Composez ${config.ussdCode} sur votre téléphone pour confirmer`;
            case 'PROCESSING':
                return '⏳ Traitement en cours...';
            default:
                return '';
        }
    };

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
                                <Button size="sm" onClick={() => openPaymentModal(contrib.id)}>Cotisez</Button>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {pendingContributions.length === 0 && <EmptyState icon="🎉" title="Tout est payé !" subtitle="Aucune cotisation en attente." />}

            {/* ===================== PAYMENT MODAL ===================== */}
            <Modal isOpen={showPayment} onClose={closeModal} title={
                flowStep === 'SELECT_METHOD' ? "Mode de paiement" :
                    flowStep === 'ENTER_PHONE' ? `Payer via ${config.name}` :
                        flowStep === 'CONFIRM' ? 'Confirmer le paiement' :
                            flowStep === 'PROCESSING' ? 'Paiement en cours...' :
                                paymentStatus === 'SUCCESS' ? 'Paiement réussi !' : 'Paiement échoué'
            }>
                {/* ---- STEP 1: Select Payment Method ---- */}
                {flowStep === 'SELECT_METHOD' && (
                    <div>
                        <div style={{ marginBottom: 16, padding: "12px", background: "#F9FAFB", borderRadius: 12 }}>
                            <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>Montant à payer</div>
                            <div style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>{selectedContrib && formatMoney(selectedContrib.amount)}</div>
                            <div style={{ fontSize: 13, color: "#374151", marginTop: 4 }}>
                                Pour : <strong>{selectedMember?.name}</strong><br />
                                Tontine : <strong>{selectedTontine?.name}</strong>
                            </div>
                        </div>

                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 10 }}>Choisissez votre mode de paiement</label>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {(['wave', 'om', 'free', 'cash'] as PaymentProvider[]).map((providerId) => {
                                const pConfig = PROVIDER_CONFIG[providerId];
                                return (
                                    <div
                                        key={providerId}
                                        onClick={() => handleSelectMethod(providerId)}
                                        style={{
                                            display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14,
                                            cursor: "pointer", border: "2px solid #E5E7EB", transition: "all 0.2s",
                                            background: "#fff",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = pConfig.color;
                                            e.currentTarget.style.background = `${pConfig.color}08`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = '#E5E7EB';
                                            e.currentTarget.style.background = '#fff';
                                        }}
                                    >
                                        <div style={{
                                            width: 44, height: 44, borderRadius: 12, background: pConfig.gradient,
                                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#fff",
                                        }}>
                                            {pConfig.icon}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{pConfig.name}</div>
                                            <div style={{ fontSize: 12, color: "#6B7280" }}>
                                                {pConfig.feePercent === 0 ? 'Sans frais' : `Frais : ${pConfig.feePercent}%`}
                                                {providerId !== 'cash' && ` • USSD : ${pConfig.ussdCode}`}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: 20, color: "#D1D5DB" }}>›</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ---- STEP 2: Enter Phone Number ---- */}
                {flowStep === 'ENTER_PHONE' && (
                    <div>
                        <div style={{
                            textAlign: "center", padding: "20px", marginBottom: 20,
                            background: config.gradient, borderRadius: 16, color: "#fff",
                        }}>
                            <div style={{ fontSize: 32, marginBottom: 8 }}>{config.icon}</div>
                            <div style={{ fontSize: 18, fontWeight: 700 }}>Paiement {config.name}</div>
                            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>
                                {selectedContrib && formatMoney(selectedContrib.amount)}
                            </div>
                            {config.feePercent > 0 && selectedContrib && (
                                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
                                    Frais : {formatMoney(Math.round(selectedContrib.amount * config.feePercent / 100))}
                                </div>
                            )}
                        </div>

                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                            Numéro de téléphone
                        </label>
                        <div style={{ position: "relative", marginBottom: phoneError ? 4 : 16 }}>
                            <span style={{
                                position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                                fontSize: 14, fontWeight: 600, color: "#6B7280",
                            }}>+221</span>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => {
                                    setPhoneNumber(e.target.value);
                                    setPhoneError('');
                                }}
                                placeholder="77 123 45 67"
                                style={{
                                    width: "100%", padding: "14px 14px 14px 56px", borderRadius: 12,
                                    border: phoneError ? "2px solid #EF4444" : "1.5px solid #E5E7EB",
                                    fontSize: 16, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
                                    fontWeight: 600, letterSpacing: "0.5px",
                                }}
                                maxLength={12}
                                autoFocus
                            />
                        </div>
                        {phoneError && (
                            <p style={{ color: "#EF4444", fontSize: 12, margin: "0 0 12px" }}>{phoneError}</p>
                        )}
                        {phoneValidation.valid && (
                            <div style={{
                                display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
                                background: "#F0FDF4", borderRadius: 8, marginBottom: 16, fontSize: 13, color: "#047857",
                            }}>
                                ✅ Opérateur : <strong>{phoneValidation.operator}</strong>
                            </div>
                        )}

                        <div style={{ display: "flex", gap: 8 }}>
                            <Button variant="outline" onClick={() => setFlowStep('SELECT_METHOD')} style={{ flex: 1 }}>
                                ← Retour
                            </Button>
                            <Button onClick={handlePhoneSubmit} style={{ flex: 2 }}>
                                Continuer →
                            </Button>
                        </div>
                    </div>
                )}

                {/* ---- STEP 3: Confirm ---- */}
                {flowStep === 'CONFIRM' && (
                    <div>
                        <div style={{
                            background: "#F9FAFB", borderRadius: 16, padding: 20, marginBottom: 20,
                        }}>
                            <div style={{ textAlign: "center", marginBottom: 16 }}>
                                <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 4 }}>Montant total</div>
                                <div style={{ fontSize: 32, fontWeight: 800, color: "#111827" }}>
                                    {selectedContrib && formatMoney(
                                        selectedContrib.amount + Math.round(selectedContrib.amount * config.feePercent / 100)
                                    )}
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                                    <span style={{ color: "#6B7280" }}>Méthode</span>
                                    <span style={{ fontWeight: 600, color: config.color }}>
                                        {config.icon} {config.name}
                                    </span>
                                </div>
                                {paymentMethod !== 'cash' && (
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                                        <span style={{ color: "#6B7280" }}>Téléphone</span>
                                        <span style={{ fontWeight: 600 }}>+221 {phoneValidation.formatted}</span>
                                    </div>
                                )}
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                                    <span style={{ color: "#6B7280" }}>Cotisation</span>
                                    <span style={{ fontWeight: 600 }}>{selectedContrib && formatMoney(selectedContrib.amount)}</span>
                                </div>
                                {config.feePercent > 0 && selectedContrib && (
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                                        <span style={{ color: "#6B7280" }}>Frais ({config.feePercent}%)</span>
                                        <span style={{ fontWeight: 600, color: "#EF4444" }}>
                                            +{formatMoney(Math.round(selectedContrib.amount * config.feePercent / 100))}
                                        </span>
                                    </div>
                                )}
                                <div style={{ borderTop: "1px dashed #D1D5DB", paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                                    <span style={{ color: "#6B7280" }}>Tontine</span>
                                    <span style={{ fontWeight: 600 }}>{selectedTontine?.name}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                                    <span style={{ color: "#6B7280" }}>Bénéficiaire</span>
                                    <span style={{ fontWeight: 600 }}>{selectedMember?.name}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                            <Button variant="outline" onClick={() => setFlowStep(paymentMethod === 'cash' ? 'SELECT_METHOD' : 'ENTER_PHONE')} style={{ flex: 1 }}>
                                ← Retour
                            </Button>
                            <Button onClick={handleConfirmPayment} style={{ flex: 2, background: config.gradient, border: "none" }}>
                                Confirmer le paiement
                            </Button>
                        </div>
                    </div>
                )}

                {/* ---- STEP 4: Processing ---- */}
                {flowStep === 'PROCESSING' && (
                    <div style={{ textAlign: "center", padding: "2rem 0" }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: "50%", margin: "0 auto 1.5rem",
                            background: config.gradient, display: "flex", alignItems: "center", justifyContent: "center",
                            animation: "pulse 1.5s infinite",
                        }}>
                            <span style={{ fontSize: 36 }}>{config.icon}</span>
                        </div>

                        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#1B2559" }}>
                            {paymentStatus === 'INITIATING' && `Connexion à ${config.name}...`}
                            {paymentStatus === 'WAITING_USSD' && 'En attente de confirmation'}
                            {paymentStatus === 'PROCESSING' && 'Traitement en cours'}
                        </h3>

                        <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 20 }}>
                            {getStatusMessage()}
                        </p>

                        {/* Progress Steps */}
                        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
                            {['INITIATING', 'WAITING_USSD', 'PROCESSING'].map((step, i) => {
                                const steps: PaymentStatus[] = ['INITIATING', 'WAITING_USSD', 'PROCESSING'];
                                const currentIndex = steps.indexOf(paymentStatus);
                                const isActive = i <= currentIndex;
                                return (
                                    <div key={step} style={{
                                        width: 40, height: 5, borderRadius: 3,
                                        background: isActive ? config.color : '#E5E7EB',
                                        transition: "background 0.5s ease",
                                    }} />
                                );
                            })}
                        </div>

                        {paymentStatus === 'WAITING_USSD' && paymentMethod !== 'cash' && (
                            <div style={{
                                background: "#FEF3C7", borderRadius: 12, padding: "14px 16px",
                                display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#92400E",
                                textAlign: "left",
                            }}>
                                <span style={{ fontSize: 20 }}>📱</span>
                                <div>
                                    <strong>Action requise</strong><br />
                                    Composez <strong>{config.ussdCode}</strong> sur votre téléphone pour valider la transaction
                                </div>
                            </div>
                        )}

                        {transaction?.reference && (
                            <div style={{ marginTop: 16, fontSize: 12, color: "#9CA3AF" }}>
                                Réf : {transaction.reference}
                            </div>
                        )}
                    </div>
                )}

                {/* ---- STEP 5: Result ---- */}
                {flowStep === 'RESULT' && (
                    <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                        {paymentStatus === 'SUCCESS' ? (
                            <>
                                <div style={{
                                    width: 80, height: 80, borderRadius: "50%", margin: "0 auto 1.5rem",
                                    background: "linear-gradient(135deg, #10B981, #059669)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    boxShadow: "0 8px 30px rgba(5, 150, 105, 0.3)",
                                }}>
                                    <span style={{ fontSize: 36, color: "#fff" }}>✓</span>
                                </div>

                                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#059669", marginBottom: 8 }}>
                                    Paiement réussi !
                                </h3>
                                <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>
                                    Votre cotisation a été payée via {config.name}
                                </p>

                                {/* Receipt */}
                                <div style={{
                                    background: "#F9FAFB", borderRadius: 14, padding: 16, textAlign: "left",
                                    marginBottom: 20, border: "1px dashed #D1D5DB",
                                }}>
                                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: "#374151" }}>🧾 Reçu de paiement</div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        {[
                                            { label: 'Référence', value: transaction?.reference },
                                            { label: 'Transaction ID', value: transaction?.providerResponse?.transactionId },
                                            { label: 'Méthode', value: `${config.icon} ${config.name}` },
                                            { label: 'Montant', value: selectedContrib && formatMoney(selectedContrib.amount) },
                                            { label: 'Frais', value: transaction?.providerResponse ? formatMoney(transaction.providerResponse.fee) : '0 FCFA' },
                                            { label: 'Date', value: new Date().toLocaleString('fr-FR') },
                                        ].map((row) => (
                                            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                                                <span style={{ color: "#6B7280" }}>{row.label}</span>
                                                <span style={{ fontWeight: 600, color: "#111827" }}>{row.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button onClick={closeModal} style={{ width: "100%", background: "linear-gradient(135deg, #10B981, #059669)", border: "none" }}>
                                    Terminé
                                </Button>
                            </>
                        ) : (
                            <>
                                <div style={{
                                    width: 80, height: 80, borderRadius: "50%", margin: "0 auto 1.5rem",
                                    background: "linear-gradient(135deg, #EF4444, #DC2626)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    boxShadow: "0 8px 30px rgba(239, 68, 68, 0.3)",
                                }}>
                                    <span style={{ fontSize: 36, color: "#fff" }}>✕</span>
                                </div>

                                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#DC2626", marginBottom: 8 }}>
                                    Paiement échoué
                                </h3>
                                <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 8 }}>
                                    {transaction?.providerResponse?.message || 'Une erreur est survenue'}
                                </p>
                                <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 24 }}>
                                    Réf : {transaction?.reference}
                                </p>

                                <div style={{ display: "flex", gap: 8 }}>
                                    <Button variant="outline" onClick={closeModal} style={{ flex: 1 }}>
                                        Annuler
                                    </Button>
                                    <Button onClick={() => {
                                        resetFlow();
                                    }} style={{ flex: 2, background: "linear-gradient(135deg, #EF4444, #DC2626)", border: "none" }}>
                                        Réessayer
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </Modal>

            {/* Pulse animation */}
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.08); opacity: 0.85; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
