import { useQuery } from '@tanstack/react-query'
import React from 'react'
import CreatableSelect from 'react-select/creatable'
import ProdsAPI from 'src/_ezs/api/prods.api'

function SelectCategoryProds({ Type, ...props }) {
  const { data, isLoading } = useQuery({
    queryKey: ['ListCategory-products', Type],
    queryFn: async () => {
      const { data } = await ProdsAPI.getListCategory()
      let result = []
      if (data) {
        let res = data[Type.toUpperCase()] || []
        res.forEach((x, i) => {
          if (i !== 0) {
            result.push({
              ...x,
              label: x.Title,
              value: x.ID
            })
          }
        })
      }
      return result || []
    },
    cacheTime: 0,
    enabled: Boolean(Type)
  })

  return (
    <div>
      <CreatableSelect
        isLoading={isLoading}
        classNamePrefix="select"
        options={data}
        {...props}
      />
    </div>
  )
}

export { SelectCategoryProds }
