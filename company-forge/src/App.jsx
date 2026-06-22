import React, { useState } from "react";

/* ─── Data ─── */
const INDUSTRIES = [
  { id: "technology",    label: "Technology",    icon: "💻" },
  { id: "finance",       label: "Finance",       icon: "💰" },
  { id: "healthcare",    label: "Healthcare",    icon: "🏥" },
  { id: "manufacturing", label: "Manufacturing", icon: "⚙️" },
  { id: "agriculture",   label: "Agriculture",   icon: "🌾" },
  { id: "logistics",     label: "Logistics",     icon: "🚚" },
  { id: "retail",        label: "Retail",        icon: "🛍️" },
  { id: "energy",        label: "Energy",        icon: "⚡" },
  { id: "education",     label: "Education",     icon: "🎓" },
  { id: "media",         label: "Media",         icon: "🎬" },
];

const REVENUE_TIERS = [
  { id: "pre-revenue", label: "Pre-revenue",   sub: "Not yet generating",  icon: "⏳" },
  { id: "startup",     label: "Early stage",   sub: "Under $500K",         icon: "🌱" },
  { id: "growing",     label: "Growth",        sub: "$500K – $10M",        icon: "📈" },
  { id: "established", label: "Established",   sub: "$10M – $50M",         icon: "🏢" },
  { id: "leader",      label: "Market leader", sub: "$50M – $1B",          icon: "🚀" },
  { id: "enterprise",  label: "Enterprise",    sub: "Over $1B",            icon: "🏆" },
];

const INCOME_TIERS = [
  { id: "loss",      label: "Operating at a loss",  color: "#f85149" },
  { id: "breakeven", label: "Near break-even",      color: "#d29922" },
  { id: "profit",    label: "Profitable",           color: "#3fb950" },
  { id: "high",      label: "Highly profitable",    color: "#0ea5e9" },
];

const CYCLES = [
  { id: "idea",      label: "Idea",      desc: "Concept stage, not yet operating" },
  { id: "launch",    label: "Launch",    desc: "Early operations, finding product-market fit" },
  { id: "growth",    label: "Growth",    desc: "Scaling operations and customer base" },
  { id: "scale",     label: "Scale",     desc: "Rapid expansion, entering new markets" },
  { id: "mature",    label: "Mature",    desc: "Stable, optimising for efficiency" },
  { id: "transform", label: "Transform", desc: "Pivoting or reinventing the business" },
];

const TABS = [
  { id: "identity",   label: "Identity",   steps: [1, 2] },
  { id: "operations", label: "Operations", steps: [3, 4] },
  { id: "financial",  label: "Financial",  steps: [5, 6] },
  { id: "vision",     label: "Vision",     steps: [7, 8, 9] },
];

const RANDOM_PROFILES = [
  { companyName: "Al-Kharj Green", industry: "agriculture", city: "Al Kharj", country: "Saudi Arabia", headcount: 48, revenue: "growing", netIncome: "profit", businessCycle: "growth", vision: "Greening Saudi cities with sustainable agriculture.", mission: "Deliver high quality plants and green solutions for homes and businesses." },
  { companyName: "Nexus Dynamics", industry: "technology",  city: "Dubai",    country: "UAE",          headcount: 220, revenue: "leader",      netIncome: "high",      businessCycle: "scale",    vision: "Become the leading tech powerhouse in the Middle East.",      mission: "Build transformative digital products that empower people and organisations." },
  { companyName: "Summit Logistics", industry: "logistics", city: "Jeddah",   country: "Saudi Arabia", headcount: 310, revenue: "established", netIncome: "profit",    businessCycle: "mature",   vision: "Seamless movement of goods across the Arabian Peninsula.",   mission: "Deliver reliably, efficiently, and sustainably every time." },
  { companyName: "Horizon Capital",  industry: "finance",   city: "Abu Dhabi", country: "UAE",         headcount: 85, revenue: "leader",      netIncome: "high",      businessCycle: "scale",    vision: "Empower financial freedom for the next generation.",          mission: "Provide accessible and innovative financial products for everyone." },
  { companyName: "Medcore Arabia",   industry: "healthcare", city: "Riyadh",   country: "Saudi Arabia", headcount: 160, revenue: "established", netIncome: "profit",   businessCycle: "growth",   vision: "Accessible world-class healthcare across the region.",        mission: "Improve patient outcomes through technology and compassionate care." },
];

