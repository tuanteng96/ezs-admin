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
  ChevronUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import {
  Checkbox,
  InputDatePickerInline,
  InputNumber,
  InputTextarea
} from 'src/_ezs/partials/forms'
import { SelectStocks } from 'src/_ezs/partials/select'
import Select from 'react-select'
import { SelectUserService } from 'src/_ezs/partials/select/SelectUserService'
import { useAuth } from 'src/_ezs/core/Auth'
import { Button } from 'src/_ezs/partials/button'
import { Listbox, Transition } from '@headlessui/react'
import useEscape from 'src/_ezs/hooks/useEscape'
import { MemberList } from '../../components/MemberList'
import { useMutation, useQuery } from '@tanstack/react-query'
import CalendarAPI from 'src/_ezs/api/calendar.api'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import useQueryParams from 'src/_ezs/hooks/useQueryParams'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'

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
    label: 'Hoàn thành',
    className: 'text-success'
  },
  {
    value: '',
    label: 'Hủy lịch',
    className: 'text-danger'
  }
]

function AppointmentsOsAddEdit(props) {
  const { CrStocks } = useAuth()
  const isAddMode = useMatch('/appointments/new')
  const { id } = useParams()
  const [Key, setKey] = useState('')
  const [isShowing, setIsShowing] = useState(false)
  const { state } = useLocation()
  const navigate = useNavigate()
  const queryString = useQueryParams()

  const methodsUseForm = useForm({
    defaultValues: {
      ID: id,
      FeeUseds: [],
      _Attachment: [],
      UserServices: [],
      MemberIDs: null
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
    queryKey: ['bookingOsID', { OrderServiceID: id }],
    queryFn: () => CalendarAPI.getBookingOsID({ OrderServiceID: id }),
    onSuccess: ({ data }) => {
      if (data.Service) {
        let { Service, OrderServiceID } = data
        console.log(Service)
        reset({
          ID: OrderServiceID,
          FeeUseds: [],
          _Attachment: [],
          UserServices: [],
          MemberIDs: Service?.Member,
          BookDate: Service.BookDate
            ? moment(Service.BookDate, 'YYYY-MM-DD').toDate()
            : moment().toDate(),
          Time: Service.BookDate
            ? moment(Service.BookDate, 'YYYY-MM-DD HH:mm').toDate()
            : moment()
                .add(5 - (moment().minute() % 5), 'minutes')
                .toDate(),
          StockID: Service.StockID
        })
      } else {
        toast.warning('Không tìm thấy lịch đã đặt.')
        navigate(state?.previousPath || '/calendar')
      }
    }
  })

  const onOpenShowing = () => {
    setIsShowing(true)
  }

  const addBookingMutation = useMutation({
    mutationFn: body => CalendarAPI.addBooking(body)
  })

  const onSubmit = values => {
    const dataAdd = {
      booking: values.booking
        .map(x => ({
          ...x,
          BookDate:
            moment(x.BookDate).format('YYYY-MM-DD') +
            ' ' +
            moment(x.Time).format('HH:mm'),
          MemberID: values.MemberIDs?.ID,
          RootIdS: x.RootIdS.map(x => x.value).join(','),
          UserServiceIDs: x.UserServiceIDs
            ? x.UserServiceIDs.map(o => o.value).join(',')
            : '',
          Status: values?.Status || x.Status
        }))
        .filter(x => x.RootIdS)
    }
    addBookingMutation.mutate(dataAdd, {
      onSuccess: data => {
        toast.success(
          isAddMode ? 'Đặt lịch thành công.' : 'Chỉnh sửa lịch thành công.'
        )
        navigate(state?.previousPath || '/calendar')
      },
      onError: error => {
        console.log(error)
      }
    })
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

  return (
    <FixedLayout>
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
                  <div className="mb-10">
                    <ol className="relative border-l-2 border-gray-300 border-dashed dark:border-gray-700">
                      <li className="relative pb-10 pl-8 last:pb-0">
                        <span
                          className={clsx(
                            "absolute ring-8 ring-white dark:ring-[#1e1e2d] bg-white dark:bg-dark-aside dark:text-white flex items-center justify-center w-7 h-7 font-bold text-[15px] border-2 border-primary text-primary rounded-full top-[100px] -left-[14px] before:w-[2px] before:absolute before:content-[''] before:bg-white dark:before:bg-dark-aside before:right-[12px] before:bottom-[calc(100%+2px)] before:h-[100px]"
                          )}
                        >
                          1
                        </span>
                        <div className="flex items-center justify-between mb-5">
                          <Controller
                            name={`BookDate`}
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
                                  placeholderText="Chọn ngày"
                                  onChange={(e, close) => {
                                    field.onChange(e)
                                    close()
                                  }}
                                />
                              </>
                            )}
                          />
                        </div>

                        <div className="border border-gray-300 rounded-lg dark:border-graydark-400 p-6">
                          <div className="grid grid-cols-4 gap-5 mb-5">
                            <div className="col-span-2">
                              <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
                                Thời gian
                              </div>
                              <Controller
                                name={`Time`}
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
                                    dateFormat="HH:mm aa"
                                    timeFormat="HH:mm aa"
                                    placeholderText="Chọn thời gian"
                                  />
                                )}
                              />
                            </div>
                            <div className="col-span-2">
                              <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
                                Cơ sở
                              </div>
                              <Controller
                                name={`StockID`}
                                control={control}
                                render={({
                                  field: { ref, ...field },
                                  fieldState
                                }) => (
                                  <SelectStocks
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
                          </div>
                          <div className="grid grid-cols-4 gap-5">
                            <div className="col-span-2">
                              <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
                                Nhân viên thực hiện
                              </div>
                              <Controller
                                name={`UserServiceIDs`}
                                control={control}
                                render={({
                                  field: { ref, ...field },
                                  fieldState
                                }) => (
                                  <SelectUserService
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
                            <div className="col-span-2">
                              <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
                                Phụ phí
                              </div>
                              <Controller
                                name={`RootIdS`}
                                control={control}
                                render={({
                                  field: { ref, ...field },
                                  fieldState
                                }) => (
                                  <Select
                                    value={null}
                                    className="select-control"
                                    classNamePrefix="select"
                                    options={[]}
                                    placeholder="Chọn phụ phí"
                                    noOptionsMessage={() => 'Không có phụ phí'}
                                    {...props}
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </li>
                    </ol>
                  </div>
                  <div className="pl-8">
                    <div>
                      <div className="mb-1.5 text-base text-gray-900 font-inter font-semibold dark:text-graydark-800">
                        Ghi chú
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
                            labelText="Khách hàng chọn nhân viên."
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
                render={({ field: { ref, ...field }, fieldState }) => (
                  <MemberList
                    value={field.value}
                    onOpen={onOpenShowing}
                    valueKey={Key}
                    onChangeKey={e => setKey(e)}
                    isShowing={isShowing}
                  />
                )}
              />
              {!isShowing && (
                <div className="grid grid-cols-2 gap-4 p-5 border-t border-separator dark:border-dark-separator">
                  {isAddMode ? (
                    <button
                      onClick={() =>
                        navigate(state?.previousPath || '/calendar')
                      }
                      type="button"
                      className="relative flex items-center justify-center w-full h-12 px-4 font-bold text-black transition border border-gray-400 rounded dark:text-white hover:border-gray-900 dark:hover:border-white focus:outline-none focus:shadow-none disabled:opacity-70"
                    >
                      Hủy
                    </button>
                  ) : (
                    <Controller
                      name="Status"
                      control={control}
                      render={({ field: { ref, ...field }, fieldState }) => (
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
                                className="flex items-center justify-between w-full h-12 px-4 font-bold text-gray-900 bg-white border rounded border-light dark:bg-dark-light dark:border-dark-separator dark:text-graydark-800 hover:text-primary dark:hover:text-primary"
                              >
                                <span
                                  className={clsx(
                                    'block text-left truncate',
                                    field.value &&
                                      ListStatus.filter(
                                        x => x.value === field.value
                                      )[0].className
                                  )}
                                >
                                  {field.value
                                    ? ListStatus.filter(
                                        x => x.value === field.value
                                      )[0].label
                                    : 'Chưa xác định'}
                                </span>
                                <ChevronUpIcon className="w-3.5 ml-2" />
                              </Listbox.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="z-[1001] rounded px-0 py-2 border-0 max-w-[200px] w-full bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow absolute bottom-full">
                                {ListStatus.filter(x =>
                                  field.value !== 'CHUA_XAC_NHAN'
                                    ? x.value !== 'CHUA_XAC_NHAN'
                                    : x.label
                                ).map((item, index) => (
                                  <Listbox.Option key={index} value={item}>
                                    {({ selected }) => (
                                      <div
                                        className={clsx(
                                          'flex items-center px-5 py-3 text-[15px] hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-dark-gray font-semibold',
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

                  <Button
                    loading={addBookingMutation.isLoading}
                    disabled={addBookingMutation.isLoading}
                    type="submit"
                    className="relative flex items-center justify-center w-full h-12 px-4 font-bold text-white transition rounded bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
                  >
                    {isAddMode ? 'Đặt lịch ngay' : 'Lưu thay đổi'}
                  </Button>
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

export default AppointmentsOsAddEdit
