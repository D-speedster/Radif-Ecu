# 🎨 تم — Dark Elegant

## رنگ‌های اصلی

```css
#252525  /* پس‌زمینه اصلی */
#545454  /* پس‌زمینه کارت‌ها */
#7d7d7d  /* رنگ اصلی */
#CFCFCF  /* متن و رنگ روشن */
#DC2626  /* Accent — قرمز CTA */
```

## نقشه رنگ‌ها

| نام | Hex | استفاده |
|-----|-----|---------|
| Background | `#252525` | پس‌زمینه اصلی صفحات |
| Surface | `#545454` | کارت‌ها، Modal، Sidebar |
| Primary | `#7d7d7d` | دکمه‌های اصلی، Border |
| Primary Light | `#CFCFCF` | متن اصلی، هایلایت |
| Accent | `#DC2626` | CTA، دکمه‌های مهم |

## فایل‌های مرتبط

- `src/app/globals.css` — CSS Variables
- `tailwind.config.js` — Tailwind Colors
- `src/components/admin/TipTapEditor.tsx` — رنگ‌های Editor

## استفاده در کد

```jsx
// Tailwind classes
<div className="bg-[var(--color-bg)]">
  <div className="bg-[var(--color-surface)]">
    <button className="bg-[var(--color-primary)]">

// CSS Variables
:root {
  --color-bg: #252525;
  --color-surface: #545454;
  --color-primary: #7d7d7d;
  --color-text: #CFCFCF;
}
```

## فونت

- **فارسی:** YekanBakh (لوکال، از `public/fonts/`)
- فایل CSS: `src/app/globals.css`
