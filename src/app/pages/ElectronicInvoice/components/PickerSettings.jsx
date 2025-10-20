import React, { useState, useEffect, Fragment } from 'react'
import { m } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Button } from 'src/_ezs/partials/button'
import { FloatingPortal } from '@floating-ui/react'
import clsx from 'clsx'
import { Input } from 'src/_ezs/partials/forms'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import InvoiceAPI from 'src/_ezs/api/invoice.api'
import ConfigAPI from 'src/_ezs/api/config'
import { useLayout } from 'src/_ezs/layout/LayoutProvider'
import { Switch } from '@headlessui/react'
import { toast } from 'react-toastify'
// import Select from 'react-select'

// let OptionTypeInvoice = [
//   {
//     label: 'Hoá đơn công ty',
//     value: '1'
//   },
//   {
//     label: 'Hoá đơn hộ kinh doanh',
//     value: '2'
//   }
// ]

function PickerSettings({ children, initialValues, onChange }) {
  const queryClient = useQueryClient()

  const [visible, setVisible] = useState(false)

  let { InvoiceConfig } = useLayout()

  useEffect(() => {
    reset({
      InvoiceTypes: InvoiceConfig?.InvoiceTypes || []
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [InvoiceConfig, visible])

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
          isActive: true,
          isDemo: false,
          INVOICE_APPID_HDMISA: '',
          INVOICE_TAXCODE_HDMISA: '',
          INVOICE_USERNAME_HDMISA: '',
          INVOICE_PASSWORD_HDMISA: ''
        },
        {
          ID: 2,
          Code: 'HDPAVN',
          Title: 'Hóa đơn PA Việt Nam',
          BaseUrl: 'https://cpanel.hoadon30s.vn',
          TestUrl: 'https://cphoadonuat.hoadon30s.vn',
          isActive: false,
          isDemo: false,
          SignType: 0,
          InvSeries: '1C25MEZ',
          name: 'Hoá đơn giá trị gia tăng máy tính tiền',
          init_invoice: 'HDGTGTMTT',
          //type_invoice: '1', // 1 hoá đơn công ty, 2 Hoá đơn hộ kinh doanh
          INVOICE_APPID_HDPAVN: '',
          INVOICE_SECRET_HDPAVN: ''
        }
      ]
    }
  })

  const { fields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'InvoiceTypes' // unique name for your Field Array
  })

  const onHide = () => {
    setVisible(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const updateMutation = useMutation({
    mutationFn: async body => {
      let rs1 = await ConfigAPI.saveName({
        name: 'hoadonconfig',
        body: JSON.stringify(body.Configs)
      })
      let rs2 = await InvoiceAPI.saveENV(body.ENV)
      await queryClient.invalidateQueries({ queryKey: ['InvoiceConfigENV'] })
      return {
        Config: rs1,
        ENV: rs2
      }
    }
  })

  const onSubmit = values => {
    let newInvoiceTypes = [...values.InvoiceTypes]
    let newENV = {
      ...InvoiceConfig.ENV
    }

    newInvoiceTypes = newInvoiceTypes.map(x => {
      let obj = { ...x }
      for (const property in obj) {
        if (property.includes('INVOICE_')) {
          newENV[property] = obj[property]
          delete obj[property]
        }
      }
      return obj
    })

    updateMutation.mutate(
      {
        ENV: {
          ENV: newENV
        },
        Configs: newInvoiceTypes
      },
      {
        onSuccess: data => {
          toast.success('Cập nhật thành công.')
          onHide()
        }
      }
    )
  }

  const handleSubmitWithoutPropagation = e => {
    e.preventDefault()
    e.stopPropagation()
    handleSubmit(onSubmit)(e)
  }

  const transferKey = text => {
    if (text.includes('INVOICE_SECRET')) {
      return 'Client Secret'
    } else if (text.includes('INVOICE_USERNAME')) {
      return 'Tài khoản'
    } else if (text.includes('INVOICE_PASSWORD')) {
      return 'Mật khẩu'
    } else if (text === 'INVOICE_APPID_HDMISA') {
      return 'APP ID'
    } else if (text === 'INVOICE_TAXCODE_HDMISA') {
      return 'Taxcode'
    } else if (text.includes('INVOICE_APPID_HDPAVN')) {
      return 'Client ID'
    } else if (text === 'InvSeries') {
      return 'Ký hiệu'
    } else if (text === 'isActive') {
      return 'Hoạt động'
    } else if (text === 'isDemo') {
      return 'Môi trường thử nghiệm'
    } else if (text === 'SignType') {
      return 'Loại xuất hóa đơn'
    } else if (text === 'init_invoice') {
      return 'Mã khởi tạo (INIT INVOICE)'
    } else if (text === 'name') {
      return 'Tên hóa đơn (NAME)'
    } else if (text === 'type_invoice') {
      return 'Loại hoá đơn'
    }
    return text
  }

  let { InvoiceTypes } = watch()

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
                  {fields.map((field, index) => (
                    <div
                      className="mb-4 overflow-hidden border rounded border-separator last:mb-0"
                      key={field.id}
                    >
                      <div className="flex items-center justify-between px-5 py-3 bg-gray-200">
                        <div className="font-semibold uppercase">
                          {field.Title}
                        </div>
                        <div>
                          <Switch
                            checked={field.isActive}
                            onChange={val => {
                              reset({
                                InvoiceTypes: InvoiceTypes.map(x => ({
                                  ...x,
                                  isActive: x.Code === field.Code ? val : false
                                }))
                              })
                            }}
                            as={Fragment}
                          >
                            {({ checked }) => (
                              <button
                                className={clsx(
                                  'relative inline-flex h-6 w-11 items-center rounded-full transition shadow-lg',
                                  checked ? 'bg-primary' : 'bg-gray-300'
                                )}
                              >
                                <span className="sr-only">
                                  Enable notifications
                                </span>
                                <span
                                  className={clsx(
                                    'inline-block h-4 w-4 transform rounded-full bg-white transition',
                                    checked ? 'translate-x-6' : 'translate-x-1'
                                  )}
                                />
                              </button>
                            )}
                          </Switch>
                        </div>
                      </div>
                      {field.isActive && (
                        <div className="p-5">
                          {[
                            ...[...Object.keys(field)].filter(
                              keyName =>
                                keyName !== 'isActive' &&
                                keyName !== 'isDemo' &&
                                keyName !== 'Title' &&
                                keyName !== 'id' &&
                                keyName !== 'ID' &&
                                keyName !== 'Code' &&
                                keyName !== 'BaseUrl' &&
                                keyName !== 'TestUrl' &&
                                keyName !== 'isActive' &&
                                keyName !== 'type_invoice'
                            ),
                            'isDemo'
                          ].map((keyName, i) => (
                            <div className="mb-4 last:mb-0" key={i}>
                              {keyName !== 'isActive' &&
                                keyName !== 'isDemo' && (
                                  <div className="mb-1 text-[14px]">
                                    {transferKey(keyName)}
                                  </div>
                                )}

                              <div>
                                <Controller
                                  name={`InvoiceTypes[${index}][${keyName}]`}
                                  control={control}
                                  render={({
                                    field: { ref, ...field },
                                    fieldState
                                  }) => (
                                    <>
                                      {typeof field.value == 'boolean' ? (
                                        <div className="flex items-center">
                                          <Switch
                                            checked={field.value}
                                            onChange={field.onChange}
                                            as={Fragment}
                                          >
                                            {({ checked }) => (
                                              <button
                                                className={clsx(
                                                  'relative inline-flex h-6 w-11 items-center rounded-full transition shadow-lg',
                                                  checked
                                                    ? 'bg-primary'
                                                    : 'bg-gray-300'
                                                )}
                                              >
                                                <span className="sr-only">
                                                  Enable notifications
                                                </span>
                                                <span
                                                  className={clsx(
                                                    'inline-block h-4 w-4 transform rounded-full bg-white transition',
                                                    checked
                                                      ? 'translate-x-6'
                                                      : 'translate-x-1'
                                                  )}
                                                />
                                              </button>
                                            )}
                                          </Switch>
                                          <div className="ml-3 text-[14px]">
                                            {transferKey(keyName)}
                                          </div>
                                        </div>
                                      ) : (
                                        <div>
                                          <Input
                                            type={
                                              [
                                                'INVOICE_USERNAME_HDMISA',
                                                'INVOICE_PASSWORD_HDMISA',
                                                'INVOICE_SECRET_HDPAVN'
                                              ].includes(keyName)
                                                ? 'password'
                                                : 'text'
                                            }
                                            placeholder="Nhập giá trị"
                                            value={field.value}
                                            {...field}
                                          />
                                          {keyName === 'init_invoice' && (
                                            <div className="mt-1.5 text-[13px] text-gray-500">
                                              HDGTGTMTT (Công ty), HDBHMTT (Hộ
                                              kinh doanh)
                                            </div>
                                          )}
                                          {keyName === 'name' && (
                                            <div className="mt-1.5 text-[13px] text-gray-500">
                                              Hoá đơn giá trị gia tăng máy tính
                                              tiền (Công ty), Hoá đơn bán hàng
                                              máy tính tiền (Hộ kinh doanh)
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </>
                                  )}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
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
                      loading={updateMutation.isLoading}
                      disabled={updateMutation.isLoading}
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
