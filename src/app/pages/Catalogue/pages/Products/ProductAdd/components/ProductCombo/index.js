import { Switch } from '@headlessui/react'
import { TrashIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Fragment } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { InputNumber } from 'src/_ezs/partials/forms'
import { SelectProdProducts } from 'src/_ezs/partials/select'

function ProductCombo(props) {
  const [enabled, setEnabled] = useState(false)
  const { control, watch } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ComboList'
  })

  let { ComboList } = watch()

  useEffect(() => {
    if (ComboList && ComboList.length > 0 && ComboList[0].Id) setEnabled(true)
  }, [ComboList])

  return (
    <div className="border border-gray-300 rounded-lg mb-5">
      <div className="px-5 py-4 text-xl font-bold border-b border-gray-300 font-inter">
        Combo
      </div>
      <div className="p-5">
        <div className="flex items-center">
          <Switch checked={enabled} onChange={setEnabled} as={Fragment}>
            {({ checked }) => (
              <button
                className={clsx(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition shadow-lg',
                  checked ? 'bg-primary' : 'bg-gray-300'
                )}
              >
                <span className="sr-only">Enable notifications</span>
                <span
                  className={clsx(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition',
                    checked ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            )}
          </Switch>
          <div className="font-medium ml-3 font-inter">
            Cài đặt combo cho sản phẩm
          </div>
        </div>
        {enabled && (
          <div className="relative overflow-x-auto sm:rounded-lg mt-5">
            <table className="w-full text-left text-gray-500 dark:text-gray-400">
              <tbody>
                {fields &&
                  fields.map((item, index) => (
                    <tr
                      className="bg-white border-b last:border-b-0 border-separator dark:bg-gray-800 group"
                      key={item.id}
                    >
                      <td className="pr-2 font-semibold text-gray-900 dark:text-white">
                        <Controller
                          name={`ComboList[${index}].Id`}
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <SelectProdProducts
                              isClearable
                              value={field.value}
                              onChange={val => {
                                field.onChange(val)
                                if (val && index === fields.length - 1) {
                                  append({
                                    Id: '',
                                    qty: '',
                                    price: '',
                                    addfee: ''
                                  })
                                }
                              }}
                              className="select-control pb-3.5 group-last:pb-0 pt-3.5"
                              menuPortalTarget={document.body}
                              menuPosition="fixed"
                              styles={{
                                menuPortal: base => ({
                                  ...base,
                                  zIndex: 9999
                                })
                              }}
                            />
                          )}
                        />
                      </td>
                      <td className="px-2 w-36">
                        <Controller
                          name={`ComboList[${index}].qty`}
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <div className="pb-3.5 group-last:pb-0 pt-3.5">
                              <InputNumber
                                placeholder="Số lượng"
                                thousandSeparator={true}
                                allowNegative={false}
                                value={field.value}
                                onValueChange={val =>
                                  field.onChange(val.floatValue || '')
                                }
                                errorMessageForce={fieldState?.invalid}
                                errorMessage={fieldState?.error?.message}
                              />
                            </div>
                          )}
                        />
                      </td>
                      <td className="px-2 font-semibold text-gray-900 dark:text-white w-48">
                        <Controller
                          name={`ComboList[${index}].price`}
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <div className="pb-3.5 group-last:pb-0 pt-3.5">
                              <InputNumber
                                placeholder="Nhập giá bán"
                                thousandSeparator={true}
                                allowNegative={false}
                                value={field.value}
                                onValueChange={val =>
                                  field.onChange(val.floatValue || '')
                                }
                                errorMessageForce={fieldState?.invalid}
                                errorMessage={fieldState?.error?.message}
                              />
                            </div>
                          )}
                        />
                      </td>
                      <td className="px-2 w-12">
                        <div className="pb-3.5 group-last:pb-0 pt-3.5">
                          <div
                            className="transition font-medium text-danger cursor-pointer flex items-center justify-center w-12 hover:bg-dangerlight rounded-full h-12"
                            onClick={() => {
                              if (fields.length - 1 !== index) {
                                remove(index)
                              }
                            }}
                          >
                            <TrashIcon className="w-5" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export { ProductCombo }
