import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { createContext, useContext, useState } from 'react'

const LayoutContext = createContext()

const useLayout = () => {
  return useContext(LayoutContext)
}

const LayoutProvider = ({ children }) => {
  const [loadingContent, setLoadingContent] = useState(false)
  const [LayoutIframe] = useState(window?.top?.token)
  const [GlobalConfig, setGlobalConfig] = useState(null)

  const updateLoadingContent = loading => {
    setLoadingContent(loading)
  }

  useQuery({
    queryKey: ['GlobalConfig'],
    queryFn: async () => {
      let { data } = await axios.get(
        `${
          !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
            ? process.env.REACT_APP_API_URL
            : window.location.origin
        }/brand/global/Global.json`
      )
      let { data: template } = await axios.get(
        `${
          !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
            ? process.env.REACT_APP_API_URL
            : window.location.origin
        }/AdminCp/Controls/Noti2/NotiTemplate.json`
      )
      return {
        ...data,
        ...template
      }
    },
    onSettled: data => {
      setGlobalConfig(data)
    }
  })

  return (
    <LayoutContext.Provider
      value={{
        loadingContent,
        updateLoadingContent,
        LayoutIframe,
        GlobalConfig
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export { LayoutProvider, useLayout }
