import React from 'react'
import { toast } from 'react-toastify'
import { Button } from 'src/_ezs/partials/button'
import { Card } from 'src/_ezs/partials/card'
import { InputSolid } from 'src/_ezs/partials/forms'
import { Controller, useForm } from 'react-hook-form'
import { useAuth } from 'src/_ezs/core/Auth'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import UsersAPI from 'src/_ezs/api/users.api'
import { ChangePassword } from './components/ChangePassword'
import { UploadFile } from 'src/_ezs/partials/files'

const schemaUpdateInfo = yup
  .object({
    FullName: yup.string().required('Vui lòng nhập họ và tên'),
    Email: yup
      .string()
      .email('Email không đúng định dạng')
      .required('Vui lòng nhập Email'),
    Phone: yup.string().required('Vui lòng nhập số điện thoại')
  })
  .required()

export default function ProfilePage() {
  const { auth } = useAuth()
  const { control, handleSubmit } = useForm({
    defaultValues: {
      Avatar: auth?.User?.Avatar || '',
      FullName: auth?.User?.FullName || '',
      Email: auth?.User?.Email || '',
      Phone: auth?.User?.Phone || ''
    },
    resolver: yupResolver(schemaUpdateInfo)
  })

  const queryClient = useQueryClient()

  const updateUserMutation = useMutation({
    mutationFn: body => UsersAPI.updateProfile(body)
  })

  const onSubmit = values => {
    const dataUpdated = {
      info: values
    }
    updateUserMutation.mutate(dataUpdated, {
      onSuccess: data => {
        queryClient.invalidateQueries({ queryKey: ['Auth'] }).then(() => {
          toast.success('Cập nhập thành công.')
        })
      },
      onError: error => {
        console.log(error)
      }
    })
  }
  return (
    <div className="relative w-full py-8">
      <div className="container lg:max-w-[1024px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <Card.Header>
              <div className="flex items-center pt-1.5 text-xl font-semibold font-inter dark:text-white">
                Thông tin cá nhân
              </div>
              <div>
                {/* <Button
                  type="submit"
                  className="relative flex items-center h-12 px-4 font-medium text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
                  disabled={updateUserMutation.isLoading}
                  loading={updateUserMutation.isLoading}
                >
                  Lưu thông tin
                </Button> */}
              </div>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="py-2.5 text-base text-gray-800 dark:text-graydark-800 font-inter">
                  Avatar
                </div>
                <div className="col-span-2">
                  <Controller
                    name="Avatar"
                    control={control}
                    render={({ field }) => (
                      <UploadFile
                        value={field.value}
                        placeholder="Các tệp cho phép: png, jpg, jpeg."
                        //errorMessageForce={true}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div />
              </div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="py-2.5 text-base text-gray-800 dark:text-graydark-800 font-inter">
                  Tài khoản
                </div>
                <div className="col-span-2">
                  <InputSolid
                    type="text"
                    placeholder="Nhập tài khoản"
                    value={auth.User.UserName}
                    disabled={true}
                    readOnly
                  />
                </div>
                <div />
              </div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="py-2.5 text-base text-gray-800 dark:text-graydark-800 font-inter">
                  Họ và tên
                </div>
                <div className="col-span-2">
                  <Controller
                    name="FullName"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <InputSolid
                        autoComplete="off"
                        type="text"
                        placeholder="Nhập họ tên"
                        errorMessageForce={fieldState?.invalid}
                        errorMessage={fieldState?.error?.message}
                        {...field}
                      />
                    )}
                  />
                </div>
                <div />
              </div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="py-2.5 text-base text-gray-800 dark:text-graydark-800 font-inter">
                  Email
                </div>
                <div className="col-span-2">
                  <Controller
                    name="Email"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <InputSolid
                        type="text"
                        placeholder="Nhập Email"
                        errorMessageForce={fieldState?.invalid}
                        errorMessage={fieldState?.error?.message}
                        {...field}
                      />
                    )}
                  />
                </div>
                <div />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="py-2.5 text-base text-gray-800 dark:text-graydark-800 font-inter">
                  Số điện thoại
                </div>
                <div className="col-span-2">
                  <Controller
                    name="Phone"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <InputSolid
                        type="text"
                        placeholder="Nhập số điện thoại"
                        errorMessageForce={fieldState?.invalid}
                        errorMessage={fieldState?.error?.message}
                        {...field}
                      />
                    )}
                  />
                </div>
                <div />
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="grid grid-cols-4 gap-4">
                <div />
                <div className="col-span-2">
                  <Button
                    type="submit"
                    className="relative flex items-center h-12 px-4 font-medium text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
                    disabled={updateUserMutation.isLoading}
                    loading={updateUserMutation.isLoading}
                  >
                    Lưu thông tin
                  </Button>
                </div>
                <div />
              </div>
            </Card.Footer>
          </Card>
        </form>
        <ChangePassword />
      </div>
    </div>
  )
}
