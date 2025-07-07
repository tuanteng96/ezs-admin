import React from 'react'
import { createFilter } from 'react-select';
import CreatableSelect from 'react-select/creatable'

const filterConfig = {
  ignoreCase: true,
  matchFrom: 'start', // Only match if the input starts with the option's label/value
};

const customFilter = createFilter(filterConfig);


const SelectVAT = ({ value, ...props }) => {
  let data = [
    {
      label: 'KKKNT',
      value: -2
    },
    {
      label: 'KCT',
      value: -1
    },
    {
      value: 0,
      label: 'VAT 0%'
    },
    {
      value: 5,
      label: 'VAT 5%'
    },
    {
      value: 8,
      label: 'VAT 8%'
    },
    {
      value: 10,
      label: 'VAT 10%'
    },
    {
      value: -3,
      label: 'Không xuất hoá đơn'
    }
  ]
  
  const getValue = val => {
    
    if (val === '') return null
    let index = data.findIndex(x => x.value === Number(val))
    if (index > -1) {
      return data[index]
    }
    return {
      label: `VAT Khác: ${val}%`,
      value: val
    }
  }

  const formatCreateLabel = (val) => {
    let index = data.findIndex(x => x.value === Number(val))
    if(index > -1) {
      return data[index].label
    }
    return `VAT Khác: ${val}%`
  }

  return (
    <div>
      <CreatableSelect
        value={getValue(value)}
        classNamePrefix="select"
        options={data}
        placeholder="Chọn hoặc nhập VAT"
        noOptionsMessage={() => 'Không có dữ liệu'}
        menuPosition="fixed"
        styles={{
          menuPortal: base => ({
            ...base,
            zIndex: 9999
          })
        }}
        filterOption={customFilter}
        menuPortalTarget={document.body}
        createOptionPosition="first"
        isValidNewOption={(inputValue, selectValue, options) => {
          let returnValue = false
          options.forEach(option => {
            if (
              inputValue &&
              inputValue.toLowerCase() !== option.label.toLowerCase() &&
              option.value !== Number(inputValue)
            ) {
              returnValue = true
            }
          })
          if (Number(inputValue) < 0) returnValue = false
          return returnValue
        }}
        formatCreateLabel={val =>
          val && Number(val) > -1 ? <span>{formatCreateLabel(val)}</span> : <></>
        }
        // onCreateOption={inputValue => {
        //   props.onChange(inputValue)
        // }}
        {...props}
      />
    </div>
  )
}

export { SelectVAT }
