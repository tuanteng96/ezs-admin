/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { LayoutGroup, m } from 'framer-motion'
import moment from 'moment'
import React, { useEffect, useMemo, useRef } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import WarehouseAPI from 'src/_ezs/api/warehouse.api'
import { useRoles } from 'src/_ezs/hooks/useRoles'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import { Button } from 'src/_ezs/partials/button'
import { DropdownMenu } from 'src/_ezs/partials/dropdown'
import { Input, InputNumber, InputTextarea } from 'src/_ezs/partials/forms'
import {
  SelectProdCode,
  SelectStocksWareHouse,
  SelectSupplier
} from 'src/_ezs/partials/select'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { ConversionTools } from '../../components'
import UploadsAPI from 'src/_ezs/api/uploads.api'
import ExcelHepers from 'src/_ezs/utils/ExcelHepers'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import Tooltip from 'rc-tooltip'
import Swal from 'sweetalert2'
import { useCatalogue } from 'src/app/pages/Catalogue/CatalogueLayout'
import { useLayout } from 'src/_ezs/layout/LayoutProvider'
import { useAuth } from 'src/_ezs/core/Auth'

function WareHouseImport(props) {
  const navigate = useNavigate()
  const { pathname, state, search } = useLocation()

  const { CrStocks } = useAuth()
  const { GlobalConfig } = useLayout()

  const { id } = useParams()
  const { xuat_nhap_diem, xuat_nhap_ten_slg, adminTools_byStock } = useRoles([
    'xuat_nhap_diem',
    'xuat_nhap_ten_slg',
    'adminTools_byStock'
  ])
  const { hasWarehouse } = useCatalogue()
  
  const queryClient = useQueryClient()

  const { control, handleSubmit, setValue, reset, watch } = useForm({
    defaultValues: {
      ie: {
        CreateDate: new Date(),
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
          Qty: 1,
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
        id: id || 'typeN'
      })
      return data?.data
    },
    onSuccess: data => {
      if (data) {
        reset({
          ie: {
            ID: data?.ID || 0,
            Code: data?.Code,
            SupplierID: data?.SupplierID,
            ToPay: data?.ToPay,
            Total: data?.Total,
            Type: 'N',
            Other: data?.Other || '',
            Payed: data?.Payed || 0,
            Discount: data?.Discount,
            Source: data?.Source,
            UserID: data?.UserID || 0,
            Target: data?.Target || 0,
            TargetCreated: data?.TargetCreated || 0,
            CreateDate: data?.CreateDate
              ? moment(data?.CreateDate, 'YYYY-MM-DD HH:mm').toDate()
              : new Date(),
            Summary: data?.Summary || '',
            ReceiverID: data?.ReceiverID || 0
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
                  Other: x?.Desc || '',
                  convert: null,
                  Qty: x?.Qty || 1,
                  ImportTotalPrice: (x.Qty || 1) * x.ImportPrice
                }))
              : [
                  {
                    ImportDiscount: '',
                    ImportPrice: '',
                    ImportPriceOrigin: '',
                    ProdTitle: '',
                    Qty: 1,
                    ProdCode: '',
                    ProdId: '',
                    Unit: '',
                    Source: '',
                    convert: null,
                    ImportTotalPrice: 0
                  }
                ]
        })
      }
    }
  })

  useEffect(() => {
    onUpdate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields])

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
              render={({ field: { ref, ...field }, fieldState }) =>
                field.value?.label ? (
                  <Tooltip
                    //visible={true}
                    overlayClassName="text-white dark:text-dark-light"
                    placement="top"
                    trigger={['hover']}
                    overlay={
                      <div className="px-3 py-2.5 bg-white dark:bg-dark-light rounded-sm shadow-lg text-gray-700 dark:text-graydark-800 max-w-[300px] text-center">
                        {field.value?.label}
                      </div>
                    }
                    align={{
                      offset: [9, 0]
                    }}
                  >
                    <div>
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

                          WarehouseAPI.getConvert({
                            prodid: val?.source?.ID
                          }).then(({ data }) => {
                            if (data?.lst && data.lst.length > 0) {
                              setValue(`items[${rowIndex}].convert`, data.lst)
                            } else {
                              setValue(`items[${rowIndex}].convert`, null)
                            }
                          })

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
                          setValue(`items[${rowIndex}].Qty`, 1, {
                            shouldValidate: true
                          })
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
                                val?.source?.PriceProduct >=
                                  val?.source?.PriceBase
                                ? val?.source?.PriceProduct -
                                  val?.source?.PriceBase
                                : 0
                              : 0
                          )
                          setValue(
                            `items[${rowIndex}].ImportTotalPrice`,
                            1 * val?.source?.PriceBase
                          )
                          setValue(`items[${rowIndex}].Valid`, true)
                          onUpdate()
                        }}
                      />
                    </div>
                  </Tooltip>
                ) : (
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

                      WarehouseAPI.getConvert({
                        prodid: val?.source?.ID
                      }).then(({ data }) => {
                        if (data?.lst && data.lst.length > 0) {
                          setValue(`items[${rowIndex}].convert`, data.lst)
                        } else {
                          setValue(`items[${rowIndex}].convert`, null)
                        }
                      })

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
                      setValue(`items[${rowIndex}].Qty`, 1, {
                        shouldValidate: true
                      })
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
                      setValue(
                        `items[${rowIndex}].ImportTotalPrice`,
                        1 * val?.source?.PriceBase
                      )
                      setValue(`items[${rowIndex}].Valid`, true)
                      onUpdate()
                    }}
                  />
                )
              }
            />
            <Controller
              name={`items[${rowIndex}].Valid`}
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <>
                  {typeof field.value !== 'undefined' && !field.value && (
                    <div className="text-danger text-[12px] mt-1.5">
                      {rowData.ExcelDesc} - Lỗi dòng {rowData?.ExcelRowIndex}{' '}
                      trên file Excel.
                    </div>
                  )}
                </>
              )}
            />
          </div>
        )
      },
      {
        key: 'ProdCode',
        title: 'Mã',
        dataKey: 'ProdCode',
        width: 100,
        cellRenderer: ({ rowData, rowIndex }) => (
          <Controller
            name={`items[${rowIndex}].ProdCode`}
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
        width: 200,
        cellRenderer: ({ rowIndex }) => (
          <div className="relative">
            <Controller
              name={`items[${rowIndex}].Qty`}
              control={control}
              rules={{
                required: true
              }}
              render={({ field: { ref, ...field }, fieldState }) => (
                <>
                  <InputNumber
                    //errorMessage={fieldState?.invalid}
                    errorMessageForce={fieldState?.invalid}
                    //className={clsx('px-3 py-2.5')}
                    placeholder="Nhập SL"
                    value={field.value}
                    onValueChange={val => {
                      const { ImportPrice } = watchForm.items[rowIndex]
                      setValue(
                        `items[${rowIndex}].ImportTotalPrice`,
                        ImportPrice * (val.floatValue || 0)
                      )
                      field.onChange(val.floatValue || '')
                      onUpdate()
                    }}
                    allowNegative={false}
                    isAllowed={inputObj => {
                      const { floatValue } = inputObj
                      if (floatValue < 0) return
                      return true
                    }}
                    onBlur={field.onBlur}
                  />
                </>
              )}
            />
            <Controller
              name={`items[${rowIndex}].convert`}
              control={control}
              render={({ field: { ref, ...field }, fieldState }) =>
                field.value ? (
                  <DropdownMenu
                    trigger={
                      <div className="absolute top-0 right-0 flex items-center justify-center w-10 h-full cursor-pointer">
                        <ExclamationCircleIcon className="w-5 text-warning" />
                      </div>
                    }
                  >
                    <div className="px-4 py-2">
                      <ConversionTools
                        initialValues={field.value}
                        onChange={val => {
                          setValue(`items[${rowIndex}].Qty`, val)
                          onUpdate()
                        }}
                      />
                    </div>
                  </DropdownMenu>
                ) : (
                  <></>
                )
              }
            />
          </div>
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
                  if (ImportDiscount > 100) {
                    setValue(
                      `items[${rowIndex}].ImportPrice`,
                      (val?.floatValue || 0) - ImportDiscount
                    )
                  } else {
                    setValue(
                      `items[${rowIndex}].ImportPrice`,
                      (val?.floatValue || 0) -
                        (ImportDiscount * (val?.floatValue || 0)) / 100
                    )
                  }

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
                  const { ImportPriceOrigin, Qty } = watchForm.items[rowIndex]
                  setValue(
                    `items[${rowIndex}].ImportDiscount`,
                    ImportPriceOrigin - (val.floatValue || 0)
                  )
                  setValue(
                    `items[${rowIndex}].ImportTotalPrice`,
                    Qty * (val.floatValue || 0)
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
        key: 'ImportTotalPrice',
        title: 'Thành tiền',
        dataKey: 'ImportTotalPrice',
        cellRenderer: ({ rowData, rowIndex }) => (
          <div>
            <Controller
              name={`items[${rowIndex}].ImportTotalPrice`}
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <InputNumber
                  allowLeadingZeros={true}
                  thousandSeparator={true}
                  value={field.value}
                  placeholder="Nhập thành tiền"
                  onValueChange={val => {}}
                  disabled={true}
                />
              )}
            />
          </div>
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
      let rs = await WarehouseAPI.updateImportExport(body)
      await queryClient.invalidateQueries({ queryKey: ['ListImportExport'] })
      return rs
    }
  })

  const onSubmit = values => {
    updateMutation.mutate(
      {
        ...values,
        ie: {
          ...values.ie,
          CreateDate: moment(values.ie.CreateDate).format('YYYY-MM-DD HH:mm'),
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
        }))
      },
      {
        onSuccess: data => {
          if (data?.data?.data?.ID) {
            Swal.fire({
              icon: 'success',
              title: id ? 'Cập nhật thành công.' : 'Thêm mới thành công.',
              html: `${
                !id ? 'Tạo đơn nhập kho mới' : 'Chỉnh sửa đơn nhập kho'
              } thành công. ( Mã ${data?.data?.data?.Code} )`,
              confirmButtonText: 'Đóng'
            }).then(() => {
              navigate({
                pathname: state?.prevFrom || '/catalogue/import-export',
                search: search
              })
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Xảy ra lỗi ?',
              html: `<span class="text-danger">${
                !id ? 'Tạo đơn nhập kho mới' : 'Chỉnh sửa đơn nhập kho'
              } không thành công (${data?.data?.error || '202'}).</span>`
            })
          }
        }
      }
    )
  }

  const fileInput = useRef(null)

  const handleClick = () => {
    fileInput.current.click()
  }

  const checkWarehouseMutation = useMutation({
    mutationFn: async body => {
      let ieID = data?.ID
      let { data: rechecks } = await WarehouseAPI.recheckIE({ ID: ieID })

      let ieInsert = null
      let ieImport = null
      let ieExport = null
      let ieDate = null

      if (rechecks?.rs && rechecks?.rs?.length > 0) {
        ieInsert = rechecks?.rs.find(x => x.ie.ID === ieID)
        ieImport = rechecks?.rs.find(x => x.ie.ID !== ieID && x.ie.Type === 'N')
        ieExport = rechecks?.rs.find(x => x.ie.ID !== ieID && x.ie.Type === 'X')
      }

      if (ieImport) {
        ieDate = ieImport.ie.CreateDate
      }

      if (ieExport) {
        if (
          !ieDate ||
          (ieDate && moment(ieDate).isBefore(moment(ieExport.ie.CreateDate)))
        ) {
          ieDate = ieExport.ie.CreateDate
        }
      }

      let newItems = [
        ...(ieImport?.items || []).map(x => ({
          ...x,
          ieType: ieImport?.ie?.Type
        })),
        ...(ieExport?.items || []).map(x => ({
          ...x,
          ieType: ieExport?.ie?.Type
        }))
      ]

      let newQueryConfig = {
        cmd: 'prodinstock',
        Pi: 1,
        Ps: newItems.length,
        manus: '',
        to: moment(ieDate).format('HH:mm DD/MM/YYYY'), //10:38 15/09/2025
        '(filter)Only': true,
        '(filter)RootTypeID': 794,
        '(filter)StockID': ieInsert.ie.Source,
        '(filter)key': '',
        '(filter)NotDelv': false,
        '(filter)IsPublic': true,
        '(filter)DIDs': newItems.map(x => x.ProdCode).toString(),
        Qty: 0,
        cankho: 1
      }

      let { data: SelectQty } = await WarehouseAPI.getListInventory(
        newQueryConfig
      )

      if (SelectQty?.data?.list && SelectQty?.data?.list.length > 0) {
        newItems = newItems.map(item => {
          let newItem = { ...item }
          if (ieInsert?.items && ieInsert?.items.length > 0) {
            if (
              ieInsert?.items.findIndex(x => x.ProdCode === item.ProdCode) > -1
            ) {
              let index = SelectQty?.data?.list.findIndex(
                x => x.ProdCode === item.ProdCode
              )
              if (index > -1) {
                let Qty = SelectQty?.data?.list[index].Qty

                if (item.Desc) {
                  const match = item.Desc.match(/Số lượng sau cân kho:\s*(\d+)/)
                  const quantity = match ? parseInt(match[1], 10) : null

                  if (quantity) {
                    newItem.Qty = quantity - Qty
                    if (newItem.Qty < 0) {
                      newItem.ieType = 'X'
                    }
                  }
                  // console.log('SL cân kho:', item.Qty)
                  // console.log('Tại thời điểm đó:', Qty)
                  // console.log('Sau cân kho:', quantity)
                  // console.log('SL cân kho mới', newItem.Qty)
                  // console.log('-----')
                }
              }
            }
          }
          return newItem
        })
      }

      if (ieInsert.items && ieInsert.items.length > 0) {
        for (let item of ieInsert.items) {
          let index = newItems.findIndex(x => x.ProdCode === item.ProdCode)
          if (index === -1) {
            newItems.push({
              ...item,
              ieType: ieInsert?.ie?.Type === 'N' ? 'X' : 'N'
            })
          }
        }
      }

      let newImport = newItems.filter(x => x.ieType === 'N')
      let newExport = newItems.filter(x => x.ieType === 'X')

      if (newImport && newImport.length > 0) {
        if (ieImport?.ie?.ID) {
          // Sửa đơn
          console.log('Sửa đơn nhập', {
            ...ieImport,
            ie: {
              ...ieExport,
              CreateDate: moment(ieImport.ie.CreateDate).format(
                'YYYY-MM-DD HH:mm'
              ),
              stockItems: newImport.map(x => ({
                ...x
              }))
            },
            items: newImport
          })
          // await WarehouseAPI.updateImportExport({
          //   ...ieImport,
          //   ie: {
          //     ...ieExport,
          //     CreateDate: moment(ieImport.ie.CreateDate).format(
          //       'YYYY-MM-DD HH:mm'
          //     ),
          //     stockItems: newImport.map(x => ({
          //       ...x
          //     }))
          //   },
          //   items: newImport
          // })
        } else if (ieExport) {
          console.log('Tạo đơn nhập', newImport)
          // Tạo đơn
          // let { data: ieCreateN } = await WarehouseAPI.getListInventory({
          //   cmd: 'getie_id',
          //   id: 'typeN'
          // })
          // if (ieCreateN?.data) {
          //   await WarehouseAPI.updateImportExport({
          //     ...ieExport,
          //     ie: {
          //       ID: '',
          //       Code: ieCreateN?.data?.Code || '',
          //       SupplierID: '',
          //       ToPay: '',
          //       Total: '',
          //       Type: 'N',
          //       Other: '',
          //       Payed: 0,
          //       Discount: '',
          //       Source: ieExport?.ie?.Source,
          //       UserID: 0,
          //       Target: 0,
          //       TargetCreated: '',
          //       CreateDate: ieExport?.ie?.CreateDate
          //         ? moment(
          //             ieExport?.ie?.CreateDate,
          //             'YYYY-MM-DD HH:mm'
          //           ).toDate()
          //         : new Date(),
          //       Summary: '',
          //       ReceiverID: 0,
          //       stockItems: newImport.map(x => ({
          //         ...x
          //       }))
          //     },
          //     items: newImport
          //   })
          // }
        }
      } else {
        if (ieImport?.ie?.ID) {
          console.log('Xoá đơn nhập', ieImport?.ie?.ID)
          //Xoá đơn
          // await WarehouseAPI.deleteImportExport({
          //   cmd: 'delete_ie',
          //   id: ieImport?.ie?.ID
          // })
        }
      }

      if (newExport && newExport.length > 0) {
        if (ieExport?.ie?.ID) {
          // Sửa đơn
          console.log('Sửa đơn xuất', {
            ...ieExport,
            ie: {
              ...ieExport,
              CreateDate: moment(ieExport.ie.CreateDate).format(
                'YYYY-MM-DD HH:mm'
              ),
              stockItems: newExport.map(x => ({
                ...x
              }))
            },
            items: newExport
          })
          // await WarehouseAPI.updateImportExport({
          //   ...ieExport,
          //   ie: {
          //     ...ieExport,
          //     CreateDate: moment(ieExport.ie.CreateDate).format(
          //       'YYYY-MM-DD HH:mm'
          //     ),
          //     stockItems: newExport.map(x => ({
          //       ...x
          //     }))
          //   },
          //   items: newExport
          // })
        } else if (ieImport) {
          console.log('Tạo đơn xuất', newExport)
          // Tạo đơn
          // let { data: ieCreateX } = await WarehouseAPI.getListInventory({
          //   cmd: 'getie_id',
          //   id: 'typeX'
          // })
          // if (ieCreateX?.data) {
          //   await WarehouseAPI.updateImportExport({
          //     ...ieExport,
          //     ie: {
          //       ID: '',
          //       Code: ieCreateX?.data?.Code || '',
          //       SupplierID: '',
          //       ToPay: '',
          //       Total: '',
          //       Type: 'X',
          //       Other: '',
          //       Payed: 0,
          //       Discount: '',
          //       Source: ieImport?.ie?.Source,
          //       UserID: 0,
          //       Target: 0,
          //       TargetCreated: '',
          //       CreateDate: ieImport?.ie?.CreateDate
          //         ? moment(
          //             ieImport?.ie?.CreateDate,
          //             'YYYY-MM-DD HH:mm'
          //           ).toDate()
          //         : new Date(),
          //       Summary: '',
          //       ReceiverID: 0,
          //       stockItems: newExport.map(x => ({
          //         ...x
          //       }))
          //     },
          //     items: newExport
          //   })
          // }
        }
      } else {
        if (ieExport?.ie?.ID) {
          console.log('Xoá đơn xuất', ieExport?.ie?.ID)
          //Xoá đơn
          // await WarehouseAPI.deleteImportExport({
          //   cmd: 'delete_ie',
          //   id: ieExport?.ie?.ID
          // })
        }
      }
      return null
    }
  })

  const uploadMutation = useMutation({
    mutationFn: async body => {
      const file = await UploadsAPI.sendFile(body)
      return WarehouseAPI.importExcelFile({ file: file?.data?.data })
    }
  })

  const handleFileChange = event => {
    const data = new FormData()
    data.append(event.target.files[0].name, event.target.files[0])
    uploadMutation.mutate(data, {
      onSuccess: ({ data }) => {
        fileInput.current.value = ''
        if (data.items && data.items.length > 0) {
          setValue(
            'items',
            data.items.map(x => ({
              ...x,
              ProdTitle: x.ProdTitle
                ? {
                    label: x.ProdTitle,
                    value: x.ProdID
                  }
                : '',
              ProdId: x.ProdID,
              Other: x?.Desc || '',
              Unit: x.StockUnit || '',
              ImportTotalPrice: x.Qty * x.ImportPrice,
              convert: null
            }))
          )
          const total = data.items.reduce(
            (n, { ImportPrice, Qty }) => n + ImportPrice * Qty,
            0
          )
          setValue('ie.Total', total)
          setValue('ie.ToPay', total)
        }
      }
    })
  }

  const onExport = () => {
    if (!data) return
    window?.top?.loading &&
      window?.top?.loading('Đang thực hiện ...', () => {
        ExcelHepers.dataToExcel(
          'don-nhap-kho-' + data.Code,
          (sheet, workbook) => {
            workbook.suspendPaint()
            workbook.suspendEvent()
            let Head = [
              'TÊN SẢN PHẨM',
              'MÃ',
              'ĐƠN VỊ',
              'SỐ LƯỢNG',
              'NGUYÊN GIÁ',
              'CHIẾT KHẤU',
              'ĐƠN GIÁ',
              'THÀNH TIỀN',
              'GIẢM GIÁ CẢ ĐƠN',
              'CÒN LẠI',
              'GHI CHÚ'
            ]

            let Response = [Head]

            for (let item of data.stockItems) {
              let newArray = [
                item.ProdTitle,
                item.ProdCode,
                item.Unit,
                item.Qty,
                item.ImportPriceOrigin,
                item.ImportDiscount > 100
                  ? item.ImportDiscount
                  : item.ImportDiscount + '%',
                item.ImportPrice,
                item.ImportPrice * item.Qty,
                '',
                '',
                item.Desc
              ]
              Response.push(newArray)
            }
            let Total = 0

            for (let i of Response) {
              if (Number(i[7] > 0)) Total += Number(i[7])
            }
            Response.push([
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              Total,
              data?.Discount,
              Total - data?.Discount,
              data.Other
            ])
            let TotalRow = Response.length
            let TotalColumn = Head.length

            sheet.setArray(2, 0, Response)

            //title
            workbook
              .getActiveSheet()
              .getCell(0, 0)
              .value('Đơn nhập kho ' + data.Code)
            workbook.getActiveSheet().getCell(0, 0).font('18pt Arial')

            workbook
              .getActiveSheet()
              .getRange(2, 0, 1, TotalColumn)
              .font('12pt Arial')
            workbook
              .getActiveSheet()
              .getRange(2, 0, 1, TotalColumn)
              .backColor('#E7E9EB')
            //border
            var border = new window.GC.Spread.Sheets.LineBorder()
            border.color = '#000'
            border.style = window.GC.Spread.Sheets.LineStyle.thin
            workbook
              .getActiveSheet()
              .getRange(2, 0, TotalRow, TotalColumn)
              .borderLeft(border)
            workbook
              .getActiveSheet()
              .getRange(2, 0, TotalRow, TotalColumn)
              .borderRight(border)
            workbook
              .getActiveSheet()
              .getRange(2, 0, TotalRow, TotalColumn)
              .borderBottom(border)
            workbook
              .getActiveSheet()
              .getRange(2, 0, TotalRow, TotalColumn)
              .borderTop(border)
            //filter
            var cellrange = new window.GC.Spread.Sheets.Range(
              3,
              0,
              1,
              TotalColumn
            )
            var hideRowFilter =
              new window.GC.Spread.Sheets.Filter.HideRowFilter(cellrange)
            workbook.getActiveSheet().rowFilter(hideRowFilter)

            //format number
            workbook
              .getActiveSheet()
              .getCell(2, 0)
              .hAlign(window.GC.Spread.Sheets.HorizontalAlign.center)

            //auto fit width and height
            workbook.getActiveSheet().autoFitRow(TotalRow + 2)
            workbook.getActiveSheet().autoFitRow(0)

            workbook
              .getActiveSheet()
              .setColumnWidth(
                0,
                400.0,
                window.GC.Spread.Sheets.SheetArea.viewport
              )

            for (let i = 1; i < TotalColumn; i++) {
              workbook.getActiveSheet().autoFitColumn(i)
            }

            for (let i = 0; i <= TotalRow; i++) {
              workbook.getActiveSheet().setFormatter(i + 3, 4, '#,#')
              workbook.getActiveSheet().setFormatter(i + 3, 5, '#,#')
              workbook.getActiveSheet().setFormatter(i + 3, 6, '#,#')
              workbook.getActiveSheet().setFormatter(i + 3, 7, '#,#')
              workbook.getActiveSheet().setFormatter(i + 3, 8, '#,#')
              workbook.getActiveSheet().setFormatter(i + 3, 9, '#,#')
            }

            window.top?.toastr?.remove()

            //Finish
            workbook.resumePaint()
            workbook.resumeEvent()
          }
        )
      })
  }

  const checkWarehouse = async () => {
    checkWarehouseMutation.mutate(
      {},
      {
        onSuccess: () => {
          console.log('Done')
        }
      }
    )
  }

  const recheckMutation = useMutation({
    mutationFn: async body => {
      let { data } = await WarehouseAPI.getListInventory(body)
      return data?.data?.Code || null
    }
  })

  const getCodeIE = ({ Date, StockID }) => {
    let { ie } = watchForm
    if (Boolean(GlobalConfig?.Admin?.dinh_dang_ma_don_nhap_xuat_kho) && !id) {
      recheckMutation.mutate(
        {
          cmd: 'getie_id',
          id: 'typeN',
          date: moment(Date ? Date : ie.CreateDate).format('YYYY-MM-DD HH:mm'),
          stockid: StockID?.value || ie?.Source
        },
        {
          onSuccess: data => {
            if (data) {
              setValue('ie.Code', data)
            }
          }
        }
      )
    }
  }

  return (
    <LayoutGroup key={pathname}>
      <div className="fixed w-full h-full z-[1002] top-0 left-0">
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div
            className="absolute w-full h-full top-0 left bg-black/[.2] dark:bg-black/[.4]"
            onClick={() =>
              navigate({
                pathname: state?.prevFrom || '/catalogue/import-export',
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
            <div className="flex items-center justify-between px-4 py-4 border-b lg:px-6 border-separator dark:border-dark-separator md:h-[90px] md:min-h-[90px]">
              <div className="w-10/12">
                <div className="text-xl font-bold truncate lg:text-2xl dark:text-graydark-800">
                  {!id ? 'Đơn nhập kho mới' : 'Chỉnh sửa đơn nhập kho'}
                </div>
                {!id && (
                  <div className="mt-1">
                    Bạn có thể
                    <a
                      href="/v2/filemau1.xlsx"
                      className="text-primary pl-1.5 cursor-pointer"
                      download
                    >
                      tải file Excel mẫu
                    </a>
                    <span className="pl-1.5">và chọn</span>
                    <span
                      className="text-primary pl-1.5 cursor-pointer"
                      onClick={handleClick}
                    >
                      Import từ Excel
                    </span>
                    <span className="pl-1.5">để tải lên.</span>
                    <input
                      className="hidden"
                      type="file"
                      onChange={e => handleFileChange(e)}
                      ref={fileInput}
                    />
                  </div>
                )}
              </div>

              <div
                className="flex items-center justify-center w-10 h-10 transition cursor-pointer lg:w-12 lg:h-12 dark:text-graydark-800 hover:text-primary"
                onClick={() =>
                  navigate({
                    pathname: state?.prevFrom || '/catalogue/import-export',
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
                    {adminTools_byStock?.hasRight && (
                      <div className="mb-3.5">
                        <div className="font-medium">Ngày tạo</div>
                        <div className="mt-1">
                          <Controller
                            rules={{ required: true }}
                            name="ie.CreateDate"
                            control={control}
                            render={({
                              field: { ref, ...field },
                              fieldState
                            }) => (
                              <InputDatePicker
                                placeholderText="Chọn thời gian"
                                autoComplete="off"
                                selected={
                                  field.value ? new Date(field.value) : null
                                }
                                {...field}
                                onChange={e => {
                                  field.onChange(e)
                                  getCodeIE({
                                    Date: e
                                  })
                                }}
                                dateFormat="HH:mm dd/MM/yyyy"
                                showTimeSelect
                                errorMessageForce={fieldState?.invalid}
                                //timeFormat="HH:mm"
                              />
                            )}
                          />
                        </div>
                      </div>
                    )}

                    <div className="mb-3.5">
                      <div className="font-medium">Mã đơn nhập kho</div>
                      <div className="mt-1">
                        <Controller
                          name="ie.Code"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <div className="relative">
                              <Input
                                placeholder="Nhập mã đơn"
                                autoComplete="off"
                                type="text"
                                {...field}
                              />
                              {recheckMutation?.isLoading && (
                                <div className="absolute top-0 right-0 flex items-center justify-center w-12 h-full">
                                  <div role="status">
                                    <svg
                                      aria-hidden="true"
                                      className="w-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                      viewBox="0 0 100 101"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                      />
                                      <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                      />
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        />
                      </div>
                    </div>
                    <div className="mb-3.5">
                      <div className="font-medium">Nhập vào kho</div>
                      <div className="mt-1">
                        <Controller
                          name="ie.Source"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <SelectStocksWareHouse
                              value={field.value}
                              onChange={val => {
                                field.onChange(val?.value || '')
                                getCodeIE({ StockID: val })
                              }}
                              className="select-control"
                              menuPosition="fixed"
                              styles={{
                                menuPortal: base => ({
                                  ...base,
                                  zIndex: 9999
                                })
                              }}
                              menuPortalTarget={document.body}
                              StockRoles={
                                xuat_nhap_diem.hasRight
                                  ? xuat_nhap_diem.IsStocks
                                    ? [
                                        { value: 778, label: 'Kho tổng' }
                                      ].concat(xuat_nhap_diem.StockRoles)
                                    : xuat_nhap_diem.StockRoles
                                  : xuat_nhap_ten_slg.IsStocks
                                  ? [{ value: 778, label: 'Kho tổng' }].concat(
                                      xuat_nhap_ten_slg.StockRoles
                                    )
                                  : xuat_nhap_ten_slg.StockRoles
                              }
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
                {!hasWarehouse && (
                  <div className="flex gap-2.5 px-4 py-4 border-t lg:px-6 border-separator">
                    {/* {data && data?.ID && data?.Code && (
                      <Button
                        onClick={() => checkWarehouse()}
                        type="button"
                        className="w-[48px] h-12 min-w-[48px] flex items-center justify-center text-warning cursor-pointer border rounded border-gray-300"
                      >
                        <ArrowPathIcon className="w-6" />
                      </Button>
                    )} */}

                    {id && xuat_nhap_diem?.hasRight && (
                      <Button
                        type="button"
                        className="relative flex items-center justify-center w-full h-12 px-4 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
                        onClick={onExport}
                      >
                        Xuất Excel
                      </Button>
                    )}
                    <Button
                      disabled={
                        watchForm.items.some(
                          x => typeof x.Valid !== 'undefined' && !x.Valid
                        ) ||
                        updateMutation.isLoading ||
                        (!adminTools_byStock?.hasRight &&
                          data &&
                          moment().format('DD-MM-YYYY') !==
                            moment(data?.CreateDate).format('DD-MM-YYYY'))
                      }
                      loading={updateMutation.isLoading}
                      type="submit"
                      className="relative flex items-center justify-center w-full h-12 px-4 text-white transition rounded shadow-lg bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70"
                    >
                      {!adminTools_byStock?.hasRight &&
                      data &&
                      moment().format('DD-MM-YYYY') !==
                        moment(data?.CreateDate).format('DD-MM-YYYY') ? (
                        <>Không thể chỉnh sửa</>
                      ) : (
                        <>{id ? 'Cập nhật' : 'Thêm mới'}</>
                      )}
                    </Button>
                  </div>
                )}
              </div>
              <LoadingComponentFull
                bgClassName="bg-white dark:bg-dark-aside z-[10]"
                loading={isLoading || uploadMutation.isLoading}
              />
            </form>
          </div>
        </m.div>
      </div>
    </LayoutGroup>
  )
}

export default WareHouseImport
