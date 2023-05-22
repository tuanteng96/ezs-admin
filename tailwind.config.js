/** @type {import('tailwindcss').Config} */
const withMT = require('@material-tailwind/react/utils/withMT')

module.exports = withMT({
  darkMode: ['class'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true
    },
    screens: {
      print: { raw: 'print' },
      screen: { raw: 'screen' }
    },
    // fontSize: {
    //   'sm': '0.938rem'
    // },
    colors: {
      slate: {
        800: '#1e1e2d'
      },
      gray: {
        100: '#f9f9f9',
        200: '#F4F4F4',
        400: '#B5B5C3',
        500: '#A1A5B7',
        600: '#7E8299',
        700: '#5E6278',
        800: '#3F4254'
      },
      graydark: {
        100: '#1b1b29',
        200: '#2B2B40',
        400: '#323248',
        500: '#565674',
        600: '#6D6D80',
        700: '#92929F',
        800: '#CDCDDE'
      },
      site: {
        app: '#f5f8fa',
        aside: '#1e1e2d',
        'aside-hover': '#2a2a3c',
        color: '#181C32',
        muted: '#b5b5c3'
      },
      dark: {
        app: '#151521',
        muted: '#ced4da',
        light: '#2B2B40',
        primarylight: '#212e48',
        successlight: '#1c3238',
        aside: '#1e1e2d',
        shadow: 'rgba(0, 0, 0, 0.3)',
        gray: '#CDCDDE',
        danger: '#f1416c'
      },
      primary: '#3699ff',
      primaryhv: '#187de4',
      primarylight: '#e1f0ff',
      danger: '#f64e60',
      dangerhv: '#EE2D41',
      dangerlight: '#FFE2E5',
      light: '#F4F6FA',
      lightinverse: '#7E8299',
      success: '#1bc5bd',
      successlight: '#C9F7F5',
      successhv: '#0BB7AF',
      warning: '#FFA800',
      warninglight: '#fff8dd',
      muted: '#A1A5B7',
      orange: '#f26353',
      muted2: '#878c93',
      textcode: '#b93993',
      bgcode: '#F1F3F8'
    },
    borderColor: {
      slate: {
        600: '#2B2B40'
      },
      gray: {
        100: '#f9f9f9',
        200: '#F4F4F4',
        300: '#d5d7da',
        400: '#B5B5C3',
        700: '#5E6278',
        800: '#3F4254',
        900: '#222222'
      },
      graydark: {
        100: '#1b1b29',
        200: '#2B2B40',
        300: '#d5d7da',
        400: '#323248',
        700: '#92929F',
        800: '#CDCDDE',
        900: '#222222'
      },
      white: '#fff',
      primary: '#3699ff',
      primaryhv: '#187de4',
      separator: '#F4F4F4',
      danger: '#F64E60',
      dangerhv: '#EE2D41',
      success: '#1bc5bd',
      light: '#EBEDF3',
      warning: '#FFA800',
      orange: '#f26353',
      transparent: 'transparent',
      dark: {
        separator: '#2B2B40',
        muted: '#3d3c59',
        light: '#EBEDF3'
      }
    },
    backgroundImage: {
      stripes: `linear-gradient(45deg,#ddd 25%,transparent 0,transparent 50%,#ddd 0,#ddd 75%,transparent 0,transparent)`
    },
    boxShadow: {
      lg: '0px 0px 50px 0px rgba(82, 63, 105, 0.15)',
      sm: '0px 0px 20px 0px rgba(76, 87, 125, 0.02)'
    },
    fontFamily: {
      sans: ['Mulish', 'sans-serif'],
      inter: ['Inter', 'sans-serif']
    },
    extend: {
      keyframes: {
        ringBell: {
          '0%': {
            transform: 'rotate(0)'
          },
          '1%': {
            transform: 'rotate(30deg)'
          },
          '3%': {
            transform: 'rotate(-28deg)'
          },
          '5%': {
            transform: 'rotate(34deg) '
          },
          '7%': {
            transform: 'rotate(-32deg)'
          },
          '9%': {
            transform: 'rotate(30deg)'
          },
          '11%': {
            transform: 'rotate(-28deg)'
          },
          '13%': {
            transform: 'rotate(26deg)'
          },
          '15%': {
            transform: 'rotate(-24deg)'
          },
          '17%': {
            transform: 'rotate(22deg) '
          },
          ' 19%': {
            transform: 'rotate(-20deg) '
          },
          '21%': {
            transform: 'rotate(18deg) '
          },
          '23%': {
            transform: 'rotate(-16deg)'
          },
          '25%': {
            transform: 'rotate(14deg)'
          },
          '27%': {
            transform: 'rotate(-12deg)'
          },
          '29%': {
            transform: 'rotate(10deg)'
          },
          '31%': {
            transform: 'rotate(-8deg)'
          },
          '33%': {
            transform: 'rotate(6deg)'
          },
          '35%': {
            transform: 'rotate(-4deg)'
          },
          '37%': {
            transform: 'rotate(2deg)'
          },
          '39%': {
            transform: 'rotate(-1deg)'
          },
          '41%': {
            transform: 'rotate(1deg) '
          },
          '43%': {
            transform: 'rotate(0)'
          },
          '100%': {
            transform: 'rotate(0)'
          }
        },
        Blink: {
          '100%': {
            visibility: 'hidden'
          }
        },
        blinker: {
          '50%': {
            opacity: 0
          }
        }
      },
      animation: {
        'ring-bell': 'ringBell 2s .7s ease-in-out infinite',
        blink: 'Blink 1s steps(5, start) infinite',
        blinker: 'blinker 1s linear infinite'
      }
    }
  },
  plugins: [
    require('tailwind-scrollbar')({
      nocompatible: true
    })
  ]
})
