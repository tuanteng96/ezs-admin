import { ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LayoutGroup, m } from 'framer-motion'
import React, { useMemo } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useLocation, useMatch, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import WarehouseAPI from 'src/_ezs/api/warehouse.api'
import { useAuth } from 'src/_ezs/core/Auth'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import { Button } from 'src/_ezs/partials/button'
import { Input, InputNumber, InputTextarea } from 'src/_ezs/partials/forms'
import { SelectStocksWareHouse, SelectSupplier } from 'src/_ezs/partials/select'
import { ReactBaseTable } from 'src/_ezs/partials/table'

function WareHouseImport(props) {
  const navigate = useNavigate()
  const { pathname, state } = useLocation()
  const { CrStocks } = useAuth()
  const { id } = useParams()

  const queryClient = useQueryClient()

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

  const { data, isLoading } = useQuery({
    queryKey: ['ImportExportId', id],
    queryFn: async () => {
      let { data } = await WarehouseAPI.getListInventory({
        cmd: 'getie_id',
        id: id || 'typeN'
      })
      return data?.data
    },
    onSettled: data => {
      console.log(data)
    }
  })

  const { fields, remove } = useFieldArray({
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
            onClick={() => navigate(state?.prevFrom)}
          ></div>
        </m.div>
        <m.div
          className="absolute top-0 right-0 z-10 w-full h-full bg-white max-w-full dark:bg-dark-aside"
          initial={{ x: '100%' }}
          transition={{
            transform: { ease: 'linear' }
          }}
          animate={{ x: '0' }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-separator dark:border-dark-separator">
              <div className="flex text-2xl font-bold dark:text-graydark-800">
                Đơn nhập kho mới
              </div>
              <div
                className="flex items-center justify-center w-12 h-12 transition cursor-pointer dark:text-graydark-800 hover:text-primary"
                onClick={() => navigate(state?.prevFrom)}
              >
                <XMarkIcon className="w-9" />
              </div>
            </div>
            <form
              className="flex h-[calc(100%-81px)] relative"
              onSubmit={handleSubmit(onSubmit)}
            >
              <ReactBaseTable
                wrapClassName="p-6 grow bg-white dark:bg-dark-app rounded"
                rowKey="id"
                columns={columns}
                data={fields}
                estimatedRowHeight={50}
                onEndReachedThreshold={1}
              />
              <div className="w-[380px] border-l border-separator flex flex-col">
                <div className="grow overflow-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded">
                  <div>
                    <div className="mb-3.5">
                      <div className="font-medium">Mã đơn</div>
                      <div className="mt-1">
                        <Controller
                          name="Key"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <Input
                              placeholder="Nhập mã đơn"
                              autoComplete="off"
                              type="text"
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="mb-3.5">
                      <div className="font-medium">Kho</div>
                      <div className="mt-1">
                        <Controller
                          name="stockid"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <SelectStocksWareHouse
                              value={field.value}
                              onChange={val => field.onChange(val?.value || '')}
                              className="select-control"
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
                    </div>
                    <div>
                      <div className="font-semibold">Nhà cung cấp, đại lý</div>
                      <div className="mt-1">
                        <Controller
                          name="SupplierID"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <SelectSupplier
                              isClearable
                              className="select-control mb-8px"
                              value={field.value}
                              onChange={val => field.onChange(val?.value || '')}
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
                  <div className="border-t border-separator pt-4 mt-4">
                    <div className="mb-3.5">
                      <div className="font-semibold">Tổng tiền</div>
                      <div className="mt-1">
                        <Controller
                          name={`UserServices`}
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <InputNumber
                              thousandSeparator={true}
                              value={field.value}
                              placeholder="Nhập số tiền"
                              onValueChange={val =>
                                field.onChange(val.floatValue || '')
                              }
                              allowNegative={false}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="mb-3.5">
                      <div className="font-semibold">Chiết khấu cả đơn</div>
                      <div className="mt-1">
                        <Controller
                          name={`UserServices`}
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <InputNumber
                              thousandSeparator={true}
                              value={field.value}
                              placeholder="Nhập số tiền"
                              onValueChange={val =>
                                field.onChange(val.floatValue || '')
                              }
                              allowNegative={false}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="mb-3.5">
                      <div className="font-semibold">Tổng</div>
                      <div className="mt-1">
                        <Controller
                          name={`UserServices`}
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <InputNumber
                              thousandSeparator={true}
                              value={field.value}
                              placeholder="Nhập số tiền"
                              onValueChange={val =>
                                field.onChange(val.floatValue || '')
                              }
                              allowNegative={false}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="mb-3.5">
                      <div className="font-semibold">Ghi chú</div>
                      <div className="mt-1">
                        <Controller
                          name={`UserServices`}
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <InputTextarea
                              placeholder="Nhập nội dung"
                              value={field.value}
                              onChange={field.onChange}
                              rows={3}
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-separator">
                  <Button
                    disabled={ConvertMutation.isLoading || !isDirty || !isValid}
                    loading={ConvertMutation.isLoading}
                    type="submit"
                    className="w-full flex items-center justify-center relative h-12 px-4 text-white transition rounded shadow-lg bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70"
                  >
                    {id ? 'Cập nhập' : 'Thêm mới'}
                  </Button>
                </div>
              </div>
              <LoadingComponentFull
                bgClassName="bg-white dark:bg-dark-aside z-[10]"
                loading={isLoading}
              />
            </form>
          </div>
        </m.div>
      </div>
    </LayoutGroup>
  )
}

export default WareHouseImport
