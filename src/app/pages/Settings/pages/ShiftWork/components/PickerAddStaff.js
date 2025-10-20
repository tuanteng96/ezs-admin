import React, { useState, useEffect } from 'react'
import { m } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button } from 'src/_ezs/partials/button'
import { FloatingPortal } from '@floating-ui/react'
import clsx from 'clsx'

const schemaAddEdit = yup
  .object({
    Staffs: yup
      .array()
      .min(1, 'Vui lòng chọn ít nhất một nhân viên')
      .required('Danh sách nhân viên không được để trống')
  })
  .required()

function PickerAddStaff({ children, options, onChange }) {
  const [visible, setVisible] = useState(false)

  const onHide = () => {
    setVisible(false)
  }

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      Staffs: null
    },
    resolver: yupResolver(schemaAddEdit)
  })

  useEffect(() => {
    if (visible) {
      reset({
        Staffs: null
      })
    } else {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onSubmit = values => {
    onChange(values?.Staffs || [])
    onHide()
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
                    Thêm nhân viên khác cơ sở
                  </div>
                  <div
                    className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                    onClick={onHide}
                  >
                    <XMarkIcon className="w-8" />
                  </div>
                </div>
                <div className="p-5 overflow-auto grow">
                  <div className="mb-3.5 last:mb-0">
                    <div className="font-semibold">Nhân viên</div>
                    <div className="mt-1">
                      <Controller
                        name="Staffs"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <div>
                            <Select
                              isMulti
                              classNamePrefix="select"
                              options={options}
                              className={clsx(
                                'select-control',
                                fieldState?.invalid && 'select-control-error'
                              )}
                              placeholder="Chọn nhân viên"
                              value={field.value}
                              onChange={val => field.onChange(val)}
                              menuPosition="fixed"
                              styles={{
                                menuPortal: base => ({
                                  ...base,
                                  zIndex: 9999
                                })
                              }}
                              menuPortalTarget={document.body}
                              noOptionsMessage={() => 'Không có nhân viên'}
                            />
                            {fieldState?.error?.message &&
                              fieldState?.invalid && (
                                <div className="mt-1.5 text-sm text-danger">
                                  {fieldState?.error?.message}
                                </div>
                              )}
                          </div>
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
                    type="submit"
                    className="relative flex items-center px-4 ml-2 font-semibold text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                  >
                    Thêm nhân viên
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

export default PickerAddStaff
