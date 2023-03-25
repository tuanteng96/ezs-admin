import { XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import React from 'react'
import { useLocation, useMatch, useNavigate, useParams } from 'react-router-dom'
import FixedLayout from 'src/_ezs/layout/FixedLayout'
import { Button } from 'src/_ezs/partials/button'
import { UploadAvatar } from 'src/_ezs/partials/files'
import { Input, InputTextarea } from 'src/_ezs/partials/forms'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import Select from 'react-select'

function ClientAddEdit(props) {
  //console.log(useMatch('/clients/add'))
  const { id } = useParams()
  //console.log(Boolean(id > 0))
  //console.log(useLocation())
  const { pathname, state } = useLocation()

  const navigate = useNavigate()
  console.log(state?.previousPath)
  return (
    <FixedLayout>
      <form className="relative flex flex-col h-full" autoComplete="off">
        <div className="transition border-b z-[10] border-separator dark:border-dark-separator bg-white dark:bg-dark-aside">
          <div className="grid justify-between grid-cols-4 gap-4 px-5 h-[85px]">
            <div className="flex items-center">
              <div
                className="flex items-center justify-center w-12 h-12 cursor-pointer dark:text-graydark-800"
                onClick={() => navigate(state?.previousPath || '/clients')}
              >
                <XMarkIcon className="w-9" />
              </div>
            </div>
            <div className="flex items-center justify-center col-span-2 text-3xl font-extrabold transition dark:text-white">
              Thêm mới khách hàng
            </div>
            <div className="flex items-center justify-end">
              <Button className="relative flex items-center h-12 px-4 font-medium text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70">
                Thêm mới
              </Button>
            </div>
          </div>
        </div>
        <div className="relative overflow-auto grow scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded py-6 dark:bg-dark-aside">
          <div className="container max-w-4xl">
            <div className="border border-separator dark:border-dark-separator rounded">
              <div className="border-b border-separator dark:border-dark-separator px-5 py-3 font-semibold font-inter text-2xl dark:text-white">
                Thông tin cơ bản
              </div>
              <div className="flex p-5">
                <div className="w-[176px]">
                  <UploadAvatar
                  //value="https://preview.keenthemes.com/metronic8/demo1/assets/media/avatars/300-1.jpg"
                  //placeholder="Các tệp cho phép: png, jpg, jpeg."
                  //errorMessageForce={true}
                  //onChange={field.onChange}
                  />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-5 pl-6">
                  <div>
                    <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                      Họ và tên
                    </div>
                    <Input placeholder="Nhập họ và tên" />
                  </div>
                  <div>
                    <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                      Ngày sinh
                    </div>
                    <InputDatePicker placeholderText="Chọn ngày sinh" />
                  </div>
                  <div>
                    <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                      Số điện thoại
                    </div>
                    <Input placeholder="Nhập số điện thoại" />
                  </div>
                  <div>
                    <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                      Email
                    </div>
                    <Input placeholder="Nhập Email" />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                  Ghi chú
                  <span className="text-muted font-normal font-sans pl-1">
                    ( Tùy chọn )
                  </span>
                </div>
                <InputTextarea
                  className="resize-none"
                  rows={3}
                  placeholder="Nhập ghi chú"
                />
              </div>
              <div className="p-5 border-t border-separator dark:border-dark-separator">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                      Thành phố
                    </div>
                    <Select
                      className="select-control"
                      classNamePrefix="select"
                      options={[]}
                      placeholder="Chọn Thành phố"
                    />
                  </div>
                  <div>
                    <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                      Quận huyện
                    </div>
                    <Select
                      className="select-control"
                      classNamePrefix="select"
                      options={[
                        {
                          value: 'Quận Ba Đình',
                          label: 'Quận Ba Đình'
                        },
                        {
                          value: '2',
                          label: 'Quận Thanh hóa'
                        }
                      ]}
                      placeholder="Chọn Quận huyện"
                    />
                  </div>
                  <div>
                    <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                      Nhân viên phụ trách
                    </div>
                    <Select
                      className="select-control"
                      classNamePrefix="select"
                      options={[]}
                      placeholder="Chọn nhân viên"
                    />
                  </div>
                  <div>
                    <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                      Nguồn
                    </div>
                    <Select
                      className="select-control"
                      classNamePrefix="select"
                      options={[
                        {
                          value: 'Quận Ba Đình',
                          label: 'Quận Ba Đình'
                        },
                        {
                          value: '2',
                          label: 'Quận Thanh hóa'
                        }
                      ]}
                      placeholder="Chọn nguồn"
                    />
                  </div>
                  <div>
                    <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                      Mã vạch
                    </div>
                    <Input placeholder="Nhập mã vạch" />
                  </div>
                  <div>
                    <div className="mb-1.5 text-base text-gray-900 dark:text-graydark-900 font-inter font-medium dark:text-graydark-800">
                      Giữ nhóm
                    </div>
                    <div className="flex items-center pl-4 border border-gray-300 rounded dark:border-gray-300">
                      <label
                        htmlFor="bordered-checkbox-1"
                        className="checkbox w-full py-3 font-medium text-gray-900 dark:text-gray-300 cursor-pointer flex"
                      >
                        <input
                          className="absolute opacity-0"
                          id="bordered-checkbox-1"
                          type="checkbox"
                          defaultValue
                          name="bordered-checkbox"
                        />
                        <span className="w-[22px] h-[22px] bg-[#EBEDF3] rounded block icon checkbox-primary relative after:absolute after:left-2 after:top-1 transition"></span>
                        <span className="pl-2">Không hạ cấp</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-separator dark:border-dark-separator rounded mt-5">
              <div className="border-b border-separator dark:border-dark-separator px-5 py-3 font-semibold font-inter text-2xl dark:text-white">
                Nhóm thành viên
              </div>
              <div className="p-6 flex">
                <div className="mr-6">
                  <label
                    htmlFor="bordered-checkbox-a"
                    className="checkbox w-full font-medium text-gray-900 dark:text-gray-300 cursor-pointer flex"
                  >
                    <input
                      className="absolute opacity-0"
                      id="bordered-checkbox-a"
                      type="checkbox"
                      defaultValue
                      name="bordered-checkbox"
                    />
                    <span className="w-[20px] h-[20px] bg-[#EBEDF3] rounded block icon checkbox-primary relative after:absolute after:left-2 after:top-[3px] transition"></span>
                    <span className="pl-2">Bạc</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FixedLayout>
  )
}

export default ClientAddEdit
