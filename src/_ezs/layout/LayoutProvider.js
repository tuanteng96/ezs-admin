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

  return (
    <LayoutContext.Provider value={{ loadingContent, updateLoadingContent }}>
      {children}
    </LayoutContext.Provider>
  )
}

export { LayoutProvider, useLayout }
