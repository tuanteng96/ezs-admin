import { ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LayoutGroup, m } from 'framer-motion'
import React, { useMemo } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import WarehouseAPI from 'src/_ezs/api/warehouse.api'
import { useAuth } from 'src/_ezs/core/Auth'
import { useRoles } from 'src/_ezs/hooks/useRoles'
import { Button } from 'src/_ezs/partials/button'
import { InputNumber } from 'src/_ezs/partials/forms'
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="lg:px-6 lg:pt-6 px-4 pt-4"
    >
      <div className="md:flex items-center">
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
        <div className="md:px-4 py-2 md:py-0 flex justify-center md:block">
          <ArrowRightIcon className="w-6 rotate-90 md:rotate-0" />
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
        <div className="md:ml-4 mt-3 md:mt-0">
          <Button
            type="submit"
            className="w-full md:w-auto flex items-center justify-center relative h-12 px-4 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
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
  const { pathname, state, search } = useLocation()
  const { CrStocks } = useAuth()
  const queryClient = useQueryClient()
  const { xuat_nhap_diem, xuat_nhap_ten_slg } = useRoles([
    'xuat_nhap_diem',
    'xuat_nhap_ten_slg'
  ])
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isDirty, isValid }
  } = useForm({
    defaultValues: {
      data: [],
      stockid: CrStocks?.ID || 0
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'data'
  })

  const columns = useMemo(
    () => [
      {
        key: 'ID',
        title: 'STT',
        dataKey: 'ID',
        width: 60,
        sortable: false,
        align: 'center',
        cellRenderer: ({ rowIndex }) => rowIndex + 1
      },
      {
        key: 'fromTitle',
        title: 'Chuyển đổi từ Sản phẩm/NVL',
        dataKey: 'fromTitle',
        width: 280,
        sortable: false,
        cellRenderer: ({ rowData }) => (
          <div>
            <div className="font-semibold">{rowData.fromTitle}</div>
            <div className="inline-block text-muted2">({rowData.fromUnit})</div>
          </div>
        )
      },
      {
        key: 'CreateDate',
        title: 'Số lượng',
        dataKey: 'CreateDate',
        width: 200,
        cellRenderer: ({ rowData, rowIndex }) => (
          <Controller
            rules={{
              required: true
            }}
            name={`data[${rowIndex}].fromQty`}
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <InputNumber
                errorMessageForce={fieldState.invalid}
                className="px-3 py-2.5"
                placeholder="Nhập số lượng"
                value={field.value}
                onValueChange={val => {
                  field.onChange(val.floatValue || '')
                  setValue(
                    `data[${rowIndex}].toQty`,
                    (val.floatValue || 0) * rowData.toQtyInit
                  )
                  setValue(
                    `data[${rowIndex}].ratioText`,
                    `${val.floatValue || 0}x${rowData.toQtyInit}`
                  )
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
        ),
        sortable: false
      },
      {
        key: 'toTitle',
        title: 'Đến Sản phẩm/NVL',
        dataKey: 'toTitle',
        width: 290,
        sortable: false,
        cellRenderer: ({ rowData }) => (
          <div>
            <div className="font-semibold">{rowData.toTitle}</div>
            <div className="inline-block text-muted2">({rowData.toUnit})</div>
          </div>
        )
      },
      {
        key: 'toQty',
        title: 'SL sau chuyển đổi',
        dataKey: 'toQty',
        width: 180,
        sortable: false,
        cellRenderer: ({ rowData, rowIndex }) => (
          <Controller
            name={`data[${rowIndex}].toQty`}
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <>{field.value}</>
            )}
          />
        )
      },
      {
        key: 'ratioText',
        title: 'Tỉ lệ',
        dataKey: 'ratioText',
        cellRenderer: ({ rowData, rowIndex }) => (
          <Controller
            name={`data[${rowIndex}].ratioText`}
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <>{field.value}</>
            )}
          />
        ),
        width: 150,
        sortable: false
      },
      {
        key: '#',
        title: '#',
        dataKey: '#',
        cellRenderer: ({ rowIndex }) => (
          <div
            className="px-2.5 h-8 flex items-center text-[13px] text-white rounded cursor-pointer bg-danger hover:bg-dangerhv"
            onClick={() => remove(rowIndex)}
          >
            Xóa
          </div>
        ),
        width: 80,
        sortable: false,
        align: 'center',
        frozen: 'right'
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields]
  )

  const ConvertMutation = useMutation({
    mutationFn: body => WarehouseAPI.whouseConvert(body)
  })

  const onSubmit = values => {
    var bodyFormData = new FormData()
    bodyFormData.append('stockid', values.stockid)
    bodyFormData.append('data', JSON.stringify(values.data))

    ConvertMutation.mutate(bodyFormData, {
      onSettled: data => {
        queryClient
          .invalidateQueries({ queryKey: ['ListImportExport'] })
          .then(() => {
            reset()
            toast.success('Chuyển đổi thành công.')
          })
      }
    })
  }

  return (
    <LayoutGroup key={pathname}>
      <div className="fixed w-full h-full z-[1002] top-0 left-0">
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div
            className="absolute w-full h-full top-0 left bg-black/[.2] dark:bg-black/[.4]"
            onClick={() =>
              navigate({
                pathname: state?.prevFrom,
                search: search
              })
            }
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
            <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-separator dark:border-dark-separator">
              <div className="text-xl lg:text-2xl font-bold dark:text-graydark-800 truncate w-10/12">
                Xuất kho làm nguyên liệu
              </div>
              <div
                className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 transition cursor-pointer dark:text-graydark-800 hover:text-primary"
                onClick={() =>
                  navigate({
                    pathname: state?.prevFrom,
                    search: search
                  })
                }
              >
                <XMarkIcon className="w-7 lg:w-9" />
              </div>
            </div>
            <FormAddMaterial
              onSubmit={(values, reset) => {
                let { fromTitle, toTitle } = values
                let Meta = JSON.parse(toTitle.source?.Meta)
                let index = Meta?.otherUnit.findIndex(
                  x => Number(x.ProdID) === fromTitle?.source?.ID
                )
                if (index > -1) {
                  append({
                    fromCode: fromTitle.id,
                    fromUnit: fromTitle.source?.StockUnit,
                    fromTitle: fromTitle.text,
                    fromQty: 1,
                    fromBarcode: null,
                    fromPrice: 0,
                    toCode: toTitle.id,
                    toUnit: toTitle.source?.StockUnit,
                    toTitle: toTitle.text,
                    toQty: Number(Meta?.otherUnit[index].Qty),
                    toQtyInit: Number(Meta?.otherUnit[index].Qty),
                    toBarcode: null,
                    toPrice: 0,
                    valid: true,
                    ratioText: `1x${Meta?.otherUnit[index].Qty}`,
                    validCount: 3
                  })
                  reset()
                }
              }}
            />
            <form
              className="flex flex-col grow"
              onSubmit={handleSubmit(onSubmit)}
              onKeyDown={e => {
                if (e.key === 'Enter') e.preventDefault()
              }}
            >
              <ReactBaseTable
                wrapClassName="p-4 lg:p-6 grow bg-white dark:bg-dark-app rounded"
                rowKey="id"
                columns={columns}
                data={fields}
                estimatedRowHeight={50}
                onEndReachedThreshold={1}
              />
              <div className="border-t border-separator dark:border-dark-separator lg:px-6 px-4 py-4 flex">
                <div className="mr-3.5 flex-1 md:flex-auto">
                  <Controller
                    name="stockid"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <SelectStocksWareHouse
                        value={field.value}
                        onChange={val => field.onChange(val?.value || '')}
                        className="select-control w-full md:w-[350px]"
                        menuPosition="fixed"
                        styles={{
                          menuPortal: base => ({
                            ...base,
                            zIndex: 9999
                          })
                        }}
                        menuPortalTarget={document.body}
                        StockRoles={
                          xuat_nhap_diem.hasRight
                            ? xuat_nhap_diem.IsStocks
                              ? [{ value: 778, label: 'Kho tổng' }].concat(
                                  xuat_nhap_diem.StockRoles
                                )
                              : xuat_nhap_diem.StockRoles
                            : xuat_nhap_ten_slg.IsStocks
                            ? [{ value: 778, label: 'Kho tổng' }].concat(
                                xuat_nhap_ten_slg.StockRoles
                              )
                            : xuat_nhap_ten_slg.StockRoles
                        }
                      />
                    )}
                  />
                </div>
                <Button
                  disabled={ConvertMutation.isLoading || !isDirty || !isValid}
                  loading={ConvertMutation.isLoading}
                  type="submit"
                  className="flex items-center relative h-12 px-4 text-white transition rounded shadow-lg bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70"
                >
                  <span className="hidden md:block">Thực hiện chuyển đổi</span>
                  <span className="md:hidden">Thực hiện</span>
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
