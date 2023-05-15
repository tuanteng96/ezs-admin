import React from 'react'
import Select from 'react-select'
import { useAuth } from 'src/_ezs/core/Auth'

const SelectStocks = ({
  value,
  StockRoles,
  isMulti,
  allOption = [],
  ...props
}) => {
  const { Stocks } = useAuth()

  return (
    <div>
      <Select
        value={
          isMulti
            ? value
            : Stocks.filter(x => Number(x.value) === Number(value))
        }
        classNamePrefix="select"
        options={
          StockRoles ? [...allOption, ...StockRoles] : [...allOption, ...Stocks]
        }
        placeholder="Chọn cơ sở"
        noOptionsMessage={() => 'Không có dữ liệu'}
        isMulti={isMulti}
        {...props}
      />
    </div>
  )
}

export { SelectStocks }
