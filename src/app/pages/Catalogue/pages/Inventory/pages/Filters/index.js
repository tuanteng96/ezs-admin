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
import { Input } from 'src/_ezs/partials/forms'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Button } from 'src/_ezs/partials/button'
import {
  SelectCategories,
  SelectStocksWareHouse
} from 'src/_ezs/partials/select'
import { Switch } from '@headlessui/react'
import clsx from 'clsx'
import { useAuth } from 'src/_ezs/core/Auth'
import { useLayout } from 'src/_ezs/layout/LayoutProvider'
import { useRoles } from 'src/_ezs/hooks/useRoles'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import moment from 'moment'

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

function InventoryFilters(props) {
  const { CrStocks } = useAuth()
  const { GlobalConfig } = useLayout()
  const { search, state, pathname } = useLocation()
  const navigate = useNavigate()

  const { xuat_nhap_diem, xuat_nhap_ten_slg } = useRoles([
    'xuat_nhap_diem',
    'xuat_nhap_ten_slg'
  ])

  useEscape(() =>
    navigate({
      pathname: state?.prevFrom || pathname.replaceAll('/filters', '') || '/',
      search: search
    })
  )
  
  const { control, handleSubmit } = useForm({
    defaultValues: state?.queryConfig
      ? {
          ...state?.queryConfig,
          RootTypeID: state?.queryConfig?.RootTypeID
            ? state?.queryConfig?.RootTypeID.split(',')
            : '',
          manus: state?.queryConfig?.manus
            ? state?.queryConfig?.manus.split(',')
            : ''
        }
      : {
          cmd: 'prodinstock',
          Pi: 1,
          Ps: 15,
          Only: true,
          RootTypeID: '',
          manus: '',
          StockID: CrStocks?.ID,
          Key: '',
          NotDelv: false,
          IsPublic: true,
          to: ''
        }
  })

  const onSubmit = values => {
    navigate({
      pathname: state?.prevFrom || pathname.replaceAll('/filters', ''),
      search: createSearchParams({
        ...values,
        Pi: 1,
        RootTypeID: values.RootTypeID ? values.RootTypeID.toString() : '',
        manus: values.manus ? values.manus.toString() : '',
        to: values.to
          ? moment(values.to, 'DD/MM/YYYY').format('DD/MM/YYYY')
          : null
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
          className="absolute flex flex-col justify-center py-10 h-5/6 max-w-full w-[470px] px-4 sm:px-0"
          initial={{ opacity: 0, top: '60%' }}
          animate={{ opacity: 1, top: 'auto' }}
          exit={{ opacity: 0, top: '60%' }}
        >
          <div className="flex flex-col h-full bg-white rounded shadow-lg dark:bg-dark-aside">
            <div className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
              <div className="flex items-center text-2xl font-semibold">
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
              <div>
                <div className="mb-3.5 last:mb-0">
                  <div className="font-medium">Từ khóa</div>
                  <div className="mt-1">
                    <Controller
                      name="Key"
                      control={control}
                      render={({ field: { ref, ...field }, fieldState }) => (
                        <Input
                          placeholder="e.g Kem dưỡng"
                          autoComplete="off"
                          type="text"
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="mb-3.5 last:mb-0">
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
                          isClearable={
                            xuat_nhap_diem.IsStocks ||
                            xuat_nhap_ten_slg.IsStocks
                          }
                          StockRoles={
                            xuat_nhap_diem.hasRight
                              ? xuat_nhap_diem.IsStocks
                                ? [{ value: 778, label: 'Kho tổng' }].concat(
                                    xuat_nhap_diem.StockRoles
                                  )
                                : xuat_nhap_diem.StockRoles
                              : xuat_nhap_ten_slg.IsStocks
                              ? [{ value: 778, label: 'Kho tổng' }].concat(
                                  xuat_nhap_ten_slg.StockRoles
                                )
                              : xuat_nhap_ten_slg.StockRoles
                          }
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="mb-3.5 last:mb-0">
                  <div className="font-medium">Danh mục</div>
                  <div className="mt-1">
                    <Controller
                      name="RootTypeID"
                      control={control}
                      render={({ field: { ref, ...field }, fieldState }) => (
                        <SelectCategories
                          isMulti
                          allOptions={true}
                          isClearable
                          value={field.value}
                          onChange={val =>
                            field.onChange(val ? val.map(x => x.value) : [])
                          }
                          Type="SP,NVL"
                          className="select-control"
                          menuPosition="fixed"
                          styles={{
                            menuPortal: base => ({
                              ...base,
                              zIndex: 9999
                            })
                          }}
                          menuPortalTarget={document.body}
                          placeholder="Chọn danh mục"
                          noOptionsMessage={() => 'Danh mục trống.'}
                          isValidNewOption={() => false}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="mb-3.5 last:mb-0">
                  <div className="font-medium">Nhãn hàng</div>
                  <div className="mt-1">
                    <Controller
                      name="manus"
                      control={control}
                      render={({ field: { ref, ...field }, fieldState }) => (
                        <SelectCategories
                          isMulti
                          isClearable
                          value={field.value}
                          onChange={val =>
                            field.onChange(val ? val.map(x => x.value) : [])
                          }
                          Type="NH"
                          className="select-control"
                          menuPosition="fixed"
                          styles={{
                            menuPortal: base => ({
                              ...base,
                              zIndex: 9999
                            })
                          }}
                          menuPortalTarget={document.body}
                          placeholder="Chọn nhãn hàng"
                          noOptionsMessage={() => 'Chưa có nhãn hàng.'}
                          isValidNewOption={() => false}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="mb-3.5 last:mb-0">
                  <div className="font-medium">Đến ngày</div>
                  <div className="mt-1">
                    <Controller
                      name="to"
                      control={control}
                      render={({ field: { ref, ...field }, fieldState }) => (
                        <InputDatePicker
                          placeholderText="Chọn ngày"
                          autoComplete="off"
                          onChange={field.onChange}
                          selected={
                            field.value
                              ? moment(field.value, 'DD/MM/YYYY').toDate()
                              : null
                          }
                          {...field}
                          dateFormat="dd/MM/yyyy"
                        />
                      )}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-[15px]">
                      Ẩn mặt hàng ngừng kinh doanh
                    </div>
                    <Controller
                      name="IsPublic"
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
                {!GlobalConfig?.Admin?.khong_co_kho && (
                  <div className="mb-3.5 last:mb-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-[15px]">
                        Cần giao / Nhập lại
                      </div>
                      <Controller
                        name="NotDelv"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            checked={field.value === 'true' || field.value}
                            onChange={val => field.onChange(val)}
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
                    </div>
                  </div>
                )}
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
