
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    style?: React.CSSProperties;
    onClick?: () => void;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, style = {}, onClick, className }) => (
    <div
        onClick={onClick}
        className={`card ${className || ''}`}
        style={{
            background: "#fff",
            borderRadius: 16,
            padding: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
            border: "1px solid #F1F1F4",
            cursor: onClick ? "pointer" : "default",
            transition: "all 0.2s ease",
            ...style
        }}
    >
        {children}
    </div>
);
