import React from 'react'
import { useFormContext } from 'react-hook-form'
import {
  SelectCategories,
  SelectNews,
  SelectProds
} from 'src/_ezs/partials/select'

function RenderTypeLink(props) {
  const { watch } = useFormContext()
  const watchForm = watch()

  switch (watchForm.TypeLink) {
    case 'NEWS':
      return (
        <div className="mt-2">
          <SelectNews
            className="select-control"
            placeholder="Chọn bài viết"
            noOptionsMessage={() => 'Không có dữ liệu'}
          />
        </div>
      )
    case 'NEWS_DETAIL':
      return (
        <div className="mt-2">
          <SelectNews
            className="select-control"
            placeholder="Chọn bài viết viết"
            noOptionsMessage={() => 'Không có dữ liệu'}
          />
        </div>
      )
    case 'CATE_ID':
      return (
        <div className="mt-2">
          <SelectCategories
            isClearable
            Type="SP,DV"
            className="select-control"
            menuPosition="fixed"
            styles={{
              menuPortal: base => ({
                ...base,
                zIndex: 9999
              })
            }}
            menuPortalTarget={document.body}
            placeholder="Chọn danh mục"
            noOptionsMessage={() => 'Danh mục trống.'}
            isValidNewOption={() => false}
          />
        </div>
      )
    case 'PROD_ID':
      return (
        <div className="mt-2">
          <SelectProds
            isClearable
            className="select-control"
            menuPosition="fixed"
            styles={{
              menuPortal: base => ({
                ...base,
                zIndex: 9999
              })
            }}
          />
        </div>
      )
    default:
      return <></>
  }
}

export default RenderTypeLink
