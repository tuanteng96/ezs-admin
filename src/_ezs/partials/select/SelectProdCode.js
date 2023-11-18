import React from 'react'
import WarehouseAPI from 'src/_ezs/api/warehouse.api'
import AsyncSelect from 'react-select/async'

function SelectProdCode({ Params, Key, ...props }) {
  const promiseOptions = inputValue =>
    new Promise(resolve => {
      if (Params) {
        WarehouseAPI.getListProdCode({ ...Params, q: inputValue }).then(
          ({ data }) => {
            let result = [
              {
                label: 'Sản phẩm',
                groupid: 'SP',
                options: []
              },
              {
                label: 'Nguyên vật liệu',
                groupid: 'NVL',
                options: []
              }
            ]
            if (data.data && data?.data.length > 0) {
              for (let item of data?.data) {
                let index = result.findIndex(x => x.groupid === item.suffix)
                result[index].options.push({
                  ...item,
                  label: item.text,
                  value: item.source.ID
                })
              }
            }
            resolve(result)
          }
        )
      } else {
        resolve([])
      }
    })

  return (
    <div>
      <AsyncSelect
        key={Key}
        cacheOptions
        defaultOptions
        loadOptions={promiseOptions}
        classNamePrefix="select"
        placeholder="Chọn sản phẩm, nvl"
        noOptionsMessage={() => 'Không có dữ liệu'}
        onInputChange={val => console.log(val)}
        {...props}
      />
    </div>
  )
}

export { SelectProdCode }
