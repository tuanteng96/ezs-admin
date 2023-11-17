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

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

function InventoryFilters(props) {
  const { CrStocks } = useAuth()
  const { search, state, pathname } = useLocation()
  const navigate = useNavigate()

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
          NotDelv: false
        }
  })

  const onSubmit = values => {
    navigate({
      pathname: state?.prevFrom || pathname.replaceAll('/filters', ''),
      search: createSearchParams({
        ...values,
        Pi: 1,
        RootTypeID: values.RootTypeID ? values.RootTypeID.toString() : '',
        manus: values.manus ? values.manus.toString() : ''
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
              <div className="mb-3.5">
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
              <div>
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
