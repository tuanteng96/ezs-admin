/* eslint-disable react/jsx-no-target-blank */

import React, { useState, useEffect, useRef } from 'react'
import {
  ArrowSmallLeftIcon,
  QuestionMarkCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm
} from 'react-hook-form'
import { Input, InputNumber } from 'src/_ezs/partials/forms'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button } from 'src/_ezs/partials/button'
import { FloatingPortal } from '@floating-ui/react'
import {
  SelectCategoriesAsync,
  SelectCategoryProds,
  SelectMeasure,
  SelectProdsTypeName,
  SelectStocks,
  SelectTypeGenerate
} from 'src/_ezs/partials/select'
import clsx from 'clsx'
import { Switch, Tab } from '@headlessui/react'
import StickyBox from 'react-sticky-box'
import ProdsAPI from 'src/_ezs/api/prods.api'
import { useProds } from '../../../ProdsLayout'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import { PickerAddCategories } from '../../../components'
import { useAuth } from 'src/_ezs/core/Auth'
import { CkEditor5 } from 'src/_ezs/partials/ckeditor'
import { UploadFile } from 'src/_ezs/partials/files'
import { toAbsolutePath, toAbsoluteUrl } from 'src/_ezs/utils/assetPath'
import { useRoles } from 'src/_ezs/hooks/useRoles'
import { useLayout } from 'src/_ezs/layout/LayoutProvider'
import Tooltip from 'rc-tooltip'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'

const OptionsExpiration = [
  {
    label: 'Không giới hạn',
    value: 'khong_gioi_han'
  },
  {
    value: '15',
    label: '15 ngày'
  },
  {
    value: '30',
    label: '30 ngày'
  },
  {
    value: '90',
    label: '3 tháng'
  },
  {
    value: '180',
    label: '6 tháng'
  },
  {
    value: '365',
    label: '1 năm'
  },
  {
    value: '1095',
    label: '3 năm'
  }
]

const getValueExpiration = val => {
  let index = OptionsExpiration.findIndex(
    x => x.value.toString() === val.toString()
  )
  if (index > -1) return OptionsExpiration[index]
  return {
    label: `${val} ngày`,
    value: val.toString()
  }
}

const OptionsStatus = [
  {
    label: 'Hàng Mới',
    value: '1'
  },
  {
    value: '2',
    label: 'Hàng Hot'
  },
  {
    value: '3',
    label: 'Hàng Sale'
  }
]

const OptionsCondition = [
  {
    label: 'Được sử dụng 100% giá trị khi chưa thanh toán hết',
    value: 'CHUA_THANH_TOAN_HET'
  },
  {
    label: 'Theo phần trăm thanh toán',
    value: 'TY_LE_THANH_TOAN'
  },
  {
    label: 'Thanh toán hết',
    value: 'THANH_TOAN_HET'
  }
]

const schemaAddEdit = yup
  .object({
    Title: yup.string().required('Vui lòng nhập tên thẻ tiền'),
    DynamicID: yup.string().required('Vui lòng nhập mã thẻ tiền')
  })
  .required()

