import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import React from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import ProdsAPI from 'src/_ezs/api/prods.api'
import { formatArray } from 'src/_ezs/utils/formatArray'

const SelectProdProducts = ({ StockID = 0, ...props }) => {
  const { fetchNextPage } = useInfiniteQuery({
    queryKey: ['SelectProducts'],
    queryFn: async ({ pageParam = 1, search = '' }) => {
      const { data } = await ProdsAPI.getListProdsProduct({
        filter: {
          bystock: null,
          Title: search || ''
        },
        pi: pageParam,
        ps: 20
      })
      return data
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.pi === lastPage.pcount ? undefined : lastPage.pi + 1
    },
    enabled: false
  })

  async function loadOptions(search, loadedOptions, { page }) {
    let { data, hasNextPage } = await fetchNextPage({ pageParam: page, search })
    const List = formatArray.useInfiniteQuery(data.pages, 'list')

    return {
      options: List && List.map(x => ({ label: x.Title, value: x.ID })),
      hasMore: hasNextPage,
      additional: {
        page: page + 1
      }
    }
  }

  return (
    <div>
      <AsyncPaginate
        key={StockID}
        noOptionsMessage={() => 'Không có dữ liệu'}
        placeholder="Chọn sản phẩm"
        classNamePrefix="select"
        cacheOptions={false}
        defaultOptions
        loadOptions={loadOptions}
        additional={{
          page: 1
        }}
        {...props}
      />
    </div>
  )
}

export { SelectProdProducts }
