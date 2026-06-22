import React, { useState, useEffect, useRef, useCallback } from "react";

/* ============================================================
   THE COMPANY FORGE — single-file gamified company profile
   Design tokens · 9 interactive stations · full a11y
   ============================================================ */

const CYCLES = ["Startup", "Growth", "Maturity", "Renewal"];
const INDUSTRIES = [
  "Food & Beverage", "Technology", "Healthcare",
  "Finance", "Manufacturing", "Retail",
  "Energy", "Education", "Real Estate", "Media & Entertainment",
];

/* ─── INJECTED STYLES ─────────────────────────────────────── */
const STYLES = `
:root {
  --navy-900: #0a0e1a;
  --navy-800: #121829;
  --navy-700: #1a2238;
  --navy-600: #212d4a;
  --amber-500: #ffb02e;
  --amber-400: #ffc04d;
  --amber-300: #ffd07a;
  --steel-500: #6b7280;
  --steel-300: #9ca3af;
  --steel-200: #e5e7eb;
  --green-500: #10b981;
  --red-500: #ef4444;

  --space-1: .25rem; --space-2: .5rem; --space-3: .75rem; --space-4: 1rem;
  --space-6: 1.5rem; --space-8: 2rem; --space-10: 2.5rem; --space-12: 3rem;

  --font-display: "Orbitron", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;

  --color-bg:       var(--navy-900);
  --color-surface:  var(--navy-700);
  --color-surface2: var(--navy-600);
  --color-primary:  var(--amber-500);
  --color-text:     var(--steel-200);
  --color-text-dim: var(--steel-300);
  --color-success:  var(--green-500);
  --color-error:    var(--red-500);

  --duration: 400ms;
  --ease: cubic-bezier(.4, 0, .2, 1);
  --radius: 16px;
  --glow: 0 0 24px rgba(255, 176, 46, .45);
  --glow-sm: 0 0 12px rgba(255, 176, 46, .3);
}

*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  line-height: 1.6;
}

/* ── Layout ── */
.forge {
  max-width: 860px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}

.forge-head {
  text-align: center;
  margin-bottom: var(--space-12);
  padding-top: var(--space-8);
}

.forge-title {
  font-family: var(--font-display);
  font-size: 2.5rem;
  color: var(--color-primary);
  text-shadow: var(--glow);
  margin: 0 0 var(--space-2);
  letter-spacing: .06em;
}

.forge-subtitle {
  color: var(--color-text-dim);
  font-size: 1rem;
  margin: 0 0 var(--space-6);
}

/* ── Progress bar ── */
.progress-track {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  margin-bottom: var(--space-2);
}

.prog-dot {
  width: 28px;
  height: 6px;
  border-radius: 3px;
  background: var(--steel-500);
  transition: background var(--duration) var(--ease),
              box-shadow var(--duration) var(--ease);
  opacity: .4;
}
.prog-dot.done {
  background: var(--color-primary);
  box-shadow: var(--glow-sm);
  opacity: 1;
}

.progress-label {
  text-align: center;
  font-size: .875rem;
  color: var(--color-text-dim);
  margin-top: var(--space-1);
}

/* ── Station card ── */
.station {
  background: var(--color-surface);
  border-radius: var(--radius);
  padding: var(--space-8);
  margin-bottom: var(--space-8);
  border: 1px solid rgba(255, 176, 46, .12);
  animation: rise var(--duration) var(--ease) both;
  position: relative;
  overflow: hidden;
}

.station::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--amber-500), transparent);
  opacity: .4;
}

.station h2 {
  font-family: var(--font-display);
  color: var(--color-primary);
  margin: 0 0 var(--space-6);
  font-size: 1.25rem;
  letter-spacing: .05em;
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.station-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 176, 46, .12);
  border: 1px solid rgba(255, 176, 46, .3);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

@keyframes rise {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: none; }
}

/* ── Text inputs ── */
.nameplate, .vision-field, .mission-field {
  width: 100%;
  background: var(--navy-800);
  color: var(--color-text);
  border: 1px solid var(--steel-500);
  border-radius: 10px;
  padding: var(--space-3) var(--space-4);
  font-size: 1.25rem;
  font-family: var(--font-body);
  transition: border-color var(--duration) var(--ease),
              box-shadow var(--duration) var(--ease);
  resize: vertical;
}

.nameplate:focus,
.vision-field:focus,
.mission-field:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--glow);
}

.nameplate::placeholder,
.vision-field::placeholder,
.mission-field::placeholder { color: var(--steel-500); }

.vision-field, .mission-field {
  min-height: 100px;
  font-size: 1rem;
}

.nameplate-preview {
  margin-top: var(--space-3);
  font-family: var(--font-display);
  font-size: 1.75rem;
  color: var(--color-primary);
  text-shadow: var(--glow-sm);
  min-height: 2.2rem;
  letter-spacing: .06em;
  text-align: center;
}

/* ── Gear Selector ── */
.gear-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.gear-outer {
  position: relative;
  width: 160px;
  height: 160px;
}

.gear-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid rgba(255, 176, 46, .2);
  animation: spin-slow 20s linear infinite;
}

@keyframes spin-slow {
  to { transform: rotate(360deg); }
}

.gear-ring-dot {
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: var(--glow-sm);
}

.gear-dial {
  position: absolute;
  inset: 16px;
  border-radius: 50%;
  border: 6px solid transparent;
  border-top-color: var(--color-primary);
  border-right-color: rgba(255, 176, 46, .4);
  background: radial-gradient(circle at 40% 35%, var(--navy-700), var(--navy-900));
  transition: transform var(--duration) var(--ease);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
}

.gear-label-box { text-align: center; min-width: 220px; }

.gear-value {
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--color-primary);
  margin: 0 0 var(--space-2);
  letter-spacing: .04em;
  min-height: 1.6em;
}

.gear-counter {
  font-size: .875rem;
  color: var(--color-text-dim);
  margin: 0 0 var(--space-3);
}

.gear-btns { display: flex; gap: var(--space-3); justify-content: center; }

/* ── Button ── */
.btn {
  background: var(--navy-800);
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: 8px;
  padding: var(--space-2) var(--space-4);
  font-size: 1rem;
  cursor: pointer;
  transition: background var(--duration) var(--ease),
              box-shadow var(--duration) var(--ease);
}

.btn:hover, .btn:focus {
  background: rgba(255, 176, 46, .1);
  box-shadow: var(--glow-sm);
  outline: none;
}

/* ── Geo Locations ── */
.loc-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.loc-row {
  display: grid;
  grid-template-columns: 1fr 1fr 80px 80px auto;
  gap: var(--space-2);
  align-items: center;
  background: var(--navy-800);
  border-radius: 10px;
  padding: var(--space-3);
  border: 1px solid rgba(255,176,46,.1);
}

.loc-input {
  background: var(--navy-900);
  color: var(--color-text);
  border: 1px solid var(--steel-500);
  border-radius: 6px;
  padding: var(--space-2) var(--space-3);
  font-size: .875rem;
  font-family: var(--font-body);
  width: 100%;
  transition: border-color var(--duration) var(--ease);
}

.loc-input:focus { outline: none; border-color: var(--color-primary); }
.loc-input::placeholder { color: var(--steel-500); }

.loc-remove {
  background: transparent;
  border: none;
  color: var(--red-500);
  font-size: 18px;
  cursor: pointer;
  padding: var(--space-1);
  border-radius: 4px;
  line-height: 1;
  transition: background var(--duration) var(--ease);
}
.loc-remove:hover { background: rgba(239, 68, 68, .12); }
.loc-remove:disabled { opacity: .3; cursor: default; }

/* ── Headcount Slider ── */
.headcount-widget { display: flex; flex-direction: column; gap: var(--space-4); }

.people-viz {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  min-height: 80px;
  padding: var(--space-3);
  background: var(--navy-800);
  border-radius: 10px;
  border: 1px solid rgba(255,176,46,.1);
  align-content: flex-start;
}

.person-icon {
  font-size: 14px;
  line-height: 1;
  animation: pop-in 200ms var(--ease) both;
}

@keyframes pop-in {
  from { opacity: 0; transform: scale(.5); }
  to   { opacity: 1; transform: scale(1); }
}

.headcount-num {
  font-family: var(--font-display);
  font-size: 1.75rem;
  color: var(--color-primary);
  text-align: center;
  margin: 0;
  text-shadow: var(--glow-sm);
}

/* ── Gauges ── */
.gauges {
  display: flex;
  gap: var(--space-8);
  flex-wrap: wrap;
  justify-content: center;
}

.gauge-cell { flex: 1; min-width: 260px; text-align: center; }
.gauge-cell h2 { justify-content: center; }
.gauge-label { color: var(--color-text-dim); font-size: .875rem; margin: 0 0 var(--space-3); }
.gauge-amount { font-size: .875rem; color: var(--color-text-dim); margin-top: var(--space-2); }

input[type="range"] {
  width: 100%;
  accent-color: var(--color-primary);
  margin-top: var(--space-4);
  cursor: pointer;
}

/* ── Business Cycle ── */
.cycle-outer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
}

.cycle-ring { position: relative; width: 200px; height: 200px; }
.cycle-svg { width: 100%; height: 100%; overflow: visible; }
.cycle-spoke { cursor: pointer; transition: opacity var(--duration) var(--ease); }
.cycle-spoke:hover { opacity: .85; }

.cycle-labels {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-2);
}

.cycle-btn {
  background: var(--navy-800);
  color: var(--color-text-dim);
  border: 1px solid var(--steel-500);
  border-radius: 24px;
  padding: var(--space-2) var(--space-6);
  font-size: 1rem;
  font-family: var(--font-body);
  cursor: pointer;
  transition: all var(--duration) var(--ease);
}

.cycle-btn:hover, .cycle-btn:focus {
  border-color: var(--color-primary);
  color: var(--color-primary);
  outline: none;
}

.cycle-btn.active {
  background: var(--color-primary);
  color: var(--navy-900);
  border-color: var(--color-primary);
  box-shadow: var(--glow);
  font-weight: 700;
}

/* ── Typewriter ── */
.typewriter-preview {
  margin-top: var(--space-4);
  padding: var(--space-4) var(--space-6);
  background: var(--navy-800);
  border-radius: 10px;
  border-left: 3px solid var(--color-primary);
  min-height: 3.5rem;
  color: var(--color-text-dim);
  font-style: italic;
  font-size: 1rem;
  line-height: 1.7;
}

.typewriter-cursor {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  background: var(--color-primary);
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

/* ── Forge Complete ── */
.complete { border-color: var(--color-primary); border-width: 2px; }

.complete-header {
  font-family: var(--font-display);
  font-size: 2.5rem;
  color: var(--color-primary);
  text-shadow: var(--glow);
  text-align: center;
  margin: 0 0 var(--space-6);
  letter-spacing: .06em;
}

.summary {
  text-align: left;
  background: var(--navy-900);
  color: var(--green-500);
  padding: var(--space-6);
  border-radius: 10px;
  overflow-x: auto;
  font-size: .85rem;
  line-height: 1.7;
  border: 1px solid rgba(16, 185, 129, .2);
}

.complete-actions {
  display: flex;
  justify-content: center;
  margin-top: var(--space-6);
}

.forge-btn {
  font-family: var(--font-display);
  font-size: 1.25rem;
  padding: var(--space-3) var(--space-10);
  background: var(--navy-800);
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: 12px;
  cursor: pointer;
  letter-spacing: .05em;
  transition: background var(--duration) var(--ease),
              box-shadow var(--duration) var(--ease),
              transform 150ms var(--ease);
}

.forge-btn:hover {
  background: var(--color-primary);
  color: var(--navy-900);
  box-shadow: var(--glow);
}

.forge-btn:active { transform: scale(.97); }

@media (max-width: 600px) {
  .loc-row { grid-template-columns: 1fr 1fr; }
  .loc-input[aria-label*="latitude"],
  .loc-input[aria-label*="longitude"] { display: none; }
  .gauges { flex-direction: column; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;

/* ─── GEAR SELECTOR ─────────────────────────────────────────── */
const INDUSTRY_ICONS = {
  "Food & Beverage": "🍽️", "Technology": "💻", "Healthcare": "🏥",
  "Finance": "💰", "Manufacturing": "🏭", "Retail": "🛍️",
  "Energy": "⚡", "Education": "🎓", "Real Estate": "🏠",
  "Media & Entertainment": "🎬",
};

function GearSelector({ options = INDUSTRIES, value, onChange }) {
  const [idx, setIdx] = useState(Math.max(0, options.indexOf(value)));

  const rotate = useCallback((dir) => {
    setIdx(prev => {
      const next = (prev + dir + options.length) % options.length;
      onChange?.(options[next]);
      return next;
    });
  }, [options, onChange]);

  const onKey = (e) => {
    if (["ArrowRight", "ArrowDown"].includes(e.key)) { e.preventDefault(); rotate(1); }
    if (["ArrowLeft", "ArrowUp"].includes(e.key))   { e.preventDefault(); rotate(-1); }
  };

  const deg = idx * (360 / options.length);
  const icon = INDUSTRY_ICONS[options[idx]] || "🏢";

  return (
    <div
      className="gear-wrapper"
      role="listbox"
      aria-label="Select Industry"
      tabIndex={0}
      onKeyDown={onKey}
    >
      <div className="gear-outer">
        <div className="gear-ring">
          <div className="gear-ring-dot" />
        </div>
        <div className="gear-dial" style={{ transform: `rotate(${deg}deg)` }}>
          <span role="img" aria-hidden="true">{icon}</span>
        </div>
      </div>

      <div className="gear-label-box">
        <p
          role="option"
          aria-selected="true"
          aria-live="polite"
          className="gear-value"
        >
          {options[idx]}
        </p>
        <p className="gear-counter">{idx + 1} / {options.length}</p>
        <div className="gear-btns">
          <button className="btn" onClick={() => rotate(-1)} aria-label="Previous industry">◀ Prev</button>
          <button className="btn" onClick={() => rotate(1)}  aria-label="Next industry">Next ▶</button>
        </div>
      </div>
    </div>
  );
}

/* ─── RADIAL GAUGE ──────────────────────────────────────────── */
function RadialGauge({ value = 0, max = 1e9, label = "Revenue", color }) {
  const r = 76;
  const c = 2 * Math.PI * r;
  const pct = Math.min(Math.max(Math.abs(value) / max, 0), 1);
  const offset = c * (1 - pct);
  const millions = Math.abs(value) / 1e6;
  const display = millions >= 1000
    ? `$${(millions / 1000).toFixed(1)}B`
    : `$${millions.toFixed(0)}M`;

  return (
    <div
      role="meter"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.abs(value)}
      aria-valuetext={`${label}: $${Math.abs(value).toLocaleString()}`}
    >
      <svg width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <filter id={`glow-${label.replace(/\s/g,'')}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Track */}
        <circle cx="100" cy="100" r={r} stroke="var(--navy-600)" strokeWidth="14" fill="none" />
        {/* Tick marks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 - 90) * (Math.PI / 180);
          const x1 = 100 + (r + 8) * Math.cos(a),  y1 = 100 + (r + 8) * Math.sin(a);
          const x2 = 100 + (r + 14) * Math.cos(a), y2 = 100 + (r + 14) * Math.sin(a);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,176,46,.2)" strokeWidth="1.5" />;
        })}
        {/* Arc fill */}
        <circle
          cx="100" cy="100" r={r}
          stroke={color || "var(--color-primary)"}
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform="rotate(-90 100 100)"
          style={{ transition: "stroke-dashoffset var(--duration) var(--ease), stroke var(--duration) var(--ease)" }}
        />
        {/* Glow overlay */}
        <circle
          cx="100" cy="100" r={r}
          stroke={color || "var(--color-primary)"}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform="rotate(-90 100 100)"
          filter={`url(#glow-${label.replace(/\s/g,'')})`}
          opacity=".5"
          style={{ transition: "stroke-dashoffset var(--duration) var(--ease)" }}
        />
        <text x="100" y="96" textAnchor="middle" fill={color || "var(--color-primary)"}
          fontSize="20" fontFamily="Orbitron, system-ui" fontWeight="700">{display}</text>
        <text x="100" y="114" textAnchor="middle" fill="var(--steel-300)"
          fontSize="11" fontFamily="Inter, system-ui">{label}</text>
        <text x="100" y="130" textAnchor="middle" fill="var(--steel-500)"
          fontSize="10" fontFamily="Inter, system-ui">{Math.round(pct * 100)}%</text>
      </svg>
    </div>
  );
}

