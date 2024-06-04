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
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm
} from 'react-hook-form'
import { Button } from 'src/_ezs/partials/button'
import { Input } from 'src/_ezs/partials/forms'
import { CkEditor5 } from 'src/_ezs/partials/ckeditor'
import { Switch } from '@headlessui/react'
import { Fragment } from 'react'
import clsx from 'clsx'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import PerfectScrollbar from 'react-perfect-scrollbar'
import useEscape from 'src/_ezs/hooks/useEscape'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import Swal from 'sweetalert2'
import { SelectPostsCategories } from 'src/_ezs/partials/select'
import { UploadFile } from 'src/_ezs/partials/files'
import PostsAPI from 'src/_ezs/api/posts.api'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import { toAbsolutePath } from 'src/_ezs/utils/assetPath'
import moment from 'moment'
import { formatString } from 'src/_ezs/utils/formatString'

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

const schemaAdd = yup
  .object({
    Title: yup.string().required('Vui lòng nhập tên bài viết'),
    Channels: yup.array().required('Vui lòng chọn danh mục')
  })
  .required()

const initialValues = {
  ID: 0,
  Title: '',
  Desc: '',
  Content: '',
  Thumbnail: null,
  PhotoList: [],
  Channels: null,
  CreateDate: new Date(),
  Order: 0,
  IsPublic: 1
}

