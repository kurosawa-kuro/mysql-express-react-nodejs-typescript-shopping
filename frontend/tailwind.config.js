module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-blue': {
          'lightest': '#eff6ff',
          'lighter': '#dbeafe',
          'light': '#bedcff',
          'DEFAULT': '#5fa6fb',
          'dark': '#3984f8',
          'darker': '#2364ed',
          'darkest': '#1b4fda',
          'extra-dark': '#1d40b0',
          'extra-darker': '#1d3b8b',
          'extra-darkest': '#162655',
        },
        'custom-red': {
          'lightest': '#fee2e2',
          'light': '#ef4444',
          'dark': '#b91c1c',
        },
        'custom-green': {
          'lightest': '#dcfce7',
          'light': '#22c55e',
          'dark': '#15803d',
        },
      },
    },
  },
  plugins: [],
};
