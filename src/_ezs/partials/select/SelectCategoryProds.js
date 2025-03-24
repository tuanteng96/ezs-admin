import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
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

function SelectCategoryProds({
  Type,
  allOptions = false,
  errorMessageForce,
  errorMessage,
  ...props
}) {
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
      return result || []
    },
    enabled: Boolean(Type)
  })

  return (
    <div>
      <CreatableSelect
        isLoading={isLoading}
        classNamePrefix="select"
        className={clsx(
          'select-control',
          errorMessageForce && 'select-control-error'
        )}
        options={data}
        {...props}
      />
      {errorMessage && errorMessageForce && (
        <div className="mt-1.5 text-sm text-danger">{errorMessage}</div>
      )}
    </div>
  )
}

export { SelectCategoryProds }
