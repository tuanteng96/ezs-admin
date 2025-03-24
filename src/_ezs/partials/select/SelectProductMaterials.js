import React from 'react'
import Select from 'react-select'
import { useQuery } from '@tanstack/react-query'
import ProdsAPI from 'src/_ezs/api/prods.api'

const SelectProductMaterials = ({ ...props }) => {
  const ListProvinces = useQuery({
    queryKey: ['ListProdsName'],
    queryFn: async () => {
      const { data } = await ProdsAPI.getProdName('san_pham,nvl')
      return (
        data?.data.map(x => ({
          ...x,
          value: x.id,
          label: x.text === 'TAT_CA' ? 'Tất cả' : x.text
        })) || []
      )
    }
  })

  return (
    <div>
      <Select
        isLoading={ListProvinces.isLoading}
        classNamePrefix="select"
        options={ListProvinces?.data || []}
        placeholder="Chọn"
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={{
          menuPortal: base => ({
            ...base,
            zIndex: 9999
          })
        }}
        {...props}
      />
    </div>
  )
}

export { SelectProductMaterials }
