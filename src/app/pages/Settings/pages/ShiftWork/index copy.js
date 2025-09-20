import React, { useState } from 'react'
import { Button } from 'src/_ezs/partials/button'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { registerLocale } from 'react-datepicker'
import Select from 'react-select'
import vi from 'date-fns/locale/vi'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import { useMutation, useQuery } from '@tanstack/react-query'
import SettingsAPI from 'src/_ezs/api/settings.api'
import moment from 'moment'
import UsersAPI from 'src/_ezs/api/users.api'
import { useAuth } from 'src/_ezs/core/Auth'
import { SelectUserShifts2 } from 'src/_ezs/partials/select'
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

function ShiftWork(props) {
  const { CrStocks } = useAuth()

  let [filters, setFilters] = useState({
    Mon: moment().toDate()
  })

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      ID: 0,
      Data: {
        Dates: []
      },
      Status: 1,
      Desc: '',
      Title: '',
      CreateDate: '', //2025-09-18
      Mon: ''
    }
  })

  const { fields } = useFieldArray({
    control,
    name: 'Data.Users'
  })

  const { isLoading } = useQuery({
    queryKey: ['ShiftWork', filters.Mon],
    queryFn: async () => {
      const data = await SettingsAPI.getRoster({
        pi: 1,
        filter: {
          Status: '',
          Mon: moment(filters.Mon).format('YYYY-MM')
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
        console.log(data)
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
          Mon: moment(filters.Mon).format('YYYY-MM')
        })
      }
    },
    enabled: Boolean(CrStocks?.ID)
  })

  const addUpdateMutation = useMutation({
    mutationFn: async body => {
      //let { data } = await SettingsAPI.addEditRoster(body)
      await new Promise(resolve => setTimeout(resolve, 5000));
      return null
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
          console.log(data)
        }
      }
    )
  }

  return (
    <div className="relative h-full bg-white dark:bg-dark-app">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col h-full gap-5 px-8 pt-8 pb-5 mx-auto max-w-7xl"
        autoComplete="off"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow">
            <thead className="sticky top-0 bg-gray-50 z-[1000]">
              {fields && fields.length > 0 && (
                <>
                  {fields.slice(0, 1).map((user, index) => (
                    <tr key={index}>
                      <th
                        className="sticky left-0 px-4 py-3 text-sm font-medium text-left text-gray-600 z-[1000]"
                        style={{
                          boxShadow: '6px 0 10px -2px rgba(0,0,0,0.3)'
                        }}
                      >
                        Họ tên nhân viên
                      </th>
                      {user.Dates.map((date, i) => (
                        <th
                          className="px-4 py-3 text-sm font-medium text-left text-gray-600 min-w-[300px] max-w-[300px]"
                          key={i}
                        >
                          {moment(date.Date).format('DD-MM-YYYY')}
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
                    <tr
                      key={user.id}
                      className="transition-colors duration-150 hover:bg-gray-100"
                    >
                      <td className="sticky left-0 px-4 py-2 text-sm text-gray-700 z-[999] bg-white">
                        {user.UserName}
                      </td>
                      {user.Dates.map((date, i) => (
                        <td
                          className="px-4 py-2 text-sm text-gray-700 min-w-[300px] max-w-[300px]"
                          key={i}
                        >
                          <Controller
                            name={`Data.Users[${index}].Dates[${i}].WorkShiftType`}
                            control={control}
                            render={({ field }) => (
                              <div>
                                <SelectUserShifts2
                                  isMulti
                                  isClearable={true}
                                  value={field.value}
                                  onChange={val => field.onChange(val)}
                                  className="select-control"
                                  menuPosition="fixed"
                                  styles={{
                                    menuPortal: base => ({
                                      ...base,
                                      zIndex: 9999
                                    })
                                  }}
                                  menuPortalTarget={document.body}
                                  placeholder="Chọn loại ca"
                                />
                              </div>
                            )}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
        {/* <ReactBaseTable
          wrapClassName="grow"
          rowKey="id"
          columns={columns || []}
          data={fields || []}
          rowHeight={78}
          //estimatedRowHeight={78}
          emptyRenderer={() =>
            !isLoading && (
              <div className="flex items-center justify-center h-full">
                Không có dữ liệu
              </div>
            )
          }
          loading={isLoading}
        /> */}
        <div className="flex items-end justify-between mb-5">
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
                  isClearable={false}
                  className="select-control min-w-[300px]"
                  value={
                    field.value
                      ? Options.find(
                          x => Number(field.value) === Number(x.value)
                        )
                      : null
                  }
                  classNamePrefix="select"
                  options={Options || []}
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
          </div>
          <div className="flex pb-1">
            <Button
              disabled={addUpdateMutation.isLoading}
              loading={addUpdateMutation.isLoading}
              type="submit"
              className="relative flex items-center h-12 px-4 text-white transition rounded shadow-lg bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70"
            >
              Cập nhật
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ShiftWork