function stepDone(key, val) {
  if (key === "companyName")   return typeof val === "string" && val.trim().length > 0;
  if (key === "locations")     return Array.isArray(val) && val.some(l => l.city.trim());
  if (key === "headcount")     return val > 0;
  return Boolean(val);
}

function countDone(profile) {
  const keys = ["companyName","industry","locations","headcount","revenue","netIncome","businessCycle","vision","mission"];
  return keys.filter(k => stepDone(k, profile[k])).length;
}

/* ─── Styles ─── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:          #0d1117;
  --surface:     #161b22;
  --surface2:    #1c2333;
  --surface3:    #21262d;
  --border:      rgba(240,246,252,.07);
  --border-md:   rgba(240,246,252,.12);
  --accent:      #0ea5e9;
  --accent-dim:  rgba(14,165,233,.1);
  --text:        #e6edf3;
  --text-muted:  #8b949e;
  --text-dim:    #6e7681;
  --success:     #3fb950;
  --warning:     #d29922;
  --danger:      #f85149;
  --font:        'Inter', system-ui, -apple-system, sans-serif;
  --r:           8px;
  --r-lg:        12px;
  --dur:         180ms;
  --ease:        cubic-bezier(.2,0,.38,.9);
}

html, body { height: 100%; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

/* ── App shell ── */
.app {
  display: grid;
  grid-template-columns: 220px 1fr 280px;
  min-height: 100vh;
}

/* ── Sidebar ── */
.sidebar {
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-logo {
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo-mark {
  width: 32px;
  height: 32px;
  background: var(--accent);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.logo-text { font-size: 13px; font-weight: 600; color: var(--text); letter-spacing: -.01em; }
.logo-sub  { font-size: 11px; color: var(--text-dim); margin-top: 1px; }

.sidebar-nav {
  padding: 16px 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-section-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--text-dim);
  padding: 8px 8px 6px;
  margin-top: 8px;
}
.nav-section-label:first-child { margin-top: 0; }

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 10px;
  border-radius: var(--r);
  cursor: pointer;
  transition: background var(--dur) var(--ease), color var(--dur) var(--ease);
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
}
.nav-item:hover { background: var(--surface3); color: var(--text); }
.nav-item.active { background: var(--accent-dim); color: var(--accent); }

.nav-step-num {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1.5px solid currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
  opacity: .6;
}
.nav-item.done .nav-step-num {
  background: var(--success);
  border-color: var(--success);
  color: #fff;
  opacity: 1;
}
.nav-item.done { color: var(--text-muted); }

.sidebar-footer {
  padding: 16px 12px;
  border-top: 1px solid var(--border);
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 8px;
}
.progress-track {
  height: 4px;
  background: var(--surface3);
  border-radius: 2px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width .4s var(--ease);
}

/* ── Main ── */
.main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-y: auto;
}

.topbar {
  padding: 20px 28px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 50;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0;
}

.topbar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -.02em;
}

.topbar-actions { display: flex; gap: 8px; }

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: var(--r);
  font-family: var(--font);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--dur) var(--ease);
  border: none;
}
.btn-ghost {
  background: transparent;
  border: 1px solid var(--border-md);
  color: var(--text-muted);
}
.btn-ghost:hover { background: var(--surface3); color: var(--text); border-color: var(--border-md); }
.btn-primary {
  background: var(--accent);
  color: #fff;
}
.btn-primary:hover { background: #0284c7; }
.btn-primary:active { transform: scale(.98); }

/* Tabs */
.tab-bar {
  display: flex;
  gap: 0;
  margin-top: 4px;
}
.tab {
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  border: none;
  background: transparent;
  border-bottom: 2px solid transparent;
  transition: all var(--dur) var(--ease);
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  bottom: -1px;
}
.tab:hover { color: var(--text); }
.tab.active { color: var(--accent); border-bottom-color: var(--accent); }

.tab-badge {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--success);
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Form area ── */
.form-area {
  padding: 24px 28px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
}

/* ── Section card ── */
.section-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
}

