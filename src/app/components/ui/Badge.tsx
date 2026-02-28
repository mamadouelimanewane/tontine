
import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    bg?: string;
    color?: string;
    style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({ children, bg, color, style = {} }) => (
    <span style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        background: bg,
        color,
        ...style
    }}>
        {children}
    </span>
);
