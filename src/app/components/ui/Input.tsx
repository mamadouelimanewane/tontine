
import React from 'react';

interface InputProps {
    label?: string;
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
}

export const Input: React.FC<InputProps> = ({ label, value, onChange, placeholder, type = "text" }) => (
    <div style={{ marginBottom: 16 }}>
        {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>}
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 10,
                border: "1.5px solid #E5E7EB",
                fontSize: 14,
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box"
            }}
        />
    </div>
);
