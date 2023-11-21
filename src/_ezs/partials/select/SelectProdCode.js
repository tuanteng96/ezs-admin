import React from 'react'
import WarehouseAPI from 'src/_ezs/api/warehouse.api'
import { AsyncPaginate } from 'react-select-async-paginate'

function SelectProdCode({ Params, Key, ...props }) {
  async function loadOptions(search, loadedOptions, { page }) {
    let { data } = await WarehouseAPI.getListProdCode({ ...Params, q: search })
    let options = [
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
        let index = options.findIndex(x => x.groupid === item.suffix)
        options[index].options.push({
          ...item,
          label: item.text,
          value: item.source.ID
        })
      }
    }
    return {
      options: options,
      hasMore: false,
      additional: {
        page: 1
      }
    }
  }

  return (
    <div>
      <AsyncPaginate
        key={Key}
        loadOptions={loadOptions}
        additional={{
          page: 1
        }}
        classNamePrefix="select"
        placeholder="Chọn sản phẩm, nvl"
        noOptionsMessage={() => 'Không có dữ liệu'}
        {...props}
      />
    </div>
  )
}

export { SelectProdCode }
