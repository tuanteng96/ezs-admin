import {
  ChatBubbleBottomCenterTextIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { formatString } from 'src/_ezs/utils/formatString'
import { useClientView } from '../../ClientViewContext'

const ClientsAside = props => {
  const { pathname } = useLocation()
  const { MemberView } = useClientView()

  return (
    <div className="w-[350px] rounded h-full flex flex-col border-t border-separator dark:border-[#151521] dark:border-l-2 dark:border-t-2">
      <div className="mb-1 bg-white shadow-sm dark:bg-dark-aside">
        <div className="flex flex-wrap p-4">
          <div className="flex items-center justify-center font-bold rounded-full w-14 h-14 bg-primarylight font-inter text-primary">
            {formatString.getLastFirst(MemberView?.FullName)}
          </div>
          <div className="flex flex-col justify-center flex-1 pl-3">
            <div className="mb-px font-bold">
              <Link
                className="text-primary dark:text-white"
                to={'/clients/edit/' + MemberView?.ID}
                state={{
                  previousPath: pathname
                }}
              >
                {MemberView?.FullName}
              </Link>
            </div>
            <div className="text-[15px] font-semibold font-inter dark:text-graydark-900">
              {MemberView?.MobilePhone}
            </div>
          </div>
          <div className="flex flex-col items-end w-10 h-10 mt-1 cursor-pointer dark:text-graydark-800">
            <EllipsisHorizontalIcon className="w-7" />
          </div>
          <div className="w-full mt-3">
            <span className="px-3 py-1 text-xs font-bold rounded bg-primarylight text-primary">
              {MemberView?.GroupNames}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2.5 py-3 border-t border-separator dark:border-dark-separator">
          <Link to="wallet-moneycard" className="flex flex-col items-center">
            <div className="text-sm text-muted2 dark:text-graydark-800">
              Ví điện tử
            </div>
            <div className="font-bold dark:text-white">
              {formatString.formatVND(MemberView?.Present?.nap_vi)}
            </div>
          </Link>
          <Link
            to="wallet-moneycard?type=1"
            className="flex flex-col items-center"
          >
            <div className="text-sm text-muted2 dark:text-graydark-800">
              Thẻ tiền
            </div>
            <div className="font-bold dark:text-white">
              {formatString.formatVND(MemberView?.Present?.the_tien_kha_dung)}
            </div>
          </Link>
          <Link to="pay" className="flex flex-col items-center">
            <div className="text-sm text-muted2 dark:text-graydark-800">
              Công nợ
            </div>
            <div className="font-bold text-danger">
              {formatString.formatVND(MemberView?.Present?.no)}
            </div>
          </Link>
        </div>
        <div className="flex items-center justify-between border-t border-separator dark:border-dark-separator">
          <div className="px-4 font-medium dark:text-white">
            {MemberView?.Stock?.Title}
          </div>
          <div className="flex">
            <div className="flex justify-center w-12 h-12 border-l cursor-pointer item-center border-separator dark:border-dark-separator text-orange">
              <QrCodeIcon className="w-7" />
            </div>
            <div className="flex justify-center w-12 h-12 border-l cursor-pointer item-center border-separator dark:border-dark-separator text-primary">
              <ChatBubbleBottomCenterTextIcon className="w-7" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col overflow-auto bg-white rounded shadow-sm dark:bg-dark-aside grow">
        <div className="flex items-center py-3.5 transition border-b cursor-pointer border-separator dark:border-dark-separator hover:text-primary dark:hover:text-primary dark:text-white">
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
        <div className="flex items-center py-3.5 transition border-b cursor-pointer border-separator dark:text-white dark:border-dark-separator hover:text-primary dark:hover:text-primary">
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
        <Link
          to="/appointments/new"
          className="flex items-center py-3.5 transition border-b cursor-pointer dark:text-white border-separator dark:border-dark-separator hover:text-primary dark:hover:text-primary"
          state={{
            previousPath: pathname,
            formState: {
              MemberIDs: MemberView
            }
          }}
        >
          <div className="flex-1 pl-4">
            <div className="mb-px font-medium">Đặt lịch mới</div>
            <div className="text-sm text-muted">
              Thực hiện đặt lịch mới cho khách hàng
            </div>
          </div>
          <div className="flex justify-center w-10 text-muted">
            <ChevronRightIcon className="w-4" />
          </div>
        </Link>
        <div className="flex items-center py-3.5 transition border-b cursor-pointer dark:text-white border-separator dark:border-dark-separator hover:text-primary dark:hover:text-primary">
          <div className="flex-1 pl-4">
            <div className="mb-px font-medium">Quản lý đặt lịch</div>
            <div className="text-sm text-muted">Quản lý tất cả đặt lịch</div>
          </div>
          <div className="flex justify-center w-10 text-muted">
            <ChevronRightIcon className="w-4" />
          </div>
        </div>
        <Link
          to="pay"
          className="flex items-center dark:text-white py-3.5 transition border-b cursor-pointer border-separator dark:border-dark-separator hover:text-primary dark:hover:text-primary"
        >
          <div className="flex-1 pl-4">
            <div className="mb-px font-medium">Thanh toán nợ</div>
            <div className="text-sm text-muted">
              Danh sách, sử lý các thanh toán nợ
            </div>
          </div>
          <div className="flex justify-center w-10 text-muted">
            <ChevronRightIcon className="w-4" />
          </div>
        </Link>
        <Link
          to="wallet-moneycard"
          className="flex items-center py-3.5 transition border-b cursor-pointer dark:text-white border-separator dark:border-dark-separator hover:text-primary dark:hover:text-primary"
        >
          <div className="flex-1 pl-4">
            <div className="mb-px font-medium">Ví điện tử & Thẻ tiền</div>
            <div className="text-sm text-muted">Quản lý ví & thẻ tiền</div>
          </div>
          <div className="flex justify-center w-10 text-muted">
            <ChevronRightIcon className="w-4" />
          </div>
        </Link>
        <Link
          to="orders"
          className="flex items-center py-3.5 dark:text-white transition border-b cursor-pointer border-separator dark:border-dark-separator hover:text-primary dark:hover:text-primary"
        >
          <div className="flex-1 pl-4">
            <div className="mb-px font-medium">Quản lý đơn hàng</div>
            <div className="text-sm text-muted">Quản lý tất cả đơn hàng</div>
          </div>
          <div className="flex justify-center w-10 text-muted">
            <ChevronRightIcon className="w-4" />
          </div>
        </Link>
        <div className="flex items-center py-3.5 transition border-b dark:text-white cursor-pointer border-separator dark:border-dark-separator hover:text-primary dark:hover:text-primary">
          <div className="flex-1 pl-4">
            <div className="mb-px font-medium">Nhật ký & lịch sử</div>
            <div className="text-sm text-muted">Quản lý lịch sử khách hàng</div>
          </div>
          <div className="flex justify-center w-10 text-muted">
            <ChevronRightIcon className="w-4" />
          </div>
        </div>
        <div className="flex items-center py-3.5 cursor-pointer dark:text-white">
          <div className="flex-1 pl-4">
            <div className="mb-px font-medium">Tạo thẻ cũ</div>
          </div>
          <div className="flex justify-center w-10 text-muted">
            <ChevronRightIcon className="w-4" />
          </div>
        </div>
      </div>
    </div>
  )
}

export { ClientsAside }
