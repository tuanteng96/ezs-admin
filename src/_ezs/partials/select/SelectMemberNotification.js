import React from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import UsersAPI from 'src/_ezs/api/users.api'

function SelectMemberNotification(props) {
  async function loadOptions(search, loadedOptions, { page }) {
    let { data } = await UsersAPI.listMembersNotification({ key: search })
    let newData = []
    if (data?.data) {
      for (let key of data?.data) {
        const { group, groupid, text, id } = key
        const index = newData.findIndex(item => item.groupid === groupid)
        if (index > -1) {
          newData[index].options.push({
            label: text === 'TAT_CA' ? 'Tất cả' : text,
            value: id,
            ...key
          })
        } else {
          const newItem = {}
          newItem.label = group
          newItem.groupid = groupid
          newItem.options = [
            {
              label: text === 'TAT_CA' ? 'Tất cả khách hàng' : text,
              value: id,
              ...key
            }
          ]
          newData.push(newItem)
        }
      }
    }

    return {
      options: newData,
      hasMore: false,
      additional: {
        page: 1
      }
    }
  }

  return (
    <div>
      <AsyncPaginate
        loadOptions={loadOptions}
        additional={{
          page: 1
        }}
        classNamePrefix="select"
        placeholder="Chọn khách hàng"
        noOptionsMessage={() => 'Không có dữ liệu'}
        {...props}
      />
    </div>
  )
}

export { SelectMemberNotification }
