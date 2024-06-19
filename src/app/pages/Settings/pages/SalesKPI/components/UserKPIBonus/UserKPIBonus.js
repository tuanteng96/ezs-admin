import React from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { InputNumber } from 'src/_ezs/partials/forms'

function UserKPIBonus({ indexUser, rowIndex, isDisabled }) {
  const { control } = useFormContext()

  const { fields } = useFieldArray({
    control,
    name: `updateList[${indexUser}].Configs[${rowIndex}].BonusList`
  })

  return (
    <>
      {fields &&
        fields.map((item, index) => (
          <div className="relative mt-3" key={item.id}>
            <div className="text-sm font-medium">{item.label}</div>
            <Controller
              name={`updateList[${indexUser}].Configs[${rowIndex}].BonusList[${index}].Bonus`}
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <>
                  <InputNumber
                    thousandSeparator={true}
                    errorMessageForce={fieldState.invalid}
                    placeholder="Nhập %"
                    value={field.value}
                    onValueChange={val => {
                      field.onChange(val.floatValue)
                    }}
                    allowNegative={true}
                    disabled={isDisabled}
                    allowLeadingZeros
                  />
                </>
              )}
            />
          </div>
        ))}
    </>
  )
}

export default UserKPIBonus
