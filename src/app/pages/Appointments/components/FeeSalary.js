import React from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { InputNumber } from 'src/_ezs/partials/forms'

const FeeSalary = ({ nestIndex }) => {
  const { control } = useFormContext()
  const { fields } = useFieldArray({
    control,
    name: `UserServices[${nestIndex}].FeeSalary`
  })
  return (
    <>
      {fields &&
        fields.map((item, index) => (
          <div key={item.id}>
            <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
              {item.Title}
            </div>
            <div>
              <Controller
                name={`UserServices[${nestIndex}].FeeSalary[${index}].Value`}
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <InputNumber
                    thousandSeparator={true}
                    value={field.value}
                    placeholder="Nhập số tiền"
                    onValueChange={val => field.onChange(val.floatValue)}
                  />
                )}
              />
            </div>
          </div>
        ))}
    </>
  )
}

export { FeeSalary }
