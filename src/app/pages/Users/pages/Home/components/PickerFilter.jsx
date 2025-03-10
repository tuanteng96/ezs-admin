import React, { useState, useEffect } from 'react'
import { m } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Controller, useForm } from 'react-hook-form'
import { Button } from 'src/_ezs/partials/button'
import { FloatingPortal } from '@floating-ui/react'
import { SelectGroupRoles, SelectStocks } from 'src/_ezs/partials/select'
import clsx from 'clsx'
import { Input } from 'src/_ezs/partials/forms'
import Select from 'react-select'

const OptionsStatus = [
  {
    value: 0,
    label: 'Hoạt động'
  },
  {
    value: -1,
    label: 'Đã nghĩ'
  }
]

function PickerFilter({ children, initialValues, onChange }) {
  const [visible, setVisible] = useState(false)

  const onHide = () => {
    setVisible(false)
  }

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      Key: '',
      GroupIDs: [],
      Status: [0],
      StockIDs: null
    }
  })

  useEffect(() => {
    if (initialValues) {
      reset({
        Key: initialValues?.Key || '',
        GroupIDs: initialValues?.GroupIDs || [],
        Status: initialValues?.Status || [0],
        StockIDs: initialValues?.StockIDs
      })
    } else {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onSubmit = values => {
    onChange(values)
    onHide()
  }

  const handleSubmitWithoutPropagation = e => {
    e.preventDefault()
    e.stopPropagation()
    handleSubmit(onSubmit)(e)
  }

  let { StockIDs } = watch()

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
              className="absolute flex flex-col justify-center h-full py-8 px-4 sm:px-0 w-[500px] max-w-full"
              initial={{ opacity: 0, top: '60%' }}
              animate={{ opacity: 1, top: 'auto' }}
              exit={{ opacity: 0, top: '60%' }}
            >
              <div className="flex flex-col max-h-full bg-white rounded shadow-lg dark:bg-dark-aside">
                <div className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
                  <div className="text-2xl font-bold">Bộ lọc</div>
                  <div
                    className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                    onClick={onHide}
                  >
                    <XMarkIcon className="w-8" />
                  </div>
                </div>
                <div className="p-5 overflow-auto grow">
                  <div className="mb-4 last:mb-0">
                    <div className="font-semibold">Tên nhân viên</div>
                    <div className="mt-1">
                      <Controller
                        name="Key"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <Input
                            placeholder="Nhập tên nhân viên"
                            value={field.value}
                            errorMessageForce={fieldState?.invalid}
                            //errorMessage={fieldState?.error?.message}
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="mb-4 last:mb-0">
                    <div className="font-semibold">Cơ sở</div>
                    <div className="mt-1">
                      <Controller
                        name="StockIDs"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <SelectStocks
                            allOption={[
                              {
                                label: 'Hệ thống',
                                value: '0'
                              }
                            ]}
                            //StockRoles={pos_mng.StockRoles}
                            value={field.value}
                            onChange={val => {
                              field.onChange(
                                val?.value !== '' ? val?.value : ''
                              )
                            }}
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
                  <div className="mb-4 last:mb-0">
                    <div className="font-semibold">Nhóm</div>
                    <div className="mt-1">
                      <Controller
                        name="GroupIDs"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <SelectGroupRoles
                            isMulti
                            value={field.value}
                            onChange={({ Selected, UnSelected }) => {
                              field.onChange(
                                Selected ? Selected.map(x => x.value) : null
                              )
                            }}
                            className={clsx(
                              'select-control',
                              fieldState?.invalid && 'select-control-error'
                            )}
                            menuPosition="fixed"
                            styles={{
                              menuPortal: base => ({
                                ...base,
                                zIndex: 9999
                              })
                            }}
                            menuPortalTarget={document.body}
                            params={{
                              UserID: 0,
                              StockID:
                                StockIDs && StockIDs.length > 0
                                  ? StockIDs[0]
                                  : 0
                            }}
                            errorMessageForce={fieldState?.invalid}
                            errorMessage={fieldState?.error?.message}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="mb-4 last:mb-0">
                    <div className="font-semibold">Trạng thái</div>
                    <div className="mt-1">
                      <Controller
                        name="Status"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <Select
                            isMulti
                            value={OptionsStatus.filter(
                              x => field?.value && field.value.includes(x.value)
                            )}
                            className="select-control"
                            onChange={val =>
                              field.onChange(val ? val.map(x => x.value) : [])
                            }
                            classNamePrefix="select"
                            options={OptionsStatus}
                            placeholder="Chọn trạng thái"
                            noOptionsMessage={() => 'Không có dữ liệu'}
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
                </div>
                <div className="flex justify-between p-5 border-t border-separator dark:border-dark-separator">
                  <Button
                    type="button"
                    className="relative flex items-center px-4 transition border border-gray-300 rounded shadow-lg dark:border-gray-700 h-11 hover:border-info focus:outline-none focus:shadow-none text-info"
                    onClick={() => reset()}
                  >
                    Xóa bộ lọc
                  </Button>
                  <div className="flex justify-end">
                    <Button
                      onClick={onHide}
                      type="button"
                      className="relative flex items-center px-4 font-bold transition border border-gray-300 rounded shadow-lg dark:border-gray-700 h-11 hover:border-gray-800 focus:outline-none focus:shadow-none"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      className="relative flex items-center px-4 ml-2 font-semibold text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                    >
                      Tìm kiếm
                    </Button>
                  </div>
                </div>
              </div>
            </m.div>
          </form>
        </FloatingPortal>
      )}
    </>
  )
}

export default PickerFilter
