import React, { useState, useEffect } from 'react'
import { ArrowSmallLeftIcon } from '@heroicons/react/24/outline'
import { Controller, useForm } from 'react-hook-form'
import { Input, InputNumber } from 'src/_ezs/partials/forms'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button } from 'src/_ezs/partials/button'
import { FloatingPortal } from '@floating-ui/react'
import {
  SelectAutoCompleteMaps,
  SelectDistrictsOtp,
  SelectProvinces
} from 'src/_ezs/partials/select'
import BannersAPI from 'src/_ezs/api/banners.api'
import MoresAPI from 'src/_ezs/api/mores.api'
import IframeLoad from './IframeLoad'

const schemaAddEdit = yup
  .object({
    Title: yup.string().required('Vui lòng nhập tên cơ sở')
  })
  .required()

function PickerBusinessMore({ children, initialValues }) {
  const [visible, setVisible] = useState(false)

  const onHide = () => {
    setVisible(false)
  }

  const queryClient = useQueryClient()

  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      ID: '',
      Title: '',
      Link: '',
      FileName: '',
      FileName2: '',
      Desc: '',
      PosID: null,
      Order: 0,
      IsPublic: 1,
      Follow: '',
      ProvinceID: '',
      DistrictID: ''
    },
    resolver: yupResolver(schemaAddEdit)
  })

  useEffect(() => {
    if (initialValues) {
      let FollowObj = initialValues?.Follow
        ? JSON.parse(initialValues?.Follow)
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
        ...initialValues,
        ProvinceID,
        DistrictID
      })
    } else {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, initialValues])

  const addEditMutation = useMutation({
    mutationFn: async body => {
      let data = await BannersAPI.edit(body)
      await queryClient.invalidateQueries({
        queryKey: ['BusinessEstablishment']
      })
      return data
    }
  })

  const updateAddressMutation = useMutation({
    mutationFn: async body => {
      let Province = null
      let District = null
      let ProvinceName = body.boundaries
        .filter(x => x.type === 0)
        .map(x => x.name)
        .join(',')
      let DistrictName = body.boundaries
        .filter(x => x.type === 1)
        .map(x => x.name)
        .join(',')

      let Provinces = await MoresAPI.getProvinces({
        Key: ProvinceName,
        Pi: 1,
        Ps: 100
      })
      if (
        Provinces.data.result.Items &&
        Provinces.data.result.Items.length > 0
      ) {
        Province = {
          ...Provinces.data.result.Items[0],
          value: Provinces.data.result.Items[0].Id,
          label: Provinces.data.result.Items[0].Title
        }
        let Districts = await MoresAPI.getDistricts({
          ProvinceID: Province?.value,
          Key: DistrictName
        })
        if (Districts.data && Districts.data.length > 0) {
          District = {
            ...Districts.data[0],
            value: Districts.data[0].ID,
            label: Districts.data[0].Title
          }
        }
      }

      return {
        District,
        Province
      }
    }
  })

  const onSubmit = values => {
    let Follow = ''

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

    Follow = JSON.stringify(obj)

    const dataPost = {
      arr: [
        {
          ...values,
          Link: `https://maps.google.com/maps?q=${values.Desc}&hl=en-US&z=14&ie=UTF8&iwloc=B&output=embed`,
          PosID: 59,
          Follow
        }
      ]
    }

    addEditMutation.mutate(dataPost, {
      onSuccess: data => {
        if (!data.error) {
          toast.success(
            !values.ID ? 'Thêm mới thành công' : 'Chỉnh sửa thành công'
          )
          onHide()
        }
      },
      onError: error => console.log(error)
    })
  }

  let { ProvinceID, Desc } = watch()

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
            <div className="flex justify-between p-4 border-b md:px-8 md:py-6 border-separator">
              <div className="flex items-center">
                <div
                  className="flex items-center justify-center h-full pr-4 cursor-pointer"
                  onClick={onHide}
                >
                  <ArrowSmallLeftIcon className="w-7 md:w-8" />
                </div>
                <div className="flex items-center text-2xl font-semibold md:text-3xl">
                  {initialValues?.ID ? 'Chỉnh sửa cơ sở' : 'Thêm mới cơ sở'}
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
              <div className="max-w-[600px] w-full mx-auto">
                <div className="mb-6 font-light text-muted2">
                  Danh sách các cơ sở /chi nhánh hiển thị THÊM của toàn hệ thống
                  ( không bao gồm quản lý hoạt động của chi nhánh đó ) .
                </div>
                <div>
                  <div>
                    <div className="mb-4 last:mb-0">
                      <div className="font-semibold">Tên cơ sở / Chi nhánh</div>
                      <div className="mt-1">
                        <Controller
                          name="Title"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <Input
                              placeholder="Nhập tên cơ sở"
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
                          name="FileName"
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
                              placeholder="Nhập số điện thoại"
                              value={field.value}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-5 border-t mt-7 border-t-separator">
                    <div className="mb-4 last:mb-0">
                      <div className="font-semibold">Địa chỉ</div>
                      <div className="mt-1">
                        <Controller
                          name="Desc"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <SelectAutoCompleteMaps
                              placeholder="Nhập địa chỉ"
                              value={field.value}
                              onChange={field.onChange}
                              onUpdate={val => {
                                updateAddressMutation.mutate(val, {
                                  onSuccess: rs => {
                                    if (rs.Province) {
                                      setValue('ProvinceID', rs.Province)
                                      setValue('DistrictID', rs.District)
                                    }
                                  }
                                })
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 last:mb-0">
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
                              isLoading={updateAddressMutation.isLoading}
                              isDisabled={updateAddressMutation.isLoading}
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
                            {}
                            <SelectDistrictsOtp
                              className="select-control"
                              isClearable
                              ProvinceID={ProvinceID?.value}
                              value={field.value}
                              onChange={val => field.onChange(val)}
                              noOptionsMessage={() => 'Không có dữ liệu'}
                              isLoading={updateAddressMutation.isLoading}
                              isDisabled={
                                !ProvinceID?.value ||
                                updateAddressMutation.isLoading
                              }
                            />
                          </div>
                        )}
                      />
                    </div>
                    {Desc && <IframeLoad Address={Desc} />}
                  </div>
                </div>
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
        </FloatingPortal>
      )}
    </>
  )
}

export default PickerBusinessMore
