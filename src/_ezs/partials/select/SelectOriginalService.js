import React from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import ProdsAPI from 'src/_ezs/api/prods.api'

function SelectOriginalService(props) {
  async function loadOptions(search, loadedOptions, { page }) {
    let { data } = await ProdsAPI.originalServices({
      key: search,
      pi: page,
      ps: 20
    })
    return {
      options: data?.lst
        ? data?.lst.map(x => ({ ...x, label: x.Title, value: x.ID }))
        : [],
      hasMore: data?.pcount ? page < data?.pcount : false,
      additional: {
        page: page + 1
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
        placeholder="Chọn dịch vụ gốc"
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

export { SelectOriginalService }
