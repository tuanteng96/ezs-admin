import React from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import NewsAPI from 'src/_ezs/api/news.api'

function SelectAdvs(props) {
  async function loadOptions(search, loadedOptions, { page }) {
    let { data } = await NewsAPI.advs()
    return {
      options: data?.data
        ? data.data.map(x => ({ ...x, label: x.Title, value: x.ID }))
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
        placeholder="Chọn bài viết"
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

export { SelectAdvs }
