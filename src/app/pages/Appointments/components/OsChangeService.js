import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Controller, useForm } from 'react-hook-form'
import { Button } from 'src/_ezs/partials/button'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Select from 'react-select'
import { useQuery } from '@tanstack/react-query'
import ProdsAPI from 'src/_ezs/api/prods.api'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import clsx from 'clsx'
import { FloatingPortal } from '@floating-ui/react'

const schemaUser = yup
  .object({
    rootid: yup.object().required('Vui lòng chọn dịch vụ')
  })
  .required()

function OsChangeService({ isOpen, onHide, onChange, ConvertProdID, loading }) {
  const [ListProds, setListProds] = useState([])
  const { control, handleSubmit } = useForm({
    defaultValues: {
      rootid: ''
    },
    resolver: yupResolver(schemaUser)
  })

  const OsRegimen = useQuery({
    queryKey: ['OsRegimen'],
    queryFn: async () => {
      const ListProd = await ProdsAPI.getListProdOs()
      return {
        ListProd: ListProd?.data?.data || []
      }
    },
    onSuccess: ({ ListProd }) => {
      setListProds(() =>
        ListProd.map(x => ({ ...x, label: x.text, value: x.id }))
      )
    },
    enabled: isOpen
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
      onChange(values)
    })(event)
  }

  return (
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
                  className="absolute flex flex-col justify-center h-full py-8"
                  initial={{ opacity: 0, top: '60%' }}
                  animate={{ opacity: 1, top: 'auto' }}
                  exit={{ opacity: 0, top: '60%' }}
                >
                  <Dialog.Panel className="bg-white dark:bg-dark-aside max-w-full w-[500px] max-h-full rounded shadow-lg flex flex-col">
                    <Dialog.Title className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
                      <div className="text-2xl font-bold">Thay đổi dịch vụ</div>
                      <div
                        className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                        onClick={onHide}
                      >
                        <XMarkIcon className="w-8" />
                      </div>
                    </Dialog.Title>
                    <div className="relative p-5 overflow-auto grow">
                      <div>
                        <div className="font-semibold">Dịch vụ</div>
                        <div className="mt-1">
                          <Controller
                            name="rootid"
                            control={control}
                            render={({
                              field: { ref, ...field },
                              fieldState
                            }) => (
                              <Select
                                isClearable
                                value={field.value}
                                onChange={val => {
                                  field.onChange(val)
                                }}
                                className={clsx(
                                  'select-control',
                                  fieldState.invalid && 'select-control-error'
                                )}
                                classNamePrefix="select"
                                options={ListProds}
                                placeholder="Chọn dịch vụ"
                                noOptionsMessage={() => 'Không có dịch vụ'}
                                menuPosition="fixed"
                                styles={{
                                  menuPortal: base => ({
                                    ...base,
                                    zIndex: 9999
                                  })
                                }}
                                menuPortalTarget={document.body}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <LoadingComponentFull
                        bgClassName="bg-white dark:bg-dark-aside"
                        loading={OsRegimen.isLoading}
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
                        loading={loading}
                        disabled={loading}
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
        </FloatingPortal>
      )}
    </AnimatePresence>
  )
}

OsChangeService.propTypes = {
  isOpen: PropTypes.bool,
  onHide: PropTypes.func
}

export default OsChangeService
