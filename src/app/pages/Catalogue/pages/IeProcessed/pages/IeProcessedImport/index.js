import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { LayoutGroup, m } from 'framer-motion'
import React, { useMemo } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import WarehouseAPI from 'src/_ezs/api/warehouse.api'
import { useRoles } from 'src/_ezs/hooks/useRoles'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import { Button } from 'src/_ezs/partials/button'
import { Input, InputNumber, InputTextarea } from 'src/_ezs/partials/forms'
import {
  SelectProdCode,
  SelectStocksWareHouse,
  SelectSupplier
} from 'src/_ezs/partials/select'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import { useAuth } from 'src/_ezs/core/Auth'

function IeProcessedImport(props) {
  const navigate = useNavigate()
  const { pathname, state, search } = useLocation()
  const { id } = useParams()

  const queryClient = useQueryClient()

  const { xuat_nhap_diem, xuat_nhap_ten_slg, xuat_nhap } = useRoles([
    'xuat_nhap_diem',
    'xuat_nhap_ten_slg',
    'xuat_nhap'
  ])

  const { CrStocks } = useAuth()

  const { control, handleSubmit, setValue, reset, watch } = useForm({
    defaultValues: {
      ie: {
        CreateDate: '',
        Code: '', // Mã
        SupplierID: '', //Nhà cung cấp
        ToPay: '', // Giá trị sau chiết khấu
        Total: '', // Tổng giá trị
        Type: 'N',
        Other: '', //Ghi chú
        Discount: '', //Giá trị chiết khấu
        Source: '' // Kho
      },
      items: [
        {
          ImportDiscount: '',
          ImportPrice: '',
          ImportPriceOrigin: '',
          ProdTitle: '',
          Qty: '',
          ProdCode: '',
          Unit: ''
        }
      ]
    }
  })

  const watchForm = watch()

  const { fields, remove, append, update } = useFieldArray({
    control,
    name: 'items'
  })

  const { isLoading, data } = useQuery({
    queryKey: ['ImportExportId', id],
    queryFn: async () => {
      let { data } = await WarehouseAPI.getListInventory({
        cmd: 'getie_id',
        id: id
      })
      return data?.data
    },
    onSuccess: data => {
      if (data) {
        reset({
          ie: {
            AdminEdit: true,
            CanEdit: true,
            Code: data?.Code,
            SupplierID: data?.SupplierID,
            ToPay: data?.ToPay,
            Total: data?.Total,
            Payed: data?.Payed,
            Type: data?.Type,
            Other: data?.Other || '',
            Discount: data?.Discount,
            Source: data?.Source,
            IsReceive: true,
            ReceiverID: 0,
            UserID: data?.UserID || 0,
            Target: data?.Target,
            TargetCreated: 0,
            CreateDate: data?.CreateDate || '',
            Summary: data?.Summary,
            ID: data?.ID
          },
          items:
            data.stockItems && data.stockItems.length > 0
              ? data.stockItems.map(x => ({
                  ...x,
                  ProdTitle: x.ProdTitle
                    ? {
                        label: x.ProdTitle,
                        value: x.ProdID
                      }
                    : '',
                  ProdId: x.ProdID,
                  Other: x?.Desc || ''
                }))
              : [
                  {
                    ImportDiscount: '',
                    ImportPrice: '',
                    ImportPriceOrigin: '',
                    ProdTitle: '',
                    Qty: '',
                    ProdCode: '',
                    ProdId: '',
                    Unit: '',
                    Source: ''
                  }
                ]
        })
      }
    }
  })

  const columns = useMemo(
    () => [
      {
        key: 'ProdTitle',
        title: 'Mã SP/ Tên SP',
        dataKey: 'ProdTitle',
        width: 370,
        sortable: false,
        cellRenderer: ({ rowIndex, rowData }) => (
          <div className="w-full">
            <Controller
              name={`items[${rowIndex}].ProdTitle`}
              control={control}
              rules={{ required: true }}
              render={({ field: { ref, ...field }, fieldState }) => (
                <SelectProdCode
                  className={clsx(
                    'select-control',
                    fieldState?.invalid && 'select-control-error'
                  )}
                  Params={{
                    cmd: 'prodcode',
                    includeSource: 1,
                    cate_name: 'san_pham,nvl',
                    _type: 'query'
                  }}
                  menuPosition="fixed"
                  styles={{
                    menuPortal: base => ({
                      ...base,
                      zIndex: 9999
                    })
                  }}
                  menuPortalTarget={document.body}
                  isClearable
                  value={field.value}
                  onChange={(val, triggeredAction) => {
                    field.onChange(val)
                    setValue(
                      `items[${rowIndex}].ProdCode`,
                      val ? val?.source?.DynamicID : ''
                    )
                    setValue(
                      `items[${rowIndex}].ProdId`,
                      val ? val?.source?.ID : ''
                    )
                    setValue(
                      `items[${rowIndex}].Unit`,
                      val ? val?.source?.StockUnit : ''
                    )
                    setValue(`items[${rowIndex}].Qty`, 1)
                    setValue(
                      `items[${rowIndex}].ImportPriceOrigin`,
                      val ? val?.source?.PriceProduct : ''
                    )
                    setValue(
                      `items[${rowIndex}].ImportPrice`,
                      val ? val?.source?.PriceBase : ''
                    )
                    setValue(
                      `items[${rowIndex}].ImportDiscount`,
                      val
                        ? val?.source?.PriceBase > 0 &&
                          val?.source?.PriceProduct >= val?.source?.PriceBase
                          ? val?.source?.PriceProduct - val?.source?.PriceBase
                          : 0
                        : 0
                    )
                    onUpdate()
                  }}
                />
              )}
            />
          </div>
        )
      },
      {
        key: 'ProdId',
        title: 'Mã',
        dataKey: 'ProdId',
        width: 100,
        cellRenderer: ({ rowData, rowIndex }) => (
          <Controller
            name={`items[${rowIndex}].ProdId`}
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <>{field.value}</>
            )}
          />
        ),
        sortable: false
      },
      {
        key: 'Unit',
        title: 'Đơn vị',
        dataKey: 'Unit',
        width: 100,
        cellRenderer: ({ rowData, rowIndex }) => (
          <Controller
            name={`items[${rowIndex}].Unit`}
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <>{field.value}</>
            )}
          />
        ),
        sortable: false
      },
      {
        key: 'Qty',
        title: 'SL',
        dataKey: 'Qty',
        width: 120,
        cellRenderer: ({ rowIndex }) => (
          <Controller
            name={`items[${rowIndex}].Qty`}
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <>
                <InputNumber
                  className={clsx('px-3 py-2.5')}
                  placeholder="Nhập SL"
                  value={field.value}
                  onValueChange={val => {
                    field.onChange(val.floatValue || '')
                    onUpdate()
                  }}
                  allowNegative={false}
                  isAllowed={inputObj => {
                    const { floatValue } = inputObj
                    if (floatValue < 1) return
                    return true
                  }}
                />
              </>
            )}
          />
        ),
        sortable: false
      },
      {
        key: 'ImportPriceOrigin',
        title: 'Nguyên giá',
        dataKey: 'ImportPriceOrigin',
        width: 200,
        sortable: false,
        cellRenderer: ({ rowIndex, rowData }) => (
          <Controller
            name={`items[${rowIndex}].ImportPriceOrigin`}
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <InputNumber
                allowLeadingZeros={true}
                thousandSeparator={true}
                value={field.value}
                placeholder="Nhập nguyên giá"
                onValueChange={val => {
                  const { ImportDiscount } = watchForm.items[rowIndex]
                  field.onChange(val.floatValue || '')
                  setValue(
                    `items[${rowIndex}].ImportPrice`,
                    (val?.floatValue || 0) - ImportDiscount
                  )
                  onUpdate()
                }}
              />
            )}
          />
        ),
        hidden: !xuat_nhap_diem?.hasRight
      },
      {
        key: 'ImportDiscount',
        title: 'Chiết khấu',
        dataKey: 'ImportDiscount',
        width: 200,
        sortable: false,
        cellRenderer: ({ rowData, rowIndex }) => (
          <Controller
            name={`items[${rowIndex}].ImportDiscount`}
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <div className="relative">
                <InputNumber
                  thousandSeparator={true}
                  value={field.value}
                  placeholder="Nhập chiết khấu"
                  onValueChange={val => {
                    const { ImportPriceOrigin, Qty } = watchForm.items[rowIndex]
                    field.onChange(val.floatValue || '')

                    let ImportPrice =
                      val?.floatValue > 100
                        ? ImportPriceOrigin - val?.floatValue
                        : ImportPriceOrigin -
                          (ImportPriceOrigin * val?.floatValue) / 100
                    setValue(`items[${rowIndex}].ImportPrice`, ImportPrice)
                    setValue(
                      `items[${rowIndex}].ImportTotalPrice`,
                      ImportPrice * (Qty || 0)
                    )
                    onUpdate()
                  }}
                />
                <div className="absolute w-[45px] h-full top-0 right-0 flex justify-center items-center pointer-none">
                  {field.value > 100 ? 'đ' : '%'}
                </div>
              </div>
            )}
          />
        ),
        hidden: !xuat_nhap_diem?.hasRight
      },
      {
        key: 'ImportPrice',
        title: 'Đơn giá',
        dataKey: 'ImportPrice',
        cellRenderer: ({ rowData, rowIndex }) => (
          <Controller
            name={`items[${rowIndex}].ImportPrice`}
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <InputNumber
                thousandSeparator={true}
                value={field.value}
                placeholder="Nhập đơn giá"
                onValueChange={val => {
                  const { ImportPriceOrigin } = watchForm.items[rowIndex]
                  setValue(
                    `items[${rowIndex}].ImportDiscount`,
                    ImportPriceOrigin - (val.floatValue || 0)
                  )
                  field.onChange(val.floatValue || '')
                  onUpdate()
                }}
              />
            )}
          />
        ),
        width: 200,
        sortable: false,
        hidden: !xuat_nhap_diem?.hasRight
      },
      {
        key: 'Other',
        title: 'Ghi chú',
        dataKey: 'Other',
        cellRenderer: ({ rowData, rowIndex }) => (
          <Controller
            name={`items[${rowIndex}].Other`}
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <Input
                wrapClass="w-full"
                placeholder="Nhập ghi chú"
                autoComplete="off"
                type="text"
                {...field}
              />
            )}
          />
        ),
        width: 350,
        sortable: false
      },
      {
        key: '#',
        title: '#',
        dataKey: '#',
        cellRenderer: ({ rowIndex }) => (
          <>
            <div
              className="px-2 h-8 flex items-center text-[13px] text-white rounded cursor-pointer bg-success hover:bg-successhv"
              onClick={() =>
                append({
                  ImportDiscount: '',
                  ImportPrice: '',
                  ImportPriceOrigin: '',
                  ProdTitle: '',
                  Qty: '',
                  ProdCode: '',
                  ProdId: '',
                  Unit: ''
                })
              }
            >
              <PlusIcon className="w-5" />
            </div>
            <div
              className="px-2 h-8 flex items-center text-[13px] text-white rounded cursor-pointer bg-danger hover:bg-dangerhv ml-1"
              onClick={() => {
                if (watchForm?.items.length > 1) {
                  remove(rowIndex)
                } else {
                  update(rowIndex, {
                    ImportDiscount: '',
                    ImportPrice: '',
                    ImportPriceOrigin: '',
                    ProdTitle: '',
                    Qty: '',
                    ProdCode: '',
                    ProdId: '',
                    Unit: ''
                  })
                }
              }}
            >
              <TrashIcon className="w-5" />
            </div>
          </>
        ),
        width: 110,
        sortable: false,
        align: 'center',
        frozen: 'right'
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields, watchForm?.items]
  )

  const onUpdate = () => {
    const total = watchForm?.items.reduce(
      (n, { ImportPrice, Qty }) => n + ImportPrice * Qty,
      0
    )
    const ToPay =
      watchForm?.ie?.Discount > 100
        ? total - watchForm?.ie?.Discount
        : total - (total * watchForm?.ie?.Discount) / 100
    setValue('ie.Total', total)
    setValue('ie.ToPay', ToPay)
  }

  const updateMutation = useMutation({
    mutationFn: async body => {
      let receives = await WarehouseAPI.getReceiveStock({
        StockID: CrStocks?.ID,
        IsAllStock:
          xuat_nhap.IsStocks ||
          (xuat_nhap_diem.IsStocks && xuat_nhap_ten_slg.IsStocks)
      })

      let rs = {
        error: 'Đơn đã được nhận hoặc không tồn tại.'
      }

      if (receives?.data?.lst && receives?.data?.lst.length > 0) {
        let index = receives?.data?.lst.findIndex(x => x.ie.ID === body.ie.ID)
        if (index > -1) {
          rs = await WarehouseAPI.updateImportExport(body)
        }
      }

      await Promise.all([
        queryClient.invalidateQueries(['ListIEProcessed']),
        queryClient.invalidateQueries(['ReceiveStock'])
      ])

      return rs
    }
  })

  const onSubmit = values => {
    updateMutation.mutate(
      {
        ...values,
        ie: {
          ...values.ie,
          stockItems: values.items.map(x => ({
            ...x,
            ProdTitle: x.ProdTitle.text,
            Desc: x?.Other || ''
          }))
        },
        items: values.items.map(x => ({
          ...x,
          ProdTitle: x.ProdTitle.text,
          Desc: x?.Other || ''
        })),
        receive: true
      },
      {
        onSuccess: data => {
          if (data?.data?.data) {
            toast.success('Thêm mới thành công.')
          } else {
            toast.error(data?.data?.error || data.error)
          }
          navigate({
            pathname: state?.prevFrom || '/catalogue/ie-processed',
            search: search
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
                pathname: state?.prevFrom || '/catalogue/ie-processed',
                search: search
              })
            }
          ></div>
        </m.div>
        <m.div
          className="absolute top-0 right-0 z-10 w-full h-full max-w-full bg-white dark:bg-dark-aside"
          initial={{ x: '100%' }}
          transition={{
            transform: { ease: 'linear' }
          }}
          animate={{ x: '0' }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-4 border-b lg:px-6 border-separator dark:border-dark-separator">
              <div className="w-10/12 text-xl font-bold truncate lg:text-2xl dark:text-graydark-800">
                Đơn nhập kho mới
              </div>
              <div
                className="flex items-center justify-center w-10 h-10 transition cursor-pointer lg:w-12 lg:h-12 dark:text-graydark-800 hover:text-primary"
                onClick={() => {
                  navigate({
                    pathname: state?.prevFrom || '/catalogue/ie-processed',
                    search: search
                  })
                }}
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
              <ReactBaseTable
                wrapClassName="p-4 lg:p-6 grow bg-white dark:bg-dark-app rounded h-[70vh] md:h-auto"
                rowKey="id"
                columns={columns}
                data={fields}
                estimatedRowHeight={50}
                onEndReachedThreshold={1}
              />
              <div className="w-full md:w-[320px] lg:w-[380px] border-l border-separator flex flex-col">
                <div className="p-4 overflow-auto lg:p-6 grow scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded">
                  <div>
                    <div className="mb-3.5">
                      <div className="font-medium">Ngày tạo</div>
                      <div className="mt-1">
                        <Controller
                          name="ie.CreateDate"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <InputDatePicker
                              placeholderText="Chọn thời gian"
                              autoComplete="off"
                              onChange={field.onChange}
                              selected={
                                field.value ? new Date(field.value) : null
                              }
                              {...field}
                              dateFormat="dd/MM/yyyy"
                            />
                          )}
                        />
                      </div>
                    </div>
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
                      <div className="font-medium">Chuyển từ</div>
                      <div className="mt-1">
                        <SelectStocksWareHouse
                          isDisabled
                          value={data?.Source}
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
                      </div>
                    </div>
                    <div className="mb-3.5">
                      <div className="font-medium">Đến kho</div>
                      <div className="mt-1">
                        <Controller
                          name="ie.Target"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <SelectStocksWareHouse
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
                    <div>
                      <div className="font-medium">Nhà cung cấp, đại lý</div>
                      <div className="mt-1">
                        <Controller
                          name="ie.SupplierID"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <SelectSupplier
                              isClearable
                              className="select-control mb-8px"
                              value={field.value}
                              onChange={val => field.onChange(val?.value || '')}
                              menuPortalTarget={document.body}
                              menuPosition="fixed"
                              styles={{
                                menuPortal: base => ({
                                  ...base,
                                  zIndex: 9999
                                })
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-separator">
                    {xuat_nhap_diem?.hasRight && (
                      <>
                        <div className="mb-3.5">
                          <div className="font-semibold">Tổng tiền</div>
                          <div className="mt-1">
                            <Controller
                              name="ie.Total"
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
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div className="mb-3.5">
                          <div className="font-semibold">Chiết khấu cả đơn</div>
                          <div className="mt-1">
                            <Controller
                              name="ie.Discount"
                              control={control}
                              render={({
                                field: { ref, ...field },
                                fieldState
                              }) => (
                                <div className="relative">
                                  <InputNumber
                                    thousandSeparator={true}
                                    value={field.value}
                                    placeholder="Nhập số tiền"
                                    onValueChange={val => {
                                      field.onChange(val.floatValue || '')
                                      setValue(
                                        'ie.ToPay',
                                        val.floatValue > 100
                                          ? watchForm?.ie?.Total -
                                              val.floatValue
                                          : watchForm?.ie?.Total -
                                              (val.floatValue *
                                                watchForm?.ie?.Total) /
                                                100
                                      )
                                    }}
                                  />
                                  <div className="absolute w-[45px] h-full top-0 right-0 flex justify-center items-center pointer-none">
                                    {field.value > 100 ? 'đ' : '%'}
                                  </div>
                                </div>
                              )}
                            />
                          </div>
                        </div>
                        <div className="mb-3.5">
                          <div className="font-semibold">Tổng</div>
                          <div className="mt-1">
                            <Controller
                              name="ie.ToPay"
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
                                />
                              )}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    <div>
                      <div className="font-semibold">Ghi chú</div>
                      <div className="mt-1">
                        <Controller
                          name="ie.Other"
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
                  </div>
                </div>
                <div className="px-4 py-4 border-t lg:px-6 border-separator">
                  <Button
                    disabled={updateMutation.isLoading}
                    loading={updateMutation.isLoading}
                    type="submit"
                    className="relative flex items-center justify-center w-full h-12 px-4 text-white transition rounded shadow-lg bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70"
                  >
                    Tạo mới
                  </Button>
                </div>
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

export default IeProcessedImport
