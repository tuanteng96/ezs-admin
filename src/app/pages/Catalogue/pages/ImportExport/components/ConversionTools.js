import React, { useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { InputNumber } from 'src/_ezs/partials/forms'

function ConversionTools({ initialValues, onChange }) {
  const { control, handleSubmit, setValue, reset, watch } = useForm({
    defaultValues: {
      items: []
    }
  })

  const { fields } = useFieldArray({
    control,
    name: 'items'
  })

  useEffect(() => {
    if (initialValues && initialValues.length > 0) {
      reset({
        items: initialValues.map(x => ({ ...x, value: '' }))
      })
    }
  }, [initialValues, reset])

  const onSubmit = () => {}

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={e => {
        if (e.key === 'Enter') e.preventDefault()
      }}
    >
      {fields &&
        fields.map((c, i) => (
          <div className="mb-3 last:mb-0" key={i}>
            <div className="text-sm mb-1">
              Số lượng x {c.multi} ({c.From.StockUnit})
            </div>
            <div>
              <Controller
                name={`items[${i}].value`}
                control={control}
                rules={{ required: true }}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <InputNumber
                    className="px-3 py-2.5"
                    placeholder="Nhập SL"
                    value={field.value}
                    onValueChange={val => {
                      initialValues.forEach((value, index) => {
                        if (index !== i) {
                          setValue(`items[${index}]`, { ...value, value: '' })
                        }
                      })
                      field.onChange(val.floatValue)
                      onChange(val.floatValue * c.multi)
                      //setValue(`items[${rowIndex}].Qty`, val.floatValue * c.multi)
                      //onUpdate()
                    }}
                    allowNegative={false}
                    isAllowed={inputObj => {
                      const { floatValue } = inputObj
                      if (floatValue < 1) return
                      return true
                    }}
                  />
                )}
              />
            </div>
          </div>
        ))}
    </form>
  )
}

export default ConversionTools
