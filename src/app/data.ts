
export type Role = 'ADMIN' | 'MEMBER' | 'TREASURER' | 'OBSERVER';

export interface Member {
    id: string;
    name: string;
    avatar: string; // Emoji for now
    phone: string;
    joinDate: string;
    score: number; // 0-100 Reliability Score
    role: Role;
}

export type DrawStrategy = 'ROTATIVE' | 'RANDOM' | 'VOTE' | 'BID';

export interface Loan {
    id: string;
    tontineId: string;
    memberId: string;
    amount: number;
    interest: number; // Percentage or fixed amount
    totalToRepay: number;
    requestDate: string;
    dueDate: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID' | 'LATE';
}

export type Frequency = "weekly" | "biweekly" | "monthly";

export interface Tontine {
    id: string;
    name: string;
    description?: string;
    amount: number;
    currency?: string;
    frequency: Frequency;
    startDate?: string;
    totalCycles: number;
    currentCycle: number;
    members: string[]; // List of Member IDs
    status: 'active' | 'completed' | 'pending';
    createdBy?: string;
    rules?: string;
    // New Configurations
    drawStrategy: DrawStrategy;
    fineAmount: number; // Amount per day of delay
    loanInterestEnabled: boolean; // Toggle for interest on loans
    loanInterestRate: number; // Percentage, e.g., 5 for 5%
    maxLoanAmount: number;
    currentBeneficiary?: string;
    activeCycleId?: string;
    nextDrawDate?: string;
}

export type PaymentMethod = "wave" | "om" | "free" | "cash" | "bank";

export interface Contribution {
    id: string;
    tontineId: string;
    memberId: string;
    cycle: number;
    amount: number;
    dueDate: string;
    status: "paid" | "pending" | "late";
    paidDate?: string;
    paymentMethod?: string;
    fineApplied?: number; // Amount of fine if late
}

export interface Notification {
    id: string;
    type: "payment" | "late" | "cycle" | "loan" | "draw";
    read: boolean;
    date: string;
    message: string;
    tontineId?: string;
}

// ... Utilities ...
export const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount).replace('XOF', 'FCFA');
};

export const generateId = () => Math.random().toString(36).substr(2, 9);
export const getScoreColor = (score: number) => {
    if (score >= 90) return "#059669"; // Green
    if (score >= 70) return "#D97706"; // Orange
    return "#DC2626"; // Red
};
export const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Bon";
    if (score >= 50) return "Moyen";
    return "Risqué";
};
export const getStatusBadge = (status: string) => {
    switch (status) {
        case 'paid': return { bg: '#D1FAE5', color: '#065F46', label: 'Payé', icon: '✅' };
        case 'pending': return { bg: '#FEF3C7', color: '#D97706', label: 'En attente', icon: '⏳' };
        case 'late': return { bg: '#FEE2E2', color: '#991B1B', label: 'En retard', icon: '⚠️' };
        case 'APPROVED': return { bg: '#D1FAE5', color: '#065F46', label: 'Approuvé', icon: '✅' };
        case 'REJECTED': return { bg: '#FEE2E2', color: '#991B1B', label: 'Rejeté', icon: '❌' };
        case 'PENDING': return { bg: '#FEF3C7', color: '#D97706', label: 'En attente', icon: '⏳' };
        default: return { bg: '#F3F4F6', color: '#374151', label: status, icon: '•' };
    }
};

export const PAYMENT_METHODS = [
    { id: "wave", name: "Wave", icon: "🌊", color: "#1DC4FF" },
    { id: "om", name: "Orange Money", icon: "🍊", color: "#FF7900" },
    { id: "free", name: "Free Money", icon: "🆓", color: "#EF4444" },
    { id: "cash", name: "Espèces", icon: "💵", color: "#10B981" },
];

