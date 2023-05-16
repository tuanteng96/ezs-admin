import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { InputNumber } from 'src/_ezs/partials/forms'

function UserKPIBonus({ indexUser, rowIndex }) {
  const { control, getValues } = useFormContext()
  const BonusList = getValues(
    `updateList[${indexUser}].Configs[${rowIndex}].BonusList`
  )

  return (
    <>
      {BonusList &&
        BonusList.map((item, index) => (
          <div className="mt-3" key={index}>
            <div className="font-medium text-sm mb-1">{item.label}</div>
            <Controller
              name={`updateList[${indexUser}].Configs[${rowIndex}].BonusList[${index}].Bonus`}
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <>
                  <InputNumber
                    thousandSeparator={true}
                    errorMessageForce={fieldState.invalid}
                    placeholder="Số tiền"
                    value={field.value}
                    onValueChange={val => {
                      field.onChange(val.floatValue || '')
                    }}
                    allowNegative={false}
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
