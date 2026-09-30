/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light Theme - Clean & Professional
        bg: '#FFFFFF',              // پس‌زمینه اصلی
        surface: '#F5F5F5',         // پس‌زمینه کارت‌ها
        border: '#E0E0E0',          // بوردر
        divider: '#CFCFCF',         // خط جداکننده
        
        text: {
          DEFAULT: '#252525',       // متن اصلی
          secondary: '#545454',     // متن ثانویه
          muted: '#7D7D7D',         // متن کم‌اهمیت
        },
        
        btn: {
          primary: '#252525',       // دکمه اصلی
          hover: '#545454',         // hover
          text: '#FFFFFF',          // متن دکمه
        },
        
        // Accent colors
        accent: '#DC2626',          // قرمز
        success: '#16A34A',         // سبز
        warning: '#F59E0B',         // نارنجی
      },
      fontFamily: {
        sans: ['Vazirmatn', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
