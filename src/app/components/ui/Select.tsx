
import React from 'react';

interface SelectProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, value, onChange, options }) => (
    <div style={{ marginBottom: 16 }}>
        {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>}
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 10,
                border: "1.5px solid #E5E7EB",
                fontSize: 14,
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
                background: "#fff"
            }}
        >
            {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);
