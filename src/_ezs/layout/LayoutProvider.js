import { createContext, useContext, useState } from 'react'

const LayoutContext = createContext()

const useLayout = () => {
  return useContext(LayoutContext)
}

const LayoutProvider = ({ children }) => {
  const [loadingContent, setLoadingContent] = useState(false)
  const [LayoutIframe] = useState(window?.top?.token)

  const updateLoadingContent = loading => {
    setLoadingContent(loading)
  }

  return (
    <LayoutContext.Provider
      value={{ loadingContent, updateLoadingContent, LayoutIframe }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export { LayoutProvider, useLayout }
