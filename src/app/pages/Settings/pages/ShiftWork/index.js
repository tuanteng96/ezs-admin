import React, { memo, useEffect, useRef, useState } from 'react'
import { Button } from 'src/_ezs/partials/button'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { registerLocale } from 'react-datepicker'
import Select from 'react-select'
import vi from 'date-fns/locale/vi'
import {
  CalendarDaysIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useMutation, useQuery } from '@tanstack/react-query'
import SettingsAPI from 'src/_ezs/api/settings.api'
import moment from 'moment'
import UsersAPI from 'src/_ezs/api/users.api'
import { useAuth } from 'src/_ezs/core/Auth'
import { SelectUserShifts2 } from 'src/_ezs/partials/select'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import { useRoles } from 'src/_ezs/hooks/useRoles'
import Swal from 'sweetalert2'
registerLocale('vi', vi)

let Options = [
  { label: 'Đang xây dựng', value: '1' },
  { label: 'Chờ duyệt', value: '2' },
  { label: 'Đã duyệt', value: '3' }
]

function getDaysOfMonthFromDate(dateObj) {
  const date = moment(dateObj)

  // Xác định ngày đầu và cuối tháng
  const startOfMonth = date.clone().startOf('month')
  const endOfMonth = date.clone().endOf('month')

  const days = []
  let day = startOfMonth.clone()

  while (day.isSameOrBefore(endOfMonth)) {
    days.push({
      Date: day.toDate(),
      WorkShiftType: null
    }) // Format theo DD-MM-YYYY
    day.add(1, 'day')
  }

  return days
}

const EmployeeRow = memo(({ field, control, index, remove }) => {
  return (
    <tr>
      <td className="sticky left-0 px-4 py-4 text-sm z-[999] font-medium bg-white max-w-[230px] min-w-[230px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0">
        <div>{field.UserName}</div>

        {field.isDelete && (
          <>
            <div className="mt-1 text-[13px] font-light text-warning flex gap-2">
              <ExclamationTriangleIcon className="w-5" />
              Đã xoá hoặc chuyển cơ sở
            </div>
            <div
              className="text-danger text-[12px] mt-1 cursor-pointer"
              onClick={() => remove(index)}
            >
              [Loại bỏ]
            </div>
          </>
        )}
      </td>
      {field.Dates.map((date, i) => (
        <td
          className="px-4 py-4 text-sm text-gray-700 min-w-[300px] max-w-[300px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0"
          key={i}
        >
          <Controller
            control={control}
            name={`Data.Users[${index}].Dates[${i}].WorkShiftType`}
            render={({ field: f }) => (
              <SelectUserShifts2
                isMulti
                isClearable
                value={f.value}
                onChange={val => f.onChange(val)}
                className="select-control"
                menuPosition="fixed"
                menuPortalTarget={document.body}
                placeholder="Chọn loại ca"
              />
            )}
          />
        </td>
      ))}
    </tr>
  )
})

