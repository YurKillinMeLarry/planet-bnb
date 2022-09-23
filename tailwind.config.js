/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        babyblue: '#4calaf',
        dreamblue: '#3a6979',
        nightblue: '#2c3e50',
        star: '#ffb400',
        redred: '#e0565b',
        yellower: '#ffffd6',
        darker: '#2e2e48',
        browner: '#3f3f1a',
        lighter: '#fafafc',
        grayer: '#efeff5',
        whiter: '#fff'
      },
      fontFamily: {
        signature: ['Great Vibes'],
        mulish: ['Mulish'],
        biorhyme: ['Bio Rhyme']
      },
      plugins: []
    }
  }
}
