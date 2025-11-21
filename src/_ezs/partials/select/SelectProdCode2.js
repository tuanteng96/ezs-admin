import React, { useEffect, useState } from 'react'
import WarehouseAPI from 'src/_ezs/api/warehouse.api'
import AsyncSelect from 'react-select/async'

function SelectProdCode2({ Params, Key = '', textAll, autoChange, ...props }) {
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    setReloadToken(prev => prev + 1)
  }, [Key])

  const loadOptions = async inputValue => {
    if (!Params || Object.keys(Params).length === 0) {
      return []
    }

    const { data } = await WarehouseAPI.getListProdCode({
      ...Params,
      q: inputValue
    })

    let options = [
      { label: 'Sản phẩm', groupid: 'SP', options: [] },
      { label: 'Nguyên vật liệu', groupid: 'NVL', options: [] }
    ]

    if (data?.data?.length > 0) {
      for (let item of data.data) {
        const idx = options.findIndex(x => x.groupid === item.suffix)
        if (idx > -1) {
          options[idx].options.push({
            ...item,
            label: `${
              item.source.OnStocks === '' ? '[Ngừng kinh doanh] ' : ''
            }[${item.source.DynamicID}] ${item.text}`,
            value: item.source.ID
          })
        }
      }
    }

    const allOptions = options.flatMap(x => x.options)

    if (textAll && allOptions.length > 1) {
      options.unshift({
        label: textAll,
        value: -1,
        Items: allOptions
      })
      if (autoChange) {
        props.onChange(options[0])
      }
    } else {
      if (allOptions.length === 1 && autoChange) {
        props.onChange(allOptions[0])
      }
      else {
        props.onChange(null)
      }
    }
    return options
  }

  return (
    <AsyncSelect
      debounceTimeout={400}
      key={`${Key}-${reloadToken}`}
      cacheOptions={false} // 🚫 tắt cache để luôn reload
      defaultOptions={!!Params}
      isClearable
      loadOptions={loadOptions}
      classNamePrefix="select"
      placeholder="Chọn sản phẩm, nvl"
      noOptionsMessage={() => 'Không có dữ liệu'}
      {...props}
    />
  )
}

export { SelectProdCode2 }
