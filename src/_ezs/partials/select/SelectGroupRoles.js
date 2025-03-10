import React from 'react'
import Select from 'react-select'
import MoresAPI from 'src/_ezs/api/mores.api'
import { useQuery } from '@tanstack/react-query'

const SelectGroupRoles = ({
  errorMessage,
  errorMessageForce,
  isMulti,
  value,
  ...props
}) => {
  const ListGroups = useQuery({
    queryKey: ['GroupRoles'],
    queryFn: async () => {
      const { data } = await MoresAPI.getGroupRoles()

      return data?.Groups
        ? data?.Groups.map(x => ({
            ...x,
            value: x.GroupID,
            label: `${x.TitleStock || x.GroupTitle} - ${
              x.StockTitle || 'Hệ thống'
            }`
          })).sort((a, b) => a.StockID - b.StockID)
        : []
    }
  })

  return (
    <div>
      <Select
        value={
          ListGroups?.data?.filter(x =>
            isMulti ? value?.includes(x.value) : x.value === Number(value)
          ) || null
        }
        isMulti={isMulti}
        isLoading={ListGroups.isLoading}
        classNamePrefix="select"
        options={ListGroups?.data || []}
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
