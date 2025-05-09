import React, { useState } from 'react'
import Select from 'react-select'

const SelectTypeGenerate2 = ({
  value,
  Total = 10,
  allOption = [],
  ...props
}) => {
  const [data] = useState([
    { value: -99, label: 'Tất cả (nhân viên)' },
    ...Array.from({ length: Total }, (_, i) => ({
      label: 'Loại ' + (i + 1) + ' (nhân viên)',
      value: (i + 1 + 100) * -1
    })),
    { value: -1, label: 'Tất cả' },
    ...Array.from({ length: Total }, (_, i) => ({
      label: 'Loại ' + (i + 1),
      value: i + 1
    }))
  ])

  return (
    <div>
      <Select
        value={value}
        classNamePrefix="select"
        options={[...allOption, ...data]}
        placeholder="Chọn loại"
        noOptionsMessage={() => 'Không có dữ liệu'}
        {...props}
      />
    </div>
  )
}

export { SelectTypeGenerate2 }
