import React, { Fragment, useEffect, useState } from 'react'
import {
  NavLink,
  useLocation,
  useMatch,
  useNavigate,
  useParams
} from 'react-router-dom'
import { m } from 'framer-motion'
import {
  ArrowSmallLeftIcon,
  FaceSmileIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Button } from 'src/_ezs/partials/button'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { Input } from 'src/_ezs/partials/forms'
import Select from 'react-select'
import {
  SelectMemberNotification,
  SelectUserNotification
} from 'src/_ezs/partials/select'
import { Switch } from '@headlessui/react'
import clsx from 'clsx'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import { RenderTypeLink } from '../../components'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import NotificationsAPI from 'src/_ezs/api/notifications.api'
import { toast } from 'react-toastify'

import PopverPickerEmoji from './PopverPickerEmoji'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import { CkEditor5 } from 'src/_ezs/partials/ckeditor'
import Thumbnail from './Thumbnail'
import moment from 'moment'
import { useLayout } from 'src/_ezs/layout/LayoutProvider'

const SelectTypeLink = ({ value, ...props }) => {
  const [data] = useState([
    {
      label: 'Tới danh mục tin tức',
      value: 'NEWS'
    },
    {
      label: 'Tới bài viết tin tức',
      value: 'NEWS_DETAIL'
    },
    {
      label: 'Tới sản phẩm, dịch vụ khuyến mại',
      value: 'SALE'
    },
    {
      label: 'Tới nhóm sản phẩm, dịch vụ',
      value: 'CATE_ID'
    },
    {
      label: 'Tới chi tiết sản phẩm, dịch vụ',
      value: 'PROD_ID'
    },
    {
      label: 'Tới chi tiết Media, Video',
      value: 'ADV_ID'
    },
    {
      label: 'Tới chi tiết dịch vụ gốc',
      value: 'SERVICE_ID'
    },
    {
      label: 'Tới danh sách Voucher',
      value: 'VOUCHER'
    },
    // {
    //   label: 'Tới dịch vụ gốc',
    //   value: 'CATE_SERVICE_ID'
    // },
    {
      label: 'Tới đặt lịch dịch vụ',
      value: 'BOOK_SERVICE'
    },
    {
      label: 'Tới form đăng ký ưu đãi',
      value: 'FORM_SALES'
    }
  ])

  return (
    <div>
      <Select
        isClearable
        className="select-control"
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={{
          menuPortal: base => ({
            ...base,
            zIndex: 9999
          })
        }}
        value={value ? data.filter(x => x.value === value) : ''}
        classNamePrefix="select"
        options={data}
        placeholder="Chọn loại Link"
        noOptionsMessage={() => 'Không có dữ liệu'}
        {...props}
      />
    </div>
  )
}

const schemaUsers = yup
  .object({
    Title: yup.string().required('Vui lòng nhập tiêu đề.'),
    ToMembers: yup.array().test(function (value) {
      const { ToUsers } = this.parent
      if (!ToUsers || ToUsers.length === 0) return value.length > 0
      return true
    }),
    ToUsers: yup.array().test(function (value) {
      const { ToMembers } = this.parent
      if (!ToMembers || ToMembers.length === 0) return value.length > 0
      return true
    })
  })
  .required()

class TextArea extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.props.onChange(event.target.value)
  }

  render() {
    return (
      <textarea
        className="w-full px-3.5 py-3 placeholder:font-normal font-medium text-gray-700 transition bg-white border rounded outline-none dark:bg-site-aside disabled:bg-gray-200 disabled:border-gray-200 dark:disabled:bg-graydark-200 dark:text-graydark-700 block border-gray-300 dark:border-graydark-400 focus:border-primary dark:focus:border-primary"
        id="text-area"
        rows="5"
        value={this.props.text}
        onChange={this.handleChange}
        onMouseUp={this.handleMouseUp}
      />
    )
  }
}