.section-head {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 12px;
}
.section-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--surface2);
  border: 1.5px solid var(--border-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-dim);
  flex-shrink: 0;
}
.section-card.done .section-num {
  background: rgba(63,185,80,.15);
  border-color: rgba(63,185,80,.4);
  color: var(--success);
}
.section-title { font-size: 14px; font-weight: 600; color: var(--text); }
.section-desc  { font-size: 12px; color: var(--text-dim); margin-left: auto; }

.section-body { padding: 20px; }

/* ── Form elements ── */
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.form-group:last-child { margin-bottom: 0; }

.form-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: .01em;
}

.form-input {
  width: 100%;
  background: var(--surface2);
  border: 1px solid var(--border-md);
  border-radius: var(--r);
  padding: 9px 12px;
  color: var(--text);
  font-family: var(--font);
  font-size: 14px;
  transition: border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}
.form-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-dim);
}
.form-input::placeholder { color: var(--text-dim); }

.form-input-lg {
  font-size: 22px;
  font-weight: 600;
  padding: 12px 14px;
  letter-spacing: -.01em;
}

.form-textarea {
  width: 100%;
  background: var(--surface2);
  border: 1px solid var(--border-md);
  border-radius: var(--r);
  padding: 10px 12px;
  color: var(--text);
  font-family: var(--font);
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  min-height: 90px;
  transition: border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}
.form-textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-dim);
}
.form-textarea::placeholder { color: var(--text-dim); }

/* Industry grid */
.industry-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.industry-opt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 8px 12px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: var(--r);
  cursor: pointer;
  transition: all var(--dur) var(--ease);
  text-align: center;
}
.industry-opt:hover { border-color: var(--border-md); background: var(--surface3); }
.industry-opt.selected {
  border-color: var(--accent);
  background: var(--accent-dim);
}
.ind-emoji { font-size: 20px; line-height: 1; }
.ind-name  { font-size: 11px; font-weight: 500; color: var(--text-muted); white-space: nowrap; }
.industry-opt.selected .ind-name { color: var(--accent); }

/* Location rows */
.loc-rows { display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px; }
.loc-row  {
  display: grid;
  grid-template-columns: 1fr 1fr 32px;
  gap: 8px;
  align-items: center;
}
.loc-remove {
  width: 32px; height: 32px;
  border-radius: var(--r);
  border: 1px solid var(--border-md);
  background: transparent;
  color: var(--text-dim);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all var(--dur) var(--ease);
}
.loc-remove:hover { border-color: var(--danger); color: var(--danger); background: rgba(248,81,73,.08); }
.loc-remove:disabled { opacity: .3; cursor: default; pointer-events: none; }

.btn-add-row {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--accent);
  background: transparent;
  border: 1px dashed rgba(14,165,233,.3);
  border-radius: var(--r);
  padding: 7px 12px;
  cursor: pointer;
  transition: all var(--dur) var(--ease);
  font-family: var(--font);
}
.btn-add-row:hover { background: var(--accent-dim); border-style: solid; }

/* Headcount */
.headcount-row {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 20px;
  align-items: center;
}
.headcount-big {
  font-size: 40px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -.03em;
  line-height: 1;
}
.headcount-lbl { font-size: 12px; color: var(--text-dim); margin-top: 4px; }

