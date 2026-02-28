import { useState, useEffect, useCallback } from "react";

const generateId = () => Math.random().toString(36).substr(2, 9);

const PAYMENT_METHODS = [
  { id: "wave", name: "Wave", icon: "📱", color: "#1DC3C3" },
  { id: "orange_money", name: "Orange Money", icon: "🟠", color: "#FF6600" },
  { id: "free_money", name: "Free Money", icon: "🔵", color: "#0066CC" },
  { id: "cash", name: "Espèces", icon: "💵", color: "#2D8F2D" },
];

const SAMPLE_MEMBERS = [
  { id: "m1", name: "Fatou Diop", phone: "77 123 45 67", avatar: "👩🏾", joinDate: "2024-01-15", score: 95 },
  { id: "m2", name: "Moussa Ndiaye", phone: "78 234 56 78", avatar: "👨🏾", joinDate: "2024-01-15", score: 88 },
  { id: "m3", name: "Aminata Sow", phone: "76 345 67 89", avatar: "👩🏾‍🦱", joinDate: "2024-02-01", score: 100 },
  { id: "m4", name: "Ibrahima Fall", phone: "77 456 78 90", avatar: "👨🏾‍🦲", joinDate: "2024-02-01", score: 72 },
  { id: "m5", name: "Mariama Ba", phone: "78 567 89 01", avatar: "👩🏾‍🦰", joinDate: "2024-03-01", score: 91 },
  { id: "m6", name: "Ousmane Diallo", phone: "76 678 90 12", avatar: "👨🏾‍🦳", joinDate: "2024-03-01", score: 65 },
  { id: "m7", name: "Aissatou Sy", phone: "77 789 01 23", avatar: "👩🏾", joinDate: "2024-04-01", score: 98 },
  { id: "m8", name: "Cheikh Mbaye", phone: "78 890 12 34", avatar: "👨🏾", joinDate: "2024-04-01", score: 80 },
];

const SAMPLE_TONTINES = [
  {
    id: "t1", name: "Tontine Famille Diop", description: "Tontine mensuelle de la famille",
    amount: 25000, currency: "FCFA", frequency: "monthly", startDate: "2024-01-15",
    members: ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8"],
    currentCycle: 7, totalCycles: 8, currentBeneficiary: "m7", status: "active",
    createdBy: "m1", rules: "Cotisation le 15 de chaque mois. Retard max 3 jours. Amende de 1000 FCFA par jour de retard.",
  },
  {
    id: "t2", name: "Tontine Collègues Bureau", description: "Tontine hebdomadaire entre collègues",
    amount: 10000, currency: "FCFA", frequency: "weekly", startDate: "2024-06-01",
    members: ["m1", "m3", "m5", "m7"], currentCycle: 3, totalCycles: 4,
    currentBeneficiary: "m5", status: "active", createdBy: "m3",
    rules: "Cotisation chaque lundi. Pas de retard toléré.",
  },
];

const generateContributions = () => {
  const contributions = [];
  const statuses = ["paid", "paid", "paid", "paid", "pending", "late"];
  SAMPLE_TONTINES.forEach((tontine) => {
    for (let cycle = 1; cycle <= tontine.currentCycle; cycle++) {
      tontine.members.forEach((memberId) => {
        const isPast = cycle < tontine.currentCycle;
        const status = isPast ? "paid" : statuses[Math.floor(Math.random() * statuses.length)];
        contributions.push({
          id: generateId(), tontineId: tontine.id, memberId, cycle, amount: tontine.amount, status,
          paymentMethod: PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)].id,
          paidDate: status === "paid" ? `2024-${String(cycle).padStart(2, "0")}-${Math.floor(Math.random() * 15 + 10)}` : null,
          dueDate: `2024-${String(cycle).padStart(2, "0")}-15`,
        });
      });
    }
  });
  return contributions;
};

const SAMPLE_NOTIFICATIONS = [
  { id: "n1", type: "reminder", message: "Rappel : Cotisation Tontine Famille Diop due dans 2 jours", date: "2024-07-13", read: false, tontineId: "t1" },
  { id: "n2", type: "payment", message: "Aminata Sow a payé sa cotisation - 25 000 FCFA", date: "2024-07-14", read: false, tontineId: "t1" },
  { id: "n3", type: "late", message: "⚠️ Ousmane Diallo est en retard de 2 jours", date: "2024-07-17", read: true, tontineId: "t1" },
  { id: "n4", type: "cycle", message: "🎉 Nouveau tour ! C'est au tour de Aissatou Sy", date: "2024-07-15", read: true, tontineId: "t1" },
  { id: "n5", type: "payment", message: "Mariama Ba a payé via Wave - 10 000 FCFA", date: "2024-07-08", read: true, tontineId: "t2" },
];