function AddEdit(props) {
  const { search } = useLocation()
  const isAddMode = useMatch('/notifications/danh-sach/them-moi')
  let { id } = useParams()

  const [isEditLink, setIsEditLink] = useState(true)
  const [isTemplate, setIsTemplate] = useState(true)

  const { GlobalConfig } = useLayout()

  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const methods = useForm({
    defaultValues: {
      ID: 0,
      ToMembers: [], //gui cho kh
      SetNotiDate: false,
      ToUserText: '',
      ToMemberText: '',
      Title: '',
      Content: '',
      IsSendEmail: false,
      IsWrapedEmail: false,
      TitleEmail: '',
      ContentEmail: '',
      ToUsers: [],
      NotiDate: null,
      CreateDate: '',
      Type: '',
      Result: '',
      UserID: 0,
      Params: '',
      IsSent: false,
      SentDate: '',
      InVoucherCampaignID: 0,
      NotiData: '',
      AudioSrc: '',
      SumInfo: '',
      Link: '',
      TypeLink: '',
      Thumbnail: '',
      Html: '',
      PathFrame: '',
      IsSchedule: false
    },
    resolver: yupResolver(schemaUsers)
  })

  const { control, handleSubmit, setValue, watch, reset, trigger } = methods

  const watchForm = watch()

  useEffect(() => {
    if (
      !isAddMode ||
      !GlobalConfig?.TemplatesNoti ||
      GlobalConfig?.TemplatesNoti.length === 0
    ) {
      setIsTemplate(false)
    }
  }, [isAddMode, GlobalConfig])

  const { isLoading } = useQuery({
    queryKey: ['NotificationID', id],
    queryFn: async () => {
      var bodyFormData = new FormData()
      bodyFormData.append('ids', id)

      const { data } = await NotificationsAPI.getId(bodyFormData)
      return data ? data.data[0] : null
    },
    onSuccess: data => {
      reset({
        ...data,
        ID: data.ID,
        NotiDate:
          data.IsSchedule && data.NotiDate ? new Date(data.NotiDate) : null,
        SetNotiDate: Boolean(data.NotiDate),
        ToMembers: data?.ToMemberText
          ? JSON.parse(data?.ToMemberText).map(x => ({
              ...x,
              label: x?.text === 'TAT_CA' ? 'Tất cả khách hàng' : x?.text,
              value: x?.id
            }))
          : [],
        ToUsers: data?.ToUserText
          ? JSON.parse(data?.ToUserText).map(x => ({
              ...x,
              label: x?.text === 'TAT_CA' ? 'Tất cả nhân viên' : x?.text,
              value: x?.id
            }))
          : []
      })
      data.Link && setIsEditLink(false)
    },
    enabled: !isAddMode
  })

  const updateMutation = useMutation({
    mutationFn: body => NotificationsAPI.send(body)
  })

  const onSubmit = values => {
    updateMutation.mutate(
      {
        noti: {
          ...values,
          ToMembers:
            values.ToMembers && values.ToMembers.length > 0
              ? values.ToMembers.map(x => x.value).toString()
              : '',
          ToUsers:
            values.ToUsers && values.ToUsers.length > 0
              ? values.ToUsers.map(x => x.value).toString()
              : '',
          NotiDate:
            values.IsSchedule && values.NotiDate
              ? moment(values.NotiDate).format('YYYY-MM-DD HH:mm')
              : null
        }
      },
      {
        onSuccess: data => {
          queryClient
            .invalidateQueries({ queryKey: ['ListNotifications'] })
            .then(() => {
              toast.success('Thực hiện thành công.')
              navigate({
                pathname: '/notifications/danh-sach',
                search: search
              })
            })
        }
      }
    )
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="fixed inset-0 flex items-center justify-center z-[1010]"
      >
        <m.div
          className="fixed inset-0 bg-black/[.2] dark:bg-black/[.4] z-[1010]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() =>
            navigate({
              pathname: '/notifications/danh-sach',
              search: search
            })
          }
        ></m.div>
        <m.div
          className="absolute flex flex-col justify-center h-5/6 max-w-full w-[550px] px-4 sm:px-0 z-[1011]"
          initial={{ opacity: 0, top: '60%' }}
          animate={{ opacity: 1, top: 'auto' }}
          exit={{ opacity: 0, top: '60%' }}
        >
          <div className="flex flex-col h-full bg-white rounded shadow-lg dark:bg-dark-aside">
            <div className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
              <div className="flex items-center text-2xl font-semibold">
                <div
                  onClick={() => {
                    if (isAddMode && !isTemplate) {
                      setIsTemplate(true)
                    } else {
                      navigate({
                        pathname: '/notifications/danh-sach',
                        search: search
                      })
                    }
                  }}
                  className="mr-2 cursor-pointer"
                >
                  <ArrowSmallLeftIcon className="w-7" />
                </div>
                {isAddMode ? 'Tạo mới tin nhắn' : 'Chỉnh sửa tin nhắn'}
              </div>
              <NavLink
                to={{
                  pathname: '/notifications/danh-sach',
                  search: search
                }}
                className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
              >
                <XMarkIcon className="w-8" />
              </NavLink>
            </div>
            {isTemplate && (
              <div className="relative p-5 overflow-auto grow">
                <div
                  className="flex items-center justify-center mb-5 text-white rounded cursor-pointer h-11 bg-success"
                  onClick={() => setIsTemplate(false)}
                >
                  <PlusIcon className="w-5 mr-2" />
                  <div className="text-sm">Tạo mới tin nhắn</div>
                </div>
                <div>
                  {GlobalConfig?.TemplatesNoti &&
                    GlobalConfig?.TemplatesNoti.map((group, i) => (
                      <div className="mb-5 last:mb-0" key={i}>
                        <div className="uppercase text-[13px] font-bold mb-2">
                          {group.Title}
                        </div>
                        <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
                          {group.Children &&
                            group.Children.map((item, index) => (
                              <div
                                className="cursor-pointer"
                                key={index}
                                onClick={() => {
                                  setValue('Title', item.Title)
                                  setValue('Content', item.Desc)
                                  setValue('Html', item.Html)
                                  setValue('Thumbnail', item.Thumbnail)
                                  setValue('PathFrame', item.PathFrame)
                                  setIsTemplate(false)
                                }}
                              >
                                <div>
                                  <img
                                    className="rounded-sm"
                                    src={item.Thumbnail}
                                    alt={item.Title}
                                  />
                                </div>
                                <div className="pt-2.5">
                                  <div className="mb-1 font-medium line-clamp-2">
                                    {item.Title}
                                  </div>
                                  <div className="text-sm font-light text-muted2 line-clamp-2">
                                    {item.Desc}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            {!isTemplate && (
              <>
                <div className="relative p-5 overflow-auto grow">
                  <LoadingComponentFull
                    bgClassName="bg-white dark:bg-dark-aside"
                    loading={!isAddMode && isLoading}
                  />
                  {((id && !isLoading) || !id) && (
                    <>
                      <div className="mb-3.5">
                        <div className="font-medium">Tiêu đề</div>
                        <div className="mt-1">
                          <Controller
                            name="Title"
                            control={control}
                            render={({
                              field: { ref, ...field },
                              fieldState
                            }) => (
                              <Input
                                placeholder="Nhập tiêu đề"
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
                        <div className="font-medium">Tóm tắt</div>
                        <div className="mt-1">
                          <Controller
                            name="Content"
                            control={control}
                            render={({
                              field: { ref, ...field },
                              fieldState
                            }) => (
                              <div className="relative">
                                <TextArea
                                  text={field.value}
                                  onChange={val => field.onChange(val)}
                                />
                                <PopverPickerEmoji
                                  value={field.value}
                                  trigger={
                                    <div className="absolute bottom-0 right-0 flex items-center justify-center w-12 h-12 cursor-pointer">
                                      <FaceSmileIcon className="w-6" />
                                    </div>
                                  }
                                  onChange={val => field.onChange(val)}
                                />
                              </div>
                            )}
                          />
                        </div>
                      </div>
                      <div className="mb-3.5">
                        <div className="font-medium">Chi tiết</div>
                        <div className="mt-1">
                          <Controller
                            name="Html"
                            control={control}
                            render={({
                              field: { ref, ...field },
                              fieldState
                            }) => (
                              <div className="relative">
                                <CkEditor5
                                  //className="ck-content"
                                  value={field.value}
                                  onChange={val => field.onChange(val)}
                                  placeholder="Nhập chi tiết"
                                  toolbar={[
                                    'undo',
                                    'redo',
                                    '|',
                                    'bold',
                                    'italic',
                                    'link',
                                    'bulletedList',
                                    'numberedList',
                                    'blockQuote',
                                    '|',
                                    'uploadImage',
                                    'mediaEmbed'
                                  ]}
                                />
                              </div>
                            )}
                          />
                        </div>
                      </div>
                      {isEditLink && (
                        <div className="mb-3.5">
                          <div className="font-medium">Loại Link</div>
                          <div className="mt-1">
                            <Controller
                              name="TypeLink"
                              control={control}
                              render={({
                                field: { ref, ...field },
                                fieldState
                              }) => (
                                <SelectTypeLink
                                  value={field.value}
                                  onChange={val => {
                                    field.onChange(val?.value || '')
                                    if (!val?.value) {
                                      setValue('Link', '')
                                    } else if (
                                      [
                                        'SALE',
                                        'VOUCHER',
                                        'FORM_SALES',
                                        'BOOKKING'
                                      ].includes(val.value)
                                    ) {
                                      if (val.value === 'SALE') {
                                        setValue('Link', '/shop/hot')
                                      }
                                      if (val.value === 'VOUCHER') {
                                        setValue('Link', '/voucher/')
                                      }
                                      if (val.value === 'FORM_SALES') {
                                        setValue('Link', '/pupup-contact/')
                                      }
                                      if (val.value === 'BOOKKING') {
                                        setValue('Link', '/schedule/')
                                      }
                                    } else {
                                      setValue('Link', '')
                                    }
                                  }}
                                />
                              )}
                            />
                            <RenderTypeLink />
                          </div>
                        </div>
                      )}
                      {!isEditLink && (
                        <div>
                          <div className="mb-3.5">
                            <div className="font-medium">Link</div>
                            <div className="relative mt-1">
                              <Controller
                                name="Link"
                                control={control}
                                render={({
                                  field: { ref, ...field },
                                  fieldState
                                }) => (
                                  <Input
                                    disabled
                                    placeholder="Link"
                                    autoComplete="off"
                                    type="text"
                                    errorMessageForce={fieldState?.invalid}
                                    errorMessage={fieldState?.error?.message}
                                    {...field}
                                  />
                                )}
                              />
                              <div
                                className="absolute top-0 right-0 flex items-center justify-center h-full px-4 text-sm font-medium cursor-pointer text-success"
                                onClick={() => setIsEditLink(true)}
                              >
                                Chỉnh sửa
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="mb-3.5">
                        <div className="font-medium">Hình ảnh</div>
                        <div className="mt-1">
                          <Controller
                            name="Thumbnail"
                            control={control}
                            render={({
                              field: { ref, ...field },
                              fieldState
                            }) => (
                              <Thumbnail
                                {...field}
                                PathFrame={watchForm.PathFrame}
                                ID={watchForm?.ID}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="mb-3.5">
                        <div className="font-medium">Khách hàng</div>
                        <div className="mt-1">
                          <Controller
                            name="ToMembers"
                            control={control}
                            render={({
                              field: { ref, ...field },
                              fieldState
                            }) => (
                              <SelectMemberNotification
                                isMulti
                                value={field.value}
                                onChange={val => {
                                  field.onChange(val)
                                  trigger('ToUsers')
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
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="mb-3.5">
                        <div className="font-medium">Nhân viên</div>
                        <div className="mt-1">
                          <Controller
                            name="ToUsers"
                            control={control}
                            render={({
                              field: { ref, ...field },
                              fieldState
                            }) => (
                              <>
                                <SelectUserNotification
                                  isMulti
                                  value={field.value}
                                  onChange={val => {
                                    field.onChange(val)
                                    trigger('ToMembers')
                                  }}
                                  className={clsx(
                                    'select-control',
                                    fieldState?.invalid &&
                                      'select-control-error'
                                  )}
                                  menuPosition="fixed"
                                  styles={{
                                    menuPortal: base => ({
                                      ...base,
                                      zIndex: 9999
                                    })
                                  }}
                                  menuPortalTarget={document.body}
                                  menuPlacement="top"
                                />
                              </>
                            )}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-[15px]">
                            Hẹn thời gian gửi
                          </div>
                          <Controller
                            name="IsSchedule"
                            control={control}
                            render={({ field }) => (
                              <Switch
                                checked={field.value}
                                onChange={val => {
                                  field.onChange(val)
                                  setValue('NotiDate', new Date())
                                }}
                                as={Fragment}
                              >
                                {({ checked }) => (
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
                                        checked
                                          ? 'translate-x-6'
                                          : 'translate-x-1'
                                      )}
                                    />
                                  </button>
                                )}
                              </Switch>
                            )}
                          />
                        </div>
                        {watchForm.IsSchedule && (
                          <div className="mt-3">
                            <Controller
                              name="NotiDate"
                              control={control}
                              render={({
                                field: { ref, ...field },
                                fieldState
                              }) => (
                                <InputDatePicker
                                  placeholderText="Chọn thời gian"
                                  autoComplete="off"
                                  onChange={field.onChange}
                                  dateFormat="HH:mm dd/MM/yyyy"
                                  selected={field.value ? field.value : null}
                                  showTimeSelect
                                  timeFormat="HH:mm"
                                  {...field}
                                />
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-end p-5 border-t border-separator dark:border-dark-separator">
                  <div className="flex">
                    <NavLink
                      to={{
                        pathname: '/notifications/danh-sach',
                        search: search
                      }}
                      type="button"
                      className="relative flex items-center px-4 transition border border-gray-300 rounded shadow-lg dark:border-gray-700 h-11 hover:border-gray-800 focus:outline-none focus:shadow-none"
                    >
                      Đóng
                    </NavLink>
                    {(!watchForm.ID || (watchForm.ID && !watchForm.IsSent)) && (
                      <Button
                        loading={updateMutation.isLoading}
                        disabled={updateMutation.isLoading}
                        type="submit"
                        className="relative flex items-center px-4 ml-2 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                      >
                        {watchForm.IsSchedule ? (
                          <>{watchForm.ID ? 'Cập nhật' : 'Đặt lịch gửi'}</>
                        ) : (
                          'Thực hiện gửi'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </m.div>
      </form>
    </FormProvider>
  )
}

export default AddEdit
