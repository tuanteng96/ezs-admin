import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import ProdsAPI from 'src/_ezs/api/prods.api'

const SelectProdProducts = ({ StockID = 0, ...props }) => {
  const getListProducts = useMutation({
    mutationFn: body => ProdsAPI.getListProdsProduct(body)
  })

  async function loadOptions(search, loadedOptions, { page }) {
    let { data } = await getListProducts.mutateAsync({
      filter: {
        bystock: null,
        Title: search || ''
      },
      pi: page,
      ps: 15
    })

    return {
      options: data?.list
        ? data?.list.map(x => ({ label: x.Title, value: x.ID }))
        : [],
      hasMore: data.pcount > page,
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
        cacheOptions
        loadOptions={loadOptions}
        loadingMessage={() => 'Đang tải...'}
        additional={{
          page: 1
        }}
        {...props}
      />
    </div>
  )
}

export { SelectProdProducts }