const formatMoney = (amount) => new Intl.NumberFormat("fr-SN").format(amount) + " FCFA";
const getScoreColor = (score) => score >= 90 ? "#059669" : score >= 75 ? "#D97706" : score >= 50 ? "#EA580C" : "#DC2626";
const getScoreLabel = (score) => score >= 90 ? "Excellent" : score >= 75 ? "Bon" : score >= 50 ? "Moyen" : "Faible";
const getStatusBadge = (status) => {
  const map = {
    paid: { label: "Payé", bg: "#D1FAE5", color: "#065F46", icon: "✓" },
    pending: { label: "En attente", bg: "#FEF3C7", color: "#92400E", icon: "⏳" },
    late: { label: "En retard", bg: "#FEE2E2", color: "#991B1B", icon: "⚠" },
  };
  return map[status] || map.pending;
};

const Icons = {
  Home: () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10"/></svg>,
  Group: () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  Users: () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M14 7a4 4 0 11-8 0 4 4 0 018 0zM22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  Bell: () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
  Chart: () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
  Plus: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>,
  ArrowLeft: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  Search: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  Close: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  Check: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>,
  Wallet: () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
};

const Badge = ({ children, bg, color, style = {} }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: bg, color, ...style }}>{children}</span>
);

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)", border: "1px solid #F1F1F4", cursor: onClick ? "pointer" : "default", transition: "all 0.2s ease", ...style }}>{children}</div>
);

const Button = ({ children, onClick, variant = "primary", size = "md", style = {}, disabled = false }) => {
  const variants = {
    primary: { background: "linear-gradient(135deg, #1B6B4A 0%, #2D9D6F 100%)", color: "#fff" },
    secondary: { background: "#F3F4F6", color: "#374151", border: "1px solid #E5E7EB" },
    danger: { background: "#FEE2E2", color: "#991B1B" },
    ghost: { background: "transparent", color: "#6B7280" },
    accent: { background: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)", color: "#fff" },
  };
  const sizes = { sm: { padding: "8px 14px", fontSize: 13 }, md: { padding: "11px 20px", fontSize: 14 }, lg: { padding: "14px 28px", fontSize: 16 } };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, border: "none", borderRadius: 12, cursor: disabled ? "not-allowed" : "pointer", fontWeight: 600, transition: "all 0.2s ease", fontFamily: "inherit", opacity: disabled ? 0.5 : 1, ...variants[variant], ...sizes[size], ...style }}>
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>}
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>}
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", background: "#fff" }}>
      {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

const ProgressBar = ({ value, max, color = "#2D9D6F", height = 8 }) => (
  <div style={{ background: "#F3F4F6", borderRadius: height, height, overflow: "hidden", width: "100%" }}>
    <div style={{ width: `${Math.min((value / max) * 100, 100)}%`, height: "100%", background: color, borderRadius: height, transition: "width 0.5s ease" }} />
  </div>
);

const Avatar = ({ emoji, size = 44, bg = "#F3F4F6" }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.5, flexShrink: 0 }}>{emoji}</div>
);

const EmptyState = ({ icon, title, subtitle }) => (
  <div style={{ textAlign: "center", padding: "48px 20px", color: "#9CA3AF" }}>
    <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
    <div style={{ fontSize: 16, fontWeight: 600, color: "#6B7280", marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: 14 }}>{subtitle}</div>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", background: "#fff", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, maxHeight: "85vh", overflow: "auto", padding: "24px 20px 32px", animation: "slideUp 0.3s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "#F3F4F6", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Icons.Close /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

const ScoreRing = ({ score, size = 64 }) => {
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F3F4F6" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.28, fontWeight: 700, color }}>{score}</div>
    </div>
  );
};

