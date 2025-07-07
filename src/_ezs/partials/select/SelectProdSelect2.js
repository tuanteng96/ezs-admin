import React from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import ProdsAPI from 'src/_ezs/api/prods.api'

function SelectProdSelect2({ Params, Key = '', removes = [], ...props }) {
  async function loadOptions(search, loadedOptions, { page }) {
    let { data } = await ProdsAPI.getListSelect2({ ...Params, q: search })

    let newRs = data?.data
      ? data?.data
          .map(x => ({
            ...x,
            label: `${x.text} (${x.suffix})`,
            value: x.id
          }))
          .filter(x => !removes.includes(x.id))
      : []

    return {
      options: newRs,
      hasMore: false,
      additional: {
        page: 1
      }
    }
  }

  return (
    <AsyncPaginate
      key={Key}
      loadOptions={loadOptions}
      additional={{
        page: 1
      }}
      classNamePrefix="select"
      placeholder="Chọn mặt hàng"
      noOptionsMessage={() => 'Không có dữ liệu'}
      menuPortalTarget={document.body}
      menuPosition="fixed"
      styles={{
        menuPortal: base => ({
          ...base,
          zIndex: 9999
        })
      }}
      {...props}
    />
  )
}

export { SelectProdSelect2 }
