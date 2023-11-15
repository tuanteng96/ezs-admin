import React, { Fragment } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  NavLink,
  createSearchParams,
  useLocation,
  useNavigate
} from 'react-router-dom'
import useEscape from 'src/_ezs/hooks/useEscape'
import { m } from 'framer-motion'
import { ArrowSmallLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Button } from 'src/_ezs/partials/button'
import {
  SelectStocksWareHouse,
  SelectSupplier,
  SelectUserAdmin
} from 'src/_ezs/partials/select'
import { Switch } from '@headlessui/react'
import clsx from 'clsx'
import Select from 'react-select'
import { Input } from 'src/_ezs/partials/forms'

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

const ListType = [
  {
    label: 'Đơn nhập',
    value: 'N'
  },
  {
    label: 'Đơn xuất',
    value: 'X'
  }
]

const ListPayStatus = [
  {
    label: 'Đã Thanh toán hết',
    value: '1'
  },
  {
    label: 'Chưa Thanh toán hết',
    value: '2'
  }
]

function InventoryFilters(props) {
  const { search, state, pathname } = useLocation()
  const navigate = useNavigate()

  useEscape(() =>
    navigate({
      pathname: state?.prevFrom || pathname.replaceAll('/filters', '') || '/',
      search: search
    })
  )

  const { control, handleSubmit } = useForm({
    defaultValues: { ...state?.queryConfig }
  })

  const onSubmit = values => {
    navigate({
      pathname: state?.prevFrom || pathname.replaceAll('/filters', ''),
      search: createSearchParams({
        ...values,
        Pi: 1
      }).toString()
    })
  }

  return (
    <>
      <m.div
        className="fixed inset-0 bg-black/[.2] dark:bg-black/[.4] z-[1010]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      ></m.div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="fixed inset-0 flex items-center justify-center z-[1010]"
      >
        <m.div
          className="absolute flex flex-col justify-center py-10 max-h-5/6"
          initial={{ opacity: 0, top: '60%' }}
          animate={{ opacity: 1, top: 'auto' }}
          exit={{ opacity: 0, top: '60%' }}
        >
          <div className="bg-white dark:bg-dark-aside max-w-full w-[470px] h-full rounded shadow-lg flex flex-col">
            <div className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
              <div className="text-2xl font-semibold flex items-center">
                <NavLink
                  to={{
                    pathname:
                      state?.prevFrom ||
                      pathname.replaceAll('/filters', '') ||
                      '/',
                    search: search
                  }}
                  className="mr-2"
                >
                  <ArrowSmallLeftIcon className="w-7" />
                </NavLink>
                Bộ lọc
              </div>
              <NavLink
                to={{
                  pathname:
                    state?.prevFrom ||
                    pathname.replaceAll('/filters', '') ||
                    '/',
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
                <div className="font-medium">Cơ sở</div>
                <div className="mt-1">
                  <Controller
                    name={`StockID`}
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <SelectStocksWareHouse
                        value={field.value}
                        onChange={val => field.onChange(val?.value || '')}
                        className="select-control"
                        menuPosition="fixed"
                        styles={{
                          menuPortal: base => ({
                            ...base,
                            zIndex: 9999
                          })
                        }}
                        menuPortalTarget={document.body}
                        isClearable
                      />
                    )}
                  />
                </div>
              </div>
              <div className="mb-3.5">
                <div className="font-semibold">Loại</div>
                <div className="mt-1">
                  <Controller
                    name="Type"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <Select
                        isClearable
                        classNamePrefix="select"
                        options={ListType}
                        className="select-control mb-8px"
                        placeholder="Chọn loại"
                        value={ListType.filter(x => x.value === field.value)}
                        onChange={val => field.onChange(val?.value || '')}
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
              <div className="mb-3.5">
                <div className="font-medium">Mã đơn</div>
                <div className="mt-1">
                  <Controller
                    name="Key"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <Input
                        placeholder="Nhập mã đơn"
                        autoComplete="off"
                        type="text"
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="mb-3.5">
                <div className="font-semibold">Nhà cung cấp, đại lý</div>
                <div className="mt-1">
                  <Controller
                    name="SupplierID"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <SelectSupplier
                        isClearable
                        className="select-control mb-8px"
                        value={field.value}
                        onChange={val => field.onChange(val?.value || '')}
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
              <div className="mb-3.5">
                <div className="font-medium">Nhân viên</div>
                <Controller
                  name="UserID"
                  control={control}
                  render={({ field: { ref, ...field }, fieldState }) => (
                    <SelectUserAdmin
                      className="select-control"
                      isClearable
                      value={field.value}
                      onChange={val => field.onChange(val?.value || '')}
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
              <div className="mb-3.5">
                <div className="font-semibold">Tình trạng thánh toán</div>
                <div className="mt-1">
                  <Controller
                    name="PayStatus"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <Select
                        isClearable
                        classNamePrefix="select"
                        options={ListPayStatus}
                        className="select-control mb-8px"
                        placeholder="Chọn tình trạng"
                        value={ListPayStatus.filter(
                          x => x.value === field.value
                        )}
                        onChange={val => field.onChange(val?.value || '')}
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
              <div>
                <div className="flex items-center justify-between">
                  <div className="font-medium text-[15px]">
                    Hiển thị chuyển đổi nội bộ
                  </div>
                  <Controller
                    name="Private"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={Number(field.value) === 1}
                        onChange={val => field.onChange(val ? 1 : 0)}
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
                                checked ? 'translate-x-6' : 'translate-x-1'
                              )}
                            />
                          </button>
                        )}
                      </Switch>
                    )}
                  />
                </div>
              </div>
            </PerfectScrollbar>
            <div className="flex justify-end p-5 border-t border-separator dark:border-dark-separator">
              <div className="flex">
                <NavLink
                  to={{
                    pathname:
                      state?.prevFrom ||
                      pathname.replaceAll('/filters', '') ||
                      '/',
                    search: search
                  }}
                  type="button"
                  className="relative flex items-center px-4 transition border border-gray-300 rounded shadow-lg dark:border-gray-700 h-11 hover:border-gray-800 focus:outline-none focus:shadow-none"
                >
                  Hủy
                </NavLink>
                <Button
                  type="submit"
                  className="relative flex items-center px-4 ml-2 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                >
                  Tìm kiếm
                </Button>
              </div>
            </div>
          </div>
        </m.div>
      </form>
    </>
  )
}

export default InventoryFilters
