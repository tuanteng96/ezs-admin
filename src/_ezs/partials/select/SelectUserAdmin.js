import React from 'react'
import Select from 'react-select'
import { useQuery } from '@tanstack/react-query'
import UsersAPI from 'src/_ezs/api/users.api'
import { toAbsoluteUrl } from 'src/_ezs/utils/assetPath'

const SelectUserAdmin = ({ value, ...props }) => {
  const ListUsers = useQuery({
    queryKey: ['ListUserAdmin'],
    queryFn: async () => {
      const data = await UsersAPI.listSelect()
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
      return {
        List: newData,
        ListCurrent:
          data?.data?.data.map(x => ({ label: x.text, value: x.id })) || []
      }
    },
    onSuccess: () => {}
  })

  return (
    <div>
      <Select
        isLoading={ListUsers.isLoading}
        value={
          ListUsers?.data?.ListCurrent?.filter(
            x => Number(x.value) === Number(value)
          ) || null
        }
        classNamePrefix="select"
        options={ListUsers?.data?.List || []}
        placeholder="Chọn nhân viên"
        {...props}
      />
    </div>
  )
}

export { SelectUserAdmin }
