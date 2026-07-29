import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			display: ['var(--font-fredoka)', 'sans-serif'],
  			body: ['var(--font-inter)', 'sans-serif'],
  			data: ['var(--font-plex-mono)', 'monospace'],
  		},
  		colors: {
  			ink: '#16181D',
  			paper: '#EDF2F7',
  			coral: '#FF4D6D',
  			teal: '#00B8A9',
  			amber: '#FFC93C',
  			violet: '#6C63FF',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			hard: '6px 6px 0 0 #16181D',
  			'hard-sm': '4px 4px 0 0 #16181D',
  			'hard-lg': '10px 10px 0 0 #16181D',
  		},
  		keyframes: {
  			'bounce-in': {
  				'0%': { transform: 'scale(0.3) rotate(-15deg)', opacity: '0' },
  				'60%': { transform: 'scale(1.08) rotate(4deg)', opacity: '1' },
  				'100%': { transform: 'scale(1) rotate(0deg)' },
  			},
  			hop: {
  				'0%, 100%': { transform: 'translateY(0)' },
  				'50%': { transform: 'translateY(-14px)' },
  			},
  			wobble: {
  				'0%, 100%': { transform: 'rotate(-2deg)' },
  				'50%': { transform: 'rotate(2deg)' },
  			},
  		},
  		animation: {
  			'bounce-in': 'bounce-in 0.7s cubic-bezier(.34,1.56,.64,1) both',
  			hop: 'hop 1.8s ease-in-out infinite',
  			wobble: 'wobble 2.6s ease-in-out infinite',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