function AddEdit(props) {
  const queryClient = useQueryClient()
  const { search, state } = useLocation()
  let path = '/posts/list'

  const { id } = useParams()
  const addMode = useMatch('/posts/list/add')
  const navigate = useNavigate()

  useEscape(() =>
    navigate({
      pathname: path,
      search: search
    })
  )

  const methods = useForm({
    defaultValues: state?.formState
      ? {
          ...initialValues,
          ID: state?.formState?.ID,
          Title: state?.formState?.Title,
          Desc: state?.formState?.Desc,
          Content: formatString.fixedContentDomain(state?.formState?.Content),
          Order: state?.formState?.Order,
          IsPublic: state?.formState?.IsPublic
        }
      : {
          ...initialValues
        },
    resolver: yupResolver(schemaAdd)
  })

  const { control, handleSubmit, reset } = methods

  const { fields, remove, prepend } = useFieldArray({
    control,
    name: 'PhotoList'
  })

  const { isLoading } = useQuery({
    queryKey: ['PostsID', id],
    queryFn: async () => {
      const { data } = await PostsAPI.list({
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
        let newPhotoList = []
        let Thumbnail = ''
        if (data?.PhotoList && data?.PhotoList.length > 0) {
          Thumbnail = data?.PhotoList[0]
          newPhotoList = [...data?.PhotoList]
          newPhotoList.shift()
        }
        reset({
          ID: data?.ID,
          Title: data?.Title,
          Desc: data?.Desc,
          Content: formatString.fixedContentDomain(data?.Content),
          Order: data?.Order,
          IsPublic: data?.IsPublic,
          PhotoList:
            newPhotoList.length > 0
              ? newPhotoList.map(x => ({
                  Src: x
                }))
              : null,
          Thumbnail,
          Channels:
            data?.ChannelList && data?.ChannelList
              ? data?.ChannelList.map(x => ({ label: x.Title, value: x.ID }))
              : null
        })
      }
    },
    enabled: !addMode
  })

  const addUpdateMutation = useMutation({
    mutationFn: body => PostsAPI.edit(body)
  })

  const deleteMutation = useMutation({
    mutationFn: body => PostsAPI.delete(body)
  })

  const onSubmit = values => {
    let newPhotoList = []
    newPhotoList.push(values.Thumbnail)
    if (values.PhotoList && values.PhotoList.length > 0) {
      for (let img of values.PhotoList) {
        newPhotoList.push(img.Src)
      }
    }

    const dataPost = {
      arr: [
        {
          ...values,
          Thumbnail: '',
          PhotoList: newPhotoList,
          Channels: values?.Channels
            ? values?.Channels.map(x => x.value).toString()
            : '',
          CreateDate: values?.CreateDate
            ? moment(values?.CreateDate).format('HH:mm YYYY-MM-DD')
            : moment().format('HH:mm YYYY-MM-DD')
        }
      ]
    }

    addUpdateMutation.mutate(dataPost, {
      onSuccess: ({ data }) => {
        if (!data.error) {
          queryClient
            .invalidateQueries({ queryKey: ['ListPosts'] })
            .then(() => {
              toast.success(
                addMode
                  ? 'Thêm mới bài viết thành công'
                  : 'Bài viết đã được chỉnh sửa'
              )
              navigate({
                pathname: path,
                search: search
              })
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
          toast.success('Đã xóa vài biết.')
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
    <FormProvider {...methods}>
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
          className="absolute flex flex-col justify-center h-full py-10"
          initial={{ opacity: 0, top: '60%' }}
          animate={{ opacity: 1, top: 'auto' }}
          exit={{ opacity: 0, top: '60%' }}
        >
          <div className="flex flex-col justify-center h-full">
            <div className="flex flex-col bg-white dark:bg-dark-aside max-w-full w-[650px] max-h-full rounded shadow-lg">
              <div className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
                <div className="flex items-center text-2xl font-semibold">
                  <NavLink
                    to={{
                      pathname: path,
                      search: search
                    }}
                    className="mr-2"
                  >
                    <ArrowSmallLeftIcon className="w-7" />
                  </NavLink>
                  {addMode ? 'Thêm mới bài viết' : 'Chỉnh sửa bài viết'}
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
                  <div className="font-medium">Tên bài viết</div>
                  <div className="mt-1">
                    <Controller
                      name="Title"
                      control={control}
                      render={({ field: { ref, ...field }, fieldState }) => (
                        <Input
                          placeholder="e.g Tên bài viết"
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
                  <div className="font-medium">Danh mục</div>
                  <div className="mt-1">
                    <Controller
                      name="Channels"
                      control={control}
                      render={({ field: { ref, ...field }, fieldState }) => (
                        <SelectPostsCategories
                          isMulti
                          isClearable
                          value={field.value}
                          onChange={val => {
                            field.onChange(val)
                          }}
                          className={clsx(
                            'select-control',
                            fieldState?.invalid && 'select-control-error'
                          )}
                          placeholder="Chọn danh mục"
                          noOptionsMessage={() => 'Chưa có danh mục.'}
                          errorMessageForce={fieldState?.invalid}
                          errorMessage={fieldState?.error?.message}
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
                  <div className="font-medium">Nội dung</div>
                  <div className="mt-1">
                    <Controller
                      name="Content"
                      control={control}
                      render={({ field: { ref, ...field }, fieldState }) => (
                        <CkEditor5
                          value={field.value}
                          onChange={val => field.onChange(val)}
                          placeholder="Nhập nội dung"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="mb-3.5">
                  <div className="font-medium">Ảnh đại diện</div>
                  <div className="mt-1">
                    <div className="grid grid-cols-5 gap-4">
                      <Controller
                        name="Thumbnail"
                        control={control}
                        render={({ field }) => (
                          <UploadFile
                            size="xs"
                            width="w-full"
                            height="h-full"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                      {fields &&
                        fields.map((image, index) => (
                          <div
                            className="relative p-2 border rounded group border-separator"
                            key={image.id}
                          >
                            <div
                              className="absolute z-10 flex items-center justify-center w-6 h-6 text-gray-700 transition bg-white rounded-full shadow-xl opacity-0 cursor-pointer dark:text-darkgray-800 dark:bg-graydark-200 -top-3 -right-3 hover:text-primary group-hover:opacity-100"
                              onClick={() => remove(index)}
                            >
                              <XMarkIcon className="w-4" />
                            </div>
                            <img
                              className="object-contain w-full rounded aspect-square"
                              src={toAbsolutePath(image.Src)}
                              alt=""
                            />
                          </div>
                        ))}
                      <div className="aspect-square">
                        <UploadFile
                          size="xs"
                          width="w-full"
                          height="h-full"
                          onChange={val => prepend({ Src: val })}
                          buttonText="Thêm ảnh khác"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-3.5">
                  <div className="font-medium">Ngày tạo</div>
                  <div className="mt-1">
                    <Controller
                      name="CreateDate"
                      control={control}
                      render={({ field: { ref, ...field }, fieldState }) => (
                        <InputDatePicker
                          placeholderText="Chọn ngày"
                          autoComplete="off"
                          onChange={field.onChange}
                          selected={field.value ? new Date(field.value) : null}
                          {...field}
                          dateFormat="HH:mm dd/MM/yyyy"
                        />
                      )}
                    />
                  </div>
                </div>
                {/* <div className="mb-3.5">
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
                </div> */}
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
                      loading={deleteMutation.isLoading}
                      disabled={deleteMutation.isLoading}
                      type="button"
                      className="relative flex items-center px-4 transition bg-white border border-gray-300 rounded text-danger h-11 focus:outline-none focus:shadow-none disabled:opacity-70 hover:border-danger"
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
                    {addMode ? 'Thêm mới' : 'Cập nhập'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </m.div>
      </form>
    </FormProvider>
  )
}

export default AddEdit
