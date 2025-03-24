import React from 'react'
import Select from 'react-select'
import { useQuery } from '@tanstack/react-query'
import ConfigAPI from 'src/_ezs/api/config'

function SelectUserShifts({ errorMessage, errorMessageForce, ...props }) {
  const { data, isLoading } = useQuery({
    queryKey: ['ListShifts'],
    queryFn: async () => {
      const { data } = await ConfigAPI.getName('calamviecconfig')
      let result = []
      if (data.data && data.data.length > 0) {
        if (data.data[0].Value) {
          let p = JSON.parse(data.data[0].Value)
          result = p.map(x => ({ ...x, value: x.ID, label: x.Name }))
        }
      }
      return result
    }
  })

  return (
    <div>
      <Select
        isLoading={isLoading}
        classNamePrefix="select"
        options={data || []}
        placeholder="Chọn loại ca"
        noOptionsMessage={() => 'Không có dữ liệu'}
        {...props}
      />
      {errorMessage && errorMessageForce && (
        <div className="mt-1.5 text-sm text-danger">{errorMessage}</div>
      )}
    </div>
  )
}

export { SelectUserShifts }
