import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'
import InvoiceAPI from '../api/invoice.api'
import ConfigAPI from '../api/config'
import { useLocation } from 'react-router'
import { formatArray } from '../utils/formatArray'

const LayoutContext = createContext()

const useLayout = () => {
  return useContext(LayoutContext)
}

const LayoutProvider = ({ children }) => {
  let { pathname } = useLocation()

  const [loadingContent, setLoadingContent] = useState(false)
  const [LayoutIframe, setLayoutIframe] = useState(
    window?.top?.token || ['/massage/checkin', '/checkin'].includes(pathname)
  )

  const [GlobalConfig, setGlobalConfig] = useState(null)
  const [InvoiceConfig, setInvoiceConfig] = useState(null)

  useEffect(() => {
    if (['/massage/checkin', '/checkin'].includes(pathname)) {
      setLayoutIframe(true)
    }
  }, [pathname])

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
        data?.APP?.Home?.Slidernail
          ? `${
              !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
                ? process.env.REACT_APP_API_URL
                : window.location.origin
            }/AdminCp/Controls/Noti2/NotiTemplateNail.json`
          : `${
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
          name: 'Hoá đơn giá trị gia tăng máy tính tiền',
          init_invoice: 'HDGTGTMTT',
          //type_invoice: '1', // 1 hoá đơn công ty, 2 Hoá đơn hộ kinh doanh
          INVOICE_APPID_HDPAVN: '',
          INVOICE_SECRET_HDPAVN: '',
          isActive: false,
          isDemo: false
        },
        {
          ID: 3,
          Code: 'HDFAST',
          Title: 'Hóa đơn FAST',
          BaseUrl: 'https://tcservice.fast.com.vn/api/Command/Executecommand',
          TestUrl: 'https://tcservice.fast.com.vn/api/Command/Executecommand',
          SignType: 1,
          InvSeries: 'C25MGB',
          VoucherBook: '1C25MGB',
          ClientCode: '007565',
          GroupService: '005724',
          UnitCode: 'GLB',
          INVOICE_USER_HDFAST: '',
          Password: '22222223',
          isActive: false,
          isDemo: false
        },
        {
          ID: 4,
          Code: 'HDVNPTSAAS',
          Title: 'Hóa đơn VNPT SAAS',
          BaseUrl: 'https://api-hst.vnpt-invoice.com.vn',
          TestUrl: 'http://api-hst-dev.vnpt-invoice.com.vn',
          SignType: 1, // khmshdon
          InvSeries: 'C25MTA', //khhdon
          type_cert: 'HSM',
          client_id: 'fb9d9f88-1760285200410.hst.vnpt-invoice.com.vn',
          serial_number: '5401010168990b6daa14c8fdd7367ca7',
          INVOICE_USER_HDVNPTSAAS: 'tichhop',
          INVOICE_PASSWORD_HDVNPTSAAS: 'HST@Invoice2510',
          isActive: false,
          isDemo: false
        }
      ]
      if (Config?.data?.data && Config?.data?.data.length > 0) {
        let { Value } = Config?.data?.data[0]
        if (Value) {
          let newValue = JSON.parse(Value)
          newInvoiceTypes = formatArray.mergeArrays(newInvoiceTypes, newValue)
        }
      }

      if (data?.ENV) {
        newInvoiceTypes = newInvoiceTypes.map(config => {
          let obj = { ...config }

          for (const property in data?.ENV) {
            if (property.includes(config.Code)) {
              obj[property] = data?.ENV[property]
            }
            if (config.Code === 'HDMISA') {
              if (property === 'INVOICE_APPID') {
                config['INVOICE_APPID_HDMISA'] = data?.ENV['INVOICE_APPID']
              }
              if (property === 'INVOICE_TAXCODE') {
                config['INVOICE_TAXCODE_HDMISA'] = data?.ENV['INVOICE_TAXCODE']
              }
              if (property === 'INVOICE_USERNAME') {
                config['INVOICE_USERNAME_HDMISA'] =
                  data?.ENV['INVOICE_USERNAME']
              }
              if (property === 'INVOICE_PASSWORD') {
                config['INVOICE_PASSWORD_HDMISA'] =
                  data?.ENV['INVOICE_PASSWORD']
              }
            }
          }
          return obj
        })
      }

      let InvoiceActiveIndex = newInvoiceTypes.findIndex(x => x.isActive)

      let newENV = { ...data?.ENV }

      if (newENV.INVOICE_APPID) {
        delete newENV.INVOICE_APPID
      }
      if (newENV.INVOICE_TAXCODE) {
        delete newENV.INVOICE_TAXCODE
      }
      if (newENV.INVOICE_USERNAME) {
        delete newENV.INVOICE_USERNAME
      }
      if (newENV.INVOICE_PASSWORD) {
        delete newENV.INVOICE_PASSWORD
      }

      if (
        data?.ENV?.INVOICE_TAXCODE &&
        data?.ENV?.INVOICE_USERNAME &&
        data?.ENV?.INVOICE_PASSWORD &&
        data?.ENV?.INVOICE_APPID
      ) {
        await InvoiceAPI.saveENV({
          ENV: newENV
        })
      }

      return {
        ENV: newENV,
        InvoiceTypes: newInvoiceTypes,
        InvoiceActive:
          InvoiceActiveIndex > -1 ? newInvoiceTypes[InvoiceActiveIndex] : null
      }
    },
    onSuccess: data => {
      setInvoiceConfig(data)
      if (data?.InvoiceActive) {
        window.ApiInvoice = data?.InvoiceActive?.isDemo
          ? data?.InvoiceActive?.TestUrl
          : data?.InvoiceActive?.BaseUrl
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
