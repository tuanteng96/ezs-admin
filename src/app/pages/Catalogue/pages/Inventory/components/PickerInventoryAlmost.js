import { FloatingPortal } from '@floating-ui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useInfiniteQuery } from '@tanstack/react-query'
import { AnimatePresence, m } from 'framer-motion'
import moment from 'moment'
import React, { useMemo, useState } from 'react'
import WarehouseAPI from 'src/_ezs/api/warehouse.api'
import { ImageLazy } from 'src/_ezs/partials/images'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { toAbsolutePath } from 'src/_ezs/utils/assetPath'
import { formatArray } from 'src/_ezs/utils/formatArray'

function PickerInventoryAlmost({ queryConfig }) {
  const [visible, setVisible] = useState(false)

  const [filters, setFilters] = useState({
    Pi: 1,
    Ps: 20,
    To: moment(queryConfig.to, 'HH:mm DD/MM/YYYY').format('HH:mm DD/MM/YYYY'),
    StockID: queryConfig.StockID,
    Key: ''
  })

  const { data, isLoading, fetchNextPage } = useInfiniteQuery({
    queryKey: ['InventoryAlmost', filters],
    queryFn: async ({ pageParam = 1 }) => {
      let { data } = await WarehouseAPI.getListInventoryAlmost({
        ...filters,
        Pi: pageParam
      })
      return data?.data
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.Pi === lastPage.PCount ? undefined : lastPage.Pi + 1,
    cacheTime: 0,
    staleTime: 0,
    keepPreviousData: true,
    enabled: visible
  })

  const Lists = formatArray.useInfiniteQuery(data?.pages, 'list')

  const columns = useMemo(
    () => {
      return [
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
        }
      ]
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <>
      <div
        className="mt-1.5 hidden sm:block cursor-pointer text-warning"
        onClick={() => setVisible(true)}
      >
        Cảnh báo sản phẩm tồn dưới quy định
      </div>

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
                className="absolute top-0 right-0 z-10 flex w-full h-full max-w-4xl bg-white dark:bg-dark-aside"
                initial={{ x: '100%' }}
                transition={{
                  transform: { ease: 'linear' }
                }}
                animate={{ x: '0' }}
              >
                <div className="flex flex-col w-full h-full">
                  <div className="flex items-center justify-between px-4 py-4 border-b lg:px-6 border-separator dark:border-dark-separator">
                    <div className="w-10/12 text-xl font-bold truncate lg:text-2xl dark:text-graydark-800">
                      Quản lý sản phẩm gần hết hàng
                    </div>
                    <div className="flex items-center">
                      <div
                        className="flex items-center justify-center w-10 h-10 transition cursor-pointer lg:w-12 lg:h-12 dark:text-graydark-800 hover:text-primary"
                        onClick={() => setVisible(false)}
                      >
                        <XMarkIcon className="w-7 lg:w-9" />
                      </div>
                    </div>
                  </div>
                  <ReactBaseTable
                    wrapClassName="grow p-4 lg:p-6"
                    paginationClassName="flex items-center justify-between w-full px-4 pb-4 lg:px-6 lg:pb-6"
                    rowKey="ID"
                    columns={columns}
                    data={Lists || []}
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
                </div>
              </m.div>
            </div>
          )}
        </FloatingPortal>
      </AnimatePresence>
    </>
  )
}

export default PickerInventoryAlmost
