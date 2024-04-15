import { useQuery } from '@tanstack/react-query'
import { isArray } from 'lodash-es'
import React from 'react'
import CreatableSelect from 'react-select/creatable'
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

function SelectCategories({ Type, allOptions = false, value, ...props }) {
  const { data, isLoading } = useQuery({
    queryKey: ['ListCategory-products', Type],
    queryFn: async () => {
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
                    value: x.ID,
                    typeOpt: types.toUpperCase()
                  })
                })
              } else {
                data[types.toUpperCase()].forEach((x, i) => {
                  if (i !== 0) {
                    obj.options.push({
                      ...x,
                      label: x.Title,
                      value: x.ID,
                      typeOpt: types.toUpperCase()
                    })
                  }
                })
              }
            }
            result.push(obj)
          }
        }
      }
      return result || []
    },
    cacheTime: 0,
    enabled: Boolean(Type)
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
      <CreatableSelect
        isLoading={isLoading}
        classNamePrefix="select"
        options={data}
        value={getValue(value)}
        {...props}
      />
    </div>
  )
}

export { SelectCategories }
