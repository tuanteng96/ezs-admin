import React from 'react'
import { m } from 'framer-motion'
import { ArrowSmallLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import {
  NavLink,
  useParams,
  useLocation,
  useNavigate,
  useMatch
} from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { Button } from 'src/_ezs/partials/button'
import { Input, InputNumber } from 'src/_ezs/partials/forms'
import { CkEditor5 } from 'src/_ezs/partials/ckeditor'
import { Switch } from '@headlessui/react'
import { Fragment } from 'react'
import clsx from 'clsx'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import PerfectScrollbar from 'react-perfect-scrollbar'
import useEscape from 'src/_ezs/hooks/useEscape'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import Swal from 'sweetalert2'
import BannersAPI from 'src/_ezs/api/banners.api'

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

const schemaAdd = yup
  .object({
    Title: yup.string().required('Vui lòng nhập tên vị trí')
  })
  .required()

const initialValues = {
  ID: '',
  Title: '',
  Desc: '',
  IsPublic: 1,
  Order: 0
}

function CategoriesAdd(props) {
  const { search, state } = useLocation()
  let path = '/banners/list/categories'

  const { id } = useParams()
  const addMode = useMatch('/banners/list/categories/add')
  const navigate = useNavigate()

  useEscape(() =>
    navigate({
      pathname: path,
      search: search
    })
  )

  const { control, handleSubmit, reset } = useForm({
    defaultValues: state?.formState
      ? {
          ID: state?.formState?.ID,
          Title: state?.formState?.Title,
          Desc: state?.formState?.Desc,
          IsPublic: state?.formState?.IsPublic,
          Order: state?.formState?.Order
        }
      : {
          ...initialValues
        },
    resolver: yupResolver(schemaAdd)
  })

  const { isLoading } = useQuery({
    queryKey: ['BannersCategoryID', id],
    queryFn: async () => {
      const { data } = await BannersAPI.categories({
        pi: 1,
        ps: 10,
        filter: {
          ID: id
        }
      })
      return data && data?.list?.length > 0 ? data?.list[0] : null
    },
    onSuccess: data => {
      if (!data) {
        navigate({
          pathname: path,
          search: search
        })
      } else {
        reset({
          ID: data?.ID,
          Title: data?.Title,
          Desc: data?.Desc,
          IsPublic: data?.IsPublic,
          Order: data?.Order
        })
      }
    },
    enabled: !addMode
  })

  const addUpdateMutation = useMutation({
    mutationFn: body => BannersAPI.categoriesAddEdit(body)
  })

  const deleteMutation = useMutation({
    mutationFn: body => BannersAPI.categoriesDelete(body)
  })

  const onSubmit = values => {
    const dataPost = {
      arr: [
        {
          ...values
        }
      ]
    }
    addUpdateMutation.mutate(dataPost, {
      onSuccess: ({ data }) => {
        if (!data.error) {
          toast.success(
            addMode
              ? 'Thêm mới vị trí thành công'
              : 'Danh mục đã được chỉnh sửa'
          )
          navigate({
            pathname: path,
            search: search
          })
        } else {
          toast.error('Lỗi - ' + data.error)
        }
      },
      onError: error => console.log(error)
    })
  }

  const onDelete = () => {
    const dataPost = {
      delete: [id]
    }
    Swal.fire({
      customClass: {
        confirmButton: '!bg-danger'
      },
      title: 'Xóa bài viết ?',
      html: `Bạn có chắc chắn muốn xóa vài viết này? Hành động này không thể được hoàn tác.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Thực hiện xóa',
      cancelButtonText: 'Đóng',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const data = await deleteMutation.mutateAsync(dataPost)
        return data
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(result => {
      if (result.isConfirmed) {
        if (!result?.value?.data?.error) {
          toast.success('Đã xóa vị trí.')
          navigate({
            pathname: path,
            search: search
          })
        } else {
          toast.error('Xảy ra lỗi không xác định.')
        }
      }
    })
  }

  return (
    <form
      className="fixed inset-0 flex items-center justify-center z-[1010]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <m.div
        className="absolute inset-0 bg-black/[.2] dark:bg-black/[.4]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      ></m.div>
      <m.div
        className="absolute flex flex-col justify-center py-10 h-full"
        initial={{ opacity: 0, top: '60%' }}
        animate={{ opacity: 1, top: 'auto' }}
        exit={{ opacity: 0, top: '60%' }}
      >
        <div className="h-full flex flex-col justify-center">
          <div className="flex flex-col bg-white dark:bg-dark-aside max-w-full w-[470px] max-h-full rounded shadow-lg">
            <div className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
              <div className="text-2xl font-semibold flex items-center">
                <NavLink
                  to={{
                    pathname: path,
                    search: search
                  }}
                  className="mr-2"
                >
                  <ArrowSmallLeftIcon className="w-7" />
                </NavLink>
                {addMode ? 'Thêm mới vị trí' : 'Chỉnh sửa vị trí'}
              </div>
              <NavLink
                to={{
                  pathname: path,
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
                <div className="font-medium">Tên vị trí</div>
                <div className="mt-1">
                  <Controller
                    name="Title"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <Input
                        placeholder="e.g Tên vị trí"
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
                      />
                    )}
                  />
                </div>
              </div>
              <div className="mb-3.5">
                <div className="font-medium">Thứ tự</div>
                <div className="mt-1">
                  <Controller
                    name="Order"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <InputNumber
                        placeholder="e.g Số thứ tự"
                        autoComplete="off"
                        errorMessageForce={fieldState?.invalid}
                        errorMessage={fieldState?.error?.message}
                        onValueChange={val =>
                          field.onChange(val.floatValue || '')
                        }
                        allowNegative={false}
                        {...field}
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
                    loading={deleteMutation.isLoading}
                    disabled={deleteMutation.isLoading}
                    type="button"
                    className="relative flex items-center px-4 text-danger transition rounded bg-white h-11 focus:outline-none focus:shadow-none disabled:opacity-70 border border-gray-300 hover:border-danger"
                    onClick={onDelete}
                  >
                    Xóa
                  </Button>
                )}
              </div>
              <div className="flex">
                <NavLink
                  to={{
                    pathname: path,
                    search: search
                  }}
                  type="button"
                  className="relative flex items-center px-4 transition border border-gray-300 rounded shadow-lg dark:border-gray-700 h-11 hover:border-gray-800 focus:outline-none focus:shadow-none"
                >
                  Hủy
                </NavLink>
                <Button
                  loading={addUpdateMutation.isLoading}
                  disabled={addUpdateMutation.isLoading}
                  type="submit"
                  className="relative flex items-center px-4 ml-2 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                >
                  {addMode ? 'Thêm mới' : 'Cập nhật'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </m.div>
    </form>
  )
}

export default CategoriesAdd
