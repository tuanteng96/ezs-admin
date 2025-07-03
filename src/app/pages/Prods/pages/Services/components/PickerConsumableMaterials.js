import { FloatingPortal } from '@floating-ui/react'
import React, { useMemo, useState } from 'react'
import { m } from 'framer-motion'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from 'src/_ezs/partials/button'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { InputNumber } from 'src/_ezs/partials/forms'
import { SelectProdSelect2 } from 'src/_ezs/partials/select'
import ProdsAPI from 'src/_ezs/api/prods.api'
import { toast } from 'react-toastify'

function PickerConsumableMaterials({ children, item }) {
  const [visible, setVisible] = useState(false)
    
  const queryClient = useQueryClient()

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      Items: []
    }
  })

  const { fields, insert, remove, update } = useFieldArray({
    control,
    name: 'Items'
  })

  let watchForm = watch()

  const { data, isLoading } = useQuery({
    queryKey: [
      'ConsumableMaterialsId',
      {
        ID: item?.ID,
        visible
      }
    ],
    queryFn: async () => {
      const { data } = await ProdsAPI.consumableMaterialsId(item.ID)
      return data?.data || []
    },
    onSuccess: rs => {
      reset({
        Items:
          rs && rs.length > 0
            ? rs.map(x => ({
                Product: {
                  ...x.Product,
                  label: x.Product?.Title,
                  value: x.Product?.ID
                },
                ID: x.ID,
                ProdID: x.ProdID,
                DayIndex: x.DayIndex,
                ItemID: x.ItemID,
                ItemDynamicID: x.ItemDynamicID,
                ItemPriceBase: x.ItemPriceBase,
                Qty: x.Qty,
                Unit: x.Unit,
                ForRootID: x.ForRootID,
                CreateDate: x.CreateDate
              }))
            : [
                {
                  Product: null,
                  ProdID: '',
                  DayIndex: -999,
                  ItemID: '',
                  Qty: '',
                  Unit: '',
                  ForRootID: 0
                }
              ]
      })
    },
    enabled: Boolean(item?.ID) && visible
  })

  const updateMutation = useMutation({
    mutationFn: async body => {
      let rs = ProdsAPI.updateConsumableMaterialsId(body)
      await queryClient.invalidateQueries({ queryKey: ['ListProdsServices'] })
      return rs
    }
  })

  const columns = useMemo(
    () => [
      {
        key: 'Title',
        title: 'Nguyên vật liệu',
        dataKey: 'Title',
        width: 340,
        sortable: false,
        cellRenderer: ({ rowIndex }) => (
          <div className="w-full">
            <Controller
              name={`Items[${rowIndex}].Product`}
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <div className="pb-3.5 group-last:pb-0 pt-3.5">
                  <SelectProdSelect2
                    placeholder="Chọn mặt hàng"
                    className="flex-1 select-control"
                    Params={{
                      cmd: 'prod',
                      includeSource: 1,
                      cate_name: 'nvl',
                      _type: 'query'
                    }}
                    removes={[-1]}
                    isClearable
                    value={field.value}
                    onChange={(val, triggeredAction) => {
                      if (val) {
                        update(rowIndex, {
                          Product: {
                            ...val?.source,
                            label: val?.source?.Title,
                            value: val?.source?.ID
                          },
                          ProdID: item?.ID,
                          DayIndex: -999,
                          ItemID: val?.value,
                          Qty: 1,
                          Unit: val?.source?.StockUnit || '',
                          ForRootID: 0
                        })
                      } else {
                        update(rowIndex, {
                          Product: null,
                          ProdID: '',
                          DayIndex: -999,
                          ItemID: '',
                          Qty: '',
                          Unit: '',
                          ForRootID: 0
                        })
                      }
                    }}
                  />
                </div>
              )}
            />
            {/* <div className="mb-1 font-medium">{rowData.Product?.Title}</div>
            <div className="text-sm text-muted2">#{rowData.Product?.ID}</div> */}
          </div>
        )
      },
      {
        key: 'Product.DynamicID',
        title: 'Mã',
        dataKey: 'Product.DynamicID',
        width: 150,
        sortable: false
      },
      {
        key: 'Qty',
        title: 'Số lượng',
        cellRenderer: ({ rowIndex }) => (
          <div>
            <Controller
              name={`Items[${rowIndex}].Qty`}
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <div className="pb-3.5 group-last:pb-0 pt-3.5">
                  <InputNumber
                    placeholder="Nhập số lượng"
                    thousandSeparator={true}
                    allowNegative={false}
                    value={field.value}
                    onValueChange={val => field.onChange(val.floatValue || '')}
                    errorMessageForce={fieldState?.invalid}
                    errorMessage={fieldState?.error?.message}
                    disabled={!watchForm.Items[rowIndex].Product}
                  />
                </div>
              )}
            />
          </div>
        ),
        dataKey: 'Qty',
        width: 160,
        sortable: false
      },
      {
        key: 'Unit',
        title: 'Đơn vị',
        dataKey: 'Unit',
        width: 100,
        //cellRenderer: ({ rowData }) => <div>{rowData.TypeName}</div>,
        sortable: false
      },

      {
        key: '#',
        title: '',
        dataKey: '#',
        cellRenderer: ({ rowIndex }) => (
          <div className="flex justify-center w-full gap-1.5">
            <button
              className="flex items-center justify-center text-white transition-all rounded w-9 h-9 bg-success hover:bg-successhv"
              type="button"
              onClick={() => {
                insert(rowIndex + 1, {
                  Product: null,
                  ProdID: '',
                  DayIndex: -999,
                  ItemID: '',
                  Qty: '',
                  Unit: '',
                  ForRootID: 0
                })
              }}
            >
              <PlusIcon className="w-5" />
            </button>
            <button
              className="flex items-center justify-center text-white transition-all rounded bg-danger w-9 h-9 hover:bg-dangerhv"
              type="button"
              onClick={() => {
                if (watchForm?.Items.length > 1) {
                  remove(rowIndex)
                } else {
                  update(rowIndex, {
                    Product: null,
                    ProdID: '',
                    DayIndex: -999,
                    ItemID: '',
                    Qty: '',
                    Unit: '',
                    ForRootID: 0
                  })
                }
              }}
            >
              <svg
                className="w-5"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
              >
                <path
                  fillRule="evenodd"
                  d="M10.879 3.545A3 3 0 0 1 13 2.667h6a3 3 0 0 1 3 3v1h5a1 1 0 1 1 0 2h-1v18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-18H5a1 1 0 0 1 0-2h5v-1a3 3 0 0 1 .879-2.122M8 8.667v18h16v-18zm12-2h-8v-1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1zm-7 6a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0v-8a1 1 0 0 1 1-1m5 1a1 1 0 1 1 2 0v8a1 1 0 1 1-2 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ),
        headerClassName: 'justify-center',
        width: 120,
        sortable: false
        // frozen: 'right'
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [watchForm.Items]
  )

  const onHide = () => {
    setVisible(false)
  }

  const onSubmit = values => {
    let newValues = values?.Items
      ? values?.Items.filter(x => x.Product).map(x => ({
          ...x,
          Product: null
        }))
      : []
    var bodyFormData = new FormData()
    bodyFormData.append('data', JSON.stringify(newValues))
    bodyFormData.append('prodid', item?.ID)

    updateMutation.mutate(bodyFormData, {
      onSuccess: () => {
        toast.success('Cập nhật thành công.')
        onHide()
      }
    })
  }

  const handleSubmitWithoutPropagation = e => {
    e.preventDefault()
    e.stopPropagation()
    handleSubmit(onSubmit)(e)
  }

  return (
    <>
      {children({
        open: () => setVisible(true)
      })}
      {visible && (
        <FloatingPortal root={document.body}>
          <form
            onSubmit={handleSubmitWithoutPropagation}
            className="fixed inset-0 flex items-center justify-center z-[1003]"
            autoComplete="off"
            onKeyDown={e => {
              if (e.key === 'Enter') e.preventDefault()
            }}
          >
            <m.div
              className="absolute inset-0 bg-black/[.2] dark:bg-black/[.4]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onHide}
            ></m.div>
            <m.div
              className="absolute flex flex-col justify-center h-full py-8 px-4 sm:px-0 max-w-[910px] w-full"
              initial={{ opacity: 0, top: '60%' }}
              animate={{ opacity: 1, top: 'auto' }}
              exit={{ opacity: 0, top: '60%' }}
            >
              <div className="flex flex-col h-full bg-white rounded shadow-lg dark:bg-dark-aside">
                <div className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
                  <div className="text-2xl font-bold">
                    Nguyên vật liệu
                    <span className="text-sm font-medium pl-1.5 text-gray-600">
                      {item?.Title}
                    </span>
                  </div>
                  <div
                    className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                    onClick={onHide}
                  >
                    <XMarkIcon className="w-8" />
                  </div>
                </div>
                <ReactBaseTable
                  wrapClassName="grow p-4"
                  rowKey="id"
                  columns={columns}
                  data={fields || []}
                  emptyRenderer={() =>
                    !isLoading && (
                      <div className="flex items-center justify-center h-full text-sm font-light text-muted2">
                        Chưa có nguyên vật liệu nào.
                      </div>
                    )
                  }
                  loading={isLoading}
                  estimatedRowHeight={96}
                />
                <div className="flex justify-end p-5 border-t border-separator dark:border-dark-separator">
                  <Button
                    onClick={onHide}
                    type="button"
                    className="relative flex items-center px-4 font-bold transition border border-gray-300 rounded shadow-lg dark:border-gray-700 h-11 hover:border-gray-800 focus:outline-none focus:shadow-none"
                  >
                    Đóng
                  </Button>
                  <Button
                    loading={updateMutation.isLoading}
                    disabled={updateMutation.isLoading}
                    type="submit"
                    className="relative flex items-center px-4 ml-2 font-semibold text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              </div>
            </m.div>
          </form>
        </FloatingPortal>
      )}
    </>
  )
}

export default PickerConsumableMaterials
