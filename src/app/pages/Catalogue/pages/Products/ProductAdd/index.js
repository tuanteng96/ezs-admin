import {
  XMarkIcon,
  QuestionMarkCircleIcon,
  ReceiptPercentIcon
} from '@heroicons/react/24/outline'
import { AnimatePresence, m } from 'framer-motion'
import React, { useEffect } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import {
  Outlet,
  useLocation,
  useMatch,
  useNavigate,
  useParams
} from 'react-router-dom'
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
import Tooltip from 'rc-tooltip'
import { clsx } from 'clsx'
import { ProductCombo } from './components/ProductCombo'
import { useMutation, useQuery } from '@tanstack/react-query'
import ProdsAPI from 'src/_ezs/api/prods.api'
import { toast } from 'react-toastify'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import PriceCost from './components/PriceCost'

const schemaAdd = yup
  .object({
    Title: yup.string().required('Vui lòng nhập tên sản phẩm'),
    DynamicID: yup.string().required('Vui lòng nhập mã sản phẩm'),
    Type: yup.object().required('Vui lòng chọn danh mục')
  })
  .required()

function ProductAdd(props) {
  const navigate = useNavigate()
  const { id } = useParams()
  const { search, pathname, state } = useLocation()
  const isAddMode =
    useMatch('/catalogue/products/add') ||
    pathname.includes('/catalogue/products/add')
  const [showImages, setShowImages] = useState(false)

  const methods = useForm({
    defaultValues: {
      ID: 0,
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
      RenewDate: new Date(),
      KpiType: '',
      BonusSale: '',
      BonusSale2: '',
      Type: '',
      Manu: '',
      StockUnit: '',
      IsPublic: 0,
      IsDisplayPrice: 0,
      InDays: 360,
      ComboList: [{ Id: '', qty: '', price: '', addfee: '' }]
    },
    resolver: yupResolver(schemaAdd)
  })

  const { control, handleSubmit, watch, reset, setValue, setError } = methods
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

  const { isLoading } = useQuery({
    queryKey: ['ProductToID', id],
    queryFn: async () => {
      const { data } = await ProdsAPI.getListProdsProduct({
        filter: {
          bystock: null,
          ID: id
        },
        pi: 1,
        ps: 1
      })
      return data.list && data.list.length > 0 ? data.list[0] : ''
    },
    enabled: !isAddMode,
    onSuccess: data => {
      if (data) {
        reset({
          ID: data.ID,
          Title: data?.Title || '',
          Desc: data?.Desc || '',
          Detail: data.Detail || '',
          Status: data.Status || '',
          DynamicID: data.DynamicID || '',
          Thumbnail: data.Thumbnail || '',
          PhotoList: data.PhotoList
            ? data?.PhotoList.map(image => ({
                Src: image
              }))
            : [],
          OnStocks:
            data.OnStocks === '*'
              ? [
                  {
                    label: 'Tất cả cơ sở',
                    value: '*'
                  }
                ]
              : data?.OnStockList.map(x => ({
                  ...x,
                  label: x.Title,
                  value: x.ID
                })),
          PriceProduct: data.PriceProduct || '',
          PriceBase: data.PriceBase || '',
          RenewDate: data.RenewDate ? new Date(data.RenewDate) : new Date(),
          KpiType: data?.KpiType
            ? {
                label: 'Loại ' + data.KpiType,
                value: data?.KpiType
              }
            : '',
          BonusSale: data.BonusSale || '',
          BonusSale2: data.BonusSale2 || '',
          Type: data?.Type
            ? {
                label: data?.TypeName,
                value: data?.Type
              }
            : '',
          Manu: data?.Manu
            ? {
                label: data?.ManuName,
                value: data?.Manu
              }
            : '',
          StockUnit: data.StockUnit || '',
          IsPublic: data.IsPublic || 1,
          IsDisplayPrice: data.IsDisplayPrice || 1,
          InDays: data.InDays || 360,
          ComboList:
            data.ComboList && data.ComboList.length > 0
              ? [
                  ...data.ComboList.map(x => ({
                    Id: {
                      label: x.Product?.Title,
                      value: x.Id
                    },
                    qty: x.qty,
                    price: x.price,
                    addfee: x.addfee
                  })),
                  { Id: '', qty: '', price: '', addfee: '' }
                ]
              : [{ Id: '', qty: '', price: '', addfee: '' }]
        })
        if (data.PhotoList && data.PhotoList.length > 0) setShowImages(true)
      } else {
        navigate({
          pathname: state?.prevFrom || '/catalogue/products',
          search: search
        })
      }
    }
  })

  const addProducMutation = useMutation({
    mutationFn: body => ProdsAPI.addUpdateProduct(body)
  })

  const onSubmit = values => {
    let dataPost = {
      updates: [
        {
          ...values,
          ComboList: values.ComboList
            ? values.ComboList.map(x => ({
                ...x,
                Id: x?.Id?.value || ''
              })).filter(x => x.Id)
            : [],
          Manu: values?.Manu?.value || '',
          OnStocks: values?.OnStocks
            ? values?.OnStocks.map(x => x.value).join(',')
            : '',
          Status: values?.Status
            ? values?.Status.map(x => x.value).join(',')
            : '',
          Type: values?.Type?.value || '',
          KpiType: values?.KpiType?.value || '',
          PhotoList: values?.PhotoList ? values?.PhotoList.map(x => x.Src) : []
        }
      ]
    }
    addProducMutation.mutate(dataPost, {
      onSuccess: data => {
        if (!data?.data?.error) {
          toast.success(
            isAddMode
              ? 'Thêm mới sản phẩm thành công'
              : 'Sản phẩm đã được chỉnh sửa'
          )
          navigate({
            pathname: `/catalogue/products`,
            search: search
          })
        } else {
          toast.error(data?.data?.error)
          if (data?.data?.error === 'Mã SP51 đã được sử dụng cho sp/dv khác') {
            setError('DynamicID', {
              type: 'Server',
              message: 'Mã sản phẩm đã tồn tại'
            })
          }
        }
      }
    })
  }

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
              className="flex flex-col h-full"
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
                  <div className="flex items-center justify-center col-span-2 text-3xl font-bold transition dark:text-white">
                    {isAddMode ? 'Thêm mới sản phẩm' : 'Chỉnh sửa sản phẩm'}
                  </div>
                  <div className="absolute top-0 flex items-center justify-center h-full right-5">
                    <Button
                      type="submit"
                      className="relative flex items-center justify-center h-12 px-4 text-white transition rounded bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
                      loading={addProducMutation.isLoading}
                      disabled={addProducMutation.isLoading}
                    >
                      Lưu sản phẩm
                    </Button>
                  </div>
                </div>
              </div>
              {!isAddMode && isLoading && (
                <div className="grow relative">
                  <LoadingComponentFull bgClassName="bg-white" loading={true} />
                </div>
              )}

              {(isAddMode || !isLoading) && (
                <div className="overflow-auto grow">
                  <div className="max-w-screen-xl py-8 m-auto">
                    <div className="grid grid-cols-3 gap-5">
                      <div className="col-span-2">
                        <div className="mb-5 border border-gray-300 rounded-lg">
                          <div className="px-5 py-4 text-xl font-bold border-b border-gray-300">
                            Thông tin sản phẩm
                          </div>
                          <div className="p-5">
                            <div className="mb-3.5">
                              <div className="font-medium">Tên sản phẩm</div>
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
                                      placeholder="e.g Kem trị nám"
                                      {...field}
                                    />
                                  )}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-5 mb-3.5">
                              <div>
                                <div className="font-medium">Mã sản phẩm</div>
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
                                        //errorMessage={fieldState?.error?.message}
                                        {...field}
                                      />
                                    )}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="font-medium">Đơn vị</div>
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
                                <div className="font-medium">Giá nhập</div>
                                <div className="mt-1">
                                  <Controller
                                    name="PriceProduct"
                                    control={control}
                                    render={({
                                      field: { ref, ...field },
                                      fieldState
                                    }) => (
                                      <InputNumber
                                        placeholder="Nhập giá nhập"
                                        thousandSeparator={true}
                                        allowNegative={false}
                                        value={field.value}
                                        onValueChange={val =>
                                          field.onChange(val.floatValue || '')
                                        }
                                        errorMessageForce={fieldState?.invalid}
                                        errorMessage={
                                          fieldState?.error?.message
                                        }
                                      />
                                    )}
                                  />
                                </div>
                              </div>
                              <PriceCost />
                            </div>
                            <div className="grid grid-cols-2 gap-5 mb-3.5">
                              <div>
                                <div className="font-medium">
                                  Danh mục sản phẩm
                                </div>
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
                                        className={clsx(
                                          'select-control',
                                          fieldState?.invalid &&
                                            'select-control-error'
                                        )}
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
                                <div className="font-medium">
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

                            <div className="grid grid-cols-2 gap-5 mb-3.5">
                              <div>
                                <div className="font-medium">
                                  Số ngày dùng hết
                                </div>
                                <div className="mt-1">
                                  <Controller
                                    name={'InDays'}
                                    control={control}
                                    render={({
                                      field: { ref, ...field },
                                      fieldState
                                    }) => (
                                      <div className="relative">
                                        <InputNumber
                                          placeholder="Nhập số ngày"
                                          thousandSeparator={true}
                                          allowNegative={false}
                                          value={field.value}
                                          onValueChange={val =>
                                            field.onChange(val.floatValue || '')
                                          }
                                        />
                                        <Tooltip
                                          overlayClassName="text-white dark:text-dark-light"
                                          placement="top"
                                          trigger={['click']}
                                          overlay={
                                            <div className="py-1 text-gray-700 bg-white rounded shadow-lg dark:bg-dark-light dark:text-graydark-800">
                                              {[1, 3, 5, 7, 14, 30].map(
                                                (day, index) => (
                                                  <div
                                                    className={clsx(
                                                      'px-3 py-2 transition cursor-pointer hover:bg-light hover:text-primary text-sm font-medium',
                                                      day ===
                                                        Number(field.value) &&
                                                        'bg-light text-primary'
                                                    )}
                                                    key={index}
                                                    onClick={() => {
                                                      field.onChange(day)
                                                      document.body.click()
                                                    }}
                                                  >
                                                    {day} ngày
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          }
                                          align={{
                                            offset: [9, 0]
                                          }}
                                        >
                                          <div className="absolute right-0 flex items-center justify-center w-12 h-full cursor-pointer text-warning top-2/4 -translate-y-2/4">
                                            <QuestionMarkCircleIcon className="w-5" />
                                          </div>
                                        </Tooltip>
                                      </div>
                                    )}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="font-medium">Điểm bán</div>
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
                                        onChange={val => {
                                          let isSelectAll =
                                            val &&
                                            val.some(x => x.value === '*')
                                          let isValueAll =
                                            field.value &&
                                            field.value.some(
                                              x => x.value === '*'
                                            )
                                          if (isSelectAll && !isValueAll) {
                                            field.onChange([
                                              {
                                                label: 'Tất cả cơ sở',
                                                value: '*'
                                              }
                                            ])
                                          } else {
                                            field.onChange(
                                              val
                                                ? val.filter(
                                                    x => x.value !== '*'
                                                  )
                                                : []
                                            )
                                          }
                                        }}
                                        className="select-control"
                                        menuPosition="fixed"
                                        styles={{
                                          menuPortal: base => ({
                                            ...base,
                                            zIndex: 9999
                                          })
                                        }}
                                        menuPortalTarget={document.body}
                                        allOption={[
                                          {
                                            label: 'Tất cả cơ sở',
                                            value: '*'
                                          }
                                        ]}
                                      />
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <BonusSaleKPI />
                        </div>
                        <ProductCombo />
                        <div className="border border-gray-300 rounded-lg">
                          <div className="px-5 py-4 text-xl font-bold border-b border-gray-300">
                            Thông tin trên WEB / APP
                          </div>
                          <div className="p-5">
                            <div className="mb-3.5">
                              <div className="font-medium">Mô tả sản phẩm</div>
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
                              <div className="font-medium">Chi tiết</div>
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
                              <div className="font-medium">Trạng thái</div>
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
                                        field.onChange(
                                          val
                                            ? val.map(x => x.value).toString()
                                            : ''
                                        )
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
                              <div className="font-medium">Sắp xếp thứ tự</div>
                              <div className="mt-1">
                                <div className="relative">
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
                                  <button
                                    className="absolute right-0 top-0 h-full px-3 border-gray-300 text-primary font-medium"
                                    type="button"
                                    onClick={() =>
                                      setValue('RenewDate', new Date())
                                    }
                                  >
                                    Hôm nay
                                  </button>
                                </div>
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
                                  <>
                                    <Checkbox
                                      id="IsPublic"
                                      label={
                                        <span className="font-medium text-site-color">
                                          Ẩn sản phẩm trên Web / APP
                                        </span>
                                      }
                                      className="!bg-[#EBEDF3] checked:!bg-primary border-0"
                                      checked={Number(field.value) === 0}
                                      onChange={evt => {
                                        field.onChange(
                                          !evt.target.checked ? 1 : 0
                                        )
                                      }}
                                    />
                                  </>
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
                                      <span className="font-medium text-site-color">
                                        Ẩn giá trên Web / APP
                                      </span>
                                    }
                                    className="!bg-[#EBEDF3] checked:!bg-primary border-0"
                                    checked={Number(field.value) === 0}
                                    onChange={evt => {
                                      field.onChange(
                                        !evt.target.checked ? 1 : 0
                                      )
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
                          <div className="px-5 py-4 border-b border-gray-300">
                            <div className="text-xl font-bold mb-px">
                              Hình ảnh sản phẩm
                            </div>
                            <div>Kéo và thả ảnh để thay đổi thứ tự.</div>
                          </div>
                          <div className="px-5 py-4">
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
              )}
            </form>
          </m.div>
        </FormProvider>
      </AnimatePresence>
      <Outlet />
    </>
  )
}

export default ProductAdd
