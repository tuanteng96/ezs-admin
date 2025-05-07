import React from 'react'
import Select from 'react-select'
import MoresAPI from 'src/_ezs/api/mores.api'
import { useQuery } from '@tanstack/react-query'

const SelectGroupRoles = ({
  errorMessage,
  errorMessageForce,
  isMulti,
  value,
  StockRoles,
  Params,
  ...props
}) => {
  const ListGroups = useQuery({
    queryKey: ['GroupRoles', { StockRoles, Params }],
    queryFn: async () => {
      const { data } = await MoresAPI.getGroupRoles()
      let newData = []
      if (data?.Groups && data?.Groups.length > 0) {
        for (let key of data?.Groups) {
          const { StockID, GroupID, StockTitle, TitleStock, GroupTitle } = key
          const index = newData.findIndex(item => item.groupid === StockID)
          if (index > -1) {
            newData[index].options.push({
              label:
                TitleStock === 'Kinh doanh' ? 'Sale' : TitleStock || GroupTitle,
              value: GroupID,
              ...key
            })
          } else {
            const newItem = {}
            newItem.label = StockTitle || 'Hệ thống'
            newItem.groupid = StockID
            newItem.options = [
              {
                label:
                  TitleStock === 'Kinh doanh'
                    ? 'Sale'
                    : TitleStock || GroupTitle,
                value: GroupID,
                ...key
              }
            ]
            newData.push(newItem)
          }
        }
      }
      
      newData = newData.filter(x =>
        StockRoles ? StockRoles.some(s => s.value === x.groupid) : !StockRoles
      )
      return {
        options: newData
          .map(x => ({
            ...x,
            index: x.groupid === 0 ? 10 : x.groupid === Params?.StockID ? 0 : 1
          }))
          .sort((a, b) => a.index - b.index),
        Lists: data?.Groups
          ? data?.Groups.map(x => ({
              ...x,
              value: x.GroupID,
              label: `${
                x.TitleStock === 'Kinh doanh'
                  ? 'Sale'
                  : x.TitleStock || x.GroupTitle
              } - ${x.StockTitle || 'Hệ thống'}`
            })).sort((a, b) => a.StockID - b.StockID)
          : []
      }
    }
  })

  return (
    <div>
      <Select
        value={
          ListGroups?.data?.Lists?.filter(x =>
            isMulti ? value?.includes(x.value) : x.value === Number(value)
          ) || null
        }
        isMulti={isMulti}
        isLoading={ListGroups.isLoading}
        classNamePrefix="select"
        options={ListGroups?.data?.options || []}
        placeholder="Chọn nhóm"
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={{
          menuPortal: base => ({
            ...base,
            zIndex: 9999
          })
        }}
        noOptionsMessage={() => 'Không có dữ liệu'}
        {...props}
      />
      {errorMessage && errorMessageForce && (
        <div className="mt-1.5 text-sm text-danger">{errorMessage}</div>
      )}
    </div>
  )
}

export { SelectGroupRoles }
