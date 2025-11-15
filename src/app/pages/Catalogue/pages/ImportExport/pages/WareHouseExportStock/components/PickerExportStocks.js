/* eslint-disable jsx-a11y/anchor-is-valid */
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { LayoutGroup, m } from 'framer-motion'
import moment from 'moment'
import React, { useRef, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import WarehouseAPI from 'src/_ezs/api/warehouse.api'
import { useRoles } from 'src/_ezs/hooks/useRoles'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import { Button } from 'src/_ezs/partials/button'
import UploadsAPI from 'src/_ezs/api/uploads.api'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import { useCatalogue } from 'src/app/pages/Catalogue/CatalogueLayout'
import { useAuth } from 'src/_ezs/core/Auth'
import { formatString } from 'src/_ezs/utils/formatString'

function PickerExportStocks({ children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { id } = useParams()
  const { adminTools_byStock } = useRoles(['adminTools_byStock'])

  const { hasWarehouse } = useCatalogue()

  const queryClient = useQueryClient()

  const { auth } = useAuth()

  const [visible, setVisible] = useState(false)

  const { control, handleSubmit, setValue, reset, watch } = useForm({
    defaultValues: {
      Items: [],
      Errors: [],
      CreateDate: new Date()
    }
  })

  const watchForm = watch()

  const { fields, remove, append, update } = useFieldArray({
    control,
    name: 'Items'
  })

  const open = () => setVisible(true)

  const close = () => setVisible(false)

  const updateMutation = useMutation({
    mutationFn: async ({ CreateDate, Items }) => {
      let result = []
      for (let i = 0; i < Items.length; i++) {
        let item = Items[i]
        if (!item?.skip && item.status !== 'success') {
          setValue(`Items[${i}].isLoading`, true)
          setValue(`Items[${i}].status`, 'pending')

          let { data: rsCode } = await WarehouseAPI.getListInventory({
            cmd: 'getie_id',
            id: 'typeX',
            date: moment(CreateDate).format('YYYY-MM-DD HH:mm'),
            stockid: item?.ie?.Source
          })

          let rs = await WarehouseAPI.updateImportExport({
            ie: {
              ...item?.ie,
              Code: rsCode?.data?.Code,
              CreateDate: moment(CreateDate).format('YYYY-MM-DD HH:mm'),
              stockItems: item.items.map(x => ({
                ...x,
                ProdTitle: x.ProdTitle?.label,
                Desc: x?.Other || ''
              }))
            },
            items: item.items.map(x => ({
              ...x,
              ProdTitle: x.ProdTitle?.label,
              Desc: x?.Other || ''
            }))
          })

          if (rs?.data?.data?.ID) {
            setValue(`Items[${i}].isLoading`, false)
            setValue(`Items[${i}].status`, 'success')
            setValue(`Items[${i}].Code`, rs?.data?.data?.Code)
          } else {
            setValue(`Items[${i}].isLoading`, false)
            setValue(`Items[${i}].status`, 'error')
          }

          result.push(rs?.data)

          // Delay 300 giảm tải Server
          await new Promise(resolve => setTimeout(resolve, 300))
        } else {
          result.push(item)
        }
      }
      await queryClient.invalidateQueries({ queryKey: ['ListImportExport'] })
      return result
    }
  })

  const onSubmit = async ({ CreateDate, Items }) => {
    updateMutation.mutate(
      { CreateDate, Items },
      {
        onSuccess: () => {}
      }
    )

    // updateMutation.mutate(
    //   {
    //     ...values,
    //     ie: {
    //       ...values.ie,
    //       CreateDate: moment(values.ie.CreateDate).format('YYYY-MM-DD HH:mm'),
    //       stockItems: values.items.map(x => ({
    //         ...x,
    //         ProdTitle: x.ProdTitle.text,
    //         Desc: x?.Other || ''
    //       }))
    //     },
    //     items: values.items.map(x => ({
    //       ...x,
    //       ProdTitle: x.ProdTitle.text,
    //       Desc: x?.Other || ''
    //     }))
    //   },
    //   {
    //     onSuccess: data => {
    //       if (data?.data?.data?.ID) {
    //         Swal.fire({
    //           icon: 'success',
    //           title: 'Xuất kho thành công.',
    //           html: `Xuất kho chuyển đổi cơ sở thành công. ( Mã ${data?.data?.data?.Code} )`,
    //           confirmButtonText: 'Đóng'
    //         }).then(() => {
    //           navigate({
    //             pathname: state?.prevFrom || '/catalogue/import-export',
    //             search: search
    //           })
    //         })
    //       } else {
    //         Swal.fire({
    //           icon: 'error',
    //           title: 'Xảy ra lỗi ?',
    //           html: `<span class="text-danger">Xuất kho chuyển đổi cơ sở không thành công (${
    //             data?.data?.error || '202'
    //           }).</span>`
    //         })
    //       }
    //     }
    //   }
    // )
  }

  const fileInput = useRef(null)

  const handleClick = () => {
    fileInput.current.click()
  }

  const uploadMutation = useMutation({
    mutationFn: async body => {
      const file = await UploadsAPI.sendFile(body)
      const { data } = await WarehouseAPI.importExcelFile({
        file: file?.data?.data
      })
      let Items = data?.items
        ? data?.items
            .map(item => {
              let obj = { ...item }
              obj['FromStocks'] = auth.Stocks.find(
                x =>
                  x.TitleSEO === item.FromStock ||
                  x.Title?.toUpperCase() === item.FromStock?.toUpperCase()
              )
              obj['ToStocks'] = auth.Stocks.find(
                x =>
                  x.TitleSEO === item.ToStock ||
                  x.Title?.toUpperCase() === item?.ToStock?.toUpperCase()
              )

              // if (!item.FromStock || !item.ToStock) {
              //   obj.ExcelDesc = 'Cơ sở không hợp lệ'
              //   obj.Valid = false
              // }
              return obj
            })
            .filter(x => x.FromStocks && x.ToStocks)
        : []

      let StocksItems = []

      let Errors = []

      let CreateDate = new Date()

      for (let item of Items) {
        let index = StocksItems.findIndex(
          x =>
            (x.FromStocks?.TitleSEO === item.FromStock &&
              x.ToStocks?.TitleSEO === item.ToStock) ||
            (x?.FromStocks?.Title?.toUpperCase() ===
              item?.FromStock?.toUpperCase() &&
              x.ToStocks?.Title?.toUpperCase() === item?.ToStock?.toUpperCase())
        )
        if (index > -1) {
          StocksItems[index].items = [...StocksItems[index].items, item]
        } else {
          StocksItems.push({
            FromStocks: item.FromStocks,
            ToStocks: item.ToStocks,
            items: [item],
            ie: {
              CreateDate,
              Code: '', // Mã
              SupplierID: '', //Nhà cung cấp
              ToPay: '', // Giá trị sau chiết khấu
              Total: '', // Tổng giá trị
              Type: 'X',
              Other: item.Desc || '', //Ghi chú
              Discount: '', //Giá trị chiết khấu
              Source: item.FromStocks?.ID, // Kho
              Target: item.ToStocks?.ID //Kho xuất qua
            }
          })
        }
      }

      StocksItems = StocksItems.map(item => ({
        ...item,
        isLoading: false,
        status: 'none',
        Code: '',
        ie: {
          ...item.ie,
          Total: item.items.reduce(
            (n, { ImportPrice, Qty }) => n + ImportPrice * Qty,
            0
          ),
          ToPay: item.items.reduce(
            (n, { ImportPrice, Qty }) => n + ImportPrice * Qty,
            0
          )
        },
        items: item.items
          .map(x => ({
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
          .filter(x => x.Qty > 0),
        skip: item.items.some(x => !x.Valid && x.ExcelDesc)
      }))

      return {
        StocksItems,
        Errors
      }
    }
  })

  const handleFileChange = event => {
    const data = new FormData()
    data.append(event.target.files[0].name, event.target.files[0])
    uploadMutation.mutate(data, {
      onSuccess: ({ StocksItems, Errors }) => {
        fileInput.current.value = ''

        reset({ Items: StocksItems, Errors })
      }
    })
  }

  return (
    <>
      {children({
        open
      })}
      {visible && (
        <LayoutGroup key={pathname}>
          <div className="fixed w-full h-full z-[1002] top-0 left-0">
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div
                className="absolute w-full h-full top-0 left bg-black/[.2] dark:bg-black/[.4]"
                onClick={close}
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
                      {!id
                        ? 'Xuất kho chuyển đổi cơ sở'
                        : 'Chỉnh sửa xuất kho chuyển đổi cơ sở'}
                    </div>
                    {!id && (
                      <div className="mt-1">
                        Bạn có thể
                        <a
                          href="/v2/filemau2.xlsx"
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
                    className="flex items-center justify-center w-12 h-12 transition cursor-pointer dark:text-graydark-800 hover:text-primary"
                    onClick={close}
                  >
                    <XMarkIcon className="w-7 lg:w-9" />
                  </div>
                </div>
                <form
                  className="relative flex flex-col p-5 h-[calc(100%-91px)]"
                  onSubmit={handleSubmit(onSubmit)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') e.preventDefault()
                  }}
                >
                  <div className="overflow-x-auto border border-[#eee] grow">
                    <table className="min-w-full border-separate border-spacing-0">
                      <thead
                        className="sticky top-0 bg-[#f8f8f8] z-[1000] border-b border-b-[#eee]"
                        style={{
                          boxShadow: '0 10px 30px 0 rgba(82, 63, 105, .08)'
                        }}
                      >
                        <tr>
                          <th className="sticky left-0 z-[999] bg-[#f8f8f8] capitalize px-4 py-3 font-semibold text-left min-w-[250px] max-w-[250px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 h-[50px] font-number text-sm">
                            Từ cơ sở
                          </th>
                          <th className="sticky left-[250px] z-[999] bg-[#f8f8f8] capitalize px-4 py-3 font-semibold text-left min-w-[250px] max-w-[250px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 h-[50px] font-number text-sm">
                            Đến cơ sở
                          </th>
                          <th className="capitalize px-4 py-3 font-semibold text-left min-w-[180px] max-w-[180px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 h-[50px] font-number text-sm">
                            Tổng tiền
                          </th>
                          <th className="capitalize px-4 py-3 font-semibold text-left min-w-[300px] max-w-[300px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 h-[50px] font-number text-sm">
                            Tên sản phẩm
                          </th>
                          <th className="capitalize px-4 py-3 font-semibold text-left min-w-[150px] max-w-[150px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 h-[50px] font-number text-sm">
                            Mã
                          </th>
                          <th className="capitalize px-4 py-3 font-semibold text-left min-w-[150px] max-w-[150px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 h-[50px] font-number text-sm">
                            Đơn vị
                          </th>
                          <th className="capitalize px-4 py-3 font-semibold text-left min-w-[150px] max-w-[150px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 h-[50px] font-number text-sm">
                            Số lượng
                          </th>
                          <th className="capitalize px-4 py-3 font-semibold text-left min-w-[180px] max-w-[180px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 h-[50px] font-number text-sm">
                            Thành tiền
                          </th>
                          <th className="sticky right-0 z-[999] bg-[#f8f8f8] capitalize px-4 py-3 font-semibold text-left min-w-[180px] max-w-[180px] border-b border-b-[#eee] border-r border-r-[#eee] border-l border-l-[#eee] last:border-r-0 h-[50px] font-number text-sm">
                            Trạng thái
                          </th>
                        </tr>
                      </thead>

                      {fields && fields.length > 0 && (
                        <>
                          {fields.map((inventory, i) => (
                            <tbody
                              className="bg-white divide-y divide-gray-200 group"
                              key={i}
                            >
                              {inventory.items.map((item, index) => (
                                <tr key={index}>
                                  {index === 0 && (
                                    <>
                                      <td
                                        className="sticky left-0 z-[999] bg-white px-4 py-4 text-sm min-w-[250px] max-w-[250px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 transition group-hover:bg-gray-100"
                                        rowSpan={inventory?.items.length}
                                      >
                                        {inventory.FromStocks?.Title}
                                      </td>
                                      <td
                                        className="sticky left-[250px] z-[999] bg-white px-4 py-4 text-sm min-w-[250px] max-w-[250px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 transition group-hover:bg-gray-100"
                                        rowSpan={inventory?.items.length}
                                      >
                                        {inventory.ToStocks?.Title}
                                      </td>
                                      <td
                                        className="px-4 py-4 text-sm min-w-[180px] max-w-[180px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 transition group-hover:bg-gray-100"
                                        rowSpan={inventory.items.length}
                                      >
                                        {formatString.formatVND(
                                          inventory.ie?.ToPay
                                        )}
                                      </td>
                                    </>
                                  )}
                                  <td
                                    className={clsx(
                                      'px-4 py-4 text-sm min-w-[300px] max-w-[300px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 transition group-hover:bg-gray-100',
                                      !item.Valid &&
                                        item.ExcelDesc &&
                                        '!bg-warninglight'
                                    )}
                                  >
                                    {item?.ProdTitle?.label}
                                    {!item.Valid && item.ExcelDesc && (
                                      <span className="pl-1 text-danger">
                                        (Dòng {item.ExcelRowIndex} file Excel)
                                      </span>
                                    )}
                                  </td>
                                  <td
                                    className={clsx(
                                      'px-4 py-4 text-sm min-w-[300px] max-w-[300px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 transition group-hover:bg-gray-100',
                                      !item.Valid &&
                                        item.ExcelDesc &&
                                        '!bg-warninglight'
                                    )}
                                  >
                                    {item?.ProdCode}
                                  </td>
                                  <td
                                    className={clsx(
                                      'px-4 py-4 text-sm min-w-[300px] max-w-[300px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 transition group-hover:bg-gray-100',
                                      !item.Valid &&
                                        item.ExcelDesc &&
                                        '!bg-warninglight'
                                    )}
                                  >
                                    {item?.StockUnit}
                                  </td>
                                  <td
                                    className={clsx(
                                      'px-4 py-4 text-sm min-w-[300px] max-w-[300px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 transition group-hover:bg-gray-100',
                                      !item.Valid &&
                                        item.ExcelDesc &&
                                        '!bg-warninglight'
                                    )}
                                  >
                                    {item?.Qty}
                                  </td>

                                  <td
                                    className={clsx(
                                      'px-4 py-4 text-sm min-w-[180px] max-w-[180px] border-b border-b-[#eee] border-r border-r-[#eee] transition group-hover:bg-gray-100',
                                      index === 0 && 'last:border-r-0',
                                      !item.Valid &&
                                        item.ExcelDesc &&
                                        '!bg-warninglight'
                                    )}
                                  >
                                    {formatString.formatVND(
                                      item?.Qty * item?.ImportPrice
                                    )}
                                  </td>
                                  {index === 0 && (
                                    <td
                                      className="sticky right-0 z-[999] bg-white px-4 py-4 text-sm min-w-[180px] max-w-[180px] border-b border-b-[#eee] border-r border-r-[#eee] border-l border-l-[#eee] last:border-r-0 transition group-hover:bg-gray-100"
                                      rowSpan={inventory?.items.length}
                                    >
                                      {inventory?.skip && (
                                        <span className="text-danger">
                                          Lỗi dữ liệu Excel
                                        </span>
                                      )}
                                      {!inventory?.skip && (
                                        <>
                                          {watchForm.Items[i].isLoading && (
                                            <div
                                              className="absolute right-3.5 top-2/4 -translate-y-2/4"
                                              role="status"
                                            >
                                              <svg
                                                aria-hidden="true"
                                                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                                              <span className="sr-only">
                                                Loading...
                                              </span>
                                            </div>
                                          )}
                                          <span
                                            className={clsx(
                                              watchForm.Items[i].isLoading &&
                                                'text-warning',
                                              watchForm.Items[i].status ===
                                                'success' && 'text-success',
                                              watchForm.Items[i].status ===
                                                'error' && 'text-danger'
                                            )}
                                          >
                                            {watchForm.Items[i].isLoading ? (
                                              'Đang tạo...'
                                            ) : (
                                              <>
                                                {watchForm.Items[i].status ===
                                                  'success' &&
                                                  watchForm.Items[i].Code}
                                                {watchForm.Items[i].status ===
                                                  'error' && 'Lỗi'}
                                                {watchForm.Items[i].status ===
                                                  'none' && 'Chưa tạo'}
                                              </>
                                            )}
                                          </span>
                                        </>
                                      )}
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          ))}
                        </>
                      )}
                    </table>
                  </div>
                  <div className="flex justify-between mt-5">
                    <div>
                      {adminTools_byStock?.hasRight && (
                        <div className="w-[250px]">
                          <Controller
                            rules={{ required: true }}
                            name="CreateDate"
                            control={control}
                            render={({
                              field: { ref, ...field },
                              fieldState
                            }) => (
                              <InputDatePicker
                                disabled={watchForm.Items.some(
                                  x => x.status === 'done'
                                )}
                                placeholderText="Chọn thời gian"
                                autoComplete="off"
                                selected={
                                  field.value ? new Date(field.value) : null
                                }
                                {...field}
                                onChange={e => {
                                  field.onChange(e)
                                }}
                                dateFormat="HH:mm dd/MM/yyyy"
                                showTimeSelect
                                errorMessageForce={fieldState?.invalid}
                                //timeFormat="HH:mm"
                              />
                            )}
                          />
                        </div>
                      )}
                    </div>

                    {!hasWarehouse && (
                      <div>
                        <Button
                          disabled={
                            watchForm.Items.length === 0 ||
                            !watchForm.Items.some(
                              x => !x.skip && x.status === 'none'
                            ) ||
                            updateMutation.isLoading
                          }
                          loading={updateMutation.isLoading}
                          type="submit"
                          className="relative flex items-center justify-center w-full h-12 px-4 text-white transition rounded shadow-lg bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-50"
                        >
                          Thêm mới
                        </Button>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </m.div>
            <LoadingComponentFull
              bgClassName="bg-white/[.4] z-[10]"
              loading={uploadMutation.isLoading}
            />
          </div>
        </LayoutGroup>
      )}
    </>
  )
}

export default PickerExportStocks