function ShiftWork(props) {
  const { CrStocks } = useAuth()
  const containerRef = useRef(null)

  let [filters, setFilters] = useState({
    Mon: moment().toDate()
  })

  const { cong_ca } = useRoles(['cong_ca'])

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      ID: 0,
      Data: {
        Users: Array(5)
          .fill()
          .map(x => ({
            Dates: getDaysOfMonthFromDate(filters.Mon),
            UserID: '',
            UserName: '',
            StockID: ''
          }))
      },
      Status: 1,
      Desc: '',
      Title: '',
      CreateDate: '', //2025-09-18
      Mon: '',
      StockID: CrStocks?.ID
    }
  })

  const { fields, remove } = useFieldArray({
    control,
    name: 'Data.Users'
  })

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth' // mượt mà
    })
  }, [containerRef, filters.Mon, CrStocks])

  const { isLoading, refetch, data } = useQuery({
    queryKey: ['ShiftWork', { Mon: filters.Mon, CrStocks }],
    queryFn: async () => {
      const data = await SettingsAPI.getRoster({
        pi: 1,
        filter: {
          Status: '',
          Mon: moment(filters.Mon).format('YYYY-MM'),
          StockID: CrStocks?.ID
        }
      })
      const { data: Users } = await UsersAPI.listFull({ StockID: CrStocks?.ID })

      return {
        data: data?.data?.items.length > 0 ? data?.data?.items[0] : null,
        Users: Users?.data || []
      }
    },
    onSuccess: ({ data, Users }) => {
      if (data) {
        let newUser = [...(data?.Data?.Users || [])]
        for (let user of Users) {
          let index = newUser.findIndex(x => user.id === x.UserID)
          if (index > -1) {
            newUser[index].UserName = user.text
          } else {
            newUser.unshift({
              Dates: getDaysOfMonthFromDate(filters.Mon),
              UserID: user.id,
              UserName: user.text,
              StockID: user.groupid
            })
          }
        }

        newUser = newUser.map(x => {
          let newObj = { ...x }
          let index = Users.findIndex(o => o.id === x.UserID)

          if (index === -1) newObj['isDelete'] = true
          else {
            newObj['isDelete'] = false
          }
          return newObj
        })

        reset({
          ...data,
          Data: {
            ...data.Data,
            Users: newUser
          }
        })
      } else {
        reset({
          ID: 0,
          Data: {
            Users:
              Users && Users.length > 0
                ? Users.map(x => ({
                    Dates: getDaysOfMonthFromDate(filters.Mon),
                    UserID: x.id,
                    UserName: x.text,
                    StockID: x.groupid
                  }))
                : []
          },
          Status: 1,
          Desc: '',
          Title: '',
          CreateDate: new Date(), //2025-09-18
          Mon: moment(filters.Mon).format('YYYY-MM'),
          StockID: CrStocks?.ID
        })
      }
    },
    enabled: Boolean(CrStocks?.ID)
  })

  const addUpdateMutation = useMutation({
    mutationFn: async body => {
      let { data } = await SettingsAPI.addEditRoster(body)
      await refetch()
      return data
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async body => {
      let { data } = await SettingsAPI.deleteRoster(body)
      await refetch()
      return data
    }
  })

  const onSubmit = values => {
    let newValues = {
      ...values,
      CreateDate: values?.CreateDate
        ? moment(values?.CreateDate).format('YYYY-MM-DD HH:mm')
        : moment().format('YYYY-MM-DD HH:mm')
    }

    addUpdateMutation.mutate(
      {
        edit: [newValues]
      },
      {
        onSuccess: data => {
          if (data && data.lst && data.lst.length > 0) {
            window?.top?.toastr?.success('', 'Lưu thay đổi thành công.', {
              timeOut: 800
            })
          } else {
            window?.top?.toastr?.error(
              '',
              data?.error || 'Lỗi chưa được xác định.',
              {
                timeOut: 800
              }
            )
          }
        }
      }
    )
  }

  const onDelete = () => {
    let { ID } = watch()
    let dataPost = {
      delete: [ID]
    }

    Swal.fire({
      customClass: {
        confirmButton: '!bg-danger'
      },
      title: 'Bạn chắc chắn muốn xoá',
      html: `Dữ liệu cài đặt ca tháng ${moment(filters.Mon).format(
        'MM-YYYY'
      )} sẽ bị xoá vĩnh viễn ? Hành động này không thể được hoàn tác.`,
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
      window?.top?.toastr?.success('', 'Xoá thành công.', {
        timeOut: 800
      })
    })
  }

  return (
    <div className="relative h-full bg-white dark:bg-dark-app">
      <LoadingComponentFull
        bgClassName="bg-white/40 z-[10000]"
        loading={isLoading}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col h-full gap-5 px-5 pt-5 pb-5 mx-auto"
        autoComplete="off"
      >
        <div
          className="overflow-x-auto border border-[#eee] relative grow"
          ref={containerRef}
        >
          <table className="min-w-full border-separate border-spacing-0">
            <thead
              className="sticky top-0 bg-[#f8f8f8] z-[1000] border-b border-b-[#eee]"
              style={{
                boxShadow: '0 10px 30px 0 rgba(82, 63, 105, .08)'
              }}
            >
              {fields && fields.length > 0 && (
                <>
                  {fields.slice(0, 1).map((user, index) => (
                    <tr key={index}>
                      <th className="sticky left-0 px-4 py-3 text-sm font-semibold text-left z-[1000] max-w-[230px] min-w-[230px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 bg-[#f8f8f8] h-[50px] uppercase">
                        Họ tên nhân viên
                      </th>
                      {user.Dates.map((date, i) => (
                        <th
                          className="capitalize px-4 py-3 font-semibold text-left min-w-[300px] max-w-[300px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 h-[50px] font-number text-sm"
                          key={i}
                        >
                          {moment(date.Date).format('dddd, DD-MM-YYYY')}
                        </th>
                      ))}
                    </tr>
                  ))}
                </>
              )}
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {fields && fields.length > 0 && (
                <>
                  {fields.map((user, index) => (
                    <EmployeeRow
                      key={user.id}
                      field={user}
                      index={index}
                      control={control}
                      remove={remove}
                    />
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex gap-4">
            <div className="relative">
              <InputDatePicker
                placeholderText="Chọn tháng"
                autoComplete="off"
                onChange={e => {
                  setFilters(prevState => ({
                    ...prevState,
                    Mon: e
                  }))
                }}
                selected={filters.Mon}
                showMonthYearPicker
                showFourColumnMonthYearPicker
                dateFormat="MM/yyyy"
                locale="vi"
              />
              <div className="absolute top-0 right-0 flex items-center justify-center w-12 h-full text-gray-600 pointer-events-none">
                <CalendarDaysIcon className="w-6" />
              </div>
            </div>
            <Controller
              name="Status"
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <Select
                  isDisabled={
                    !cong_ca?.hasRight && Number(data?.data?.Status || 1) !== 1
                  }
                  isClearable={false}
                  className="select-control min-w-[300px]"
                  onChange={val => field.onChange(val?.value)}
                  value={
                    field.value
                      ? Options.find(
                          x => Number(field.value) === Number(x.value)
                        )
                      : null
                  }
                  classNamePrefix="select"
                  options={
                    cong_ca?.hasRight
                      ? Options || []
                      : (Options || []).filter(x => Number(x.value) !== 3)
                  }
                  placeholder="Chọn trạng thái"
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
            {data?.data?.ID && (
              <Button
                disabled={isLoading}
                loading={isLoading}
                type="button"
                className="relative flex items-center h-12 px-4 text-white transition rounded shadow-lg bg-primary hover:bg-primary focus:outline-none focus:shadow-none disabled:opacity-70"
                onClick={() => {
                  window?.top?.RosterPreviewModal?.(
                    moment(filters.Mon).format('MM-YYYY')
                  )
                }}
              >
                Preview
              </Button>
            )}
          </div>

          <div className="flex gap-2.5">
            {(cong_ca?.hasRight
              ? cong_ca?.hasRight
              : Number(data?.data?.Status || 1) === 1) && (
              <>
                <Button
                  disabled={addUpdateMutation.isLoading || isLoading}
                  loading={addUpdateMutation.isLoading || isLoading}
                  type="submit"
                  className="relative flex items-center h-12 px-4 text-white transition rounded shadow-lg bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70"
                >
                  Lưu thay đổi
                </Button>
                {data?.data?.ID ? (
                  <Button
                    onClick={onDelete}
                    disabled={deleteMutation.isLoading || isLoading}
                    loading={deleteMutation.isLoading || isLoading}
                    type="button"
                    className="relative flex items-center h-12 px-4 text-white transition rounded shadow-lg bg-danger hover:bg-dangerhv focus:outline-none focus:shadow-none disabled:opacity-70"
                  >
                    Xoá cài đặt tháng {moment(filters.Mon).format('MM-YYYY')}
                  </Button>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default ShiftWork
