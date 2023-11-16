import { ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { LayoutGroup, m } from 'framer-motion'
import moment from 'moment'
import React, { useMemo } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from 'src/_ezs/core/Auth'
import { Button } from 'src/_ezs/partials/button'
import { SelectProdCode, SelectStocksWareHouse } from 'src/_ezs/partials/select'
import { ReactBaseTable } from 'src/_ezs/partials/table'

const FormAddMaterial = ({ onSubmit: onSubmitAdd }) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isDirty, isValid }
  } = useForm({
    defaultValues: {
      fromTitle: '',
      toTitle: ''
    }
  })

  const onSubmit = values => {
    onSubmitAdd(values, reset)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-6 pt-6">
      <div className="flex items-center">
        <div className="flex-1">
          <Controller
            name="fromTitle"
            control={control}
            rules={{ required: true }}
            render={({ field: { ref, ...field }, fieldState }) => (
              <SelectProdCode
                className="select-control"
                Params={{
                  cmd: 'prodcode',
                  includeSource: 1,
                  cate_name: 'san_pham,nvl',
                  _type: 'query'
                }}
                menuPosition="fixed"
                styles={{
                  menuPortal: base => ({
                    ...base,
                    zIndex: 9999
                  })
                }}
                menuPortalTarget={document.body}
                isClearable
                value={field.value}
                onChange={(val, triggeredAction) => {
                  if (triggeredAction.action === 'clear') {
                    setValue('toTitle', '')
                  }
                  field.onChange(val)
                }}
              />
            )}
          />
        </div>
        <div className="px-4">
          <ArrowRightIcon className="w-6" />
        </div>
        <div className="flex-1">
          <Controller
            name="toTitle"
            control={control}
            rules={{ required: true }}
            render={({ field: { ref, ...field }, fieldState }) => (
              <SelectProdCode
                Key={watch().fromTitle}
                className="select-control"
                Params={
                  watch().fromTitle
                    ? {
                        cmd: 'prodcode',
                        includeSource: 1,
                        cate_name: 'san_pham,nvl',
                        _type: 'query',
                        relUnit: watch().fromTitle?.source?.StockUnit,
                        relUnitID: watch().fromTitle?.source?.ID
                      }
                    : null
                }
                menuPosition="fixed"
                styles={{
                  menuPortal: base => ({
                    ...base,
                    zIndex: 9999
                  })
                }}
                menuPortalTarget={document.body}
                isClearable
                value={field.value}
                onChange={val => field.onChange(val)}
              />
            )}
          />
        </div>
        <div className="ml-4">
          <Button
            type="submit"
            className="flex items-center relative h-12 px-4 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
            disabled={!isDirty || !isValid}
          >
            Thêm chuyển đổi
          </Button>
        </div>
      </div>
    </form>
  )
}

function MaterialConversion(props) {
  const navigate = useNavigate()
  const { pathname, state } = useLocation()
  const { CrStocks } = useAuth()
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      data: [],
      stockid: CrStocks?.ID || 0
    }
  })

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: 'data'
    }
  )
  console.log(watch())
  const columns = useMemo(
    () => [
      {
        key: 'ID',
        title: 'Mã',
        dataKey: 'ID',
        width: 180,
        sortable: false,
        cellRenderer: ({ rowData }) => (
          <div>
            <div className="font-semibold">{rowData.Code}</div>
            <div className="text-xs bg-warning text-white inline-block px-1.5 py-px rounded">
              #{rowData.ID}
            </div>
          </div>
        )
      },
      {
        key: 'CreateDate',
        title: 'Ngày',
        dataKey: 'CreateDate',
        width: 200,
        cellRenderer: ({ rowData }) =>
          moment(rowData.CreateDate).format('HH:mm DD-MM-YYYY'),
        sortable: false
      },
      {
        key: 'Type',
        title: 'Loại',
        dataKey: 'Type',
        width: 135,
        cellRenderer: ({ rowData }) =>
          rowData.Type === 'N' ? 'Đơn Nhập' : 'Đơn Xuất',
        sortable: false
      },
      {
        key: 'SourceTitle',
        title: 'Cơ sở',
        dataKey: 'SourceTitle',
        width: 200,
        cellRenderer: ({ rowData }) => rowData.SourceTitle,
        sortable: false
      },
      {
        key: 'SupplierText',
        title: 'Nhà cung cấp',
        dataKey: 'SupplierText',
        width: 200,
        cellRenderer: ({ rowData }) => rowData.SupplierText,
        sortable: false
      },
      {
        key: 'PriceBase',
        title: 'Nhân viên thực hiện',
        dataKey: 'PriceBase',
        width: 200,
        cellRenderer: ({ rowData }) => rowData?.UserName,
        sortable: false
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const onSubmit = values => {
    console.log(values)
  }

  return (
    <LayoutGroup key={pathname}>
      <div className="fixed w-full h-full z-[1002] top-0 left-0">
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div
            className="absolute w-full h-full top-0 left bg-black/[.2] dark:bg-black/[.4]"
            onClick={() => navigate(state?.prevFrom)}
          ></div>
        </m.div>
        <m.div
          className="absolute top-0 right-0 z-10 w-full h-full bg-white max-w-7xl dark:bg-dark-aside"
          initial={{ x: '100%' }}
          transition={{
            transform: { ease: 'linear' }
          }}
          animate={{ x: '0' }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-separator dark:border-dark-separator">
              <div className="flex text-2xl font-bold dark:text-graydark-800">
                Xuất kho làm nguyên liệu
              </div>
              <div
                className="flex items-center justify-center w-12 h-12 transition cursor-pointer dark:text-graydark-800 hover:text-primary"
                onClick={() => navigate(state?.prevFrom)}
              >
                <XMarkIcon className="w-9" />
              </div>
            </div>
            <FormAddMaterial
              onSubmit={(values, reset) => {
                let { fromTitle, toTitle } = values
                append({
                  fromCode: fromTitle.id,
                  fromUnit: fromTitle.source?.StockUnit,
                  fromTitle: fromTitle.text,
                  fromQty: 1,
                  fromBarcode: null,
                  fromPrice: 0,
                  toCode: 'NL21',
                  toUnit: 'ML',
                  toTitle: 'Nước khoáng',
                  toQty: 1,
                  toBarcode: null,
                  toPrice: 0,
                  valid: true,
                  ratioText: '1',
                  validCount: 3
                })
              }}
            />
            <form
              className="flex flex-col grow"
              onSubmit={handleSubmit(onSubmit)}
            >
              <ReactBaseTable
                wrapClassName="p-6 grow bg-white dark:bg-dark-app rounded"
                rowKey="ID"
                columns={columns}
                data={[]}
                estimatedRowHeight={50}
                onEndReachedThreshold={1}
              />
              <div className="border-t border-separator dark:border-dark-separator px-6 py-4 flex">
                <div className="mr-3.5">
                  <Controller
                    name="stockid"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <SelectStocksWareHouse
                        value={field.value}
                        onChange={val => field.onChange(val?.value || '')}
                        className="select-control w-[350px]"
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
                </div>
                <Button
                  type="button"
                  className="flex items-center relative h-12 px-4 text-white transition rounded shadow-lg bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70"
                >
                  Thực hiện chuyển đổi
                </Button>
              </div>
            </form>
          </div>
        </m.div>
      </div>
    </LayoutGroup>
  )
}

export default MaterialConversion
