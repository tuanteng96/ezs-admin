import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { createContext, useContext, useState } from 'react'
import InvoiceAPI from '../api/invoice.api'
import ConfigAPI from '../api/config'

const LayoutContext = createContext()

const useLayout = () => {
  return useContext(LayoutContext)
}

const LayoutProvider = ({ children }) => {
  const [loadingContent, setLoadingContent] = useState(false)
  const [LayoutIframe] = useState(window?.top?.token)
  const [GlobalConfig, setGlobalConfig] = useState(null)
  const [InvoiceConfig, setInvoiceConfig] = useState(null)

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
        }/brand/global/Global.json?` + new Date().getTime()
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
    onSuccess: data => {
      setGlobalConfig(data)
    }
  })

  useQuery({
    queryKey: ['InvoiceConfigENV'],
    queryFn: async () => {
      let { data } = await InvoiceAPI.getENV()
      let Config = await ConfigAPI.getName('hoadonconfig')

      let newInvoiceTypes = [
        {
          ID: 1,
          Code: 'HDMISA',
          Title: 'Hóa đơn MISA',
          BaseUrl: 'https://api.meinvoice.vn/api/integration',
          TestUrl: 'https://testapi.meinvoice.vn/api/integration',
          SignType: 5,
          InvSeries: '1C25MCB',
          INVOICE_APPID_HDMISA: '',
          INVOICE_TAXCODE_HDMISA: '',
          INVOICE_USERNAME_HDMISA: '',
          INVOICE_PASSWORD_HDMISA: '',
          isActive: true,
          isDemo: false
        },
        {
          ID: 2,
          Code: 'HDPAVN',
          Title: 'Hóa đơn PA Việt Nam',
          BaseUrl: 'https://cpanel.hoadon30s.vn',
          TestUrl: 'https://cphoadonuat.hoadon30s.vn',
          SignType: 0,
          InvSeries: '1C25MEZ',
          INVOICE_APPID_HDPAVN: '',
          INVOICE_SECRET_HDPAVN: '',
          isActive: false,
          isDemo: false
        }
      ]
      if (Config?.data?.data && Config?.data?.data.length > 0) {
        let { Value } = Config?.data?.data[0]
        if (Value) {
          newInvoiceTypes = JSON.parse(Value)
        }
      }
      if (data?.ENV) {
        newInvoiceTypes = newInvoiceTypes.map(config => {
          let obj = { ...config }
          for (const property in data?.ENV) {
            if (property.includes(config.Code)) {
              obj[property] = data?.ENV[property]
            }
          }
          return obj
        })
      }
      let InvoiceActiveIndex = newInvoiceTypes.findIndex(x => x.isActive)
      return {
        ENV: data?.ENV,
        InvoiceTypes: newInvoiceTypes,
        InvoiceActive:
          InvoiceActiveIndex > -1 ? newInvoiceTypes[InvoiceActiveIndex] : null
      }
    },
    onSuccess: data => {
      setInvoiceConfig(data)

      if (data) {
        window.ApiInvoice =
          !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
            ? data?.InvoiceActive?.TestUrl
            : data?.InvoiceActive?.BaseUrlUrl
      }
    }
  })

  return (
    <LayoutContext.Provider
      value={{
        loadingContent,
        updateLoadingContent,
        LayoutIframe,
        GlobalConfig,
        InvoiceConfig
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export { LayoutProvider, useLayout }
