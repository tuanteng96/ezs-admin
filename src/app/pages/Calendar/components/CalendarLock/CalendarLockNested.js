import React from 'react'
import { Controller, useFieldArray } from 'react-hook-form'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'

const CalendarLockNested = ({ nestIndex, control }) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `ListDisable[${nestIndex}].TimeClose`
  })
  return (
    <div className="relative pt-4 pl-8 before:content-[''] before:h-[calc(100%-25px)] before:left-[15px] before:absolute before:top-0 before:w-[1px] before:bg-gray-300">
      {fields &&
        fields.map((item, index) => (
          <div
            className="relative grid grid-cols-2 gap-4 before:content-[''] before:w-[17px] before:-left-[17px] before:absolute before:top-2/4 before:-translate-y-2/4 before:h-[1px] before:bg-gray-300 mt-4 first:mt-0"
            key={item.id}
          >
            <div>
              <Controller
                name={`ListDisable[${nestIndex}].TimeClose[${index}].Start`}
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
            <div>
              <Controller
                name={`ListDisable[${nestIndex}].TimeClose[${index}].End`}
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
          </div>
        ))}
    </div>
  )
}

export { CalendarLockNested }
