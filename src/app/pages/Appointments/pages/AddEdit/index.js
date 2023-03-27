import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import FixedLayout from 'src/_ezs/layout/FixedLayout'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useLocation, useNavigate } from 'react-router-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import {
  Checkbox,
  Input,
  InputTextarea,
  InputTimePicker
} from 'src/_ezs/partials/forms'
import { SelectProdService, SelectStocks } from 'src/_ezs/partials/select'
import { SelectUserService } from 'src/_ezs/partials/select/SelectUserService'

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

const initialValues = {
  MemberIDs: '',
  booking: [
    {
      AtHome: false,
      BookDate: '2023-03-27 09:41',
      Desc: '',
      IsAnonymous: false,
      MemberID: 32377,
      RootIdS: '17275',
      Status: 'XAC_NHAN',
      StockID: 8975,
      UserServiceIDs: ''
    }
  ]
}

function AddEdit(props) {
  const { state } = useLocation()
  const navigate = useNavigate()

  const { control, handleSubmit, setValue, setError, reset } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schemaBook)
  })

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: 'booking'
    }
  )

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
            <div className="absolute top-0 right-5 h-full flex items-center justify-center">
              <div
                className="flex items-center justify-center w-12 h-12 cursor-pointer dark:text-graydark-800"
                onClick={() => navigate(state?.previousPath || '/clients')}
              >
                <XMarkIcon className="w-9" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex grow h-[calc(100%-85px)]">
          <div className="flex-1 border-r z-[10] border-separator dark:border-dark-separator px-5 py-6 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded dark:bg-dark-aside">
            <div className="max-w-3xl m-auto">
              <ol className="relative mb-10 border-l-2 border-dashed border-gray-300 dark:border-gray-700">
                {fields.map((item, index) => (
                  <li className="pb-10 pl-8 last:pb-0 relative" key={item.id}>
                    <span
                      className={clsx(
                        "absolute ring-8 ring-white bg-white flex items-center justify-center w-7 h-7 font-bold text-[15px] border-2 border-primary text-primary rounded-full top-[100px] -left-[14px] before:w-[2px] before:absolute before:content-[''] before:bg-white before:right-[12px] before:bottom-[calc(100%+2px)]",
                        index === 0 && 'before:h-[100px]'
                      )}
                    >
                      {index + 1}
                    </span>
                    <div className="flex justify-between items-center mb-5">
                      <div className="text-xl font-inter font-bold">
                        Monday, 27 Mar 2023
                      </div>
                      <div className="w-8 h-8 flex items-center justify-center cursor-pointer bg-light hover:bg-dangerlight hover:text-danger transition text-gray-900 rounded-full">
                        <XMarkIcon className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="p-6 rounded-lg border border-gray-300 dark:border-graydark-300">
                      <div className="grid grid-cols-5 gap-5">
                        <div className="col-span-2">
                          <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
                            Thời gian
                          </div>
                          <InputTimePicker
                            placeholder="Chọn thời gian"
                            value={'12:00'}
                          />
                        </div>
                        <div className="col-span-3">
                          <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
                            Cơ sở
                          </div>
                          <SelectStocks
                            className="select-control"
                            menuPosition="fixed"
                            styles={{
                              menuPortal: base => ({ ...base, zIndex: 9999 })
                            }}
                            menuPortalTarget={document.body}
                          />
                        </div>
                        <div className="col-span-2">
                          <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
                            Nhân viên thực hiện
                          </div>
                          <SelectUserService
                            className="select-control"
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={{
                              menuPortal: base => ({ ...base, zIndex: 9999 })
                            }}
                          />
                        </div>
                        <div className="col-span-3">
                          <div className="mb-1.5 text-base text-gray-900 font-semibold dark:text-graydark-800">
                            Dịch vụ
                          </div>
                          <SelectProdService className="select-control" />
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
                <InputTextarea
                  className="resize-none"
                  rows={3}
                  placeholder="Nhập ghi chú"
                  autoComplete="off"
                  type="text"
                />
              </div>
              <div className="mt-4">
                <Checkbox
                  labelClassName="text-gray-800 dark:text-gray-800 font-semibold text-[15px] pl-3"
                  labelText="Thực hiện các dịch vụ của khách hàng tại nhà."
                  htmlFor="khong_ha_cap"
                />
              </div>
            </div>
          </div>
          <div className="w-[450px]">a</div>
        </div>
      </form>
    </FixedLayout>
  )
}

export default AddEdit
