import React from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import ProdsAPI from 'src/_ezs/api/prods.api'

const getNameType = type => {
  switch (type) {
    case 'DV':
      return 'Dịch vụ'
    case 'SP':
      return 'Sản phẩm'
    case 'NVL':
      return 'Nguyên vật liệu'
    case 'TT':
      return 'Thẻ tiền'
    case 'NH':
      return 'Nhãn hàng'
    default:
      return 'Phụ phí'
  }
}

function SelectCategoriesAsync({ Type, allOptions = false, ...props }) {
  async function loadOptions(search, loadedOptions, { page }) {
    const { data } = await ProdsAPI.getListCategory()
    let TypeSplit = Type.split(',')
    let result = []
    if (data) {
      if (TypeSplit.length === 1) {
        let res = data[Type.toUpperCase()] || []
        res.forEach((x, i) => {
          if (i !== 0) {
            result.push({
              ...x,
              label: x.Title,
              value: x.ID
            })
          }
        })
      } else {
        for (let types of TypeSplit) {
          let obj = {
            label: getNameType(types.toUpperCase()),
            options: []
          }
          if (data[types.toUpperCase()]) {
            if (allOptions) {
              data[types.toUpperCase()].forEach((x, i) => {
                obj.options.push({
                  ...x,
                  label:
                    i === 0
                      ? 'Tất cả ' + getNameType(types.toUpperCase())
                      : x.Title,
                  value: x.ID
                })
              })
            } else {
              data[types.toUpperCase()].forEach((x, i) => {
                if (i !== 0) {
                  obj.options.push({
                    ...x,
                    label: x.Title,
                    value: x.ID
                  })
                }
              })
            }
          }
          result.push(obj)
        }
      }
    }

    return {
      options: result,
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
        noOptionsMessage={() => 'Không có dữ liệu'}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={{
          menuPortal: base => ({
            ...base,
            zIndex: 9999
          })
        }}
        {...props}
      />
    </div>
  )
}

export { SelectCategoriesAsync }
