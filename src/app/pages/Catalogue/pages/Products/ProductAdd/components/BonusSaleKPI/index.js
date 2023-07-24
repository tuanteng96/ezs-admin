import { Switch } from '@headlessui/react'
import clsx from 'clsx'
import React, { useState, Fragment } from 'react'
import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { InputNumber } from 'src/_ezs/partials/forms'
import { SelectTypeGenerate } from 'src/_ezs/partials/select/SelectTypeGenerate'

function BonusSaleKPI(props) {
  const [enabled, setEnabled] = useState(false)
  const { control, watch } = useFormContext()
  let { KpiType } = watch()
  useEffect(() => {
    if (KpiType) setEnabled(true)
  }, [KpiType])

  return (
    <div className="p-5 border-t border-gray-300">
      <div className="flex items-center mb-4">
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
          Cài đặt hoa hồng cho kỹ thuật viên khi tư vấn
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <div className="font-bold">Hoa hồng Sale</div>
          <div className="mt-1">
            <Controller
              name="BonusSale"
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <InputNumber
                  placeholder="Nhập hoa hồng"
                  thousandSeparator={true}
                  allowNegative={false}
                  value={field.value}
                  onValueChange={val => field.onChange(val.floatValue || '')}
                  errorMessageForce={fieldState?.invalid}
                  errorMessage={fieldState?.error?.message}
                />
              )}
            />
          </div>
        </div>
        {enabled && (
          <div>
            <div className="font-bold">Hoa hồng KTV tư vấn</div>
            <div className="mt-1">
              <Controller
                name="BonusSale2"
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <InputNumber
                    placeholder="Nhập hoa hồng"
                    thousandSeparator={true}
                    allowNegative={false}
                    value={field.value}
                    onValueChange={val => field.onChange(val.floatValue || '')}
                    errorMessageForce={fieldState?.invalid}
                    errorMessage={fieldState?.error?.message}
                  />
                )}
              />
            </div>
          </div>
        )}
        <div className={clsx(enabled && 'col-span-2')}>
          <div className="font-bold">Nhóm KPI</div>
          <div className="mt-1">
            <Controller
              name="KpiType"
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <SelectTypeGenerate
                  isClearable
                  value={field.value}
                  onChange={val => {
                    field.onChange(val)
                  }}
                  className="select-control"
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
          </div>
        </div>
      </div>
    </div>
  )
}

export { BonusSaleKPI }