// ... Mock Data ...
export const SAMPLE_MEMBERS: Member[] = [
    { id: "m1", name: "Fatou Diop", avatar: "👩🏾", phone: "77 123 45 67", joinDate: "Jan 2024", score: 95, role: 'ADMIN' },
    { id: "m2", name: "Moussa Sow", avatar: "👨🏾", phone: "77 234 56 78", joinDate: "Feb 2024", score: 88, role: 'MEMBER' },
    { id: "m3", name: "Amina Ndiaye", avatar: "🧕🏾", phone: "77 345 67 89", joinDate: "Mar 2024", score: 72, role: 'TREASURER' },
    { id: "m4", name: "Cheikh Fall", avatar: "👴🏾", phone: "77 456 78 90", joinDate: "Apr 2024", score: 98, role: 'MEMBER' },
    { id: "m5", name: "Sophie Gueye", avatar: "👩🏾‍🦱", phone: "76 567 89 01", joinDate: "May 2024", score: 60, role: 'MEMBER' },
];

export const SAMPLE_TONTINES: Tontine[] = [
    {
        id: "t1", name: "Tontine Famille", amount: 50000, frequency: "monthly", totalCycles: 12, currentCycle: 4,
        members: ["m1", "m2", "m3", "m4", "m5"], status: 'active',
        drawStrategy: 'ROTATIVE', fineAmount: 1000, loanInterestEnabled: true, loanInterestRate: 5, maxLoanAmount: 200000, nextDrawDate: '2024-03-01'
    },
    {
        id: "t2", name: "Tontine Bureau", amount: 100000, frequency: "monthly", totalCycles: 10, currentCycle: 2,
        members: ["m1", "m3", "m5"], status: 'active',
        drawStrategy: 'RANDOM', fineAmount: 2500, loanInterestEnabled: false, loanInterestRate: 0, maxLoanAmount: 500000, nextDrawDate: '2024-03-15'
    },
];

export const SAMPLE_LOANS: Loan[] = [
    { id: "l1", tontineId: "t1", memberId: "m2", amount: 50000, interest: 2500, totalToRepay: 52500, requestDate: "2024-02-10", dueDate: "2024-03-10", status: "APPROVED" },
    { id: "l2", tontineId: "t1", memberId: "m5", amount: 20000, interest: 1000, totalToRepay: 21000, requestDate: "2024-02-15", dueDate: "2024-03-15", status: "PENDING" }
];

export const SAMPLE_NOTIFICATIONS: Notification[] = [
    { id: "n1", type: "payment", read: false, date: "Auj. 10:30", message: "Moussa Sow a payé 50 000 FCFA", tontineId: "t1" },
    { id: "n2", type: "late", read: false, date: "Hier 14:00", message: "Rappel : Cotisation en retard pour Sophie", tontineId: "t1" },
    { id: "n3", type: "cycle", read: true, date: "15 Fév", message: "Nouveau cycle démarré : Tour 4", tontineId: "t1" },
    { id: "n4", type: "loan", read: false, date: "16 Fév", message: "Demande de prêt de Sophie Gueye (20 000 FCFA)", tontineId: "t1" },
];

export const generateContributions = (): Contribution[] => {
    const contributions: Contribution[] = [];
    SAMPLE_TONTINES.forEach(tontine => {
        tontine.members.forEach(memberId => {
            // Past cycles (Paid)
            for (let i = 1; i < tontine.currentCycle; i++) {
                contributions.push({
                    id: `${tontine.id}-c${i}-${memberId}`, tontineId: tontine.id, memberId, cycle: i, amount: tontine.amount,
                    dueDate: "2024-01-01", status: "paid", paidDate: "2024-01-05", paymentMethod: "wave"
                });
            }
            // Current cycle
            const status: "paid" | "pending" | "late" = Math.random() > 0.7 ? (Math.random() > 0.5 ? "late" : "pending") : "paid";
            contributions.push({
                id: `${tontine.id}-c${tontine.currentCycle}-${memberId}`, tontineId: tontine.id, memberId, cycle: tontine.currentCycle, amount: tontine.amount,
                dueDate: "2024-02-01", status: status,
                paidDate: status === "paid" ? "2024-02-05" : undefined,
                paymentMethod: status === "paid" ? "wave" : undefined,
                fineApplied: status === "late" ? tontine.fineAmount : 0
            });
        });
    });
    return contributions;
};
