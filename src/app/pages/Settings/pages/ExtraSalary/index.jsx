import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import { useMutation, useQuery } from '@tanstack/react-query'
import moment from 'moment'
import React, { memo, useEffect, useRef, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import SettingsAPI from 'src/_ezs/api/settings.api'
import UsersAPI from 'src/_ezs/api/users.api'
import { useAuth } from 'src/_ezs/core/Auth'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import { useLayout } from 'src/_ezs/layout/LayoutProvider'
import { Button } from 'src/_ezs/partials/button'
import { InputNumber } from 'src/_ezs/partials/forms'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import Select from 'react-select'
import { useRoles } from 'src/_ezs/hooks/useRoles'

let Options = [
  { label: 'Đang xây dựng', value: '1' },
  { label: 'Chờ duyệt', value: '2' },
  { label: 'Đã duyệt', value: '3' }
]

let Keys = ['Key1', 'Key2']

const EmployeeRow = memo(({ field, control, index }) => {
  return (
    <tr>
      <td className="sticky left-0 px-4 py-4 text-sm z-[999] font-medium bg-white max-w-[250px] min-w-[250px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0">
        <div>{field.UserName}</div>
      </td>
      {Keys.map((key, i) => (
        <td
          className="px-4 py-4 text-sm text-gray-700 min-w-[200px] max-w-[200px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0"
          key={i}
        >
          <Controller
            control={control}
            name={`Items[${index}].setting.Detail[${key}]`}
            render={({ field: f }) => (
              <InputNumber
                thousandSeparator={true}
                value={f.value}
                placeholder="Nhập giá trị"
                onValueChange={val =>
                  f.onChange(
                    typeof val.floatValue !== 'undefined'
                      ? val.floatValue
                      : val.value
                  )
                }
                allowNegative={false}
              />
            )}
          />
        </td>
      ))}
    </tr>
  )
})

function ExtraSalary(props) {
  const { CrStocks } = useAuth()
  const { GlobalConfig } = useLayout()
  const containerRef = useRef(null)

  const { tong_hop } = useRoles(['tong_hop'])

  let [filters, setFilters] = useState({
    Mon: moment().toDate()
  })

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      Items: [],
      Status: '1'
    }
  })

  const { fields, remove } = useFieldArray({
    control,
    name: 'Items'
  })

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth' // mượt mà
    })
  }, [containerRef, filters.Mon, CrStocks])

  const { isLoading, refetch, data } = useQuery({
    queryKey: ['ExtraSalary', { Mon: filters.Mon, CrStocks, GlobalConfig }],
    queryFn: async () => {
      const data = await SettingsAPI.getUserAllow({
        pi: 1,
        ps: 500,
        filter: {
          //"ID": ",2,3",
          Status: '',
          Mon: moment(filters.Mon).format('MM/YYYY'),
          StockID: CrStocks?.ID
        }
      })
      let Users = null
      if (!GlobalConfig?.Admin?.roster_nv_dv) {
        const { data: UsersRs } = await UsersAPI.listFull({
          StockID: CrStocks?.ID
        })
        Users = UsersRs
      } else {
        const { data: UsersRs } = await UsersAPI.listService({
          StockID: CrStocks?.ID
        })
        Users = UsersRs
      }

      Users = Users?.data
        .map(x => ({
          ...x,
          source: {
            FullName: x.source.FullName,
            StockID: x.source.StockID,
            ID: x.source.ID,
            DeviceIDs: x.source.DeviceIDs
          },
          UserName: x.source.FullName,
          UserID: x.source.ID
        }))
        .filter(x => x.groupid === x.source.StockID)

      let Status = '1'

      if (data?.data?.items && data?.data?.items.length > 0) {
        let { items } = data?.data
        Users = Users.map(user => {
          let newObj = { ...user }
          let index = items.findIndex(x => user.id === x.UserID)

          if (index > -1) {
            let Detail = items[index]['Detail'] || {}
            newObj['setting'] = {
              ...items[index],
              Detail: Keys.reduce((acc, k) => {
                acc[k] = k in Detail ? Detail[k] : ''
                return acc
              }, {})
            }
          } else {
            let Detail = {}
            newObj['setting'] = {
              CreateDate: moment().toDate(),
              Detail: Keys.reduce((acc, k) => {
                acc[k] = k in Detail ? Detail[k] : ''
                return acc
              }, {}),
              ID: 0,
              Status: '',
              UserID: user?.id,
              Value: 0,
              Mon: ''
            }
          }

          return newObj
        })

        let index = Users.findIndex(x => x.setting.Status)
        if (index > -1) {
          Status = Users[index].setting.Status
        }
      } else {
        Users = Users.map(user => ({
          ...user,
          setting: {
            CreateDate: moment().toDate(),
            Detail: Keys.reduce((acc, k) => {
              acc[k] = k in {} ? {}[k] : ''
              return acc
            }, {}),
            ID: 0,
            Status: '',
            UserID: user?.id,
            Value: 0,
            Mon: ''
          }
        }))
      }

      return {
        data: data?.data?.items || [],
        Users: Users,
        Status
      }
    },
    onSuccess: ({ Users, Status }) => {
      reset({
        Items: Users,
        Status: Status
      })
    },
    enabled: Boolean(CrStocks?.ID)
  })

  const addUpdateMutation = useMutation({
    mutationFn: async body => {
      let { data } = await SettingsAPI.addEditUserAllow(body)
      await refetch()
      return data
    }
  })

  const onSubmit = values => {
    let newValues = values.Items.map(item => {
      let { setting } = item
      let newObj = {
        ...setting,
        CreateDate: moment(setting.CreateDate).format('YYYY-MM-DD'),
        Mon: moment(filters.Mon).format('MM/YYYY'),
        Status: values.Status,
        Value: Object.values(setting.Detail).reduce(
          (sum, val) => sum + Number(val || 0),
          0
        )
      }
      return newObj
    })

    addUpdateMutation.mutate(
      {
        edit: newValues
      },
      {
        onSuccess: data => {
          if (!data?.error) {
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
              <tr>
                <th className="sticky left-0 px-4 py-3 text-sm font-semibold text-left z-[1000] max-w-[250px] min-w-[250px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 bg-[#f8f8f8] h-[50px] uppercase">
                  <div className="flex items-center justify-between">
                    <div>Họ tên nhân viên</div>
                  </div>
                </th>
                {Keys.map((key, i) => (
                  <th
                    className="capitalize px-4 py-3 font-semibold text-left min-w-[200px] max-w-[200px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 h-[50px] font-number text-sm"
                    key={i}
                  >
                    {key}
                  </th>
                ))}
              </tr>
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
                    !tong_hop?.hasRight && Number(data?.Status || 1) !== 1
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
                    tong_hop?.hasRight
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
          </div>

          <div className="flex gap-2.5">
            {(tong_hop?.hasRight
              ? tong_hop?.hasRight
              : Number(data?.Status || 1) === 1) && (
              <Button
                disabled={addUpdateMutation.isLoading || isLoading}
                loading={addUpdateMutation.isLoading || isLoading}
                type="submit"
                className="relative flex items-center h-12 px-4 text-white transition rounded shadow-lg bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70"
              >
                Lưu thay đổi
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default ExtraSalary
