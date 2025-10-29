/* eslint-disable react/jsx-no-target-blank */

import React, { useState, useEffect } from 'react'
import {
  ArrowPathIcon,
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
import { Checkbox, Input, InputNumber } from 'src/_ezs/partials/forms'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button } from 'src/_ezs/partials/button'
import { FloatingPortal } from '@floating-ui/react'
import {
  SelectGroupRoles,
  SelectStocks,
  SelectUserLevels,
  SelectUserShifts
} from 'src/_ezs/partials/select'
import clsx from 'clsx'
import UsersAPI from 'src/_ezs/api/users.api'
import useDebounceKey from 'src/_ezs/hooks/useDebounceKey'
import { useAuth } from 'src/_ezs/core/Auth'
import Tooltip from 'rc-tooltip'
import { PickerUserInfo } from '.'
import { useRoles } from 'src/_ezs/hooks/useRoles'
import { UploadFile } from 'src/_ezs/partials/files'
import StickyBox from 'react-sticky-box'
import { useLayout } from 'src/_ezs/layout/LayoutProvider'
import { toAbsolutePath } from 'src/_ezs/utils/assetPath'

const schemaAddEdit = yup
  .object({
    fn: yup.string().required('Vui lòng nhập tên'),
    GroupIDs: yup
      .array()
      .min(1, 'Vui lòng chọn nhóm')
      .required('Vui lòng chọn nhóm')
  })
  .required()