/* ─── GEO LOCATIONS ─────────────────────────────────────────── */
function GeoLocations({ locations, onChange }) {
  const update = (idx, key, val) =>
    onChange(locations.map((l, k) => k === idx ? { ...l, [key]: val } : l));
  const add = () =>
    onChange([...locations, { city: "", country: "", lat: 0, lng: 0 }]);
  const remove = (idx) =>
    onChange(locations.filter((_, k) => k !== idx));

  return (
    <div>
      <div className="loc-list">
        {locations.map((l, idx) => (
          <div key={idx} className="loc-row">
            <input className="loc-input" placeholder="City"
              value={l.city} aria-label={`Location ${idx + 1} city`}
              onChange={e => update(idx, "city", e.target.value)} />
            <input className="loc-input" placeholder="Country"
              value={l.country} aria-label={`Location ${idx + 1} country`}
              onChange={e => update(idx, "country", e.target.value)} />
            <input className="loc-input" placeholder="Lat" type="number"
              step="0.0001" min="-90" max="90"
              value={l.lat || ""} aria-label={`Location ${idx + 1} latitude`}
              onChange={e => update(idx, "lat", parseFloat(e.target.value) || 0)} />
            <input className="loc-input" placeholder="Lng" type="number"
              step="0.0001" min="-180" max="180"
              value={l.lng || ""} aria-label={`Location ${idx + 1} longitude`}
              onChange={e => update(idx, "lng", parseFloat(e.target.value) || 0)} />
            <button className="loc-remove" onClick={() => remove(idx)}
              aria-label={`Remove location ${idx + 1}`} disabled={locations.length === 1}>✕</button>
          </div>
        ))}
      </div>
      <button className="btn" onClick={add} aria-label="Add a new location">＋ Add Location</button>
    </div>
  );
}

