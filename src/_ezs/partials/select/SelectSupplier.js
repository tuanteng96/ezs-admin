import React from 'react'
import Select from 'react-select'
import { useQuery } from '@tanstack/react-query'
import ProdsAPI from 'src/_ezs/api/prods.api'
import { isArray } from 'lodash-es'

function SelectSupplier({ value, ...props }) {
  const { data, isLoading } = useQuery({
    queryKey: ['ListSelectSupplier'],
    queryFn: async () => {
      const { data } = await ProdsAPI.getSelectSupplier('')
      return data.data
        ? data.data.map(x => ({ ...x, value: x.id, label: x.text }))
        : []
    }
  })

  return (
    <div>
      <Select
        value={
          isArray(value)
            ? data && data.filter(x => value.includes(x.value))
            : data && data.filter(x => x.value === Number(value))
        }
        isLoading={isLoading}
        classNamePrefix="select"
        options={data || []}
        placeholder="Chọn nhà cung cấp, đại lý"
        {...props}
      />
    </div>
  )
}

export { SelectSupplier }
