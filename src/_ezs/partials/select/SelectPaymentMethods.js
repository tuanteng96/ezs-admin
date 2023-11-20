import React from 'react'
import Select from 'react-select'

const data = [
  {
    value: 1,
    label: 'Tiền mặt'
  },
  {
    value: 2,
    label: 'Chuyển khoản'
  },
  {
    value: 3,
    label: 'Quẹt thẻ'
  }
]

const SelectPaymentMethods = ({ value, ...props }) => {
  return (
    <div>
      <Select
        value={data.filter(x => Number(x.value) === Number(value))}
        classNamePrefix="select"
        options={data}
        placeholder="Chọn giới tính"
        noOptionsMessage={() => 'Không có dữ liệu'}
        {...props}
      />
    </div>
  )
}

export { SelectPaymentMethods }
