import { useState, useEffect } from 'react'

const useDarkSide = () => {
  const [theme, setTheme] = useState(localStorage.theme || '')

  const onChangeTheme = () => {
    setTheme(prevState => (prevState !== 'dark' ? 'dark' : ''))
  }

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', theme)
    } else if ('theme' in localStorage) {
      document.documentElement.classList.remove('dark')
      localStorage.removeItem('theme')
    }
  }, [theme])

  return {
    theme,
    onChangeTheme
  }
}

export default useDarkSide
