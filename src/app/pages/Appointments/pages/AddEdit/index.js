import React, { Fragment, useState } from 'react'
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm
} from 'react-hook-form'
import FixedLayout from 'src/_ezs/layout/FixedLayout'
import { useLocation, useMatch, useNavigate, useParams } from 'react-router-dom'
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import {
  Checkbox,
  InputDatePickerInline,
  InputTextarea
} from 'src/_ezs/partials/forms'
import { SelectProdService, SelectStocks } from 'src/_ezs/partials/select'
import { SelectUserService } from 'src/_ezs/partials/select/SelectUserService'
import { useAuth } from 'src/_ezs/core/Auth'
import { Button, ButtonAs } from 'src/_ezs/partials/button'
import { Listbox, Popover, Transition } from '@headlessui/react'
import useEscape from 'src/_ezs/hooks/useEscape'
import { MemberList } from '../../components/MemberList'
import { useMutation, useQuery } from '@tanstack/react-query'
import CalendarAPI from 'src/_ezs/api/calendar.api'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import useQueryParams from 'src/_ezs/hooks/useQueryParams'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import MembersAPI from 'src/_ezs/api/members.api'
import { SEO } from 'src/_ezs/core/SEO'
import { useRoles } from 'src/_ezs/hooks/useRoles'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

const ListStatus = [
  {
    value: 'CHUA_XAC_NHAN',
    label: 'Chưa xác nhận',
    className: 'text-warning'
  },
  {
    value: 'XAC_NHAN',
    label: 'Đã xác nhận',
    className: 'text-primary'
  },
  {
    value: 'KHACH_KHONG_DEN',
    label: 'Khách không đến',
    className: 'text-danger'
  },
  {
    value: 'KHACH_DEN',
    label: 'Khách đến',
    className: 'text-success'
  }
]

