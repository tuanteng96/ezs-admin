import React, { useState, useEffect } from 'react'
import { m } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Controller, useForm } from 'react-hook-form'
import { Input, InputNumber, InputTextarea } from 'src/_ezs/partials/forms'
import Select from 'react-select'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button } from 'src/_ezs/partials/button'
import { FloatingPortal } from '@floating-ui/react'
import WarehouseAPI from 'src/_ezs/api/warehouse.api'

const schemaAddEdit = yup
  .object({
    Title: yup.string().required('Vui lòng nhập tên nhà cung cấp, đại lý'),
    Code: yup.string().required('Vui lòng nhập mã nhà cung cấp, đại lý')
  })
  .required()

const ListType = [
  {
    label: 'Nhà cung cấp',
    value: 'NCC'
  },
  {
    label: 'Đại lý',
    value: 'DAI_LY'
  }
]

function PickerAddEdit({ children, data }) {
  const [visible, setVisible] = useState(false)

  const onHide = () => {
    setVisible(false)
  }

  const queryClient = useQueryClient()

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      Title: '',
      Type: ListType[0],
      Code: '',
      Phone: '',
      Address: '',
      Desc: ''
    },
    resolver: yupResolver(schemaAddEdit)
  })

  useEffect(() => {
    if (visible && data) {
      reset({
        Title: data?.Title || '',
        Type: data.Type
          ? ListType.filter(x => x.value === data.Type)[0]
          : ListType[0],
        Code: data?.Code || '',
        Phone: data?.Phone || '',
        Address: data?.Address || '',
        Desc: data?.Desc || '',
        ID: data?.ID || ''
      })
    } else {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const addEditMutation = useMutation({
    mutationFn: body => WarehouseAPI.addEditSupplier(body)
  })

  const onSubmit = values => {
    var bodyFormData = new FormData()
    bodyFormData.append('[Title]', values.Title)
    bodyFormData.append('[Code]', values.Code)
    bodyFormData.append('[Phone]', values.Phone)
    bodyFormData.append('[Type]', values.Type ? values.Type.value : '')
    bodyFormData.append('[Address]', values.Address)
    bodyFormData.append('[Desc]', values.Desc)
    if (values.ID) {
      bodyFormData.append('[ID]', values.ID)
    }

    addEditMutation.mutate(bodyFormData, {
      onSettled: ({ data }) => {
        queryClient
          .invalidateQueries({ queryKey: ['ListSupplier'] })
          .then(() => {
            onHide()
            reset()
            toast.success('Thêm mới thành công.')
          })
      }
    })
  }

  return (
    <>
      {children({
        open: () => setVisible(true)
      })}
      {visible && (
        <FloatingPortal root={document.body}>
          <form
            onSubmit={handleSubmit(onSubmit)}
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
                  <div className="text-2xl font-bold">
                    {data?.ID ? 'Chỉnh sửa' : 'Tạo mới'}
                  </div>
                  <div
                    className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                    onClick={onHide}
                  >
                    <XMarkIcon className="w-8" />
                  </div>
                </div>
                <div className="p-5 overflow-auto grow">
                  <div className="mb-3.5">
                    <div className="font-semibold">
                      Tên Nhà cung cấp, Đại lý
                    </div>
                    <div className="mt-1">
                      <Controller
                        name="Title"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <Input
                            placeholder="Nhập tên"
                            value={field.value}
                            errorMessageForce={fieldState?.invalid}
                            errorMessage={fieldState?.error?.message}
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="mb-3.5">
                    <div className="font-semibold">Mã</div>
                    <div className="mt-1">
                      <Controller
                        name="Code"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <Input
                            placeholder="Nhập mã"
                            value={field.value}
                            errorMessageForce={fieldState?.invalid}
                            errorMessage={fieldState?.error?.message}
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="mb-3.5">
                    <div className="font-semibold">Loại</div>
                    <div className="mt-1">
                      <Controller
                        name="Type"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <Select
                            classNamePrefix="select"
                            options={ListType}
                            className="select-control mb-8px"
                            placeholder="Chọn loại"
                            value={field.value}
                            onChange={val => field.onChange(val)}
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
                  <div className="mb-3.5">
                    <div className="font-semibold">Số điện thoại</div>
                    <div className="mt-1">
                      <Controller
                        name="Phone"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <InputNumber
                            onValueChange={val => {
                              field.onChange(val.value || '')
                            }}
                            allowLeadingZeros
                            allowNegative={false}
                            options={ListType}
                            placeholder="Nhập số điện thoại"
                            value={field.value}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="mb-3.5">
                    <div className="font-semibold">Địa chỉ</div>
                    <div className="mt-1">
                      <Controller
                        name="Address"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <InputTextarea
                            placeholder="Nhập địa chỉ"
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">Ghi chú</div>
                    <div className="mt-1">
                      <Controller
                        name="Desc"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <InputTextarea
                            placeholder="Nhập ghi chú"
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end p-5 border-t border-separator dark:border-dark-separator">
                  <Button
                    onClick={onHide}
                    type="button"
                    className="relative flex items-center px-4 font-bold transition border border-gray-300 rounded shadow-lg dark:border-gray-700 h-11 hover:border-gray-800 focus:outline-none focus:shadow-none"
                  >
                    Hủy
                  </Button>
                  <Button
                    loading={addEditMutation.isLoading}
                    disabled={addEditMutation.isLoading}
                    type="submit"
                    className="relative flex items-center px-4 ml-2 font-semibold text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                  >
                    {data?.ID ? 'Lưu thay đổi' : 'Thêm mới'}
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

export default PickerAddEdit