.slider-group { display: flex; flex-direction: column; gap: 6px; }
.slider-input {
  width: 100%;
  appearance: none;
  background: transparent;
  cursor: pointer;
}
.slider-input::-webkit-slider-runnable-track {
  height: 4px;
  background: var(--surface3);
  border-radius: 2px;
}
.slider-input::-webkit-slider-thumb {
  appearance: none;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: var(--accent);
  border: 2px solid var(--surface);
  box-shadow: 0 0 0 2px var(--accent);
  margin-top: -6px;
  cursor: grab;
  transition: box-shadow var(--dur) var(--ease);
}
.slider-input::-webkit-slider-thumb:active { cursor: grabbing; }
.slider-input::-moz-range-track { height: 4px; background: var(--surface3); border-radius: 2px; }
.slider-input::-moz-range-thumb {
  width: 14px; height: 14px;
  border-radius: 50%;
  background: var(--accent);
  border: 2px solid var(--surface);
  cursor: grab;
}
.slider-marks { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-dim); }

/* Revenue options */
.revenue-grid { display: flex; flex-direction: column; gap: 8px; }
.revenue-opt {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 13px 14px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: var(--r);
  cursor: pointer;
  transition: all var(--dur) var(--ease);
}
.revenue-opt:hover { border-color: var(--border-md); }
.revenue-opt.selected { border-color: var(--accent); background: var(--accent-dim); }
.rev-icon  { font-size: 18px; flex-shrink: 0; }
.rev-label { font-size: 13px; font-weight: 600; color: var(--text); }
.rev-sub   { font-size: 11px; color: var(--text-dim); }
.revenue-opt.selected .rev-label { color: var(--accent); }
.revenue-opt.selected .rev-sub   { color: var(--text-muted); }
.rev-radio {
  width: 16px; height: 16px;
  border-radius: 50%;
  border: 1.5px solid var(--border-md);
  margin-left: auto;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--dur) var(--ease);
}
.revenue-opt.selected .rev-radio {
  border-color: var(--accent);
  background: var(--accent);
}
.revenue-opt.selected .rev-radio::after {
  content: "";
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #fff;
}

/* Income segmented */
.income-seg { display: flex; gap: 8px; }
.income-opt {
  flex: 1;
  padding: 11px 8px;
  border: 1px solid var(--border);
  border-radius: var(--r);
  background: var(--surface2);
  cursor: pointer;
  text-align: center;
  transition: all var(--dur) var(--ease);
  font-family: var(--font);
}
.income-opt:hover { border-color: var(--border-md); }
.income-opt.selected { border-color: var(--border-md); background: var(--surface3); }
.inc-label { font-size: 12px; font-weight: 600; color: var(--text-muted); }
.inc-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  margin: 0 auto 6px;
  background: var(--border-md);
  transition: background var(--dur) var(--ease);
}
.income-opt.selected .inc-dot { background: var(--color, var(--accent)); }
.income-opt.selected .inc-label { color: var(--text); }

/* Cycle list */
.cycle-list { display: flex; flex-direction: column; gap: 6px; }
.cycle-opt {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: var(--r);
  background: var(--surface2);
  cursor: pointer;
  transition: all var(--dur) var(--ease);
}
.cycle-opt:hover { border-color: var(--border-md); }
.cycle-opt.selected { border-color: var(--accent); background: var(--accent-dim); }
.cyc-label { font-size: 13px; font-weight: 600; color: var(--text); }
.cyc-desc  { font-size: 11px; color: var(--text-dim); margin-top: 1px; }
.cycle-opt.selected .cyc-label { color: var(--accent); }
.cycle-indicator {
  width: 10px; height: 10px;
  border-radius: 50%;
  border: 1.5px solid var(--border-md);
  flex-shrink: 0;
  transition: all var(--dur) var(--ease);
}
.cycle-opt.selected .cycle-indicator {
  border-color: var(--accent);
  background: var(--accent);
}

/* Char counter */
.char-counter { font-size: 11px; color: var(--text-dim); text-align: right; }

/* ── Right panel ── */
.right-panel {
  background: var(--surface);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.panel-header {
  padding: 20px;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.panel-badge {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-dim);
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 2px 8px;
}

/* Company card */
.company-card {
  margin: 16px;
  background: var(--surface2);
  border: 1px solid var(--border-md);
  border-radius: var(--r-lg);
  padding: 20px;
  min-height: 140px;
}
.company-card-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -.02em;
  margin-bottom: 12px;
  min-height: 28px;
}
.company-card-meta { display: flex; flex-direction: column; gap: 6px; }
.card-meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
}
.card-meta-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}

