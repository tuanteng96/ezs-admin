import React, { useState, useEffect } from 'react'
import { m } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Controller, useForm } from 'react-hook-form'
import { Button } from 'src/_ezs/partials/button'
import { FloatingPortal } from '@floating-ui/react'
import { InputNumber } from 'src/_ezs/partials/forms'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import UsersAPI from 'src/_ezs/api/users.api'
import { toast } from 'react-toastify'
import clsx from 'clsx'

function PickerRating({ children, initialValues }) {
  const [visible, setVisible] = useState(false)

  const queryClient = useQueryClient()

  const onHide = () => {
    setVisible(false)
  }

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      AverRate: '',
      ID: '',
      SoCaYeuCau: '',
      Order: ''
    }
  })

  useEffect(() => {
    if (initialValues) {
      reset({
        AverRate: initialValues?.AverRate || '',
        ID: initialValues?.ID || '',
        SoCaYeuCau: initialValues?.SoCaYeuCau || '',
        Order: initialValues?.Order || ''
      })
    } else {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const updateMutation = useMutation({
    mutationFn: async ({ Rating, Updates }) => {
      let rs = await UsersAPI.updateRatingUser(Rating)
      await UsersAPI.addEditUser2(Updates)
      await queryClient.invalidateQueries({
        queryKey: ['ListUserRoles']
      })
      return rs
    }
  })

  const onSubmit = values => {
    let newValues = { ...values }
    delete newValues.Order

    updateMutation.mutate(
      {
        Rating: {
          users: [newValues]
        },
        Updates: {
          updates: [
            {
              UserID: initialValues.ID,
              Order: values?.Order || 0
            }
          ]
        }
      },
      {
        onSuccess: () => {
          onHide()
          toast.success('Cập nhật thành công.')
        }
      }
    )
  }

  const handleSubmitWithoutPropagation = e => {
    e.preventDefault()
    e.stopPropagation()
    handleSubmit(onSubmit)(e)
  }

  return (
    <>
      {children({
        open: () => setVisible(true)
      })}
      {visible && (
        <FloatingPortal root={document.body}>
          <form
            onSubmit={handleSubmitWithoutPropagation}
            className="fixed inset-0 flex items-center justify-center z-[1003]"
            autoComplete="off"
            onKeyDown={e => {
              if (e.key === 'Enter') e.preventDefault()
            }}
          >
            <m.div
              className="absolute inset-0 bg-black/[.2] dark:bg-black/[.4]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onHide}
            ></m.div>
            <m.div
              className="absolute flex flex-col justify-center h-full py-8 px-4 sm:px-0 w-[500px] max-w-full"
              initial={{ opacity: 0, top: '60%' }}
              animate={{ opacity: 1, top: 'auto' }}
              exit={{ opacity: 0, top: '60%' }}
            >
              <div className="flex flex-col max-h-full bg-white rounded shadow-lg dark:bg-dark-aside">
                <div className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
                  <div className="text-2xl font-bold">
                    {initialValues?.FullName}
                  </div>
                  <div
                    className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                    onClick={onHide}
                  >
                    <XMarkIcon className="w-8" />
                  </div>
                </div>
                <div className="p-5 overflow-auto grow">
                  <div className="mb-4 last:mb-0">
                    <div className="font-semibold">Giá trị đánh giá</div>
                    <div className="mt-1">
                      <Controller
                        name="AverRate"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <div className="relative">
                            <InputNumber
                              thousandSeparator={false}
                              value={field.value}
                              placeholder="Nhập giá trị"
                              onValueChange={val => {
                                field.onChange(val.value)
                              }}
                              allowNegative={false}
                            />
                            <div className="absolute top-0 right-0 flex items-center h-full gap-1 px-4 cursor-pointer">
                              {[1, 2, 3, 4, 5].map((item, i) => (
                                <svg
                                  onClick={() => field.onChange(item)}
                                  key={i}
                                  className={clsx(
                                    'w-5',
                                    Number(field.value) < item
                                      ? 'text-gray-300'
                                      : 'text-warning'
                                  )}
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                  <div className="mb-4 last:mb-0">
                    <div className="font-semibold">
                      Số ca yêu cầu trong tháng
                    </div>
                    <div className="mt-1">
                      <Controller
                        name="SoCaYeuCau"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <InputNumber
                            thousandSeparator={false}
                            value={field.value}
                            placeholder="Nhập số ca"
                            onValueChange={val => field.onChange(val.value)}
                            allowNegative={false}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="mb-4 last:mb-0">
                    <div className="font-semibold">Số thứ tự</div>
                    <div className="mt-1">
                      <Controller
                        name={`Order`}
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <InputNumber
                            thousandSeparator={false}
                            value={field.value}
                            placeholder="Nhập số thứ tự"
                            onValueChange={val =>
                              field.onChange(
                                typeof val.floatValue !== 'undefined'
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
                <div className="flex justify-end p-5 border-t border-separator dark:border-dark-separator">
                  <Button
                    onClick={onHide}
                    type="button"
                    className="relative flex items-center px-4 font-bold transition border border-gray-300 rounded shadow-lg dark:border-gray-700 h-11 hover:border-gray-800 focus:outline-none focus:shadow-none"
                  >
                    Hủy
                  </Button>
                  <Button
                    loading={updateMutation.isLoading}
                    disabled={updateMutation.isLoading}
                    type="submit"
                    className="relative flex items-center px-4 ml-2 font-semibold text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              </div>
            </m.div>
          </form>
        </FloatingPortal>
      )}
    </>
  )
}

export default PickerRating