function PickerAddEdit({ children, initialValues }) {
  const [visible, setVisible] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  let elRef = useRef()

  let { MenuActive } = useProds()

  const { Stocks } = useAuth()
  const { GlobalConfig } = useLayout()

  const { ReadApp_type, ReadCate } = useRoles(['ReadApp_type', 'ReadCate'])

  const queryClient = useQueryClient()

  const methods = useForm({
    defaultValues: {
      Title: '',
      IsPublic: true,
      IsReady: 1,
      Type: '',
      Types: '',
      OnStocks: [
        {
          label: 'Tất cả cơ sở',
          value: '*'
        }
      ],
      Combo: '',
      IsService: 0,
      IsAddFee: 0,
      Bonus: 0,
      IsDisplayPrice: true,
      InDays: 365,
      IsMoney: true,
      IsNVL: false,
      BonusSale2: '',
      DynamicID: '',
      StockUnit: 'Gói',
      PriceBase: '',
      Manu: '',
      Meta: '',
      PriceProduct: '',
      BonusSaleJSON: '', //[{"Level":"HOC_VIEN","Salary":"10"},{"Level":"THU_VIEC","Salary":"10"},{"Level":"CHINH_THUC","Salary":null},{"Level":"CHUYEN_VIEN","Salary":null},{"Level":"CHUYEN_GIA","Salary":null}]
      BonusSale: '',
      KpiType: '',
      VAT: '',
      OtherUnit: [{ ProdID: '', ProdUnit: '', Qty: '', Unit: '' }],
      id: 0,
      Desc: '',
      Detail: '',
      PhotoList: [],
      Status: '',
      MoneyInfo: {
        limitInputShow: true,
        ByDomain: {},
        StockUnit: '',
        inDays: 'khong_gioi_han',
        condt: 'CHUA_THANH_TOAN_HET',
        total: '',
        prodValue: '',
        serviceValue: '',
        limit: { prods: '', cates: '', manus: '' },
        isSpendingLimits: false, // Is giới hạn chi tiêu
        isCategoryLimits: false // Is Giới hạn danh mục
      },
      RenewDate: new Date()
    },
    resolver: yupResolver(schemaAddEdit)
  })

  const { control, handleSubmit, reset, setValue, watch } = methods

  const { fields: fieldsBonusSale } = useFieldArray({
    control,
    name: 'BonusSaleJSON'
  })

  const {
    fields: fieldsImage,
    append: appendImage,
    remove: removeImage
  } = useFieldArray({
    control,
    name: 'PhotoList'
  })

  useEffect(() => {
    if (initialValues) {
      setValue('id', initialValues?.ID || 0)
      setValue('Title', initialValues?.Title || '')
      setValue('DynamicID', initialValues?.DynamicID || '')
      setValue(
        'Type',
        initialValues?.Type
          ? { label: initialValues?.TypeName, value: initialValues?.Type }
          : ''
      )
    } else {
      reset()
    }
    setSelectedIndex(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  useEffect(() => {
    if (elRef && elRef.current) {
      elRef.current.scrollTo(0, 0)
    }
  }, [selectedIndex])

  const onHide = () => {
    setVisible(false)
  }

  let initialMaterials = useQuery({
    queryKey: ['initialMaterials', { MenuActive }],
    queryFn: async () => {
      let dataPost = {
        id: 0,
        '[Title]': '',
        '[IsPublic]': 0,
        '[IsReady]': 1,
        '[Type]': MenuActive?.ID,
        '[Types]': MenuActive?.ID,
        '[OnStocks]': '*',
        '[Combo]': '',
        '[IsService]': 0,
        '[IsAddFee]': 0,
        '[Bonus]': 0,
        '[IsDisplayPrice]': 1,
        '[InDays]': 365,
        '[IsMoney]': true,
        '[IsNVL]': false
      }

      var bodyFormData = new FormData()
      for (const property in dataPost) {
        bodyFormData.append(property, dataPost[property])
      }

      let { data } = await ProdsAPI.getInitialProdId(bodyFormData)
      return data?.data
    },
    onSuccess: data => {
      if (data?.DynamicID) {
        setValue('DynamicID', data?.DynamicID)
      }
    },
    enabled: Boolean(visible && MenuActive?.ID && !initialValues?.ID)
  })

  let initialMaterialsID = useQuery({
    queryKey: ['initialMaterialsID', initialValues],
    queryFn: async () => {
      let { data } = await ProdsAPI.getEditProdId({
        key: initialValues?.ID,
        foredit: initialValues?.ID
      })
      return data?.data?.list && data?.data?.list.length > 0
        ? data?.data?.list[0]
        : null
    },
    onSuccess: data => {
      if (data) {
        if (data?.OnStocks) {
          let allStocks = data?.OnStocks.indexOf('*')
          if (allStocks > -1) {
            setValue('OnStocks', [
              {
                label: 'Tất cả cơ sở',
                value: '*'
              }
            ])
          } else {
            let newOnStocks = Stocks.filter(o =>
              data?.OnStocks.split(',')
                .map(x => Number(x))
                .some(x => x === o.ID)
            )
            setValue('OnStocks', newOnStocks)
          }
        } else {
          setValue('OnStocks', [
            {
              label: '(Ẩn)',
              value: '-1'
            }
          ])
        }
        setValue('RenewDate', data?.RenewDate || new Date())
        setValue(
          'IsDisplayPrice',
          data?.IsDisplayPrice && Number(data?.IsDisplayPrice) > 0
        )

        setValue('IsPublic', data?.IsPublic && Number(data?.IsPublic) > 0)

        setValue('PriceBase', data?.PriceBase || '')
        setValue('PriceProduct', data?.PriceProduct || '')
        setValue('VAT', data?.VAT || '')
        setValue(
          'KpiType',
          data?.KpiType
            ? { value: data?.KpiType, label: `Loại ${data?.KpiType}` }
            : null
        )
        setValue('BonusSale2', data?.BonusSale2 || '')
        setValue('BonusSale', data?.BonusSale || '')
        setValue('StockUnit', data?.StockUnit || '')
        setValue(
          'Manu',
          data?.Manu
            ? {
                label: data?.ManuName,
                value: data?.Manu
              }
            : null
        )

        let MoneyInfo = JSON.parse(data?.MoneyInfo)

        setValue('MoneyInfo', {
          ...MoneyInfo,
          isCategoryLimits: Boolean(
            MoneyInfo?.limit?.cates ||
              MoneyInfo?.limit?.manus ||
              MoneyInfo?.limit?.prods
          ),
          isSpendingLimits: Boolean(
            MoneyInfo?.prodValue || MoneyInfo?.serviceValue
          ),
          limit: {
            cates: MoneyInfo?.limit?.cateList
              ? MoneyInfo?.limit?.cateList.map(x => ({
                  label: x.Title,
                  value: x.ID
                }))
              : [],
            manus: MoneyInfo?.limit?.manuList
              ? MoneyInfo?.limit?.manuList.map(x => ({
                  label: x.Title,
                  value: x.ID
                }))
              : [],
            prods: MoneyInfo?.limit?.prodList
              ? MoneyInfo?.limit?.prodList.map(x => ({
                  label: x.Title,
                  value: x.ID
                }))
              : []
          }
        })
        let BonusSaleJSON = data?.BonusSaleJSON
          ? JSON.parse(data.BonusSaleJSON)
          : null
        if (BonusSaleJSON) {
          setValue('BonusSaleJSON', BonusSaleJSON)
        }

        setValue('Desc', data?.Desc || '')
        setValue('Detail', data?.Detail || '')
        setValue(
          'PhotoList',
          data?.PhotoList ? data?.PhotoList.map(x => ({ image: x })) : []
        )
      }
    },
    enabled: Boolean(visible && initialValues?.ID)
  })

  const LevelsMaterials = useQuery({
    queryKey: ['LevelsMaterials'],
    queryFn: async () => {
      const { data } = await ProdsAPI.getLevelProdId()
      return data?.data?.levels || []
    },
    enabled: visible
  })

  const addEditMutation = useMutation({
    mutationFn: async body => {
      let rs = await ProdsAPI.addEdit(body)
      await queryClient.invalidateQueries({
        queryKey: ['ListProdsMoneyCard']
      })
      return rs
    }
  })

  const onSubmit = values => {
    let newValues = {
      ...values,
      IsDisplayPrice: values?.IsDisplayPrice ? '1' : '0',
      IsPublic: values?.IsPublic ? '1' : '0',
      Type: values?.Type?.value || '',
      OnStocks: values?.OnStocks
        ? values?.OnStocks.filter(x => x.value !== '-1')
            .map(x => x.value)
            .toString()
        : '',
      Meta: '',
      Manu: values?.Manu?.value || '',
      KpiType: values?.KpiType?.value || '',
      PhotoList: values?.PhotoList ? values?.PhotoList.map(x => x.image) : [],
      MoneyInfo: {
        ...values?.MoneyInfo,
        limit: {
          cates: values?.MoneyInfo?.limit?.cates
            ? values?.MoneyInfo?.limit?.cates.map(x => x.value).toString()
            : '',
          manus: values?.MoneyInfo?.limit?.manus
            ? values?.MoneyInfo?.limit?.manus.map(x => x.value).toString()
            : '',
          prods: values?.MoneyInfo?.limit?.prods
            ? values?.MoneyInfo?.limit?.prods.map(x => x.value).toString()
            : ''
        }
      }
    }

    var bodyFormData = new FormData()
    for (const property in newValues) {
      if (property === 'id') {
        bodyFormData.append(property, newValues[property])
      } else if (property === 'OtherUnit') {
      } else if (typeof newValues[property] === 'object') {
        bodyFormData.append(
          `[${property}]`,
          JSON.stringify(newValues[property])
        )
      } else if (property === 'Desc' || property === 'Detail') {
        bodyFormData.append(`[${property}]`, encodeURI(newValues[property]))
      } else {
        bodyFormData.append(`[${property}]`, newValues[property])
      }
    }

    addEditMutation.mutate(bodyFormData, {
      onSuccess: ({ data }) => {
        if (data?.error) {
          toast.error(data?.error)
        } else {
          toast.success(
            initialValues?.ID ? 'Cập nhật thành công.' : 'Thêm mới thành công.'
          )
          onHide()
        }
      }
    })
  }

  let { BonusSaleJSON, MoneyInfo } = watch()

  return (
    <>
      {children({
        open: () => setVisible(true)
      })}
      {visible && (
        <FloatingPortal root={document.body}>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="fixed top-0 left-0 z-[1003] bg-white h-full w-full flex flex-col"
              autoComplete="off"
              onKeyDown={e => {
                if (e.key === 'Enter') e.preventDefault()
              }}
            >
              <div className="flex justify-between p-4 border-b sm:px-8 sm:py-6 border-separator">
                <div className="flex items-center">
                  <div
                    className="flex items-center justify-center h-full pr-4 cursor-pointer"
                    onClick={onHide}
                  >
                    <ArrowSmallLeftIcon className="w-7 sm:w-8" />
                  </div>
                  <div className="flex items-center text-xl font-semibold sm:text-2xl lg:text-3xl">
                    {initialValues?.ID
                      ? 'Chỉnh sửa thẻ tiền'
                      : 'Thêm mới thẻ tiền'}
                  </div>
                </div>
                <div className="hidden gap-3 sm:flex">
                  <Button
                    onClick={onHide}
                    type="button"
                    className="relative flex items-center h-12 px-6 font-bold transition border border-gray-300 rounded shadow-lg dark:border-gray-700 hover:border-gray-800 focus:outline-none focus:shadow-none"
                  >
                    Hủy
                  </Button>
                  <Button
                    loading={addEditMutation.isLoading}
                    disabled={addEditMutation.isLoading}
                    type="submit"
                    className="relative flex items-center h-12 px-6 font-semibold text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
                  >
                    {initialValues?.ID ? 'Lưu thay đổi' : 'Thêm mới'}
                  </Button>
                </div>
              </div>
              {(
                initialValues?.ID
                  ? initialMaterialsID?.isLoading
                  : initialMaterials?.isLoading
              ) ? (
                <div className="relative grow">
                  <LoadingComponentFull bgClassName="bg-white" loading={true} />
                </div>
              ) : (
                <div className="overflow-auto lg:py-10 grow sm:p-4" ref={elRef}>
                  <Tab.Group
                    selectedIndex={selectedIndex}
                    onChange={setSelectedIndex}
                    manual
                  >
                    <div className="flex xl:flex-row flex-col w-full max-w-6xl mx-auto sm:gap-6 xl:gap-[80px]">
                      {ReadCate?.hasRight && (
                        <StickyBox style={{ zIndex: 1000 }}>
                          <div className="xl:w-[300px] max-w-[780px] sticky z-10 top-0 mx-auto">
                            <Tab.List className="sm:border border-b border-separator sm:border-[#e5e5e5] bg-white sm:rounded-lg px-4 py-3 sm:py-4 flex xl:flex-col gap-1.5 overflow-auto">
                              {[
                                {
                                  Title: 'Thông tin cơ bản',
                                  hasRight: ReadCate?.hasRight
                                },
                                {
                                  Title: 'Thông tin trên WEB / APP',
                                  hasRight: ReadApp_type?.hasRight
                                }
                              ]
                                .filter(x => x.hasRight)
                                .map((item, index) => (
                                  <Tab
                                    key={index}
                                    className={({ selected }) =>
                                      clsx(
                                        'text-left block px-3.5 py-3 hover:bg-[#f6f6f6] bg-[#f6f6f6] text-[14px] rounded-lg transition-all font-medium whitespace-nowrap',
                                        selected
                                          ? 'bg-primarylight text-primary'
                                          : 'xl:bg-transparent'
                                      )
                                    }
                                  >
                                    {item.Title}
                                  </Tab>
                                ))}
                            </Tab.List>
                          </div>
                        </StickyBox>
                      )}

                      <Tab.Panels className="w-full flex-1 max-w-[780px] mx-auto p-4 sm:p-0">
                        {ReadCate?.hasRight && (
                          <Tab.Panel>
                            <div>
                              <div className="mb-4">
                                <div className="mb-1 text-lg font-semibold sm:text-2xl">
                                  Thông tin cơ bản
                                </div>
                              </div>
                              <div>
                                <div className="mb-4 last:mb-0">
                                  <div className="font-medium">
                                    Tên thẻ tiền *
                                  </div>
                                  <div className="mt-1">
                                    <Controller
                                      name="Title"
                                      control={control}
                                      render={({
                                        field: { ref, ...field },
                                        fieldState
                                      }) => (
                                        <Input
                                          placeholder="Nhập tên thẻ tiền"
                                          value={field.value}
                                          errorMessageForce={
                                            fieldState?.invalid
                                          }
                                          errorMessage={
                                            fieldState?.error?.message
                                          }
                                          {...field}
                                          onChange={e => {
                                            field.onChange(e.target.value)
                                          }}
                                        />
                                      )}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 last:mb-0">
                                  <div>
                                    <div className="font-medium">
                                      Mã thẻ tiền *
                                    </div>
                                    <div className="mt-1">
                                      <Controller
                                        name="DynamicID"
                                        control={control}
                                        render={({
                                          field: { ref, ...field },
                                          fieldState
                                        }) => (
                                          <Input
                                            placeholder="Nhập mã"
                                            value={field.value}
                                            errorMessageForce={
                                              fieldState?.invalid
                                            }
                                            //errorMessage={fieldState?.error?.message}
                                            {...field}
                                            onChange={e => {
                                              field.onChange(e.target.value)
                                            }}
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 sm:gap-2">
                                    <div>
                                      <div className="font-medium">
                                        Đơn vị *
                                      </div>
                                      <div className="mt-1">
                                        <Controller
                                          name="StockUnit"
                                          control={control}
                                          render={({
                                            field: { ref, ...field },
                                            fieldState
                                          }) => (
                                            <SelectMeasure
                                              value={field.value}
                                              onChange={val => {
                                                field.onChange(
                                                  val ? val.value : ''
                                                )
                                              }}
                                              errorMessageForce={
                                                fieldState?.invalid
                                              }
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
                                    <div>
                                      <div className="font-semibold">VAT</div>
                                      <div className="mt-1">
                                        <Controller
                                          name={`VAT`}
                                          control={control}
                                          render={({
                                            field: { ref, ...field },
                                            fieldState
                                          }) => (
                                            <InputNumber
                                              thousandSeparator={false}
                                              value={field.value}
                                              placeholder="Nhập VAT"
                                              onValueChange={val =>
                                                field.onChange(
                                                  typeof val?.floatValue !==
                                                    'undefined'
                                                    ? val.floatValue
                                                    : ''
                                                )
                                              }
                                            />
                                          )}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mb-4 last:mb-0">
                                  <div className="font-medium">
                                    Nhóm thẻ tiền
                                  </div>
                                  <div className="mt-1">
                                    <Controller
                                      name="Type"
                                      control={control}
                                      render={({
                                        field: { ref, ...field },
                                        fieldState
                                      }) => (
                                        <PickerAddCategories
                                          TypeOf="TT"
                                          onAddSuccess={val => {
                                            field.onChange({
                                              label: val?.Title || '',
                                              value: val?.ID
                                            })
                                          }}
                                        >
                                          {({ open }) => (
                                            <SelectCategoryProds
                                              isClearable
                                              value={field.value}
                                              onChange={val => {
                                                field.onChange(val)
                                              }}
                                              Type="TT"
                                              errorMessageForce={
                                                fieldState?.invalid
                                              }
                                              menuPosition="fixed"
                                              styles={{
                                                menuPortal: base => ({
                                                  ...base,
                                                  zIndex: 9999
                                                })
                                              }}
                                              menuPortalTarget={document.body}
                                              placeholder="Chọn nhóm thẻ tiền"
                                              noOptionsMessage={() =>
                                                'Chưa có nhóm thẻ tiền.'
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
                                              formatCreateLabel={val => (
                                                <span className="text-primary">
                                                  Tạo mới nhóm
                                                  {val ? (
                                                    <span className="pl-1">
                                                      "{val}"
                                                    </span>
                                                  ) : (
                                                    <></>
                                                  )}
                                                </span>
                                              )}
                                              onCreateOption={inputValue => {
                                                if (!ReadCate?.hasRight) {
                                                  toast.error(
                                                    'Bạn không có quyền truy cập chức năng này.'
                                                  )
                                                } else {
                                                  open({
                                                    Title: inputValue
                                                  })
                                                }
                                              }}
                                            />
                                          )}
                                        </PickerAddCategories>
                                      )}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="pt-5 border-t mt-7 border-t-separator">
                                <div className="mb-4">
                                  <div className="mb-1 text-lg font-semibold sm:text-2xl">
                                    Thông tin bán hàng
                                  </div>
                                  <div className="font-light text-muted2">
                                    Cài đặt thông tin giá cost, giá bán của mặt
                                    hàng.
                                  </div>
                                </div>
                                <div>
                                  <div className="mb-4 last:mb-0">
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
                                              if (val) {
                                                if (
                                                  val.some(
                                                    x => x.value === '*'
                                                  ) &&
                                                  field?.value?.findIndex(
                                                    x => x.value === '*'
                                                  ) === -1
                                                ) {
                                                  field.onChange(
                                                    val.filter(
                                                      x => x.value === '*'
                                                    )
                                                  )
                                                } else if (
                                                  val.some(
                                                    x => x.value === '-1'
                                                  ) &&
                                                  field?.value?.findIndex(
                                                    x => x.value === '-1'
                                                  ) === -1
                                                ) {
                                                  field.onChange(
                                                    val.filter(
                                                      x => x.value === '-1'
                                                    )
                                                  )
                                                } else {
                                                  field.onChange(
                                                    val
                                                      ? val.filter(
                                                          x =>
                                                            x.value !== '*' &&
                                                            x.value !== '-1'
                                                        )
                                                      : []
                                                  )
                                                }
                                              } else {
                                                field.onChange(val)
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
                                              },
                                              {
                                                label: '(Ẩn)',
                                                value: '-1'
                                              }
                                            ]}
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                  <div className="mb-4 last:mb-0">
                                    <div className="font-semibold">Giá bán</div>
                                    <div className="mt-1">
                                      <Controller
                                        name={`PriceProduct`}
                                        control={control}
                                        render={({
                                          field: { ref, ...field },
                                          fieldState
                                        }) => (
                                          <InputNumber
                                            thousandSeparator={true}
                                            value={field.value}
                                            placeholder="Nhập số tiền"
                                            onValueChange={val =>
                                              field.onChange(
                                                typeof val?.floatValue !==
                                                  'undefined'
                                                  ? val.floatValue
                                                  : ''
                                              )
                                            }
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="pt-5 border-t mt-7 border-t-separator">
                                <div className="mb-6">
                                  <div className="mb-1 text-lg font-semibold sm:text-2xl">
                                    Giới hạn sử dụng
                                  </div>
                                </div>
                                <div>
                                  <div className="mb-5 last:mb-0">
                                    <div className="font-semibold">
                                      Số tiền được chi tiêu
                                    </div>
                                    <div className="mt-1">
                                      <Controller
                                        name={`MoneyInfo.total`}
                                        control={control}
                                        render={({
                                          field: { ref, ...field },
                                          fieldState
                                        }) => (
                                          <InputNumber
                                            thousandSeparator={true}
                                            value={field.value}
                                            placeholder="Nhập số tiền"
                                            onValueChange={val =>
                                              field.onChange(
                                                typeof val?.floatValue !==
                                                  'undefined'
                                                  ? val.floatValue
                                                  : ''
                                              )
                                            }
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                  <div className="mb-5 last:mb-0">
                                    <div className="font-medium">
                                      Điều kiện sử dụng
                                    </div>
                                    <div className="mt-1">
                                      <Controller
                                        name="MoneyInfo.condt"
                                        control={control}
                                        render={({
                                          field: { ref, ...field },
                                          fieldState
                                        }) => (
                                          <Select
                                            isClearable
                                            value={OptionsCondition.filter(
                                              x => field?.value === x?.value
                                            )}
                                            className="select-control"
                                            onChange={val => {
                                              field.onChange(val?.value || '')
                                            }}
                                            classNamePrefix="select"
                                            options={OptionsCondition}
                                            placeholder="Chọn điều kiện sử dụng"
                                            noOptionsMessage={() =>
                                              'Không có dữ liệu'
                                            }
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
                                  <div className="mb-7 last:mb-0">
                                    <div className="font-medium">Hạn dùng</div>
                                    <div className="mt-1">
                                      <Controller
                                        name="MoneyInfo.inDays"
                                        control={control}
                                        render={({
                                          field: { ref, ...field },
                                          fieldState
                                        }) => (
                                          <CreatableSelect
                                            isClearable
                                            value={getValueExpiration(
                                              field.value
                                            )}
                                            className="select-control"
                                            onChange={val => {
                                              field.onChange(val?.value || '')
                                            }}
                                            classNamePrefix="select"
                                            options={OptionsExpiration}
                                            placeholder="Chọn hạn dùng"
                                            noOptionsMessage={() =>
                                              'Không có dữ liệu'
                                            }
                                            menuPosition="fixed"
                                            styles={{
                                              menuPortal: base => ({
                                                ...base,
                                                zIndex: 9999
                                              })
                                            }}
                                            menuPortalTarget={document.body}
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
                                            formatCreateLabel={val => (
                                              <span className="text-primary">
                                                {val ? (
                                                  <span className="pr-1">
                                                    {val.toString()}
                                                  </span>
                                                ) : (
                                                  <></>
                                                )}
                                                ngày
                                              </span>
                                            )}
                                            onCreateOption={inputValue => {
                                              setValue(
                                                'MoneyInfo.inDays',
                                                inputValue
                                              )
                                            }}
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                  <div className="mb-5 last:mb-0">
                                    <div>
                                      <Controller
                                        name={`MoneyInfo.isSpendingLimits`}
                                        control={control}
                                        render={({
                                          field: { ref, ...field },
                                          fieldState
                                        }) => (
                                          <label
                                            htmlFor="#1"
                                            className={clsx(
                                              'flex w-full font-medium text-gray-900 cursor-pointer checkbox checkbox-border dark:text-gray-300'
                                            )}
                                          >
                                            <input
                                              className="absolute opacity-0"
                                              type="checkbox"
                                              id="#1"
                                              value={field.value}
                                              onChange={e => {
                                                field.onChange(e)
                                                if (!e.target.checked) {
                                                  setValue(
                                                    'MoneyInfo.prodValue',
                                                    ''
                                                  )
                                                  setValue(
                                                    'MoneyInfo.serviceValue',
                                                    ''
                                                  )
                                                }
                                              }}
                                              checked={field.value}
                                            />
                                            <span
                                              className={clsx(
                                                'w-6 h-6 border border-[#d3d3d3] rounded block icon checkbox-primary relative after:absolute after:left-2 after:top-[3px] transition'
                                              )}
                                              //style={styleChecked}
                                            ></span>
                                            <div className="pl-3">
                                              <div className="text-base font-medium">
                                                Giới hạn chi tiêu
                                              </div>
                                              <div className="text-[#727373] font-light text-[14px]">
                                                Cài đặt số tiền chi tiêu tối đa
                                                của thẻ tiền dành cho sản phẩm &
                                                dịch vụ
                                              </div>
                                            </div>
                                          </label>
                                        )}
                                      />
                                      {MoneyInfo?.isSpendingLimits && (
                                        <div className="grid grid-cols-1 gap-4 pb-3 mt-5 pl-9">
                                          <div className="flex flex-col sm:items-center sm:flex-row">
                                            <div className="font-medium sm:w-[250px]">
                                              Số tiền chi tiêu sản phẩm
                                            </div>
                                            <div className="relative flex-1 mt-1 sm:mt-0">
                                              <Controller
                                                name={`MoneyInfo.prodValue`}
                                                control={control}
                                                render={({
                                                  field: { ref, ...field },
                                                  fieldState
                                                }) => (
                                                  <InputNumber
                                                    thousandSeparator={true}
                                                    value={field.value}
                                                    placeholder="Nhập số tiền"
                                                    onValueChange={val =>
                                                      field.onChange(
                                                        typeof val?.floatValue !==
                                                          'undefined'
                                                          ? val.floatValue
                                                          : ''
                                                      )
                                                    }
                                                  />
                                                )}
                                              />
                                            </div>
                                          </div>
                                          <div className="flex flex-col sm:items-center sm:flex-row">
                                            <div className="font-medium sm:w-[250px]">
                                              Số tiền chi tiêu dịch vụ
                                            </div>
                                            <div className="relative flex-1 mt-1 sm:mt-0">
                                              <Controller
                                                name={`MoneyInfo.serviceValue`}
                                                control={control}
                                                render={({
                                                  field: { ref, ...field },
                                                  fieldState
                                                }) => (
                                                  <InputNumber
                                                    thousandSeparator={true}
                                                    value={field.value}
                                                    placeholder="Nhập số tiền"
                                                    onValueChange={val =>
                                                      field.onChange(
                                                        typeof val?.floatValue !==
                                                          'undefined'
                                                          ? val.floatValue
                                                          : ''
                                                      )
                                                    }
                                                  />
                                                )}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="mb-5 last:mb-0">
                                    <div>
                                      <Controller
                                        name={`MoneyInfo.isCategoryLimits`}
                                        control={control}
                                        render={({
                                          field: { ref, ...field },
                                          fieldState
                                        }) => (
                                          <label
                                            htmlFor="#2"
                                            className={clsx(
                                              'flex w-full font-medium text-gray-900 cursor-pointer checkbox checkbox-border dark:text-gray-300'
                                            )}
                                          >
                                            <input
                                              className="absolute opacity-0"
                                              type="checkbox"
                                              id="#2"
                                              value={field.value}
                                              onChange={e => {
                                                field.onChange(e)
                                                if (!e.target.checked) {
                                                  setValue(
                                                    'MoneyInfo.limit.cates',
                                                    ''
                                                  )
                                                  setValue(
                                                    'MoneyInfo.limit.manus',
                                                    ''
                                                  )
                                                  setValue(
                                                    'MoneyInfo.limit.prods',
                                                    ''
                                                  )
                                                }
                                              }}
                                              checked={field.value}
                                            />
                                            <span
                                              className={clsx(
                                                'w-6 h-6 border border-[#d3d3d3] rounded block icon checkbox-primary relative after:absolute after:left-2 after:top-[3px] transition'
                                              )}
                                              //style={styleChecked}
                                            ></span>
                                            <div className="pl-3">
                                              <div className="text-base font-medium">
                                                Giới hạn cho sản phẩm & dịch vụ
                                              </div>
                                              <div className="text-[#727373] font-light text-[14px]">
                                                Cài đặt danh mục hoặc sản phẩm &
                                                dịch vụ thẻ tiền được áp dụng.
                                              </div>
                                            </div>
                                          </label>
                                        )}
                                      />
                                      {MoneyInfo?.isCategoryLimits && (
                                        <div className="grid grid-cols-1 gap-4 pb-3 mt-5 pl-9">
                                          <div className="flex flex-col sm:items-center sm:flex-row">
                                            <div className="font-medium sm:w-[250px]">
                                              Áp dụng cho nhóm
                                            </div>
                                            <div className="relative flex-1 mt-1 sm:mt-0">
                                              <Controller
                                                name={`MoneyInfo.limit.cates`}
                                                control={control}
                                                render={({
                                                  field: { ref, ...field },
                                                  fieldState
                                                }) => (
                                                  <SelectCategoriesAsync
                                                    isMulti
                                                    isClearable
                                                    Type="SP,DV,TT,PP,NVL"
                                                    className="select-control"
                                                    menuPosition="fixed"
                                                    styles={{
                                                      menuPortal: base => ({
                                                        ...base,
                                                        zIndex: 9999
                                                      })
                                                    }}
                                                    menuPortalTarget={
                                                      document.body
                                                    }
                                                    placeholder="Chọn danh mục"
                                                    noOptionsMessage={() =>
                                                      'Danh mục trống.'
                                                    }
                                                    value={field.value}
                                                    onChange={val => {
                                                      field.onChange(val)
                                                    }}
                                                  />
                                                )}
                                              />
                                            </div>
                                          </div>
                                          <div className="flex flex-col sm:items-center sm:flex-row">
                                            <div className="font-medium sm:w-[250px]">
                                              Áp dụng cho nhãn hàng
                                            </div>
                                            <div className="relative flex-1 mt-1 sm:mt-0">
                                              <Controller
                                                name={`MoneyInfo.limit.manus`}
                                                control={control}
                                                render={({
                                                  field: { ref, ...field },
                                                  fieldState
                                                }) => (
                                                  <SelectCategoryProds
                                                    isMulti
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
                                                    menuPortalTarget={
                                                      document.body
                                                    }
                                                    placeholder="Chọn nhãn hàng"
                                                    noOptionsMessage={() =>
                                                      'Chưa có nhãn hàng.'
                                                    }
                                                    isValidNewOption={() =>
                                                      false
                                                    }
                                                  />
                                                )}
                                              />
                                            </div>
                                          </div>
                                          <div className="flex flex-col sm:items-center sm:flex-row">
                                            <div className="font-medium sm:w-[250px]">
                                              Áp dụng cho SP/DV
                                            </div>
                                            <div className="relative flex-1 mt-1 sm:mt-0">
                                              <Controller
                                                name={`MoneyInfo.limit.prods`}
                                                control={control}
                                                render={({
                                                  field: { ref, ...field },
                                                  fieldState
                                                }) => (
                                                  <SelectProdsTypeName
                                                    isMulti
                                                    isClearable
                                                    className="select-control"
                                                    menuPosition="fixed"
                                                    styles={{
                                                      menuPortal: base => ({
                                                        ...base,
                                                        zIndex: 9999
                                                      })
                                                    }}
                                                    value={field.value}
                                                    onChange={val => {
                                                      field.onChange(val)
                                                    }}
                                                  />
                                                )}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="pt-5 border-t mt-7 border-t-separator">
                                <div className="mb-4">
                                  <div className="mb-1 text-lg font-semibold sm:text-2xl">
                                    {GlobalConfig?.Admin?.hoa_hong_tu_van ||
                                      'Hoa hồng tư vấn'}
                                  </div>
                                  <div className="font-light text-muted2">
                                    Cài đặt giá trị hoa hồng của mặt hàng mà
                                    nhân viên được hưởng.
                                  </div>
                                </div>
                                <div className="mb-4">
                                  <div>
                                    {BonusSaleJSON &&
                                    BonusSaleJSON.length > 0 ? (
                                      <div className="grid grid-cols-1 gap-4">
                                        {fieldsBonusSale &&
                                          fieldsBonusSale.map((x, i) => (
                                            <div
                                              className="flex flex-col sm:items-center sm:flex-row"
                                              key={x.id}
                                            >
                                              <div className="font-medium sm:w-[250px]">
                                                {x.Level}
                                              </div>
                                              <Controller
                                                name={`BonusSaleJSON[${i}].Salary`}
                                                control={control}
                                                render={({
                                                  field: { ref, ...field },
                                                  fieldState
                                                }) => (
                                                  <div className="relative flex-1 mt-1 sm:mt-0">
                                                    <InputNumber
                                                      thousandSeparator={true}
                                                      value={field.value}
                                                      placeholder="Nhập giá trị"
                                                      onValueChange={val =>
                                                        field.onChange(
                                                          typeof val?.floatValue !==
                                                            'undefined'
                                                            ? val.floatValue
                                                            : ''
                                                        )
                                                      }
                                                    />
                                                    {field.value && (
                                                      <div className="absolute top-0 right-0 flex items-center justify-center w-12 h-full text-base pointer-events-none text-muted2">
                                                        {Number(field.value) >
                                                        100
                                                          ? '₫'
                                                          : '%'}
                                                      </div>
                                                    )}
                                                  </div>
                                                )}
                                              />
                                            </div>
                                          ))}
                                      </div>
                                    ) : (
                                      <div>
                                        <Controller
                                          name={`BonusSale`}
                                          control={control}
                                          render={({
                                            field: { ref, ...field },
                                            fieldState
                                          }) => (
                                            <div className="relative">
                                              <InputNumber
                                                thousandSeparator={true}
                                                value={field.value}
                                                placeholder="Nhập giá trị"
                                                onValueChange={val =>
                                                  field.onChange(
                                                    typeof val?.floatValue !==
                                                      'undefined'
                                                      ? val.floatValue
                                                      : ''
                                                  )
                                                }
                                              />
                                              {field.value && (
                                                <div className="absolute top-0 right-0 flex items-center justify-center w-12 h-full text-base pointer-events-none text-muted2">
                                                  {Number(field.value) > 100
                                                    ? '₫'
                                                    : '%'}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between mt-3">
                                    <div className="pr-4 font-light text-muted2">
                                      Chọn Switch để áp dụng hoa hồng khác nhau
                                      cho từng cấp bậc
                                    </div>

                                    <Switch
                                      checked={
                                        BonusSaleJSON &&
                                        BonusSaleJSON.length > 0
                                      }
                                      onChange={e => {
                                        if (
                                          !LevelsMaterials?.data ||
                                          LevelsMaterials?.data.length === 0
                                        ) {
                                          toast.warning(
                                            'Vui lòng cài đặt cấp bậc nhân viên.'
                                          )
                                        } else {
                                          if (e) {
                                            setValue(
                                              'BonusSaleJSON',
                                              LevelsMaterials?.data.map(x => ({
                                                Level: x,
                                                Salary: ''
                                              }))
                                            )
                                            setValue('BonusSale', '')
                                          } else {
                                            setValue('BonusSaleJSON', '')
                                          }
                                        }
                                      }}
                                      className={clsx(
                                        'relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75',
                                        BonusSaleJSON &&
                                          BonusSaleJSON.length > 0
                                          ? 'bg-primary'
                                          : 'bg-[#d3d3d3]'
                                      )}
                                    >
                                      <span className="sr-only">
                                        Use setting
                                      </span>
                                      <span
                                        aria-hidden="true"
                                        className={clsx(
                                          'pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 top-0 transition duration-200 ease-in-out',
                                          BonusSaleJSON &&
                                            BonusSaleJSON.length > 0
                                            ? 'translate-x-5'
                                            : 'translate-x-0'
                                        )}
                                      />
                                    </Switch>
                                  </div>
                                </div>
                                <div
                                  className={clsx(
                                    'grid gap-4',
                                    !GlobalConfig?.Admin?.hoa_hong_tu_van_ktv_an
                                      ? 'grid-cols-1 sm:grid-cols-2'
                                      : 'grid-cols-1'
                                  )}
                                >
                                  {!GlobalConfig?.Admin
                                    ?.hoa_hong_tu_van_ktv_an && (
                                    <div>
                                      <div className="flex items-end font-semibold">
                                        <span>
                                          {GlobalConfig?.Admin
                                            ?.hoa_hong_tu_van_khm ||
                                            'Hoa hồng tư vấn khách hàng mới'}
                                        </span>
                                        <Tooltip
                                          overlayClassName="text-white dark:text-dark-light"
                                          placement="top"
                                          trigger={['hover']}
                                          overlay={
                                            <div className="px-3 py-2.5 bg-white dark:bg-dark-light rounded-sm shadow-lg text-gray-700 dark:text-graydark-800 max-w-[300px] text-center">
                                              Trường hợp KH mới - nhân viên tư
                                              vấn sẽ được % cao hơn bạn sẽ setup
                                              mức hoa hồng khách mới
                                            </div>
                                          }
                                          align={{
                                            offset: [9, 0]
                                          }}
                                        >
                                          <QuestionMarkCircleIcon className="w-[22px] ml-1.5 text-warning cursor-pointer" />
                                        </Tooltip>
                                      </div>
                                      <div className="mt-1">
                                        <Controller
                                          name={`BonusSale2`}
                                          control={control}
                                          render={({
                                            field: { ref, ...field },
                                            fieldState
                                          }) => (
                                            <div className="relative">
                                              <InputNumber
                                                thousandSeparator={true}
                                                value={field.value}
                                                placeholder="Nhập giá trị"
                                                onValueChange={val =>
                                                  field.onChange(
                                                    typeof val?.floatValue !==
                                                      'undefined'
                                                      ? val.floatValue
                                                      : ''
                                                  )
                                                }
                                              />
                                              {field.value && (
                                                <div className="absolute top-0 right-0 flex items-center justify-center w-12 h-full text-base pointer-events-none text-muted2">
                                                  {Number(field.value) > 100
                                                    ? '₫'
                                                    : '%'}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  <div>
                                    <div className="flex items-end font-semibold">
                                      <span>Nhóm KPI</span>
                                      <Tooltip
                                        overlayClassName="text-white dark:text-dark-light"
                                        placement="top"
                                        trigger={['hover']}
                                        overlay={
                                          <div className="px-3 py-2.5 bg-white dark:bg-dark-light rounded-sm shadow-lg text-gray-700 dark:text-graydark-800 max-w-[300px] text-center">
                                            Phân loại KPI cho NVL để sau tính
                                            tổng doanh thu theo nhóm để thưởng
                                          </div>
                                        }
                                        align={{
                                          offset: [9, 0]
                                        }}
                                      >
                                        <QuestionMarkCircleIcon className="w-[22px] ml-1.5 text-warning cursor-pointer" />
                                      </Tooltip>
                                    </div>
                                    <div className="mt-1">
                                      <Controller
                                        name="KpiType"
                                        control={control}
                                        render={({
                                          field: { ref, ...field },
                                          fieldState
                                        }) => (
                                          <SelectTypeGenerate
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
                                </div>
                              </div>
                            </div>
                          </Tab.Panel>
                        )}
                        {ReadApp_type?.hasRight && (
                          <Tab.Panel>
                            <div className="mb-6">
                              <div className="mb-1 text-lg font-semibold sm:text-2xl">
                                Thông tin trên WEBSITE / APP
                              </div>
                              <div className="font-light text-muted2">
                                Cài đặt các thông tin hiển thị trên Website,
                                App, Zalo App
                              </div>
                            </div>
                            <div>
                              <div className="mb-4 last:mb-0">
                                <div className="font-medium">Hình ảnh</div>
                                <div className="grid grid-cols-3 gap-4 mt-1 sm:grid-cols-4">
                                  {fieldsImage &&
                                    fieldsImage.map((img, i) => (
                                      <div
                                        key={img.id}
                                        className="relative top-0 left-0 w-full h-full bg-gray-100 dark:bg-graydark-100"
                                      >
                                        <a
                                          className="flex items-center justify-center h-full overflow-hidden rounded"
                                          href={toAbsolutePath(img.image)}
                                          target="_blank"
                                          rel="noopener"
                                        >
                                          <img
                                            onError={e => {
                                              if (
                                                e.target.src !==
                                                toAbsoluteUrl(
                                                  '/assets/images/files/image-default.png'
                                                )
                                              ) {
                                                e.target.onerror = null
                                                e.target.src = toAbsoluteUrl(
                                                  '/assets/images/files/image-default.png'
                                                )
                                              }
                                            }}
                                            className="w-full"
                                            src={toAbsolutePath(img.image)}
                                            alt="Avatar"
                                          />
                                        </a>
                                        <div
                                          className="absolute z-10 flex items-center justify-center text-gray-700 transition bg-white rounded-full shadow-lg cursor-pointer dark:text-darkgray-800 dark:bg-graydark-200 h-7 w-7 -top-4 -right-4 hover:text-primary"
                                          onClick={() => removeImage(i)}
                                        >
                                          <XMarkIcon className="w-4" />
                                        </div>
                                      </div>
                                    ))}
                                  <UploadFile
                                    className="aspect-square"
                                    width="w-auto"
                                    height="h-auto"
                                    onChange={val => {
                                      appendImage({ image: val })
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="mb-4 last:mb-0">
                                <div className="font-medium">Trạng thái</div>
                                <div className="mt-1">
                                  <Controller
                                    name="Status"
                                    control={control}
                                    render={({
                                      field: { ref, ...field },
                                      fieldState
                                    }) => (
                                      <Select
                                        isClearable
                                        value={OptionsStatus.filter(
                                          x => field?.value === x?.value
                                        )}
                                        className="select-control"
                                        onChange={val => {
                                          field.onChange(val?.value || '')
                                        }}
                                        classNamePrefix="select"
                                        options={OptionsStatus}
                                        placeholder="Chọn trạng thái"
                                        noOptionsMessage={() =>
                                          'Không có dữ liệu'
                                        }
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
                              <div className="mb-4 last:mb-0">
                                <div className="font-medium">
                                  Mô tả sản phẩm
                                </div>
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
                              <div className="mb-4 last:mb-0">
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
                              <div className="mb-8 last:mb-0">
                                <div className="font-medium">Ngày làm mới</div>
                                <div className="mt-1">
                                  <Controller
                                    rules={{ required: true }}
                                    name="RenewDate"
                                    control={control}
                                    render={({
                                      field: { ref, ...field },
                                      fieldState
                                    }) => (
                                      <InputDatePicker
                                        placeholderText="Chọn thời gian"
                                        autoComplete="off"
                                        onChange={field.onChange}
                                        selected={
                                          field.value
                                            ? new Date(field.value)
                                            : null
                                        }
                                        {...field}
                                        dateFormat="HH:mm dd/MM/yyyy"
                                        showTimeSelect
                                        errorMessageForce={fieldState?.invalid}
                                        //timeFormat="HH:mm"
                                      />
                                    )}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="mb-5 last:mb-0">
                                  <div>
                                    <Controller
                                      name={`IsPublic`}
                                      control={control}
                                      render={({
                                        field: { ref, ...field },
                                        fieldState
                                      }) => (
                                        <label
                                          htmlFor="#3"
                                          className={clsx(
                                            'flex w-full font-medium text-gray-900 cursor-pointer checkbox checkbox-border dark:text-gray-300'
                                          )}
                                        >
                                          <input
                                            className="absolute opacity-0"
                                            type="checkbox"
                                            id="#3"
                                            value={field.value}
                                            onChange={field.onChange}
                                            checked={field.value}
                                          />
                                          <span
                                            className={clsx(
                                              'w-6 h-6 border border-[#d3d3d3] rounded block icon checkbox-primary relative after:absolute after:left-2 after:top-[3px] transition'
                                            )}
                                            //style={styleChecked}
                                          ></span>
                                          <div className="pl-3">
                                            <div className="text-base font-medium">
                                              Hiển thị trên WEB/APP
                                            </div>
                                            <div className="text-[#727373] font-light text-[14px]">
                                              Bỏ tích này thẻ tiền sẽ không được
                                              hiển thị.
                                            </div>
                                          </div>
                                        </label>
                                      )}
                                    />
                                  </div>
                                </div>
                                <div className="mb-5 last:mb-0">
                                  <div>
                                    <Controller
                                      name={`IsDisplayPrice`}
                                      control={control}
                                      render={({
                                        field: { ref, ...field },
                                        fieldState
                                      }) => (
                                        <label
                                          htmlFor="#4"
                                          className={clsx(
                                            'flex w-full font-medium text-gray-900 cursor-pointer checkbox checkbox-border dark:text-gray-300'
                                          )}
                                        >
                                          <input
                                            className="absolute opacity-0"
                                            type="checkbox"
                                            id="#4"
                                            value={field.value}
                                            onChange={field.onChange}
                                            checked={field.value}
                                          />
                                          <span
                                            className={clsx(
                                              'w-6 h-6 border border-[#d3d3d3] rounded block icon checkbox-primary relative after:absolute after:left-2 after:top-[3px] transition'
                                            )}
                                            //style={styleChecked}
                                          ></span>
                                          <div className="pl-3">
                                            <div className="text-base font-medium">
                                              Hiển thị giá trên WEB/APP
                                            </div>
                                            <div className="text-[#727373] font-light text-[14px]">
                                              Bỏ tích này thẻ tiền sẽ hiện thị
                                              giá liên hệ.
                                            </div>
                                          </div>
                                        </label>
                                      )}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Tab.Panel>
                        )}
                      </Tab.Panels>
                    </div>
                  </Tab.Group>
                </div>
              )}

              <div className="flex justify-end gap-3 p-4 border-t border-t-separator sm:hidden">
                <Button
                  onClick={onHide}
                  type="button"
                  className="relative flex items-center h-12 px-6 font-bold transition border border-gray-300 rounded shadow-lg dark:border-gray-700 hover:border-gray-800 focus:outline-none focus:shadow-none"
                >
                  Hủy
                </Button>
                <Button
                  loading={addEditMutation.isLoading}
                  disabled={addEditMutation.isLoading}
                  type="submit"
                  className="relative flex items-center h-12 px-6 font-semibold text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
                >
                  {initialValues?.ID ? 'Lưu thay đổi' : 'Thêm mới'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </FloatingPortal>
      )}
    </>
  )
}

export default PickerAddEdit
