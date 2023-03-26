import { useQuery } from '@tanstack/react-query'
import { useState, useEffect, createContext, useContext } from 'react'
import AuthAPI from '../api/auth.api'
import {
  getLocalStorage,
  removeLocalStorage,
  storeLocalStorage
} from '../utils/localStorage'
import { LayoutSplashScreen } from './EzsSplashScreen'

const AuthContext = createContext()

const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null)
  const [accessToken, setAccessToken] = useState(
    getLocalStorage('access_token')
  )
  const [CrStocks, setCrStocks] = useState(null)
  const [Stocks, setStocks] = useState(null)

  const saveAuth = ({ auth, token }) => {
    if (auth) {
      let newStocks = auth.Stocks
        ? auth.Stocks.filter(x => x.ParentID !== 0).map(x => ({
            ...x,
            value: x.ID,
            label: x.Title
          }))
        : []

      setStocks(newStocks)
      setCrStocks(
        !auth.CrStockID
          ? newStocks[0]
          : newStocks.filter(x => x.CrStockID === auth.CrStockID)
      )
      setAuth(auth)
    }
    if (token) {
      token && setAccessToken(token)
      storeLocalStorage(token, 'access_token')
    }
  }

  const saveStocks = stock => {
    setCrStocks(stock)
  }

  const logout = () => {
    setAccessToken(null)
    removeLocalStorage('access_token')
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        accessToken,
        saveAuth,
        logout,
        CrStocks,
        Stocks,
        saveStocks
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const AuthInit = ({ children }) => {
  const { accessToken, logout, saveAuth } = useAuth()
  const [showSplashScreen, setShowSplashScreen] = useState(true)

  useQuery({
    queryKey: ['Auth', accessToken],
    queryFn: () => AuthAPI.tokenCheck(),
    onSuccess: ({ data }) => {
      if (data.error) {
        logout()
      } else {
        saveAuth({
          auth: data
        })
      }
      setShowSplashScreen(false)
    },
    onError: error => {
      setShowSplashScreen(false)
      logout()
    },
    enabled: !!accessToken
  })

  useEffect(() => {
    if (!accessToken) {
      setShowSplashScreen(false)
    }
    // eslint-disable-next-line
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
}

export { AuthProvider, AuthInit, useAuth }
