import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import OrdersAPI from 'src/_ezs/api/orders'
import { LayoutGroup, motion } from 'framer-motion'
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
      <LayoutGroup key={isOpen}>
        <Dialog open={isOpen} onClose={onHide}>
          <motion.div
            className="fixed inset-0 bg-black/[.2] dark:bg-black/[.4] z-[1003]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          ></motion.div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="fixed inset-0 flex items-center justify-center z-[1003]"
            autoComplete="off"
          >
            <motion.div
              className="absolute"
              initial={{ opacity: 0, top: '80%' }}
              animate={{ opacity: 1, top: 'auto' }}
            >
              <Dialog.Panel className="bg-white dark:bg-dark-aside max-w-full w-[500px] rounded shadow-lg">
                <Dialog.Title className="flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator relative">
                  <div className="text-2xl font-bold">
                    Thay đổi khách mua hàng
                  </div>
                  <div
                    className="w-12 h-12 flex items-center justify-center absolute right-2 top-2/4 -translate-y-2/4 cursor-pointer"
                    onClick={onHide}
                  >
                    <XMarkIcon className="w-8" />
                  </div>
                </Dialog.Title>
                <div className="p-5 relative">
                  <div className="mb-2">
                    <div className="font-semibold">Khách hàng</div>
                    <div className="mt-1">
                      <Controller
                        name="memberid"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
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
                  <div className="text-[15px] text-gray-800 font-medium">
                    <span className="text-danger pr-1">(*)</span>
                    Thông tin các buổi dịch vụ, tích lũy thành viên sẽ được
                    chuyển theo
                  </div>
                </div>
                <div className="p-5 border-t border-separator dark:border-dark-separator flex justify-end">
                  <Button
                    type="button"
                    className="relative flex items-center px-4 border border-gray-300 dark:border-gray-700 transition rounded shadow-lg h-11 hover:border-gray-800 focus:outline-none focus:shadow-none font-bold"
                  >
                    Hủy
                  </Button>
                  <Button
                    loading={orderChangeMemberMutation.isLoading}
                    disabled={orderChangeMemberMutation.isLoading}
                    type="submit"
                    className="relative flex items-center px-4 font-semibold text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none ml-2 disabled:opacity-70"
                  >
                    Thực hiện
                  </Button>
                </div>
              </Dialog.Panel>
            </motion.div>
          </form>
        </Dialog>
      </LayoutGroup>
    </>
  )
}

BtnChangeMember.propTypes = {
  className: PropTypes.string
}

export { BtnChangeMember }
