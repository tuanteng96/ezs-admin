import React, { useMemo } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { InputNumber } from 'src/_ezs/partials/forms'
import { SelectStocks, SelectUserAdmin } from 'src/_ezs/partials/select'
import { SelectTypeGenerate } from 'src/_ezs/partials/select/SelectTypeGenerate'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import UserKPIBonus from '../UserKPIBonus/UserKPIBonus'
import { useRoles } from 'src/_ezs/hooks/useRoles'
import clsx from 'clsx'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

function UserKPI({ indexUser }) {
  const { kpi_doanhso } = useRoles('kpi_doanhso')
  const {
    control,
    watch,
    setValue,
    formState: { errors }
  } = useFormContext()
  const { fields, remove, insert } = useFieldArray({
    control,
    name: `updateList[${indexUser}].Configs`
  })
  const watchConfigs = watch() //`updateList[${indexUser}].Configs`, fields
  const watchUserID = watch(`updateList[${indexUser}].UserID`)
  const columns = useMemo(
    () => [
      {
        key: 'StockID',
        title: 'Cơ sở',
        dataKey: 'StockID',
        cellRenderer: ({ rowIndex, rowData }) => (
          <Controller
            name={`updateList[${indexUser}].Configs[${rowIndex}].StockID`}
            control={control}
            rules={{ required: watchUserID?.value === -2 }}
            render={({ field: { ref, ...field }, fieldState }) => (
              <>
                <SelectStocks
                  StockRoles={kpi_doanhso?.StockRoles}
                  isClearable
                  isDisabled={watchUserID?.value !== -2 || rowData.isDisabled}
                  value={field.value}
                  onChange={val => {
                    let Configs = watchConfigs.updateList[indexUser].Configs
                    setValue(
                      `updateList[${indexUser}].Configs`,
                      Configs && Configs.length > 0
                        ? Configs.map(x => ({
                            ...x,
                            StockID: val?.value || ''
                          }))
                        : []
                    )

                    if (
                      watchConfigs.updateList[indexUser].UserID?.value === -2
                    ) {
                      setValue(`updateList[${indexUser}].UserID`, {
                        value: -2,
                        label: 'Theo cơ sở - ' + val.label
                      })
                    }
                  }}
                  className={clsx(
                    'w-full select-control',
                    fieldState.invalid && 'select-control-error'
                  )}
                  menuPosition="fixed"
                  styles={{
                    menuPortal: base => ({
                      ...base,
                      zIndex: 9999
                    })
                  }}
                  menuPortalTarget={document.body}
                />
              </>
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
        cellRenderer: ({ rowIndex, rowData }) => (
          <Controller
            name={`updateList[${indexUser}].Configs[${rowIndex}].UserIDs`}
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <SelectUserAdmin
                isDisabled={rowData.isDisabled}
                StockRoles={kpi_doanhso?.StockRolesAll}
                allOption={
                  kpi_doanhso.IsStocks
                    ? [{ value: -1, label: 'Tất cả nhân viên' }]
                    : ''
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
        cellRenderer: ({ rowIndex, rowData }) => (
          <Controller
            name={`updateList[${indexUser}].Configs[${rowIndex}].ProdTypes`}
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <SelectTypeGenerate
                isDisabled={rowData.isDisabled}
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
        cellRenderer: ({ rowIndex, rowData }) => (
          <Controller
            name={`updateList[${indexUser}].Configs[${rowIndex}].Threshold1`}
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <>
                <InputNumber
                  disabled={rowData.isDisabled}
                  thousandSeparator={true}
                  errorMessageForce={fieldState.invalid}
                  placeholder="Số tiền"
                  value={field.value}
                  onValueChange={val => {
                    field.onChange(val.floatValue)
                  }}
                  allowNegative={false}
                  allowLeadingZeros
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
        cellRenderer: ({ rowIndex, rowData }) => (
          <Controller
            name={`updateList[${indexUser}].Configs[${rowIndex}].Threshold2`}
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <>
                <InputNumber
                  disabled={rowData.isDisabled}
                  thousandSeparator={true}
                  errorMessageForce={fieldState.invalid}
                  placeholder="Số tiền"
                  value={field.value}
                  onValueChange={val => {
                    field.onChange(val.floatValue)
                  }}
                  allowNegative={false}
                  allowLeadingZeros
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
        cellRenderer: ({ rowIndex, rowData }) => (
          <>
            <Controller
              name={`updateList[${indexUser}].Configs[${rowIndex}].BonusList`}
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <>
                  <SelectTypeGenerate
                    isDisabled={rowData.isDisabled}
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
                  <UserKPIBonus
                    isDisabled={rowData.isDisabled}
                    indexUser={indexUser}
                    rowIndex={rowIndex}
                  />
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
                if (!rowData.isDisabled) {
                  let { Configs, UserID } = watchConfigs.updateList[indexUser]
                  insert(rowIndex + 1, {
                    StockID:
                      Configs && Configs.length > 0 ? Configs[0].StockID : '',
                    UserIDs: [UserID?.value || ''],
                    Threshold1: '',
                    Threshold2: '',
                    ProdTypes: '',
                    BonusList: ''
                  })
                }
              }}
            >
              <PlusIcon className="w-4" />
            </div>
            {fields && fields.length > 1 && (
              <div
                className={clsx(
                  'flex justify-center items-center w-9 h-9 mx-1 text-sm rounded cursor-pointer text-danger bg-dangerlight',
                  rowData.isDisabled
                    ? 'opacity-30'
                    : 'hover:text-white hover:bg-dangerhv'
                )}
                onClick={() => !rowData.isDisabled && remove(rowIndex)}
              >
                <TrashIcon className="w-4" />
              </div>
            )}
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
    [watchConfigs, errors]
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
