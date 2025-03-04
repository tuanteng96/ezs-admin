import React, { useState, useEffect } from 'react'
import { ArrowSmallLeftIcon } from '@heroicons/react/24/outline'
import { Controller, useForm } from 'react-hook-form'
import { Checkbox, Input, InputNumber } from 'src/_ezs/partials/forms'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button } from 'src/_ezs/partials/button'
import { FloatingPortal } from '@floating-ui/react'
import { SelectDistrictsOtp, SelectProvinces } from 'src/_ezs/partials/select'
import { PickerSettingTime } from '.'
import { formatArray } from 'src/_ezs/utils/formatArray'
import BusinessAPI from 'src/_ezs/api/business.api'
import clsx from 'clsx'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import moment from 'moment'
import ConfigAPI from 'src/_ezs/api/config'

const schemaAddEdit = yup
  .object({
    title: yup.string().required('Vui lòng nhập tên cơ sở')
  })
  .required()

function PickerBusiness({ children, initialValues }) {
  const [visible, setVisible] = useState(false)
  const [isEditPwd, setIsEditPwd] = useState(false)

  const { data } = useQuery({
    queryKey: ['BrandNameBusiness'],
    queryFn: async () => {
      let { data } = await ConfigAPI.getName('Bill.Title')
      return data?.data && data?.data.length > 0 ? data?.data[0].Value : null
    },
    enabled: visible
  })

  const onHide = () => {
    setVisible(false)
  }

  const queryClient = useQueryClient()

  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      stock_save: 1,
      title: '',
      desc: '',
      linkseo: '',
      id: 0,
      value: 1234,
      Map: '',
      Lat: '',
      Lng: '',
      IsPublic: 1,
      BrandName: '',
      descseo: '',
      keyseo: [...formatArray.getInitialTime()]
        .map(x => `{${x.Sub};${x.TimeFrom};${x.TimeTo};${x.TimeBefore}}`)
        .join(''),
      ProvinceID: '',
      DistrictID: '',
      Configuration: {
        TimeFrom: '08:00',
        TimeTo: '18:00',
        TimeBefore: 30,
        active: true
      }
    },
    resolver: yupResolver(schemaAddEdit)
  })

  useEffect(() => {
    if (initialValues) {
      let FollowObj = initialValues?.DescSEO
        ? JSON.parse(initialValues?.DescSEO)
        : null
      let ProvinceID = ''
      let DistrictID = ''
      if (FollowObj?.place && FollowObj?.place.length > 0) {
        let indexProvin = FollowObj?.place.findIndex(x => x.Parentid)
        let indexDistr = FollowObj?.place.findIndex(x => x.ID)
        if (indexProvin > -1) {
          ProvinceID = {
            label: FollowObj?.place[indexProvin].Title,
            value: FollowObj?.place[indexProvin].Parentid
          }
        }
        if (indexDistr > -1) {
          DistrictID = {
            label: FollowObj?.place[indexDistr].Title,
            value: FollowObj?.place[indexDistr].ID
          }
        }
      }

      reset({
        stock_save: 1,
        title: initialValues.Title,
        desc: initialValues?.Desc || '',
        linkseo: initialValues?.LinkSEO || '',
        id: initialValues.ID,
        value: initialValues?.Value || 1234,
        Map: initialValues?.Map || '',
        Lat: initialValues?.Lat || '',
        Lng: initialValues?.Lng || '',
        IsPublic: initialValues?.IsPublic,
        BrandName: '',
        descseo: initialValues?.DescSEO || '',
        keyseo: initialValues?.KeySEO,
        Configuration: {
          TimeFrom: '08:00',
          TimeTo: '18:00',
          TimeBefore: 30,
          active: false
        },
        ProvinceID,
        DistrictID
      })
    } else {
      reset()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const addEditMutation = useMutation({
    mutationFn: async body => {
      let rs = await BusinessAPI.addEdit(body)
      await queryClient.invalidateQueries({
        queryKey: ['BusinessEstablishment']
      })
      return rs
    }
  })

  const onSubmit = values => {
    let KeySeo = values.keyseo
    let obj = {
      place: []
    }
    if (values?.ProvinceID) {
      obj.place.push({
        Parentid: values?.ProvinceID?.value,
        Title: values?.ProvinceID?.label
      })
    }
    if (values?.DistrictID) {
      obj.place.push({
        ID: values?.DistrictID?.value,
        Title: values?.DistrictID?.label
      })
    }
    if (values?.Configuration?.active) {
      KeySeo = [...formatArray.getInitialTime()]
        .map(x => ({
          ...x,
          TimeFrom: values?.Configuration?.TimeFrom,
          TimeTo: values?.Configuration?.TimeTo,
          TimeBefore: values?.Configuration?.TimeBefore || 0,
          active: true
        }))
        .map(x => `{${x.Sub};${x.TimeFrom};${x.TimeTo};${x.TimeBefore}}`)
        .join('')
    }

    var bodyFormData = new FormData()
    bodyFormData.append('stock_save', 1)
    bodyFormData.append('title', values.title)
    bodyFormData.append('desc', values.desc)
    bodyFormData.append('linkseo', values.linkseo)
    bodyFormData.append('id', values.id || 0)
    bodyFormData.append('value', values.value)
    bodyFormData.append('Map', values.Map)
    bodyFormData.append('Lat', values.Lat)
    bodyFormData.append('Lng', values.Lng)
    bodyFormData.append('IsPublic', values.IsPublic)
    bodyFormData.append('BrandName', values.BrandName)
    bodyFormData.append('descseo', JSON.stringify(obj))
    bodyFormData.append('keyseo', KeySeo)

    addEditMutation.mutate(bodyFormData, {
      onSettled: ({ data }) => {
        onHide()
        toast.success(
          initialValues.ID ? 'Cập nhập thành công.' : 'Thêm mới thành công.'
        )
      }
    })
  }

  let { ProvinceID, Configuration } = watch()

  return (
    <>
      {children({
        open: () => setVisible(true)
      })}
      {visible && (
        <FloatingPortal root={document.body}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="fixed top-0 left-0 z-[1003] bg-white h-full w-full flex flex-col"
            autoComplete="off"
            onKeyDown={e => {
              if (e.key === 'Enter') e.preventDefault()
            }}
          >
            <div className="flex justify-between px-8 py-6 border-b border-separator">
              <div className="flex items-center">
                <div
                  className="flex items-center justify-center h-full pr-4 cursor-pointer"
                  onClick={onHide}
                >
                  <ArrowSmallLeftIcon className="w-8" />
                </div>
                <div className="flex items-center text-3xl font-semibold">
                  {initialValues?.ID ? 'Cập nhập cơ sở' : 'Thêm mới cơ sở'}
                </div>
              </div>
              <div className="flex gap-3">
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
            <div className="py-10 overflow-auto grow">
              <div className="max-w-[600px] w-full mx-auto">
                <div className="mb-6 font-light text-muted2">
                  Thông tin chi nhánh được hiển thị khi đặt lịch trực tuyến, hóa
                  đơn bán hàng và thông báo đến khách hàng.
                </div>
                <div>
                  <div>
                    <div className="mb-4 last:mb-0">
                      <div className="font-semibold">Tên cơ sở / Chi nhánh</div>
                      <div className="mt-1">
                        <Controller
                          name="title"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <Input
                              placeholder={`${data} Hà Nội`}
                              value={field.value}
                              errorMessageForce={fieldState?.invalid}
                              errorMessage={fieldState?.error?.message}
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="mb-4 last:mb-0">
                      <div className="font-semibold">Số điện thoại</div>
                      <div className="mt-1">
                        <Controller
                          name="linkseo"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <InputNumber
                              onValueChange={val => {
                                field.onChange(val.value || '')
                              }}
                              allowLeadingZeros
                              allowNegative={false}
                              placeholder="Nhập hotline của cơ sở"
                              value={field.value}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="px-4 py-4 mt-4 border border-dashed rounded bg-warninglight border-warning">
                      <Controller
                        name="IsPublic"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <>
                            <Checkbox
                              labelClassName="pl-3"
                              labelText="Đang hoạt động"
                              htmlFor="IsPublic"
                              {...field}
                              checked={field.value}
                              onChange={e =>
                                field.onChange(e.target.checked ? 1 : 0)
                              }
                            />
                          </>
                        )}
                      />
                    </div>
                  </div>
                  <div className="pt-5 border-t mt-7 border-t-separator">
                    <div className="mb-4 last:mb-0">
                      <div className="font-semibold">Địa chỉ</div>
                      <div className="mt-1">
                        <Controller
                          name="desc"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <Input
                              placeholder="Nhập địa chỉ"
                              value={field.value}
                              errorMessageForce={fieldState?.invalid}
                              errorMessage={fieldState?.error?.message}
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4 last:mb-0">
                      <Controller
                        name="ProvinceID"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <div>
                            <div className="mb-1.5 text-base text-gray-900 font-inter font-medium dark:text-graydark-800">
                              Tỉnh / Thành phố
                            </div>
                            <SelectProvinces
                              className="select-control"
                              isClearable
                              value={field.value}
                              onChange={val => {
                                field.onChange(val)
                                setValue('DistrictID', '')
                              }}
                              noOptionsMessage={() => 'Không có dữ liệu'}
                            />
                          </div>
                        )}
                      />

                      <Controller
                        name="DistrictID"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <div>
                            <div className="mb-1.5 text-base text-gray-900 font-inter font-medium dark:text-graydark-800">
                              Quận huyện
                            </div>
                            <SelectDistrictsOtp
                              className="select-control"
                              isDisabled={!ProvinceID?.value}
                              isClearable
                              ProvinceID={ProvinceID?.value}
                              value={field.value}
                              onChange={val => field.onChange(val)}
                              noOptionsMessage={() => 'Không có dữ liệu'}
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-5 border-t mt-7 border-t-separator">
                  <div className="mb-4">
                    <div className="mb-1 text-xl font-semibold">
                      Cài đặt Mật khẩu
                    </div>
                    <div className="font-light text-muted2">
                      Dùng để kết nối phần mềm & ipad đánh giá.
                    </div>
                  </div>
                  <div>
                    <div className="bg-[#f2f2f2] px-4 py-3 rounded-lg font-light">
                      Nếu không nhập, mật khẩu mặc định là
                      <span className="pl-1 font-medium text-danger">1234</span>
                      .
                      <span
                        className="px-1 font-medium cursor-pointer text-primary"
                        onClick={() => setIsEditPwd(!isEditPwd)}
                      >
                        Bấm vào đây
                      </span>
                      để đổi mật khẩu.
                    </div>
                    {isEditPwd && (
                      <div className="mt-4 last:mb-0">
                        <div className="font-semibold">Mật khẩu Ipad</div>
                        <div className="mt-1">
                          <Controller
                            name="value"
                            control={control}
                            render={({
                              field: { ref, ...field },
                              fieldState
                            }) => (
                              <Input
                                placeholder="Nhập mật khẩu"
                                value={field.value}
                                errorMessageForce={fieldState?.invalid}
                                errorMessage={fieldState?.error?.message}
                                {...field}
                              />
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Controller
                  name="keyseo"
                  control={control}
                  render={({ field: { ref, ...field }, fieldState }) => (
                    <PickerSettingTime
                      Value={field.value}
                      onChange={v => field.onChange(v)}
                      setValue={setValue}
                      initConfiguration={Configuration}
                    >
                      {({ open }) => (
                        <div className="pt-5 border-t mt-7 border-t-separator">
                          <div className="mb-6">
                            <div className="flex justify-between">
                              <div className="flex-1 pr-8">
                                <div className="mb-1 text-xl font-semibold">
                                  Giờ mở cửa
                                </div>
                                <div className="font-light text-muted2">
                                  Trường hợp vào các ngày cuối tuần có thời gian
                                  mở cửa khác vui lòng bấm nút cài đặt để setup.
                                </div>
                              </div>
                              <div>
                                <button
                                  onClick={open}
                                  className="h-9 px-4 font-medium text-white transition bg-[#3f3f3f] rounded hover:opacity-80 font-number"
                                  type="button"
                                >
                                  Cài đặt
                                </button>
                              </div>
                            </div>
                          </div>
                          {Configuration?.active ? (
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <div className="mb-1 font-semibold font-number">
                                  Giờ mở cửa
                                </div>
                                <Controller
                                  name={`Configuration.TimeFrom`}
                                  control={control}
                                  render={({
                                    field: { ref, ...field },
                                    fieldState
                                  }) => (
                                    <InputDatePicker
                                      selected={
                                        field.value
                                          ? moment()
                                              .set({
                                                hour: moment(
                                                  field.value,
                                                  'HH:mm'
                                                ).get('hour'),
                                                minute: moment(
                                                  field.value,
                                                  'HH:mm'
                                                ).get('minute'),
                                                second: moment(
                                                  field.value,
                                                  'HH:mm'
                                                ).get('second')
                                              })
                                              .toDate()
                                          : null
                                      }
                                      onChange={e => {
                                        field.onChange(
                                          e ? moment(e).format('HH:mm') : null
                                        )
                                      }}
                                      showTimeSelect
                                      showTimeSelectOnly
                                      dateFormat="HH:mm"
                                      timeFormat="HH:mm"
                                      placeholderText="Giờ mở cửa"
                                      errorMessageForce={fieldState?.invalid}
                                      errorMessage={fieldState?.error?.message}
                                    />
                                  )}
                                />
                              </div>
                              <div>
                                <div className="mb-1 font-semibold font-number">
                                  Giờ đóng cửa
                                </div>
                                <Controller
                                  name={`Configuration.TimeTo`}
                                  control={control}
                                  render={({
                                    field: { ref, ...field },
                                    fieldState
                                  }) => (
                                    <InputDatePicker
                                      selected={
                                        field.value
                                          ? moment()
                                              .set({
                                                hour: moment(
                                                  field.value,
                                                  'HH:mm'
                                                ).get('hour'),
                                                minute: moment(
                                                  field.value,
                                                  'HH:mm'
                                                ).get('minute'),
                                                second: moment(
                                                  field.value,
                                                  'HH:mm'
                                                ).get('second')
                                              })
                                              .toDate()
                                          : null
                                      }
                                      onChange={e => {
                                        field.onChange(
                                          e ? moment(e).format('HH:mm') : null
                                        )
                                      }}
                                      showTimeSelect
                                      showTimeSelectOnly
                                      dateFormat="HH:mm"
                                      timeFormat="HH:mm"
                                      placeholderText="Giờ đóng cửa"
                                      errorMessageForce={fieldState?.invalid}
                                      errorMessage={fieldState?.error?.message}
                                    />
                                  )}
                                />
                              </div>
                              <div>
                                <div className="mb-1 font-semibold font-number">
                                  Đặt lịch trước (Phút)
                                </div>
                                <div>
                                  <Controller
                                    name={`Configuration.TimeBefore`}
                                    control={control}
                                    render={({
                                      field: { ref, ...field },
                                      fieldState
                                    }) => (
                                      <>
                                        <InputNumber
                                          thousandSeparator={false}
                                          value={field.value}
                                          placeholder="Nhập số phút"
                                          onValueChange={val =>
                                            field.onChange(val.floatValue || 0)
                                          }
                                          errorMessageForce={
                                            fieldState?.invalid
                                          }
                                          errorMessage={
                                            fieldState?.error?.message
                                          }
                                        />
                                      </>
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-4 gap-4">
                              {formatArray
                                .updateInitialTime({ Value: field.value })
                                .map((day, i) => (
                                  <div
                                    className="border border-[#e5e5e5] rounded-lg last:mb-0 cursor-pointer"
                                    key={i}
                                    onClick={open}
                                  >
                                    <div
                                      className={clsx(
                                        'font-semibold capitalize text-center py-2 text-[14px]',
                                        day.active
                                          ? 'bg-primarylight text-primary'
                                          : 'bg-[#e7e8e9] text-[#878c93]'
                                      )}
                                    >
                                      {day.Title}
                                    </div>
                                    <div className="flex flex-col items-center justify-center py-2.5 font-medium font-number min-h-[88px]">
                                      {day.active ? (
                                        <>
                                          <div>{day.TimeFrom}</div>
                                          <div className="h-6">-</div>
                                          <div>{day.TimeTo}</div>
                                        </>
                                      ) : (
                                        <div className="text-[#757676] font-light">
                                          Đóng cửa
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      )}
                    </PickerSettingTime>
                  )}
                />
              </div>
            </div>
          </form>
        </FloatingPortal>
      )}
    </>
  )
}

export default PickerBusiness
