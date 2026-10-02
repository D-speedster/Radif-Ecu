import React from 'react';

// تصویر تزئینی: جدول نقشهٔ سوخت ECU (اعداد نمونه و بی‌معنی؛ فقط برای فضای بصری)
const COLS = 9;
const ROWS = 7;

const value = (r: number, c: number) => {
  const x = (c + 1) / COLS;
  const y = (r + 1) / ROWS;
  return Math.round(22 + 70 * Math.sin(x * 2.1) * Math.pow(y, 0.8) + 8 * Math.cos(c * 1.3 + r));
};

export default function EcuMap() {
  const cells = Array.from({ length: ROWS * COLS }, (_, i) => {
    const r = Math.floor(i / COLS);
    const c = i % COLS;
    const v = value(r, c);
    return { v, a: Math.min(0.95, Math.max(0.06, (v - 20) / 85)) };
  });

  return (
    <div aria-hidden="true" dir="ltr" className="select-none">
      <div
        className="rounded-xl p-4 md:p-5"
        style={{ background: 'var(--ink-2)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex justify-between text-[10px] tracking-wide mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
          <span>RPM</span>
          <span>LOAD</span>
        </div>
        <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
          {cells.map((cell, i) => (
            <div
              key={i}
              className="text-center text-[10px] md:text-xs py-1.5 rounded-[3px] font-medium"
              style={{
                fontFamily: 'ui-monospace, Consolas, monospace',
                background: `rgba(255,176,32,${cell.a.toFixed(2)})`,
                color: cell.a > 0.5 ? '#1A1300' : 'rgba(255,255,255,0.7)',
              }}
            >
              {cell.v}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
