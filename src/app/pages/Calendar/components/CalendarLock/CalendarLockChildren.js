import { XMarkIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { Controller, useFieldArray } from 'react-hook-form'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import { CalendarLockNested } from './CalendarLockNested'
import { useAuth } from 'src/_ezs/core/Auth'

const CalendarLockChildren = ({ childrenIndex, control, Stocks }) => {
  const { CrStocks } = useAuth()
  const { fields, remove, append, update } = useFieldArray({
    control,
    name: `ListLocks[${childrenIndex}].ListDisable`
  })

  if (CrStocks.ID !== Stocks.StockID) return null
  return (
    <div className="relative pl-4 before:content-[''] before:h-[calc(100%-38px)] before:left-0 before:absolute before:top-[25px] before:w-[1px] before:bg-gray-300">
      {fields &&
        fields.map((item, index) => (
          <div
            className="relative before:content-[''] before:w-[16px] before:-left-[16px] before:absolute before:top-[25px] before:h-[1px] before:bg-gray-300 mt-4 first:mt-0"
            key={item.id}
          >
            <div className="flex">
              <div className="flex-1">
                <Controller
                  name={`ListLocks[${childrenIndex}].ListDisable[${index}].Date`}
                  control={control}
                  render={({ field: { ref, ...field }, fieldState }) => (
                    <InputDatePicker
                      placeholderText="Chọn ngày"
                      selected={field.value}
                      onChange={field.onChange}
                      errorMessageForce={fieldState?.invalid}
                      errorMessage={fieldState?.error?.message}
                      dateFormat="dd/MM/yyyy"
                    />
                  )}
                />
              </div>
              <button
                type="button"
                className="w-12 flex items-center justify-center cursor-pointer hover:text-danger transition text-muted2"
                onClick={() =>
                  fields && fields.length === 1
                    ? update(0, { Date: null, TimeClose: [] })
                    : remove(index)
                }
              >
                <XMarkIcon className="w-5" />
              </button>
            </div>
            <CalendarLockNested
              childrenIndex={childrenIndex}
              nestIndex={index}
              {...{ control }}
            />
          </div>
        ))}

      <div className="relative before:content-[''] before:w-[16px] before:-left-[16px] before:absolute before:top-[15px] before:h-[1px] before:bg-gray-300 mt-4 first:mt-0">
        <button
          type="button"
          className="bg-success text-white rounded px-3 py-1 text-sm"
          onClick={() => append({ Date: null, TimeClose: [] })}
        >
          Thêm ngày
        </button>
      </div>
    </div>
  )
}

export { CalendarLockChildren }
