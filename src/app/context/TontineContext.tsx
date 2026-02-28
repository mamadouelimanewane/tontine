
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
    Tontine,
    Member,
    Contribution,
    Notification,
    Loan,
    SAMPLE_TONTINES,
    SAMPLE_MEMBERS,
    SAMPLE_NOTIFICATIONS,
    SAMPLE_LOANS,
    generateContributions,
    generateId,
    formatMoney
} from '../data';

interface TontineContextType {
    tontines: Tontine[];
    members: Member[];
    contributions: Contribution[];
    loans: Loan[];
    notifications: Notification[];
    addTontine: (tontine: Tontine) => void;
    recordPayment: (tontineId: string, memberId: string, paymentMethod: string) => void;
    requestLoan: (loan: Omit<Loan, 'id' | 'status' | 'requestDate' | 'totalToRepay'>) => void;
    approveLoan: (loanId: string) => void;
    rejectLoan: (loanId: string) => void;
    markNotificationRead: (id: string) => void;
    markAllNotificationsRead: () => void;
}

const TontineContext = createContext<TontineContextType | undefined>(undefined);

export const TontineProvider = ({ children }: { children: ReactNode }) => {
    const [tontines, setTontines] = useState<Tontine[]>(SAMPLE_TONTINES);
    const [members] = useState<Member[]>(SAMPLE_MEMBERS);
    const [contributions, setContributions] = useState<Contribution[]>(generateContributions());
    const [loans, setLoans] = useState<Loan[]>(SAMPLE_LOANS);
    const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);

    const addTontine = (tontine: Tontine) => {
        setTontines((prev) => [...prev, tontine]);
    };

    const recordPayment = (tontineId: string, memberId: string, paymentMethod: string) => {
        setContributions((prev) =>
            prev.map((c) =>
                c.tontineId === tontineId && c.memberId === memberId && (c.status === "pending" || c.status === "late")
                    ? { ...c, status: "paid", paymentMethod, paidDate: new Date().toISOString().split("T")[0] }
                    : c
            )
        );

        // Add notification
        const member = members.find((m) => m.id === memberId);
        const tontine = tontines.find((t) => t.id === tontineId);
        if (!tontine || !member) return;

        const newNotif: Notification = {
            id: generateId(),
            type: "payment",
            read: false,
            date: new Date().toISOString().split("T")[0],
            message: `${member?.name} a payé - ${formatMoney(tontine?.amount || 0)}`,
            tontineId
        };
        setNotifications((prev) => [newNotif, ...prev]);
    };

    const requestLoan = (loanData: Omit<Loan, 'id' | 'status' | 'requestDate' | 'totalToRepay'>) => {
        // Basic calculation, handling amount as base + interest
        const interestAmount = (loanData.amount * loanData.interest) / 100;
        const totalToRepay = loanData.amount + interestAmount;

        const newLoan: Loan = {
            ...loanData,
            id: generateId(),
            status: 'PENDING',
            requestDate: new Date().toISOString().split('T')[0],
            interest: interestAmount, // Store the calculated interest amount
            totalToRepay
        };

        setLoans(prev => [newLoan, ...prev]);

        const member = members.find(m => m.id === loanData.memberId);
        const newNotif: Notification = {
            id: generateId(),
            type: 'loan',
            read: false,
            date: 'A l\'instant',
            message: `Nouvelle demande de prêt : ${member?.name} (${formatMoney(loanData.amount)})`
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const approveLoan = (loanId: string) => {
        setLoans(prev => prev.map(l => l.id === loanId ? { ...l, status: 'APPROVED' } : l));
    };

    const rejectLoan = (loanId: string) => {
        setLoans(prev => prev.map(l => l.id === loanId ? { ...l, status: 'REJECTED' } : l));
    };

    const markNotificationRead = (id: string) => {
        setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    };

    const markAllNotificationsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    return (
        <TontineContext.Provider value={{
            tontines,
            members,
            contributions,
            loans,
            notifications,
            addTontine,
            recordPayment,
            requestLoan,
            approveLoan,
            rejectLoan,
            markNotificationRead,
            markAllNotificationsRead
        }}>
            {children}
        </TontineContext.Provider>
    );
};

export const useTontine = () => {
    const context = useContext(TontineContext);
    if (context === undefined) {
        throw new Error('useTontine must be used within a TontineProvider');
    }
    return context;
};
