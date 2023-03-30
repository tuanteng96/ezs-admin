import React from 'react'
import Select from 'react-select'
import { useQuery } from '@tanstack/react-query'
import MembersAPI from 'src/_ezs/api/members.api'

const SelectMembers = ({ value, StockID = 0, isSome = false, ...props }) => {
  const ListMembers = useQuery({
    queryKey: ['ListMemberSelect'],
    queryFn: async () => {
      const data = await MembersAPI.memberSelect({
        Key: '',
        StockID: StockID || 0
      })
      return data?.data?.data
        ? data?.data?.data.map(x => ({ ...x, label: x.text, value: x.id }))
        : []
    },
    onSuccess: () => {}
  })

  return (
    <div>
      <Select
        key={StockID}
        isLoading={ListMembers.isLoading}
        value={
          isSome
            ? ListMembers?.data && ListMembers?.data.length > 0
              ? ListMembers?.data.filter(
                  x => value && value.some(k => k === x.value)
                )
              : null
            : value
        }
        classNamePrefix="select"
        options={ListMembers?.data || []}
        placeholder="Chọn khách hàng"
        noOptionsMessage={() => 'Không có dữ liệu'}
        {...props}
      />
    </div>
  )
}

export { SelectMembers }
