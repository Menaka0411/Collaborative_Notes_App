/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  plugins: [require('@tailwindcss/typography')],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            p: {
              marginTop: '0.1em',
              marginBottom: '0.1em',
              lineHeight: '1.3',
            },
            h1: {
              marginTop: '0.2em',
              marginBottom: '0.2em',
              lineHeight: '1.2',
            },
            h2: {
              marginTop: '0.2em',
              marginBottom: '0.2em',
              lineHeight: '1.25',
            },
            h3: {
              marginTop: '0.15em',
              marginBottom: '0.15em',
              lineHeight: '1.25',
            },
            ul: {
              marginTop: '0.1em',
              marginBottom: '0.1em',
              paddingLeft: '1.25em',
            },
            ol: {
              marginTop: '0.1em',
              marginBottom: '0.1em',
              paddingLeft: '1.25em',
            },
            li: {
              marginTop: '0.05em',
              marginBottom: '0.05em',
              lineHeight: '1.2',
            },
          },
        },
      },      
    },
  },
};