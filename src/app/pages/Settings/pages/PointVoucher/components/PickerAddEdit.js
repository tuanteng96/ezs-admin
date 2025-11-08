import React, { useState, useEffect } from 'react'
import { m } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Controller, useForm } from 'react-hook-form'
import {
  Checkbox,
  Input,
  InputNumber,
  InputTextarea
} from 'src/_ezs/partials/forms'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button } from 'src/_ezs/partials/button'
import { FloatingPortal } from '@floating-ui/react'
import { UploadFile } from 'src/_ezs/partials/files'
import { CkEditor5 } from 'src/_ezs/partials/ckeditor'
import SettingsAPI from 'src/_ezs/api/settings.api'
import Select from 'react-select'
import { SelectProdSelect2 } from 'src/_ezs/partials/select'

const optionsApply = [
  { label: 'Áp dụng kèm chương trình ưu đãi', value: 'NG,KM' },
  { label: 'Không áp dụng kèm chương trình ưu đãi', value: 'NG' }
]

const schemaAddEdit = yup
  .object({
    Title: yup.string().required('Vui lòng nhập tên giải thưởng')
  })
  .required()

function PickerAddEdit({ children, data }) {
  const [visible, setVisible] = useState(false)

  const onHide = () => {
    setVisible(false)
  }

  const queryClient = useQueryClient()

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      ID: 0,
      Title: '',
      Desc: '',
      Detail: '',
      Photo: '',
      IsPublic: true,
      Point: '',
      Data: {
        Discount: '',
        ValueType: 2, //2:dong gia, 1: Tien, 0: phan tram
        Apply: 'NG,KM',
        ForCates: '',
        ForProds: '',
        InDays: 30,
        IsVisibled: true,
        NMax: 1,
        IsPublic: 1,
        MemberUseMax: -1
      }
    },
    resolver: yupResolver(schemaAddEdit)
  })

  useEffect(() => {
    if (visible && data) {
      reset({
        ...data,
        Data: {
          ...data.Data,
          ForCates: data.Data?.ForCates
            ? data.Data?.ForCates.map(x => ({
                label: x.Title,
                value: x.ID
              }))
            : null,
          ForProds: data.Data?.ForProds
            ? data.Data?.ForProds.map(x => ({
                label: x.Title,
                value: x.ID
              }))
            : null
        }
      })
    } else {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const addEditMutation = useMutation({
    mutationFn: body => SettingsAPI.addEditPointVoucher(body)
  })

  const onSubmit = values => {
    let newValues = {
      ...values,
      Data: values.Data
        ? {
            ...values.Data,
            ForCates: values.Data.ForCates
              ? values.Data.ForCates.map(x => ({
                  ID: x.value,
                  Title: x.label
                }))
              : null,
            ForProds: values.Data.ForProds
              ? values.Data.ForProds.map(x => ({
                  ID: x.value,
                  Title: x.label
                }))
              : null
          }
        : null
    }
    addEditMutation.mutate(
      {
        edit: [newValues]
      },
      {
        onSuccess: ({ data }) => {
          queryClient
            .invalidateQueries({ queryKey: ['ListSettingsPointVoucher'] })
            .then(() => {
              onHide()
              reset()
              toast.success(
                values?.ID ? 'Cập nhật thành công.' : 'Thêm mới thành công.'
              )
            })
        }
      }
    )
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
                    {data?.ID ? 'Chỉnh sửa đổi thưởng' : 'Tạo mới đổi thưởng'}
                  </div>
                  <div
                    className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                    onClick={onHide}
                  >
                    <XMarkIcon className="w-8" />
                  </div>
                </div>
                <div className="p-5 overflow-auto grow">
                  <div>
                    <div className="mb-3.5 last:mb-0">
                      <div className="font-semibold">Tên giải thưởng</div>
                      <div className="mt-1">
                        <Controller
                          name="Title"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
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
                    <div className="mb-3.5 last:mb-0">
                      <div className="font-semibold">Mô tả</div>
                      <div className="mt-1">
                        <Controller
                          name="Desc"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <InputTextarea
                              placeholder="Nhập mô tả"
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="mb-3.5 last:mb-0">
                      <div className="font-medium">Hình ảnh</div>
                      <div className="mt-1">
                        <Controller
                          name="Photo"
                          control={control}
                          render={({ field }) => (
                            <UploadFile
                              buttonText="Tải ảnh lên"
                              size="xs"
                              width="w-[120px]"
                              height="h-[120px]"
                              value={field.value}
                              placeholder="Các tệp cho phép: png, jpg, jpeg."
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="mb-3.5 last:mb-0">
                      <div className="font-semibold">Chi tiết</div>
                      <div className="mt-1">
                        <Controller
                          name="Detail"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <CkEditor5
                              className="ck-content"
                              value={field.value}
                              onChange={val => field.onChange(val)}
                              placeholder="Nhập chi tiết"
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="mb-5 last:mb-0">
                      <div className="font-semibold">Số điểm</div>
                      <div className="mt-1">
                        <Controller
                          name="Point"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <InputNumber
                              thousandSeparator={false}
                              value={field.value}
                              placeholder="Nhập giá trị"
                              onValueChange={val => {
                                field.onChange(
                                  typeof val.floatValue == 'undefined'
                                    ? val.value
                                    : val.floatValue
                                )
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="mb-3.5 last:mb-0">
                      <Controller
                        name="IsPublic"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <Checkbox
                            labelText="Công khai"
                            id="IsPublic"
                            label={
                              <span className="font-medium text-site-color">
                                Công khai
                              </span>
                            }
                            className="checked:!bg-primary border-0"
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-separator">
                    <div className="font-semibold uppercase">Mã giảm giá</div>
                    <div className="mt-4">
                      <div className="mb-3.5 last:mb-0">
                        <div>Tặng mã giảm giá</div>
                        <div className="mt-1">
                          <Controller
                            name="Data.Discount"
                            control={control}
                            render={({
                              field: { ref, ...field },
                              fieldState
                            }) => (
                              <Input
                                placeholder="Nhập giá trị"
                                value={field.value}
                                errorMessageForce={fieldState?.invalid}
                                errorMessage={fieldState?.error?.message}
                                {...field}
                              />
                            )}
                          />
                          <div className="mt-1.5 text-[13px] text-muted">
                            Nhập số 0 nếu bạn không áp dụng ( % hoặc số tiền )
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between mb-4 last:mb-0">
                        <div>Loại</div>

                        <div className="flex-1">
                          <Controller
                            name="Data.ValueType"
                            control={control}
                            render={({
                              field: { ref, ...field },
                              fieldState
                            }) => (
                              <div className="flex justify-end gap-3">
                                {[
                                  {
                                    label: 'Đồng giá',
                                    value: '2'
                                  },
                                  {
                                    label: 'Số tiền',
                                    value: '1'
                                  },
                                  {
                                    label: 'Phần trăm',
                                    value: '0'
                                  }
                                ].map(item => (
                                  <Checkbox
                                    key={item.value}
                                    labelText={item.label}
                                    htmlFor={item.value}
                                    {...field}
                                    value={item.value}
                                    onChange={() => field.onChange(item.value)}
                                    checked={
                                      field.value &&
                                      field.value.toString() ===
                                        item.value.toString()
                                    }
                                    labelClassName="text-[14px] pl-2 font-medium"
                                    className="!w-auto"
                                  />
                                ))}
                              </div>
                            )}
                          />
                        </div>
                      </div>
                      <div className="mb-5 last:mb-0">
                        <div>Áp dụng</div>
                        <div className="mt-1">
                          <Controller
                            name="Data.Apply"
                            control={control}
                            render={({
                              field: { ref, ...field },
                              fieldState
                            }) => (
                              <Select
                                classNamePrefix="select"
                                options={optionsApply}
                                className="select-control"
                                onChange={val => field.onChange(val?.value)}
                                value={
                                  field.value
                                    ? optionsApply.find(
                                        x => field.value === x.value
                                      )
                                    : null
                                }
                                placeholder="Chọn loại áp dụng"
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
                      <div className="mb-5 last:mb-0">
                        <div>Áp dụng danh mục</div>
                        <div className="mt-1">
                          <Controller
                            name="Data.ForCates"
                            control={control}
                            render={({
                              field: { ref, ...field },
                              fieldState
                            }) => (
                              <SelectProdSelect2
                                isMulti
                                isSuffix={false}
                                Params={{
                                  cmd: 'cate',
                                  app: 'type',
                                  roots: 0,
                                  includeSource: 1,
                                  _type: 'query'
                                }}
                                className="select-control"
                                onChange={val => field.onChange(val)}
                                value={field.value}
                                placeholder="Chọn danh mục áp dụng"
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="mb-5 last:mb-0">
                        <div>Áp dụng SP/DV</div>
                        <div className="mt-1">
                          <Controller
                            name="Data.ForProds"
                            control={control}
                            render={({
                              field: { ref, ...field },
                              fieldState
                            }) => (
                              <SelectProdSelect2
                                isMulti
                                isSuffix={false}
                                Params={{
                                  cmd: 'prod',
                                  cateids: '662',
                                  _type: 'query'
                                }}
                                className="select-control"
                                onChange={val => field.onChange(val)}
                                value={field.value}
                                placeholder="Chọn SP/DV áp dụng"
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="mb-5 last:mb-0">
                        <div>Hết hạn sau số ngày</div>
                        <div className="mt-1">
                          <Controller
                            name="Data.InDays"
                            control={control}
                            render={({
                              field: { ref, ...field },
                              fieldState
                            }) => (
                              <InputNumber
                                thousandSeparator={false}
                                value={field.value}
                                placeholder="Nhập số ngày"
                                onValueChange={val => {
                                  field.onChange(
                                    typeof val.floatValue == 'undefined'
                                      ? val.value
                                      : val.floatValue
                                  )
                                }}
                              />
                            )}
                          />
                        </div>
                      </div>
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
