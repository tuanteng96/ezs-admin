import React, { useState } from 'react'
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm
} from 'react-hook-form'
import FixedLayout from 'src/_ezs/layout/FixedLayout'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'
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
import { Button } from 'src/_ezs/partials/button'
import useEscape from 'src/_ezs/hooks/useEscape'
import { useMutation, useQuery } from '@tanstack/react-query'
import CalendarAPI from 'src/_ezs/api/calendar.api'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import { MemberOs } from '../../components/MemberOs'
import { isEqual } from 'lodash-es'
import { FeeSalary } from '../../components/FeeSalary'
import { OsSalaryMethod } from '../../components/OsSalaryMethod'
import { SEO } from 'src/_ezs/core/SEO'
import { OsPrint } from '../../components/OsPrint'
import moment from 'moment'
import 'moment/locale/vi'
import { useRoles } from 'src/_ezs/hooks/useRoles'

moment.locale('vi')

function AppointmentsOsAddEdit(props) {
  const { id } = useParams()
  const [isShowing, setIsShowing] = useState(false)
  const { state } = useLocation()
  const navigate = useNavigate()
  const [FeeAll, setFeeAll] = useState([])

  const { pos_mng } = useRoles(['pos_mng'])

  const methodsUseForm = useForm({
    defaultValues: state?.formState
      ? state?.formState
      : {
          ID: id,
          FeeUseds: [],
          Attachment: [],
          UserServices: [],
          Desc: '',
          IsMemberSet: '',
          AutoSalaryMethod: 1
        }
  })

  const { control, handleSubmit, watch, reset, setValue } = methodsUseForm

  const watchForm = watch()

  const { fields } = useFieldArray({
    control,
    name: 'UserServices'
  })

  useEscape(() => setIsShowing(false))

  const bookingCurrent = useQuery({
    queryKey: ['bookingOsID', { OrderServiceID: id }],
    queryFn: async () => {
      const { data } = await CalendarAPI.getBookingOsID({ OrderServiceID: id })
      return data
    },
    onSuccess: data => {
      if (data?.Service) {
        let { Service, OrderServiceID } = data
        setFeeAll(
          Service?.FeeAll
            ? Service?.FeeAll.map((x, idx) => ({
                ...x,
                value: x.RootID + idx,
                label: x.Title
              })).filter(x => x.Remain > 0)
            : []
        )
        if (!state?.formState) {
          reset({
            ID: OrderServiceID,
            StockItems: Service?.StockItems
              ? Service?.StockItems.map(x => ({ ...x, Qty: Math.abs(x.Qty) }))
              : [],
            FeeUseds: Service?.FeeUseds
              ? Service?.FeeUseds.map((x, idx) => ({
                  ...x,
                  label: x.Title,
                  value: x.RootID + idx
                }))
              : [],
            Attachment: Service?.Attachment
              ? Service?.Attachment.map(x => ({
                  Src: x.Src
                }))
              : [],
            UserServices: Service?.UserServices
              ? Service?.UserServices.map(x => ({
                  ...x,
                  label: x.UserName,
                  value: x.UserID
                }))
              : [],
            BookDate: Service.BookDate
              ? moment(Service.BookDate, 'YYYY-MM-DD').toDate()
              : moment().toDate(),
            Time: Service.BookDate
              ? moment(Service.BookDate, 'YYYY-MM-DD HH:mm').toDate()
              : moment()
                  .add(5 - (moment().minute() % 5), 'minutes')
                  .toDate(),
            StockID: Service.StockID,
            Desc: Service?.Desc || '',
            IsMemberSet: Service?.IsMemberSet,
            Status: Service?.Status || '',
            AutoSalaryMethod: Number(Service?.AutoSalaryMethod)
          })
        }
      } else {
        toast.warning('Không tìm thấy lịch đã đặt.')
        navigate(state?.previousPath || '/calendar')
      }
    }
  })

  const editBookOSMutation = useMutation({
    mutationFn: body => CalendarAPI.editBookingOS(body)
  })

  const deleteBookOSMutation = useMutation({
    mutationFn: body => CalendarAPI.deleteBookingOS(body)
  })

  const previewOSMutation = useMutation({
    mutationFn: body => CalendarAPI.getPreviewOsID(body)
  })

  const onSubmit = values => {
    const dataEdit = {
      sendNoti: true,
      Service: {
        ...values,
        ID: values.ID,
        BookDate:
          moment(values.BookDate).format('YYYY-MM-DD') +
          ' ' +
          moment(values.Time).format('HH:mm'),
        Desc: values.Desc,
        IsMemberSet: values.IsMemberSet,
        FeeUseds: values?.FeeUseds
          ? values?.FeeUseds.map(x => ({
              RootID: x.RootID,
              Title: x.Title,
              OrderItemID: x.OrderItemID,
              Qty: 1
            }))
          : [],
        Attachment: values?.Attachment
          ? values?.Attachment.map(x => ({ Src: x.Src }))
          : [],
        UserServices: values?.UserServices
          ? values?.UserServices.map(x => ({
              UserID: x.UserID,
              UserName: x.UserName,
              Salary: x.Salary,
              FeeSalary: x.FeeSalary
                ? x.FeeSalary.map(fee => ({
                    RootID: fee.RootID,
                    OrderItemID: fee.OrderItemID,
                    Value: fee.Value,
                    OrderServiceFeeID: fee.OrderServiceFeeID
                  }))
                : []
            }))
          : [],
        StockItems: values?.StockItems
          ? values?.StockItems.map(x => ({
              ProdID: x.ProdID,
              Qty: -Math.abs(x.Qty)
            }))
          : [],
        Status: values?.Status || ''
      }
    }

    let isDateBook = isEqual(
      [
        moment(
          bookingCurrent?.data?.Service?.BookDate,
          'YYYY-MM-DD HH:mm'
        ).format('DD-MM-YYYY HH:mm')
      ],
      [
        moment(values.BookDate).format('DD-MM-YYYY') +
          ' ' +
          moment(values.Time).format('HH:mm')
      ]
    )
    let isStockID = bookingCurrent?.data?.Service?.StockID === values.StockID
    let isUserServices = isEqual(
      bookingCurrent?.data?.Service?.UserServices.map(x => x.UserID),
      values?.UserServices?.map(x => x.UserID)
    )
    if (
      values?.Status !== 'done' &&
      isDateBook &&
      isStockID &&
      isUserServices
    ) {
      dataEdit.sendNoti = false
    }

    editBookOSMutation.mutate(dataEdit, {
      onSuccess: data => {
        bookingCurrent.refetch().then(() => {
          toast.success(
            values?.Status === 'done'
              ? 'Hoàn thành dịch vụ thành công.'
              : 'Chỉnh sửa lịch thành công.'
          )
        })
      },
      onError: error => {
        console.log(error)
      }
    })
  }

  const onPreviewUpdate = values => {
    const dataPreview = {
      AutoSalaryMethod: 0,
      Service: {
        ID: watchForm.ID,
        UserServices: values
          ? values.map(x => ({
              UserID: x.UserID,
              UserName: x.UserName,
              Salary: x.Salary,
              FeeSalary: x.FeeSalary
                ? x.FeeSalary.map(fee => ({
                    RootID: fee.RootID,
                    OrderItemID: fee.OrderItemID,
                    Value: fee.Value,
                    OrderServiceFeeID: fee.OrderServiceFeeID,
                    Title: fee.Title
                  }))
                : []
            }))
          : []
      }
    }
    previewOSMutation.mutate(dataPreview, {
      onSuccess: ({ data }) => {
        if (data.Service) {
          let newUserService = data.Service.UserServices.map(x => ({
            ...x,
            label: x.UserName,
            value: x.UserID,
            FeeSalary: x.FeeSalary
              ? x.FeeSalary.map(fee => ({
                  Title: fee.Title,
                  RootID: fee.RootID,
                  OrderItemID: fee.OrderItemID,
                  Value: fee.Value,
                  OrderServiceFeeID: fee.OrderServiceFeeID
                }))
              : []
          }))
          setValue('UserServices', newUserService)
        }
      },
      onError: err => console.log(err)
    })
  }

  const onDeleteBookOs = () => {
    var bodyFormData = new FormData()
    bodyFormData.append('cmd', 'cancel_service')
    bodyFormData.append('OrderServiceID', id)

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
        const { data } = await deleteBookOSMutation.mutateAsync(bodyFormData)
        return data
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(result => {
      if (result.isConfirmed) {
        toast.success('Hủy lịch thành công.')
        navigate(state?.previousPath || '/calendar')
      }
    })
  }

  const isModeChange =
    bookingCurrent?.data?.Service?.Status !== 'done' ||
    (bookingCurrent?.data?.Service?.Status === 'done' &&
      moment(bookingCurrent?.data?.Service?.BookDate, 'YYYY-MM-DD').format(
        'YYYY-MM-DD'
      ) === moment().format('YYYY-MM-DD'))

  return (
    <FixedLayout>
      <SEO title="Chỉnh sửa buổi dịch vụ" />
      <FormProvider {...methodsUseForm}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative flex flex-col h-full"
          autoComplete="off"
        >
          <div className="transition border-b z-[100] border-separator dark:border-dark-separator bg-white dark:bg-dark-aside">
            <div className="flex justify-center px-5 h-[85px] relative">
              <div className="flex items-center justify-center col-span-2 text-3xl font-extrabold transition dark:text-white">
                Chỉnh sửa buổi dịch vụ
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

                          {bookingCurrent?.data?.Service?.Status === 'done' && (
                            <div className="flex items-center px-3 py-2 border rounded border-separator dark:border-dark-separator">
                              <span className="font-semibold text-[#92929e] dark:text-gray-300">
                                Thực hiện xong <span className="pl-1.5">✔</span>
                              </span>
                            </div>
                          )}
                          {bookingCurrent?.data?.Service?.Status !== 'done' &&
                            bookingCurrent?.data?.Service?.UserServices &&
                            bookingCurrent?.data?.Service?.UserServices.length >
                              0 && (
                              <div className="px-3 py-2 rounded flex items-center border border-[#8950fc]">
                                <span className="absolute top-0 right-0 flex w-3 h-3 -mt-1 -mr-1">
                                  <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-[#8950fc]"></span>
                                  <span className="relative inline-flex w-3 h-3 border border-white rounded-full bg-[#8950fc]"></span>
                                </span>
                                <span className="font-semibold text-[#8950fc]">
                                  Đang thực hiện
                                </span>
                              </div>
                            )}
                        </div>

                        <div className="p-6 border border-gray-300 rounded-lg dark:border-graydark-400">
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
                                    dateFormat="HH:mm"
                                    timeFormat="HH:mm"
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
                          </div>

                          <div className="grid grid-cols-4 gap-5">
                            <div className="col-span-2">
                              <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
                                Nhân viên thực hiện
                              </div>
                              <Controller
                                name={`UserServices`}
                                rules={{
                                  required: true
                                }}
                                control={control}
                                render={({
                                  field: { ref, ...field },
                                  fieldState
                                }) => (
                                  <SelectUserService
                                    StockRoles={pos_mng.StockRoles}
                                    value={field.value}
                                    onChange={val => {
                                      let count = 0

                                      const newUserService = [...val].map(
                                        x => ({
                                          ...x,
                                          UserID: x.value,
                                          UserName: x.label,
                                          Salary: null,
                                          FeeSalary: [
                                            ...watchForm.FeeUseds
                                          ].map(fee => {
                                            if (!fee?.OrderServiceFeeIDs) {
                                              count = count - 1
                                            }
                                            return {
                                              ...fee,
                                              Value: '',
                                              OrderServiceFeeID:
                                                fee?.OrderServiceFeeIDs
                                                  ? fee?.OrderServiceFeeIDs[0]
                                                  : count
                                            }
                                          })
                                        })
                                      )
                                      setValue('UserServices', newUserService)
                                      onPreviewUpdate(newUserService)
                                    }}
                                    isMulti
                                    className={clsx(
                                      'select-control',
                                      fieldState?.invalid &&
                                        'select-control-error'
                                    )}
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
                                name={`FeeUseds`}
                                control={control}
                                render={({
                                  field: { ref, ...field },
                                  fieldState
                                }) => (
                                  <Select
                                    isMulti
                                    value={field.value}
                                    onChange={val => {
                                      field.onChange(val)
                                      let count = 0

                                      const newUserService = [
                                        ...watchForm.UserServices
                                      ].map(x => ({
                                        ...x,
                                        UserID: x.value,
                                        UserName: x.label,
                                        Salary: null,
                                        FeeSalary: [...val].map(fee => {
                                          if (!fee?.OrderServiceFeeIDs) {
                                            count = count - 1
                                          }
                                          return {
                                            ...fee,
                                            Value: '',
                                            OrderServiceFeeID:
                                              fee?.OrderServiceFeeIDs
                                                ? fee?.OrderServiceFeeIDs[0]
                                                : count
                                          }
                                        })
                                      }))
                                      setValue('UserServices', newUserService)
                                      onPreviewUpdate(newUserService)
                                    }}
                                    className="select-control"
                                    classNamePrefix="select"
                                    options={FeeAll}
                                    placeholder="Chọn phụ phí"
                                    noOptionsMessage={() => 'Không có phụ phí'}
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </li>
                    </ol>
                    {fields && fields.length > 0 && (
                      <div className="pl-8 mt-5">
                        <div className="mb-5 text-xl font-bold font-inter dark:text-white">
                          Lương ca nhân viên
                        </div>
                        <div
                          className={clsx(
                            'grid gap-4',
                            watchForm.FeeUseds.length > 0
                              ? 'grid-cols-1'
                              : `grid-cols-${
                                  watchForm.UserServices.length > 3
                                    ? 3
                                    : watchForm.UserServices.length
                                }`
                          )}
                        >
                          {fields.map((user, index) => (
                            <div
                              className={clsx(
                                'grid gap-4',
                                watchForm.FeeUseds.length > 0
                                  ? `grid-cols-${
                                      watchForm?.FeeUseds?.length < 3
                                        ? watchForm?.FeeUseds?.length + 1
                                        : 3
                                    } border-b border-separator pb-5 dark:border-dark-separator last:border-0 last:pb-0`
                                  : 'grid-cols-1'
                              )}
                              key={user.id}
                            >
                              <div>
                                <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
                                  {user.UserName || 'Chưa xác định'}
                                </div>
                                <div>
                                  <Controller
                                    name={`UserServices[${index}].Salary`}
                                    control={control}
                                    render={({
                                      field: { ref, ...field },
                                      fieldState
                                    }) => (
                                      <InputNumber
                                        loading={previewOSMutation.isLoading}
                                        disabled={previewOSMutation.isLoading}
                                        thousandSeparator={true}
                                        value={field.value}
                                        placeholder="Nhập lương ca"
                                        onValueChange={val =>
                                          field.onChange(val.floatValue || '')
                                        }
                                        allowNegative={false}
                                      />
                                    )}
                                  />
                                </div>
                              </div>
                              <FeeSalary nestIndex={index} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
                    <div className="flex items-center mt-4">
                      <Controller
                        name="IsMemberSet"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <Checkbox
                            labelClassName="text-gray-800 dark:text-graydark-800 font-semibold text-[15px] pl-3"
                            labelText="Khách hàng chọn nhân viên"
                            htmlFor="khong_ha_cap"
                            {...field}
                            checked={field.value}
                          />
                        )}
                      />
                      <div className="flex justify-end w-full">
                        <Controller
                          name="AutoSalaryMethod"
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <OsSalaryMethod
                              value={field.value}
                              onChange={val => field.onChange(val)}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={clsx(
                'w-[450px] flex flex-col dark:bg-dark-aside',
                isShowing && 'shadow-lg'
              )}
            >
              <MemberOs ServiceOs={bookingCurrent?.data?.Service || null} />
              {isModeChange && (
                <div className="flex p-5 border-t border-separator dark:border-dark-separator">
                  <Button
                    type="submit"
                    loading={editBookOSMutation.isLoading}
                    disabled={editBookOSMutation.isLoading}
                    hideText={
                      editBookOSMutation.isLoading &&
                      watchForm?.Status !== 'done'
                    }
                    className={clsx(
                      'relative flex items-center justify-center h-12 px-4 font-bold text-white transition rounded bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70',
                      bookingCurrent?.data?.Service?.Status === 'done' &&
                        'flex-1'
                    )}
                  >
                    Cập nhật
                  </Button>
                  <Button
                    disabled={editBookOSMutation.isLoading}
                    type="button"
                    onClick={onDeleteBookOs}
                    className="relative flex items-center justify-center h-12 px-4 ml-2 font-bold text-white transition rounded bg-danger hover:bg-dangerhv focus:outline-none focus:shadow-none disabled:opacity-70"
                  >
                    Hủy
                  </Button>
                  <OsPrint />
                  {bookingCurrent?.data?.Service?.Status !== 'done' && (
                    <Button
                      loading={
                        editBookOSMutation.isLoading &&
                        watchForm?.Status === 'done'
                      }
                      hideText={
                        editBookOSMutation.isLoading &&
                        watchForm?.Status === 'done'
                      }
                      disabled={editBookOSMutation.isLoading}
                      type="submit"
                      className="relative flex items-center justify-center flex-1 h-12 px-4 ml-2 font-bold text-white transition rounded bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
                      onClick={() => setValue('Status', 'done')}
                    >
                      Hoàn thành
                    </Button>
                  )}
                </div>
              )}
            </div>
            <LoadingComponentFull
              bgClassName="bg-white dark:bg-dark-aside z-[10]"
              loading={bookingCurrent.loading || !bookingCurrent.data}
            />
          </div>
        </form>
      </FormProvider>
    </FixedLayout>
  )
}

export default AppointmentsOsAddEdit
