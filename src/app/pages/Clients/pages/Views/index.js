import {
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Button } from 'src/_ezs/partials/button'
import { ClientViewContent } from './ClientViewContent'
import { ClientViewLayout } from './ClientViewContext'
import { CheckInOut } from './components/CheckInOut/CheckInOut'
import { ClientsAside } from './components/ClientsAside/ClientsAside'
import PerfectScrollbar from 'react-perfect-scrollbar'

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

function ClientViews(props) {
  return (
    <ClientViewLayout>
      <ClientViewContent>
        <div className="flex flex-1 h-full">
          <ClientsAside />
          <div className="h-full p-5 flex-1">
            <PerfectScrollbar
              options={perfectScrollbarOptions}
              className="relative flex flex-col h-full overflow-auto scroll"
            >
              {/* <div className="h-full border border-[#d5d7da] dark:border-dark-separator rounded-lg flex items-center justify-center flex-col">
            <svg
              className="w-16 h-auto"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 65"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M32.667 9.833a8 8 0 0 0-8 8h16a8 8 0 0 0-8-8Zm8.944 0a12 12 0 0 0-17.889 0h-9.055a4 4 0 0 0-4 4v42a4 4 0 0 0 4 4h36a4 4 0 0 0 4-4v-42a4 4 0 0 0-4-4H41.61Zm2.37 4c.45 1.273.686 2.625.686 4v2a2 2 0 0 1-2 2h-20a2 2 0 0 1-2-2v-2c0-1.375.236-2.727.686-4h-6.686v42h36v-42H43.98Z"
                fill="url(#a)"
              />
              <path
                d="M45.114 29.12a2 2 0 0 1-.067 2.827l-14.675 14a2 2 0 0 1-2.762-.001l-7.325-7a2 2 0 1 1 2.764-2.892l5.944 5.68 13.293-12.681a2 2 0 0 1 2.828.066Z"
                fill="url(#b)"
              />
              <defs>
                <linearGradient
                  id="a"
                  x1="17.234"
                  y1="13.893"
                  x2="54.531"
                  y2="44.283"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#7C6BFF" />
                  <stop offset={1} stopColor="#473DAD" />
                </linearGradient>
                <linearGradient
                  id="b"
                  x1="17.234"
                  y1="13.893"
                  x2="54.531"
                  y2="44.283"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#7C6BFF" />
                  <stop offset={1} stopColor="#473DAD" />
                </linearGradient>
              </defs>
            </svg>
            <div className="mt-3 mb-5 text-2xl font-bold">
              Không có dịch vụ nào.
            </div>
            <div className="max-w-lg mx-auto text-center font-semibold text-[15px] leading-6">
              Vào
              <span className="px-1 font-bold underline cursor-pointer text-primaryhv">
                Quản lý thẻ dịch vụ
              </span>
              để sử dụng dịch vụ cho khách hàng.
              <br />
              Khách hàng chưa có hoặc mua mới vui lòng chọn
              <span className="text-primaryhv px-1.5 font-bold underline cursor-pointer">
                Đăng ký mới
              </span>
              để đăng ký buổi lẻ, thẻ liệu trình, thẻ tiền ....
            </div>
          </div> */}
              <div className="min-h-full flex flex-col">
                <div className="mb-5 bg-white rounded shadow-sm dark:bg-dark-aside grow last:mb-0">
                  <div className="px-5 py-3.5 font-inter uppercase font-bold border-b border-separator">
                    Dịch vụ đang thực hiện
                  </div>
                  <div className="flex p-5 text-[13px] text-muted2 uppercase font-inter font-semibold">
                    <div className="w-14">Ảnh</div>
                    <div className="flex-1 pl-5">Dịch vụ thực hiện</div>
                    <div className="pl-5 w-[170px]">Thời gian</div>
                    <div className="flex-1 pl-5">Nhân viên</div>
                    <div className="w-6"></div>
                  </div>
                  <div>
                    {Array(2)
                      .fill()
                      .map((_, index) => (
                        <div
                          className="flex items-center text-[15px] p-5 border-t border-separator border-dashed cursor-pointer"
                          key={index}
                        >
                          <div className="w-14">
                            <img
                              className="object-cover rounded-full h-14"
                              src="https://cser.vn/Upload/image/2022/12/27/buoi-le-cham-soc-da-co-ban_2022-12-27-142755.jpg"
                              alt=""
                            />
                          </div>
                          <div className="flex-1 pl-5">
                            <div className="font-bold">
                              Chăm sóc da cơ bản trải nghiệm
                            </div>
                            <div className="font-semibold text-muted2">
                              Phụ phí làm ngoài giờ
                            </div>
                          </div>
                          <div className="w-[170px] font-bold pl-5">
                            15:30 22/03/2023
                          </div>
                          <div className="flex-1 pl-5 font-bold">
                            Nguyễn Tài Tuấn - 80.000, Nguyễn Lan Anh - 40.000
                          </div>
                          <div className="flex items-center justify-end w-6">
                            <ChevronRightIcon className="w-5 text-muted" />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="mb-5 bg-white rounded shadow-sm dark:bg-dark-aside last:mb-0">
                  <div className="px-5 py-3.5 font-inter uppercase font-bold border-b border-separator">
                    Thanh toán nợ
                  </div>
                  <div className="flex p-5 text-muted2 font-semibold uppercase text-[13px] font-inter">
                    <div className="w-[145px]">Đơn hàng</div>
                    <div className="flex-1 pl-5">Mặt hàng</div>
                    <div className="flex-1 pl-5">Nhân viên</div>
                    <div className="pl-5 w-[125px]">Giá trị</div>
                    <div className="w-6"></div>
                  </div>
                  <div>
                    {Array(1)
                      .fill()
                      .map((_, index) => (
                        <div
                          className="p-5 border-t border-separator border-dashed cursor-pointer flex items-center text-[15px]"
                          key={index}
                        >
                          <div className="w-[145px]">
                            <div className="font-bold">#32857</div>
                            <div className="text-sm font-semibold text-muted2">
                              15:30 22/03/2023
                            </div>
                          </div>
                          <div className="flex-1 col-span-2 pl-5 font-bold">
                            Thẻ dịch vụ triệt lông, Kem trị nám Body
                          </div>
                          <div className="flex-1 pl-5 font-bold">
                            Nguyễn Tài Tuấn - 80.000
                          </div>
                          <div className="font-bold pl-5 w-[125px]">
                            200.000.000
                          </div>
                          <div className="flex items-center justify-end w-5">
                            <ChevronRightIcon className="w-6 text-muted" />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </PerfectScrollbar>
          </div>
        </div>
        <div className="w-[360px] pt-5">
          <div className="flex flex-col h-full rounded shahdow-lg">
            <div className="flex justify-between px-5 py-3.5 border-b border-separator dark:border-dark-separator bg-white dark:bg-dark-aside">
              <div className="font-semibold uppercase font-inter">Đơn hàng</div>
              <div className="flex items-center font-semibold cursor-pointer text-primary">
                <PlusIcon className="w-4 mr-1" />
                Thêm mặt hàng
              </div>
            </div>
            <PerfectScrollbar
              options={perfectScrollbarOptions}
              className="scroll relative flex flex-col justify-between px-5 py-3.5 grow overflow-auto bg-white dark:bg-dark-aside"
            >
              <div>
                <div className="flex justify-between mb-4 text-muted2 text-[15px]">
                  <div>Mặt hàng</div>
                  <div>Thành tiền</div>
                </div>
                <div>
                  <div className="text-[15px] flex justify-between pb-3 mb-3 border-b cursor-pointer border-separator dark:border-dark-separator">
                    <div className="w-[calc(100%-100px)] pr-3">
                      <div className="mb-px font-semibold text-primary">
                        Nước hoa hồng
                      </div>
                      <div className="text-muted">NG 900.000₫</div>
                    </div>
                    <div className="w-[100px] flex items-end flex-col">
                      <div className="mb-px text-right text-muted2">x2</div>
                      <div>1.800.000₫</div>
                    </div>
                  </div>
                  <div className="text-[15px] flex items-end justify-between pb-3 mb-3 border-b cursor-pointer border-separator dark:border-dark-separator">
                    <div className="w-[calc(100%-100px)] pr-3">
                      <div className="w-full mb-px font-semibold truncate text-primary">
                        Chăm sóc da cơ bản trải nghiệm
                      </div>
                      <div className="text-muted2">NG 500.000</div>
                    </div>
                    <div className="w-[100px] flex items-end flex-col">
                      <div className="mb-px text-right text-muted2">x10</div>
                      <div>5.000.000</div>
                    </div>
                  </div>
                  <div className="text-[15px] flex justify-between pb-3 mb-3 cursor-pointer">
                    <div className="w-[calc(100%-100px)] pr-3">
                      <div className="mb-px font-semibold text-primary">
                        Thẻ tiền 10 triệu
                      </div>
                      <div className="text-muted2">NG 10.000.000₫</div>
                    </div>
                    <div className="w-[100px] flex items-end flex-col">
                      <div className="mb-px text-right text-muted2">x1</div>
                      <div>10.000.000₫</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-[15px]">
                <div className="flex justify-between">
                  <div>Tổng</div>
                  <div className="font-semibold">16.800.000₫</div>
                </div>
                <div className="flex justify-between mt-2">
                  <div>Mã giảm giá</div>
                  <div className="font-semibold cursor-pointer text-primary">
                    Chọn Voucher
                  </div>
                </div>
              </div>
            </PerfectScrollbar>
            <div className="px-5 pt-3.5 py-5 border-t border-separator dark:border-dark-separator bg-white dark:bg-dark-aside">
              <div className="flex items-end justify-between mb-4">
                <div className="font-medium">Tổng thanh toán</div>
                <div className="text-lg font-bold text-orange">16.800.000₫</div>
              </div>
              <div>
                <div className="flex">
                  <Button className="flex items-center justify-center w-12 h-12 mr-2 font-semibold text-gray-900 bg-white border rounded border-light dark:bg-dark-light dark:border-dark-separator dark:text-graydark-800 hover:text-primary dark:hover:text-primary">
                    <EllipsisHorizontalIcon className="w-7" />
                  </Button>
                  <Button className="relative flex items-center justify-center flex-1 w-full h-12 pl-5 pr-10 text-sm font-bold text-white uppercase transition rounded shadow-lg font-inter bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70">
                    Thanh toán
                  </Button>
                </div>
              </div>
            </div>
            <CheckInOut />
          </div>
        </div>
      </ClientViewContent>
      <Outlet />
    </ClientViewLayout>
  )
}

export default ClientViews
