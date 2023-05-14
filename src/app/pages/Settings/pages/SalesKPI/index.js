import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { InputNumber } from 'src/_ezs/partials/forms'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { SelectStocks, SelectUserAdmin } from 'src/_ezs/partials/select'
import { Button } from 'src/_ezs/partials/button'

function SalesKPI(props) {
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      Items: [
        {
          StockIDs: '',
          UserID: '',
          UserIDs: '',
          Threshold1: '',
          Threshold2: ''
        }
      ]
    }
  })

  const { fields, prepend, remove } = useFieldArray({
    control,
    name: 'Items'
  })

  const onSubmit = values => {
    console.log(values)
  }

  const columns = useMemo(
    () => [
      {
        key: 'StockIDs',
        title: 'Cơ sở',
        dataKey: 'StockIDs',
        cellRenderer: ({ rowIndex }) => (
          <Controller
            name={`Items[${rowIndex}].StockIDs`}
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <SelectStocks
                isMulti
                isClearable
                value={field.value}
                onChange={val => field.onChange(val)}
                className="w-full select-control"
                menuPosition="fixed"
                styles={{
                  menuPortal: base => ({
                    ...base,
                    zIndex: 9999
                  })
                }}
                menuPortalTarget={document.body}
              />
            )}
          />
        ),
        width: 250,
        sortable: false,
        className: 'flex-col justify-center !items-stretch'
      },
      {
        key: 'UserID',
        title: 'Nhân viên',
        dataKey: 'UserID',
        cellRenderer: ({ rowIndex }) => (
          <Controller
            name={`Items[${rowIndex}].UserID`}
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <SelectUserAdmin
                isClearable
                value={field.value}
                onChange={val => field.onChange(val)}
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
        ),
        width: 275,
        sortable: false,
        className: 'flex-col justify-center !items-stretch'
      },
      {
        key: 'UserIDs',
        title: 'Nhóm nhân viên',
        dataKey: 'UserIDs',
        cellRenderer: ({ rowIndex }) => (
          <Controller
            name={`Items[${rowIndex}].UserIDs`}
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <SelectUserAdmin
                isMulti
                isSome
                isClearable
                value={field.value}
                onChange={val =>
                  field.onChange(val ? val.map(x => x.value) : [])
                }
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
        ),
        width: 275,
        sortable: false,
        className: 'flex-col justify-center !items-stretch'
      },
      {
        key: 'Threshold1',
        title: 'Ngưỡng A',
        dataKey: 'Threshold1',
        cellRenderer: ({ rowIndex }) => (
          <Controller
            rules={{
              required: true
            }}
            name={`Items[${rowIndex}].Threshold1`}
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
        ),
        width: 180,
        sortable: false
      },
      {
        key: 'Threshold2',
        title: 'Ngưỡng B',
        dataKey: 'Threshold2',
        cellRenderer: ({ rowIndex }) => (
          <Controller
            rules={{
              required: true
            }}
            name={`Items[${rowIndex}].Threshold2`}
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
        ),
        width: 180,
        sortable: false
      },
      {
        key: '#',
        title: '#',
        dataKey: '#',
        cellRenderer: ({ rowIndex }) => (
          <div
            className="px-2.5 h-6 flex items-center text-[13px] text-white rounded cursor-pointer bg-danger hover:bg-dangerhv"
            onClick={() => remove(rowIndex)}
          >
            Xóa
          </div>
        ),
        width: 80,
        sortable: false,
        align: 'center'
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields, watch()]
  )

  return (
    <div className="w-full h-full bg-white border-t border-separator dark:border-[#393945] overflow-auto">
      <form
        onSubmit={onSubmit}
        className="flex flex-col h-full max-w-screen-xl py-10 m-auto"
      >
        <div className="flex items-end justify-between mb-8">
          <div>
            <nav className="flex mb-3" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <Link
                    to="/settings"
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                  >
                    Cài đặt
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon className="w-3.5 text-muted2" />
                    <span className="ml-1 text-sm font-medium md:ml-2">
                      KPI Doanh số
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
            <div className="text-3xl font-extrabold">KPI Doanh số</div>
          </div>
          <div>
            <Button
              type="sumbit"
              className="relative flex items-center h-12 px-4 font-medium text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
            >
              Lưu thay đổi
            </Button>
          </div>
        </div>
        <ReactBaseTable
          wrapClassName="grow"
          rowKey="id"
          columns={columns}
          data={fields}
          estimatedRowHeight={50}
          emptyRenderer={
            <div className="flex items-center justify-center h-full">
              Không có dữ liệu
            </div>
          }
        />
      </form>
    </div>
  )
}

export default SalesKPI
