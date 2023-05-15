import React, { useState } from 'react'
import Select from 'react-select'

const SelectTypeGenerate = ({
  value,
  Total = 10,
  allOption = [],
  ...props
}) => {
  const [data] = useState(
    Array.from({ length: Total }, (_, i) => ({
      label: 'Loại ' + (i + 1),
      value: i + 1
    }))
  )

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

export { SelectTypeGenerate }
