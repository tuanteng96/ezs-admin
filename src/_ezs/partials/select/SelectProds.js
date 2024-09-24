import React from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import ProdsAPI from 'src/_ezs/api/prods.api'

function SelectProds({ cates = '794,795', DynamicID = false, ...props }) {
  async function loadOptions(search, loadedOptions, { page }) {
    let { data } = await ProdsAPI.getList({
      cates: cates,
      key: search,
      pi: page,
      ps: 20
    })
    return {
      options: data?.data?.lst
        ? data?.data?.lst.map(x => ({
            ...x,
            label: DynamicID ? `[${x.source?.DynamicID}] ${x.title}` : x.title,
            value: x.id
          }))
        : [],
      hasMore: data?.data?.pcount ? page < data?.data?.pcount : false,
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

export { SelectProds }
