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
    getLocalStorage('access_token') || null
  )
  const [CrStocks, setCrStocks] = useState(getLocalStorage('access_stock'))
  const [StockRights, setStockRights] = useState(null)
  const [Stocks, setStocks] = useState(null)

  const saveAuth = ({ auth, token }) => {
    if (auth) {
      let newStocks = auth.Stocks
        ? auth.Stocks.filter(x => x.ParentID !== 0).map(x => ({
            Title: x.Title,
            ID: x.ID,
            value: x.ID,
            label: x.Title
          }))
        : []
      let newStocksRights = auth.StockRights
        ? auth.StockRights.map(x => ({
            Title: x.Title,
            ID: x.ID,
            value: x.ID,
            label: x.Title
          }))
        : null
      let newCrStock = null

      if (newStocksRights && newStocksRights.length > 0) {
        newCrStock =
          !CrStocks || CrStocks?.ID === 778
            ? newStocksRights[0]
            : newStocksRights.filter(x => x.ID === CrStocks.ID)[0]
      } else {
        newCrStock = {
          ...auth.Stocks[0]
        }
      }

      setStocks(newStocks)
      setStockRights(newStocksRights)
      setCrStocks(newCrStock)
      storeLocalStorage(newCrStock, 'access_stock')
      setAuth(auth)
    }
    if (token) {
      token && setAccessToken(token)
      storeLocalStorage(token, 'access_token')
    }
  }

  const saveStocks = Stock => {
    setCrStocks(Stock)
    storeLocalStorage(Stock, 'access_stock')
  }

  const logout = () => {
    setAccessToken(null)
    removeLocalStorage('access_stock')
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
        StockRights,
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
    enabled: Boolean(accessToken)
  })

  useEffect(() => {
    if (window?.top?.token) {
      saveAuth({
        auth: window?.top?.Info,
        token: window?.top?.token
      })
    } else if (!accessToken) {
      setShowSplashScreen(false)
    }

    // eslint-disable-next-line
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
}

export { AuthProvider, AuthInit, useAuth }
