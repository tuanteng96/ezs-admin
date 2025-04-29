import { Disclosure } from '@headlessui/react'
import {
  ChevronDoubleDownIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import React, { useMemo } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { InputNumber } from 'src/_ezs/partials/forms'
import { ReactBaseTable } from 'src/_ezs/partials/table'

const RenderItems = ({ indexStock }) => {
  const { control, watch } = useFormContext()
  const { fields, remove, insert, update } = useFieldArray({
    control,
    name: `KPIDayList[${indexStock}].Children`
  })

  const watchForm = watch()

  const columns = useMemo(
    () => [
      {
        key: 'STT',
        title: 'STT',
        dataKey: 'STT',
        cellRenderer: ({ rowIndex }) => rowIndex + 1,
        width: 80
      },
      {
        key: 'FromValue',
        title: 'Giá trị từ',
        dataKey: 'FromValue',
        width: 350,
        sortable: false,
        cellRenderer: ({ rowIndex }) => (
          <div className="w-full">
            <Controller
              name={`KPIDayList[${indexStock}].Children[${rowIndex}].FromValue`}
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <InputNumber
                  thousandSeparator={true}
                  value={field.value}
                  placeholder="Nhập số tiền"
                  onValueChange={val => {
                    field.onChange(
                      typeof val.floatValue === 'undefined'
                        ? ''
                        : val.floatValue
                    )
                  }}
                />
              )}
            />
          </div>
        )
      },
      {
        key: 'ToValue',
        title: 'Giá trị đến',
        dataKey: 'ToValue',
        width: 350,
        sortable: false,
        cellRenderer: ({ rowIndex }) => (
          <div className="w-full">
            <Controller
              name={`KPIDayList[${indexStock}].Children[${rowIndex}].ToValue`}
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <InputNumber
                  thousandSeparator={true}
                  value={field.value}
                  placeholder="Nhập số tiền"
                  onValueChange={val =>
                    field.onChange(
                      typeof val.floatValue === 'undefined'
                        ? ''
                        : val.floatValue
                    )
                  }
                />
              )}
            />
          </div>
        )
      },
      {
        key: 'Value',
        title: 'Giá trị',
        dataKey: 'Value',
        width: 350,
        sortable: false,
        cellRenderer: ({ rowIndex }) => (
          <div className="w-full">
            <Controller
              name={`KPIDayList[${indexStock}].Children[${rowIndex}].Value`}
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <InputNumber
                  thousandSeparator={true}
                  value={field.value}
                  placeholder="Nhập giá trị"
                  onValueChange={val =>
                    field.onChange(
                      typeof val.floatValue === 'undefined'
                        ? ''
                        : val.floatValue
                    )
                  }
                />
              )}
            />
          </div>
        )
      },
      {
        key: '#',
        title: '#',
        dataKey: '#',
        cellRenderer: ({ rowIndex, rowData }) => (
          <>
            <div
              className={clsx(
                'flex justify-center items-center w-9 h-9 mx-1 text-sm rounded cursor-pointer text-success bg-successlight',
                rowData.isDisabled
                  ? 'opacity-30'
                  : 'hover:text-white hover:bg-successhv'
              )}
              onClick={() => {
                insert(rowIndex + 1, {
                  FromValue: '',
                  ToValue: '',
                  Value: ''
                })
              }}
            >
              <PlusIcon className="w-4" />
            </div>
            <button
              className={clsx(
                'flex justify-center items-center w-9 h-9 mx-1 text-sm rounded cursor-pointer text-danger bg-dangerlight hover:text-white hover:bg-dangerhv disabled:opacity-40'
              )}
              disabled={
                fields && fields.length === 1
                  ? !watchForm.KPIDayList[indexStock].Children[rowIndex]
                      .FromValue &&
                    !watchForm.KPIDayList[indexStock].Children[rowIndex]
                      .ToValue &&
                    !watchForm.KPIDayList[indexStock].Children[rowIndex].Value
                  : false
              }
              onClick={() => {
                if (
                  fields &&
                  fields.length === 1 &&
                  (watchForm.KPIDayList[indexStock].Children[rowIndex]
                    .FromValue ||
                    watchForm.KPIDayList[indexStock].Children[rowIndex]
                      .ToValue ||
                    watchForm.KPIDayList[indexStock].Children[rowIndex].Value)
                ) {
                  update(rowIndex, {
                    FromValue: '',
                    ToValue: '',
                    Value: ''
                  })
                } else {
                  remove(rowIndex)
                }
              }}
            >
              <TrashIcon className="w-4" />
            </button>
          </>
        ),
        width: 120,
        sortable: false,
        align: 'center',
        className: 'justify-center',
        frozen: 'right'
      }
    ],

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [watchForm]
  )

  return (
    <ReactBaseTable
      wrapClassName="min-h-[100px] [&>*]:!h-auto"
      maxHeight={500}
      rowKey="id"
      columns={columns}
      data={fields}
      rowHeight={80}
      // emptyRenderer={
      //   <div className="flex items-center justify-center h-full">
      //     Không có dữ liệu
      //   </div>
      // }
    />
  )
}

function KPIDaySettings() {
  const { control } = useFormContext()

  const { fields } = useFieldArray({
    control,
    name: 'KPIDayList'
  })

  return (
    <div>
      {fields &&
        fields.map((item, index) => (
          <Disclosure
            as="div"
            className="mb-5 overflow-hidden border border-gray-200 rounded-md shadow-sm dark:border-gray-800 last:mb-0"
            key={item.id}
          >
            {({ open }) => (
              <>
                <div
                  className={clsx(
                    'flex justify-between px-4 py-5 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-dark-app',
                    open && 'bg-gray-100 text-primary'
                  )}
                >
                  <div className="font-medium">{item.Title}</div>
                  <Disclosure.Button className="flex items-center justify-center w-16">
                    <ChevronDoubleDownIcon
                      className={clsx(
                        'w-5 transition-all',
                        open && 'rotate-180'
                      )}
                    />
                  </Disclosure.Button>
                </div>
                <Disclosure.Panel>
                  <RenderItems indexStock={index} />
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
    </div>
  )
}

export default KPIDaySettings
