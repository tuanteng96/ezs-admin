import React, { useState, useEffect } from 'react'
import { m } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Controller, useForm } from 'react-hook-form'
import { Button } from 'src/_ezs/partials/button'
import { FloatingPortal } from '@floating-ui/react'
import { SelectGroupRoles, SelectStocks } from 'src/_ezs/partials/select'
import clsx from 'clsx'
// import { Input } from 'src/_ezs/partials/forms'
import Select from 'react-select'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import moment from 'moment'

function PickerFilter({ children, initialValues, onChange }) {
  const [visible, setVisible] = useState(false)

  const onHide = () => {
    setVisible(false)
  }

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      DateStart: moment().startOf('month').toDate(),
      DateEnd: moment().endOf('month').toDate()
    }
  })

  useEffect(() => {
    if (initialValues) {
      reset({
        DateStart: initialValues.DateStart,
        DateEnd: initialValues.DateEnd
      })
    } else {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onSubmit = values => {
    onChange(values)
    onHide()
  }

  const handleSubmitWithoutPropagation = e => {
    e.preventDefault()
    e.stopPropagation()
    handleSubmit(onSubmit)(e)
  }

  let { StockIDs } = watch()

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
                  <div className="text-2xl font-bold">Bộ lọc</div>
                  <div
                    className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                    onClick={onHide}
                  >
                    <XMarkIcon className="w-8" />
                  </div>
                </div>
                <div className="p-5 overflow-auto grow">
                  <div className="mb-3.5 last:mb-0">
                    <div className="font-medium">Đến ngày</div>
                    <div className="mt-1">
                      <Controller
                        name="DateEnd"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <InputDatePicker
                            placeholderText="Chọn thời gian"
                            autoComplete="off"
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            {...field}
                            onChange={e => {
                              field.onChange(e)
                            }}
                            dateFormat="dd/MM/yyyy"
                            showTimeSelect
                            errorMessageForce={fieldState?.invalid}
                            //timeFormat="HH:mm"
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between p-5 border-t border-separator dark:border-dark-separator">
                  <div></div>
                  <div className="flex justify-end">
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
                      Tìm kiếm
                    </Button>
                  </div>
                </div>
              </div>
            </m.div>
          </form>
        </FloatingPortal>
      )}
    </>
  )
}

export default PickerFilter
