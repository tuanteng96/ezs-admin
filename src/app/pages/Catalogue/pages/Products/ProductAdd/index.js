import { XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, m } from 'framer-motion'
import React, { useEffect } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { Outlet, useLocation, useMatch, useNavigate } from 'react-router-dom'
import { Button } from 'src/_ezs/partials/button'
import { UploadFile } from 'src/_ezs/partials/files'
import { ProductImages } from './components/ProductImages'
import { useState } from 'react'
import { Input, InputNumber } from 'src/_ezs/partials/forms'
import {
  SelectCategoryProds,
  SelectMeasure,
  SelectStocks,
  SelectStatusGenerate
} from 'src/_ezs/partials/select'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import { BonusSaleKPI } from './components/BonusSaleKPI'
import { CkEditor5 } from 'src/_ezs/partials/ckeditor'
import { Checkbox } from '@material-tailwind/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schemaAdd = yup
  .object({
    Title: yup.string().required('Vui lòng nhập tên sản phẩm')
  })
  .required()

function ProductAdd(props) {
  const navigate = useNavigate()
  const { search, pathname, state } = useLocation()
  const isAddMode = useMatch('/catalogue/products/add')

  const [showImages, setShowImages] = useState(false)

  const methods = useForm({
    defaultValues: {
      Title: '',
      Desc: '',
      Detail: '',
      Status: '',
      DynamicID: '',
      Thumbnail: '',
      PhotoList: [],
      OnStocks: '',
      PriceProduct: '',
      PriceBase: '',
      RenewDate: '',
      KpiType: '',
      BonusSale: '',
      BonusSale2: '',
      Type: '',
      Manu: '',
      StockUnit: '',
      IsPublic: 0,
      IsDisplayPrice: 0
    },
    resolver: yupResolver(schemaAdd)
  })

  const { control, handleSubmit, watch, reset } = methods
  const watchForm = watch()

  useEffect(() => {
    if (state?.OptionCreate) {
      let newOption = {
        label: state?.OptionCreate?.label,
        value: state?.OptionCreate?.value
      }
      reset({
        ...watchForm,
        Type: state?.OptionCreate?.typeCreate === 'SP' ? newOption : '',
        Manu: state?.OptionCreate?.typeCreate === 'NH' ? newOption : ''
      })
    }
    return () => {
      window.history.replaceState(null, '')
    }
    // eslint-disable-next-line
  }, [state?.OptionCreate, reset])

  const onSubmit = values => console.log(values)

  return (
    <>
      <AnimatePresence>
        <FormProvider {...methods}>
          <m.div
            className="fixed inset-0 bg-white dark:bg-dark-aside h-full z-[1010]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="h-full flex flex-col"
            >
              <div className="transition border-b z-[10] border-separator dark:border-dark-separator bg-white dark:bg-dark-aside">
                <div className="flex justify-center px-5 h-[85px] relative">
                  <div className="absolute top-0 flex items-center justify-center h-full left-5">
                    <div
                      className="flex items-center justify-center w-12 h-12 cursor-pointer dark:text-graydark-800"
                      onClick={() =>
                        navigate({
                          pathname: `/catalogue/products`,
                          search: search
                        })
                      }
                    >
                      <XMarkIcon className="w-9" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center col-span-2 text-3xl font-extrabold transition dark:text-white">
                    Thêm mới sản phẩm
                  </div>
                  <div className="absolute top-0 flex items-center justify-center h-full right-5">
                    <Button
                      type="submit"
                      className="relative flex items-center justify-center h-12 px-4 font-bold text-white transition rounded bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
                    >
                      Lưu sản phẩm
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grow overflow-auto">
                <div className="max-w-screen-xl m-auto py-8">
                  <div className="grid grid-cols-3 gap-5">
                    <div className="col-span-2">
                      <div className="border border-gray-300 rounded-lg mb-5">
                        <div className="border-b border-gray-300 py-4 px-5 font-semibold text-xl font-inter">
                          Thông tin sản phẩm
                        </div>
                        <div className="p-5">
                          <div className="mb-3.5">
                            <div className="font-bold">Tên sản phẩm</div>
                            <div className="mt-1">
                              <Controller
                                name="Title"
                                control={control}
                                render={({
                                  field: { ref, ...field },
                                  fieldState
                                }) => (
                                  <Input
                                    autoComplete="off"
                                    type="text"
                                    errorMessageForce={fieldState?.invalid}
                                    errorMessage={fieldState?.error?.message}
                                    {...field}
                                  />
                                )}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-5 mb-3.5">
                            <div>
                              <div className="font-bold">Mã sản phẩm</div>
                              <div className="mt-1">
                                <Controller
                                  name="DynamicID"
                                  control={control}
                                  render={({
                                    field: { ref, ...field },
                                    fieldState
                                  }) => (
                                    <Input
                                      placeholder="e.g ABC"
                                      autoComplete="off"
                                      type="text"
                                      errorMessageForce={fieldState?.invalid}
                                      errorMessage={fieldState?.error?.message}
                                      {...field}
                                    />
                                  )}
                                />
                              </div>
                            </div>
                            <div className="mb-3.5">
                              <div className="font-bold">Đơn vị</div>
                              <div className="mt-1">
                                <Controller
                                  name="StockUnit"
                                  control={control}
                                  render={({
                                    field: { ref, ...field },
                                    fieldState
                                  }) => (
                                    <SelectMeasure
                                      isClearable
                                      value={field.value}
                                      onChange={val => {
                                        field.onChange(val ? val.value : '')
                                      }}
                                      className="select-control"
                                      menuPortalTarget={document.body}
                                      menuPosition="fixed"
                                      styles={{
                                        menuPortal: base => ({
                                          ...base,
                                          zIndex: 9999
                                        })
                                      }}
                                    />
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-5 mb-3.5">
                            <div>
                              <div className="font-bold">Giá bán</div>
                              <div className="mt-1">
                                <Controller
                                  name="PriceProduct"
                                  control={control}
                                  render={({
                                    field: { ref, ...field },
                                    fieldState
                                  }) => (
                                    <InputNumber
                                      placeholder="Nhập giá bán"
                                      thousandSeparator={true}
                                      allowNegative={false}
                                      value={field.value}
                                      onValueChange={val =>
                                        field.onChange(val.floatValue || '')
                                      }
                                      errorMessageForce={fieldState?.invalid}
                                      errorMessage={fieldState?.error?.message}
                                    />
                                  )}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">Giá gốc</div>
                              <div className="mt-1">
                                <Controller
                                  name="PriceBase"
                                  control={control}
                                  render={({
                                    field: { ref, ...field },
                                    fieldState
                                  }) => (
                                    <InputNumber
                                      placeholder="Nhập giá gốc"
                                      thousandSeparator={true}
                                      allowNegative={false}
                                      value={field.value}
                                      onValueChange={val =>
                                        field.onChange(val.floatValue || '')
                                      }
                                      errorMessageForce={fieldState?.invalid}
                                      errorMessage={fieldState?.error?.message}
                                    />
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-5 mb-3.5">
                            <div>
                              <div className="font-bold">Danh mục sản phẩm</div>
                              <div className="mt-1">
                                <Controller
                                  name="Type"
                                  control={control}
                                  render={({
                                    field: { ref, ...field },
                                    fieldState
                                  }) => (
                                    <SelectCategoryProds
                                      isClearable
                                      value={field.value}
                                      onChange={val => {
                                        field.onChange(val)
                                      }}
                                      Type="SP"
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
                                      noOptionsMessage={() =>
                                        'Chưa có danh mục sản phẩm.'
                                      }
                                      createOptionPosition="first"
                                      isValidNewOption={(
                                        inputValue,
                                        selectValue,
                                        options
                                      ) => {
                                        let returnValue = false
                                        options.forEach(option => {
                                          if (
                                            inputValue &&
                                            inputValue.toLowerCase() !==
                                              option.label.toLowerCase()
                                          ) {
                                            returnValue = true
                                          }
                                        })
                                        return returnValue
                                      }}
                                      formatCreateLabel={() => (
                                        <span className="text-primary">
                                          Tạo mới danh mục
                                        </span>
                                      )}
                                      onCreateOption={inputValue => {
                                        navigate('add-category/sp', {
                                          state: {
                                            formState: {
                                              Title: inputValue
                                            },
                                            prevFrom: pathname
                                          }
                                        })
                                      }}
                                    />
                                  )}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">
                                Nhãn hàng sản phẩm
                              </div>
                              <div className="mt-1">
                                <Controller
                                  name="Manu"
                                  control={control}
                                  render={({
                                    field: { ref, ...field },
                                    fieldState
                                  }) => (
                                    <SelectCategoryProds
                                      isClearable
                                      value={field.value}
                                      onChange={val => {
                                        field.onChange(val)
                                      }}
                                      Type="NH"
                                      className="select-control"
                                      menuPosition="fixed"
                                      styles={{
                                        menuPortal: base => ({
                                          ...base,
                                          zIndex: 9999
                                        })
                                      }}
                                      menuPortalTarget={document.body}
                                      placeholder="Chọn nhãn hàng"
                                      noOptionsMessage={() =>
                                        'Chưa có nhãn hàng.'
                                      }
                                      createOptionPosition="first"
                                      isValidNewOption={(
                                        inputValue,
                                        selectValue,
                                        options
                                      ) => {
                                        let returnValue = false
                                        options.forEach(option => {
                                          if (
                                            inputValue &&
                                            inputValue.toLowerCase() !==
                                              option.label.toLowerCase()
                                          ) {
                                            returnValue = true
                                          }
                                        })
                                        return returnValue
                                      }}
                                      formatCreateLabel={() => (
                                        <span className="text-primary">
                                          Tạo mới nhãn hàng
                                        </span>
                                      )}
                                      onCreateOption={inputValue => {
                                        navigate('add-category/nh', {
                                          state: {
                                            formState: {
                                              Title: inputValue
                                            },
                                            prevFrom: pathname
                                          }
                                        })
                                      }}
                                    />
                                  )}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mb-3.5">
                            <div className="font-bold">Điểm bán</div>
                            <div className="mt-1">
                              <Controller
                                name={`OnStocks`}
                                control={control}
                                render={({
                                  field: { ref, ...field },
                                  fieldState
                                }) => (
                                  <SelectStocks
                                    isClearable
                                    isMulti
                                    value={field.value}
                                    onChange={val => field.onChange(val)}
                                    className="select-control"
                                    menuPosition="fixed"
                                    styles={{
                                      menuPortal: base => ({
                                        ...base,
                                        zIndex: 9999
                                      })
                                    }}
                                    menuPortalTarget={document.body}
                                  />
                                )}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">
                              Thời gian sử dụng hết
                            </div>
                            <div className="mt-1">
                              <Controller
                                name={`RenewDate`}
                                control={control}
                                render={({
                                  field: { ref, ...field },
                                  fieldState
                                }) => (
                                  <InputDatePicker
                                    placeholderText="e.g HH:mm DD-MM-YYYY"
                                    selected={field.value}
                                    onChange={field.onChange}
                                    showTimeSelect
                                    dateFormat="HH:mm dd-MM-yyyy"
                                    timeFormat="HH:mm"
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </div>
                        <BonusSaleKPI />
                      </div>
                      <div className="border border-gray-300 rounded-lg">
                        <div className="border-b border-gray-300 py-4 px-5 font-semibold text-xl font-inter">
                          Thông tin trên WEB / APP
                        </div>
                        <div className="p-5">
                          <div className="mb-3.5">
                            <div className="font-bold">Mô tả sản phẩm</div>
                            <div className="mt-1">
                              <Controller
                                name="Desc"
                                control={control}
                                render={({
                                  field: { ref, ...field },
                                  fieldState
                                }) => (
                                  <CkEditor5
                                    value={field.value}
                                    onChange={val => field.onChange(val)}
                                    placeholder="Nhập mô tả"
                                  />
                                )}
                              />
                            </div>
                          </div>
                          <div className="mb-3.5">
                            <div className="font-bold">Chi tiết</div>
                            <div className="mt-1">
                              <Controller
                                name="Detail"
                                control={control}
                                render={({
                                  field: { ref, ...field },
                                  fieldState
                                }) => (
                                  <CkEditor5
                                    className="ck-content"
                                    value={field.value}
                                    onChange={val => field.onChange(val)}
                                    placeholder="Nhập chi tiết"
                                  />
                                )}
                              />
                            </div>
                          </div>
                          <div className="mb-3.5">
                            <div className="font-bold">Trạng thái</div>
                            <div className="mt-1">
                              <Controller
                                name="Status"
                                control={control}
                                render={({
                                  field: { ref, ...field },
                                  fieldState
                                }) => (
                                  <SelectStatusGenerate
                                    isMulti
                                    isClearable
                                    value={field.value}
                                    onChange={val => {
                                      field.onChange(val)
                                    }}
                                    className="select-control"
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    styles={{
                                      menuPortal: base => ({
                                        ...base,
                                        zIndex: 9999
                                      })
                                    }}
                                  />
                                )}
                              />
                            </div>
                          </div>
                          <div className="mb-3.5">
                            <div className="font-bold">Sắp xếp thứ tự</div>
                            <div className="mt-1">
                              <Controller
                                name={`RenewDate`}
                                control={control}
                                render={({
                                  field: { ref, ...field },
                                  fieldState
                                }) => (
                                  <InputDatePicker
                                    placeholderText="e.g HH:mm DD-MM-YYYY"
                                    selected={field.value}
                                    onChange={field.onChange}
                                    showTimeSelect
                                    dateFormat="HH:mm dd-MM-yyyy"
                                    timeFormat="HH:mm"
                                  />
                                )}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-5">
                            <Controller
                              name="IsPublic"
                              control={control}
                              render={({
                                field: { ref, ...field },
                                fieldState
                              }) => (
                                <Checkbox
                                  id="IsPublic"
                                  label={
                                    <span className="font-bold text-site-color">
                                      Ẩn sản phẩm trên Web / APP
                                    </span>
                                  }
                                  className="!bg-[#EBEDF3] checked:!bg-primary border-0"
                                  checked={Number(field.value) === 1}
                                  onChange={evt => {
                                    field.onChange(!evt.target.checked ? 0 : 1)
                                  }}
                                />
                              )}
                            />
                            <Controller
                              name="IsDisplayPrice"
                              control={control}
                              render={({
                                field: { ref, ...field },
                                fieldState
                              }) => (
                                <Checkbox
                                  id="IsDisplayPrice"
                                  label={
                                    <span className="font-bold text-site-color">
                                      Ẩn giá giá trên Web / APP
                                    </span>
                                  }
                                  className="!bg-[#EBEDF3] checked:!bg-primary border-0"
                                  checked={Number(field.value) === 1}
                                  onChange={evt => {
                                    field.onChange(!evt.target.checked ? 0 : 1)
                                  }}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="border border-gray-300 rounded-lg">
                        <div className="border-b border-gray-300 py-4 px-5">
                          <div className="font-semibold text-xl font-inter">
                            Hình ảnh sản phẩm
                          </div>
                          <div>Kéo và thả ảnh để thay đổi thứ tự.</div>
                        </div>
                        <div className="py-4 px-5">
                          <Controller
                            name="Thumbnail"
                            control={control}
                            render={({ field }) => (
                              <UploadFile
                                className="aspect-square"
                                width="w-auto"
                                height="h-auto"
                                value={field.value}
                                onChange={val => {
                                  field.onChange(val)
                                  setShowImages(true)
                                }}
                              />
                            )}
                          />
                          {showImages && <ProductImages />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </m.div>
        </FormProvider>
      </AnimatePresence>
      <Outlet />
    </>
  )
}

export default ProductAdd
