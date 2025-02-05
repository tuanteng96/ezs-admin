import { FloatingPortal } from '@floating-ui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import clsx from 'clsx'
import { AnimatePresence, m } from 'framer-motion'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import WarehouseAPI from 'src/_ezs/api/warehouse.api'
import { useAuth } from 'src/_ezs/core/Auth'
import { Button } from 'src/_ezs/partials/button'
import { InputNumber } from 'src/_ezs/partials/forms'
import { ImageLazy } from 'src/_ezs/partials/images'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { toAbsolutePath } from 'src/_ezs/utils/assetPath'
import { formatArray } from 'src/_ezs/utils/formatArray'

function PickerWarehouseScale({ children, queryConfig }) {
  const [visible, setVisible] = useState(false)

  const queryClient = useQueryClient()

  const { Stocks } = useAuth()

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      Items: []
    }
  })

  const { fields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'Items' // unique name for your Field Array
  })

  const { Items } = watch()

  let indexStock = Stocks.findIndex(x => x.ID === Number(queryConfig.StockID))
  let StockName = indexStock ? Stocks[indexStock].Title : 'Kho tổng'

  const { data, isLoading, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: ['WarehouseScale'],
    queryFn: async ({ pageParam = 1 }) => {
      let newQueryConfig = {
        cmd: queryConfig.cmd,
        Pi: pageParam,
        Ps: queryConfig.Ps,
        manus: queryConfig.manus,
        '(filter)Only': queryConfig.Only,
        '(filter)RootTypeID': queryConfig.RootTypeID,
        '(filter)StockID': queryConfig.StockID,
        '(filter)key': queryConfig.Key,
        '(filter)NotDelv': queryConfig.NotDelv,
        '(filter)IsPublic': queryConfig.IsPublic,
        Qty: 0
      }
      let { data } = await WarehouseAPI.getListInventory(newQueryConfig)
      return data?.data
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.Pi === lastPage.PCount ? undefined : lastPage.Pi + 1,
    enabled: visible,
    cacheTime: 0,
    staleTime: 0
  })

  const Lists = formatArray.useInfiniteQuery(data?.pages, 'list')

  useEffect(() => {
    if (visible) {
      if (Lists) {
        let newLists = [...Lists]
        if (Items) {
          for (let item of Items) {
            let index = newLists.findIndex(x => x.ID === item.ID)
            if (index > -1) {
              newLists[index].ActualInventory = item.ActualInventory
            }
          }
        }
        reset({
          Items: newLists.map(x => ({
            ActualInventory: '',
            BalanceInventory: '',
            ...x
          }))
        })
      }
    } else {
      reset({ Items: [] })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.pages, visible])

  const columns = useMemo(
    () => [
      {
        key: 'TypeText',
        title: 'Hình ảnh',
        dataKey: 'TypeText',
        cellRenderer: ({ rowData }) => (
          <div className="flex justify-center w-full">
            <div className="border border-separator">
              {rowData?.Thumbnail ? (
                <ImageLazy
                  wrapperClassName="object-cover w-16 h-16 !block"
                  className="object-cover w-16 h-16"
                  effect="blur"
                  src={toAbsolutePath(rowData?.Thumbnail)}
                  alt={rowData.Title}
                />
              ) : (
                <svg
                  className="w-16 h-16"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1000 1000"
                >
                  <path fill="#fff" d="M0 0h1000v1000H0z" />
                  <g opacity=".1">
                    <path d="M566.64 267.54V237.6c0-6.74-5.46-12.2-12.2-12.2h-5.37v-68.2c0-6.74-5.46-12.2-12.2-12.2h-73.72c-6.74 0-12.2 5.46-12.2 12.2v68.18h-5.37c-6.74 0-12.2 5.46-12.2 12.2v29.94c-43.58 4.54-76.71 41.22-76.81 85.03v490.23c0 6.74 5.46 12.21 12.2 12.21h262.49c6.74 0 12.2-5.46 12.2-12.2V352.56c-.11-43.81-33.24-80.49-76.82-85.02zM500 166.48c15.23 0 27.58 12.35 27.58 27.58 0 15.23-12.35 27.58-27.58 27.58-15.23 0-27.58-12.35-27.58-27.58 0-15.23 12.35-27.58 27.58-27.58zm-42.23 83.32h84.46v17.33h-84.46V249.8zm161.27 580.79H380.96V352.56c.04-33.68 27.34-60.98 61.02-61.02h116.03c33.68.04 60.98 27.34 61.02 61.02v478.03z" />
                    <path d="M419.04 406.1c-6.74 0-12.2 5.46-12.2 12.2v263.14c0 6.74 5.46 12.2 12.2 12.2s12.2-5.46 12.2-12.2V418.31c.01-6.74-5.46-12.21-12.2-12.21z" />
                  </g>
                </svg>
              )}
            </div>
          </div>
        ),
        width: 100,
        sortable: false
        //align: 'center',
      },
      {
        key: 'Title',
        title: 'Tên sản phẩm',
        dataKey: 'Title',
        width: 320,
        cellRenderer: ({ rowData }) => (
          <div>
            <div className="font-semibold">
              {rowData?.OnStocks === '' ? '[Ngừng kinh doanh] ' : ''}{' '}
              {rowData.Title}
            </div>
            <div className="text-sm">{rowData.ProdCode}</div>
          </div>
        ),
        sortable: false
      },
      {
        key: 'Unit',
        title: 'Đơn vị',
        dataKey: 'Unit',
        width: 120,
        cellRenderer: ({ rowData }) => <div>{rowData.Unit}</div>,
        sortable: false
      },
      {
        key: 'Qty',
        title: 'Tồn PM',
        dataKey: 'Qty',
        width: 120,
        cellRenderer: ({ rowData }) => <div>{rowData.Qty}</div>,
        sortable: false
      },
      {
        key: 'ActualInventory',
        title: 'Tồn thực tế',
        dataKey: 'ActualInventory',
        width: 200,
        cellRenderer: ({ rowData, rowIndex }) => (
          <div>
            <Controller
              name={`Items[${rowIndex}].ActualInventory`}
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <InputNumber
                  thousandSeparator={false}
                  value={field.value}
                  placeholder="Nhập tồn thực tế"
                  onValueChange={val => field.onChange(val.floatValue)}
                  allowNegative={false}
                />
              )}
            />
          </div>
        ),
        sortable: false
      },
      {
        key: 'BalanceInventory',
        title: 'Cân kho',
        dataKey: 'BalanceInventory',
        width: 200,
        cellRenderer: ({ rowData, rowIndex }) => (
          <div>
            <Controller
              name={`Items[${rowIndex}].ActualInventory`}
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <>
                  {field.value !== '' ? (
                    <div
                      className={clsx(
                        'font-medium',
                        rowData.Qty - field.value < 0 && 'text-success',
                        rowData.Qty - field.value > 0 && 'text-danger'
                      )}
                    >
                      {(rowData.Qty - field.value) * -1}
                    </div>
                  ) : (
                    ''
                  )}
                </>
              )}
            />
          </div>
        ),
        sortable: false
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Items]
  )

  const updateMutation = useMutation({
    mutationFn: async ({ ItemsN, ItemsX }) => {
      let PostN = null
      let PostX = null

      let rsN = null
      let rsX = null

      if (ItemsN.length > 0) {
        let dataN = await WarehouseAPI.getListInventory({
          cmd: 'getie_id',
          id: 'typeN'
        })

        PostN = {
          ie: {
            ID: dataN?.data?.data?.ID || 0,
            Code: dataN?.data?.data?.Code,
            SupplierID: dataN?.data?.data?.SupplierID,
            ToPay: dataN?.data?.data?.ToPay,
            Total: dataN?.data?.data?.Total,
            Type: 'N',
            Other: dataN?.data?.data?.Other || 'Thực hiện cân kho',
            Discount: dataN?.data?.data?.Discount,
            Source: queryConfig.StockID,
            UserID: dataN?.data?.data?.UserID || '',
            Target: dataN?.data?.data?.Target || '',
            TargetCreated: dataN?.data?.data?.TargetCreated || '',
            CreateDate: dataN?.data?.data?.CreateDate
              ? moment(
                  dataN?.data?.data?.CreateDate,
                  'YYYY-MM-DD HH:mm'
                ).format('YYYY-MM-DD HH:mm')
              : moment().format('YYYY-MM-DD HH:mm')
          },
          items: ItemsN.map(x => ({
            ImportDiscount: '',
            ImportPrice: '',
            ImportPriceOrigin: '',
            ProdTitle: x.Title,
            Qty: x.Qty,
            ProdCode: x.ProdCode,
            ProdId: x.ProdID,
            Unit: '',
            Source: '',
            convert: null,
            Desc: `Cân kho tự động: ${StockName} - Ngày ${moment().format(
              'DD/MM/YYYY'
            )} - Số lượng sau cân kho: ${x.ActualInventory}`
          }))
        }
      }
      if (ItemsX.length > 0) {
        let dataX = await WarehouseAPI.getListInventory({
          cmd: 'getie_id',
          id: 'typeX'
        })

        PostX = {
          ie: {
            ID: dataX?.data?.data?.ID || 0,
            Code: dataX?.data?.data?.Code,
            SupplierID: dataX?.data?.data?.SupplierID,
            ToPay: dataX?.data?.data?.ToPay,
            Total: dataX?.data?.data?.Total,
            Type: 'X',
            Other: dataX?.data?.data?.Other || 'Thực hiện cân kho',
            Discount: dataX?.data?.data?.Discount,
            Source: queryConfig.StockID,
            UserID: dataX?.data?.data?.UserID || '',
            Target: dataX?.data?.data?.Target || '',
            TargetCreated: dataX?.data?.data?.TargetCreated || '',
            CreateDate: dataX?.data?.data?.CreateDate
              ? moment(
                  dataX?.data?.data?.CreateDate,
                  'YYYY-MM-DD HH:mm'
                ).format('YYYY-MM-DD HH:mm')
              : moment().format('YYYY-MM-DD HH:mm')
          },
          items: ItemsX.map(x => ({
            ImportDiscount: '',
            ImportPrice: '',
            ImportPriceOrigin: '',
            ProdTitle: x.Title,
            Qty: x.Qty,
            ProdCode: x.ProdCode,
            ProdId: x.ProdID,
            Unit: x.Unit,
            Source: '',
            convert: null,
            Desc: `Cân kho tự động: ${StockName} - Ngày ${moment().format(
              'DD/MM/YYYY'
            )} - Số lượng sau cân kho: ${x.ActualInventory}`
          }))
        }
      }

      if (PostN) rsN = await WarehouseAPI.updateImportExport(PostN)
      if (PostX) rsX = await WarehouseAPI.updateImportExport(PostX)
      await refetch()
      await queryClient.invalidateQueries({ queryKey: ['ListInventory'] })

      return {
        rsN,
        rsX
      }
    }
  })

  const onSubmit = async ({ Items }) => {
    let ItemsX = []
    let ItemsN = []

    for (let item of Items) {
      if (item.ActualInventory !== '') {
        if (item.Qty - item.ActualInventory < 0) {
          ItemsN.push({
            ...item,
            Qty: (item.Qty - item.ActualInventory) * -1
          })
        }
        if (item.Qty - item.ActualInventory > 0) {
          ItemsX.push({
            ...item,
            Qty: item.Qty - item.ActualInventory
          })
        }
      }
    }
    updateMutation.mutate(
      {
        ItemsN,
        ItemsX
      },
      {
        onSuccess: () => {
          toast.success('Cân kho thành công.')
        }
      }
    )
  }

  return (
    <>
      {children({
        open: () => setVisible(true)
      })}
      <AnimatePresence>
        <FloatingPortal root={document.body}>
          {visible && (
            <div className="fixed inset-0 flex items-center justify-center z-[1010]">
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute w-full h-full top-0 left bg-black/[.2] dark:bg-black/[.4]"
                onClick={() => setVisible(false)}
              ></m.div>
              <m.div
                className="absolute top-0 right-0 z-10 flex w-full h-full max-w-[80%] bg-white dark:bg-dark-aside"
                initial={{ x: '100%' }}
                transition={{
                  transform: { ease: 'linear' }
                }}
                animate={{ x: '0' }}
              >
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col w-full h-full"
                >
                  <div className="flex items-center justify-between px-4 py-4 border-b lg:px-6 border-separator dark:border-dark-separator">
                    <div className="w-10/12 text-xl font-bold truncate lg:text-2xl dark:text-graydark-800">
                      Cân kho
                    </div>
                    <div
                      className="flex items-center justify-center w-10 h-10 transition cursor-pointer lg:w-12 lg:h-12 dark:text-graydark-800 hover:text-primary"
                      onClick={() => setVisible(false)}
                    >
                      <XMarkIcon className="w-7 lg:w-9" />
                    </div>
                  </div>
                  <ReactBaseTable
                    wrapClassName="grow p-4 lg:p-6"
                    paginationClassName="flex items-center justify-between w-full px-4 pb-4 lg:px-6 lg:pb-6"
                    rowKey="id"
                    columns={columns}
                    data={fields || []}
                    estimatedRowHeight={96}
                    emptyRenderer={() =>
                      !isLoading && (
                        <div className="flex items-center justify-center h-full">
                          Không có dữ liệu
                        </div>
                      )
                    }
                    onEndReachedThreshold={1}
                    onEndReached={fetchNextPage}
                    //isPreviousData={isPreviousData}
                    loading={isLoading}
                  />
                  <div className="flex justify-end px-4 pb-4">
                    <Button
                      loading={updateMutation.isLoading}
                      disabled={updateMutation.isLoading}
                      type="submit"
                      className="relative flex items-center h-12 px-4 ml-2 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
                    >
                      Thực hiện cân kho
                    </Button>
                  </div>
                </form>
              </m.div>
            </div>
          )}
        </FloatingPortal>
      </AnimatePresence>
    </>
  )
}

export default PickerWarehouseScale
