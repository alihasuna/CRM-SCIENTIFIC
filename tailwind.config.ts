import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      // Add custom theme extensions here if needed later
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
       // Extend colors for dark mode (example)
       colors: {
         gray: {
           50: '#FAFAFA',
           100: '#F5F5F5',
           200: '#E5E5E5',
           300: '#D4D4D4',
           400: '#A3A3A3',
           500: '#737373',
           600: '#525252',
           700: '#404040',
           800: '#262626',
           900: '#171717',
           950: '#0D0D0D', // Darker gray for dark mode backgrounds
         }
       }
    },
  },
  plugins: [
      // Add any plugins here, e.g., require('@tailwindcss/forms')
  ],
};
export default config; 