import React from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import ProdsAPI from 'src/_ezs/api/prods.api'

function SelectProdsTypeName({ ...props }) {
  async function loadOptions(search, loadedOptions, { page }) {
    let { data } = await ProdsAPI.getListTypeName({
      key: search
    })
    return {
      options: data?.data
        ? data?.data.map(x => ({
            ...x,
            label: `[${x.suffix}] ${x.text}`,
            value: x.id
          }))
        : [],
      hasMore: false,
      additional: {
        page: 1
      }
    }
  }

  return (
    <div>
      <AsyncPaginate
        loadOptions={loadOptions}
        additional={{
          page: 1
        }}
        classNamePrefix="select"
        placeholder="Chọn sản phẩm, dịch vụ"
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
    </div>
  )
}

export { SelectProdsTypeName }
