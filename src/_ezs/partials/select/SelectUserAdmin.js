import React from 'react'
import Select from 'react-select'
import { useQuery } from '@tanstack/react-query'
import UsersAPI from 'src/_ezs/api/users.api'
import { toAbsoluteUrl } from 'src/_ezs/utils/assetPath'

const SelectUserAdmin = ({
  value,
  isSome = false,
  StockID,
  StockRoles,
  allOption = [],
  ...props
}) => {
  const ListUsers = useQuery({
    queryKey: ['ListUserAdmin'],
    queryFn: async () => {
      const data = await UsersAPI.listSelect({ StockID: StockID || 0 })
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
        data: newData.filter(x =>
          StockRoles ? StockRoles.some(s => s.value === x.groupid) : !StockRoles
        ),
        dataList:
          data?.data?.data?.length > 0
            ? data?.data?.data
                .map(x => ({ ...x, value: x.id, label: x.text }))
                .filter(x =>
                  StockRoles
                    ? StockRoles.some(s => s.value === x.groupid)
                    : !StockRoles
                )
            : []
      }
    },
    onSuccess: () => {}
  })

  return (
    <div>
      <Select
        isLoading={ListUsers.isLoading}
        value={
          isSome
            ? ListUsers?.data?.dataList && ListUsers?.data?.dataList.length > 0
              ? [...allOption, ...ListUsers?.data?.dataList].filter(
                  x => value && value.some(k => Number(k) === x.value)
                )
              : null
            : value
        }
        classNamePrefix="select"
        options={
          ListUsers?.data?.data ? [...allOption, ...ListUsers?.data?.data] : []
        }
        placeholder="Chọn nhân viên"
        noOptionsMessage={() => 'Không có dữ liệu'}
        {...props}
      />
    </div>
  )
}

export { SelectUserAdmin }
