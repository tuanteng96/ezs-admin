import React, { Fragment } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import useEscape from 'src/_ezs/hooks/useEscape'
import { m } from 'framer-motion'
import { ArrowSmallLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Button } from 'src/_ezs/partials/button'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import moment from 'moment'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import WarehouseAPI from 'src/_ezs/api/warehouse.api'
import { toast } from 'react-toastify'

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

const schemaChange = yup
  .object({
    date: yup.string().required('Vui lòng chọn ngày')
  })
  .required()

function WareHouseDate(props) {
  const { search, state } = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()

  const queryClient = useQueryClient()

  useEscape(() =>
    navigate({
      pathname: state?.prevFrom || '/catalogue/import-export',
      search: search
    })
  )

  const { control, handleSubmit } = useForm({
    defaultValues: {
      id: id,
      date: ''
    },
    resolver: yupResolver(schemaChange)
  })

  const changeMutation = useMutation({
    mutationFn: body => WarehouseAPI.changeDate(body)
  })

  const onSubmit = values => {
    changeMutation.mutate(
      {
        ...values,
        date: values.date && moment(values.date).format('YYYY-MM-DD')
      },
      {
        onSuccess: ({ data }) => {
          if (data?.error) {
            toast.error(data?.error)
          } else {
            queryClient
              .invalidateQueries({ queryKey: ['ListImportExport'] })
              .then(() => {
                toast.success('Cập nhập thành công.')
                navigate({
                  pathname: state?.prevFrom || '/catalogue/import-export',
                  search: search
                })
              })
          }
        }
      }
    )
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="fixed inset-0 flex items-center justify-center z-[1010]"
      >
        <m.div
          className="absolute inset-0 bg-black/[.2] dark:bg-black/[.4]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() =>
            navigate({
              pathname: state?.prevFrom || '/catalogue/import-export',
              search: search
            })
          }
        ></m.div>
        <m.div
          className="absolute flex flex-col justify-center py-10 max-w-full w-[470px] px-4 sm:px-0"
          initial={{ opacity: 0, top: '60%' }}
          animate={{ opacity: 1, top: 'auto' }}
          exit={{ opacity: 0, top: '60%' }}
        >
          <div className="flex flex-col h-full bg-white rounded shadow-lg dark:bg-dark-aside">
            <div className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
              <div className="flex items-center text-2xl font-semibold">
                <NavLink
                  to={{
                    pathname: state?.prevFrom || '/catalogue/import-export',
                    search: search
                  }}
                  className="mr-2"
                >
                  <ArrowSmallLeftIcon className="w-7" />
                </NavLink>
                Đổi ngày
              </div>
              <NavLink
                to={{
                  pathname: state?.prevFrom || '/catalogue/import-export',
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
                <div className="font-semibold">Ngày chuyển</div>
                <div className="mt-1">
                  <Controller
                    name="date"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <InputDatePicker
                        placeholderText="Chọn ngày"
                        autoComplete="off"
                        onChange={field.onChange}
                        dateFormat="dd/MM/yyyy"
                        selected={field.value ? field.value : null}
                        errorMessageForce={fieldState?.invalid}
                        errorMessage={fieldState?.error?.message}
                        {...field}
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
                    pathname: state?.prevFrom || '/catalogue/import-export',
                    search: search
                  }}
                  type="button"
                  className="relative flex items-center px-4 transition border border-gray-300 rounded shadow-lg dark:border-gray-700 h-11 hover:border-gray-800 focus:outline-none focus:shadow-none"
                >
                  Hủy
                </NavLink>
                <Button
                  loading={changeMutation.isLoading}
                  disabled={changeMutation.isLoading}
                  type="submit"
                  className="relative flex items-center px-4 ml-2 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                >
                  Thực hiện
                </Button>
              </div>
            </div>
          </div>
        </m.div>
      </form>
    </>
  )
}

export default WareHouseDate
