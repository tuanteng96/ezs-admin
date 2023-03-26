import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

const data = [
  {
    value: 0,
    label: 'Nữ'
  },
  {
    value: 1,
    label: 'Nam'
  }
]

const SelectGender = ({ value, ...props }) => {
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

SelectGender.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export { SelectGender }
