import { Tab } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { LayoutGroup, m } from 'framer-motion'
import moment from 'moment'
import React from 'react'
import { Fragment } from 'react'
import { useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'
import WarehouseAPI from 'src/_ezs/api/warehouse.api'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import { Button } from 'src/_ezs/partials/button'
import { Input, InputNumber, InputTextarea } from 'src/_ezs/partials/forms'
import { SelectPaymentMethods, SelectStocks } from 'src/_ezs/partials/select'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { formatString } from 'src/_ezs/utils/formatString'

function WareHouseToPay(props) {
  const navigate = useNavigate()
  const { pathname, state, search } = useLocation()
  const { id } = useParams()

  const [selectedIndex, setSelectedIndex] = useState(0)

  const queryClient = useQueryClient()

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      ie: {
        Code: '', // Mã
        SupplierID: '', //Nhà cung cấp
        ToPay: '', // Giá trị sau chiết khấu
        Total: '', // Tổng giá trị
        Type: 'N',
        Other: '', //Ghi chú
        Discount: '', //Giá trị chiết khấu
        Source: '' // Kho
      },
      cash: {
        Value: '',
        MethodID: 1,
        Source: 'ImportExportPayed',
        SourceID: '',
        StockID: '',
        Desc: '',
        _Tag: ''
      },
      items: [],
      cashs: []
    }
  })

  const { fields: fieldsCash } = useFieldArray({
    control,
    name: 'cashs'
  })

  const { fields } = useFieldArray({
    control,
    name: 'items'
  })

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['ImportExportTypayId', id],
    queryFn: async () => {
      let { data } = await WarehouseAPI.getToPayId({
        Id: id
      })
      return data
    },
    onSuccess: data => {
      if (data) {
        reset({
          ie: {
            ID: data?.ID || 0,
            Code: data?.ie?.Code,
            SupplierID: data?.ie?.SupplierID,
            ToPay: data?.ie?.ToPay,
            Total: data?.ie?.Total,
            Payed: Math.abs(data?.ie?.Payed),
            Type: data?.ie?.Type,
            Other: data?.ie?.Other || '',
            Discount: data?.ie?.Discount,
            Source: data?.ie?.Source
          },
          cash: {
            Value: data?.ie?.ToPay - Math.abs(data?.ie?.Payed),
            MethodID: 1,
            Source: 'ImportExportPayed',
            SourceID: data?.ie?.ID,
            StockID: data?.ie?.Source,
            Desc: '',
            _Tag: data?.ie?.Type === 'X' ? '(THU)' : '(CHI)'
          },
          cashs: data?.cashs || [],
          items: data.items || []
        })
      }
    }
  })

  const watchForm = watch()

  const updateMutation = useMutation({
    mutationFn: body => WarehouseAPI.whousePay(body)
  })

  const onSubmit = values => {
    updateMutation.mutate(
      {
        cash: {
          ...values.cash,
          Value:
            values.cash['_Tag'] === '(CHI)'
              ? -Math.abs(values.cash.Value)
              : values.cash.Value
        }
      },
      {
        onSuccess: data => {
          queryClient
            .invalidateQueries({ queryKey: ['ListImportExport'] })
            .then(() => {
              refetch().then(() => toast.success('Thanh toán thành công.'))
            })
        }
      }
    )
  }

  return (
    <LayoutGroup key={pathname}>
      <div className="fixed w-full h-full z-[1002] top-0 left-0">
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div
            className="absolute w-full h-full top-0 left bg-black/[.2] dark:bg-black/[.4]"
            onClick={() =>
              navigate({
                pathname: state?.prevFrom,
                search: search
              })
            }
          ></div>
        </m.div>
        <m.div
          className="absolute top-0 right-0 z-10 w-full h-full bg-white dark:bg-dark-aside max-w-6xl"
          initial={{ x: '100%' }}
          transition={{
            transform: { ease: 'linear' }
          }}
          animate={{ x: '0' }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-separator dark:border-dark-separator">
              <div className="text-xl lg:text-2xl font-bold dark:text-graydark-800 truncate w-10/12">
                Thanh toán cho đơn
                <span className="pl-1.5">
                  {watchForm?.ie.Type === 'N' ? 'nhập' : 'xuất'}
                </span>
              </div>
              <div
                className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 transition cursor-pointer dark:text-graydark-800 hover:text-primary"
                onClick={() =>
                  navigate({
                    pathname: state?.prevFrom,
                    search: search
                  })
                }
              >
                <XMarkIcon className="w-7 lg:w-9" />
              </div>
            </div>
            <form
              className="md:flex md:h-[calc(100%-81px)] relative overflow-auto md:overflow-hidden"
              onSubmit={handleSubmit(onSubmit)}
              onKeyDown={e => {
                if (e.key === 'Enter') e.preventDefault()
              }}
            >
              <div className="h-full flex flex-col grow">
                <Tab.Group
                  selectedIndex={selectedIndex}
                  onChange={setSelectedIndex}
                >
                  <div className="lg:px-6 lg:pt-6 pt-4 px-4">
                    <Tab.List className="rounded inline-flex">
                      <Tab as={Fragment}>
                        {({ selected }) => (
                          <button
                            className={clsx(
                              'px-4 py-3 text-sm font-medium text-gray-900 border border-r-0 border-gray-200 rounded-l hover:bg-primary hover:text-white transition',
                              selected && 'bg-primary text-white'
                            )}
                          >
                            Lịch sử thanh toán
                          </button>
                        )}
                      </Tab>
                      <Tab as={Fragment}>
                        {({ selected }) => (
                          <button
                            className={clsx(
                              'px-4 py-3 text-sm font-medium text-gray-900 border border-gray-200 rounded-r hover:bg-primary hover:text-white transition',
                              selected && 'bg-primary text-white'
                            )}
                          >
                            Danh sách sản phẩm
                          </button>
                        )}
                      </Tab>
                    </Tab.List>
                  </div>
                  <Tab.Panels className="grow">
                    <Tab.Panel className="h-full">
                      <ReactBaseTable
                        wrapClassName="p-4 lg:p-6 h-full bg-white dark:bg-dark-app rounded"
                        rowKey="id"
                        columns={[
                          {
                            key: 'ID',
                            title: 'STT',
                            dataKey: 'ID',
                            width: 60,
                            sortable: false,
                            align: 'center',
                            cellRenderer: ({ rowIndex }) => rowIndex + 1
                          },
                          {
                            key: 'CreateDate',
                            title: 'Ngày',
                            dataKey: 'CreateDate',
                            width: 200,
                            sortable: false,
                            cellRenderer: ({ rowData }) =>
                              moment(rowData.CreateDate).format(
                                'HH:mm DD-MM-YYYY'
                              )
                          },
                          {
                            key: 'Value',
                            title: 'Giá trị',
                            dataKey: 'Value',
                            width: 200,
                            sortable: false,
                            cellRenderer: ({ rowData }) =>
                              formatString.formatVNDPositive(rowData.Value)
                          },
                          {
                            key: 'Desc',
                            title: 'Ghi chú',
                            dataKey: 'Desc',
                            width: 260,
                            sortable: false
                          }
                        ]}
                        data={fieldsCash}
                        estimatedRowHeight={50}
                        onEndReachedThreshold={1}
                      />
                    </Tab.Panel>
                    <Tab.Panel className="h-full">
                      <ReactBaseTable
                        wrapClassName="p-4 lg:p-6 h-full bg-white dark:bg-dark-app rounded"
                        rowKey="id"
                        columns={[
                          {
                            key: 'ID',
                            title: 'STT',
                            dataKey: 'ID',
                            width: 60,
                            sortable: false,
                            align: 'center',
                            cellRenderer: ({ rowIndex }) => rowIndex + 1
                          },
                          {
                            key: 'Title',
                            title: 'Sản phẩm',
                            dataKey: 'Title',
                            width: 300,
                            sortable: false
                          },
                          {
                            key: 'ImportPrice',
                            title: 'Đơn giá nhập',
                            dataKey: 'ImportPrice',
                            width: 210,
                            sortable: false,
                            cellRenderer: ({ rowData }) =>
                              formatString.formatVND(rowData.ImportPrice)
                          },
                          {
                            key: 'Qty',
                            title: 'Số lượng',
                            dataKey: 'Qty',
                            width: 150,
                            sortable: false
                          }
                        ]}
                        data={fields}
                        estimatedRowHeight={50}
                        onEndReachedThreshold={1}
                      />
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
              <div className="w-full md:w-[320px] lg:w-[380px] border-l border-separator flex flex-col">
                <div className="p-4 lg:p-6 overflow-auto grow scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded">
                  <div>
                    <div className="mb-3.5">
                      <div className="font-medium">Mã đơn</div>
                      <div className="mt-1">
                        <Controller
                          name="ie.Code"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <Input
                              disabled
                              placeholder="Nhập mã đơn"
                              autoComplete="off"
                              type="text"
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="mb-3.5">
                      <div className="font-medium">Cơ sở</div>
                      <div className="mt-1">
                        <Controller
                          name="cash.StockID"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <SelectStocks
                              isDisabled
                              value={field.value}
                              onChange={val => field.onChange(val?.value || '')}
                              className="select-control"
                              menuPosition="fixed"
                              styles={{
                                menuPortal: base => ({
                                  ...base,
                                  zIndex: 9999
                                })
                              }}
                              menuPortalTarget={document.body}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="mb-3.5">
                      <div className="font-medium">Giá trị đơn</div>
                      <div className="mt-1">
                        <Controller
                          name="ie.ToPay"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <InputNumber
                              disabled
                              thousandSeparator={true}
                              value={field.value}
                              placeholder="Nhập số tiền"
                              onValueChange={val =>
                                field.onChange(val.floatValue || '')
                              }
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="mb-3.5">
                      <div className="font-medium">Đã thanh toán</div>
                      <div className="mt-1">
                        <Controller
                          name="ie.Payed"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <InputNumber
                              disabled
                              thousandSeparator={true}
                              value={field.value}
                              placeholder="Nhập số tiền"
                              onValueChange={val =>
                                field.onChange(val.floatValue || '')
                              }
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="mb-3.5">
                      <div className="font-medium">Còn lại</div>
                      <div className="mt-1">
                        <InputNumber
                          disabled
                          thousandSeparator={true}
                          value={
                            data ? data.ie.ToPay - Math.abs(data.ie.Payed) : 0
                          }
                          placeholder="Nhập số tiền"
                        />
                      </div>
                    </div>
                    {data && data.ie.ToPay - Math.abs(data.ie.Payed) !== 0 && (
                      <>
                        <div className="h-12 flex justify-center items-center mb-1">
                          <div className="uppercase font-bold pr-3 text-primary">
                            Thanh toán
                          </div>
                          <div className="bg-[#F4F4F4] flex-1 h-[1px]"></div>
                        </div>
                        <div className="mb-3.5">
                          <div className="font-medium">Số tiền thanh toán</div>
                          <div className="mt-1">
                            <Controller
                              name="cash.Value"
                              control={control}
                              render={({
                                field: { ref, ...field },
                                fieldState
                              }) => (
                                <InputNumber
                                  thousandSeparator={true}
                                  value={field.value}
                                  placeholder="Nhập số tiền"
                                  onValueChange={val =>
                                    field.onChange(val.floatValue || '')
                                  }
                                  isAllowed={values => {
                                    const { floatValue } = values
                                    return (
                                      floatValue >= 0 &&
                                      floatValue <=
                                        watchForm?.ie?.ToPay -
                                          Math.abs(watchForm?.ie?.Payed)
                                    )
                                  }}
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div className="mb-3.5">
                          <div className="font-medium">
                            Phương thức thanh toán
                          </div>
                          <div className="mt-1">
                            <Controller
                              name="cash.MethodID"
                              control={control}
                              render={({
                                field: { ref, ...field },
                                fieldState
                              }) => (
                                <SelectPaymentMethods
                                  value={field.value}
                                  onChange={val =>
                                    field.onChange(val?.value || '')
                                  }
                                  className="select-control"
                                  menuPosition="fixed"
                                  styles={{
                                    menuPortal: base => ({
                                      ...base,
                                      zIndex: 9999
                                    })
                                  }}
                                  menuPortalTarget={document.body}
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">Ghi chú</div>
                          <div className="mt-1">
                            <Controller
                              name="cash.Desc"
                              control={control}
                              render={({
                                field: { ref, ...field },
                                fieldState
                              }) => (
                                <InputTextarea
                                  placeholder="Nhập nội dung"
                                  value={field.value}
                                  onChange={field.onChange}
                                  rows={3}
                                  {...field}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {data && data.ie.ToPay - Math.abs(data.ie.Payed) !== 0 && (
                  <div className="px-4 lg:px-6 py-4 border-t border-separator">
                    <Button
                      disabled={updateMutation.isLoading}
                      loading={updateMutation.isLoading}
                      type="submit"
                      className="relative flex items-center justify-center w-full h-12 px-4 text-white transition rounded shadow-lg bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70"
                    >
                      Thực hiện thanh toán
                    </Button>
                  </div>
                )}
              </div>
              <LoadingComponentFull
                bgClassName="bg-white dark:bg-dark-aside z-[10]"
                loading={isLoading}
              />
            </form>
          </div>
        </m.div>
      </div>
    </LayoutGroup>
  )
}

export default WareHouseToPay
