import {
  ArrowLeftOnRectangleIcon,
  ChatBubbleBottomCenterTextIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'src/_ezs/partials/button'

function ClientViews(props) {
  return (
    <div className="flex h-full ">
      <div className="flex flex-1 h-full">
        <div className="w-[350px] rounded h-full flex flex-col border-t border-separator">
          <div className="mb-1 bg-white shadow-sm">
            <div className="flex p-4 flex-wrap">
              <div className="flex items-center justify-center font-bold rounded-full w-14 h-14 bg-primarylight font-inter text-primary">
                NT
              </div>
              <div className="flex flex-col justify-center flex-1 pl-3">
                <div className="mb-px font-bold">
                  <Link className="text-primary" to="/">
                    Nguyễn Tài Tuấn
                  </Link>
                </div>
                <div className="text-[15px] font-semibold font-inter">
                  0971021196
                </div>
              </div>
              <div className="flex flex-col items-end w-10 h-10 mt-1 cursor-pointer">
                <EllipsisHorizontalIcon className="w-7" />
              </div>
              <div className="w-full mt-3">
                <span className="bg-primarylight text-primary font-bold text-xs px-3 py-1 rounded">
                  Khách hàng thân thiết
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2.5 py-3 border-t border-separator">
              <div className="flex flex-col items-center">
                <div className="text-sm text-muted2">Ví điện tử</div>
                <div className="font-bold">2.000.000</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-sm text-muted2">Thẻ tiền</div>
                <div className="font-bold">10.000.000</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-sm text-muted2">Công nợ</div>
                <div className="font-bold text-danger">500.000</div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-separator">
              <div className="px-4 font-medium">Cser Hà Nội</div>
              <div className="flex">
                <div className="flex justify-center w-12 h-12 border-l cursor-pointer item-center border-separator text-orange">
                  <QrCodeIcon className="w-7" />
                </div>
                <div className="flex justify-center w-12 h-12 border-l cursor-pointer item-center border-separator text-primary">
                  <ChatBubbleBottomCenterTextIcon className="w-7" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col overflow-auto bg-white rounded shadow-sm grow">
            <div className="flex items-center py-3.5 transition border-b cursor-pointer border-separator hover:text-primary">
              <div className="flex-1 pl-4">
                <div className="mb-px font-medium">Quản lý thẻ dịch vụ</div>
                <div className="text-sm text-muted">
                  Thẻ liệu trình, thẻ bảo hành
                </div>
              </div>
              <div className="flex justify-center w-10 text-muted">
                <ChevronRightIcon className="w-4" />
              </div>
            </div>
            <div className="flex items-center py-3.5 transition border-b cursor-pointer border-separator hover:text-primary">
              <div className="flex-1 pl-4">
                <div className="mb-px font-medium">Đăng ký mới</div>
                <div className="text-sm text-muted">
                  Buổi lẻ, thẻ liệu trình, thẻ tiền, mua sản phẩm
                </div>
              </div>
              <div className="flex justify-center w-10 text-muted">
                <ChevronRightIcon className="w-4" />
              </div>
            </div>
            <div className="flex items-center py-3.5 transition border-b cursor-pointer border-separator hover:text-primary">
              <div className="flex-1 pl-4">
                <div className="mb-px font-medium">Đặt lịch mới</div>
                <div className="text-sm text-muted">
                  Thực hiện đặt lịch mới cho khách hàng
                </div>
              </div>
              <div className="flex justify-center w-10 text-muted">
                <ChevronRightIcon className="w-4" />
              </div>
            </div>
            <div className="flex items-center py-3.5 transition border-b cursor-pointer border-separator hover:text-primary">
              <div className="flex-1 pl-4">
                <div className="mb-px font-medium">Quản lý đặt lịch</div>
              </div>
              <div className="flex justify-center w-10 text-muted">
                <ChevronRightIcon className="w-4" />
              </div>
            </div>
            <div className="flex items-center py-3.5 transition border-b cursor-pointer border-separator hover:text-primary">
              <div className="flex-1 pl-4">
                <div className="mb-px font-medium">Thanh toán nợ</div>
                <div className="text-sm text-muted">
                  Danh sách, sử lý các thanh toán nợ
                </div>
              </div>
              <div className="flex justify-center w-10 text-muted">
                <ChevronRightIcon className="w-4" />
              </div>
            </div>
            <div className="flex items-center py-3.5 transition border-b cursor-pointer border-separator hover:text-primary">
              <div className="flex-1 pl-4">
                <div className="mb-px font-medium">Ví điện tử & Thẻ tiền</div>
                <div className="text-sm text-muted">Quản lý ví & thẻ tiền</div>
              </div>
              <div className="flex justify-center w-10 text-muted">
                <ChevronRightIcon className="w-4" />
              </div>
            </div>
            <div className="flex items-center py-3.5 transition border-b cursor-pointer border-separator hover:text-primary">
              <div className="flex-1 pl-4">
                <div className="mb-px font-medium">Quản lý đơn hàng</div>
              </div>
              <div className="flex justify-center w-10 text-muted">
                <ChevronRightIcon className="w-4" />
              </div>
            </div>
            <div className="flex items-center py-3.5 transition border-b cursor-pointer border-separator hover:text-primary">
              <div className="flex-1 pl-4">
                <div className="mb-px font-medium">Nhật ký & lịch sử</div>
                <div className="text-sm text-muted">
                  Quản lý lịch sử khách hàng
                </div>
              </div>
              <div className="flex justify-center w-10 text-muted">
                <ChevronRightIcon className="w-4" />
              </div>
            </div>
            <div className="flex items-center py-3.5 cursor-pointer">
              <div className="flex-1 pl-4">
                <div className="mb-px font-medium">Tạo thẻ cũ</div>
              </div>
              <div className="flex justify-center w-10 text-muted">
                <ChevronRightIcon className="w-4" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 px-5 pt-4 flex flex-col h-full">
          <div className="mb-5 grow bg-white rounded shadow-sm">
            <div className="px-5 py-4 font-inter uppercase font-bold text-lg border-b border-separator">
              Dịch vụ đang thực hiện
            </div>
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-2 pl-5 flex items-center">
                <div className="w-16 text-muted2 font-semibold uppercase text-[13px] font-inter text-center py-5">
                  Ảnh
                </div>
                <div className="pl-5 py-5 text-muted2 font-semibold uppercase text-[13px] font-inter flex-1">
                  Dịch vụ thực hiện
                </div>
              </div>
              <div className="pl-5 py-5 text-muted2 font-semibold uppercase text-[13px] font-inter flex-1">
                Thời gian
              </div>
              <div className="col-span-2 py-5 text-muted2 font-semibold uppercase text-[13px] font-inter flex-1">
                Nhân viên thực hiện
              </div>
            </div>
            <div>
              {Array(3)
                .fill()
                .map((_, index) => (
                  <div
                    className="grid grid-cols-5 gap-5 border-t border-separator border-dashed cursor-pointer"
                    key={index}
                  >
                    <div className="col-span-2 pl-5 py-5">
                      <div className="flex items-center">
                        <div className="w-16">
                          <img
                            className="w-full h-16 rounded-full object-cover"
                            src="https://cser.vn/Upload/image/2022/12/27/buoi-le-cham-soc-da-co-ban_2022-12-27-142755.jpg"
                            alt=""
                          />
                        </div>
                        <div className="flex-1 pl-4">
                          <div className="font-bold">
                            Chăm sóc da cơ bản trải nghiệm
                          </div>
                          <div className="font-semibold text-muted2 text-sm">
                            Thời gian 90P
                          </div>
                          <div className="font-semibold text-muted2 text-sm">
                            Phụ phí làm ngoài giờ
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="py-5 font-inter text-[15] font-semibold">
                      15:30 22/03/2023
                    </div>
                    <div className="col-span-2 pr-5 py-5 flex">
                      <div className="font-bold">
                        Nguyễn Tài Tuấn - 80.000₫, Nguyễn Lan Anh - 40.000₫,
                        Phạm Trung Hiếu - 60.000₫
                      </div>
                      <div className="w-12 flex justify-end">
                        <ChevronRightIcon className="w-5 text-muted" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="mb-5 bg-white rounded shadow-sm">
            <div className="px-5 py-4 font-inter uppercase font-bold text-lg border-b border-separator">
              Thanh toán nợ
            </div>
            <div className="flex p-5">
              <div className="text-muted2 font-semibold uppercase text-[13px] font-inter w-[100px]">
                ID ĐH
              </div>
              <div className="text-muted2 font-semibold uppercase text-[13px] font-inter w-[170px] pl-5">
                Thời gian
              </div>
              <div className="text-muted2 font-semibold uppercase text-[13px] font-inter pl-5 flex-1">
                Mặt hàng
              </div>
              <div className="text-muted2 font-semibold uppercase text-[13px] font-inter pl-5 flex-1">
                Nhân viên
              </div>
              <div className="text-muted2 font-semibold uppercase text-[13px] font-inter pl-5 w-[125px]">
                Giá trị
              </div>
              <div className="w-12"></div>
            </div>
            <div>
              {Array(2)
                .fill()
                .map((_, index) => (
                  <div
                    className="p-5 border-t border-separator border-dashed cursor-pointer flex"
                    key={index}
                  >
                    <div className="font-bold font-inter w-[100px]">#32857</div>
                    <div className="font-inter font-semibold w-[170px] pl-5">
                      15:30 22/03/2023
                    </div>
                    <div className="font-bold col-span-2 flex-1 pl-5">
                      Thẻ dịch vụ triệt lông, Kem trị nám Body
                    </div>
                    <div className="font-bold flex-1 pl-5">
                      Nguyễn Tài Tuấn - 80.000₫
                    </div>
                    <div className="font-bold pl-5 w-[125px]">200.000.000₫</div>
                    <div className="flex items-center justify-end w-12">
                      <ChevronRightIcon className="w-5 text-muted" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-[370px] pt-4">
        <div className="flex flex-col h-full rounded shahdow-lg">
          <div className="flex justify-between px-5 py-3.5 border-b border-separator bg-white">
            <div className="font-semibold uppercase font-inter">Đơn hàng</div>
            <div className="flex items-center font-semibold cursor-pointer text-primary">
              <PlusIcon className="w-4 mr-1" />
              Thêm mặt hàng
            </div>
          </div>
          <div className="flex flex-col justify-between px-5 py-3.5 grow overflow-auto bg-white">
            <div>
              <div className="flex justify-between mb-4">
                <div className="text-muted2 text-[15px]">Mặt hàng</div>
                <div className="text-muted2 text-[15px]">Thành tiền</div>
              </div>
              <div>
                <div className="text-[15px] flex justify-between pb-3 mb-3 border-b cursor-pointer border-separator">
                  <div>
                    <div className="mb-px font-semibold text-primary">
                      Nước hoa hồng
                    </div>
                    <div className="text-muted">NG 900.000₫</div>
                  </div>
                  <div>
                    <div className="mb-px text-right text-muted2">x2</div>
                    <div>1.800.000₫</div>
                  </div>
                </div>
                <div className="text-[15px] flex items-end justify-between pb-3 mb-3 border-b cursor-pointer border-separator">
                  <div>
                    <div className="mb-px font-semibold text-primary">
                      Chăm sóc da cơ bản trải nghiệm
                    </div>
                    <div className="text-muted2">NG 500.000₫</div>
                  </div>
                  <div>
                    <div className="mb-px text-right text-muted2">x10</div>
                    <div>5.000.000₫</div>
                  </div>
                </div>
                <div className="text-[15px] flex justify-between pb-3 mb-3 cursor-pointer">
                  <div>
                    <div className="mb-px font-semibold text-primary">
                      Thẻ tiền 10 triệu
                    </div>
                    <div className="text-muted2">NG 10.000.000₫</div>
                  </div>
                  <div>
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
          </div>
          <div className="px-5 pt-3.5 py-5 border-t border-separator bg-white">
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
          <div className="pr-5 py-5">
            <Button className="relative flex items-center justify-center w-full h-12 pl-5 pr-10 text-sm font-bold text-white uppercase transition rounded shadow-lg font-inter bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70">
              Khách hàng Check IN
              <ArrowLeftOnRectangleIcon className="absolute w-6 right-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientViews
