import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import {
  ChevronDoubleDownIcon,
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm
} from 'react-hook-form'
import { SelectUserAdmin } from 'src/_ezs/partials/select'
import { Button } from 'src/_ezs/partials/button'
import { Disclosure } from '@headlessui/react'
import clsx from 'clsx'
import { UserKPI } from './components/UserKPI/UserKPI'
import { useMutation, useQuery } from '@tanstack/react-query'
import SettingsAPI from 'src/_ezs/api/settings.api'
import { useRoles } from 'src/_ezs/hooks/useRoles'
import Select from 'react-select'
import { toAbsoluteUrl } from 'src/_ezs/utils/assetPath'
import { toast } from 'react-toastify'

const getStockName = (Stocks, StockID) => {
  if (!StockID) return ''
  let index = Stocks && Stocks.findIndex(x => x.value === StockID)
  if (index > -1) {
    return ' - ' + Stocks[index].label
  }
  return ''
}

function SalesKPI(props) {
  const { kpi_doanhso } = useRoles('kpi_doanhso')
  const [filters, setFilters] = useState()
  const methods = useForm({
    defaultValues: {
      updateList: [
        // {
        //   UserID: '',
        //   Configs: [
        //     {
        //       StockIDs: '',
        //       UserIDs: '',
        //       Threshold1: '',
        //       Threshold2: '',
        //       ProdTypes: '',
        //       BonusList: ''
        //     }
        //   ]
        // }
      ]
    }
  })

  const { control, handleSubmit, setValue, watch } = methods
  const { fields, remove, insert } = useFieldArray({
    control,
    name: 'updateList'
  })

  const { isLoading, refetch } = useQuery({
    queryKey: [
      'ListSalesKPIs',
      { StockRoles: kpi_doanhso.StockRoles, filters }
    ],
    queryFn: async () => {
      const data = await SettingsAPI.getSalesKPI({
        StockIDs: !filters
          ? kpi_doanhso.StockRoles.map(x => x.value)
          : [filters.value]
      })
      return data
    },
    onSuccess: ({ data }) => {
      if (data && data.list && data.list.length > 0) {
        const newValues = data.list
          .map(item => ({
            order: item?.UserID === -1 ? 0 : item?.UserID === -2 ? 1 : 2,
            UserID: {
              label:
                item.UserName +
                getStockName(kpi_doanhso.StockRoles, item.Configs[0].StockID),
              value: item.UserID
            },
            Configs:
              item.Configs && item.Configs.length > 0
                ? item.Configs.map(x => ({
                    ...x,
                    isDisabled:
                      item.UserID === -1 && !kpi_doanhso.IsStocks ? true : false
                  }))
                : [],
            isDisabled:
              item.UserID === -1 && !kpi_doanhso.IsStocks ? true : false
          }))
          .sort((a, b) => a.order - b.order)
        setValue('updateList', newValues)
      } else {
        setValue('updateList', [])
      }
    },
    enabled: kpi_doanhso.StockRoles && kpi_doanhso.StockRoles.length > 0,
    cacheTime: 0
  })

  const updateKPIMutation = useMutation({
    mutationFn: body => SettingsAPI.updateSalesKPI(body)
  })
  const onSubmit = values => {
    const dataUpdate = {
      updateList: values?.updateList
        ? values?.updateList
            .map(item => ({
              ...item,
              UserID: item?.UserID?.value || '',
              UserName: item?.UserID?.label || '',
              StockID:
                item?.UserID?.value === -2 ? item.Configs[0].StockID : '',
              Configs: item.Configs
                ? item.Configs.map(config => ({
                    ...config
                  }))
                : []
            }))
            .filter(x => x.UserID)
        : [],
      StockIDs: kpi_doanhso.StockRoles.map(x => x.value)
    }
    updateKPIMutation.mutate(dataUpdate, {
      onSuccess: data => {
        refetch().then(() => toast.success('Cập nhập thành công'))
      },
      onError: error => {
        console.log(error)
      }
    })
  }

  return (
    <>
      <div className="w-full min-h-full bg-white dark:bg-dark-app">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-screen-xl py-8 m-auto 2xl:max-w-screen-2xl"
          >
            <div className="flex items-end justify-between mb-8">
              <div>
                <nav className="flex mb-3" aria-label="Breadcrumb">
                  <ol className="inline-flex items-center space-x-1 md:space-x-2">
                    <li className="inline-flex items-center">
                      <Link
                        to="/settings"
                        className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                      >
                        Cài đặt
                      </Link>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <ChevronRightIcon className="w-3.5 text-muted2" />
                        <span className="ml-1 text-sm font-medium md:ml-2 dark:text-white">
                          KPI Doanh số
                        </span>
                      </div>
                    </li>
                  </ol>
                </nav>
                <div className="text-3xl font-extrabold dark:text-white">
                  KPI Doanh số
                </div>
              </div>
              <div className="flex">
                <Select
                  className="w-64 mr-2 select-control"
                  classNamePrefix="select"
                  isLoading={false}
                  isClearable
                  isSearchable
                  placeholder="Lọc theo cơ sở"
                  options={kpi_doanhso.StockRoles}
                  value={filters}
                  onChange={val => setFilters(val)}
                />
                <Link
                  to="classify"
                  className="flex items-center px-4 font-semibold text-gray-900 transition bg-white border rounded border-light h-12 dark:bg-transparent dark:border-dark-separator dark:text-graydark-800 hover:text-primary dark:hover:text-primary mr-2"
                >
                  Phân loại KPI
                </Link>
                <Button
                  type="button"
                  className="relative flex items-center h-12 px-4 mr-2 font-medium text-white transition rounded shadow-lg bg-success hover:bg-success focus:outline-none focus:shadow-none disabled:opacity-70"
                  onClick={() =>
                    insert(0, {
                      UserID: '',
                      Configs: [
                        {
                          StockID: '',
                          UserIDs: [],
                          Threshold1: '',
                          Threshold2: '',
                          ProdTypes: [{ value: -1, label: 'Tất cả' }],
                          BonusList: ''
                        }
                      ]
                    })
                  }
                >
                  Thêm mới
                </Button>
                <Button
                  hideText={updateKPIMutation.isLoading}
                  type="sumbit"
                  className="relative flex items-center w-32 h-12 px-4 font-medium text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
                  loading={updateKPIMutation.isLoading}
                  disabled={updateKPIMutation.isLoading}
                >
                  Lưu thay đổi
                </Button>
              </div>
            </div>
            {isLoading && (
              <div>
                {Array(3)
                  .fill()
                  .map((_, index) => (
                    <div
                      className="mb-5 border border-gray-200 rounded-md shadow-sm dark:border-gray-800 last:mb-0"
                      key={index}
                    >
                      <div className="flex justify-between p-4 animate-pulse">
                        <div>
                          <div className="h-[50px] bg-gray-200 rounded-sm dark:bg-gray-700 w-72"></div>
                        </div>
                        <ChevronDoubleDownIcon className="w-5" />
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {!isLoading && (
              <>
                {fields &&
                  fields.map((item, index) => (
                    <Disclosure
                      as="div"
                      className="mb-5 overflow-hidden border border-gray-200 rounded-md shadow-sm dark:border-gray-800 last:mb-0"
                      key={item.id}
                    >
                      {({ open }) => (
                        <>
                          <div
                            className={clsx(
                              'flex justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-dark-app',
                              open && 'bg-gray-100'
                            )}
                          >
                            <div className="flex">
                              <Controller
                                name={`updateList[${index}].UserID`}
                                control={control}
                                render={({
                                  field: { ref, ...field },
                                  fieldState
                                }) => (
                                  <SelectUserAdmin
                                    isDisabled={item.isDisabled}
                                    StockRoles={kpi_doanhso?.StockRolesAll}
                                    isClearable
                                    value={field.value}
                                    onChange={val => {
                                      field.onChange(val)
                                      setValue(`updateList[${index}].Configs`, [
                                        {
                                          StockID: '',
                                          UserIDs:
                                            val?.value &&
                                            val?.value !== -1 &&
                                            val?.value !== -2
                                              ? [val?.value]
                                              : [],
                                          Threshold1: '',
                                          Threshold2: '',
                                          ProdTypes: [
                                            { value: -1, label: 'Tất cả' }
                                          ],
                                          BonusList: ''
                                        }
                                      ])
                                    }}
                                    className="select-control w-80"
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    styles={{
                                      menuPortal: base => ({
                                        ...base,
                                        zIndex: 9999
                                      })
                                    }}
                                    allOption={
                                      kpi_doanhso.IsStocks
                                        ? [
                                            {
                                              value: -1,
                                              label: 'Tất cả hệ thống'
                                            },
                                            {
                                              value: -2,
                                              label: 'Theo cơ sở'
                                            }
                                          ]
                                        : [
                                            {
                                              value: -2,
                                              label: 'Theo cơ sở'
                                            }
                                          ]
                                    }
                                    removes={watch().updateList.map(
                                      x => x?.UserID?.value || ''
                                    )}
                                  />
                                )}
                              />
                              <div className="flex items-center ml-2">
                                <button
                                  className="w-8 h-8 flex justify-center items-center text-white rounded-full cursor-pointer bg-danger hover:bg-dangerhv ml-1.5"
                                  type="button"
                                  onClick={() => remove(index)}
                                >
                                  <XMarkIcon className="w-5" />
                                </button>
                              </div>
                            </div>
                            <Disclosure.Button className="flex items-center justify-center w-16">
                              <ChevronDoubleDownIcon
                                className={clsx(
                                  'w-5 transition-all',
                                  open && 'rotate-180'
                                )}
                              />
                            </Disclosure.Button>
                          </div>
                          <Disclosure.Panel>
                            <UserKPI indexUser={index} />
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                {(!fields || fields.length === 0) && (
                  <div className="flex flex-col items-center justify-center pt-10">
                    <img
                      className="max-w-sm"
                      src={toAbsoluteUrl('/assets/svg/sketchy/5.png')}
                      alt="Chưa có cấu hình"
                    />
                  </div>
                )}
              </>
            )}
          </form>
        </FormProvider>
      </div>
      <Outlet />
    </>
  )
}

export default SalesKPI
