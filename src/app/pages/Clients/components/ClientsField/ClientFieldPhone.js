import { FloatingPortal } from '@floating-ui/react'
import { Dialog } from '@headlessui/react'
import { PencilIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { Controller, useForm, useFormContext } from 'react-hook-form'
import { Button } from 'src/_ezs/partials/button'
import { Input, InputNumber } from 'src/_ezs/partials/forms'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import MembersAPI from 'src/_ezs/api/members.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
const schemaChange = yup
  .object({
    e2: yup
      .string()
      .matches(phoneRegExp, 'Số điện thoại không hợp lệ.')
      .required('Vui lòng nhập số điện thoại')
  })
  .required()

const ClientFieldPhone = ({ isAddMode }) => {
  const queryClient = useQueryClient()
  const { control, watch } = useFormContext()
  const [isOpen, setIsOpen] = useState(false)

  let PhoneCurrent = watch().MobilePhone

  const {
    control: controlField,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch: watchField
  } = useForm({
    defaultValues: {
      e1: PhoneCurrent,
      e2: PhoneCurrent
    },
    resolver: yupResolver(schemaChange)
  })

  useEffect(() => {
    setValue('e1', PhoneCurrent)
    setValue('e2', PhoneCurrent)
    clearErrors()
  }, [PhoneCurrent, setValue, clearErrors, isOpen])

  const onOpen = () => setIsOpen(true)

  const onHide = () => setIsOpen(false)

  const changePhoneMutation = useMutation({
    mutationFn: body => MembersAPI.memberChangePhone(body)
  })

  const onSubmit = event => {
    if (event) {
      if (typeof event.preventDefault === 'function') {
        event.preventDefault()
      }
      if (typeof event.stopPropagation === 'function') {
        event.stopPropagation()
      }
    }

    return handleSubmit(async values => {
      var bodyFormData = new FormData()
      bodyFormData.append('cmd', 'chang_phone')
      bodyFormData.append('e1', values.e1)
      bodyFormData.append('e2', values.e2)

      changePhoneMutation.mutate(bodyFormData, {
        onSuccess: ({ data }) => {
          if (data?.error) {
            setError('e2', {
              type: 'Server',
              message: data.error
            })
          } else {
            queryClient
              .invalidateQueries({ queryKey: ['memberSearchID'] })
              .then(() => {
                toast.success('Thay đổi số điện thoại thành công')
                onHide()
              })
          }
        },
        onError: err => {
          console.log(err)
        }
      })
    })(event)
  }
  return (
    <>
      <Controller
        name="MobilePhone"
        control={control}
        render={({ field: { ref, ...field }, fieldState }) => (
          <div className="relative">
            <Input
              placeholder="Nhập số điện thoại"
              autoComplete="MobilePhone"
              type="text"
              errorMessageForce={fieldState?.invalid}
              errorMessage={fieldState?.error?.message}
              disabled={!isAddMode}
              {...field}
            />
            <div
              className="absolute top-0 right-0 z-10 flex items-center justify-center w-12 h-full cursor-pointer"
              onClick={onOpen}
            >
              <PencilIcon className="w-4" />
            </div>
          </div>
        )}
      />
      <AnimatePresence>
        {isOpen && (
          <FloatingPortal>
            <LayoutGroup key={isOpen}>
              <Dialog open={isOpen} onClose={onHide}>
                <motion.div
                  className="fixed inset-0 bg-black/[.2] dark:bg-black/[.4] z-[1010]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></motion.div>
                <form
                  onSubmit={onSubmit}
                  className="fixed inset-0 flex items-center justify-center z-[1010]"
                >
                  <motion.div
                    className="absolute flex flex-col justify-center h-full py-10"
                    initial={{ opacity: 0, top: '60%' }}
                    animate={{ opacity: 1, top: 'auto' }}
                    exit={{ opacity: 0, top: '60%' }}
                  >
                    <Dialog.Panel className="bg-white dark:bg-dark-aside max-w-full w-[500px] max-h-full rounded shadow-lg flex flex-col">
                      <Dialog.Title className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
                        <div className="text-2xl font-bold">
                          Thay đổi số điện thoại
                        </div>
                        <div
                          className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                          onClick={onHide}
                        >
                          <XMarkIcon className="w-8" />
                        </div>
                      </Dialog.Title>
                      <div className="relative p-5 overflow-auto grow">
                        <div className="mb-2">
                          <div className="font-semibold">Số điện thoại</div>
                          <div className="mt-1">
                            <Controller
                              name="e2"
                              control={controlField}
                              render={({
                                field: { ref, ...field },
                                fieldState
                              }) => (
                                <InputNumber
                                  placeholder="Nhập số điện thoại"
                                  allowNegative={false}
                                  value={field.value}
                                  onValueChange={val => {
                                    field.onChange(val.value || '')
                                  }}
                                  allowLeadingZeros
                                  errorMessageForce={fieldState?.invalid}
                                  errorMessage={fieldState?.error?.message}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end p-5 border-t border-separator dark:border-dark-separator">
                        <Button
                          type="button"
                          className="relative flex items-center px-4 font-bold transition border border-gray-300 rounded shadow-lg dark:border-gray-700 h-11 hover:border-gray-800 focus:outline-none focus:shadow-none"
                          onClick={onHide}
                        >
                          Đóng
                        </Button>
                        <Button
                          loading={changePhoneMutation.isLoading}
                          disabled={
                            changePhoneMutation.isLoading ||
                            watchField().e1 === watchField().e2
                          }
                          type="submit"
                          className="relative flex items-center px-4 ml-2 font-semibold text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                          onClick={onSubmit}
                        >
                          Lưu thay đổi
                        </Button>
                      </div>
                    </Dialog.Panel>
                  </motion.div>
                </form>
              </Dialog>
            </LayoutGroup>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  )
}

export { ClientFieldPhone }
