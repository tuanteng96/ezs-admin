import { useInfiniteQuery } from '@tanstack/react-query'
import React from 'react'
import { useMemo } from 'react'
import { useState } from 'react'
import ProdsAPI from 'src/_ezs/api/prods.api'
import { Input } from 'src/_ezs/partials/forms'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { formatArray } from 'src/_ezs/utils/formatArray'

function ConsultingCommission(props) {
  const [filters, setFilters] = useState({
    pi: 1,
    ps: 20,
    hascombo: 1,
    key: '',
    types: '',
    display: 1
  })

  const { data, fetchNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['ListProd24', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await ProdsAPI.getListProd24({
        ...filters,
        pi: pageParam
      })
      return data
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.pi === lastPage.pcount ? undefined : lastPage.pi + 1
  })

  const Lists = formatArray.useInfiniteQuery(data?.pages, 'list')

  const columns = useMemo(
    () => [
      {
        key: 'ID',
        title: 'ID',
        dataKey: 'ID',
        width: 120,
        sortable: false
      },
      {
        key: 'Title',
        title: 'Tên mặt hàng',
        dataKey: 'Title',
        width: 300,
        sortable: false
        //align: 'center',
      },
      {
        key: 'hhtv',
        title: 'Hoa hồng tư vấn',
        dataKey: 'hhtv',
        width: 200,
        sortable: false,
        cellRenderer: () => (
          <Input
            placeholder="Nhập giá trị"
            value={filters.key}
            onChange={e =>
              setFilters(prevState => ({
                ...prevState,
                key: e.target.value
              }))
            }
          />
        )
      },
      {
        key: 'hhtv1',
        title: 'Thử việc',
        dataKey: 'hhtv1',
        width: 200,
        sortable: false,
        cellRenderer: () => (
          <Input
            placeholder="Nhập giá trị"
            value={filters.key}
            onChange={e =>
              setFilters(prevState => ({
                ...prevState,
                key: e.target.value
              }))
            }
          />
        )
      },
      {
        key: 'hhtv2',
        title: 'Nhân viên chính thức',
        dataKey: 'hhtv2',
        width: 200,
        sortable: false,
        cellRenderer: () => (
          <Input
            placeholder="Nhập giá trị"
            value={filters.key}
            onChange={e =>
              setFilters(prevState => ({
                ...prevState,
                key: e.target.value
              }))
            }
          />
        )
      },
      {
        key: 'hhtv3',
        title: 'Chuyên gia',
        dataKey: 'hhtv3',
        width: 200,
        sortable: false,
        cellRenderer: () => (
          <Input
            placeholder="Nhập giá trị"
            value={filters.key}
            onChange={e =>
              setFilters(prevState => ({
                ...prevState,
                key: e.target.value
              }))
            }
          />
        )
      },
      {
        key: 'hhtv4',
        title: 'Chuyên viên',
        dataKey: 'hhtv4',
        width: 200,
        sortable: false,
        cellRenderer: () => (
          <Input
            placeholder="Nhập giá trị"
            value={filters.key}
            onChange={e =>
              setFilters(prevState => ({
                ...prevState,
                key: e.target.value
              }))
            }
          />
        )
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Lists]
  )

  return (
    <div className="flex flex-col h-full px-8 pt-8 pb-5 mx-auto max-w-7xl">
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="text-3xl font-bold dark:text-white">
            Hoa hồng tư vấn
          </div>
          <div className="mt-1.5">
            Thêm và quản lý hoa hồng tư vấn trên từng mặt hàng
          </div>
        </div>
        <div className="inline-flex rounded-md shadow-sm">
          <div className="px-4 py-2.5 text-sm font-medium text-primary bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 cursor-pointer">
            Sản phẩm
          </div>
          <div className="px-4 py-2.5 text-sm font-medium text-gray-900 bg-white border-t border-b border-r border-gray-200 hover:bg-gray-100 cursor-pointer">
            Dịch vụ
          </div>
          <div className="px-4 py-2.5 text-sm font-medium text-gray-900 bg-white border-t border-b border-r border-gray-200 hover:bg-gray-100 cursor-pointer">
            Phụ phí
          </div>
          <div className="px-4 py-2.5 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 cursor-pointer">
            Thẻ tiền
          </div>
          <div className="px-4 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-100 cursor-pointer">
            NVL
          </div>
        </div>
      </div>
      <div
        className="flex flex-col grow"
        onKeyDown={e => {
          if (e.key === 'Enter') e.preventDefault()
        }}
      >
        <ReactBaseTable
          loading={isLoading}
          wrapClassName="grow bg-white dark:bg-dark-app rounded"
          rowKey="ID"
          columns={columns}
          data={Lists || []}
          rowHeight={78}
          onEndReachedThreshold={1}
          onEndReached={fetchNextPage}
        />
      </div>
    </div>
  )
}

export default ConsultingCommission
