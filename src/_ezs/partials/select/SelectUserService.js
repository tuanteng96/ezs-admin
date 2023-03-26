import React from 'react'
import Select from 'react-select'
import { useQuery } from '@tanstack/react-query'
import UsersAPI from 'src/_ezs/api/users.api'

const SelectUserService = ({ value, StockID, ...props }) => {
  const ListUsers = useQuery({
    queryKey: ['ListUserService'],
    queryFn: async () => {
      const data = await UsersAPI.listService({
        Key: '',
        StockID: StockID || 0
      })
      let newData = []
      if (data?.data?.data) {
        newData = data?.data?.data.map(x => ({
          ...x,
          value: x.id,
          label: x.text
        }))
      }
      return newData
    },
    onSuccess: () => {}
  })

  return (
    <div>
      <Select
        isLoading={ListUsers.isLoading}
        value={value}
        classNamePrefix="select"
        options={ListUsers?.data || []}
        placeholder="Chọn nhân viên"
        noOptionsMessage={() => 'Không có dữ liệu'}
        {...props}
      />
    </div>
  )
}

export { SelectUserService }
