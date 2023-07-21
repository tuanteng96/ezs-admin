import React from 'react'
import { m } from 'framer-motion'
import { ArrowSmallLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { NavLink, useParams, useLocation, useNavigate } from 'react-router-dom'
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
import { useMutation, useQuery } from '@tanstack/react-query'
import ProdsAPI from 'src/_ezs/api/prods.api'
import { toast } from 'react-toastify'
import PerfectScrollbar from 'react-perfect-scrollbar'
import useEscape from 'src/_ezs/hooks/useEscape'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import Swal from 'sweetalert2'

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

const schemaAdd = yup
  .object({
    Title: yup.string().required('Vui lòng nhập tên danh mục')
  })
  .required()

const initialValues = {
  ID: '',
  $type: '',
  Title: '',
  Thumbnail: '',
  Desc: '',
  IsPublic: 1
}

function CategoryAdd(props) {
  const { search, state } = useLocation()
  const { type, id } = useParams()
  const addMode = !id
  const navigate = useNavigate()

  useEscape(() =>
    navigate({
      pathname: state?.prevFrom || '/',
      search: search
    })
  )

  const { control, handleSubmit, reset } = useForm({
    defaultValues: state?.formState
      ? {
          ...initialValues,
          $type: type.toLocaleUpperCase(),
          ...state?.formState
        }
      : {
          ...initialValues,
          $type: type.toLocaleUpperCase()
        },
    resolver: yupResolver(schemaAdd)
  })

  const { isLoading } = useQuery({
    queryKey: ['CategoryID', id],
    queryFn: async () => {
      const { data } = await ProdsAPI.getCategoryID({ ID: id })
      return data.Cate
    },
    enabled: !addMode,
    onSuccess: data => {
      if (data) {
        reset({
          $type: type.toLocaleUpperCase(),
          ID: data.ID,
          Title: data.Title,
          Thumbnail: data.Thumbnail,
          Desc: data.Desc,
          IsPublic: data.IsPublic
        })
      } else {
        navigate({
          pathname: state?.prevFrom || '/',
          search: search
        })
      }
    }
  })

  const addCategoryMutation = useMutation({
    mutationFn: body => ProdsAPI.addEditCategory(body)
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: body => ProdsAPI.deleteEditCategory(body)
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
          if (state?.formState) {
            navigate(state?.prevFrom || '/', {
              state: {
                OptionCreate: {
                  typeCreate: type.toLocaleUpperCase(),
                  label: data.data.adds[0].Title,
                  value: data.data.adds[0].ID
                }
              }
            })
          } else {
            navigate({
              pathname: state?.prevFrom || '/',
              search: search
            })
          }
        }
      },
      onError: error => console.log(error)
    })
  }

  const onDelete = () => {
    const dataDelete = {
      delete: [id]
    }
    Swal.fire({
      customClass: {
        confirmButton: '!bg-danger'
      },
      title: 'Xóa danh mục ?',
      html: `Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể được hoàn tác.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
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
          toast.success('Đã xóa danh mục')
          navigate({
            pathname: state?.prevFrom || '/',
            search: search
          })
        } else {
          toast.error('Xảy ra lỗi không xác định.')
        }
      }
    })
  }

  return (
    <>
      <m.div
        className="fixed inset-0 bg-black/[.2] dark:bg-black/[.4] z-[1010]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      ></m.div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="fixed inset-0 flex items-center justify-center z-[1010]"
      >
        <m.div
          className="absolute flex flex-col justify-center py-10 h-5/6"
          initial={{ opacity: 0, top: '60%' }}
          animate={{ opacity: 1, top: 'auto' }}
          exit={{ opacity: 0, top: '60%' }}
        >
          <div className="bg-white dark:bg-dark-aside max-w-full w-[470px] h-full rounded shadow-lg flex flex-col">
            <div className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
              <div className="text-2xl font-bold flex items-center">
                <NavLink
                  to={{
                    pathname: state?.prevFrom || '/',
                    search: search
                  }}
                  className="mr-2"
                >
                  <ArrowSmallLeftIcon className="w-7" />
                </NavLink>
                {addMode ? 'Thêm mới danh mục' : 'Chỉnh sửa danh mục'}
              </div>
              <NavLink
                to={{
                  pathname: state?.prevFrom || '/',
                  search: search
                }}
                className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
              >
                <XMarkIcon className="w-8" />
              </NavLink>
            </div>
            <PerfectScrollbar
              options={perfectScrollbarOptions}
              className="relative p-5 grow"
            >
              <div className="mb-3.5">
                <div className="font-semibold">Tên danh mục</div>
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
                      />
                    )}
                  />
                </div>
              </div>
              <div className="mb-3.5">
                <div className="font-semibold">Mô tả</div>
                <div className="mt-1">
                  <Controller
                    name="Desc"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <CkEditor5
                        value={field.value}
                        onChange={val => field.onChange(val)}
                        placeholder="Nhập mô tả"
                      />
                    )}
                  />
                </div>
              </div>
              <div className="mb-3.5">
                <div className="font-semibold">Hình ảnh</div>
                <div className="mt-1">
                  <Controller
                    name="Thumbnail"
                    control={control}
                    render={({ field }) => (
                      <UploadFile
                        width="w-[130px]"
                        height="h-[130px]"
                        value={field.value}
                        placeholder="Các tệp cho phép: png, jpg, jpeg."
                        onChange={field.onChange}
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
                    >
                      {({ checked }) => (
                        /* Use the `checked` state to conditionally style the button. */
                        <button
                          className={clsx(
                            'relative inline-flex h-6 w-11 items-center rounded-full transition',
                            checked ? 'bg-primary' : 'bg-gray-300'
                          )}
                        >
                          <span className="sr-only">Enable notifications</span>
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
                <div className="font-semibold ml-2 text-[15px]">
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
                    className="relative flex items-center px-4 ml-2 font-bold text-danger transition rounded bg-white h-11 focus:outline-none focus:shadow-none disabled:opacity-70 border border-gray-300 hover:border-danger"
                    onClick={onDelete}
                  >
                    Xóa
                  </Button>
                )}
              </div>
              <div className="flex">
                <NavLink
                  to={{
                    pathname: state?.prevFrom || '/',
                    search: search
                  }}
                  type="button"
                  className="relative flex items-center px-4 font-bold transition border border-gray-300 rounded shadow-lg dark:border-gray-700 h-11 hover:border-gray-800 focus:outline-none focus:shadow-none"
                >
                  Hủy
                </NavLink>
                <Button
                  loading={addCategoryMutation.isLoading}
                  disabled={addCategoryMutation.isLoading}
                  type="submit"
                  className="relative flex items-center px-4 ml-2 font-semibold text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                >
                  {addMode ? 'Thêm mới' : 'Cập nhập'}
                </Button>
              </div>
            </div>
          </div>
        </m.div>
      </form>
    </>
  )
}

export default CategoryAdd
