import React from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import FixedLayout from 'src/_ezs/layout/FixedLayout'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useLocation, useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import {
  Checkbox,
  Input,
  InputDatePickerInline,
  InputTextarea,
  InputTimePicker
} from 'src/_ezs/partials/forms'
import { SelectProdService, SelectStocks } from 'src/_ezs/partials/select'
import { SelectUserService } from 'src/_ezs/partials/select/SelectUserService'
import { useAuth } from 'src/_ezs/core/Auth'
import { Button } from 'src/_ezs/partials/button'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

const schemaBook = yup
  .object({
    FullName: yup.string().required('Vui lòng nhập họ và tên'),
    Email: yup
      .string()
      .email('Email không đúng định dạng')
      .required('Vui lòng nhập Email'),
    MobilePhone: yup.string().required('Vui lòng nhập số điện thoại')
  })
  .required()

function AddEdit(props) {
  const { CrStocks } = useAuth()
  const { state } = useLocation()
  const navigate = useNavigate()
  const { control, handleSubmit, setValue, setError, reset } = useForm({
    defaultValues: {
      MemberIDs: '',
      AtHome: false,
      Desc: '',
      booking: [
        {
          BookDate: new Date(),
          Time: moment(new Date())
            .endOf('hour')
            .add(1, 'minutes')
            .format('HH:mm'),
          Desc: '',
          IsAnonymous: false,
          MemberID: '',
          RootIdS: '',
          Status: 'XAC_NHAN',
          StockID: CrStocks.ID,
          UserServiceIDs: ''
        }
      ]
    },
    resolver: yupResolver(schemaBook)
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'booking'
  })

  const onSubmit = values => {}

  return (
    <FixedLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex flex-col h-full"
        autoComplete="off"
      >
        <div className="transition border-b z-[10] border-separator dark:border-dark-separator bg-white dark:bg-dark-aside">
          <div className="flex justify-center px-5 h-[85px] relative">
            <div className="flex items-center justify-center col-span-2 text-3xl font-extrabold transition dark:text-white">
              Đặt lịch mới
            </div>
            <div className="absolute top-0 flex items-center justify-center h-full right-5">
              <div
                className="flex items-center justify-center w-12 h-12 cursor-pointer dark:text-graydark-800"
                onClick={() => navigate(state?.previousPath || '/calendar')}
              >
                <XMarkIcon className="w-9" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex grow h-[calc(100%-85px)]">
          <div className="relative flex-1 border-r border-separator dark:border-dark-separator z-[10] dark:bg-dark-aside">
            <div className="h-full px-5 py-6 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded">
              <div className="max-w-[850px] m-auto">
                <ol className="relative mb-10 border-l-2 border-gray-300 border-dashed dark:border-gray-700">
                  {fields.map((item, index) => (
                    <li className="relative pb-10 pl-8 last:pb-0" key={item.id}>
                      <span
                        className={clsx(
                          "absolute ring-8 ring-white bg-white flex items-center justify-center w-7 h-7 font-bold text-[15px] border-2 border-primary text-primary rounded-full top-[100px] -left-[14px] before:w-[2px] before:absolute before:content-[''] before:bg-white before:right-[12px] before:bottom-[calc(100%+2px)]",
                          index === 0 && 'before:h-[100px]'
                        )}
                      >
                        {index + 1}
                      </span>
                      <div className="flex items-center justify-between mb-5">
                        <Controller
                          name={`booking[${index}].BookDate`}
                          control={control}
                          render={({
                            field: { ref, ...field },
                            fieldState
                          }) => (
                            <>
                              <InputDatePickerInline
                                className="flex items-center text-xl font-bold font-inter"
                                iconClassName="w-5 transition ml-2"
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </>
                          )}
                        />
                        {fields.length > 1 && (
                          <div
                            className="flex items-center justify-center w-8 h-8 text-gray-900 transition rounded-full cursor-pointer bg-light hover:bg-dangerlight hover:text-danger"
                            onClick={() => remove(index)}
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      <div className="p-6 border border-gray-300 rounded-lg dark:border-graydark-300">
                        <div className="grid grid-cols-5 gap-5">
                          <div className="col-span-2">
                            <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
                              Thời gian
                            </div>
                            <Controller
                              name={`booking[${index}].Time`}
                              control={control}
                              render={({
                                field: { ref, ...field },
                                fieldState
                              }) => (
                                <InputTimePicker
                                  placeholder="Chọn thời gian"
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              )}
                            />
                          </div>
                          <div className="col-span-3">
                            <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
                              Cơ sở
                            </div>
                            <Controller
                              name={`booking[${index}].StockID`}
                              control={control}
                              render={({
                                field: { ref, ...field },
                                fieldState
                              }) => (
                                <SelectStocks
                                  value={field.value}
                                  onChange={val =>
                                    field.onChange(val?.value || '')
                                  }
                                  className="select-control"
                                  menuPosition="fixed"
                                  styles={{
                                    menuPortal: base => ({
                                      ...base,
                                      zIndex: 9999
                                    })
                                  }}
                                  menuPortalTarget={document.body}
                                />
                              )}
                            />
                          </div>
                          <div className="col-span-2">
                            <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
                              Dịch vụ
                            </div>
                            <Controller
                              name={`booking[${index}].RootIdS`}
                              control={control}
                              render={({
                                field: { ref, ...field },
                                fieldState
                              }) => (
                                <SelectProdService
                                  className="select-control"
                                  value={field.value}
                                  onChange={val => {
                                    field.onChange(val)
                                    append({
                                      AtHome: false,
                                      BookDate: new Date(),
                                      Time: moment(new Date())
                                        .endOf('hour')
                                        .add(1, 'minutes')
                                        .format('HH:mm'),
                                      Desc: '',
                                      IsAnonymous: false,
                                      MemberID: '',
                                      RootIdS: '',
                                      Status: 'XAC_NHAN',
                                      StockID: CrStocks.ID,
                                      UserServiceIDs: ''
                                    })
                                  }}
                                />
                              )}
                            />
                          </div>
                          <div className="col-span-3">
                            <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
                              Nhân viên thực hiện
                            </div>
                            <Controller
                              name={`booking[${index}].UserServiceIDs`}
                              control={control}
                              render={({
                                field: { ref, ...field },
                                fieldState
                              }) => (
                                <SelectUserService
                                  value={field.value}
                                  onChange={val => field.onChange(val)}
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
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
                <div>
                  <div className="mb-1.5 text-base text-gray-900 font-inter font-semibold dark:text-graydark-800">
                    Ghi chú đặt lịch
                  </div>
                  <Controller
                    name="Desc"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <InputTextarea
                        className="resize-none"
                        rows={3}
                        placeholder="Nhập ghi chú"
                        autoComplete="off"
                        type="text"
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className="mt-4">
                  <Controller
                    name="AtHome"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <Checkbox
                        labelClassName="text-gray-800 dark:text-gray-800 font-semibold text-[15px] pl-3"
                        labelText="Thực hiện các dịch vụ của khách hàng tại nhà."
                        htmlFor="khong_ha_cap"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-black/[.2] dark:bg-black/[.4]"></div>
          </div>
          <div className="w-[450px] flex flex-col shadow-lg">
            <div className="p-5 border-b border-separator dark:border-dark-separator">
              <div className="relative">
                <Input className="pl-12" placeholder="Nhập tên khách hàng" />
                <MagnifyingGlassIcon className="absolute w-6 text-gray-500 pointer-events-none dark:text-graydark-500 top-2/4 -translate-y-2/4 left-3" />
              </div>
            </div>
            <div className="grow"></div>
            <div className="grid grid-cols-2 gap-4 p-5 border-t border-separator dark:border-dark-separator">
              <button
                onClick={() => navigate(state?.previousPath || '/calendar')}
                type="submit"
                className="relative flex items-center justify-center w-full h-12 px-4 font-bold text-black transition border border-gray-400 rounded hover:border-gray-900 focus:outline-none focus:shadow-none disabled:opacity-70"
              >
                Hủy
              </button>
              <Button
                type="submit"
                className="relative flex items-center justify-center w-full h-12 px-4 font-bold text-white transition rounded bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
              >
                Đặt lịch ngay
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FixedLayout>
  )
}

export default AddEdit
