import { MinusCircleIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { Controller, useFieldArray } from 'react-hook-form'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'

const CalendarLockNested = ({ nestIndex, childrenIndex, control }) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `ListLocks[${childrenIndex}].ListDisable[${nestIndex}].TimeClose`
  })
  return (
    <div className="relative pt-4 pl-8 before:content-[''] before:h-[calc(100%-10px)] before:left-[15px] before:absolute before:top-0 before:w-[1px] before:bg-gray-300">
      {fields &&
        fields.map((item, index) => (
          <div
            className="relative flex before:content-[''] before:w-[17px] before:-left-[17px] before:top-[25px] before:absolute before:h-[1px] before:bg-gray-300 mt-4 first:mt-0"
            key={item.id}
          >
            <div className="flex-1">
              <Controller
                name={`ListLocks[${childrenIndex}].ListDisable[${nestIndex}].TimeClose[${index}].Start`}
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <InputDatePicker
                    placeholderText="Giờ bắt đầu"
                    selected={field.value}
                    onChange={field.onChange}
                    showTimeSelect
                    showTimeSelectOnly
                    dateFormat="HH:mm aa"
                    timeFormat="HH:mm aa"
                  />
                )}
              />
            </div>
            <div className="flex-1 ml-4">
              <Controller
                name={`ListLocks[${childrenIndex}].ListDisable[${nestIndex}].TimeClose[${index}].End`}
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <InputDatePicker
                    placeholderText="Giờ kết thúc"
                    selected={field.value}
                    onChange={field.onChange}
                    showTimeSelect
                    showTimeSelectOnly
                    dateFormat="HH:mm aa"
                    timeFormat="HH:mm aa"
                  />
                )}
              />
            </div>
            <button
              type="button"
              className="w-12 flex items-center justify-center cursor-pointer hover:text-danger transition text-muted2"
              onClick={() => remove(index)}
            >
              <MinusCircleIcon className="w-5" />
            </button>
          </div>
        ))}
      <div className="relative before:content-[''] before:w-[17px] before:-left-[17px] before:absolute before:top-[15px] before:h-[1px] before:bg-gray-300 mt-4 first:mt-0">
        <button
          type="button"
          className="bg-success text-white rounded px-3 py-1 text-xs"
          onClick={() => append({ Start: null, End: null })}
        >
          Thêm giờ
        </button>
      </div>
    </div>
  )
}

export { CalendarLockNested }
