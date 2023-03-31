import React from 'react'
import PropTypes from 'prop-types'
import { Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from 'src/_ezs/partials/button'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { SelectUserService } from 'src/_ezs/partials/select/SelectUserService'
import { SelectMembers } from 'src/_ezs/partials/select/SelectMembers'
import { useAuth } from 'src/_ezs/core/Auth'
import Select from 'react-select'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { Checkbox } from 'src/_ezs/partials/forms'
import { isEmpty, omitBy } from 'lodash'

const StatusMembers = [
  {
    value: 'KHACH_CU',
    label: 'Khách cũ'
  },
  {
    value: 'KHACH_VANG_LAI_CO_TK',
    label: 'Khách vãng lai ( Có tài khoản )'
  },
  {
    value: 'KHACH_MOI',
    label: 'Khách vãng lai ( Khách mới )'
  }
]

const StatusBooks = [
  {
    value: 'DA_CHON',
    label: 'Đã chọn nhân viên'
  },
  {
    value: 'CHUA_CHON',
    label: 'Chưa chọn nhân viên'
  }
]

const StatusAtHome = [
  {
    value: 'TAI_NHA',
    label: 'Tại nhà'
  },
  {
    value: 'TAI_SPA',
    label: 'Tại Spa'
  }
]

const StatusBooking = [
  {
    value: 'XAC_NHAN',
    label: 'Đã xác nhận',
    color: '#3699ff',
    selected: false
  },
  {
    value: 'XAC_NHAN_TU_DONG',
    label: 'Đã xác nhận (Tự động)',
    color: '#187de4',
    selected: false
  },
  {
    value: 'CHUA_XAC_NHAN',
    label: 'Chưa xác nhận',
    color: '#FFA800',
    selected: false
  },
  {
    value: 'KHACH_KHONG_DEN',
    label: 'Đặt nhưng không đến',
    color: '#f64e60',
    selected: false
  },
  {
    value: 'KHACH_DEN',
    label: 'Hoàn thành',
    color: '#1BC5BD',
    selected: false
  },
  {
    value: 'DANG_THUC_HIEN',
    label: 'Đang thực hiện',
    color: '#8950FC',
    selected: false
  },
  {
    value: 'THUC_HIEN_XONG',
    label: 'Thực hiện xong',
    color: '#92929e',
    selected: false
  }
]

const getStatusBooking = statusParams => {
  if (!statusParams) return StatusBooking
  const newStatusParams = statusParams.split(',')
  return StatusBooking.map(x => ({
    ...x,
    selected: newStatusParams.includes(x.value)
  }))
}

function CalendarFilters({ isFilters, onHideFilters, queryConfig }) {
  const { CrStocks } = useAuth()
  const navigate = useNavigate()

  const { control, handleSubmit } = useForm({
    defaultValues: {
      status: getStatusBooking(queryConfig?.status),
      memberid: queryConfig?.MemberIDs
        ? queryConfig?.MemberIDs.split(',').map(x => Number(x))
        : '',
      UserServiceIDs: queryConfig?.UserIDs
        ? queryConfig?.UserIDs.split(',').map(x => Number(x))
        : '',
      StatusMember: queryConfig?.typeMember || '',
      StatusAtHome: queryConfig?.atHome || '',
      StatusBook: queryConfig?.typeUser || ''
    }
  })

  const { fields } = useFieldArray({
    control,
    name: 'status'
  })

  const onSubmit = values => {
    navigate({
      pathname: '/calendar',
      search: createSearchParams(
        omitBy(
          {
            ...queryConfig,
            MemberIDs:
              values.memberid && values.memberid.length > 0
                ? values.memberid.join(',')
                : '',
            UserIDs:
              values.UserServiceIDs && values.UserServiceIDs.length > 0
                ? values.UserServiceIDs.join(',')
                : '',
            status: values.status
              .filter(x => x.selected)
              .map(x => x.value)
              .join(','),
            atHome: values.StatusAtHome,
            typeUser: values.StatusBook,
            typeMember: values.StatusMember
          },
          isEmpty
        )
      ).toString()
    })
    onHideFilters()
  }
  return (
    <Transition show={isFilters}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="fixed w-full h-full z-[1002] top-0 left-0"
        autoComplete="off"
      >
        <Transition.Child
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            onClick={onHideFilters}
            className="absolute w-full h-full top-0 left bg-black/[.2] dark:bg-black/[.4]"
          ></div>
        </Transition.Child>
        <Transition.Child
          className="absolute max-w-[400px] w-full h-full bg-white dark:bg-dark-aside right-0 top-0 z-10 flex flex-col"
          enter="transition ease-in-out duration-300 transform"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="relative py-5 text-2xl font-bold text-center border-b border-separator dark:border-dark-separator dark:text-graydark-800">
            <div
              className="absolute flex items-center justify-center transition cursor-pointer w-11 h-11 dark:text-graydark-800 hover:text-primary top-1/2 -translate-y-2/4 left-3"
              onClick={onHideFilters}
            >
              <XMarkIcon className="w-7" />
            </div>
            Bộ lọc đặt lịch
          </div>
          <div className="px-6 py-4 overflow-auto grow scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded">
            <div>
              <div className="mb-1.5 text-muted font-semibold dark:text-graydark-800 text-[13px] font-inter uppercase">
                Lịch dự kiến
              </div>
              <div className="flex flex-col">
                {fields &&
                  fields.slice(0, 5).map((item, index) => (
                    <div className="mt-1.5" key={index}>
                      <Controller
                        name={`status[${index}].selected`}
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <Checkbox
                            labelText={item.label}
                            htmlFor={item.value}
                            {...field}
                            onChange={field.onChange}
                            checked={field.value}
                            labelClassName="text-[15px] font-semibold pl-2"
                            styleChecked={{ background: item.color }}
                          />
                        )}
                      />
                    </div>
                  ))}
              </div>
            </div>
            <div className="mt-4 mb-4">
              <div className="mb-1.5 text-muted font-semibold dark:text-graydark-800 text-[13px] font-inter uppercase">
                Lịch thực hiện
              </div>
              <div className="flex flex-col">
                {fields &&
                  fields.slice(5, StatusBooking.length).map((item, index) => (
                    <div className="mt-1.5" key={index}>
                      <Controller
                        name={`status[${5 + index}].selected`}
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <Checkbox
                            labelText={item.label}
                            htmlFor={item.value}
                            {...field}
                            onChange={field.onChange}
                            checked={field.value}
                            labelClassName="text-[15px] font-semibold pl-2"
                            styleChecked={{ background: item.color }}
                          />
                        )}
                      />
                    </div>
                  ))}
              </div>
            </div>
            <div className="mb-3">
              <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
                Khách hàng
              </div>
              <Controller
                name="memberid"
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <SelectMembers
                    StockID={CrStocks?.ID}
                    value={field.value}
                    onChange={val =>
                      field.onChange(val ? val.map(x => x.value) : [])
                    }
                    isSome={true}
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
            <div className="mb-3">
              <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
                Nhân viên
              </div>
              <Controller
                name="UserServiceIDs"
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <SelectUserService
                    value={field.value}
                    onChange={val =>
                      field.onChange(val ? val.map(x => x.value) : [])
                    }
                    isSome={true}
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
            <div className="mb-3">
              <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
                Loại khách hàng
              </div>
              <Controller
                name="StatusMember"
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <Select
                    classIcon="far fa-user-check"
                    className="select-control mb-8px"
                    classNamePrefix="select"
                    isLoading={false}
                    isClearable
                    isSearchable
                    placeholder="Chọn loại khách hàng"
                    options={StatusMembers}
                    value={StatusMembers.filter(x => x.value === field.value)}
                    onChange={val => field.onChange(val?.value || '')}
                  />
                )}
              />
            </div>
            <div className="mb-3">
              <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
                Loại nhân viên
              </div>
              <Controller
                name="StatusBook"
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <Select
                    classIcon="far fa-user-check"
                    className="select-control mb-8px"
                    classNamePrefix="select"
                    isLoading={false}
                    isClearable
                    isSearchable
                    placeholder="Chọn loại"
                    options={StatusBooks}
                    value={StatusBooks.filter(x => x.value === field.value)}
                    onChange={val => field.onChange(val?.value || '')}
                  />
                )}
              />
            </div>
            <div>
              <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
                Loại thực hiện
              </div>
              <Controller
                name="StatusAtHome"
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <Select
                    classIcon="far fa-user-check"
                    className="select-control mb-8px"
                    classNamePrefix="select"
                    isLoading={false}
                    isClearable
                    isSearchable
                    placeholder="Chọn loại"
                    options={StatusAtHome}
                    value={StatusAtHome.filter(x => x.value === field.value)}
                    onChange={val => field.onChange(val?.value || '')}
                  />
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 p-6 border-t border-separator dark:border-dark-separator">
            <button
              onClick={onHideFilters}
              type="button"
              className="relative flex items-center justify-center w-full h-12 px-4 font-bold text-black transition border border-gray-400 rounded dark:text-white hover:border-gray-900 dark:hover:border-white focus:outline-none focus:shadow-none disabled:opacity-70"
            >
              Đóng
            </button>
            <Button
              type="submit"
              className="relative flex items-center justify-center w-full h-12 px-4 font-bold text-white transition rounded bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
            >
              Lọc đặt lịch
            </Button>
          </div>
        </Transition.Child>
      </form>
    </Transition>
  )
}

CalendarFilters.propTypes = {
  isFilters: PropTypes.bool,
  onHideFilters: PropTypes.func
}

export { CalendarFilters }
