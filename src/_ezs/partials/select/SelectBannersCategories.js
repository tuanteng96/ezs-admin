import React from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import BannersAPI from 'src/_ezs/api/banners.api'

function SelectBannersCategories({
  errorMessage,
  errorMessageForce,
  ...props
}) {
  async function loadOptions(search, loadedOptions, { page }) {
    let { data } = await BannersAPI.categories({
      pi: page,
      ps: 100
    })
    return {
      options: data?.list
        ? data.list
            .map(x => ({ ...x, label: x.Title, value: x.ID }))
            .sort((a, b) =>
              (a['label'] || '')
                .toString()
                .localeCompare((b['label'] || '').toString())
            )
        : [],
      hasMore: page < data.pCount,
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
      {errorMessage && errorMessageForce && (
        <div className="mt-1.5 text-sm text-danger">{errorMessage}</div>
      )}
    </div>
  )
}

export { SelectBannersCategories }
