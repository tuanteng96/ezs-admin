import React, { useState, useEffect } from 'react'
import { m } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Controller, useForm } from 'react-hook-form'
import { Button } from 'src/_ezs/partials/button'
import { FloatingPortal } from '@floating-ui/react'
import clsx from 'clsx'
import { Input } from 'src/_ezs/partials/forms'
import { useRoles } from 'src/_ezs/hooks/useRoles'
import { useQuery } from '@tanstack/react-query'
import InvoiceAPI from 'src/_ezs/api/invoice.api'
import ConfigAPI from 'src/_ezs/api/config'

function PickerSettings({ children, initialValues, onChange }) {
  const [visible, setVisible] = useState(false)

  const { usrmng } = useRoles(['usrmng'])

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      InvoiceTypes: [
        {
          ID: 1,
          Code: 'HDMISA',
          Title: 'Hóa đơn MISA',
          BaseUrl: 'https://api.meinvoice.vn/api/integration',
          TestUrl: 'https://testapi.meinvoice.vn/api/integration',
          SignType: 5,
          InvSeries: '1C25MCB',
          Active: true,
          INVOICE_APPID_HDMISA: '0a609eb1-c12d-4e2e-aa5d-ba4e884c8ee1',
          INVOICE_TAXCODE_HDMISA: '0101243150-286',
          INVOICE_USERNAME_HDMISA: 'testmisa@yahoo.com',
          INVOICE_PASSWORD_HDMISA: '123456Aa'
        },
        {
          ID: 2,
          Code: 'HDPAVN',
          Title: 'Hóa đơn PA Việt Nam',
          BaseUrl: 'https://cpanel.hoadon30s.vn',
          TestUrl: 'https://cphoadonuat.hoadon30s.vn',
          Active: false,
          SignType: 0,
          InvSeries: '1C25MEZ',
          INVOICE_APPID_HDPAVN: '271376a2-26b1-4812-b04a-b6da4493c4f2',
          INVOICE_SECRET_HDPAVN: 'f44f02c4fb9ce7c9db8579fd7edd94f694ce05ce'
        }
      ]
    }
  })

  const onHide = () => {
    setVisible(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onSubmit = values => {
    console.log(values)
  }

  const handleSubmitWithoutPropagation = e => {
    e.preventDefault()
    e.stopPropagation()
    handleSubmit(onSubmit)(e)
  }

  return (
    <>
      {children({
        open: () => setVisible(true)
      })}
      {visible && (
        <FloatingPortal root={document.body}>
          <form
            onSubmit={handleSubmitWithoutPropagation}
            className="fixed inset-0 flex items-center justify-center z-[1003]"
            autoComplete="off"
            onKeyDown={e => {
              if (e.key === 'Enter') e.preventDefault()
            }}
          >
            <m.div
              className="absolute inset-0 bg-black/[.2] dark:bg-black/[.4]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onHide}
            ></m.div>
            <m.div
              className="absolute flex flex-col justify-center h-full py-8 px-4 sm:px-0 w-[500px] max-w-full"
              initial={{ opacity: 0, top: '60%' }}
              animate={{ opacity: 1, top: 'auto' }}
              exit={{ opacity: 0, top: '60%' }}
            >
              <div className="flex flex-col max-h-full bg-white rounded shadow-lg dark:bg-dark-aside">
                <div className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
                  <div className="text-2xl font-bold">
                    Cài đặt hóa đơn điện tử
                  </div>
                  <div
                    className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                    onClick={onHide}
                  >
                    <XMarkIcon className="w-8" />
                  </div>
                </div>
                <div className="p-5 overflow-auto grow">
                  {/* <div className="mb-4 last:mb-0">
                    <div className="font-semibold">Tên nhân viên</div>
                    <div className="mt-1">
                      <Controller
                        name="Key"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <Input
                            placeholder="Nhập tên nhân viên"
                            value={field.value}
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </div> */}
                </div>
                <div className="flex justify-between p-5 border-t border-separator dark:border-dark-separator">
                  <div className="flex justify-end w-full">
                    <Button
                      onClick={onHide}
                      type="button"
                      className="relative flex items-center px-4 font-bold transition border border-gray-300 rounded shadow-lg dark:border-gray-700 h-11 hover:border-gray-800 focus:outline-none focus:shadow-none"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      className="relative flex items-center px-4 ml-2 font-semibold text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                    >
                      Lưu cài đặt
                    </Button>
                  </div>
                </div>
              </div>
            </m.div>
          </form>
        </FloatingPortal>
      )}
    </>
  )
}

export default PickerSettings
