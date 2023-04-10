import { Menu, Transition } from '@headlessui/react'
import {
  ChatBubbleBottomCenterTextIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline'
import React, { Fragment, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { formatString } from 'src/_ezs/utils/formatString'
import { useClientView } from '../../ClientViewContext'
import Text from 'react-texty'
import { toast } from 'react-toastify'

const ClientsAside = props => {
  const { pathname } = useLocation()
  const { MemberView } = useClientView()

  useEffect(() => {
    if (MemberView?.CheckIn?.StockTitle)
      toast.warning(
        'Khách hàng đang Check In tại ' + MemberView?.CheckIn?.StockTitle
      )
  }, [MemberView])

  return (
    <div className="w-[350px] rounded h-full flex flex-col border-t border-separator dark:border-[#151521] dark:border-l-2 dark:border-t-2">
      <div className="mb-1 bg-white shadow-sm dark:bg-dark-aside">
        <div className="flex flex-wrap p-4">
          <Link
            to={'/clients/edit/' + MemberView?.ID}
            state={{
              previousPath: pathname
            }}
            className="flex items-center justify-center font-bold rounded-full w-14 h-14 bg-primarylight font-inter text-primary"
          >
            {formatString.getLastFirst(MemberView?.FullName)}
          </Link>
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
          <Menu as="div" className="relative">
            <Menu.Button className="flex flex-col items-end w-10 h-10 mt-1 cursor-pointer dark:text-graydark-800">
              <EllipsisHorizontalIcon className="w-7" />
            </Menu.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Menu.Items className="z-[1001] rounded px-0 py-2 border-0 w-[200px] bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow absolute left-0 top-3/4">
                <div>
                  <Menu.Item>
                    <Link
                      to={`/clients/edit/${MemberView?.ID}`}
                      state={{ previousPath: pathname }}
                      className="flex items-center px-4 py-3 text-[15px] hover:bg-light dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-dark-gray font-medium"
                    >
                      <div className="flex-1 truncate">Chỉnh sửa thông tin</div>
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <div
                      className="flex items-center px-4 py-3 text-[15px] hover:bg-dangerlight text-danger font-inter transition cursor-pointer font-medium"
                      onClick={() => console.log('Delete')}
                    >
                      <div className="flex-1 truncate">Xóa khách hàng</div>
                    </div>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          {MemberView?.GroupNames && (
            <div className="w-full mt-3">
              <span className="px-3 py-1 text-xs font-bold rounded bg-primarylight text-primary">
                {MemberView?.GroupNames}
              </span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2.5 py-3 border-t border-separator dark:border-dark-separator">
          <Link to="wallet-moneycard" className="flex flex-col items-center">
            <div className="text-sm text-muted2 dark:text-graydark-800">
              Ví điện tử
            </div>
            <div className="font-bold dark:text-white">
              <Text tooltipMaxWidth={280}>
                {formatString.formatVND(MemberView?.Present?.nap_vi)}
              </Text>
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
              <Text tooltipMaxWidth={280}>
                {formatString.formatVND(MemberView?.Present?.the_tien_kha_dung)}
              </Text>
            </div>
          </Link>
          <Link to="pay" className="flex flex-col items-center">
            <div className="text-sm text-muted2 dark:text-graydark-800">
              Công nợ
            </div>
            <div className="font-bold text-danger">
              <Text tooltipMaxWidth={280}>
                {formatString.formatVND(MemberView?.Present?.no)}
              </Text>
            </div>
          </Link>
        </div>
        <div className="flex items-center justify-between border-t border-separator dark:border-dark-separator">
          {MemberView?.CheckIn?.StockTitle ? (
            <div className="flex-1 px-4 font-medium truncate cursor-pointer dark:text-white text-danger animate-blinker">
              <Text tooltipMaxWidth={280}>
                Đang Check In tại {MemberView?.CheckIn?.StockTitle}
              </Text>
            </div>
          ) : (
            <div className="flex-1 px-4 font-medium truncate cursor-pointer dark:text-white">
              <Text tooltipMaxWidth={280}>{MemberView?.Stock?.Title}</Text>
            </div>
          )}
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
