import React, { useState } from 'react'
import { m } from 'framer-motion'
import { ArrowSmallLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Controller, useForm } from 'react-hook-form'
import { Button } from 'src/_ezs/partials/button'
import { Input } from 'src/_ezs/partials/forms'
import { CkEditor5 } from 'src/_ezs/partials/ckeditor'
import { UploadFile } from 'src/_ezs/partials/files'
import { Switch } from '@headlessui/react'
import { Fragment } from 'react'
import clsx from 'clsx'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ProdsAPI from 'src/_ezs/api/prods.api'
import { toast } from 'react-toastify'
import PerfectScrollbar from 'react-perfect-scrollbar'
import useEscape from 'src/_ezs/hooks/useEscape'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import Swal from 'sweetalert2'
import { FloatingPortal } from '@floating-ui/react'
import { formatString } from 'src/_ezs/utils/formatString'
import { useRoles } from 'src/_ezs/hooks/useRoles'

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

const schemaAdd = yup
  .object({
    Title: yup.string().required('Vui lòng nhập tên danh mục')
  })
  .required()

function PickerAddCategories({
  children,
  TypeOf,
  initialValues,
  onAddSuccess
}) {
  const { ReadCate, ReadApp_type } = useRoles(['ReadCate', 'ReadApp_type'])

  const [visible, setVisible] = useState(false)

  const queryClient = useQueryClient()

  const onHide = () => {
    setVisible(false)
  }

  const addMode = !initialValues?.ID

  useEscape(() => onHide())

  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      ID: '',
      $type: TypeOf,
      Title: '',
      Thumbnail: '',
      Desc: '',
      IsPublic: 1
    },
    resolver: yupResolver(schemaAdd)
  })

  const { isLoading } = useQuery({
    queryKey: ['CategoryID', initialValues],
    queryFn: async () => {
      const { data } = await ProdsAPI.getCategoryID({ ID: initialValues?.ID })
      return data.Cate
    },
    enabled: !addMode,
    onSuccess: data => {
      if (data) {
        reset({
          $type: TypeOf,
          ID: data.ID,
          Title: data.Title,
          Thumbnail: data.Thumbnail,
          Desc: data.Desc,
          IsPublic: data.IsPublic
        })
      }
    }
  })

  const addCategoryMutation = useMutation({
    mutationFn: async body => {
      let rs = await ProdsAPI.addEditCategory(body)
      await queryClient.invalidateQueries({
        queryKey: ['ListCategory-products']
      })
      await queryClient.invalidateQueries({
        queryKey: ['Catalogue-lists']
      })
      return rs
    }
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: async body => {
      let rs = await ProdsAPI.deleteEditCategory(body)
      await queryClient.invalidateQueries({
        queryKey: ['Catalogue-lists']
      })
      return rs
    }
  })

  const onSubmit = values => {
    const dataPost = {
      categies: [
        {
          ...values
        }
      ]
    }
    addCategoryMutation.mutate(dataPost, {
      onSuccess: data => {
        if (!data.error) {
          toast.success(
            addMode
              ? 'Thêm mới danh mục thành công'
              : 'Danh mục đã được chỉnh sửa'
          )
          if (data && data?.data?.adds && data?.data?.adds.length > 0) {
            onAddSuccess && onAddSuccess(data?.data?.adds[0])
          }
          onHide()
        }
      },
      onError: error => console.log(error)
    })
  }

  const onDelete = () => {
    if (!ReadCate?.hasRight) {
      toast.error('Bạn không có quyền truy cập chức năng này.')
    } else {
      const dataDelete = {
        delete: [initialValues?.ID]
      }
      Swal.fire({
        customClass: {
          confirmButton: '!bg-danger'
        },
        title: TypeOf === 'NH' ? 'Xoá nhãn hàng ?' : 'Xóa danh mục ?',
        html:
          TypeOf === 'NH'
            ? `Bạn muốn xóa nhãn hàng <span class="font-semibold text-primary">${initialValues?.Title}</span> ? Khi bạn xóa toàn bộ các sản phẩm, nguyên vật liệu thuộc nhãn hàng sẽ được loại bỏ ( sản phẩm, NVL không thuộc nhãn hàng nào ).`
            : `Bạn muốn xóa phân loại nhóm <span class="font-semibold text-primary">${
                initialValues?.Title
              }</span> ? Khi bạn xóa toàn bộ các ${formatString.formatTypesOf(
                TypeOf
              )} nằm trong nhóm này sẽ được cập nhật không thuộc nhóm ${formatString.formatTypesOf(
                TypeOf
              )} nào.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xoá',
        cancelButtonText: 'Đóng',
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          const data = await deleteCategoryMutation.mutateAsync(dataDelete)
          return data
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then(result => {
        if (result.isConfirmed) {
          if (!result?.value?.data?.error) {
            onHide()
            toast.success('Đã xóa danh mục')
          } else {
            toast.error('Xảy ra lỗi không xác định.')
          }
        }
      })
    }
  }

  const handleSubmitWithoutPropagation = e => {
    e.preventDefault()
    e.stopPropagation()
    handleSubmit(onSubmit)(e)
  }

  return (
    <>
      {children({
        open: obj => {
          setVisible(true)
          if (obj) {
            for (const property in obj) {
              setValue(property, obj[property])
            }
          }
        }
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
              <div className="bg-white dark:bg-dark-aside max-w-full w-[500px] h-full rounded shadow-lg flex flex-col">
                <div className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
                  <div className="flex items-center text-2xl font-semibold">
                    <div className="mr-2 cursor-pointer" onClick={onHide}>
                      <ArrowSmallLeftIcon className="w-7" />
                    </div>
                    {addMode ? `Thêm mới danh mục` : `Chỉnh sửa danh mục`}
                  </div>
                  <div
                    onClick={onHide}
                    className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                  >
                    <XMarkIcon className="w-8" />
                  </div>
                </div>
                <PerfectScrollbar
                  options={perfectScrollbarOptions}
                  className="relative p-5 grow"
                >
                  <div className="mb-3.5">
                    <div className="font-medium">Tên danh mục</div>
                    <div className="mt-1">
                      <Controller
                        name="Title"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <Input
                            placeholder="e.g Tên danh mục"
                            autoComplete="off"
                            type="text"
                            errorMessageForce={fieldState?.invalid}
                            errorMessage={fieldState?.error?.message}
                            {...field}
                            disabled={!addMode && !ReadCate?.hasRight}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="mb-3.5">
                    <div className="font-medium">Mô tả</div>
                    <div className="mt-1">
                      <Controller
                        name="Desc"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <CkEditor5
                            value={field.value}
                            onChange={val => field.onChange(val)}
                            placeholder="Nhập mô tả"
                            disabled={!ReadApp_type?.hasRight}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="mb-3.5">
                    <div className="font-medium">Hình ảnh</div>
                    <div className="mt-1">
                      <Controller
                        name="Thumbnail"
                        control={control}
                        render={({ field }) => (
                          <UploadFile
                            size="xs"
                            width="w-[130px]"
                            height="h-[130px]"
                            value={field.value}
                            placeholder="Các tệp cho phép: png, jpg, jpeg."
                            onChange={field.onChange}
                            disabled={!ReadApp_type?.hasRight}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Controller
                      name="IsPublic"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value === 1}
                          onChange={val => field.onChange(val ? 1 : 0)}
                          as={Fragment}
                          disabled={!ReadApp_type?.hasRight}
                        >
                          {({ checked }) => (
                            /* Use the `checked` state to conditionally style the button. */
                            <button
                              className={clsx(
                                'relative inline-flex h-6 w-11 items-center rounded-full transition',
                                checked ? 'bg-primary' : 'bg-gray-300',
                                'disabled:opacity-50'
                              )}
                            >
                              <span className="sr-only">
                                Enable notifications
                              </span>
                              <span
                                className={clsx(
                                  'inline-block h-4 w-4 transform rounded-full bg-white transition',
                                  checked ? 'translate-x-6' : 'translate-x-1'
                                )}
                              />
                            </button>
                          )}
                        </Switch>
                      )}
                    />
                    <div className="font-medium ml-2 text-[15px]">
                      Hiển thị trên Web / APP
                    </div>
                  </div>

                  <LoadingComponentFull
                    loading={!addMode && isLoading}
                    bgClassName="bg-white "
                  />
                </PerfectScrollbar>
                <div className="flex justify-between p-5 border-t border-separator dark:border-dark-separator">
                  <div>
                    {!addMode && (
                      <Button
                        loading={deleteCategoryMutation.isLoading}
                        disabled={deleteCategoryMutation.isLoading}
                        type="button"
                        className="relative flex items-center px-4 transition bg-white border border-gray-300 rounded text-danger h-11 focus:outline-none focus:shadow-none disabled:opacity-70 hover:border-danger"
                        onClick={onDelete}
                      >
                        Xóa
                      </Button>
                    )}
                  </div>
                  <div className="flex">
                    <Button
                      onClick={onHide}
                      type="button"
                      className="relative flex items-center px-4 transition border border-gray-300 rounded shadow-lg dark:border-gray-700 h-11 hover:border-gray-800 focus:outline-none focus:shadow-none"
                    >
                      Hủy
                    </Button>
                    <Button
                      loading={addCategoryMutation.isLoading}
                      disabled={addCategoryMutation.isLoading}
                      type="submit"
                      className="relative flex items-center px-4 ml-2 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                    >
                      {addMode ? 'Thêm mới' : 'Cập nhật'}
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

export default PickerAddCategories