function AppointmentsAddEdit(props) {
  const { CrStocks } = useAuth()
  const { state } = useLocation()
  const navigate = useNavigate()
  const isAddMode = useMatch('/appointments/new')
  const { id } = useParams()
  const [BookStatus, setBookStatus] = useState(state?.formState?.Status || '')
  const [Key, setKey] = useState('')
  const [isShowing, setIsShowing] = useState(false)
  const queryString = useQueryParams()

  const { pos_mng } = useRoles(['pos_mng'])

  const methodsUseForm = useForm({
    defaultValues: state?.formState
      ? {
          FullName: '',
          Phone: '',
          IsAnonymous: false,
          ...state?.formState,
          booking: state?.formState?.booking || [
            {
              BookDate: queryString.date
                ? moment(queryString.date, 'DD-MM-YYYY').toDate()
                : new Date(),
              Time: moment(new Date()).endOf('hour').add(1, 'minutes').toDate(),
              Desc: '',
              IsAnonymous: false,
              MemberID: '',
              RootIdS: '',
              Status: 'XAC_NHAN',
              StockID: CrStocks.ID,
              UserServiceIDs: ''
            }
          ]
        }
      : {
          MemberIDs: '',
          AtHome: false,
          Desc: '',
          FullName: '',
          Phone: '',
          IsAnonymous: false,
          booking: [
            {
              BookDate: queryString.date
                ? moment(queryString.date, 'DD-MM-YYYY').toDate()
                : new Date(),
              Time: moment(new Date()).endOf('hour').add(1, 'minutes').toDate(),
              Desc: '',
              IsAnonymous: false,
              MemberID: '',
              RootIdS: '',
              Status: 'XAC_NHAN',
              StockID: CrStocks.ID,
              UserServiceIDs: ''
            }
          ]
        }
  })

  const { control, handleSubmit, watch, reset } = methodsUseForm

  const watchForm = watch()

  const { fields, remove } = useFieldArray({
    control,
    name: 'booking'
  })

  useEscape(() => setIsShowing(false))

  const bookingCurrent = useQuery({
    queryKey: ['bookingID', { BookIDs: id }],
    queryFn: () => CalendarAPI.getBookingID({ BookIDs: id }),
    onSuccess: ({ data }) => {
      if (data?.books?.length > 0) {
        let bookingItem = data?.books[0]
        reset({
          MemberIDs: bookingItem.Member,
          FullName: bookingItem?.FullName || '',
          Phone: bookingItem?.Phone || '',
          AtHome: bookingItem.AtHome,
          Desc: bookingItem.Desc,
          Status: bookingItem.Status,
          MemberPhone: bookingItem?.MemberPhone || null,
          booking: [
            {
              ID: bookingItem.ID,
              BookDate: bookingItem.BookDate
                ? new Date(bookingItem.BookDate)
                : new Date(),
              Time: bookingItem.BookDate
                ? new Date(bookingItem.BookDate)
                : moment(new Date()).endOf('hour').add(1, 'minutes').toDate(),
              Desc: '',
              IsAnonymous: false,
              MemberID: '',
              RootIdS:
                bookingItem.Roots && bookingItem.Roots.length > 0
                  ? bookingItem.Roots.map(x => ({
                      ...x,
                      label: x.Title,
                      value: x.ID
                    }))
                  : [],
              Status: bookingItem.Status,
              StockID: CrStocks.ID,
              UserServiceIDs:
                bookingItem.UserServices && bookingItem.UserServices.length > 0
                  ? bookingItem.UserServices.map(x => ({
                      ...x,
                      label: x.FullName,
                      value: x.ID
                    }))
                  : []
            }
          ]
        })
        setBookStatus(bookingItem.Status)
      } else {
        toast.warning('Không tìm thấy lịch đã đặt.')
        navigate(state?.previousPath || '/calendar')
      }
    },
    enabled: Boolean(id) && !(isAddMode || Boolean(state?.formState))
  })

  const onOpenShowing = () => {
    setIsShowing(true)
  }

  const addBookingMutation = useMutation({
    mutationFn: body => CalendarAPI.addBooking(body)
  })

  const addMemberMutation = useMutation({
    mutationFn: body => MembersAPI.memberAddFast(body)
  })

  const MemberCheckinMutation = useMutation({
    mutationFn: body => MembersAPI.memberOnCheckin(body)
  })

  const onSubmit = async values => {
    const dataAdd = {
      booking: values.booking.map(x => ({
        ...x,
        BookDate:
          moment(x.BookDate).format('YYYY-MM-DD') +
          ' ' +
          moment(x.Time).format('HH:mm'),
        MemberID: values.MemberIDs?.ID,
        RootIdS: x.RootIdS ? x.RootIdS.map(x => x.value).join(',') : '',
        UserServiceIDs: x.UserServiceIDs
          ? x.UserServiceIDs.map(o => o.value).join(',')
          : '',
        Status: values?.Status || x.Status,
        FullName: values?.FullName || '',
        Phone: values?.Phone || '',
        IsAnonymous: values?.IsAnonymous
      }))
    }
    try {
      if (
        values.Status === 'KHACH_DEN' &&
        values.MemberIDs.MobilePhone === '0000000000'
      ) {
        if (!values?.MemberPhone?.ID) {
          const MemberCreate = {
            member: {
              FullName: values?.FullName,
              MobilePhone: values?.Phone
            }
          }
          const dataMember = await addMemberMutation.mutateAsync(MemberCreate)
          if (dataMember?.data?.error) {
            toast.error(dataMember?.data?.error)
            return
          }
          dataAdd.booking[0].MemberID = dataMember.data.member.ID
        } else {
          dataAdd.booking[0].MemberID = values?.MemberPhone?.ID
        }
      }

      await addBookingMutation.mutateAsync(dataAdd)

      if (values.Status === 'KHACH_DEN') {
        var bodyFormData = new FormData()
        bodyFormData.append('cmd', 'checkin')
        bodyFormData.append('mid', dataAdd.booking[0].MemberID)

        await MemberCheckinMutation.mutateAsync(bodyFormData)
        navigate('/clients/' + dataAdd.booking[0].MemberID)
        toast.success('Xác nhận khách đến thành công.')
      } else {
        toast.success(
          isAddMode ? 'Đặt lịch thành công.' : 'Chỉnh sửa lịch thành công.'
        )
        navigate(state?.previousPath || '/calendar')
      }
    } catch (error) {
      toast.error(JSON.stringify(error))
    }
  }

  const onDeleteBook = () => {
    const dataDelete = {
      booking: watchForm.booking
        .map(x => ({
          ...x,
          BookDate:
            moment(x.BookDate).format('YYYY-MM-DD') +
            ' ' +
            moment(x.Time).format('HH:mm'),
          MemberID: watchForm.MemberIDs?.ID,
          RootIdS: x.RootIdS.map(x => x.value).join(','),
          UserServiceIDs: x.UserServiceIDs
            ? x.UserServiceIDs.map(o => o.value).join(',')
            : '',
          Status: 'TU_CHOI'
        }))
        .filter(x => x.RootIdS)
    }
    Swal.fire({
      customClass: {
        confirmButton: 'bg-success'
      },
      title: 'Xác nhận hủy ?',
      html: `Bạn chắc chắn muốn thực hiện hủy lịch này ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hủy lịch',
      cancelButtonText: 'Đóng',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const data = await addBookingMutation.mutateAsync(dataDelete)
        return data
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(result => {
      if (result.isConfirmed) {
        if (!result?.value?.data?.error) {
          toast.success('Hủy lịch thành công.')
          navigate(state?.previousPath || '/calendar')
        } else {
          toast.error('Xảy ra lỗi không xác định.')
        }
      }
    })
  }

  const BookingItem =
    bookingCurrent?.data?.data?.books &&
    bookingCurrent.data.data.books.length > 0
      ? bookingCurrent.data.data.books[0]
      : null

  return (
    <FixedLayout>
      <SEO title={isAddMode ? 'Đặt lịch mới' : 'Chỉnh sửa đặt lịch'} />
      <FormProvider {...methodsUseForm}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative flex flex-col h-full"
          autoComplete="off"
        >
          <div className="transition border-b z-[10] border-separator dark:border-dark-separator bg-white dark:bg-dark-aside">
            <div className="flex justify-center px-5 h-[85px] relative">
              <div className="flex items-center justify-center col-span-2 text-3xl font-extrabold transition dark:text-white">
                {isAddMode ? 'Đặt lịch mới' : 'Chỉnh sửa đặt lịch'}
              </div>
              <div className="absolute top-0 flex items-center justify-center h-full right-5">
                <div
                  className="flex items-center justify-center w-12 h-12 cursor-pointer dark:text-graydark-800"
                  onClick={() => navigate(state?.previousPath || '/calendar')}
                >
                  <XMarkIcon className="w-9" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex grow h-[calc(100%-85px)] relative">
            <div className="relative flex-1 border-r border-separator dark:border-dark-separator z-[10] dark:bg-dark-aside">
              <div className="h-full px-5 overflow-auto py-7 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded">
                <div className="max-w-[850px] m-auto">
                  <ol className="relative mb-5 border-l-2 border-gray-300 border-dashed dark:border-gray-700">
                    {fields.map((item, index) => (
                      <li
                        className="relative pb-10 pl-8 last:pb-0"
                        key={item.id}
                      >
                        <span
                          className={clsx(
                            "absolute ring-8 ring-white dark:ring-[#1e1e2d] bg-white dark:bg-dark-aside dark:text-white flex items-center justify-center w-7 h-7 font-bold text-[15px] border-2 border-primary text-primary rounded-full top-[100px] -left-[14px] before:w-[2px] before:absolute before:content-[''] before:bg-white dark:before:bg-dark-aside before:right-[12px] before:bottom-[calc(100%+2px)]",
                            index === 0 && 'before:h-[100px]'
                          )}
                        >
                          {index + 1}
                        </span>
                        <div className="flex items-center justify-between mb-5">
                          <Controller
                            name={`booking[${index}].BookDate`}
                            control={control}
                            render={({
                              field: { ref, ...field },
                              fieldState
                            }) => (
                              <>
                                <InputDatePickerInline
                                  className="flex items-center text-xl font-bold font-inter dark:text-white"
                                  iconClassName="w-5 transition ml-2"
                                  value={field.value}
                                  selected={field.value}
                                  onChange={(e, close) => {
                                    field.onChange(e)
                                    close()
                                  }}
                                />
                              </>
                            )}
                          />
                          {!isAddMode &&
                            ListStatus.filter(x => x.value === BookStatus)
                              .length > 0 && (
                              <Controller
                                name="Status"
                                control={control}
                                render={({
                                  field: { ref, ...field },
                                  fieldState
                                }) => (
                                  <Listbox
                                    value={
                                      field.value
                                        ? ListStatus.filter(
                                            x => x.value === field.value
                                          )[0]
                                        : null
                                    }
                                    onChange={val =>
                                      val?.value
                                        ? field.onChange(val?.value)
                                        : onDeleteBook()
                                    }
                                  >
                                    <div className="relative h-full">
                                      <div className="flex items-center justify-center h-full">
                                        <Listbox.Button
                                          type="button"
                                          className={clsx(
                                            'flex items-center justify-between w-full h-10 px-4 font-bold bg-white rounded  dark:bg-dark-light dark:border-dark-separator',
                                            field.value &&
                                              ListStatus.filter(
                                                x => x.value === field.value
                                              )[0].className
                                          )}
                                        >
                                          <span className="block text-left truncate">
                                            {field.value
                                              ? ListStatus.filter(
                                                  x => x.value === field.value
                                                )[0].label
                                              : 'Chưa xác định'}
                                          </span>
                                          <ChevronDownIcon className="w-4 mt-1 ml-2" />
                                        </Listbox.Button>
                                      </div>
                                      <Transition
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                      >
                                        <Listbox.Options className="z-[1001] rounded px-0 py-2 border-0 w-[225px] bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow absolute top-full">
                                          {ListStatus.filter(x =>
                                            field.value !== 'CHUA_XAC_NHAN'
                                              ? x.value !== 'CHUA_XAC_NHAN'
                                              : x.label
                                          ).map((item, index) => (
                                            <Listbox.Option
                                              key={index}
                                              value={item}
                                            >
                                              {({ selected }) => (
                                                <div
                                                  className={clsx(
                                                    'flex items-center px-5 py-3 text-sm hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-dark-gray font-semibold',
                                                    selected &&
                                                      'bg-[#F4F6FA] dark:bg-dark-light',
                                                    item.className
                                                  )}
                                                  key={index}
                                                >
                                                  <div className="flex-1 truncate">
                                                    {item?.label}
                                                  </div>
                                                  {selected && (
                                                    <div className="flex justify-end w-8">
                                                      <CheckIcon className="w-4 text-current" />
                                                    </div>
                                                  )}
                                                </div>
                                              )}
                                            </Listbox.Option>
                                          ))}
                                        </Listbox.Options>
                                      </Transition>
                                    </div>
                                  </Listbox>
                                )}
                              />
                            )}
                          {fields.length > 1 && (
                            <div
                              className="flex items-center justify-center w-8 h-8 text-gray-900 transition rounded-full cursor-pointer bg-light hover:bg-dangerlight hover:text-danger"
                              onClick={() => remove(index)}
                            >
                              <XMarkIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="p-6 border border-gray-300 rounded-lg dark:border-graydark-400">
                          <div className="grid grid-cols-4 gap-5">
                            <div className="col-span-2">
                              <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
                                Thời gian
                              </div>
                              <Controller
                                name={`booking[${index}].Time`}
                                control={control}
                                render={({
                                  field: { ref, ...field },
                                  fieldState
                                }) => (
                                  <InputDatePicker
                                    selected={field.value}
                                    onChange={field.onChange}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    dateFormat="HH:mm"
                                    timeFormat="HH:mm"
                                  />
                                )}
                              />
                            </div>
                            <div className="col-span-2">
                              <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
                                Cơ sở
                              </div>
                              <Controller
                                name={`booking[${index}].StockID`}
                                control={control}
                                render={({
                                  field: { ref, ...field },
                                  fieldState
                                }) => (
                                  <SelectStocks
                                    StockRoles={pos_mng.StockRoles}
                                    value={field.value}
                                    onChange={val =>
                                      field.onChange(val?.value || '')
                                    }
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
                            <div className="col-span-2">
                              <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
                                Dịch vụ
                              </div>
                              <Controller
                                // rules={{
                                //   required:
                                //     fields.length > 1
                                //       ? index < fields.length - 1
                                //       : true
                                // }}
                                name={`booking[${index}].RootIdS`}
                                control={control}
                                render={({
                                  field: { ref, ...field },
                                  fieldState
                                }) => (
                                  <SelectProdService
                                    isMulti
                                    StockID={watch(`booking[${index}].StockID`)}
                                    name={field.name}
                                    className={clsx(
                                      'select-control',
                                      fieldState.invalid &&
                                        'select-control-error'
                                    )}
                                    value={field.value}
                                    onChange={val => {
                                      field.onChange(val)
                                      // let isPush = watch(
                                      //   `booking[${index + 1}].RootIdS`
                                      // )
                                      // if (typeof isPush === 'undefined') {
                                      //   append({
                                      //     BookDate: new Date(),
                                      //     Time: moment(new Date())
                                      //       .endOf('hour')
                                      //       .add(1, 'minutes')
                                      //       .toDate(),
                                      //     Desc: '',
                                      //     IsAnonymous: false,
                                      //     MemberID: '',
                                      //     RootIdS: '',
                                      //     Status: 'XAC_NHAN',
                                      //     StockID: CrStocks.ID,
                                      //     UserServiceIDs: ''
                                      //   })
                                      // }
                                    }}
                                  />
                                )}
                              />
                            </div>
                            <div className="col-span-2">
                              <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
                                Nhân viên thực hiện
                              </div>
                              <Controller
                                name={`booking[${index}].UserServiceIDs`}
                                control={control}
                                render={({
                                  field: { ref, ...field },
                                  fieldState
                                }) => (
                                  <SelectUserService
                                    StockRoles={pos_mng.StockRoles}
                                    value={field.value}
                                    onChange={val => field.onChange(val)}
                                    isMulti
                                    className="select-control"
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
                        </div>
                      </li>
                    ))}
                  </ol>
                  {(state?.formState?.ID > 0 || BookingItem?.ID > 0) && (
                    <div className="grid grid-cols-2 gap-4 pl-8 mb-5">
                      <div className="flex">
                        <div>Nhân viên tạo</div>
                        <div className="pl-1.5 font-bold">
                          {state?.formState?.UserName ||
                            BookingItem?.UserName ||
                            'Đặt lịch Online'}
                        </div>
                      </div>
                      <div className="flex">
                        <div>Đặt lịch thành công</div>
                        <div className="pl-1.5 font-bold font-inter">
                          {state?.formState?.BookCount?.Done ||
                            BookingItem?.BookCount?.Done ||
                            0}
                          <span className="px-1">/</span>
                          {state?.formState?.BookCount?.Total ||
                            BookingItem?.BookCount?.Total ||
                            0}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="pl-8">
                    <div>
                      <div className="mb-1.5 text-base text-gray-900 font-inter dark:text-graydark-800">
                        Ghi chú đặt lịch
                      </div>
                      <Controller
                        name="Desc"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <InputTextarea
                            className="resize-none"
                            rows={3}
                            placeholder="Nhập ghi chú"
                            autoComplete="off"
                            type="text"
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <div className="mt-4">
                      <Controller
                        name="AtHome"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <Checkbox
                            labelClassName="text-gray-800 dark:text-graydark-800 font-semibold text-[15px] pl-3"
                            labelText="Thực hiện các dịch vụ của khách hàng tại nhà."
                            htmlFor="khong_ha_cap"
                            {...field}
                            checked={field.value}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Transition
                show={isShowing}
                enter="transition-opacity duration-75"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div
                  className="absolute top-0 left-0 w-full h-full bg-black/[.2] dark:bg-black/[.4] flex items-center justify-center cursor-pointer group"
                  onClick={() => setIsShowing(false)}
                >
                  <div className="flex flex-col items-center transition opacity-0 group-hover:opacity-100">
                    <div className="flex flex-col items-center justify-center bg-white rounded-full w-14 h-14">
                      <XMarkIcon className="w-5" />
                      <span className="text-sm font-bold">ESC</span>
                    </div>
                    <div className="mt-3 text-sm font-bold text-white uppercase">
                      Bấm để đóng
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
            <div
              className={clsx(
                'w-[450px] flex flex-col dark:bg-dark-aside',
                isShowing && 'shadow-lg'
              )}
            >
              <Controller
                name="MemberIDs"
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <MemberList
                    value={field.value}
                    onChange={e => {
                      field.onChange(e)
                      setIsShowing(false)
                    }}
                    onOpen={onOpenShowing}
                    valueKey={Key}
                    onChangeKey={e => setKey(e)}
                    isShowing={isShowing}
                  />
                )}
              />
              {!isShowing && (
                <div
                  className={clsx(
                    'p-5 border-t border-separator dark:border-dark-separator'
                  )}
                >
                  {isAddMode ? (
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() =>
                          navigate(state?.previousPath || '/calendar')
                        }
                        type="button"
                        className="relative flex items-center justify-center w-full h-12 px-4 font-bold text-black transition border border-gray-400 rounded dark:text-white hover:border-gray-900 dark:hover:border-white focus:outline-none focus:shadow-none disabled:opacity-70"
                      >
                        Hủy
                      </button>
                      <Button
                        loading={addBookingMutation.isLoading}
                        disabled={addBookingMutation.isLoading}
                        type="submit"
                        className="relative flex items-center justify-center h-12 px-4 font-semibold text-white transition rounded bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
                      >
                        Đặt lịch ngay
                      </Button>
                    </div>
                  ) : (
                    <Controller
                      name="Status"
                      control={control}
                      render={({ field: { ref, ...field }, fieldState }) => (
                        <>
                          {BookStatus === 'CHUA_XAC_NHAN' ? (
                            <div className="grid grid-cols-2 gap-4">
                              <Button
                                loading={
                                  field.value === 'XAC_NHAN' &&
                                  addBookingMutation.isLoading
                                }
                                disabled={
                                  addBookingMutation.isLoading ||
                                  addMemberMutation.isLoading ||
                                  MemberCheckinMutation.isLoading
                                }
                                className="relative flex items-center justify-center h-12 px-4 font-semibold text-white transition rounded bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70"
                                onClick={() => {
                                  field.onChange('XAC_NHAN')
                                }}
                              >
                                Xác nhận
                              </Button>
                              <Button
                                disabled={
                                  addBookingMutation.isLoading ||
                                  addMemberMutation.isLoading ||
                                  MemberCheckinMutation.isLoading
                                }
                                type="button"
                                className="relative flex items-center justify-center h-12 px-4 font-semibold text-white transition rounded bg-danger hover:bg-danger focus:outline-none focus:shadow-none disabled:opacity-70"
                                onClick={onDeleteBook}
                              >
                                Hủy
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-between">
                              <div className="flex">
                                <Button
                                  loading={
                                    field.value === 'XAC_NHAN' &&
                                    addBookingMutation.isLoading
                                  }
                                  disabled={
                                    addBookingMutation.isLoading ||
                                    addMemberMutation.isLoading ||
                                    MemberCheckinMutation.isLoading
                                  }
                                  type="submit"
                                  className="relative flex items-center justify-center h-12 px-4 font-semibold text-white transition rounded bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70"
                                >
                                  Cập nhật
                                </Button>
                                <Popover className="relative">
                                  <Popover.Button
                                    as={ButtonAs}
                                    className="relative flex items-center justify-center h-12 px-4 ml-2 font-semibold text-white transition rounded bg-danger hover:bg-danger focus:outline-none focus:shadow-none disabled:opacity-70"
                                    loading={
                                      field.value === 'KHACH_KHONG_DEN' &&
                                      addBookingMutation.isLoading
                                    }
                                    disabled={
                                      addBookingMutation.isLoading ||
                                      addMemberMutation.isLoading ||
                                      MemberCheckinMutation.isLoading
                                    }
                                  >
                                    Hủy
                                    <ChevronUpIcon className="w-3.5 ml-2" />
                                  </Popover.Button>

                                  <Popover.Panel className="z-[1001] rounded px-0 py-2 border-0 w-[200px] bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow absolute bottom-full">
                                    <button
                                      type="submit"
                                      onClick={() => {
                                        field.onChange('KHACH_KHONG_DEN')
                                      }}
                                      className={clsx(
                                        'flex items-center px-5 py-3 text-[15px] hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-dark-gray font-medium border-b border-separator w-full'
                                      )}
                                    >
                                      Khách không đến
                                    </button>
                                    <div
                                      className={clsx(
                                        'flex items-center px-5 py-3 text-[15px] hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-dark-gray font-medium'
                                      )}
                                      onClick={onDeleteBook}
                                    >
                                      Hủy lịch
                                    </div>
                                  </Popover.Panel>
                                </Popover>
                              </div>
                              <Button
                                loading={
                                  (field.value === 'KHACH_DEN' &&
                                    addBookingMutation.isLoading) ||
                                  (field.value === 'KHACH_DEN' &&
                                    addMemberMutation.isLoading) ||
                                  (field.value === 'KHACH_DEN' &&
                                    MemberCheckinMutation.isLoading)
                                }
                                disabled={
                                  addBookingMutation.isLoading ||
                                  addMemberMutation.isLoading ||
                                  MemberCheckinMutation.isLoading ||
                                  watchForm.Status === 'KHACH_KHONG_DEN'
                                }
                                type="submit"
                                className="relative flex items-center justify-center flex-1 h-12 px-4 ml-2 text-sm font-bold text-white uppercase transition rounded bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
                                onClick={() => {
                                  field.onChange('KHACH_DEN')
                                }}
                              >
                                Check In
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    />
                  )}
                </div>
              )}
            </div>
            <LoadingComponentFull
              bgClassName="bg-white dark:bg-dark-aside z-[10]"
              loading={bookingCurrent.loading}
            />
          </div>
        </form>
      </FormProvider>
    </FixedLayout>
  )
}

export default AppointmentsAddEdit
