import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import ProdsAPI from 'src/_ezs/api/prods.api'

const SelectProdProducts = ({ StockID = 0, ...props }) => {
  const getProductMutation = useMutation({
    mutationFn: body => ProdsAPI.getListProdsProduct(body)
  })

  async function loadOptions(search, loadedOptions, { page }) {
    const { data } = await getProductMutation.mutateAsync({
      filter: {
        bystock: null
        //Title: search || ''
      },
      pi: page,
      ps: 20
    })

    return {
      options:
        data && data.list
          ? data.list.map(x => ({ label: x.Title, value: x.ID }))
          : [],
      hasMore: page < data.pcount,
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
