/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'apple-sdgothic-medium': ['AppleSDGothicNeoM', 'sans-serif'],
        'apple-sdgothic-semi-bold': ['AppleSDGothicNeoSB', 'sans-serif'],
        'apple-sdgothic-bold': ['AppleSDGothicNeoB', 'sans-serif'],
        'apple-sdgothic-extra-bold': ['AppleSDGothicNeoEB', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
};
