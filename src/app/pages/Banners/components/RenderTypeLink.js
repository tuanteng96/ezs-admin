import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Input } from 'src/_ezs/partials/forms'
import {
  SelectAdvs,
  SelectCategoriesAsync,
  SelectNews,
  SelectNewsCategories,
  SelectOriginalService,
  SelectProds
} from 'src/_ezs/partials/select'

function RenderTypeLink(props) {
  const { watch, setValue, control } = useFormContext()
  const watchForm = watch()

  switch (watchForm.TypeLink) {
    case 'NEWS':
      return (
        <div className="mt-2">
          <SelectNewsCategories
            isClearable
            className="select-control"
            placeholder="Chọn danh mục bài viết"
            noOptionsMessage={() => 'Không có dữ liệu'}
            onChange={val => {
              setValue('Link', val ? '/news-list/' + val.value : '')
            }}
          />
        </div>
      )
    case 'NEWS_DETAIL':
      return (
        <div className="mt-2">
          <SelectNews
            isClearable
            className="select-control"
            placeholder="Chọn bài viết viết"
            noOptionsMessage={() => 'Không có dữ liệu'}
            onChange={val => {
              setValue('Link', val ? '/news/detail/' + val.value + '/' : '')
            }}
          />
        </div>
      )
    case 'CATE_ID':
      return (
        <div className="mt-2">
          <SelectCategoriesAsync
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
            onChange={val => {
              setValue('Link', val ? '/shop/' + val.value : '')
            }}
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
            onChange={val => {
              setValue('Link', val ? '/shop/detail/' + val.value : '')
            }}
          />
        </div>
      )
    case 'ADV_ID':
      return (
        <div className="mt-2">
          <SelectAdvs
            isClearable
            className="select-control"
            menuPosition="fixed"
            styles={{
              menuPortal: base => ({
                ...base,
                zIndex: 9999
              })
            }}
            onChange={val => {
              setValue('Link', val ? '/adv/' + val.value : '')
            }}
          />
        </div>
      )
    case 'SERVICE_ID':
      return (
        <div className="mt-2">
          <SelectOriginalService
            isClearable
            className="select-control"
            menuPosition="fixed"
            styles={{
              menuPortal: base => ({
                ...base,
                zIndex: 9999
              })
            }}
            onChange={val => {
              setValue('Link', val ? '/shop/selected/' + val.value : '')
            }}
          />
        </div>
      )
    case 'CATE_SERVICE_ID':
      return (
        <div className="mt-2">
          <SelectOriginalService
            isClearable
            className="select-control"
            menuPosition="fixed"
            styles={{
              menuPortal: base => ({
                ...base,
                zIndex: 9999
              })
            }}
            onChange={val => {
              setValue(
                'Link',
                val ? '/shop/list/795/' + val.value + '?cateid=795' : ''
              )
            }}
          />
        </div>
      )
    case 'BOOK_SERVICE':
      return (
        <div className="mt-2">
          <SelectOriginalService
            placeholder="Chọn dịch vụ"
            isClearable
            className="select-control"
            menuPosition="fixed"
            styles={{
              menuPortal: base => ({
                ...base,
                zIndex: 9999
              })
            }}
            onChange={val => {
              setValue('Link', val ? '/schedule/?SelectedId=' + val.value : '')
            }}
          />
        </div>
      )
    default:
      return (
        <>
          <div className="mt-2">
            <Controller
              name="Link"
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <Input
                  placeholder="e.g Link"
                  autoComplete="off"
                  type="text"
                  {...field}
                />
              )}
            />
          </div>
        </>
      )
  }
}

export default RenderTypeLink
