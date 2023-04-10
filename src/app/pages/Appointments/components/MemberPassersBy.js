import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Controller, useForm, useFormContext } from 'react-hook-form'
import { Input } from 'src/_ezs/partials/forms'
import { Button } from 'src/_ezs/partials/button'
import { createPortal } from 'react-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schemaUser = yup
  .object({
    FullName: yup.string().required('Vui lòng nhập số điện thoại'),
    Phone: yup.string().required('Vui lòng nhập số điện thoại')
  })
  .required()

const isPhone = value => {
  var phone_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g
  return phone_regex.test(value)
}

function MemberPassersBy({ isOpen, onHide, onChange, valueKey }) {
  const watchForm = useFormContext().watch()

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      FullName: '',
      Phone: ''
    },
    resolver: yupResolver(schemaUser)
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        FullName: watchForm.FullName
          ? watchForm.FullName
          : !isPhone(valueKey)
          ? valueKey
          : '',
        Phone: watchForm.Phone
          ? watchForm.Phone
          : isPhone(valueKey)
          ? valueKey
          : ''
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

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
      onChange(values)
    })(event)
  }

  return createPortal(
    <AnimatePresence>
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
              className="absolute flex flex-col justify-center h-full py-8"
              initial={{ opacity: 0, top: '60%' }}
              animate={{ opacity: 1, top: 'auto' }}
              exit={{ opacity: 0, top: '60%' }}
            >
              <Dialog.Panel className="bg-white dark:bg-dark-aside max-w-full w-[500px] max-h-full rounded shadow-lg flex flex-col">
                <Dialog.Title className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
                  <div className="text-2xl font-bold">
                    Thông tin khách vãng lai
                  </div>
                  <div
                    className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                    onClick={onHide}
                  >
                    <XMarkIcon className="w-8" />
                  </div>
                </Dialog.Title>
                <div className="relative p-5 overflow-auto grow">
                  <div className="mb-4">
                    <div className="font-semibold">Họ tên khách hàng</div>
                    <div className="mt-1">
                      <Controller
                        name="FullName"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <Input
                            placeholder="Nhập tên khách hàng"
                            value={field.value}
                            onChange={field.onChange}
                            errorMessageForce={fieldState?.invalid}
                            errorMessage={fieldState?.error?.message}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">Số điện thoại</div>
                    <div className="mt-1">
                      <Controller
                        name="Phone"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <Input
                            placeholder="Nhập số điện thoại"
                            value={field.value}
                            onChange={field.onChange}
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
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    className="relative flex items-center px-4 ml-2 font-semibold text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                    onClick={onSubmit}
                  >
                    Xác nhận
                  </Button>
                </div>
              </Dialog.Panel>
            </motion.div>
          </form>
        </Dialog>
      </LayoutGroup>
    </AnimatePresence>,
    document.body
  )
}

MemberPassersBy.propTypes = {
  isOpen: PropTypes.bool,
  onHide: PropTypes.func
}

export default MemberPassersBy
