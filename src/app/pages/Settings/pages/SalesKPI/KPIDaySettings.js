import React, { useMemo } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { InputNumber } from 'src/_ezs/partials/forms'
import { ReactBaseTable } from 'src/_ezs/partials/table'

function KPIDaySettings({ isLoading }) {
  const { control } = useFormContext()

  const { fields } = useFieldArray({
    control,
    name: 'KPIDayList'
  })

  const columns = useMemo(
    () => [
      {
        key: 'Title',
        title: 'Cơ sở',
        dataKey: 'Title',
        width: 350,
        sortable: false
      },
      {
        key: 'FromValue',
        title: 'Giá trị từ',
        dataKey: 'FromValue',
        width: 300,
        sortable: false,
        cellRenderer: ({ rowIndex }) => (
          <div className="w-full">
            <Controller
              name={`KPIDayList[${rowIndex + 1}].FromValue`}
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <InputNumber
                  thousandSeparator={true}
                  value={field.value}
                  placeholder="Nhập số tiền"
                  onValueChange={val => field.onChange(val.floatValue || '')}
                />
              )}
            />
          </div>
        )
      },
      {
        key: 'FromTo',
        title: 'Giá trị đến',
        dataKey: 'FromTo',
        width: 300,
        sortable: false,
        cellRenderer: ({ rowIndex }) => (
          <div className="w-full">
            <Controller
              name={`KPIDayList[${rowIndex + 1}].FromTo`}
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <InputNumber
                  thousandSeparator={true}
                  value={field.value}
                  placeholder="Nhập số tiền"
                  onValueChange={val => field.onChange(val.floatValue || '')}
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
        width: 300,
        sortable: false,
        cellRenderer: ({ rowIndex }) => (
          <div className="w-full">
            <Controller
              name={`KPIDayList[${rowIndex + 1}].Value`}
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <InputNumber
                  thousandSeparator={true}
                  value={field.value}
                  placeholder="Nhập giá trị"
                  onValueChange={val => field.onChange(val.floatValue || '')}
                />
              )}
            />
          </div>
        )
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <ReactBaseTable
      wrapClassName="grow"
      rowKey="id"
      columns={columns || []}
      data={fields || []}
      rowHeight={80}
      rowClassName={({ rowIndex }) => {
        return rowIndex === -1 && '!bg-dangerlight'
      }}
      emptyRenderer={() =>
        isLoading && (
          <div className="flex items-center justify-center h-full">
            Không có dữ liệu.
          </div>
        )
      }
      loading={isLoading}
      //frozenData={fields && fields.length > 0 ? [fields[0]] : []}
    />
  )
}

export default KPIDaySettings