// === DASHBOARD ===
const Dashboard = ({ tontines, members, contributions, notifications, onNavigate }) => {
  const totalCollected = contributions.filter((c) => c.status === "paid").reduce((sum, c) => sum + c.amount, 0);
  const pendingAmount = contributions.filter((c) => c.status === "pending" || c.status === "late").reduce((sum, c) => sum + c.amount, 0);
  const lateCount = contributions.filter((c) => c.status === "late" && c.cycle === tontines[0]?.currentCycle).length;
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #0F4C35 0%, #1B6B4A 50%, #2D9D6F 100%)", padding: "28px 20px 80px", borderRadius: "0 0 32px 32px", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, position: "relative" }}>
          <div>
            <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 2 }}>Bienvenue 👋</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>TontinePay</div>
          </div>
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => onNavigate("notifications")}>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}><Icons.Bell /></div>
            {unreadNotifs > 0 && <div style={{ position: "absolute", top: -2, right: -2, background: "#EF4444", color: "#fff", borderRadius: "50%", width: 20, height: 20, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadNotifs}</div>}
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 6 }}>Total collecté</div>
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>{formatMoney(totalCollected)}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, padding: "0 16px", marginTop: -48 }}>
        {[{ label: "Tontines", value: tontines.length, icon: "🤝", bg: "#EFF6FF" }, { label: "Membres", value: members.length, icon: "👥", bg: "#F0FDF4" }, { label: "En retard", value: lateCount, icon: "⚠️", bg: lateCount > 0 ? "#FEF2F2" : "#F0FDF4" }].map((stat, i) => (
          <Card key={i} style={{ padding: 14, textAlign: "center", background: stat.bg }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{stat.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 500 }}>{stat.label}</div>
          </Card>
        ))}
      </div>

      {pendingAmount > 0 && (
        <div style={{ margin: "20px 16px 0", padding: "14px 16px", background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)", borderRadius: 14, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 28 }}>💰</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#92400E" }}>Cotisations en attente</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#78350F" }}>{formatMoney(pendingAmount)}</div>
          </div>
        </div>
      )}

      <div style={{ padding: "24px 16px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>Mes Tontines</h3>
          <Button variant="ghost" size="sm" onClick={() => onNavigate("tontines")} style={{ color: "#2D9D6F", fontWeight: 600 }}>Voir tout →</Button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tontines.map((tontine) => {
            const tc = contributions.filter((c) => c.tontineId === tontine.id && c.cycle === tontine.currentCycle);
            const paid = tc.filter((c) => c.status === "paid").length;
            const beneficiary = members.find((m) => m.id === tontine.currentBeneficiary);
            return (
              <Card key={tontine.id} onClick={() => onNavigate("tontine-detail", tontine.id)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 3 }}>{tontine.name}</div>
                    <div style={{ fontSize: 13, color: "#6B7280" }}>{tontine.frequency === "monthly" ? "Mensuelle" : "Hebdomadaire"} · {formatMoney(tontine.amount)}</div>
                  </div>
                  <Badge bg="#D1FAE5" color="#065F46">Tour {tontine.currentCycle}/{tontine.totalCycles}</Badge>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, padding: "8px 12px", background: "#F0FDF4", borderRadius: 10 }}>
                  <Avatar emoji={beneficiary?.avatar} size={32} bg="#D1FAE5" />
                  <div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>Bénéficiaire actuel</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#065F46" }}>{beneficiary?.name}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <ProgressBar value={paid} max={tc.length} />
                  <span style={{ fontSize: 12, color: "#6B7280", whiteSpace: "nowrap", fontWeight: 600 }}>{paid}/{tc.length}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "24px 16px 100px" }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 17, fontWeight: 700, color: "#111827" }}>Activité récente</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {notifications.slice(0, 4).map((notif) => (
            <div key={notif.id} style={{ display: "flex", gap: 12, padding: "12px 14px", background: notif.read ? "#fff" : "#F0FDF4", borderRadius: 12, border: "1px solid #F1F1F4" }}>
              <div style={{ fontSize: 20, marginTop: 2 }}>{notif.type === "payment" ? "✅" : notif.type === "late" ? "⚠️" : notif.type === "cycle" ? "🎉" : "🔔"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.4 }}>{notif.message}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{notif.date}</div>
              </div>
              {!notif.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2D9D6F", marginTop: 6, flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// === TONTINE LIST ===
const TontineList = ({ tontines, members, contributions, onNavigate, onCreateTontine }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [newTontine, setNewTontine] = useState({ name: "", amount: "", frequency: "monthly", description: "" });

  const handleCreate = () => {
    if (!newTontine.name || !newTontine.amount) return;
    onCreateTontine({
      id: generateId(), name: newTontine.name, description: newTontine.description,
      amount: parseInt(newTontine.amount), currency: "FCFA", frequency: newTontine.frequency,
      startDate: new Date().toISOString().split("T")[0], members: ["m1"],
      currentCycle: 1, totalCycles: 1, currentBeneficiary: "m1", status: "active", createdBy: "m1", rules: "",
    });
    setShowCreate(false);
    setNewTontine({ name: "", amount: "", frequency: "monthly", description: "" });
  };

  return (
    <div style={{ padding: "0 16px 100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0" }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Mes Tontines</h2>
        <Button onClick={() => setShowCreate(true)} size="sm"><Icons.Plus /> Créer</Button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {tontines.map((tontine) => {
          const memberObjs = tontine.members.map((id) => members.find((m) => m.id === id)).filter(Boolean);
          const tc = contributions.filter((c) => c.tontineId === tontine.id && c.cycle === tontine.currentCycle);
          const paid = tc.filter((c) => c.status === "paid").length;
          return (
            <Card key={tontine.id} onClick={() => onNavigate("tontine-detail", tontine.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{tontine.name}</div>
                  <div style={{ fontSize: 13, color: "#6B7280" }}>{tontine.description}</div>
                </div>
                <Badge bg="#D1FAE5" color="#065F46">Actif</Badge>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                <div style={{ padding: "10px 12px", background: "#F9FAFB", borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Cotisation</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{formatMoney(tontine.amount)}</div>
                </div>
                <div style={{ padding: "10px 12px", background: "#F9FAFB", borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Fréquence</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{tontine.frequency === "monthly" ? "Mensuelle" : "Hebdo"}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex" }}>
                  {memberObjs.slice(0, 5).map((m, i) => <div key={m.id} style={{ marginLeft: i > 0 ? -8 : 0, zIndex: 5 - i }}><Avatar emoji={m.avatar} size={30} bg="#E5E7EB" /></div>)}
                  {memberObjs.length > 5 && <div style={{ marginLeft: -8, width: 30, height: 30, borderRadius: "50%", background: "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#6B7280" }}>+{memberObjs.length - 5}</div>}
                </div>
                <div style={{ fontSize: 13, color: "#6B7280" }}><span style={{ fontWeight: 700, color: "#2D9D6F" }}>{paid}</span>/{tc.length} payés</div>
              </div>
            </Card>
          );
        })}
      </div>
      {tontines.length === 0 && <EmptyState icon="🤝" title="Aucune tontine" subtitle="Créez votre première tontine !" />}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Nouvelle Tontine">
        <Input label="Nom de la tontine" value={newTontine.name} onChange={(v) => setNewTontine({ ...newTontine, name: v })} placeholder="Ex: Tontine Famille" />
        <Input label="Description" value={newTontine.description} onChange={(v) => setNewTontine({ ...newTontine, description: v })} placeholder="Ex: Tontine mensuelle" />
        <Input label="Montant (FCFA)" value={newTontine.amount} onChange={(v) => setNewTontine({ ...newTontine, amount: v })} placeholder="25000" type="number" />
        <Select label="Fréquence" value={newTontine.frequency} onChange={(v) => setNewTontine({ ...newTontine, frequency: v })}
          options={[{ value: "weekly", label: "Hebdomadaire" }, { value: "biweekly", label: "Bimensuelle" }, { value: "monthly", label: "Mensuelle" }]} />
        <Button onClick={handleCreate} style={{ width: "100%", marginTop: 8 }} size="lg">Créer la tontine</Button>
      </Modal>
    </div>
  );
};

// === TONTINE DETAIL ===
const TontineDetail = ({ tontineId, tontines, members, contributions, onNavigate, onRecordPayment }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showPayment, setShowPayment] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("wave");

  const tontine = tontines.find((t) => t.id === tontineId);
  if (!tontine) return <EmptyState icon="❌" title="Tontine non trouvée" />;

  const memberObjs = tontine.members.map((id) => members.find((m) => m.id === id)).filter(Boolean);
  const currentContribs = contributions.filter((c) => c.tontineId === tontineId && c.cycle === tontine.currentCycle);
  const allContribs = contributions.filter((c) => c.tontineId === tontineId);
  const beneficiary = members.find((m) => m.id === tontine.currentBeneficiary);
  const totalPool = tontine.amount * tontine.members.length;
  const paidThisCycle = currentContribs.filter((c) => c.status === "paid").length;

  const handlePayment = () => {
    if (selectedMember) {
      onRecordPayment(tontineId, selectedMember, paymentMethod);
      setShowPayment(false);
      setSelectedMember(null);
    }
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ background: "linear-gradient(135deg, #0F4C35 0%, #1B6B4A 50%, #2D9D6F 100%)", padding: "20px 16px 24px", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => onNavigate("tontines")} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}><Icons.ArrowLeft /></button>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, flex: 1 }}>{tontine.name}</h2>
        </div>
        <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 16, padding: 16 }}>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>🎯 Bénéficiaire du tour {tontine.currentCycle}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar emoji={beneficiary?.avatar} size={48} bg="rgba(255,255,255,0.2)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 700 }}>{beneficiary?.name}</div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>Recevra {formatMoney(totalPool)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{paidThisCycle}/{tontine.members.length}</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>payés</div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}><ProgressBar value={paidThisCycle} max={tontine.members.length} color="#fff" height={6} /></div>
        </div>
      </div>

      <div style={{ display: "flex", padding: "0 16px", borderBottom: "1px solid #F1F1F4", background: "#fff", position: "sticky", top: 0, zIndex: 10 }}>
        {["overview", "members", "history", "rules"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: "14px 8px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit",
            color: activeTab === tab ? "#1B6B4A" : "#9CA3AF", borderBottom: activeTab === tab ? "2.5px solid #1B6B4A" : "2.5px solid transparent",
          }}>{tab === "overview" ? "Aperçu" : tab === "members" ? "Membres" : tab === "history" ? "Historique" : "Règles"}</button>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[{ label: "Cotisation", value: formatMoney(tontine.amount), icon: "💵" }, { label: "Cagnotte", value: formatMoney(totalPool), icon: "🏦" }, { label: "Tour", value: `${tontine.currentCycle}/${tontine.totalCycles}`, icon: "🔄" }, { label: "Membres", value: tontine.members.length, icon: "👥" }].map((s, i) => (
                <Card key={i} style={{ padding: 14 }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>{s.value}</div>
                </Card>
              ))}
            </div>
            <h4 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700 }}>Cotisations du tour {tontine.currentCycle}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {currentContribs.map((contrib) => {
                const member = members.find((m) => m.id === contrib.memberId);
                const status = getStatusBadge(contrib.status);
                const method = PAYMENT_METHODS.find((p) => p.id === contrib.paymentMethod);
                return (
                  <div key={contrib.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#fff", borderRadius: 12, border: "1px solid #F1F1F4" }}>
                    <Avatar emoji={member?.avatar} size={38} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{member?.name}</div>
                      {contrib.status === "paid" && method && <div style={{ fontSize: 12, color: "#6B7280" }}>via {method.icon} {method.name}</div>}
                    </div>
                    <Badge bg={status.bg} color={status.color}>{status.icon} {status.label}</Badge>
                  </div>
                );
              })}
            </div>
            <Button onClick={() => setShowPayment(true)} style={{ width: "100%", marginTop: 20 }} size="lg" variant="accent"><Icons.Wallet /> Enregistrer un paiement</Button>
          </div>
        )}

        {activeTab === "members" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {memberObjs.map((member, index) => {
              const mc = allContribs.filter((c) => c.memberId === member.id);
              return (
                <Card key={member.id} onClick={() => onNavigate("member-detail", member.id)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ position: "relative" }}>
                      <Avatar emoji={member.avatar} size={48} />
                      <div style={{ position: "absolute", bottom: -2, right: -2, background: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: getScoreColor(member.score), border: `2px solid ${getScoreColor(member.score)}` }}>{member.score}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{member.name}</div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>{member.phone}</div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Paiements : {mc.filter((c) => c.status === "paid").length}/{mc.length} · Tour #{index + 1}</div>
                    </div>
                    {member.id === tontine.currentBeneficiary && <Badge bg="#FEF3C7" color="#92400E">🎯 Bénéf.</Badge>}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {activeTab === "history" && (
          <div>
            {Array.from({ length: tontine.currentCycle }, (_, i) => tontine.currentCycle - i).map((cycle) => {
              const cc = allContribs.filter((c) => c.cycle === cycle);
              const cp = cc.filter((c) => c.status === "paid").length;
              const cb = members.find((m) => m.id === tontine.members[cycle - 1]);
              return (
                <div key={cycle} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Badge bg={cycle === tontine.currentCycle ? "#D1FAE5" : "#F3F4F6"} color={cycle === tontine.currentCycle ? "#065F46" : "#6B7280"}>Tour {cycle}</Badge>
                      {cb && <span style={{ fontSize: 12, color: "#6B7280" }}>→ {cb.avatar} {cb.name}</span>}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#2D9D6F" }}>{cp}/{cc.length}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {cc.map((contrib) => {
                      const member = members.find((m) => m.id === contrib.memberId);
                      const status = getStatusBadge(contrib.status);
                      return (
                        <div key={contrib.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#F9FAFB", borderRadius: 10 }}>
                          <Avatar emoji={member?.avatar} size={28} />
                          <span style={{ flex: 1, fontSize: 13, color: "#374151" }}>{member?.name}</span>
                          <span style={{ fontSize: 12, color: status.color, fontWeight: 600 }}>{status.icon} {status.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "rules" && (
          <div>
            <Card style={{ marginBottom: 16 }}>
              <h4 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700 }}>📋 Règlement</h4>
              <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{tontine.rules || "Aucun règlement défini."}</p>
            </Card>
            <Card>
              <h4 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700 }}>📅 Calendrier des tours</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {tontine.members.map((memberId, index) => {
                  const member = members.find((m) => m.id === memberId);
                  const isCurrent = index + 1 === tontine.currentCycle;
                  const isPast = index + 1 < tontine.currentCycle;
                  return (
                    <div key={memberId} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: isCurrent ? "#F0FDF4" : "#F9FAFB", borderRadius: 10, border: isCurrent ? "1.5px solid #2D9D6F" : "1px solid transparent", opacity: isPast ? 0.5 : 1 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: isCurrent ? "#2D9D6F" : isPast ? "#D1FAE5" : "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: isCurrent ? "#fff" : "#6B7280" }}>{isPast ? "✓" : index + 1}</div>
                      <Avatar emoji={member?.avatar} size={30} />
                      <span style={{ flex: 1, fontSize: 13, fontWeight: isCurrent ? 700 : 400, color: isCurrent ? "#065F46" : "#374151" }}>{member?.name}</span>
                      {isCurrent && <Badge bg="#D1FAE5" color="#065F46">En cours</Badge>}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
      </div>

      <Modal isOpen={showPayment} onClose={() => setShowPayment(false)} title="Enregistrer un paiement">
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Membre</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {currentContribs.filter((c) => c.status !== "paid").map((contrib) => {
              const member = members.find((m) => m.id === contrib.memberId);
              const isSelected = selectedMember === contrib.memberId;
              return (
                <div key={contrib.memberId} onClick={() => setSelectedMember(contrib.memberId)} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, cursor: "pointer",
                  background: isSelected ? "#F0FDF4" : "#F9FAFB", border: isSelected ? "2px solid #2D9D6F" : "2px solid transparent",
                }}>
                  <Avatar emoji={member?.avatar} size={36} />
                  <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{member?.name}</div><div style={{ fontSize: 12, color: "#6B7280" }}>{formatMoney(tontine.amount)}</div></div>
                  {isSelected && <div style={{ color: "#2D9D6F" }}><Icons.Check /></div>}
                </div>
              );
            })}
            {currentContribs.filter((c) => c.status !== "paid").length === 0 && <div style={{ textAlign: "center", padding: 20, color: "#9CA3AF", fontSize: 14 }}>✅ Tous les membres ont payé !</div>}
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Mode de paiement</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {PAYMENT_METHODS.map((method) => (
              <div key={method.id} onClick={() => setPaymentMethod(method.id)} style={{
                display: "flex", alignItems: "center", gap: 8, padding: 12, borderRadius: 12, cursor: "pointer",
                background: paymentMethod === method.id ? `${method.color}15` : "#F9FAFB",
                border: paymentMethod === method.id ? `2px solid ${method.color}` : "2px solid transparent",
              }}>
                <span style={{ fontSize: 20 }}>{method.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: paymentMethod === method.id ? method.color : "#374151" }}>{method.name}</span>
              </div>
            ))}
          </div>
        </div>
        <Button onClick={handlePayment} style={{ width: "100%" }} size="lg" disabled={!selectedMember}>Confirmer le paiement</Button>
      </Modal>
    </div>
  );
};

// === MEMBER LIST ===
const MemberList = ({ members, contributions, onNavigate }) => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const filtered = members
    .filter((m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.phone.includes(search))
    .sort((a, b) => sortBy === "score" ? b.score - a.score : a.name.localeCompare(b.name));

  return (
    <div style={{ padding: "0 16px 100px" }}>
      <div style={{ padding: "20px 0" }}>
        <h2 style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 800 }}>Membres</h2>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}><Icons.Search /></div>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..."
              style={{ width: "100%", padding: "11px 14px 11px 38px", borderRadius: 12, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: "11px 14px", borderRadius: 12, border: "1.5px solid #E5E7EB", fontSize: 13, fontFamily: "inherit", background: "#fff" }}>
            <option value="name">Nom</option>
            <option value="score">Score</option>
          </select>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((member) => {
          const mc = contributions.filter((c) => c.memberId === member.id);
          const paidCount = mc.filter((c) => c.status === "paid").length;
          const lateCount = mc.filter((c) => c.status === "late").length;
          return (
            <Card key={member.id} onClick={() => onNavigate("member-detail", member.id)}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <ScoreRing score={member.score} size={56} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 2 }}>{member.name}</div>
                  <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>{member.phone}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Badge bg="#D1FAE5" color="#065F46" style={{ fontSize: 11 }}>✓ {paidCount}</Badge>
                    {lateCount > 0 && <Badge bg="#FEE2E2" color="#991B1B" style={{ fontSize: 11 }}>⚠ {lateCount}</Badge>}
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: getScoreColor(member.score) }}>{getScoreLabel(member.score)}</div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// === MEMBER DETAIL ===
const MemberDetail = ({ memberId, members, tontines, contributions, onNavigate }) => {
  const member = members.find((m) => m.id === memberId);
  if (!member) return <EmptyState icon="❌" title="Membre non trouvé" />;

  const mc = contributions.filter((c) => c.memberId === memberId);
  const paidCount = mc.filter((c) => c.status === "paid").length;
  const lateCount = mc.filter((c) => c.status === "late").length;
  const pendingCount = mc.filter((c) => c.status === "pending").length;
  const totalPaid = mc.filter((c) => c.status === "paid").reduce((sum, c) => sum + c.amount, 0);
  const memberTontines = tontines.filter((t) => t.members.includes(memberId));
  const reliabilityRate = mc.length > 0 ? Math.round((paidCount / mc.length) * 100) : 0;

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ background: "linear-gradient(135deg, #0F4C35 0%, #1B6B4A 50%, #2D9D6F 100%)", padding: "20px 16px 32px", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={() => onNavigate("members")} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}><Icons.ArrowLeft /></button>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Profil Membre</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar emoji={member.avatar} size={72} bg="rgba(255,255,255,0.15)" />
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{member.name}</div>
            <div style={{ fontSize: 14, opacity: 0.8 }}>{member.phone}</div>
            <div style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>Depuis {member.joinDate}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px", marginTop: -20 }}>
        <Card style={{ marginBottom: 20, padding: 24, textAlign: "center" }}>
          <ScoreRing score={member.score} size={96} />
          <div style={{ fontSize: 18, fontWeight: 700, color: getScoreColor(member.score), marginTop: 12 }}>Score : {getScoreLabel(member.score)}</div>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Basé sur la ponctualité des paiements</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 20 }}>
            <div style={{ padding: 12, background: "#F0FDF4", borderRadius: 12 }}><div style={{ fontSize: 22, fontWeight: 800, color: "#059669" }}>{paidCount}</div><div style={{ fontSize: 11, color: "#6B7280" }}>Payés</div></div>
            <div style={{ padding: 12, background: "#FEF3C7", borderRadius: 12 }}><div style={{ fontSize: 22, fontWeight: 800, color: "#D97706" }}>{pendingCount}</div><div style={{ fontSize: 11, color: "#6B7280" }}>En attente</div></div>
            <div style={{ padding: 12, background: "#FEE2E2", borderRadius: 12 }}><div style={{ fontSize: 22, fontWeight: 800, color: "#DC2626" }}>{lateCount}</div><div style={{ fontSize: 11, color: "#6B7280" }}>Retards</div></div>
          </div>
        </Card>

        <Card style={{ marginBottom: 20 }}>
          <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>📊 Statistiques</h4>
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "#6B7280" }}>Fiabilité</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: getScoreColor(reliabilityRate) }}>{reliabilityRate}%</span>
            </div>
            <ProgressBar value={reliabilityRate} max={100} color={getScoreColor(reliabilityRate)} />
          </div>
          {[{ l: "Total cotisé", v: formatMoney(totalPaid) }, { l: "Tontines actives", v: memberTontines.length }, { l: "Paiements", v: mc.length }].map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
              <span style={{ fontSize: 13, color: "#6B7280" }}>{item.l}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{item.v}</span>
            </div>
          ))}
        </Card>

        <Card>
          <h4 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700 }}>🤝 Tontines</h4>
          {memberTontines.map((t) => (
            <div key={t.id} onClick={() => onNavigate("tontine-detail", t.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "#F9FAFB", borderRadius: 12, cursor: "pointer", marginBottom: 8 }}>
              <div style={{ fontSize: 24 }}>🤝</div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div><div style={{ fontSize: 12, color: "#6B7280" }}>{formatMoney(t.amount)}</div></div>
              <span style={{ fontSize: 18, color: "#9CA3AF" }}>›</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

// === NOTIFICATIONS ===
const NotificationsPage = ({ notifications, onMarkRead }) => {
  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);
  return (
    <div style={{ padding: "0 16px 100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0" }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Notifications</h2>
        {unread.length > 0 && <Button variant="ghost" size="sm" onClick={() => notifications.forEach((n) => onMarkRead(n.id))} style={{ color: "#2D9D6F" }}>Tout marquer lu</Button>}
      </div>
      {unread.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", marginBottom: 10 }}>Non lues ({unread.length})</div>
          {unread.map((n) => (
            <Card key={n.id} onClick={() => onMarkRead(n.id)} style={{ cursor: "pointer", background: "#F0FDF4", borderLeft: "3px solid #2D9D6F", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ fontSize: 22 }}>{n.type === "payment" ? "✅" : n.type === "late" ? "⚠️" : n.type === "cycle" ? "🎉" : "🔔"}</div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 14, color: "#111827", lineHeight: 1.4 }}>{n.message}</div><div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 6 }}>{n.date}</div></div>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#2D9D6F", marginTop: 6 }} />
              </div>
            </Card>
          ))}
        </div>
      )}
      {read.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", marginBottom: 10 }}>Lues</div>
          {read.map((n) => (
            <Card key={n.id} style={{ opacity: 0.7, marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ fontSize: 22 }}>{n.type === "payment" ? "✅" : n.type === "late" ? "⚠️" : n.type === "cycle" ? "🎉" : "🔔"}</div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 14, color: "#374151", lineHeight: 1.4 }}>{n.message}</div><div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 6 }}>{n.date}</div></div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {notifications.length === 0 && <EmptyState icon="🔔" title="Aucune notification" subtitle="Vous êtes à jour !" />}
    </div>
  );
};

