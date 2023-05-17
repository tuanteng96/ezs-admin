import React, { useMemo } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { InputNumber } from 'src/_ezs/partials/forms'
import { SelectStocks, SelectUserAdmin } from 'src/_ezs/partials/select'
import { SelectTypeGenerate } from 'src/_ezs/partials/select/SelectTypeGenerate'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import UserKPIBonus from '../UserKPIBonus/UserKPIBonus'
import { useRoles } from 'src/_ezs/hooks/useRoles'

function UserKPI({ indexUser }) {
  const { kpi_doanhso } = useRoles('kpi_doanhso')
  const { control, watch } = useFormContext()
  const { fields, remove, insert } = useFieldArray({
    control,
    name: `updateList[${indexUser}].Configs`
  })
  const watchConfigs = watch() //`updateList[${indexUser}].Configs`, fields
  const watchUserID = watch(`updateList[${indexUser}].UserID`)

  const columns = useMemo(
    () => [
      {
        key: 'StockIDs',
        title: 'Cơ sở',
        dataKey: 'StockIDs',
        cellRenderer: ({ rowIndex }) => (
          <Controller
            name={`updateList[${indexUser}].Configs[${rowIndex}].StockIDs`}
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <SelectStocks
                StockRoles={kpi_doanhso?.StockRoles}
                isMulti={watchUserID?.value !== -2}
                isClearable
                isDisabled={watchUserID?.value !== -2}
                value={field.value}
                onChange={val => {
                  if (watchUserID?.value !== -2) {
                    const valIndex = val && val.findIndex(x => x.value === -1)
                    field.onChange(
                      valIndex > -1 && valIndex === val.length - 1
                        ? [val[valIndex]]
                        : val
                        ? val.filter(x => x.value !== -1)
                        : ''
                    )
                  } else {
                    field.onChange(val ? [val?.value] : '')
                  }
                }}
                className="w-full select-control"
                menuPosition="fixed"
                styles={{
                  menuPortal: base => ({
                    ...base,
                    zIndex: 9999
                  })
                }}
                menuPortalTarget={document.body}
                allOption={
                  kpi_doanhso.IsStocks && watchUserID?.value !== -2
                    ? [{ value: -1, label: 'Tất cả' }]
                    : ''
                }
              />
            )}
          />
        ),
        width: 290,
        sortable: false,
        className: 'flex-col justify-center !items-stretch'
      },
      {
        key: 'UserIDs',
        title: 'Nhóm nhân viên',
        dataKey: 'UserIDs',
        cellRenderer: ({ rowIndex }) => (
          <Controller
            name={`updateList[${indexUser}].Configs[${rowIndex}].UserIDs`}
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <SelectUserAdmin
                StockRoles={kpi_doanhso?.StockRolesAll}
                allOption={
                  kpi_doanhso.IsStocks ? [{ value: -1, label: 'Tất cả' }] : ''
                }
                isMulti
                isSome
                isClearable
                value={field.value}
                onChange={val => {
                  const valIndex = val && val.findIndex(x => x.value === -1)
                  field.onChange(
                    valIndex > -1 && valIndex === val.length - 1
                      ? [val[valIndex].value]
                      : val
                      ? val.map(x => x.value).filter(x => x !== -1)
                      : []
                  )
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
        ),
        width: 300,
        sortable: false,
        className: 'flex-col justify-center !items-stretch'
      },
      {
        key: 'ProdTypes',
        title: 'Nhóm DV / SP',
        dataKey: 'ProdTypes',
        cellRenderer: ({ rowIndex }) => (
          <Controller
            name={`updateList[${indexUser}].Configs[${rowIndex}].ProdTypes`}
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <SelectTypeGenerate
                allOption={[{ value: -1, label: 'Tất cả' }]}
                isMulti
                isClearable
                value={field.value}
                onChange={val => {
                  const valIndex = val && val.findIndex(x => x.value === -1)
                  field.onChange(
                    valIndex > -1 && valIndex === val.length - 1
                      ? [val[valIndex]]
                      : val
                      ? val.filter(x => x.value !== -1)
                      : ''
                  )
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
        ),
        width: 290,
        sortable: false,
        className: 'flex-col justify-center !items-stretch'
      },
      {
        key: 'Threshold1',
        title: 'Ngưỡng A',
        dataKey: 'Threshold1',
        cellRenderer: ({ rowIndex }) => (
          <Controller
            name={`updateList[${indexUser}].Configs[${rowIndex}].Threshold1`}
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
            name={`updateList[${indexUser}].Configs[${rowIndex}].Threshold2`}
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
        key: 'BonusList',
        title: 'Thưởng doanh số',
        dataKey: 'BonusList',
        cellRenderer: ({ rowIndex }) => (
          <>
            <Controller
              name={`updateList[${indexUser}].Configs[${rowIndex}].BonusList`}
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <>
                  <SelectTypeGenerate
                    allOption={[{ value: -1, label: 'Tất cả' }]}
                    isMulti
                    isClearable
                    value={field.value}
                    onChange={val => {
                      const valIndex = val && val.findIndex(x => x.value === -1)
                      field.onChange(
                        valIndex > -1 && valIndex === val.length - 1
                          ? [val[valIndex]]
                          : val
                          ? val.filter(x => x.value !== -1)
                          : ''
                      )
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
                  <UserKPIBonus indexUser={indexUser} rowIndex={rowIndex} />
                </>
              )}
            />
          </>
        ),
        width: 290,
        sortable: false,
        className: 'flex-col justify-center !items-stretch'
      },
      {
        key: '#',
        title: '#',
        dataKey: '#',
        cellRenderer: ({ rowIndex }) => (
          <>
            <div
              className="flex items-center h-10 px-3 mx-1 text-sm rounded cursor-pointer text-success hover:text-white bg-successlight hover:bg-successhv"
              onClick={() =>
                insert(rowIndex + 1, {
                  StockIDs: '',
                  UserID: '',
                  UserIDs: '',
                  Threshold1: '',
                  Threshold2: '',
                  ProdTypes: '',
                  BonusList: ''
                })
              }
            >
              Thêm
            </div>
            <div
              className="flex items-center h-10 px-3 mx-1 text-sm rounded cursor-pointer text-danger hover:text-white bg-dangerlight hover:bg-dangerhv"
              onClick={() => remove(rowIndex)}
            >
              Xóa
            </div>
          </>
        ),
        width: 160,
        sortable: false,
        align: 'center',
        className: 'justify-center',
        frozen: 'right'
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [watchConfigs]
  )

  return (
    <>
      <ReactBaseTable
        wrapClassName="min-h-[100px] [&>*]:!h-auto"
        maxHeight={500}
        rowKey="id"
        columns={columns}
        data={fields}
        estimatedRowHeight={79.5}
        emptyRenderer={
          <div className="flex items-center justify-center h-full">
            Không có dữ liệu
          </div>
        }
      />
    </>
  )
}

export { UserKPI }
