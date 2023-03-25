import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Card } from 'src/_ezs/partials/card'
import { EZSSVG } from 'src/_ezs/partials/svg'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { InputSolid } from 'src/_ezs/partials/forms'
import { Button } from 'src/_ezs/partials/button'
import AuthAPI from 'src/_ezs/api/auth.api'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from 'src/_ezs/core/Auth'

const schemaUpdatePassword = yup
  .object({
    NewPassword: yup.string().required('Vui lòng nhập mật khẩu hiện tại'),
    RenewPasswrod: yup
      .string()
      .oneOf([yup.ref('NewPassword'), null], 'Mật khẩu không trừng khớp')
      .required('Vui lòng nhập mật khẩu mới'),
    CurrentPassword: yup.string().required('Vui lòng nhập lại mật khẩu mới')
  })
  .required()

function ChangePassword() {
  const { saveAuth } = useAuth()
  const [isChangePwd, setIsChangePwd] = useState(false)
  const { control, handleSubmit, setError, reset } = useForm({
    defaultValues: {
      NewPassword: '',
      RenewPasswrod: '',
      CurrentPassword: ''
    },
    resolver: yupResolver(schemaUpdatePassword)
  })

  const resetPwdMutation = useMutation({
    mutationFn: body => AuthAPI.resetPassword(body)
  })

  const onSubmit = values => {
    const dataUpdated = {
      setpwd: values
    }
    resetPwdMutation.mutate(dataUpdated, {
      onSuccess: ({ data }) => {
        if (data.error) {
          setError(data.key, {
            type: 'Server',
            message: data.error
          })
        } else {
          setIsChangePwd(false)
          reset()
          saveAuth({ token: data.token })
          toast.success('Thay đổi mật khẩu thành công.')
        }
      },
      onError: error => {
        console.log(error)
      }
    })
  }

  return (
    <form className="mt-7" onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <Card.Header>
          <div className="flex items-center pt-1.5 text-xl font-semibold font-inter dark:text-white">
            Thông tin bảo mật
          </div>
        </Card.Header>
        <Card.Body>
          {!isChangePwd && (
            <div className="flex justify-between">
              <div>
                <div className="font-bold dark:text-white">Mật khẩu</div>
                <div className="mt-1 text-sm text-gray-600 dark:text-graydark-600">
                  ************
                </div>
              </div>
              <div>
                <button
                  type="button"
                  className="relative flex items-center h-12 px-4 font-semibold transition rounded text-lightinverse bg-light dark:bg-dark-light hover:dark:bg-dark-primarylight hover:bg-primarylight hover:text-primary dark:hover:text-primary focus:outline-none focus:shadow-none dark:text-lightinverse"
                  onClick={() => setIsChangePwd(true)}
                >
                  Thay đổi mật khẩu
                </button>
              </div>
            </div>
          )}

          {isChangePwd && (
            <div>
              <div className="grid grid-cols-3 gap-5">
                <div>
                  <div className="mb-2.5 font-bold dark:text-white">
                    Mật khẩu hiện tại
                  </div>
                  <Controller
                    name="CurrentPassword"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <InputSolid
                        autoComplete="off"
                        type="password"
                        //placeholder="Nhập mật khẩu hiện tại"
                        errorMessageForce={fieldState?.invalid}
                        errorMessage={fieldState?.error?.message}
                        {...field}
                      />
                    )}
                  />
                </div>
                <div>
                  <div className="mb-2.5 font-bold dark:text-white">
                    Mật khẩu mới
                  </div>
                  <Controller
                    name="NewPassword"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <InputSolid
                        autoComplete="off"
                        type="password"
                        //placeholder="Nhập mật khẩu hiện tại"
                        errorMessageForce={fieldState?.invalid}
                        errorMessage={fieldState?.error?.message}
                        {...field}
                      />
                    )}
                  />
                </div>
                <div>
                  <div className="mb-2.5 font-bold dark:text-white">
                    Nhập lại mật khẩu mới
                  </div>
                  <Controller
                    name="RenewPasswrod"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <InputSolid
                        autoComplete="off"
                        type="password"
                        //placeholder="Nhập mật khẩu hiện tại"
                        errorMessageForce={fieldState?.invalid}
                        errorMessage={fieldState?.error?.message}
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex mt-5">
                <Button
                  className="relative flex items-center h-12 px-4 font-medium text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
                  type="submit"
                  disabled={resetPwdMutation.isLoading}
                  loading={resetPwdMutation.isLoading}
                >
                  Thay đổi mật khẩu
                </Button>
                <Button
                  className="relative flex items-center h-12 px-4 ml-2 font-medium text-gray-400 transition bg-transparent rounded hover:text-primary hover:bg-primarylight focus:outline-none focus:shadow-none disabled:opacity-70"
                  type="button"
                  onClick={() => {
                    reset()
                    setIsChangePwd(false)
                  }}
                >
                  Hủy bỏ
                </Button>
              </div>
            </div>
          )}
          <div className="flex p-6 mt-5 border border-dashed rounded-sm border-primary bg-primarylight dark:bg-dark-primarylight">
            <div>
              <EZSSVG
                svgClassName="text-primary"
                className="w-10"
                src="/assets/svg/general/gen048.svg"
              ></EZSSVG>
            </div>
            <div className="pl-3">
              <div className="mb-1 font-bold dark:text-white">
                Bảo vệ tài khoản của bạn
              </div>
              <div className="text-sm font-semibold text-gray-700 dark:text-graydark-700">
                Xác thực hai yếu tố bổ sung thêm một lớp bảo mật cho tài khoản
                của bạn. Để đăng nhập, ngoài ra, bạn cần cung cấp mã gồm 6 chữ
                số
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </form>
  )
}

export { ChangePassword }
