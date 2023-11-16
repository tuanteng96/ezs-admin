import React from 'react'
import Select from 'react-select'
import { useQuery } from '@tanstack/react-query'
import UsersAPI from 'src/_ezs/api/users.api'
import { toAbsoluteUrl } from 'src/_ezs/utils/assetPath'
import { isArray } from 'lodash-es'

const SelectUsers = ({
  value,
  isSome = false,
  StockID,
  StockRoles,
  removes = [],
  allOption = [],
  ...props
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ['ListUserAdmin'],
    queryFn: async () => {
      const data = await UsersAPI.listFull({ StockID: StockID || 0 })
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
      newData = [
        ...newData
          .map(x => ({
            ...x,
            options: x.options
              ? x.options.filter(s => !removes.includes(s.value))
              : []
          }))
          .filter(x =>
            StockRoles
              ? StockRoles.some(s => s.value === x.groupid)
              : !StockRoles
          )
      ].filter(x => !x?.value || x?.value === -2 || !removes.includes(x.value))
      return data?.data?.data?.length > 0
        ? data?.data?.data
            .map(x => ({ ...x, value: x.id, label: x.text }))
            .filter(x =>
              StockRoles
                ? StockRoles.some(s => s.value === x.groupid)
                : !StockRoles
            )
        : []
    }
  })

  const getValue = value => {
    if (!data || !value) return null
    let isChildren = data.some(x => 'options' in x)
    let rs = []
    if (isChildren) {
      for (let x of data) {
        if (x.options && x.options.length > 0) {
          for (let option of x.options) {
            if (isArray(value)) {
              let index = value.findIndex(v => Number(v) === option.value)
              if (index > -1) rs.push(option)
            } else {
              if (option.value === Number(value)) rs.push(option)
            }
          }
        }
      }
    } else {
      if (isArray(value)) {
        for (let v of value) {
          let index = data.findIndex(x => Number(v) === x.value)
          if (index > -1) rs.push(data[index])
        }
      } else {
        let index = data.findIndex(x => Number(value) === x.value)
        if (index > -1) rs.push(data[index])
      }
    }
    return rs
  }

  return (
    <div>
      <Select
        key={value}
        isLoading={isLoading}
        value={getValue(value)}
        classNamePrefix="select"
        options={[...allOption, ...(data || [])].filter(
          x => !x?.value || x?.value === -2 || !removes.includes(x.value)
        )}
        placeholder="Chọn nhân viên"
        noOptionsMessage={() => 'Không có dữ liệu'}
        {...props}
      />
    </div>
  )
}

export { SelectUsers }
