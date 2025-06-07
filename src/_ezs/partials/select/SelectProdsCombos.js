//no-useless-concat
import React from 'react'
import ProdsAPI from 'src/_ezs/api/prods.api'
import { AsyncPaginate } from 'react-select-async-paginate'

const SelectProdsCombos = ({ ...props }) => {
  async function loadOptions(search, loadedOptions, { page }) {
    const { data } = await ProdsAPI.getProdsCombos(search)

    return {
      options: data?.data
        ? data?.data.map(x => ({
            ...x,
            label: x.text + ` (${x.suffix})`,
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
        noOptionsMessage={({ inputValue }) => {
          return inputValue
            ? 'Không có dữ liệu phù hợp với từ khoá ' + `'${inputValue}'`
            : 'Nhập từ khoá mặt hàng bạn cần ?'
        }}
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

export { SelectProdsCombos }
