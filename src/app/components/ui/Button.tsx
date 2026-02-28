
import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "danger" | "ghost" | "accent" | "outline";
    size?: "sm" | "md" | "lg";
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, variant = "primary", size = "md", style = {}, disabled = false }) => {
    const variants = {
        primary: { background: "linear-gradient(135deg, #1B6B4A 0%, #2D9D6F 100%)", color: "#fff" },
        secondary: { background: "#F3F4F6", color: "#374151", border: "1px solid #E5E7EB" },
        danger: { background: "#FEE2E2", color: "#991B1B" },
        ghost: { background: "transparent", color: "#6B7280" },
        accent: { background: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)", color: "#fff" },
        outline: { background: "transparent", color: "#1B6B4A", border: "1px solid #1B6B4A" },
    };
    const sizes = { sm: { padding: "8px 14px", fontSize: 13 }, md: { padding: "11px 20px", fontSize: 14 }, lg: { padding: "14px 28px", fontSize: 16 } };

    return (
        <button
            onClick={disabled ? undefined : onClick}
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                border: "none",
                borderRadius: 12,
                cursor: disabled ? "not-allowed" : "pointer",
                fontWeight: 600,
                transition: "all 0.2s ease",
                fontFamily: "inherit",
                opacity: disabled ? 0.5 : 1,
                ...variants[variant],
                ...sizes[size],
                ...style
            }}
        >
            {children}
        </button>
    );
};
