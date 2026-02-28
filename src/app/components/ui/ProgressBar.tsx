
import React from 'react';

interface ProgressBarProps {
    value: number;
    max: number;
    color?: string;
    height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, color = "#2D9D6F", height = 8 }) => (
    <div style={{ background: "#F3F4F6", borderRadius: height, height, overflow: "hidden", width: "100%" }}>
        <div
            style={{
                width: `${Math.min((value / max) * 100, 100)}%`,
                height: "100%",
                background: color,
                borderRadius: height,
                transition: "width 0.5s ease"
            }}
        />
    </div>
);