/* Completeness */
.panel-section {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}
.panel-section:last-child { border-bottom: none; }
.panel-section-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 12px;
}

.completion-list { display: flex; flex-direction: column; gap: 8px; }
.completion-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}
.comp-check {
  width: 16px; height: 16px;
  border-radius: 50%;
  border: 1.5px solid var(--border-md);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  color: transparent;
  transition: all var(--dur) var(--ease);
}
.comp-check.done {
  background: var(--success);
  border-color: var(--success);
  color: #fff;
}
.comp-label { color: var(--text-muted); }
.comp-label.done { color: var(--text); }

/* Action buttons */
.panel-actions {
  padding: 16px 20px;
  margin-top: auto;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Divider */
.form-divider { height: 1px; background: var(--border); margin: 4px 0 16px; }

/* Responsive */
@media (max-width: 1100px) {
  .app { grid-template-columns: 220px 1fr; }
  .right-panel { display: none; }
}
@media (max-width: 720px) {
  .app { grid-template-columns: 1fr; }
  .sidebar { display: none; }
  .industry-grid { grid-template-columns: repeat(5, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition: none !important; }
}
`;

/* ─── Sidebar component ─── */
const STEP_NAV = [
  { n: 1, key: "companyName",   label: "Company name",   tab: "identity" },
  { n: 2, key: "industry",      label: "Industry",       tab: "identity" },
  { n: 3, key: "locations",     label: "Locations",      tab: "operations" },
  { n: 4, key: "headcount",     label: "Headcount",      tab: "operations" },
  { n: 5, key: "revenue",       label: "Revenue",        tab: "financial" },
  { n: 6, key: "netIncome",     label: "Net income",     tab: "financial" },
  { n: 7, key: "businessCycle", label: "Business cycle", tab: "vision" },
  { n: 8, key: "vision",        label: "Vision",         tab: "vision" },
  { n: 9, key: "mission",       label: "Mission",        tab: "vision" },
];

function Sidebar({ profile, activeTab, setTab }) {
  const done = countDone(profile);
  const grouped = TABS.map(t => ({
    ...t,
    steps: STEP_NAV.filter(s => s.tab === t.id),
  }));
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">🏗️</div>
        <div>
          <div className="logo-text">Company Forge</div>
          <div className="logo-sub">Build your profile</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {grouped.map(group => (
          <React.Fragment key={group.id}>
            <div className="nav-section-label">{group.label}</div>
            {group.steps.map(({ n, key, label }) => {
              const isDone = stepDone(key, profile[key]);
              return (
                <button
                  key={n}
                  className={`nav-item ${isDone ? "done" : ""} ${activeTab === group.id ? "active" : ""}`}
                  onClick={() => setTab(group.id)}
                >
                  <span className="nav-step-num">{isDone ? "✓" : n}</span>
                  {label}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="progress-label">
          <span>Profile completion</span>
          <span>{done}/9</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(done / 9) * 100}%` }} />
        </div>
      </div>
    </aside>
  );
}

