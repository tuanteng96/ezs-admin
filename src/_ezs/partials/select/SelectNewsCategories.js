import React from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import NewsAPI from 'src/_ezs/api/news.api'

function SelectNewsCategories(props) {
  async function loadOptions(search, loadedOptions, { page }) {
    let { data } = await NewsAPI.categories('836')

    return {
      options: data?.list
        ? data.list.map(x => ({ ...x, label: x.item.Title, value: x.item.ID }))
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

export { SelectNewsCategories }
