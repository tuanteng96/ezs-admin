import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import OrdersAPI from 'src/_ezs/api/orders'
import { LayoutGroup, m, AnimatePresence } from 'framer-motion'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from 'src/_ezs/partials/button'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { SelectMembers } from 'src/_ezs/partials/select/SelectMembers'
import clsx from 'clsx'

const schemaChange = yup
  .object({
    memberid: yup.object().required('Vui lòng chọn khách hàng')
  })
  .required()

const BtnChangeMember = ({ className, OrderID, children }) => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const { control, handleSubmit } = useForm({
    defaultValues: {
      memberid: null,
      orderid: OrderID
    },
    resolver: yupResolver(schemaChange)
  })

  const onOpen = () => setIsOpen(true)

  const onHide = () => setIsOpen(false)

  const orderChangeMemberMutation = useMutation({
    mutationFn: body => OrdersAPI.orderChangeMember(body)
  })

  const onSubmit = values => {
    let dataChange = {
      ...values,
      memberid: values?.memberid?.value
    }
    orderChangeMemberMutation.mutate(dataChange, {
      onSuccess: ({ data }) => {
        if (data?.data?.error) {
          toast.error(data?.error)
        } else {
          onHide()
          toast.success('Thay đổi khách hàng thành công.')
          navigate(`/clients/${values?.memberid?.value}/order/42585`, {
            state: {
              previousPath: `/clients/${values?.memberid?.value}`
            }
          })
        }
      },
      onError: error => {
        console.log(error)
      }
    })
  }

  return (
    <>
      <div className={className} onClick={onOpen}>
        {children}
      </div>
      <AnimatePresence>
        <LayoutGroup key={isOpen}>
          <Dialog open={isOpen} onClose={onHide}>
            <m.div
              className="fixed inset-0 bg-black/[.2] dark:bg-black/[.4] z-[1003]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            ></m.div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="fixed inset-0 flex items-center justify-center z-[1003]"
              autoComplete="off"
            >
              <m.div
                className="flex flex-col justify-center h-full py-8"
                initial={{ opacity: 0, top: '60%' }}
                animate={{ opacity: 1, top: 'auto' }}
                exit={{ opacity: 0, top: '60%' }}
              >
                <Dialog.Panel className="bg-white dark:bg-dark-aside max-w-full w-[500px] max-h-full rounded shadow-lg flex flex-col">
                  <Dialog.Title className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
                    <div className="text-2xl font-bold">
                      Thay đổi khách mua hàng
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
                      <div className="font-semibold">Khách hàng</div>
                      <div className="mt-1">
                        <Controller
                          name="memberid"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <SelectMembers
                              isClearable
                              value={field.value}
                              onChange={val => field.onChange(val)}
                              className={clsx(
                                'select-control',
                                fieldState?.invalid && 'select-control-error'
                              )}
                              menuPortalTarget={document.body}
                              menuPosition="fixed"
                              styles={{
                                menuPortal: base => ({
                                  ...base,
                                  zIndex: 9999
                                })
                              }}
                              errorMessageForce={fieldState?.invalid}
                              errorMessage={fieldState?.error?.message}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="text-[15px] text-gray-800 dark:text-gray-300 font-medium">
                      <span className="pr-1 text-danger">(*)</span>
                      Thông tin các buổi dịch vụ, tích lũy thành viên sẽ được
                      chuyển theo
                    </div>
                  </div>
                  <div className="flex justify-end p-5 border-t border-separator dark:border-dark-separator">
                    <Button
                      type="button"
                      className="relative flex items-center px-4 font-bold transition border border-gray-300 rounded shadow-lg dark:border-gray-700 h-11 hover:border-gray-800 focus:outline-none focus:shadow-none"
                      onClick={onHide}
                    >
                      Hủy
                    </Button>
                    <Button
                      loading={orderChangeMemberMutation.isLoading}
                      disabled={orderChangeMemberMutation.isLoading}
                      type="submit"
                      className="relative flex items-center px-4 ml-2 font-semibold text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                    >
                      Thực hiện
                    </Button>
                  </div>
                </Dialog.Panel>
              </m.div>
            </form>
          </Dialog>
        </LayoutGroup>
      </AnimatePresence>
    </>
  )
}

BtnChangeMember.propTypes = {
  className: PropTypes.string
}

export { BtnChangeMember }
