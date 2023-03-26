import { XMarkIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { useLocation, useMatch, useNavigate, useParams } from 'react-router-dom'
import FixedLayout from 'src/_ezs/layout/FixedLayout'
import { Button } from 'src/_ezs/partials/button'
import { UploadAvatar } from 'src/_ezs/partials/files'
import { Checkbox, Input, InputTextarea } from 'src/_ezs/partials/forms'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import Select from 'react-select'
import { useMutation, useQuery } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import MembersAPI from 'src/_ezs/api/members.api'
import {
  SelectDistricts,
  SelectGender,
  SelectUserAdmin
} from 'src/_ezs/partials/select'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'react-toastify'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import clsx from 'clsx'
import Swal from 'sweetalert2'

const initialValus = {
  BirthDate_Web: '',
  MemberGroups: null,
  InputGroups: '',
  GroupNames: '',
  Desc: '',
  IsAnonymous: false,
  CheckIn: null,
  TopTeleJson: '',
  ID: 0,
  UserID: '',
  IdentityID: '',
  BarCodeID: '',
  PastPort: '',
  FullName: '',
  BirthDate: null,
  MobilePhone: '',
  FixedPhone: '',
  Email: '',
  CompanyName: '',
  OrganizeName: '',
  HomeAddress: '',
  WorlAddress: '',
  Street: '',
  Group: '',
  DistrictID: '',
  ProvinceID: '',
  Jobs: '',
  ReceiveInformation: '',
  IsApproval: false,
  Enable: false,
  Type: '',
  GroupUser: '',
  Point: 0,
  Other: '',
  IsAff: 1,
  Gender: '',
  Photo: '',
  ByStockID: 0,
  ByUserID: 0,
  HasFinger: 0,
  HandCardID: '',
  Summary: '',
  Source: '',
  GroupName: '',
  Tags: '',
  Present: null,
  IsOfBrand: false,
  IsKeepGroup: false
}

const schemaUsers = yup
  .object({
    FullName: yup.string().required('Vui lòng nhập họ và tên'),
    Email: yup
      .string()
      .email('Email không đúng định dạng')
      .required('Vui lòng nhập Email'),
    MobilePhone: yup.string().required('Vui lòng nhập số điện thoại')
  })
  .required()

function ClientAddEdit(props) {
  const isAddMode = useMatch('/clients/add')
  const { id } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()

  const { control, handleSubmit, setValue, setError, reset } = useForm({
    defaultValues: initialValus,
    resolver: yupResolver(schemaUsers)
  })

  const WatchProvinceID = useWatch({ control, name: 'ProvinceID' })

  const dataAdd = useQuery({
    queryKey: ['memberDataAdd'],
    queryFn: async () => {
      const data = await MembersAPI.memberDataAdd()
      return data?.data
        ? {
            ...data?.data,
            MemberGroups: data?.data.MemberGroups.map(x => ({
              ...x,
              value: x.ID,
              label: x.Title
            })),
            Provinces: data?.data.Provinces.map(x => ({
              ...x,
              value: x.ID,
              label: x.Title
            })),
            Sources: data?.data.Sources.map(x => ({
              ...x,
              value: x.text,
              label: x.text
            }))
          }
        : {
            MemberGroups: [],
            Provinces: [],
            Sources: []
          }
    }
  })

  const memberCurrent = useQuery({
    queryKey: ['memberSearch', { Ps: 1, Pi: 1, Key: '#' + id }],
    queryFn: () => MembersAPI.memberSearch({ Ps: 1, Pi: 1, Key: '#' + id }),
    onSuccess: ({ data }) => {
      if (data?.data?.length > 0) {
        reset(data?.data[0])
      } else {
        toast.warning('Không tìm thấy khách hàng')
        navigate(state?.previousPath || '/calendar')
      }
    },
    enabled: !!id
  })

  const addUpdateMutation = useMutation({
    mutationFn: body => MembersAPI.addUpdate(body)
  })

  const onSubmit = values => {
    const dataUser = {
      member: values
    }
    addUpdateMutation.mutate(dataUser, {
      onSuccess: ({ data }) => {
        if (data.error) {
          if (
            data.error ===
            'Email đã được sử dụng. Xin vui lòng sử dụng email khác'
          ) {
            setError('Email', {
              type: 'Server',
              message: data.error
            })
          }
          if (
            data.error ===
            'Số điện thoại đã được sử dụng. Xin vui lòng sử dụng Số điện thoại khác'
          ) {
            setError('MobilePhone', {
              type: 'Server',
              message: data.error
            })
          }
        } else {
          toast.success(
            isAddMode
              ? 'Thêm mới khách hàng thành công.'
              : 'Cập nhập thông tin thành công.'
          )
          navigate(state?.previousPath || '/calendar')
        }
      },
      onError: error => {
        console.log(error)
      }
    })
  }

  const resetPwdMutation = useMutation({
    mutationFn: body => MembersAPI.resetPassword(body)
  })

  const onResetPassword = () => {
    Swal.fire({
      customClass: {
        confirmButton: 'bg-success'
      },
      title: 'Đổi mật khẩu ?',
      html: `Bạn muốn reset mật khẩu mới của khách hàng ${memberCurrent?.data?.data?.data[0]?.FullName} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đổi mật khẩu',
      cancelButtonText: 'Đóng',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        var bodyFormData = new FormData()
        bodyFormData.append('cmd', 'setpwd_member')
        bodyFormData.append('MemberID', id)
        const data = await resetPwdMutation.mutateAsync(bodyFormData)
        return data
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(result => {
      if (result.isConfirmed) {
        if (result?.value?.data?.newpass) {
          Swal.fire({
            icon: 'success',
            title: 'Mật khẩu mới',
            html: `<div>
            <div class="mb-5">Mật khẩu mới của khách hàng ${
              memberCurrent?.data?.data?.data[0]?.FullName
            } sau khi thay đổi là :</div>
            <div class="flex justify-center">
              ${result?.value.data?.newpass
                .split('')
                .map(
                  x =>
                    `<div class="border mx-1 h-14 w-14 border-separator dark:border-dark-separator rounded flex items-center justify-center text-2xl font-inter font-medium dark:text-white">${x}</div>`
                )
                .join('')}
            </div></div>`
          })
        } else {
          toast.error('Xảy ra lỗi không xác định.')
        }
      }
    })
  }

  return (
    <FixedLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex flex-col h-full"
        autoComplete="off"
      >
        <div className="transition border-b z-[10] border-separator dark:border-dark-separator bg-white dark:bg-dark-aside">
          <div className="grid justify-between grid-cols-4 gap-4 px-5 h-[85px]">
            <div className="flex items-center">
              <div
                className="flex items-center justify-center w-12 h-12 cursor-pointer dark:text-graydark-800"
                onClick={() => navigate(state?.previousPath || '/clients')}
              >
                <XMarkIcon className="w-9" />
              </div>
            </div>
            <div className="flex items-center justify-center col-span-2 text-3xl font-extrabold transition dark:text-white">
              {isAddMode ? 'Thêm mới khách hàng' : 'Chỉnh sửa khách hàng'}
            </div>
            <div className="flex items-center justify-end">
              {!isAddMode && (
                <Button
                  onClick={onResetPassword}
                  disabled={addUpdateMutation.isLoading}
                  loading={addUpdateMutation.isLoading}
                  type="button"
                  className="relative flex items-center h-12 px-4 mr-2 font-medium text-white transition rounded shadow-lg bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70"
                >
                  Đổi mật khẩu
                </Button>
              )}
              <Button
                disabled={addUpdateMutation.isLoading}
                loading={addUpdateMutation.isLoading}
                type="submit"
                className="relative flex items-center h-12 px-4 font-medium text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
              >
                {isAddMode ? 'Thêm mới' : 'Cập nhập'}
              </Button>
            </div>
          </div>
        </div>
        <div
          className={clsx(
            'relative py-6 grow scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded dark:bg-dark-aside',
            !isAddMode && memberCurrent.isLoading
              ? 'overflow-hidden'
              : 'overflow-auto'
          )}
        >
          <div className="container max-w-4xl">
            <div className="border rounded border-separator dark:border-dark-separator">
              <div className="px-5 py-3.5 text-xl font-semibold border-b border-separator dark:border-dark-separator font-inter dark:text-white">
                Thông tin cơ bản
              </div>
              <div className="flex p-5">
                <div className="w-[176px]">
                  <Controller
                    name="Photo"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <UploadAvatar
                        value={field.value}
                        //placeholder="Các tệp cho phép: png, jpg, jpeg."
                        //errorMessageForce={true}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div className="grid flex-1 grid-cols-2 gap-5 pl-6">
                  <div>
                    <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                      Họ và tên
                    </div>
                    <Controller
                      name="FullName"
                      control={control}
                      render={({ field: { ref, ...field }, fieldState }) => (
                        <Input
                          placeholder="Nhập họ và tên"
                          autoComplete="off"
                          type="text"
                          errorMessageForce={fieldState?.invalid}
                          errorMessage={fieldState?.error?.message}
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                      Email
                    </div>
                    <Controller
                      name="Email"
                      control={control}
                      render={({ field: { ref, ...field }, fieldState }) => (
                        <Input
                          placeholder="Nhập Email"
                          type="text"
                          errorMessageForce={fieldState?.invalid}
                          errorMessage={fieldState?.error?.message}
                          {...field}
                          autoComplete="Emails"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                      Số điện thoại
                    </div>
                    <Controller
                      name="MobilePhone"
                      control={control}
                      render={({ field: { ref, ...field }, fieldState }) => (
                        <Input
                          placeholder="Nhập số điện thoại"
                          autoComplete="MobilePhone"
                          type="text"
                          errorMessageForce={fieldState?.invalid}
                          errorMessage={fieldState?.error?.message}
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                      Số điện thoại khác
                      <span className="pl-1 font-sans font-normal text-muted">
                        ( Nếu có )
                      </span>
                    </div>
                    <Controller
                      name="FixedPhone"
                      control={control}
                      render={({ field: { ref, ...field }, fieldState }) => (
                        <Input
                          autoComplete="FixedPhone"
                          placeholder="Nhập số điện thoại"
                          type="text"
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div>
                  <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                    Ghi chú
                    <span className="pl-1 font-sans font-normal text-muted">
                      ( Tùy chọn )
                    </span>
                  </div>
                  <Controller
                    name="Desc"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <InputTextarea
                        className="resize-none"
                        rows={3}
                        placeholder="Nhập ghi chú"
                        autoComplete="off"
                        type="text"
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="p-5 border-t border-separator dark:border-dark-separator">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                      Ngày sinh
                    </div>
                    <Controller
                      name="Birth"
                      control={control}
                      render={({ field: { ref, ...field }, fieldState }) => (
                        <InputDatePicker
                          placeholderText="Chọn ngày sinh"
                          autoComplete="off"
                          onChange={field.onChange}
                          selected={field.value}
                          dateFormat="dd/MM/yyyy"
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                      Giới tính
                    </div>
                    <Controller
                      name="Gender"
                      control={control}
                      render={({ field: { ref, ...field }, fieldState }) => (
                        <SelectGender
                          className="select-control"
                          value={field.value}
                          onChange={val => field.onChange(val)}
                        />
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                      Địa chỉ
                    </div>
                    <Controller
                      name="HomeAddress"
                      control={control}
                      render={({ field: { ref, ...field }, fieldState }) => (
                        <Input
                          placeholder="Nhập địa chỉ"
                          autoComplete="off"
                          type="text"
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <Controller
                    name="ProvinceID"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <div>
                        <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                          Thành phố
                        </div>
                        <Select
                          isClearable
                          value={
                            dataAdd?.data?.Provinces
                              ? dataAdd?.data?.Provinces.filter(
                                  x => x.value === Number(field.value)
                                )
                              : null
                          }
                          onChange={(selectedOption, triggeredAction) => {
                            if (triggeredAction.action === 'clear') {
                              // Clear
                              setValue('DistrictID', '')
                            }
                            field.onChange(selectedOption?.value || '')
                          }}
                          isLoading={dataAdd.isLoading}
                          className="select-control"
                          classNamePrefix="select"
                          options={dataAdd?.data?.Provinces}
                          placeholder="Chọn Thành phố"
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
                        <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                          Quận huyện
                        </div>
                        <SelectDistricts
                          className="select-control"
                          isClearable
                          ProvinceID={WatchProvinceID}
                          value={field.value}
                          onChange={val => field.onChange(val?.value || '')}
                          noOptionsMessage={() => 'Không có dữ liệu'}
                        />
                      </div>
                    )}
                  />
                  <div>
                    <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                      Nhân viên phụ trách
                    </div>
                    <Controller
                      name="DistrictID"
                      control={control}
                      render={({ field: { ref, ...field }, fieldState }) => (
                        <SelectUserAdmin
                          className="select-control"
                          isClearable
                          value={field.value}
                          onChange={val => field.onChange(val?.value || '')}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                      Nguồn
                    </div>
                    <Controller
                      name="Source"
                      control={control}
                      render={({ field: { ref, ...field }, fieldState }) => (
                        <Select
                          value={
                            dataAdd?.data?.Sources?.filter(
                              x => x.value === Number(field.value)
                            ) || null
                          }
                          className="select-control"
                          classNamePrefix="select"
                          isLoading={dataAdd.isLoading}
                          options={dataAdd?.data?.Sources}
                          placeholder="Chọn nguồn"
                          noOptionsMessage={() => 'Không có dữ liệu'}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                      Mã vạch
                    </div>
                    <Controller
                      name="HandCardID"
                      control={control}
                      render={({ field: { ref, ...field }, fieldState }) => (
                        <Input
                          placeholder="Nhập mã vạch"
                          autoComplete="off"
                          type="text"
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                      Giữ nhóm
                    </div>
                    <div className="flex items-center py-3">
                      <Controller
                        name="IsKeepGroup"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <Checkbox
                            labelText="Không hạ cấp"
                            htmlFor="khong_ha_cap"
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 border rounded border-separator dark:border-dark-separator">
              <div className="px-5 py-3.5 text-xl font-semibold border-b border-separator dark:border-dark-separator font-inter dark:text-white">
                Nhóm thành viên
              </div>
              <div className="flex p-6">
                {dataAdd?.data?.MemberGroups.map((group, index) => (
                  <Controller
                    key={index}
                    name="InputGroups"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <div className="mr-6" key={index}>
                        <Checkbox
                          labelText={group.Title}
                          htmlFor={'group-' + group.ID}
                          {...field}
                          onChange={() => field.onChange(group.ID)}
                          checked={Number(field.value) === Number(group.ID)}
                        />
                      </div>
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
          <LoadingComponentFull
            bgClassName="bg-white dark:bg-dark-aside"
            loading={!isAddMode && memberCurrent.isLoading}
          />
        </div>
      </form>
    </FixedLayout>
  )
}

export default ClientAddEdit
