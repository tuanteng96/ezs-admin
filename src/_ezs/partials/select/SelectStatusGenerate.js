import React from 'react'
import Select from 'react-select'

const SelectStatusGenerate = ({ value, allOption = [], ...props }) => {
  const data = [
    {
      value: 1,
      label: 'Hàng mới'
    },
    {
      label: 'Hàng Hot',
      value: 2
    },
    {
      value: 3,
      label: 'Hàng Sale'
    }
  ]

  return (
    <div>
      <Select
        value={
          value
            ? data.filter(x =>
                value.split(',').some(v => Number(v) === x.value)
              )
            : []
        }
        classNamePrefix="select"
        options={[...allOption, ...data]}
        placeholder="Chọn trạng thái"
        noOptionsMessage={() => 'Không có dữ liệu'}
        {...props}
      />
    </div>
  )
}

export { SelectStatusGenerate }