// === STATISTICS ===
const Statistics = ({ tontines, members, contributions }) => {
  const totalCollected = contributions.filter((c) => c.status === "paid").reduce((sum, c) => sum + c.amount, 0);
  const totalPending = contributions.filter((c) => c.status === "pending").reduce((sum, c) => sum + c.amount, 0);
  const totalLate = contributions.filter((c) => c.status === "late").reduce((sum, c) => sum + c.amount, 0);
  const totalExpected = contributions.reduce((sum, c) => sum + c.amount, 0);
  const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

  const paymentMethodStats = PAYMENT_METHODS.map((method) => ({
    ...method, count: contributions.filter((c) => c.paymentMethod === method.id && c.status === "paid").length,
  })).sort((a, b) => b.count - a.count);

  const topMembers = [...members].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div style={{ padding: "0 16px 100px" }}>
      <div style={{ padding: "20px 0" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>Statistiques</h2>
        <p style={{ margin: 0, fontSize: 14, color: "#6B7280" }}>Vue d'ensemble</p>
      </div>

      <Card style={{ marginBottom: 16, padding: 24, textAlign: "center" }}>
        <ScoreRing score={collectionRate} size={100} />
        <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginTop: 12 }}>Taux de collecte</div>
        <div style={{ fontSize: 13, color: "#6B7280" }}>{formatMoney(totalCollected)} / {formatMoney(totalExpected)}</div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>💰 Résumé financier</h4>
        {[{ label: "Collecté", value: formatMoney(totalCollected), color: "#059669", bg: "#D1FAE5", amount: totalCollected },
          { label: "En attente", value: formatMoney(totalPending), color: "#D97706", bg: "#FEF3C7", amount: totalPending },
          { label: "En retard", value: formatMoney(totalLate), color: "#DC2626", bg: "#FEE2E2", amount: totalLate }].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: item.bg, borderRadius: 12, marginBottom: 8 }}>
            <div style={{ flex: 1 }}><div style={{ fontSize: 13, color: "#6B7280" }}>{item.label}</div><div style={{ fontSize: 18, fontWeight: 800, color: item.color }}>{item.value}</div></div>
            <div style={{ width: 60 }}><ProgressBar value={item.amount} max={totalExpected} color={item.color} /></div>
          </div>
        ))}
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>📱 Modes de paiement</h4>
        {paymentMethodStats.map((method) => {
          const maxCount = Math.max(...paymentMethodStats.map((m) => m.count));
          return (
            <div key={method.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ width: 36, textAlign: "center", fontSize: 20 }}>{method.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 13, fontWeight: 600 }}>{method.name}</span><span style={{ fontSize: 13, fontWeight: 700, color: method.color }}>{method.count}</span></div>
                <ProgressBar value={method.count} max={maxCount} color={method.color} height={6} />
              </div>
            </div>
          );
        })}
      </Card>

      <Card>
        <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>⭐ Top Membres</h4>
        {topMembers.map((member, i) => (
          <div key={member.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, background: i === 0 ? "#FEF3C7" : "#F9FAFB" }}>
              {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
            </div>
            <Avatar emoji={member.avatar} size={36} />
            <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{member.name}</div>
            <ScoreRing score={member.score} size={42} />
          </div>
        ))}
      </Card>
    </div>
  );
};

