import React, { useState } from 'react'
import { m } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from 'src/_ezs/partials/button'
import { FloatingPortal } from '@floating-ui/react'
import { useQuery } from '@tanstack/react-query'
import ConfigAPI from 'src/_ezs/api/config'
import { toast } from 'react-toastify'

function PickerUserInfo({ children, values }) {
  const [visible, setVisible] = useState(false)
  const [initialValues, setInitialValues] = useState(values)

  const { data } = useQuery({
    queryKey: ['BrandNameInfo'],
    queryFn: async () => {
      let { data } = await ConfigAPI.getName('Bill.Title')
      return data?.data && data?.data.length > 0 ? data?.data[0].Value : null
    },
    enabled: visible
  })

  const onHide = () => {
    setVisible(false)
  }

  const onCopy = () => {
    let textToCopy = `
        Xin Chào, ${initialValues?.FullName}
  Đây là thông tin khởi tạo của bạn, vui lòng lưu trữ trong suốt thời gian bạn làm việc tại ${data}.

  Thông tin đăng nhập của nhân viên ${initialValues?.FullName}
  - Tài khoản: ${initialValues?.UserName}
  - Mật khẩu: 1234 - Hướng dẫn đổi mật khẩu sau đăng nhập tại https://www.youtube.com/shorts/L99SrluxTgc

  B. Cài đặt APP trên Smartphone

  B1. Tải APP IDEZS tại APP STORE hoặc CH PLAY
  B2. Đăng nhập APP với thông tin tên miền là ${window.location.hostname}. Tài khoản & Mật khẩu như trên
  - Trường hợp bạn quên mật khẩu vui lòng liên hệ quản lý để được cấp lại
  - Trường hợp lỗi “Tài khoản đã đăng nhập thiết bị khác” – Vui lòng liên hệ quản lý ( Chỉ cho phép nhân viên đăng nhập trên 1 điện thoại duy nhất. )

  C. Hướng dẫn sử dụng nhanh

  C1. Chấm công hàng ngày (Xem hướng dẫn tại https://www.youtube.com/shorts/PEniXIY5oO4)
  - Bạn cần truy cập wifi quy định tại chi nhánh để chấm công
  - Trường hợp bạn đã truy cập wifi mà vẫn không chấm công được ( chưa cấp quyền định vị ) vui lòng thực hiện theo hướng dẫn IOS (https://www.youtube.com/watch?v=PrTOVNaSLug) hoặc Android (https://www.youtube.com/shorts/xpUHWSMjT6I)
  - Trường hợp bạn sang cơ sở khác hỗ trợ. Xem hướng dẫn chấm công tại cơ sở khác (https://www.youtube.com/shorts/dq1wWq9IG7s)

  C2. Tự quản lý Chấm công, Lương tour, Hoa hồng từ APP
  - Bạn có thể tự mình quản lý chấm công ( giờ đến – giờ về, đi sớm về muộn ), Lương dịch vụ (tour) làm cho khách, hoa hồng tư vấn bán hàng theo từng ngày, cả tháng từ APP (Xem hướng dẫn tại https://www.youtube.com/shorts/rDbtYgMJURE)

  (*) Trường hợp có sai xót vui lòng thông báo ngay với quản lý cơ sở.

  C3. Nhận giao ca dịch vụ ( Nếu bạn là Kỹ thuật viên )
  - Bạn sẽ nhận được thông báo giao ca trên app. Tại đây bạn có thể xem thông tin chi tiết về buổi dịch vụ, thông tin khách hàng, lịch sử mua hàng, sử dụng dịch vụ để trong quá trình làm bạn có thể tư vấn upsale. Kết thúc buổi dịch vụ bạn có thể ghi chú, chụp ảnh thực tế khách hàng từ APP. (Xem hướng dẫn tại https://www.youtube.com/shorts/aqfYwavWN-w)
  `

    const tempInput = document.createElement('textarea')
    tempInput.value = textToCopy
    document.body.appendChild(tempInput)
    tempInput.select()
    document.execCommand('copy')
    document.body.removeChild(tempInput)

    toast.success('Đã Copy thông tin.')
  }

  return (
    <>
      {children({
        open: v => {
          if (v) setInitialValues(v)
          setVisible(true)
        }
      })}
      {visible && (
        <FloatingPortal root={document.body}>
          <div className="fixed inset-0 flex items-center justify-center z-[1003]">
            <m.div
              className="absolute inset-0 bg-black/[.2] dark:bg-black/[.4]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onHide}
            ></m.div>
            <m.div
              className="absolute flex flex-col justify-center h-full py-8 px-4 sm:px-0 w-[500px] max-w-full"
              initial={{ opacity: 0, top: '60%' }}
              animate={{ opacity: 1, top: 'auto' }}
              exit={{ opacity: 0, top: '60%' }}
            >
              <div className="flex flex-col max-h-full bg-white rounded shadow-lg dark:bg-dark-aside">
                <div className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
                  <div className="text-2xl font-bold">Thông tin đăng nhập</div>
                  <div
                    className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                    onClick={onHide}
                  >
                    <XMarkIcon className="w-8" />
                  </div>
                </div>
                <div className="p-5 overflow-auto grow">
                  <div className="mb-1 text-base font-semibold">
                    Xin chào,
                    <span className="pl-1 font-semibold">
                      {initialValues?.FullName}
                    </span>
                  </div>
                  <div className="font-light">
                    Đây là thông tin tài khoản, vui lòng lưu trữ trong suốt thời
                    gian bạn làm việc tại
                    <span className="pl-1 font-semibold text-primary">
                      {data}
                    </span>
                  </div>
                  <div className="mt-4 font-light">
                    <div className="mb-1.5 font-semibold">
                      A. Thông tin đăng nhập của nhân viên
                      <span className="pl-1">{initialValues?.FullName}</span>
                    </div>
                    <div className="mb-px">
                      - Tài khoản
                      <span className="pl-1 font-semibold">
                        {initialValues?.UserName}
                      </span>
                    </div>
                    <div>
                      - Mật khẩu
                      <span className="pl-1 font-semibold">1234</span> - Hướng
                      dẫn đổi mật khẩu sau đăng nhập (
                      <span
                        className="px-1 font-medium cursor-pointer text-primary"
                        onClick={() =>
                          window.top
                            .open(
                              'https://www.youtube.com/shorts/L99SrluxTgc',
                              '_blank'
                            )
                            .focus()
                        }
                      >
                        Xem hướng dẫn
                      </span>
                      )
                    </div>
                  </div>
                  <div className="mt-4 font-light">
                    <div className="mb-2.5 font-semibold">
                      B. Cài đặt APP trên Smartphone
                    </div>
                    <div className="pl-4">
                      <div className="mb-2 last:mb-0">
                        <div class="italic font-medium mb-1.5">
                          B1. Tải APP
                          <span className="px-1 font-semibold text-primary">
                            IDEZS
                          </span>
                          tại <span className="font-semibold">CH PLAY</span>
                          hoặc
                          <span className="pl-1 font-semibold">APP STORE</span>
                        </div>
                      </div>
                      <div className="mb-2 last:mb-0">
                        <div class="italic font-medium mb-1.5">
                          B2. Đăng nhập APP với thông tin tên miền là
                          <span className="px-1 font-semibold text-primary">
                            {window.location.hostname}
                          </span>
                          . Tài khoản & Mật khẩu như trên
                        </div>
                      </div>
                    </div>
                    <div className="mt-1 italic text-muted2">
                      <div className="mb-1">
                        - Trường hợp bạn quên mật khẩu vui lòng liên hệ quản lý
                        để được cấp lại
                      </div>
                      <div>
                        - Trường hợp lỗi “Tài khoản đã đăng nhập thiết bị khác”
                        – Vui lòng liên hệ quản lý ( Chỉ cho phép nhân viên đăng
                        nhập trên 1 điện thoại duy nhất. )
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 font-light">
                    <div className="mb-1.5 font-semibold">
                      C. Hướng dẫn sử dụng nhanh
                    </div>
                    <div className="pl-4">
                      <div className="mb-2 last:mb-0">
                        <div className="italic font-medium mb-1.5">
                          C1. Chấm công hàng ngày (
                          <span
                            className="px-1 font-medium cursor-pointer text-primary"
                            onClick={() =>
                              window.top
                                .open(
                                  'https://www.youtube.com/shorts/PEniXIY5oO4',
                                  '_blank'
                                )
                                .focus()
                            }
                          >
                            Xem hướng dẫn tại đây
                          </span>
                          )
                        </div>
                        <div className="mt-1 italic text-muted2">
                          <div className="mb-1 last:mb-0">
                            - Bạn cần truy cập wifi quy định tại chi nhánh để
                            chấm công
                          </div>
                          <div className="mb-1 last:mb-0">
                            - Trường hợp bạn đã truy cập wifi mà vẫn không chấm
                            công được ( chưa cấp quyền định vị ) vui lòng thực
                            hiện theo hướng dẫn IOS (
                            <span
                              className="px-1 font-medium cursor-pointer text-primary"
                              onClick={() =>
                                window.top
                                  .open(
                                    'https://www.youtube.com/watch?v=PrTOVNaSLug',
                                    '_blank'
                                  )
                                  .focus()
                              }
                            >
                              Xem hướng dẫn
                            </span>
                            ) hoặc Android (
                            <span
                              className="px-1 font-medium cursor-pointer text-primary"
                              onClick={() =>
                                window.top
                                  .open(
                                    'https://www.youtube.com/shorts/xpUHWSMjT6I',
                                    '_blank'
                                  )
                                  .focus()
                              }
                            >
                              Xem hướng dẫn
                            </span>
                            )
                          </div>
                          <div className="mb-1 last:mb-0">
                            - Trường hợp bạn sang cơ sở khác hỗ trợ. Xem hướng
                            dẫn chấm công tại cơ sở khác (
                            <span
                              className="px-1 font-medium cursor-pointer text-primary"
                              onClick={() =>
                                window.top
                                  .open(
                                    'https://www.youtube.com/shorts/dq1wWq9IG7s',
                                    '_blank'
                                  )
                                  .focus()
                              }
                            >
                              Xem hướng dẫn
                            </span>
                            )
                          </div>
                        </div>
                      </div>
                      <div className="mb-2 last:mb-0">
                        <div className="italic font-medium mb-1.5">
                          C2. Tự quản lý Chấm công, Lương tour, Hoa hồng từ APP
                        </div>
                        <div className="mb-2">
                          - Bạn có thể tự mình quản lý chấm công ( giờ đến – giờ
                          về, đi sớm về muộn ), Lương dịch vụ (tour) làm cho
                          khách, hoa hồng tư vấn bán hàng theo từng ngày, cả
                          tháng từ APP (
                          <span
                            className="px-1 font-medium cursor-pointer text-primary"
                            onClick={() =>
                              window.top
                                .open(
                                  'https://www.youtube.com/shorts/rDbtYgMJURE',
                                  '_blank'
                                )
                                .focus()
                            }
                          >
                            Xem hướng dẫn
                          </span>
                          )
                        </div>
                        <div className="text-sm italic text-danger">
                          (*) Trường hợp có sai xót vui lòng thông báo ngay với
                          quản lý cơ sở.
                        </div>
                      </div>
                      <div className="mb-2 last:mb-0">
                        <div className="italic font-medium mb-1.5">
                          C3. Nhận giao ca dịch vụ ( Nếu bạn là Kỹ thuật viên )
                        </div>
                        <div className="mb-2">
                          - Bạn sẽ nhận được thông báo giao ca trên app. Tại đây
                          bạn có thể xem thông tin chi tiết về buổi dịch vụ,
                          thông tin khách hàng, lịch sử mua hàng, sử dụng dịch
                          vụ để trong quá trình làm bạn có thể tư vấn upsale.
                          Kết thúc buổi dịch vụ bạn có thể ghi chú, chụp ảnh
                          thực tế khách hàng từ APP. (
                          <span
                            className="px-1 font-medium cursor-pointer text-primary"
                            onClick={() =>
                              window.top
                                .open(
                                  'https://www.youtube.com/shorts/aqfYwavWN-w',
                                  '_blank'
                                )
                                .focus()
                            }
                          >
                            Xem hướng dẫn
                          </span>
                          )
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 p-5 border-t border-separator dark:border-dark-separator">
                  <Button
                    onClick={onCopy}
                    type="button"
                    className="relative flex items-center px-4 font-medium text-white transition border rounded shadow-lg hover:bg-primaryhv bg-primary border-primary dark:border-gray-700 h-11 hover:border-primaryhv focus:outline-none focus:shadow-none"
                  >
                    Copy thông tin
                  </Button>
                  <Button
                    onClick={onHide}
                    type="button"
                    className="relative flex items-center px-4 font-medium transition border border-gray-300 rounded shadow-lg dark:border-gray-700 h-11 hover:border-gray-800 focus:outline-none focus:shadow-none"
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            </m.div>
          </div>
        </FloatingPortal>
      )}
    </>
  )
}

export default PickerUserInfo
