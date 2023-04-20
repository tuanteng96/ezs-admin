/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import AuthAPI from 'src/_ezs/api/auth.api'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from 'src/_ezs/core/Auth'
import { toAbsoluteUrl } from 'src/_ezs/utils/assetPath'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { SEO } from 'src/_ezs/core/SEO'

const schemaLogin = yup
  .object({
    usn: yup.string().required('Vui lòng nhập tài khoản'),
    pwd: yup.string().required('Vui lòng nhập mật khẩu')
  })
  .required()

function Login() {
  const { saveAuth } = useAuth()
  const { control, handleSubmit, setError } = useForm({
    defaultValues: {
      usn: '',
      pwd: ''
    },
    resolver: yupResolver(schemaLogin)
  })

  const [isShowPWD, setIsShowPWD] = useState(false)

  const loginMutation = useMutation({
    mutationFn: body => AuthAPI.login(body)
  })

  const onSubmit = values => {
    var bodyFormData = new FormData()
    bodyFormData.append('usn', values.usn)
    bodyFormData.append('pwd', values.pwd)

    loginMutation.mutate(bodyFormData, {
      onSuccess: ({ data }) => {
        if (data.error) {
          setError(data.errorKey, {
            type: 'Server',
            message: data.error
          })
        } else {
          saveAuth({
            auth: data.Info,
            token: data.token
          })
        }
      },
      onError: error => {
        console.log(error)
      }
    })
  }

  return (
    <div className="max-w-[420px] w-full">
      <SEO title="Đăng nhập tài khoản" />
      <div className="flex items-center justify-center mb-8">
        <img
          className="w-24"
          src={toAbsoluteUrl('/assets/images/logos/logo-ezs.png')}
          alt="EZS - Phần mềm quản lý Spa"
        />
      </div>
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-2xl font-bold">Đăng nhập tài khoản</h2>
        <div className="px-5 text-sm">
          Tiến hành tài khoản và mật khẩu để bắt đầu quản lý doanh nghiệp của
          bạn.
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="usn"
          control={control}
          render={({ field, fieldState }) => (
            <div className="mb-3.5">
              <input
                type="text"
                className={clsx(
                  'rounded outline-none px-4 py-3.5 w-full border focus:border-primary hover:border-primary transition',
                  fieldState?.invalid ? 'border-danger' : 'border-[#d5d7da]'
                )}
                placeholder="Nhập tài khoản của bạn"
                autoComplete="off"
                {...field}
              />
              {fieldState?.invalid && (
                <div className="mt-1.5 text-xs text-danger">
                  {fieldState?.error?.message}
                </div>
              )}
            </div>
          )}
        />
        <div className="mb-4">
          <Controller
            name="pwd"
            control={control}
            render={({ field, fieldState }) => (
              <div className="mb-3.5">
                <div className="relative">
                  <input
                    type={isShowPWD ? 'text' : 'password'}
                    className={clsx(
                      'rounded outline-none px-4 py-3.5 w-full border focus:border-primary hover:border-primary transition',
                      fieldState?.invalid ? 'border-danger' : 'border-[#d5d7da]'
                    )}
                    placeholder="Nhập mật khẩu"
                    autoComplete="off"
                    {...field}
                  />
                  <div
                    className="absolute top-0 right-0 flex items-center justify-center w-12 h-full cursor-pointer"
                    onClick={() => setIsShowPWD(!isShowPWD)}
                  >
                    {isShowPWD && (
                      <EyeIcon className="w-5 h-5 text-site-muted" />
                    )}
                    {!isShowPWD && (
                      <EyeSlashIcon className="w-5 h-5 text-site-muted" />
                    )}
                  </div>
                </div>
                {fieldState?.invalid && (
                  <div className="mt-1.5 text-xs text-danger">
                    {fieldState?.error?.message}
                  </div>
                )}
              </div>
            )}
          />
        </div>
        <button
          className="w-full py-3.5 font-semibold text-white rounded shadow-lg bg-primary transiton hover:bg-primaryhv disabled:hover:bg-primary disabled:opacity-70 relative"
          type="submit"
          disabled={loginMutation.isLoading}
        >
          {loginMutation.isLoading && (
            <div className="absolute right-3 top-2/4 -translate-y-2/4">
              <svg
                aria-hidden="true"
                role="status"
                className="inline text-white w-7 h-7 animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          )}
          Đăng nhập
        </button>
        <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-[#e8e8ee] after:mt-0.5 after:flex-1 after:border-t after:border-[#e8e8ee]">
          <p className="mx-4 mb-0 text-sm font-semibold text-center uppercase text-site-muted dark:text-white">
            Or
          </p>
        </div>
        <div>
          <Link
            className="rounded py-3.5 border block text-center font-semibol transition bg-[#101928] text-white shadow hover:bg-[#404753]"
            to="/auth/forgot"
          >
            Quên mật khẩu
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Login
