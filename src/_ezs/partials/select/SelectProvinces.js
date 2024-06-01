import React from 'react'
import Select from 'react-select'
import MoresAPI from 'src/_ezs/api/mores.api'
import { useQuery } from '@tanstack/react-query'

const SelectProvinces = ({ ...props }) => {
  const ListProvinces = useQuery({
    queryKey: ['ListProvince'],
    queryFn: async () => {
      const {data} = await MoresAPI.getProvinces({ Key : '', Pi : 1, Ps : 100 })
      return data?.result?.Items.map(x => ({ ...x, value: x.Id, label: x.Title })) || []
    },
    onSuccess: () => {}
  })

  return (
    <div>
      <Select
        isLoading={ListProvinces.isLoading}
        classNamePrefix="select"
        options={ListProvinces?.data || []}
        placeholder="Chọn Tỉnh / Thành phố"
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

export { SelectProvinces }
