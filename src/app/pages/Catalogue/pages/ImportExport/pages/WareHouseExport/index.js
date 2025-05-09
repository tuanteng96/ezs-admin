/* eslint-disable jsx-a11y/anchor-is-valid */
import {
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
import { toast } from 'react-toastify'
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

function WareHouseExport(props) {
  const navigate = useNavigate()
  const { pathname, state, search } = useLocation()
  const { id } = useParams()
  const { xuat_nhap_diem, xuat_nhap_ten_slg, adminTools_byStock } = useRoles([
    'xuat_nhap_diem',
    'xuat_nhap_ten_slg',
    'adminTools_byStock'
  ])
  const queryClient = useQueryClient()

  const { control, handleSubmit, setValue, reset, watch } = useForm({
    defaultValues: {
      ie: {
        CreateDate: new Date(),
        Code: '', // Mã
        SupplierID: '', //Nhà cung cấp
        ToPay: '', // Giá trị sau chiết khấu
        Total: '', // Tổng giá trị
        Type: 'X',
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

  useEffect(() => {
    onUpdate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields])

  const { isLoading, data } = useQuery({
    queryKey: ['ImportExportId', id],
    queryFn: async () => {
      let { data } = await WarehouseAPI.getListInventory({
        cmd: 'getie_id',
        id: id || 'typeX'
      })
      return data?.data
    },
    onSettled: data => {
      if (data) {
        reset({
          ie: {
            ID: data?.ID || 0,
            Code: data?.Code,
            SupplierID: data?.SupplierID,
            ToPay: data?.ToPay,
            Total: data?.Total,
            Type: 'X',
            Other: data?.Other || '',
            Discount: data?.Discount,
            Source: data?.Source,
            UserID: data?.UserID || '',
            Target: data?.Target || '',
            TargetCreated: data?.TargetCreated || '',
            CreateDate: data?.CreateDate
              ? moment(data?.CreateDate, 'YYYY-MM-DD HH:mm').toDate()
              : new Date()
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
                  Qty: x.Qty || 1,
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
                <InputNumber
                  errorMessageForce={fieldState?.invalid}
                  //className="px-3 py-2.5"
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
                />
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
                    const { ImportPriceOrigin } = watchForm.items[rowIndex]
                    field.onChange(val.floatValue || '')

                    setValue(
                      `items[${rowIndex}].ImportPrice`,
                      val?.floatValue > 100
                        ? ImportPriceOrigin - val?.floatValue
                        : ImportPriceOrigin -
                            (ImportPriceOrigin * val?.floatValue) / 100
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
          ProdTitle: x.ProdTitle?.text || x.ProdTitle?.label,
          Desc: x?.Other || ''
        }))
      },
      {
        onSettled: data => {
          toast.success(id ? 'Cập nhập thành công.' : 'Thêm mới thành công.')
          navigate({
            pathname: state?.prevFrom || '/catalogue/import-export',
            search: search
          })
        }
      }
    )
  }

  const fileInput = useRef(null)

  const handleClick = () => {
    fileInput.current.click()
  }

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
            <div className="flex items-center justify-between px-4 py-4 border-b lg:px-6 border-separator dark:border-dark-separator">
              <div className="w-10/12">
                <div className="text-xl font-bold truncate lg:text-2xl dark:text-graydark-800">
                  {!id ? 'Đơn xuất kho mới' : 'Chỉnh sửa đơn xuất kho'}
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
                  {adminTools_byStock?.hasRight && (
                    <div className="mb-3.5">
                      <div className="font-medium">Ngày tạo</div>
                      <div className="mt-1">
                        <Controller
                          name="ie.CreateDate"
                          control={control}
                          rules={{ required: true }}
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
                  <div>
                    <div className="mb-3.5">
                      <div className="font-medium">Mã đơn xuất</div>
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
                      <div className="font-medium">Xuất từ kho</div>
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
                    {watchForm.ie.Target && (
                      <div className="mb-3.5">
                        <div className="font-medium">Kho chuyển đến</div>
                        <div className="mt-1">
                          <Controller
                            name="ie.Target"
                            control={control}
                            render={({
                              field: { ref, ...field },
                              fieldState
                            }) => (
                              <>
                                <SelectStocksWareHouse
                                  isDisabled={watchForm.ie.TargetCreated === 1}
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
                                  StockRoles={
                                    xuat_nhap_diem.hasRight
                                      ? xuat_nhap_diem.IsStocks
                                        ? [
                                            { value: 778, label: 'Kho tổng' }
                                          ].concat(xuat_nhap_diem.StockRoles)
                                        : xuat_nhap_diem.StockRoles
                                      : xuat_nhap_ten_slg.IsStocks
                                      ? [
                                          { value: 778, label: 'Kho tổng' }
                                        ].concat(xuat_nhap_ten_slg.StockRoles)
                                      : xuat_nhap_ten_slg.StockRoles
                                  }
                                />
                              </>
                            )}
                          />
                        </div>
                      </div>
                    )}
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
                <div className="flex gap-2.5 px-4 py-4 border-t lg:px-6 border-separator">
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
                      <>{id ? 'Cập nhập' : 'Thêm mới'}</>
                    )}
                  </Button>
                </div>
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

export default WareHouseExport
