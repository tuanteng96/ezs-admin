import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import useEscape from 'src/_ezs/hooks/useEscape'
import { m } from 'framer-motion'
import { ArrowSmallLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Input } from 'src/_ezs/partials/forms'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Button } from 'src/_ezs/partials/button'
import { SelectCategoryProds } from 'src/_ezs/partials/select'

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

function InventoryFilters(props) {
  const { search, state } = useLocation()
  const navigate = useNavigate()

  useEscape(() =>
    navigate({
      pathname: state?.prevFrom || '/',
      search: search
    })
  )

  const { control, handleSubmit, watch } = useForm({
    defaultValues: { ...state?.queryConfig }
  })

  const onSubmit = values => {
    console.log(values)
  }

  console.log(watch())

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
          className="absolute flex flex-col justify-center py-10 h-5/6"
          initial={{ opacity: 0, top: '60%' }}
          animate={{ opacity: 1, top: 'auto' }}
          exit={{ opacity: 0, top: '60%' }}
        >
          <div className="bg-white dark:bg-dark-aside max-w-full w-[470px] h-full rounded shadow-lg flex flex-col">
            <div className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
              <div className="text-2xl font-semibold flex items-center">
                <NavLink
                  to={{
                    pathname: state?.prevFrom || '/',
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
                  pathname: state?.prevFrom || '/',
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
                    name="Title"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <Input
                        placeholder="e.g Kem dưỡng"
                        autoComplete="off"
                        type="text"
                      />
                    )}
                  />
                </div>
              </div>
              <div className="mb-3.5">
                <div className="font-medium">Nhãn hàng</div>
                <div className="mt-1">
                  <Controller
                    name="Manu"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <SelectCategoryProds
                        isClearable
                        value={field.value}
                        onChange={val => {
                          field.onChange(val)
                        }}
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
                      />
                    )}
                  />
                </div>
              </div>
            </PerfectScrollbar>
            <div className="flex justify-end p-5 border-t border-separator dark:border-dark-separator">
              <div className="flex">
                <NavLink
                  to={{
                    pathname: state?.prevFrom || '/',
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
