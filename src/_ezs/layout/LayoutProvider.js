import { ThemeProvider } from '@material-tailwind/react'
import { createContext, useContext, useState } from 'react'

const LayoutContext = createContext()

const useLayout = () => {
  return useContext(LayoutContext)
}

const LayoutProvider = ({ children }) => {
  const [loadingContent, setLoadingContent] = useState(false)

  const updateLoadingContent = loading => {
    setLoadingContent(loading)
  }

  const customTheme = {}

  return (
    <ThemeProvider value={customTheme}>
      <LayoutContext.Provider value={{ loadingContent, updateLoadingContent }}>
        {children}
      </LayoutContext.Provider>
    </ThemeProvider>
  )
}

export { LayoutProvider, useLayout }
