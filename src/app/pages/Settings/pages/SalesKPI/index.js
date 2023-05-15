import React from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronDoubleDownIcon,
  ChevronRightIcon,
  PlusSmallIcon,
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
import { useMutation } from '@tanstack/react-query'
import SettingsAPI from 'src/_ezs/api/settings.api'
import { toast } from 'react-toastify'

function SalesKPI(props) {
  const methods = useForm({
    defaultValues: {
      updateList: [
        {
          UserID: '',
          Configs: [
            {
              StockIDs: '',
              UserIDs: '',
              Threshold1: '',
              Threshold2: '',
              ProdTypes: '',
              BonusList: ''
            }
          ]
        }
      ]
    }
  })

  const { control, handleSubmit, setValue } = methods

  const { fields, remove, insert } = useFieldArray({
    control,
    name: 'updateList'
  })

  const updateKPIMutation = useMutation({
    mutationFn: body => SettingsAPI.updateSalesKPI(body)
  })

  const onSubmit = values => {
    const dataUpdate = {
      updateList: values?.updateList
        ? values?.updateList.map(item => ({
            ...item,
            UserID: item?.UserID?.value || '',
            UserName: item?.UserID?.label || '',
            Configs: item.Configs
              ? item.Configs.map(config => ({
                  ...config,
                  UserIDs: config?.UserIDs ? config?.UserIDs.join(',') : '',
                  StockIDs: config?.StockIDs
                    ? config?.StockIDs.map(x => x.value).join(',')
                    : '',
                  ProdTypes: config?.ProdTypes
                    ? config?.ProdTypes.map(x => x.value).join(',')
                    : ''
                }))
              : []
          }))
        : []
    }

    updateKPIMutation.mutate(dataUpdate, {
      onSuccess: data => {
        toast.success('Cập nhập thành công')
      },
      onError: error => {
        console.log(error)
      }
    })
  }

  return (
    <div className="w-full min-h-full bg-white border-t border-separator dark:border-[#393945]">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-screen-xl 2xl:max-w-screen-2xl py-10 m-auto"
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
                      <span className="ml-1 text-sm font-medium md:ml-2">
                        KPI Doanh số
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
              <div className="text-3xl font-extrabold">KPI Doanh số</div>
            </div>
            <div>
              <Button
                type="sumbit"
                className="relative flex items-center h-12 px-4 font-medium text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
                loading={updateKPIMutation.isLoading}
                disabled={updateKPIMutation.isLoading}
              >
                Lưu thay đổi
              </Button>
            </div>
          </div>
          {fields &&
            fields.map((item, index) => (
              <Disclosure
                as="div"
                className="border border-gray-200 mb-5 last:mb-0 rounded-md shadow-sm"
                key={item.id}
              >
                {({ open }) => (
                  <>
                    <div
                      className={clsx(
                        'flex justify-between p-4 hover:bg-gray-100',
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
                              isClearable
                              value={field.value}
                              onChange={val => {
                                field.onChange(val)
                                setValue(`updateList[${index}].Configs`, [
                                  {
                                    StockIDs: '',
                                    UserIDs: val?.value ? [val?.value] : '',
                                    Threshold1: '',
                                    Threshold2: '',
                                    ProdTypes: '',
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
                              allOption={[{ value: -1, label: 'Tất cả' }]}
                            />
                          )}
                        />
                        <div className="flex items-center ml-4">
                          <button
                            className="w-8 h-8 flex justify-center items-center text-white rounded-full cursor-pointer bg-success hover:bg-successhv"
                            type="button"
                            onClick={() =>
                              insert(index + 1, {
                                UserID: '',
                                Configs: [
                                  {
                                    StockIDs: '',
                                    UserIDs: '',
                                    Threshold1: '',
                                    Threshold2: '',
                                    ProdTypes: '',
                                    BonusList: ''
                                  }
                                ]
                              })
                            }
                          >
                            <PlusSmallIcon className="w-6" />
                          </button>
                          {fields.length > 1 && (
                            <button
                              className="w-8 h-8 flex justify-center items-center text-white rounded-full cursor-pointer bg-danger hover:bg-dangerhv ml-1.5"
                              type="button"
                              onClick={() => remove(index)}
                            >
                              <XMarkIcon className="w-5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <Disclosure.Button className="w-16 flex justify-center items-center">
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
        </form>
      </FormProvider>
    </div>
  )
}

export default SalesKPI
