import React from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import UsersAPI from 'src/_ezs/api/users.api'

function SelectUserNotification(props) {
  async function loadOptions(search, loadedOptions, { page }) {
    let { data } = await UsersAPI.listUserNotification({ key: search })
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
          newItem.label = group === 'TAT_CA' ? 'Tất cả' : text
          newItem.groupid = groupid
          newItem.options = [
            {
              label: text === 'TAT_CA' ? 'Tất cả nhân viên' : text,
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
        placeholder="Chọn nhân viên"
        noOptionsMessage={() => 'Không có dữ liệu'}
        {...props}
      />
    </div>
  )
}

export { SelectUserNotification }
