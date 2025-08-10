/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",         // لو عندك ملف HTML رئيسي
    "./src/**/*.{js,ts,jsx,tsx}", // كل ملفات المشروع داخل src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
