import { ReceiptPercentIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Tooltip from 'rc-tooltip'
import React from 'react'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { InputNumber } from 'src/_ezs/partials/forms'

function PriceCost(props) {
  const { control, watch } = useFormContext()
  let watchForm = watch()

  const [Percent, setPercent] = useState('')

  return (
    <div>
      <div className="font-medium">Giá gốc</div>
      <div className="mt-1">
        <Controller
          name="PriceBase"
          control={control}
          render={({ field: { ref, ...field }, fieldState }) => (
            <div className="relative">
              <InputNumber
                placeholder="Nhập giá gốc"
                thousandSeparator={true}
                allowNegative={false}
                value={field.value}
                onValueChange={val => field.onChange(val.floatValue || '')}
                errorMessageForce={fieldState?.invalid}
                errorMessage={fieldState?.error?.message}
              />
              <Tooltip
                overlayClassName="text-white dark:text-dark-light"
                placement="top"
                trigger={['click']}
                overlay={
                  <div className="py-1 text-gray-700 bg-white rounded shadow-lg dark:bg-dark-light dark:text-graydark-800">
                    <div className="grid grid-cols-4 gap-3 px-3 pt-3">
                      {[1, 3, 5, 10, 20, 50, 75, 100].map((val, index) => (
                        <div
                          className={clsx(
                            'border border-gray-300 rounded text-xs font-semibold cursor-pointer flex items-center justify-center h-8 w-12 hover:border-primary hover:text-primary transition'
                          )}
                          onClick={() => {
                            setPercent('')
                            field.onChange(
                              (watchForm.PriceProduct || 0) +
                                ((watchForm.PriceProduct || 0) * val) / 100
                            )
                          }}
                          key={index}
                        >
                          {val} %
                        </div>
                      ))}
                    </div>
                    <div className="p-3">
                      <div className="relative">
                        <InputNumber
                          isAllowed={values => {
                            const { formattedValue, floatValue } = values
                            return formattedValue === '' || floatValue <= 100
                          }}
                          placeholder="Nhập giá trị"
                          thousandSeparator={true}
                          allowNegative={false}
                          value={Percent}
                          onValueChange={val => {
                            setPercent(val.floatValue || '')
                            field.onChange(
                              (watchForm.PriceProduct || 0) +
                                ((watchForm.PriceProduct || 0) *
                                  (val.floatValue || 0)) /
                                  100
                            )
                          }}
                        />
                        <div className="absolute right-0 top-0 h-full px-3.5 flex items-center font-medium pointer-events-none">
                          %
                        </div>
                      </div>
                    </div>
                  </div>
                }
                align={{
                  offset: [9, 0]
                }}
                onVisibleChange={arg => setPercent('')}
              >
                <div className="absolute right-0 flex items-center justify-center w-12 h-full cursor-pointer text-warning top-2/4 -translate-y-2/4">
                  <ReceiptPercentIcon className="w-5" />
                </div>
              </Tooltip>
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default PriceCost