/* ─── HEADCOUNT SLIDER ──────────────────────────────────────── */
function HeadcountSlider({ value, onChange }) {
  const maxDots = 50;
  const dotCount = Math.round((value / 50000) * maxDots);

  return (
    <div className="headcount-widget">
      <input
        type="range"
        min="0" max="50000" step="50"
        value={value}
        aria-label="Headcount"
        aria-valuenow={value}
        aria-valuemin={0} aria-valuemax={50000}
        aria-valuetext={`${value.toLocaleString()} employees`}
        onChange={e => onChange(+e.target.value)}
      />
      <div className="people-viz" aria-hidden="true">
        {Array.from({ length: dotCount }).map((_, i) => (
          <span key={i} className="person-icon" style={{ animationDelay: `${i * 4}ms` }}>👤</span>
        ))}
      </div>
      <p className="headcount-num" aria-live="polite">{value.toLocaleString()} people</p>
    </div>
  );
}

/* ─── BUSINESS CYCLE WHEEL ──────────────────────────────────── */
const CYCLE_COLORS = {
  Startup: "#38bdf8", Growth: "#ffb02e", Maturity: "#10b981", Renewal: "#a78bfa",
};

function CycleWheel({ value, onChange }) {
  const cx = 100, cy = 100, r = 72;
  const total = CYCLES.length;

  return (
    <div className="cycle-outer">
      <div className="cycle-ring">
        <svg className="cycle-svg" viewBox="0 0 200 200" aria-hidden="true">
          {CYCLES.map((cycle, i) => {
            const sa = (i / total) * 2 * Math.PI - Math.PI / 2 + 0.06;
            const ea = ((i + 1) / total) * 2 * Math.PI - Math.PI / 2 - 0.06;
            const x1 = cx + r * Math.cos(sa), y1 = cy + r * Math.sin(sa);
            const x2 = cx + r * Math.cos(ea), y2 = cy + r * Math.sin(ea);
            const x3 = cx + (r - 28) * Math.cos(ea), y3 = cy + (r - 28) * Math.sin(ea);
            const x4 = cx + (r - 28) * Math.cos(sa), y4 = cy + (r - 28) * Math.sin(sa);
            const isActive = value === cycle;
            const mid = (sa + ea) / 2;
            const lx = cx + (r - 14) * Math.cos(mid);
            const ly = cy + (r - 14) * Math.sin(mid);
            const col = CYCLE_COLORS[cycle];
            return (
              <g key={cycle} className="cycle-spoke"
                onClick={() => onChange(cycle)}
                tabIndex={0}
                onKeyDown={e => (e.key === " " || e.key === "Enter") && onChange(cycle)}
              >
                <path
                  d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${r - 28} ${r - 28} 0 0 0 ${x4} ${y4} Z`}
                  fill={isActive ? col : `${col}33`}
                  stroke={isActive ? col : "transparent"}
                  strokeWidth="1.5"
                  style={{ transition: "fill var(--duration) var(--ease)" }}
                />
                <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                  fontSize="8.5" fill={isActive ? "#fff" : col}
                  fontFamily="Orbitron, system-ui" fontWeight="700" pointerEvents="none">
                  {cycle}
                </text>
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r={38} fill="var(--navy-800)" stroke="rgba(255,176,46,.2)" strokeWidth="1" />
          <text x={cx} y={cy - 6} textAnchor="middle"
            fontSize="9" fill="var(--steel-300)" fontFamily="Orbitron, system-ui">STAGE</text>
          <text x={cx} y={cy + 10} textAnchor="middle"
            fontSize="11" fill={CYCLE_COLORS[value] || "var(--amber-500)"}
            fontFamily="Orbitron, system-ui" fontWeight="700">{value || "—"}</text>
        </svg>
      </div>
      <div className="cycle-labels" role="radiogroup" aria-label="Business cycle">
        {CYCLES.map(c => (
          <button key={c} className={`cycle-btn ${value === c ? "active" : ""}`}
            role="radio" aria-checked={value === c}
            onClick={() => onChange(c)}>{c}</button>
        ))}
      </div>
    </div>
  );
}

/* ─── TYPEWRITER ────────────────────────────────────────────── */
function Typewriter({ text, placeholder }) {
  const [shown, setShown] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    clearInterval(timerRef.current);
    setShown("");
    if (!text) return;
    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(timerRef.current);
    }, 20);
    return () => clearInterval(timerRef.current);
  }, [text]);

  return (
    <div className="typewriter-preview" aria-live="polite">
      {shown || <span style={{ color: "var(--steel-500)" }}>{placeholder}</span>}
      {text && shown.length < text.length && <span className="typewriter-cursor" aria-hidden="true" />}
    </div>
  );
}

/* ─── APP ───────────────────────────────────────────────────── */
export default function App() {
  const [profile, setProfile] = useState({
    companyName: "",
    industry: "Technology",
    locations: [{ city: "", country: "", lat: 0, lng: 0 }],
    headcount: 500,
    revenue: 250_000_000,
    netIncome: 40_000_000,
    businessCycle: "Growth",
    vision: "",
    mission: "",
  });

  const set = (key, val) => setProfile(p => ({ ...p, [key]: val }));

  const completed = [
    profile.companyName,
    profile.industry,
    profile.locations.some(l => l.city),
    profile.headcount > 0,
    profile.revenue > 0,
    profile.netIncome !== 0,
    profile.businessCycle,
    profile.vision,
    profile.mission,
  ].filter(Boolean).length;

  return (
    <>
      <style>{STYLES}</style>
      <main className="forge">

        {/* Header */}
        <header className="forge-head">
          <h1 className="forge-title">⚒ The Company Forge</h1>
          <p className="forge-subtitle">Forge your company identity, station by station.</p>
          <div className="progress-track" role="progressbar"
            aria-valuenow={completed} aria-valuemin={0} aria-valuemax={9}
            aria-label={`${completed} of 9 stations complete`}>
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className={`prog-dot ${i < completed ? "done" : ""}`} aria-hidden="true" />
            ))}
          </div>
          <p className="progress-label">{completed} / 9 stations forged</p>
        </header>

        {/* 1 · Company Name */}
        <section className="station" aria-labelledby="s1">
          <h2 id="s1"><span className="station-icon" aria-hidden="true">🏷</span>1 · Company Name</h2>
          <input className="nameplate" placeholder="Enter your company name…"
            value={profile.companyName} onChange={e => set("companyName", e.target.value)}
            aria-label="Company name" autoComplete="organization" />
          <div className="nameplate-preview" aria-live="polite">{profile.companyName}</div>
        </section>

        {/* 2 · Industry */}
        <section className="station" aria-labelledby="s2">
          <h2 id="s2"><span className="station-icon" aria-hidden="true">⚙️</span>2 · Industry</h2>
          <GearSelector value={profile.industry} onChange={v => set("industry", v)} />
        </section>

        {/* 3 · Locations */}
        <section className="station" aria-labelledby="s3">
          <h2 id="s3"><span className="station-icon" aria-hidden="true">📍</span>3 · Locations</h2>
          <GeoLocations locations={profile.locations} onChange={v => set("locations", v)} />
        </section>

        {/* 4 · Headcount */}
        <section className="station" aria-labelledby="s4">
          <h2 id="s4"><span className="station-icon" aria-hidden="true">👥</span>4 · Headcount</h2>
          <HeadcountSlider value={profile.headcount} onChange={v => set("headcount", v)} />
        </section>

        {/* 5 & 6 · Gauges */}
        <section className="station gauges">
          <div className="gauge-cell">
            <h2 id="s5"><span className="station-icon" aria-hidden="true">📈</span>5 · Revenue</h2>
            <RadialGauge value={profile.revenue} max={1_000_000_000} label="Revenue" />
            <p className="gauge-amount">${profile.revenue.toLocaleString()}</p>
            <input type="range" min="0" max="1000000000" step="5000000"
              value={profile.revenue}
              aria-label="Revenue" aria-valuenow={profile.revenue}
              aria-valuemin={0} aria-valuemax={1000000000}
              aria-valuetext={`Revenue: $${profile.revenue.toLocaleString()}`}
              onChange={e => set("revenue", +e.target.value)} />
          </div>
          <div className="gauge-cell">
            <h2 id="s6">
              <span className="station-icon" aria-hidden="true">{profile.netIncome >= 0 ? "💚" : "🔴"}</span>
              6 · Net Income
            </h2>
            <RadialGauge
              value={Math.abs(profile.netIncome)}
              max={500_000_000}
              label={profile.netIncome >= 0 ? "Profit" : "Loss"}
              color={profile.netIncome >= 0 ? "var(--color-success)" : "var(--color-error)"}
            />
            <p className="gauge-amount"
              style={{ color: profile.netIncome >= 0 ? "var(--color-success)" : "var(--color-error)" }}>
              {profile.netIncome >= 0 ? "+" : "−"}${Math.abs(profile.netIncome).toLocaleString()}
            </p>
            <input type="range" min="-200000000" max="500000000" step="5000000"
              value={profile.netIncome}
              aria-label="Net income" aria-valuenow={profile.netIncome}
              aria-valuemin={-200000000} aria-valuemax={500000000}
              aria-valuetext={`Net income: ${profile.netIncome >= 0 ? "+" : ""}$${profile.netIncome.toLocaleString()}`}
              onChange={e => set("netIncome", +e.target.value)} />
          </div>
        </section>

        {/* 7 · Business Cycle */}
        <section className="station" aria-labelledby="s7">
          <h2 id="s7"><span className="station-icon" aria-hidden="true">🔄</span>7 · Business Cycle</h2>
          <CycleWheel value={profile.businessCycle} onChange={v => set("businessCycle", v)} />
        </section>

        {/* 8 · Vision */}
        <section className="station" aria-labelledby="s8">
          <h2 id="s8"><span className="station-icon" aria-hidden="true">🌌</span>8 · Vision</h2>
          <textarea className="vision-field" placeholder="Our vision is to…"
            value={profile.vision} onChange={e => set("vision", e.target.value)}
            aria-label="Company vision" rows={4} />
        </section>

        {/* 9 · Mission */}
        <section className="station" aria-labelledby="s9">
          <h2 id="s9"><span className="station-icon" aria-hidden="true">🎯</span>9 · Mission</h2>
          <textarea className="mission-field" placeholder="Our mission is to…"
            value={profile.mission} onChange={e => set("mission", e.target.value)}
            aria-label="Company mission" rows={4} />
          <Typewriter text={profile.mission} placeholder="Start typing your mission above — it will appear here…" />
        </section>

        {/* Forge Complete */}
        <section className="station complete" aria-labelledby="complete-title">
          <h2 className="complete-header" id="complete-title">⚡ Forge Complete</h2>
          <pre className="summary" aria-label="Company profile JSON">{JSON.stringify(profile, null, 2)}</pre>
          <div className="complete-actions">
            <button className="forge-btn"
              onClick={() => { console.log("PROFILE:", profile); console.log(JSON.stringify(profile, null, 2)); }}
              aria-label="Save profile to console">
              🔥 Save Profile
            </button>
          </div>
        </section>

      </main>
    </>
  );
}
