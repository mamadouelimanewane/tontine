
// ============================================================
// Mock Payment API Service — Wave, Orange Money, Free Money
// Simulates real mobile money flows for demo/presentation
// ============================================================

export type PaymentProvider = 'wave' | 'om' | 'free' | 'cash';

export type PaymentStatus =
    | 'IDLE'
    | 'INITIATING'       // Sending request to provider
    | 'WAITING_USSD'     // User needs to dial USSD / confirm on phone
    | 'PROCESSING'       // Provider is processing
    | 'SUCCESS'
    | 'FAILED';

export interface PaymentTransaction {
    id: string;
    provider: PaymentProvider;
    phoneNumber: string;
    amount: number;
    status: PaymentStatus;
    reference: string;
    timestamp: string;
    providerResponse?: ProviderResponse;
}

export interface ProviderResponse {
    code: string;
    message: string;
    transactionId: string;
    providerName: string;
    fee: number;
    netAmount: number;
}

// ---- Provider configurations ----
export const PROVIDER_CONFIG: Record<PaymentProvider, {
    name: string;
    color: string;
    gradient: string;
    icon: string;
    logo: string;
    ussdCode: string;
    feePercent: number;
    minAmount: number;
    maxAmount: number;
    processingTimeMs: number; // simulated delay
    successRate: number; // 0-1, for demo always high
}> = {
    wave: {
        name: 'Wave',
        color: '#1DC4FF',
        gradient: 'linear-gradient(135deg, #1DC4FF, #0098D4)',
        icon: '🌊',
        logo: '/wave-logo.svg',
        ussdCode: '#2#',
        feePercent: 0,
        minAmount: 100,
        maxAmount: 5000000,
        processingTimeMs: 2500,
        successRate: 0.95,
    },
    om: {
        name: 'Orange Money',
        color: '#FF7900',
        gradient: 'linear-gradient(135deg, #FF7900, #FF5500)',
        icon: '🍊',
        logo: '/om-logo.svg',
        ussdCode: '#144*82#',
        feePercent: 1,
        minAmount: 500,
        maxAmount: 2000000,
        processingTimeMs: 3500,
        successRate: 0.92,
    },
    free: {
        name: 'Free Money',
        color: '#EF4444',
        gradient: 'linear-gradient(135deg, #EF4444, #B91C1C)',
        icon: '🆓',
        logo: '/free-logo.svg',
        ussdCode: '#555#',
        feePercent: 0.5,
        minAmount: 200,
        maxAmount: 3000000,
        processingTimeMs: 3000,
        successRate: 0.90,
    },
    cash: {
        name: 'Espèces',
        color: '#10B981',
        gradient: 'linear-gradient(135deg, #10B981, #047857)',
        icon: '💵',
        logo: '',
        ussdCode: '',
        feePercent: 0,
        minAmount: 0,
        maxAmount: 10000000,
        processingTimeMs: 1000,
        successRate: 1,
    }
};

// ---- Generate Reference ----
const generateReference = (provider: PaymentProvider): string => {
    const prefix = provider === 'wave' ? 'WV' : provider === 'om' ? 'OM' : provider === 'free' ? 'FM' : 'CA';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
};

// ---- Validate Phone Number (Senegalese format) ----
export const validatePhone = (phone: string): { valid: boolean; formatted: string; operator?: string } => {
    const cleaned = phone.replace(/\s/g, '').replace(/^\+221/, '');
    if (cleaned.length !== 9) return { valid: false, formatted: phone };

    const prefix = cleaned.substring(0, 2);

    // Wave accepts all operators
    if (['77', '78', '70', '76', '75'].includes(prefix)) {
        let operator = 'Orange';
        if (['76', '75'].includes(prefix)) operator = 'Free';
        if (['78'].includes(prefix)) operator = 'Wave/Orange';
        return { valid: true, formatted: `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`, operator };
    }

    return { valid: false, formatted: phone };
};

// ---- Simulate Payment Flow ----
export const initiatePayment = (
    provider: PaymentProvider,
    phoneNumber: string,
    amount: number,
    onStatusChange: (status: PaymentStatus, transaction?: PaymentTransaction) => void
): { cancel: () => void } => {
    const config = PROVIDER_CONFIG[provider];
    const reference = generateReference(provider);
    let cancelled = false;

    const transaction: PaymentTransaction = {
        id: Math.random().toString(36).substr(2, 9),
        provider,
        phoneNumber,
        amount,
        status: 'INITIATING',
        reference,
        timestamp: new Date().toISOString(),
    };

    // Step 1: Initiating (Contacting provider API)
    onStatusChange('INITIATING', transaction);

    const step1Timeout = setTimeout(() => {
        if (cancelled) return;

        if (provider === 'cash') {
            // Cash: skip USSD, go straight to processing
            transaction.status = 'PROCESSING';
            onStatusChange('PROCESSING', transaction);
        } else {
            // Mobile money: waiting for USSD confirmation
            transaction.status = 'WAITING_USSD';
            onStatusChange('WAITING_USSD', transaction);
        }

        const step2Timeout = setTimeout(() => {
            if (cancelled) return;

            // Step 3: Processing
            transaction.status = 'PROCESSING';
            onStatusChange('PROCESSING', transaction);

            const step3Timeout = setTimeout(() => {
                if (cancelled) return;

                // Step 4: Final result (success or fail)
                const isSuccess = Math.random() < config.successRate;

                if (isSuccess) {
                    const fee = Math.round(amount * config.feePercent / 100);
                    transaction.status = 'SUCCESS';
                    transaction.providerResponse = {
                        code: '200',
                        message: 'Transaction réussie',
                        transactionId: `TXN-${Date.now()}`,
                        providerName: config.name,
                        fee,
                        netAmount: amount - fee,
                    };
                } else {
                    transaction.status = 'FAILED';
                    transaction.providerResponse = {
                        code: '402',
                        message: 'Solde insuffisant ou numéro invalide',
                        transactionId: '',
                        providerName: config.name,
                        fee: 0,
                        netAmount: 0,
                    };
                }

                onStatusChange(transaction.status, transaction);
            }, config.processingTimeMs * 0.4);

            // Store timeout for cleanup
            timeouts.push(step3Timeout);
        }, provider === 'cash' ? 500 : config.processingTimeMs * 0.4);

        timeouts.push(step2Timeout);
    }, 800);

    const timeouts: ReturnType<typeof setTimeout>[] = [step1Timeout];

    return {
        cancel: () => {
            cancelled = true;
            timeouts.forEach(clearTimeout);
        }
    };
};

// ---- Format amount for display ----
export const formatAmountXOF = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
};
