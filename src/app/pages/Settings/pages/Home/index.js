import { ChevronRightIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SEO } from 'src/_ezs/core/SEO'

function Home(props) {
  const { pathname } = useLocation()

  return (
    <>
      <SEO title="Cài đặt" />
      <div className="w-full max-w-screen-xl py-10 m-auto">
        <div>
          <div className="text-3xl font-extrabold">Cài đặt</div>
          <div className="mt-2">Quản lý tất cả mọi cài đặt của bạn tại đây</div>
        </div>
        <div className="inline-grid grid-cols-2 gap-5 mt-6">
          <div>
            <div className="mb-5 bg-white border rounded-2xl border-separator last:mb-5">
              <div className="py-5 text-xl font-extrabold px-7">
                Thiết lập tài khoản
              </div>
              <div>
                <Link className="relative block py-5 transition border-b border-separator last:border-0 px-7 hover:bg-light">
                  <div className="text-[17px] font-bold mb-1">
                    Chi tiết doanh nghiệp
                  </div>
                  <div className="text-muted2 text-[15px] pr-5">
                    Quản lý cài đặt như doanh nghiệp và múi giờ của bạn
                  </div>
                  <ChevronRightIcon className="absolute w-5 right-4 top-2/4 -translate-y-2/4" />
                </Link>
                <Link className="relative block py-5 transition border-b border-separator px-7 last:border-0 hover:bg-light">
                  <div className="text-[17px] font-bold mb-1">Vị trí</div>
                  <div className="text-muted2 text-[15px] pr-5">
                    Quản lý nhiều cửa hàng cho doanh nghiệp của bạn
                  </div>
                  <ChevronRightIcon className="absolute w-5 right-4 top-2/4 -translate-y-2/4" />
                </Link>
                <Link className="relative block py-5 transition border-b border-separator px-7 last:border-0 hover:bg-light">
                  <div className="text-[17px] font-bold mb-1">
                    Đặt phòng trực tuyến
                  </div>
                  <div className="text-muted2 text-[15px] pr-5">
                    Điều chỉnh thông tin doanh nghiệp và hình ảnh hồ sơ của bạn
                    được hiển thị trực tuyến
                  </div>
                  <ChevronRightIcon className="absolute w-5 right-4 top-2/4 -translate-y-2/4" />
                </Link>
                <Link className="relative block py-5 transition border-b border-separator px-7 last:border-0 hover:bg-light">
                  <div className="text-[17px] font-bold mb-1">Tài nguyên</div>
                  <div className="text-muted2 text-[15px] pr-5">
                    Thiết lập các tài nguyên có thể đặt trước như phòng và thiết
                    bị, chỉ định chúng cho các dịch vụ
                  </div>
                  <ChevronRightIcon className="absolute w-5 right-4 top-2/4 -translate-y-2/4" />
                </Link>
              </div>
            </div>
            <div className="mb-5 bg-white border rounded-2xl border-separator last:mb-5">
              <div className="py-5 text-xl font-extrabold px-7">Dịch vụ</div>
              <div>
                <Link className="relative block py-5 transition border-b border-separator last:border-0 px-7 hover:bg-light">
                  <div className="text-[17px] font-bold mb-1">
                    Quản lý dịch vụ
                  </div>
                  <div className="text-muted2 text-[15px] pr-5">
                    Thêm, sửa và xóa các loại dịch vụ có sẵn để đặt lịch hẹn
                  </div>
                  <ChevronRightIcon className="absolute w-5 right-4 top-2/4 -translate-y-2/4" />
                </Link>
                <Link className="relative block py-5 transition border-b border-separator px-7 last:border-0 hover:bg-light">
                  <div className="text-[17px] font-bold mb-1">
                    Voucher - Coupon
                  </div>
                  <div className="text-muted2 text-[15px] pr-5">
                    Thêm, sửa, xóa các loại Voucher đang bán
                  </div>
                  <ChevronRightIcon className="absolute w-5 right-4 top-2/4 -translate-y-2/4" />
                </Link>
                <Link className="relative block py-5 transition border-b border-separator px-7 last:border-0 hover:bg-light">
                  <div className="text-[17px] font-bold mb-1">
                    Đặt phòng trực tuyến
                  </div>
                  <div className="text-muted2 text-[15px] pr-5">
                    Điều chỉnh thông tin doanh nghiệp và hình ảnh hồ sơ của bạn
                    được hiển thị trực tuyến
                  </div>
                  <ChevronRightIcon className="absolute w-5 right-4 top-2/4 -translate-y-2/4" />
                </Link>
                <Link className="relative block py-5 transition border-b border-separator px-7 last:border-0 hover:bg-light">
                  <div className="text-[17px] font-bold mb-1">Tài nguyên</div>
                  <div className="text-muted2 text-[15px] pr-5">
                    Thiết lập các tài nguyên có thể đặt trước như phòng và thiết
                    bị, chỉ định chúng cho các dịch vụ
                  </div>
                  <ChevronRightIcon className="absolute w-5 right-4 top-2/4 -translate-y-2/4" />
                </Link>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-5 bg-white border last:mb-0 rounded-2xl border-separator">
              <div className="py-5 text-xl font-extrabold px-7">Nhân viên</div>
              <div>
                <Link className="relative block py-5 transition border-b border-separator last:border-0 px-7 hover:bg-light">
                  <div className="text-[17px] font-bold mb-1">
                    Thành viên của nhóm
                  </div>
                  <div className="text-muted2 text-[15px] pr-5">
                    Thêm, chỉnh sửa và xóa các thành viên trong nhóm của bạn
                  </div>
                  <ChevronRightIcon className="absolute w-5 right-4 top-2/4 -translate-y-2/4" />
                </Link>
                <Link className="relative block py-5 transition border-b border-separator px-7 last:border-0 hover:bg-light">
                  <div className="text-[17px] font-bold mb-1">Giờ làm việc</div>
                  <div className="text-muted2 text-[15px] pr-5">
                    Quản lý giờ làm việc của các thành viên trong nhóm của bạn
                  </div>
                  <ChevronRightIcon className="absolute w-5 right-4 top-2/4 -translate-y-2/4" />
                </Link>
                <Link
                  to={pathname + '/sales-kpi'}
                  className="relative block py-5 transition border-b border-separator px-7 last:border-0 hover:bg-light"
                >
                  <div className="text-[17px] font-bold mb-1">KPI Doanh số</div>
                  <div className="text-muted2 text-[15px] pr-5">
                    Thiết lập tính hoa hồng cho các thành viên trong nhóm
                  </div>
                  <ChevronRightIcon className="absolute w-5 right-4 top-2/4 -translate-y-2/4" />
                </Link>
              </div>
            </div>
            <div className="mb-5 bg-white border last:mb-0 rounded-2xl border-separator">
              <div className="py-5 text-xl font-extrabold px-7">Khách hàng</div>
              <div>
                <Link className="relative block py-5 transition border-b border-separator last:border-0 px-7 hover:bg-light">
                  <div className="text-[17px] font-bold mb-1">
                    Thông báo khách hàng
                  </div>
                  <div className="text-muted2 text-[15px] pr-5">
                    Xem lại các tin nhắn đã gửi cho khách hàng về các cuộc hẹn
                    của họ
                  </div>
                  <ChevronRightIcon className="absolute w-5 right-4 top-2/4 -translate-y-2/4" />
                </Link>
                <Link className="relative block py-5 transition border-b border-separator px-7 last:border-0 hover:bg-light">
                  <div className="text-[17px] font-bold mb-1">
                    Nguồn giới thiệu
                  </div>
                  <div className="text-muted2 text-[15px] pr-5">
                    Thiết lập các nguồn tùy chỉnh để theo dõi cách khách hàng
                    tìm thấy doanh nghiệp của bạn
                  </div>
                  <ChevronRightIcon className="absolute w-5 right-4 top-2/4 -translate-y-2/4" />
                </Link>
                <Link className="relative block py-5 transition border-b border-separator px-7 last:border-0 hover:bg-light">
                  <div className="text-[17px] font-bold mb-1">Lý do hủy bỏ</div>
                  <div className="text-muted2 text-[15px] pr-5">
                    Theo dõi lý do tại sao khách hàng không đến cuộc hẹn của họ
                  </div>
                  <ChevronRightIcon className="absolute w-5 right-4 top-2/4 -translate-y-2/4" />
                </Link>
              </div>
            </div>
            <div className="mb-5 bg-white border rounded-2xl border-separator last:mb-0">
              <div className="py-5 text-xl font-extrabold px-7">
                Việc bán hàng
              </div>
              <div>
                <Link className="relative block py-5 transition border-b border-separator last:border-0 px-7 hover:bg-light">
                  <div className="text-[17px] font-bold mb-1">
                    Trình tự biên dịch
                  </div>
                  <div className="text-muted2 text-[15px] pr-5">
                    Định cấu hình chi tiết được hiển thị trên biên lai bán hàng
                    được cấp cho khách hàng của bạn
                  </div>
                  <ChevronRightIcon className="absolute w-5 right-4 top-2/4 -translate-y-2/4" />
                </Link>
                <Link className="relative block py-5 transition border-b border-separator px-7 last:border-0 hover:bg-light">
                  <div className="text-[17px] font-bold mb-1">
                    Mẫu phiếu thu
                  </div>
                  <div className="text-muted2 text-[15px] pr-5">
                    Định cấu hình chi tiết được hiển thị trên biên lai bán hàng
                    được cấp cho khách hàng của bạn
                  </div>
                  <ChevronRightIcon className="absolute w-5 right-4 top-2/4 -translate-y-2/4" />
                </Link>
                <Link className="relative block py-5 transition border-b border-separator px-7 last:border-0 hover:bg-light">
                  <div className="text-[17px] font-bold mb-1">Thuế</div>
                  <div className="text-muted2 text-[15px] pr-5">
                    Quản lý thuế suất áp dụng cho các mặt hàng được bán khi
                    thanh toán
                  </div>
                  <ChevronRightIcon className="absolute w-5 right-4 top-2/4 -translate-y-2/4" />
                </Link>
                <Link className="relative block py-5 transition border-b border-separator px-7 last:border-0 hover:bg-light">
                  <div className="text-[17px] font-bold mb-1">Phí dịch vụ</div>
                  <div className="text-muted2 text-[15px] pr-5">
                    Quản lý mọi khoản phí bổ sung áp dụng cho các dịch vụ và mặt
                    hàng được bán khi thanh toán.
                  </div>
                  <ChevronRightIcon className="absolute w-5 right-4 top-2/4 -translate-y-2/4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