function PickerUserAddEdit({ children, initialValues }) {
  const [visible, setVisible] = useState(false)
  const [suggestLoading, setSuggestLoading] = useState(false)
  const [isEditPwd, setIsEditPwd] = useState(false)

  const { CrStocks } = useAuth()
  const { GlobalConfig } = useLayout()

  const { usrmng, cong_ca, csluong_bangluong } = useRoles([
    'usrmng',
    'cong_ca',
    'csluong_bangluong'
  ])

  const queryClient = useQueryClient()

  const methods = useForm({
    defaultValues: {
      Avatar: '',
      id: 0,
      order: 0,
      fn: '',
      pwd: 1234,
      usn: '',
      chk: '',
      unchk: '',
      disabled: '',
      stockid: CrStocks?.ID,
      IsOPTLogin: '',
      chamcong: {
        ShiftName: '',
        ShiftID: '',
        SalaryHours: '',
        UserID: 0
      }, //[{"ShiftName":"Ca hành chính","ShiftID":"a05a7af3-fa5c-8510-66c8-851574b0e960","SalaryHours":1,"UserID":0}]
      chluongData: '', //[{"id":0,"StockID":0,"LUONG":6000000},{"id":0,"StockID":0,"PHU_CAP":300000},{"id":0,"StockID":0,"GIU_LUONG":10},{"id":0,"StockID":0,"SO_THANG_GIU_LUONG":8},{"id":0,"StockID":0,"NGAY_NGHI":4},{"id":0,"StockID":0,"TRO_CAP_NGAY":20000},{"id":0,"StockID":0,"NGAY_PHEP":2}]
      chluongLevels: '', // [{"id":0,"Level":"Thử việc"}]
      chluongGr: '',
      LUONG: '',
      PHU_CAP: '',
      GIU_LUONG: '',
      SO_THANG_GIU_LUONG: '',
      NGAY_NGHI: '',
      TRO_CAP_NGAY: '',
      NGAY_PHEP: '',
      LOAI_TINH_LUONG: 'NGAY_CONG',
      SO_NGAY: '',
      GroupIDs: null,
      PhotoJSON: [],
      UnknownKeysConfigs: [],
      Gender: 1,
      YahooID: ''
    },
    resolver: yupResolver(schemaAddEdit)
  })

  const { control, handleSubmit, reset, setValue, watch } = methods

  useEffect(() => {
    if (initialValues) {
      setValue('id', initialValues?.ID)
      setValue('Avatar', initialValues?.Avatar)
      setValue('fn', initialValues?.FullName)
      setValue('usn', initialValues?.UserName)
      setValue('order', initialValues?.Order)
      setValue('Gender', initialValues?.Gender)
      setValue('YahooID', initialValues?.YahooID)
      setValue('stockid', initialValues?.StockID)
      setValue('IsOPTLogin', initialValues?.IsOPTLogin)
      setValue('pwd', '')
      setValue(
        'GroupIDs',
        initialValues?.GroupList && initialValues?.GroupList.length > 0
          ? initialValues?.GroupList.map(x => x.GroupID)
          : null
      )
      let newPhotoJSON = initialValues?.PhotoJSON
        ? JSON.parse(initialValues?.PhotoJSON)
        : []
      setValue(
        'PhotoJSON',
        newPhotoJSON.map(x => ({ image: x }))
      )
    } else {
      reset()
    }
    setIsEditPwd(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'PhotoJSON'
  })

  const onHide = () => {
    setVisible(false)
  }

  useQuery({
    queryKey: ['getSalaryUserRoles', initialValues],
    queryFn: async () => {
      let { data } = await UsersAPI.getRolesUserId({
        UserID: initialValues?.ID
      })
      return data
    },
    onSuccess: data => {
      if (data?.salaryConfig) {
        const knownKeys = [
          'LUONG',
          'PHU_CAP',
          'GIU_LUONG',
          'SO_THANG_GIU_LUONG',
          'TRO_CAP_NGAY',
          'NGAY_NGHI',
          'NGAY_CONG',
          'NGAY_PHEP'
        ]

        const unknownKeys = []

        for (let key of data?.salaryConfig || []) {
          if (['NGAY_NGHI', 'NGAY_CONG'].includes(key.Name)) {
            setValue('LOAI_TINH_LUONG', key.Name)
            setValue('SO_NGAY', key.Value)
          } else if (knownKeys.includes(key.Name)) {
            setValue(key.Name, key.Value)
          } else {
            unknownKeys.push(key)
          }
        }
        setValue('UnknownKeysConfigs', unknownKeys)
      }
      if (data?.User) {
        setValue('chluongLevels', data?.User?.Level)
        setValue('Gender', data?.User?.Gender)
        setValue('YahooID', data?.User?.YahooID)
        let WorkTimeSetting = data?.User?.WorkTimeSetting
          ? JSON.parse(data?.User?.WorkTimeSetting)
          : null
        setValue('chamcong.SalaryHours', WorkTimeSetting?.SalaryHours || '')
        setValue(
          `chamcong.ShiftID`,
          WorkTimeSetting?.ShiftID
            ? {
                label: WorkTimeSetting?.ShiftName,
                value: WorkTimeSetting?.ShiftID
              }
            : ''
        )
      }
    },
    enabled: Boolean(initialValues?.ID && visible)
  })

  const addEditMutation = useMutation({
    mutationFn: async ({ data, GroupIDs }) => {
      let rs = await UsersAPI.addEditUser(data)
      let rsRoles = await UsersAPI.addEditUser2({
        updates:
          GroupIDs.updates && GroupIDs.updates.length > 0
            ? GroupIDs.updates.map(x => ({
                ...x,
                UserID: x.UserID || rs?.data?.data?.UserID
              }))
            : null
      })

      await queryClient.invalidateQueries({
        queryKey: ['ListUserRoles']
      })
      return {
        rs,
        rsRoles
      }
    }
  })

  const suggestMutation = useMutation({
    mutationFn: body => UsersAPI.suggestUsername(body)
  })

  const onSubmit = ({ values, open }) => {
    var bodyFormData = new FormData()
    bodyFormData.append('id', values?.id)
    bodyFormData.append('Avatar', values?.Avatar)
    bodyFormData.append('fn', values?.fn)
    bodyFormData.append('pwd', values?.pwd)
    bodyFormData.append('usn', values?.usn)
    bodyFormData.append('order', values?.order)
    bodyFormData.append('chk', '')
    bodyFormData.append('unchk', '')
    bodyFormData.append('stockid', values?.stockid || '')
    bodyFormData.append('IsOPTLogin', values?.IsOPTLogin ? '1' : '0')
    bodyFormData.append('disabled', values?.disabled ? '1' : '0')
    bodyFormData.append('Gender', values?.Gender)
    bodyFormData.append('YahooID', values?.YahooID || '')
    bodyFormData.append(
      'chamcong',
      JSON.stringify([
        {
          ShiftName: values?.chamcong?.ShiftID?.label,
          ShiftID: values?.chamcong?.ShiftID?.value || '',
          SalaryHours: values?.chamcong?.SalaryHours || 0,
          UserID: 0
        }
      ])
    )
    bodyFormData.append(
      'chluongLevels',
      JSON.stringify([
        { id: values?.id || 0, Level: values?.chluongLevels || '' }
      ])
    )

    let newchluongData = []
    if (values?.LUONG) {
      newchluongData.push({
        id: values?.id || 0,
        StockID: 0,
        LUONG: values?.LUONG
      })
    }
    if (values?.PHU_CAP) {
      newchluongData.push({
        id: values?.id || 0,
        StockID: 0,
        PHU_CAP: values?.PHU_CAP
      })
    }
    if (values?.GIU_LUONG) {
      newchluongData.push({
        id: values?.id || 0,
        StockID: 0,
        GIU_LUONG: values?.GIU_LUONG
      })
    }
    if (values?.SO_THANG_GIU_LUONG) {
      newchluongData.push({
        id: values?.id || 0,
        StockID: 0,
        SO_THANG_GIU_LUONG: values?.SO_THANG_GIU_LUONG
      })
    }
    if (values?.NGAY_NGHI) {
      newchluongData.push({
        id: values?.id || 0,
        StockID: 0,
        NGAY_NGHI: values?.NGAY_NGHI
      })
    }
    if (values?.TRO_CAP_NGAY) {
      newchluongData.push({
        id: values?.id || 0,
        StockID: 0,
        TRO_CAP_NGAY: values?.TRO_CAP_NGAY
      })
    }
    if (values?.LOAI_TINH_LUONG) {
      if (values?.LOAI_TINH_LUONG === 'NGAY_NGHI') {
        newchluongData.push({
          id: values?.id || 0,
          StockID: 0,
          NGAY_NGHI: values?.SO_NGAY || 0
        })
      } else {
        newchluongData.push({
          id: values?.id || 0,
          StockID: 0,
          NGAY_CONG: values?.SO_NGAY || 0
        })
      }
    }

    if (values.UnknownKeysConfigs && values.UnknownKeysConfigs.length > 0) {
      for (let key of values.UnknownKeysConfigs) {
        newchluongData.push({
          id: values?.id || 0,
          StockID: 0,
          [key.Name]: key.Value || 0
        })
      }
    }

    bodyFormData.append('chluongData', JSON.stringify(newchluongData))
    bodyFormData.append('chluongGr', JSON.stringify([]))

    bodyFormData.append(
      'PhotoJSON',
      JSON.stringify(
        values?.PhotoJSON ? values?.PhotoJSON.map(x => x.image) : ''
      )
    )

    addEditMutation.mutate(
      {
        data: bodyFormData,
        GroupIDs: {
          updates: [
            {
              UserID: values?.id,
              GroupIDs: values.GroupIDs
            }
          ]
        }
      },
      {
        onSuccess: ({ rs, rsRoles }) => {
          if (rs?.data?.error) {
            toast.error(rs?.data?.error)
          } else {
            toast.success(
              initialValues?.ID
                ? 'Cập nhật thành công.'
                : 'Thêm mới thành công.'
            )
            onHide()
            if (!initialValues?.ID) {
              open({ FullName: values?.fn, UserName: values?.usn })
            }
          }
        }
      }
    )
  }

  const debounce = useDebounceKey(e => {
    var bodyFormData = new FormData()
    bodyFormData.append('fullname', e)

    suggestMutation.mutate(bodyFormData, {
      onSuccess: rs => {
        setValue('usn', rs?.data?.data || '')
        setSuggestLoading(false)
      }
    })
  }, 500)

  let { stockid, Avatar } = watch()

  return (
    <PickerUserInfo>
      {props => (
        <>
          {children({
            open: () => setVisible(true)
          })}
          {visible && (
            <FloatingPortal root={document.body}>
              <FormProvider {...methods}>
                <form
                  onSubmit={handleSubmit(values =>
                    onSubmit({
                      values,
                      open: props.open
                    })
                  )}
                  className="fixed top-0 left-0 z-[1003] bg-white h-full w-full flex flex-col"
                  autoComplete="off"
                  onKeyDown={e => {
                    if (e.key === 'Enter') e.preventDefault()
                  }}
                >
                  <div className="flex justify-between p-4 border-b md:px-8 md:py-6 border-separator">
                    <div className="flex items-center">
                      <div
                        className="flex items-center justify-center h-full pr-4 cursor-pointer"
                        onClick={onHide}
                      >
                        <ArrowSmallLeftIcon className="w-7 md:w-8" />
                      </div>
                      <div className="flex items-center text-2xl font-semibold md:text-3xl">
                        {initialValues?.ID
                          ? 'Cập nhật nhân viên'
                          : 'Thêm mới nhân viên'}
                      </div>
                    </div>
                    <div className="hidden gap-3 md:flex">
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
                  <div className="px-4 py-4 overflow-auto md:py-10 grow">
                    <div className="max-w-[1000px] w-full mx-auto flex flex-col xl:flex-row gap-5 sm:gap-6 xl:gap-[80px]">
                      <div className="flex-1 order-last xl:order-first">
                        <div className="mb-4">
                          <div className="mb-1 text-lg font-semibold md:text-2xl">
                            Thông tin tài khoản
                          </div>
                        </div>
                        <div>
                          <div>
                            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                              <div>
                                <div className="font-semibold">
                                  Tên nhân viên *
                                </div>
                                <div className="mt-1">
                                  <Controller
                                    name="fn"
                                    control={control}
                                    render={({
                                      field: { ref, ...field },
                                      fieldState
                                    }) => (
                                      <Input
                                        placeholder="Nhập họ và tên"
                                        value={field.value}
                                        errorMessageForce={fieldState?.invalid}
                                        //errorMessage={fieldState?.error?.message}
                                        {...field}
                                        onChange={e => {
                                          field.onChange(e.target.value)
                                          if (!initialValues?.ID) {
                                            setSuggestLoading(true)
                                            debounce(e.target.value, 1000)
                                          }
                                        }}
                                      />
                                    )}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="font-semibold">
                                  Tài khoản đăng nhập
                                </div>
                                <div className="mt-1">
                                  <Controller
                                    name="usn"
                                    control={control}
                                    render={({
                                      field: { ref, ...field },
                                      fieldState
                                    }) => (
                                      <Input
                                        isLoading={
                                          suggestLoading ||
                                          suggestMutation.isLoading
                                        }
                                        placeholder="Tự động sinh ra khi nhập tên"
                                        value={field.value}
                                        errorMessageForce={fieldState?.invalid}
                                        errorMessage={
                                          fieldState?.error?.message
                                        }
                                        {...field}
                                        disabled
                                      />
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                            {GlobalConfig?.Admin?.chinhsachluongchitiet && (
                              <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                                <div>
                                  <div className="font-semibold">
                                    Mã nhân viên
                                  </div>
                                  <div className="mt-1">
                                    <Controller
                                      name="YahooID"
                                      control={control}
                                      render={({
                                        field: { ref, ...field },
                                        fieldState
                                      }) => (
                                        <Input
                                          placeholder="Nhập mã nhân viên"
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
                                <div>
                                  <div className="font-semibold">
                                    Hiện bảng lương
                                  </div>
                                  <div className="mt-1">
                                    <div className="relative px-4 py-3 border border-gray-300 border-dashed rounded">
                                      <Controller
                                        name="Gender"
                                        control={control}
                                        render={({
                                          field: { ref, ...field },
                                          fieldState
                                        }) => (
                                          <Checkbox
                                            labelText="Tích để hiển thị bảng lương"
                                            labelClassName="pl-2 font-normal text-muted2"
                                            htmlFor="Gender"
                                            {...field}
                                            checked={Number(field?.value) === 1}
                                            onChange={e => {
                                              field.onChange(
                                                e.target.value ? 1 : 0
                                              )
                                            }}
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div>
                              {initialValues?.ID ? (
                                <div className="font-light text-muted2">
                                  Bạn muốn thay đổi mật khẩu .
                                  <span
                                    className="px-1 font-medium cursor-pointer text-primary"
                                    onClick={() => setIsEditPwd(!isEditPwd)}
                                  >
                                    Bấm vào đây
                                  </span>
                                  nếu bạn muốn đặt mật khẩu khác cho tài khoản
                                  này.
                                </div>
                              ) : (
                                <div className="font-light text-muted2">
                                  Mật khẩu đăng nhập APP mặc định là
                                  <span className="pl-1 font-semibold font-number text-danger">
                                    1234
                                  </span>
                                  .
                                  <span
                                    className="px-1 font-medium cursor-pointer text-primary"
                                    onClick={() => setIsEditPwd(!isEditPwd)}
                                  >
                                    Bấm vào đây
                                  </span>
                                  nếu bạn muốn thay đổi.
                                </div>
                              )}
                              {isEditPwd && (
                                <div className="mt-4 last:mb-0">
                                  <div className="font-semibold">Mật khẩu</div>
                                  <div className="mt-1">
                                    <Controller
                                      name="pwd"
                                      control={control}
                                      render={({
                                        field: { ref, ...field },
                                        fieldState
                                      }) => (
                                        <Input
                                          placeholder="Nhập mật khẩu"
                                          value={field.value}
                                          errorMessageForce={
                                            fieldState?.invalid
                                          }
                                          errorMessage={
                                            fieldState?.error?.message
                                          }
                                          {...field}
                                        />
                                      )}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            {GlobalConfig?.Admin?.OTP_USER && (
                              <div className="relative px-4 py-4 mt-5 border border-gray-300 border-dashed rounded">
                                <Controller
                                  name="IsOPTLogin"
                                  control={control}
                                  render={({
                                    field: { ref, ...field },
                                    fieldState
                                  }) => (
                                    <Checkbox
                                      labelText="Kiểm soát đăng nhập qua OTP"
                                      htmlFor="IsOPTLogin"
                                      {...field}
                                      checked={field?.value}
                                    />
                                  )}
                                />
                                <Tooltip
                                  overlayClassName="text-white dark:text-dark-light"
                                  placement="top"
                                  trigger={['hover']}
                                  overlay={
                                    <div className="px-3 py-2.5 bg-white dark:bg-dark-light rounded-sm shadow-lg text-gray-700 dark:text-graydark-800 max-w-[300px] text-center">
                                      Mỗi lần đăng nhập nhân viên sẽ có 1 mã OTP
                                      gửi về Email của quản lý, Nhân viên sẽ
                                      phải xin OTP này để đăng nhập tránh việc
                                      tự do đăng nhập tại nhiều nơi.
                                    </div>
                                  }
                                  align={{
                                    offset: [9, 0]
                                  }}
                                >
                                  <QuestionMarkCircleIcon className="absolute w-6 cursor-pointer text-warning right-4 top-2/4 -translate-y-2/4" />
                                </Tooltip>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="pt-5 mt-5 border-t border-t-separator">
                          <div>
                            <div className="mb-4 last:mb-0">
                              <div className="font-semibold">
                                Nhân viên thuộc cơ sở
                              </div>
                              <div className="mt-1">
                                <Controller
                                  name={`stockid`}
                                  control={control}
                                  render={({
                                    field: { ref, ...field },
                                    fieldState
                                  }) => (
                                    <SelectStocks
                                      allOption={
                                        usrmng?.IsStocks
                                          ? [
                                              {
                                                label: 'Hệ thống',
                                                value: '0'
                                              }
                                            ]
                                          : []
                                      }
                                      StockRoles={usrmng.StockRoles}
                                      value={field.value}
                                      onChange={val => {
                                        field.onChange(
                                          val?.value !== '' ? val?.value : ''
                                        )
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
                                    />
                                  )}
                                />
                              </div>
                            </div>
                            <div className="mb-4 last:mb-0">
                              <div className="font-semibold">
                                Vai trò nhân viên (Chọn 1 hoặc nhiều) *
                              </div>
                              <div className="mt-1">
                                <Controller
                                  name={`GroupIDs`}
                                  control={control}
                                  render={({
                                    field: { ref, ...field },
                                    fieldState
                                  }) => (
                                    <SelectGroupRoles
                                      isMulti
                                      value={field.value}
                                      onChange={val => {
                                        field.onChange(
                                          val ? val.map(x => x.value) : null
                                        )
                                      }}
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
                                      errorMessageForce={fieldState?.invalid}
                                      errorMessage={fieldState?.error?.message}
                                      StockRoles={usrmng.StockRolesAll}
                                      Params={{
                                        StockID: stockid
                                      }}
                                    />
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {csluong_bangluong?.hasRight && (
                          <div className="pt-5 border-t mt-7 border-t-separator">
                            <div className="mb-4">
                              <div className="mb-1 text-lg font-semibold md:text-2xl">
                                Cài đặt chính sách lương
                              </div>
                              <div className="font-light text-muted2">
                                Cài đặt lương cơ bản, số ngày công quy định trên
                                tháng & ăn trưa.
                              </div>
                            </div>
                            <div>
                              <SelectUserLevels
                                isClearable={true}
                                className="select-control"
                                menuPosition="fixed"
                                styles={{
                                  menuPortal: base => ({
                                    ...base,
                                    zIndex: 9999
                                  })
                                }}
                                menuPortalTarget={document.body}
                                onSuccess={rs => {
                                  if (!initialValues?.ID && rs.length > 0) {
                                    setValue('chluongLevels', rs[0].value)
                                  }
                                }}
                                label="Cấp bậc"
                                name="chluongLevels"
                                wrapClassName="mb-4"
                              />
                              <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                                <div>
                                  <div className="font-semibold">
                                    Lương cơ bản
                                  </div>
                                  <div className="mt-1">
                                    <Controller
                                      name={`LUONG`}
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
                                            field.onChange(val.floatValue || '')
                                          }
                                        />
                                      )}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between font-semibold">
                                    <Controller
                                      name={`LOAI_TINH_LUONG`}
                                      control={control}
                                      render={({
                                        field: { ref, ...field },
                                        fieldState
                                      }) => (
                                        <>
                                          <span>
                                            {field.value === 'NGAY_CONG'
                                              ? 'Ngày công cố định'
                                              : 'Ngày nghỉ cố định'}
                                            <span className="pl-1">
                                              / tháng
                                            </span>
                                          </span>
                                          <div
                                            className="cursor-pointer"
                                            onClick={() => {
                                              field.onChange(
                                                field.value === 'NGAY_CONG'
                                                  ? 'NGAY_NGHI'
                                                  : 'NGAY_CONG'
                                              )
                                              setValue('SO_NGAY', '')
                                            }}
                                          >
                                            <ArrowPathIcon className="w-5" />
                                          </div>
                                        </>
                                      )}
                                    />
                                  </div>
                                  <div className="mt-1">
                                    <Controller
                                      name={`SO_NGAY`}
                                      control={control}
                                      render={({
                                        field: { ref, ...field },
                                        fieldState
                                      }) => (
                                        <InputNumber
                                          thousandSeparator={true}
                                          value={field.value}
                                          placeholder="Nhập số ngày"
                                          onValueChange={val =>
                                            field.onChange(val.floatValue || '')
                                          }
                                        />
                                      )}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-end font-semibold">
                                    <span>Phụ cấp tháng</span>
                                    <Tooltip
                                      overlayClassName="text-white dark:text-dark-light"
                                      placement="top"
                                      trigger={['hover']}
                                      overlay={
                                        <div className="px-3 py-2.5 bg-white dark:bg-dark-light rounded-sm shadow-lg text-gray-700 dark:text-graydark-800 max-w-[300px] text-center">
                                          Không phụ thuộc vào ngày chấm công
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
                                      name={`PHU_CAP`}
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
                                            field.onChange(val.floatValue || '')
                                          }
                                        />
                                      )}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-end font-semibold">
                                    <span>Phụ cấp ngày (Ăn trưa)</span>
                                    <Tooltip
                                      overlayClassName="text-white dark:text-dark-light"
                                      placement="top"
                                      trigger={['hover']}
                                      overlay={
                                        <div className="px-3 py-2.5 bg-white dark:bg-dark-light rounded-sm shadow-lg text-gray-700 dark:text-graydark-800 max-w-[300px] text-center">
                                          Tính theo số ngày chấm công
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
                                      name={`TRO_CAP_NGAY`}
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
                                            field.onChange(val.floatValue || '')
                                          }
                                        />
                                      )}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                  <div>
                                    <div className="flex items-end mb-1 font-semibold">
                                      <span>Giữ lương hàng tháng</span>
                                      <Tooltip
                                        overlayClassName="text-white dark:text-dark-light"
                                        placement="top"
                                        trigger={['hover']}
                                        overlay={
                                          <div className="px-3 py-2.5 bg-white dark:bg-dark-light rounded-sm shadow-lg text-gray-700 dark:text-graydark-800 max-w-[300px] text-center">
                                            Trường hợp nhân viên bị cam kết làm
                                            12 tháng thì bạn có thể cài đặt giữ
                                            lương theo số tiền cố định hàng
                                            tháng hoặc theo % lương thu nhập
                                            trong 1 khoảng thời gian 6 tháng, 1
                                            năm. Lương sẽ được giữ lại và thanh
                                            toán cho nhân viên khi đủ thời gian
                                          </div>
                                        }
                                        align={{
                                          offset: [9, 0]
                                        }}
                                      >
                                        <QuestionMarkCircleIcon className="w-[22px] ml-1.5 text-warning cursor-pointer" />
                                      </Tooltip>
                                    </div>
                                    <Controller
                                      name={`GIU_LUONG`}
                                      control={control}
                                      render={({
                                        field: { ref, ...field },
                                        fieldState
                                      }) => (
                                        <div className="relative">
                                          <InputNumber
                                            thousandSeparator={true}
                                            value={field.value}
                                            placeholder="Nhập số tiền giữ lương"
                                            onValueChange={val =>
                                              field.onChange(
                                                val.floatValue || ''
                                              )
                                            }
                                          />
                                          {field.value !== '' && (
                                            <div className="absolute top-0 right-0 flex items-center justify-center w-10 h-12 pointer-events-none font-number">
                                              {field.value > 100 ? 'đ' : '%'}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    />
                                  </div>
                                  <div>
                                    <div className="mb-1 font-semibold">
                                      Số tháng giữ lương
                                    </div>
                                    <Controller
                                      name={`SO_THANG_GIU_LUONG`}
                                      control={control}
                                      render={({
                                        field: { ref, ...field },
                                        fieldState
                                      }) => (
                                        <InputNumber
                                          thousandSeparator={true}
                                          value={field.value}
                                          placeholder="Nhập số tháng"
                                          onValueChange={val =>
                                            field.onChange(val.floatValue || '')
                                          }
                                        />
                                      )}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {cong_ca?.hasRight && (
                          <div className="pt-5 border-t mt-7 border-t-separator">
                            <div className="mb-4">
                              <div className="mb-1 text-lg font-semibold md:text-2xl">
                                Cài đặt chấm công
                              </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div>
                                <div className="font-semibold">Ca làm việc</div>
                                <div className="mt-1">
                                  <Controller
                                    name={`chamcong.ShiftID`}
                                    control={control}
                                    render={({
                                      field: { ref, ...field },
                                      fieldState
                                    }) => (
                                      <>
                                        <SelectUserShifts
                                          isClearable={true}
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
                                          placeholder="Tự chọn ca khi chấm công"
                                        />
                                      </>
                                    )}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="font-semibold">
                                  Lương theo giờ (Tính tăng ca, phạt)
                                </div>
                                <div className="mt-1">
                                  <Controller
                                    name="chamcong.SalaryHours"
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
                                          field.onChange(val.floatValue || '')
                                        }
                                      />
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <StickyBox
                        className="!relative xl:!sticky"
                        style={{ zIndex: 1000 }}
                      >
                        <div className="xl:w-[280px] lg:w-[300px] w-full xl:sticky z-10 top-0 xl:order-last order-first">
                          <div className="border-gray-300 rounded-lg xl:border">
                            <div className="mb-1 border-gray-300 xl:py-4 xl:px-5 xl:border-b xl:mb-0">
                              <div className="mb-px font-semibold xl:text-xl">
                                Ảnh nhân viên
                              </div>
                            </div>
                            <div className="xl:px-5 xl:py-4">
                              <Controller
                                name="Avatar"
                                control={control}
                                render={({ field }) => (
                                  <UploadFile
                                    className="aspect-square"
                                    width="w-auto"
                                    height="h-auto"
                                    value={field.value}
                                    onChange={val => {
                                      field.onChange(val)
                                    }}
                                    buttonText="Upload ảnh"
                                  />
                                )}
                              />
                              {(Avatar ||
                                (!Avatar && fields && fields.length > 0)) && (
                                <div className="grid grid-cols-3 gap-3 mt-3">
                                  {fields && fields.length > 0 && (
                                    <>
                                      {fields.map((image, i) => (
                                        <div
                                          className="relative"
                                          key={image.id}
                                        >
                                          <a
                                            href={toAbsolutePath(image.image)}
                                            target="_blank"
                                            rel="noopener"
                                          >
                                            <img
                                              className="object-cover object-top rounded aspect-square"
                                              src={toAbsolutePath(image.image)}
                                              alt={image.image}
                                            />
                                          </a>
                                          <div
                                            className="absolute z-10 flex items-center justify-center w-6 h-6 text-gray-700 transition bg-white rounded-full shadow-lg cursor-pointer dark:text-darkgray-800 dark:bg-graydark-200 -top-2 -right-2 hover:text-primary"
                                            onClick={() => remove(i)}
                                          >
                                            <XMarkIcon className="w-4" />
                                          </div>
                                        </div>
                                      ))}
                                    </>
                                  )}

                                  <UploadFile
                                    className="aspect-square"
                                    width="w-auto"
                                    height="h-auto"
                                    onChange={val => {
                                      append({ image: val })
                                    }}
                                    size="xs"
                                    buttonText="Thêm ảnh"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </StickyBox>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 p-4 border-t border-t-separator md:hidden">
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
      )}
    </PickerUserInfo>
  )
}

export default PickerUserAddEdit
