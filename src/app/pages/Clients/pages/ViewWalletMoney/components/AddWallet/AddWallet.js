import React from 'react'
import PropTypes from 'prop-types'
import { Dialog } from '@headlessui/react'
import { LayoutGroup, motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from 'src/_ezs/partials/button'
import { InputNumber, InputTextarea } from 'src/_ezs/partials/forms'
import Select from 'react-select'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import MembersAPI from 'src/_ezs/api/members.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

let TypeWallet = [
  {
    value: 1,
    label: 'Tiền mặt'
  },
  {
    value: 2,
    label: 'Chuyển khoản'
  },
  {
    value: 3,
    label: 'Quẹt thẻ'
  },
  {
    value: -1,
    label: 'Nạp ví không thu tiền'
  }
]

const schemaWalletAdd = yup
  .object({
    value: yup
      .number()
      .transform(value =>
        isNaN(value) || value === null || value === undefined ? 0 : value
      )
      .min(1, 'Số tiền nạp ví phải lớn hơn 0')
      .required('Vui lòng nhập số tiền')
  })
  .required()

function AddWallet({ onHide, isOpen }) {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      value: '',
      desc: '',
      MemberID: id,
      MethodPayID: '1',
      RelPromo: 'DV'
    },
    resolver: yupResolver(schemaWalletAdd)
  })

  const addMoneyMutation = useMutation({
    mutationFn: body => MembersAPI.memberWalletAddMoney(body)
  })

  const onSubmit = ({ value, desc, MemberID, MethodPayID, RelPromo }) => {
    var bodyFormData = new FormData()
    bodyFormData.append('cmd', 'add_money')
    bodyFormData.append('value', value)
    bodyFormData.append('desc', desc)
    bodyFormData.append('MemberID', MemberID)
    bodyFormData.append('MethodPayID', MethodPayID)
    bodyFormData.append('RelPromo', RelPromo)

    addMoneyMutation.mutate(bodyFormData, {
      onSuccess: data => {
        queryClient
          .invalidateQueries({ queryKey: ['MemberListWallet'] })
          .then(() => {
            reset()
            toast.success('Nạp ví điện tử thành công')
          })
      },
      onError: error => {
        console.log(error)
      }
    })
  }

  return (
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
              <Dialog.Panel className="bg-white dark:bg-dark-aside max-w-full w-[500px] max-h-full flex flex-col rounded shadow-lg">
                <Dialog.Title className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
                  <div className="text-2xl font-bold">Nạp ví điện tử</div>
                  <div
                    className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                    onClick={onHide}
                  >
                    <XMarkIcon className="w-8" />
                  </div>
                </Dialog.Title>
                <div className="p-5 overflow-auto grow">
                  <div className="mb-3.5">
                    <div className="font-semibold">Số tiền</div>
                    <div className="mt-1">
                      <Controller
                        name="value"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <InputNumber
                            placeholder="Nhập số tiền"
                            thousandSeparator={true}
                            value={field.value}
                            onValueChange={val =>
                              field.onChange(val.floatValue)
                            }
                            errorMessageForce={fieldState?.invalid}
                            errorMessage={fieldState?.error?.message}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="mb-3.5">
                    <div className="font-semibold">Loại</div>
                    <div className="mt-1">
                      <Controller
                        name="MethodPayID"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <Select
                            classNamePrefix="select"
                            options={TypeWallet}
                            className="select-control mb-8px"
                            placeholder="Chọn loại"
                            value={TypeWallet.filter(
                              x => x.value === Number(field.value)
                            )}
                            onChange={val => field.onChange(val?.value || '')}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">Ghi chú</div>
                    <div className="mt-1">
                      <Controller
                        name="desc"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <InputTextarea
                            placeholder="Nhập ghi chú"
                            {...field}
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
                    loading={addMoneyMutation.isLoading}
                    disabled={addMoneyMutation.isLoading}
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
  )
}

AddWallet.propTypes = {
  isOpen: PropTypes.bool,
  onHide: PropTypes.func
}

export default AddWallet
