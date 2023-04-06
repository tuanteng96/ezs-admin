import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import OrdersAPI from 'src/_ezs/api/orders'
import { LayoutGroup, motion, AnimatePresence } from 'framer-motion'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from 'src/_ezs/partials/button'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Input } from 'src/_ezs/partials/forms'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'

const schemaCOD = yup
  .object({
    ShipCode: yup.string().required('Vui lòng nhập mã vận chuyển')
  })
  .required()

const BtnCOD = ({ className, OrderID, children }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      ID: '',
      ShipCode: '',
      Shipper: ''
    },
    resolver: yupResolver(schemaCOD)
  })

  const onOpen = () => setIsOpen(true)

  const onHide = () => setIsOpen(false)

  const resultCOD = useQuery({
    queryKey: ['OrderCOD', { id: OrderID }],
    queryFn: async () => {
      const { data } = await OrdersAPI.orderGetCOD({ id: OrderID })
      return {
        order: data?.order,
        shipperList: data.shipperList
          ? data.shipperList.map(x => ({ label: x, value: x }))
          : []
      }
    },
    onSuccess: data => {
      if (data?.order) {
        reset({
          ID: data?.order?.ID || 0,
          ShipCode: data?.order?.ShipCode || '',
          Shipper:
            data?.order?.Shipper ||
            (data?.shipperList && data?.shipperList?.length > 0)
              ? data?.shipperList[0].value
              : ''
        })
      } else {
        toast.warning('Không tìm thấy đơn hàng')
        navigate(-1)
      }
    },
    enabled: isOpen
  })

  const orderUpdateCODMutation = useMutation({
    mutationFn: body => OrdersAPI.orderUpdateCOD(body)
  })

  const onSubmit = values => {
    let dataUpdate = {
      orders: [values]
    }
    orderUpdateCODMutation.mutate(dataUpdate, {
      onSuccess: ({ data }) => {
        if (data?.error) {
          toast.error(data?.error)
        } else {
          queryClient
            .invalidateQueries({ queryKey: ['MemberListPay'] })
            .then(() => {
              onHide()
              toast.success('Cập nhập đơn vị vận chuyển thành công.')
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
            <motion.div
              className="fixed inset-0 bg-black/[.2] dark:bg-black/[.4] z-[1003]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            ></motion.div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="fixed inset-0 flex items-center justify-center z-[1003]"
              autoComplete="off"
            >
              <motion.div
                className="absolute flex flex-col justify-center h-full py-8"
                initial={{ opacity: 0, top: '60%' }}
                animate={{ opacity: 1, top: 'auto' }}
                exit={{ opacity: 0, top: '60%' }}
              >
                <Dialog.Panel className="bg-white dark:bg-dark-aside max-w-full w-[500px] max-h-full rounded shadow-lg flex flex-col">
                  <Dialog.Title className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
                    <div className="text-2xl font-bold">Vận chuyển</div>
                    <div
                      className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                      onClick={onHide}
                    >
                      <XMarkIcon className="w-8" />
                    </div>
                  </Dialog.Title>
                  <div className="relative p-5 overflow-auto grow">
                    <div className="mb-4">
                      <div className="font-semibold">Vận chuyển</div>
                      <div className="mt-1">
                        <Controller
                          name="Shipper"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <Select
                              classNamePrefix="select"
                              options={resultCOD?.data?.shipperList || []}
                              className="select-control mb-8px"
                              placeholder="Chọn đơn vị"
                              value={
                                resultCOD?.data?.shipperList
                                  ? resultCOD?.data?.shipperList.filter(
                                      x => x.value === field.value
                                    )
                                  : null
                              }
                              onChange={val => field.onChange(val?.value || '')}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold">Mã vận chuyển</div>
                      <div className="mt-1">
                        <Controller
                          name="ShipCode"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <Input
                              placeholder="Nhập mã"
                              value={field.value}
                              onChange={field.onChange}
                              errorMessageForce={fieldState?.invalid}
                              errorMessage={fieldState?.error?.message}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <LoadingComponentFull
                      bgClassName="bg-white dark:bg-dark-aside"
                      loading={resultCOD.isLoading}
                    />
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
                      loading={orderUpdateCODMutation.isLoading}
                      disabled={orderUpdateCODMutation.isLoading}
                      type="submit"
                      className="relative flex items-center px-4 ml-2 font-semibold text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                    >
                      Thực hiện
                    </Button>
                  </div>
                </Dialog.Panel>
              </motion.div>
            </form>
          </Dialog>
        </LayoutGroup>
      </AnimatePresence>
    </>
  )
}

BtnCOD.propTypes = {
  className: PropTypes.string
}

export { BtnCOD }