// === MAIN APP ===
export default function TontinePay() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedId, setSelectedId] = useState(null);
  const [tontines, setTontines] = useState(SAMPLE_TONTINES);
  const [members] = useState(SAMPLE_MEMBERS);
  const [contributions, setContributions] = useState(() => generateContributions());
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);

  const navigate = useCallback((page, id = null) => { setCurrentPage(page); setSelectedId(id); }, []);
  const handleCreateTontine = (t) => setTontines((prev) => [...prev, t]);
  const handleRecordPayment = (tontineId, memberId, paymentMethod) => {
    setContributions((prev) => prev.map((c) => c.tontineId === tontineId && c.memberId === memberId && c.status !== "paid" ? { ...c, status: "paid", paymentMethod, paidDate: new Date().toISOString().split("T")[0] } : c));
    const member = members.find((m) => m.id === memberId);
    const tontine = tontines.find((t) => t.id === tontineId);
    setNotifications((prev) => [{ id: generateId(), type: "payment", read: false, date: new Date().toISOString().split("T")[0], message: `${member?.name} a payé - ${formatMoney(tontine?.amount || 0)}`, tontineId }, ...prev]);
  };
  const handleMarkRead = (id) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    { id: "dashboard", icon: Icons.Home, label: "Accueil" },
    { id: "tontines", icon: Icons.Group, label: "Tontines" },
    { id: "members", icon: Icons.Users, label: "Membres" },
    { id: "statistics", icon: Icons.Chart, label: "Stats" },
    { id: "notifications", icon: Icons.Bell, label: "Alertes" },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard": return <Dashboard tontines={tontines} members={members} contributions={contributions} notifications={notifications} onNavigate={navigate} />;
      case "tontines": return <TontineList tontines={tontines} members={members} contributions={contributions} onNavigate={navigate} onCreateTontine={handleCreateTontine} />;
      case "tontine-detail": return <TontineDetail tontineId={selectedId} tontines={tontines} members={members} contributions={contributions} onNavigate={navigate} onRecordPayment={handleRecordPayment} />;
      case "members": return <MemberList members={members} contributions={contributions} onNavigate={navigate} />;
      case "member-detail": return <MemberDetail memberId={selectedId} members={members} tontines={tontines} contributions={contributions} onNavigate={navigate} />;
      case "notifications": return <NotificationsPage notifications={notifications} onMarkRead={handleMarkRead} />;
      case "statistics": return <Statistics tontines={tontines} members={members} contributions={contributions} />;
      default: return <Dashboard tontines={tontines} members={members} contributions={contributions} notifications={notifications} onNavigate={navigate} />;
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", background: "#FAFBFC", minHeight: "100vh", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #E5E7EB; margin: 0; }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        ::-webkit-scrollbar { display: none; }
      `}</style>
      <div style={{ paddingBottom: 80 }}>{renderPage()}</div>
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#fff", borderTop: "1px solid #F1F1F4", display: "flex", justifyContent: "space-around", padding: "8px 0 12px", zIndex: 100, boxShadow: "0 -4px 12px rgba(0,0,0,0.04)" }}>
        {navItems.map((item) => {
          const isActive = currentPage === item.id || (item.id === "tontines" && currentPage === "tontine-detail") || (item.id === "members" && currentPage === "member-detail");
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => navigate(item.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", padding: "6px 12px", color: isActive ? "#1B6B4A" : "#9CA3AF", position: "relative", fontFamily: "inherit" }}>
              <div style={{ position: "relative" }}>
                <Icon />
                {item.id === "notifications" && unreadCount > 0 && <div style={{ position: "absolute", top: -4, right: -6, background: "#EF4444", color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadCount}</div>}
              </div>
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500 }}>{item.label}</span>
              {isActive && <div style={{ position: "absolute", top: -1, width: 20, height: 3, borderRadius: 3, background: "#1B6B4A" }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
