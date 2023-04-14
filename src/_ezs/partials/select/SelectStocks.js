import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { useAuth } from 'src/_ezs/core/Auth'

const SelectStocks = ({ value, StockRoles, ...props }) => {
  const { Stocks } = useAuth()
  return (
    <div>
      <Select
        value={Stocks.filter(x => Number(x.value) === Number(value))}
        classNamePrefix="select"
        options={StockRoles || Stocks}
        placeholder="Chọn cơ sở"
        noOptionsMessage={() => 'Không có dữ liệu'}
        {...props}
      />
    </div>
  )
}

SelectStocks.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export { SelectStocks }
