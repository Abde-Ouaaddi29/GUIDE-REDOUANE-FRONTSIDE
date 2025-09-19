module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F97316', // orange-500
          light: '#FDBA74',   // orange-300
          dark: '#C2410C',    // orange-700
        },
        secondary: {
          DEFAULT: '#10B981', // emerald-500
          light: '#6EE7B7',   // emerald-300
          dark: '#047857',    // emerald-700
        },
        accent: {
          DEFAULT: '#F59E0B', // amber-500
          light: '#FCD34D',   // amber-300
          dark: '#B45309',    // amber-700
        },
        background: '#F9FAFB', // gray-50
        surface: '#FFFFFF',    // white
        text: {
          DEFAULT: '#1F2937', // gray-800
          light: '#6B7280',   // gray-500
        },
      },
    },
  },
  plugins: [],
}