/* ─── Right panel ─── */
function RightPanel({ profile, onCreate, onSave }) {
  const KEYS = [
    { key: "companyName",   label: "Company name" },
    { key: "industry",      label: "Industry" },
    { key: "locations",     label: "Location" },
    { key: "headcount",     label: "Headcount" },
    { key: "revenue",       label: "Revenue" },
    { key: "netIncome",     label: "Net income" },
    { key: "businessCycle", label: "Business cycle" },
    { key: "vision",        label: "Vision" },
    { key: "mission",       label: "Mission" },
  ];
  const done = countDone(profile);

  const summary = [
    profile.industry && INDUSTRIES.find(i => i.id === profile.industry)?.label,
    profile.locations.find(l => l.city)?.city,
    profile.headcount > 0 && `${profile.headcount.toLocaleString()} employees`,
    profile.revenue && REVENUE_TIERS.find(r => r.id === profile.revenue)?.label,
    profile.businessCycle && CYCLES.find(c => c.id === profile.businessCycle)?.label + " stage",
  ].filter(Boolean);

  return (
    <aside className="right-panel">
      <div className="panel-header">
        Company preview
        <span className="panel-badge">{done} / 9</span>
      </div>
      <div className="company-card">
        <div className="company-card-name">
          {profile.companyName || <span style={{ color: "var(--text-dim)", fontWeight: 400, fontSize: 14 }}>No name yet</span>}
        </div>
        <div className="company-card-meta">
          {summary.map((item, i) => (
            <div key={i} className="card-meta-row">
              <div className="card-meta-dot" />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <div className="panel-section-title">Checklist</div>
        <div className="completion-list">
          {KEYS.map(({ key, label }) => {
            const isDone = stepDone(key, profile[key]);
            return (
              <div key={key} className="completion-row">
                <div className={`comp-check ${isDone ? "done" : ""}`}>{isDone ? "✓" : ""}</div>
                <span className={`comp-label ${isDone ? "done" : ""}`}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="panel-actions">
        <button className="btn btn-primary" style={{ justifyContent: "center" }} onClick={onCreate}>
          Create company
        </button>
        <button className="btn btn-ghost" style={{ justifyContent: "center" }} onClick={onSave}>
          Save as draft
        </button>
      </div>
    </aside>
  );
}

/* ─── Tab content sections ─── */
function IdentityTab({ profile, set }) {
  const ind = INDUSTRIES.find(i => i.id === profile.industry);
  return (
    <>
      <div className={`section-card ${stepDone("companyName", profile.companyName) ? "done" : ""}`}>
        <div className="section-head">
          <div className="section-num">{stepDone("companyName", profile.companyName) ? "✓" : "1"}</div>
          <div className="section-title">Company name</div>
          <div className="section-desc">What is your company called?</div>
        </div>
        <div className="section-body">
          <input
            className="form-input form-input-lg"
            placeholder="e.g. Acme Corporation"
            value={profile.companyName}
            onChange={e => set("companyName", e.target.value)}
            autoComplete="organization"
            maxLength={80}
          />
          <div className="char-counter" style={{ marginTop: 6 }}>{profile.companyName.length} / 80</div>
        </div>
      </div>

      <div className={`section-card ${stepDone("industry", profile.industry) ? "done" : ""}`}>
        <div className="section-head">
          <div className="section-num">{stepDone("industry", profile.industry) ? "✓" : "2"}</div>
          <div className="section-title">Industry</div>
          {ind && <div className="section-desc">{ind.icon} {ind.label} selected</div>}
        </div>
        <div className="section-body">
          <div className="industry-grid">
            {INDUSTRIES.map(i => (
              <button key={i.id} className={`industry-opt ${profile.industry === i.id ? "selected" : ""}`}
                onClick={() => set("industry", i.id)}>
                <span className="ind-emoji">{i.icon}</span>
                <span className="ind-name">{i.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function OperationsTab({ profile, set }) {
  const update = (idx, field, val) =>
    set("locations", profile.locations.map((l, i) => i === idx ? { ...l, [field]: val } : l));
  const add    = () => set("locations", [...profile.locations, { city: "", country: "" }]);
  const remove = idx => set("locations", profile.locations.filter((_, i) => i !== idx));

  return (
    <>
      <div className={`section-card ${stepDone("locations", profile.locations) ? "done" : ""}`}>
        <div className="section-head">
          <div className="section-num">{stepDone("locations", profile.locations) ? "✓" : "3"}</div>
          <div className="section-title">Locations</div>
          <div className="section-desc">HQ and branch offices</div>
        </div>
        <div className="section-body">
          <div className="form-group">
            <label className="form-label">City &amp; Country</label>
            <div className="loc-rows">
              {profile.locations.map((l, idx) => (
                <div key={idx} className="loc-row">
                  <input className="form-input" placeholder="City"
                    value={l.city} onChange={e => update(idx, "city", e.target.value)} />
                  <input className="form-input" placeholder="Country"
                    value={l.country} onChange={e => update(idx, "country", e.target.value)} />
                  <button className="loc-remove" onClick={() => remove(idx)}
                    disabled={profile.locations.length === 1}>✕</button>
                </div>
              ))}
            </div>
            <button className="btn-add-row" onClick={add}>+ Add location</button>
          </div>
        </div>
      </div>

      <div className={`section-card ${stepDone("headcount", profile.headcount) ? "done" : ""}`}>
        <div className="section-head">
          <div className="section-num">{stepDone("headcount", profile.headcount) ? "✓" : "4"}</div>
          <div className="section-title">Headcount</div>
          <div className="section-desc">Full-time employees</div>
        </div>
        <div className="section-body">
          <div className="headcount-row">
            <div>
              <div className="headcount-big">{profile.headcount.toLocaleString()}</div>
              <div className="headcount-lbl">employees</div>
            </div>
            <div className="slider-group">
              <input type="range" className="slider-input" min="1" max="10000" step="1"
                value={profile.headcount} onChange={e => set("headcount", +e.target.value)} />
              <div className="slider-marks">
                <span>1</span><span>100</span><span>500</span><span>2K</span><span>10K+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function FinancialTab({ profile, set }) {
  return (
    <>
      <div className={`section-card ${stepDone("revenue", profile.revenue) ? "done" : ""}`}>
        <div className="section-head">
          <div className="section-num">{stepDone("revenue", profile.revenue) ? "✓" : "5"}</div>
          <div className="section-title">Annual revenue</div>
          <div className="section-desc">Approximate range</div>
        </div>
        <div className="section-body">
          <div className="revenue-grid">
            {REVENUE_TIERS.map(t => (
              <div key={t.id} className={`revenue-opt ${profile.revenue === t.id ? "selected" : ""}`}
                onClick={() => set("revenue", t.id)}>
                <span className="rev-icon">{t.icon}</span>
                <div>
                  <div className="rev-label">{t.label}</div>
                  <div className="rev-sub">{t.sub}</div>
                </div>
                <div className="rev-radio" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`section-card ${stepDone("netIncome", profile.netIncome) ? "done" : ""}`}>
        <div className="section-head">
          <div className="section-num">{stepDone("netIncome", profile.netIncome) ? "✓" : "6"}</div>
          <div className="section-title">Profitability</div>
          <div className="section-desc">Current net income status</div>
        </div>
        <div className="section-body">
          <div className="income-seg">
            {INCOME_TIERS.map(t => (
              <button key={t.id}
                className={`income-opt ${profile.netIncome === t.id ? "selected" : ""}`}
                style={{ "--color": t.color }}
                onClick={() => set("netIncome", t.id)}>
                <div className="inc-dot" />
                <div className="inc-label">{t.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function VisionTab({ profile, set }) {
  return (
    <>
      <div className={`section-card ${stepDone("businessCycle", profile.businessCycle) ? "done" : ""}`}>
        <div className="section-head">
          <div className="section-num">{stepDone("businessCycle", profile.businessCycle) ? "✓" : "7"}</div>
          <div className="section-title">Business cycle</div>
          <div className="section-desc">Current stage</div>
        </div>
        <div className="section-body">
          <div className="cycle-list">
            {CYCLES.map(c => (
              <div key={c.id} className={`cycle-opt ${profile.businessCycle === c.id ? "selected" : ""}`}
                onClick={() => set("businessCycle", c.id)}>
                <div className="cycle-indicator" />
                <div>
                  <div className="cyc-label">{c.label}</div>
                  <div className="cyc-desc">{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`section-card ${stepDone("vision", profile.vision) ? "done" : ""}`}>
        <div className="section-head">
          <div className="section-num">{stepDone("vision", profile.vision) ? "✓" : "8"}</div>
          <div className="section-title">Vision</div>
          <div className="section-desc">Long-term aspiration</div>
        </div>
        <div className="section-body">
          <div className="form-group">
            <label className="form-label">Vision statement</label>
            <textarea className="form-textarea" rows={3}
              placeholder="Where do you see this company in 10 years?"
              value={profile.vision} onChange={e => set("vision", e.target.value)}
              maxLength={300} />
            <div className="char-counter">{profile.vision.length} / 300</div>
          </div>
        </div>
      </div>

      <div className={`section-card ${stepDone("mission", profile.mission) ? "done" : ""}`}>
        <div className="section-head">
          <div className="section-num">{stepDone("mission", profile.mission) ? "✓" : "9"}</div>
          <div className="section-title">Mission</div>
          <div className="section-desc">Core purpose</div>
        </div>
        <div className="section-body">
          <div className="form-group">
            <label className="form-label">Mission statement</label>
            <textarea className="form-textarea" rows={3}
              placeholder="What does this company do and for whom?"
              value={profile.mission} onChange={e => set("mission", e.target.value)}
              maxLength={300} />
            <div className="char-counter">{profile.mission.length} / 300</div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════ APP ═══════════════════════════ */
export default function App() {
  const [profile, setProfile] = useState({
    companyName:   "",
    industry:      "",
    locations:     [{ city: "", country: "" }],
    headcount:     50,
    revenue:       "",
    netIncome:     "",
    businessCycle: "",
    vision:        "",
    mission:       "",
  });
  const [activeTab, setActiveTab] = useState("identity");

  const set = (key, val) => setProfile(p => ({ ...p, [key]: val }));
  const done = countDone(profile);

  const tabDone = (tabId) => {
    const steps = STEP_NAV.filter(s => s.tab === tabId);
    return steps.filter(s => stepDone(s.key, profile[s.key])).length;
  };

  const randomize = () => {
    const r = RANDOM_PROFILES[Math.floor(Math.random() * RANDOM_PROFILES.length)];
    setProfile({
      companyName:   r.companyName,
      industry:      r.industry,
      locations:     [{ city: r.city, country: r.country }],
      headcount:     r.headcount,
      revenue:       r.revenue,
      netIncome:     r.netIncome,
      businessCycle: r.businessCycle,
      vision:        r.vision,
      mission:       r.mission,
    });
  };

  const saveDraft = () => {
    const json = JSON.stringify(profile, null, 2);
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([json], { type: "application/json" })),
      download: `${profile.companyName || "company"}-draft.json`,
    });
    a.click();
  };

  const create = () => {
    alert(`${profile.companyName || "Company"} has been created.\n\n${done}/9 fields completed.`);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <Sidebar profile={profile} activeTab={activeTab} setTab={setActiveTab} />

        <main className="main">
          <div className="topbar">
            <div className="topbar-row">
              <h1 className="page-title">
                {profile.companyName || "Build your company"}
              </h1>
              <div className="topbar-actions">
                <button className="btn btn-ghost" onClick={randomize}>Randomize</button>
                <button className="btn btn-primary" onClick={create}>Create company</button>
              </div>
            </div>
            <div className="tab-bar">
              {TABS.map(t => {
                const n = tabDone(t.id);
                const total = STEP_NAV.filter(s => s.tab === t.id).length;
                return (
                  <button key={t.id} className={`tab ${activeTab === t.id ? "active" : ""}`}
                    onClick={() => setActiveTab(t.id)}>
                    {t.label}
                    {n === total && <span className="tab-badge">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-area">
            {activeTab === "identity"   && <IdentityTab   profile={profile} set={set} />}
            {activeTab === "operations" && <OperationsTab profile={profile} set={set} />}
            {activeTab === "financial"  && <FinancialTab  profile={profile} set={set} />}
            {activeTab === "vision"     && <VisionTab     profile={profile} set={set} />}
          </div>
        </main>

        <RightPanel profile={profile} onCreate={create} onSave={saveDraft} />
      </div>
    </>
  );
}
