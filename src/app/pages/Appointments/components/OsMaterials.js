import { FloatingPortal } from '@floating-ui/react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import Select from 'react-select'
import ProdsAPI from 'src/_ezs/api/prods.api'
import { Button } from 'src/_ezs/partials/button'
import { InputNumber } from 'src/_ezs/partials/forms'
import { ReactBaseTable } from 'src/_ezs/partials/table'

const OsMaterials = ({ initialValues, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      StockItems: []
    }
  })

  const watchForm = watch()

  const { fields, prepend, remove } = useFieldArray({
    control,
    name: 'StockItems'
  })

  useEffect(() => {
    if (isOpen) setValue('StockItems', initialValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const OsMaterials = useQuery({
    queryKey: ['OsMaterialsID'],
    queryFn: async () => {
      const { data } = await ProdsAPI.getProdId(3298)
      return data?.data
        ? data?.data.map(x => ({
            ...x,
            label: x.text,
            value: x.id
          }))
        : []
    },
    enabled: isOpen
  })

  const onOpen = () => {
    setIsOpen(true)
  }

  const onHide = () => {
    setIsOpen(false)
  }

  const onSubmit = event => {
    if (event) {
      if (typeof event.preventDefault === 'function') {
        event.preventDefault()
      }
      if (typeof event.stopPropagation === 'function') {
        event.stopPropagation()
      }
    }

    return handleSubmit(values => {
      onChange(values, onHide)
    })(event)
  }

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
        key: 'ProdTitle',
        title: 'Nguyên vật liệu',
        dataKey: 'ProdTitle',
        cellRenderer: ({ rowData }) => <div>{rowData?.ProdTitle}</div>,
        width: 290,
        sortable: false
        //align: 'center',
      },
      {
        key: 'StockUnit',
        title: 'Đơn vị',
        dataKey: 'StockUnit',
        cellRenderer: ({ rowData }) => <div>{rowData?.source?.StockUnit}</div>,
        width: 100,
        sortable: false
        //align: 'center',
      },
      {
        key: 'Qty',
        title: 'Số lượng',
        dataKey: 'Qty',
        cellRenderer: ({ rowIndex }) => (
          <Controller
            rules={{
              required: true
            }}
            name={`StockItems[${rowIndex}].Qty`}
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <>
                <InputNumber
                  className="px-3 py-2.5"
                  errorMessageForce={fieldState.invalid}
                  placeholder="SL"
                  value={field.value}
                  onValueChange={val => {
                    field.onChange(val.floatValue || '')
                  }}
                  allowNegative={false}
                  isAllowed={inputObj => {
                    const { floatValue } = inputObj
                    if (floatValue < 1) return
                    return true
                  }}
                />
              </>
            )}
          />
        ),
        width: 100,
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
    [fields]
  )

  return (
    <>
      <div className="flex justify-between px-6 py-4 border-b border-separator dark:border-dark-separator">
        <div className="text-gray-500">Nguyên vật liệu</div>
        <div
          className="w-3/5 font-medium text-right cursor-pointer text-primary"
          onClick={onOpen}
        >
          {initialValues && initialValues.length > 0 ? (
            <span>{initialValues.length} Nguyên vật liệu</span>
          ) : (
            'Thêm'
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <FloatingPortal>
            <LayoutGroup key={isOpen}>
              <Dialog open={isOpen} onClose={onHide}>
                <motion.div
                  className="fixed inset-0 bg-black/[.2] dark:bg-black/[.4] z-[1010]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></motion.div>
                <form
                  onSubmit={onSubmit}
                  className="fixed inset-0 flex items-center justify-center z-[1010]"
                >
                  <motion.div
                    className="absolute flex flex-col justify-center h-full py-10"
                    initial={{ opacity: 0, top: '60%' }}
                    animate={{ opacity: 1, top: 'auto' }}
                    exit={{ opacity: 0, top: '60%' }}
                  >
                    <Dialog.Panel className="bg-white dark:bg-dark-aside max-w-full w-[675px] h-full rounded shadow-lg flex flex-col">
                      <Dialog.Title className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
                        <div className="text-2xl font-bold">
                          Nguyên vật liệu
                        </div>
                        <div
                          className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                          onClick={onHide}
                        >
                          <XMarkIcon className="w-8" />
                        </div>
                      </Dialog.Title>
                      <div className="px-5 pt-5">
                        <Select
                          isClearable
                          value={null}
                          isDisabled={OsMaterials.isLoading}
                          isLoading={OsMaterials.isLoading}
                          className="select-control"
                          classNamePrefix="select"
                          onChange={val =>
                            val &&
                            prepend({
                              ...val,
                              ProdTitle: val.text,
                              ProdID: val.id,
                              Qty: 1
                            })
                          }
                          options={
                            OsMaterials?.data
                              ? OsMaterials?.data.filter(
                                  x =>
                                    x.value !== -1 &&
                                    !watchForm.StockItems.some(
                                      s => s.ProdID === x.value
                                    )
                                )
                              : []
                          }
                          placeholder="Chọn nguyên vật liệu"
                          noOptionsMessage={() => 'Không có dữ liệu'}
                        />
                      </div>
                      <ReactBaseTable
                        wrapClassName="relative p-5 overflow-auto grow"
                        rowKey="id"
                        columns={columns}
                        data={fields}
                        estimatedRowHeight={50}
                        emptyRenderer={
                          <div className="flex items-center justify-center h-full">
                            Không có Nguyên vật liệu
                          </div>
                        }
                      />
                      <div className="flex justify-end p-5 border-t border-separator dark:border-dark-separator">
                        <Button
                          type="button"
                          className="relative flex items-center px-4 font-bold transition border border-gray-300 rounded shadow-lg dark:border-gray-700 h-11 hover:border-gray-800 focus:outline-none focus:shadow-none"
                          onClick={onHide}
                        >
                          Đóng
                        </Button>
                        <Button
                          type="submit"
                          className="relative flex items-center px-4 ml-2 font-semibold text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                          onClick={onSubmit}
                        >
                          Lưu thay đổi
                        </Button>
                      </div>
                    </Dialog.Panel>
                  </motion.div>
                </form>
              </Dialog>
            </LayoutGroup>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  )
}

export { OsMaterials }
