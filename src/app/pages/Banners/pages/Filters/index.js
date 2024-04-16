import React from 'react'
import {
  NavLink,
  createSearchParams,
  useLocation,
  useNavigate
} from 'react-router-dom'
import { m } from 'framer-motion'
import { Button } from 'src/_ezs/partials/button'
import { Controller, useForm } from 'react-hook-form'
import { ArrowSmallLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Input } from 'src/_ezs/partials/forms'
import { SelectBannersCategories } from 'src/_ezs/partials/select'
import useQueryParams from 'src/_ezs/hooks/useQueryParams'
import { pickBy } from 'lodash-es'

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

function Filters(props) {
  const { search, pathname } = useLocation()
  const navigate = useNavigate()

  const queryParams = useQueryParams()

  const queryConfig = {
    pi: queryParams.pi || 1,
    ps: queryParams.ps || 15,
    Key: queryParams?.Key || '',
    PosID: queryParams?.PosID
      ? {
          value: queryParams?.PosID,
          label: queryParams?.PosIDTitle
        }
      : ''
  }

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { ...queryConfig }
  })

  const onSubmit = values => {
    navigate({
      pathname: pathname.replaceAll('/filter', ''),
      search: createSearchParams(
        pickBy(
          {
            ...values,
            PosID: values?.PosID?.value || '',
            PosIDTitle: values?.PosID?.label || '',
            pi: 1
          },
          v => v
        )
      ).toString()
    })
  }

  const onResetFilters = () => {
    reset({
      pi: 1,
      ps: queryParams.ps,
      Key: '',
      PosID: ''
    })
    navigate({
      pathname: pathname.replaceAll('/filter', ''),
      search: ''
    })
  }

  return (
    <div className="fixed inset-0 z-[1010] flex items-center justify-center">
      <m.div
        className="absolute inset-0 bg-black/[.2] dark:bg-black/[.4]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() =>
          navigate({
            pathname: pathname.replaceAll('/filter', ''),
            search: search
          })
        }
      ></m.div>
      <m.div
        className="relative flex flex-col justify-center max-w-full w-[470px] px-4 sm:px-0"
        initial={{ opacity: 0, top: '60%' }}
        animate={{ opacity: 1, top: 'auto' }}
        exit={{ opacity: 0, top: '60%' }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full bg-white rounded shadow dark:bg-dark-aside"
        >
          <div className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
            <div className="flex items-center text-2xl font-semibold">
              <NavLink
                to={{
                  pathname: pathname.replaceAll('/filter', ''),
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
                pathname: pathname.replaceAll('/filter', ''),
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
                      placeholder="Nhập từ khóa"
                      autoComplete="off"
                      type="text"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
            <div>
              <div className="font-semibold">Vị trí</div>
              <div className="mt-1">
                <Controller
                  name="PosID"
                  control={control}
                  render={({ field: { ref, ...field }, fieldState }) => (
                    <SelectBannersCategories
                      isClearable
                      value={field.value}
                      onChange={val => {
                        field.onChange(val)
                      }}
                      className="select-control"
                      placeholder="Chọn vị trí"
                      noOptionsMessage={() => 'Chưa có vị trí.'}
                    />
                  )}
                />
              </div>
            </div>
          </PerfectScrollbar>
          <div className="flex justify-between p-5 border-t border-separator dark:border-dark-separator">
            <div>
              <Button
                type="button"
                className="relative flex items-center px-4 transition border border-gray-300 rounded shadow-lg dark:border-gray-700 h-11 hover:border-info focus:outline-none focus:shadow-none text-info"
                onClick={onResetFilters}
              >
                Xóa bộ lọc
              </Button>
            </div>
            <div className="flex">
              <NavLink
                to={{
                  pathname: pathname.replaceAll('/filter', ''),
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
        </form>
      </m.div>
    </div>
  )
}

export default Filters
