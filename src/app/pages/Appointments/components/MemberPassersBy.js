import React from 'react'
import PropTypes from 'prop-types'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Controller, useFormContext } from 'react-hook-form'
import { Input } from 'src/_ezs/partials/forms'
import { Button } from 'src/_ezs/partials/button'
import { createPortal } from 'react-dom'

function MemberPassersBy({ isOpen, onHide, onSubmit }) {
  const { control } = useFormContext()
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
          <div className="fixed inset-0 flex items-center justify-center z-[1010]">
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
                    type="button"
                    className="relative flex items-center px-4 ml-2 font-semibold text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                    onClick={onSubmit}
                  >
                    Xác nhận
                  </Button>
                </div>
              </Dialog.Panel>
            </motion.div>
          </div>
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
