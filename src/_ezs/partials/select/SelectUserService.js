import React from 'react'
import Select from 'react-select'
import { useQuery } from '@tanstack/react-query'
import UsersAPI from 'src/_ezs/api/users.api'
import { toAbsoluteUrl } from 'src/_ezs/utils/assetPath'

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
        for (let key of data?.data?.data) {
          const { group, groupid, text, id } = key
          const index = newData.findIndex(item => item.groupid === groupid)
          if (index > -1) {
            newData[index].options.push({
              label: text,
              value: id,
              ...key,
              Thumbnail: toAbsoluteUrl('/assets/images/user/blank.png')
            })
          } else {
            const newItem = {}
            newItem.label = group
            newItem.groupid = groupid
            newItem.options = [
              {
                label: text,
                value: id,
                ...key,
                Thumbnail: toAbsoluteUrl('/assets/images/user/blank.png')
              }
            ]
            newData.push(newItem)
          }
        }
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
